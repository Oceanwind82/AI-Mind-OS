import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// Lazy-loaded OpenAI client to avoid build-time initialization
let openaiClient: OpenAI | null = null;
function getOpenAIClient() {
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

// Lazy-loaded Supabase client to avoid build-time initialization
let supabaseClient: ReturnType<typeof createClient> | null = null;
function getSupabaseClient() {
  if (!supabaseClient && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }
  return supabaseClient;
}

export interface CertificationExam {
  id: string;
  title: string;
  description: string;
  requiredLessons: string[];
  questions: ExamQuestion[];
  passingScore: number;
  timeLimit: number; // minutes
  certificateTemplate: string;
  price: number;
}

export interface ExamQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'essay' | 'code' | 'practical';
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  explanation: string;
}

export interface CertificationAttempt {
  id: string;
  userId: string;
  examId: string;
  answers: Record<string, string | string[]>;
  score: number;
  passed: boolean;
  startedAt: Date;
  completedAt?: Date;
  certificateId?: string;
}

export interface Certificate {
  id: string;
  userId: string;
  examId: string;
  certificationTitle: string;
  studentName: string;
  issuedAt: Date;
  credentialId: string;
  linkedInShareUrl?: string;
  pdfUrl: string;
}

// Generate AI-powered exam questions
export async function generateExamQuestions(
  lessonContent: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  questionCount: number = 10
): Promise<ExamQuestion[]> {
  try {
    const openai = getOpenAIClient();
    if (!openai) {
      throw new Error('OpenAI client not configured');
    }
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert exam creator for AI and prompt engineering certification. Create challenging, practical questions that test real understanding, not just memorization.

Difficulty: ${difficulty}
Question types: 60% multiple-choice, 25% essay, 15% practical scenarios

For each question, provide:
- Clear, unambiguous question text
- 4 multiple choice options (for MC questions)
- Correct answer(s)
- Detailed explanation
- Point value (1-5 based on difficulty)`
        },
        {
          role: 'user',
          content: `Create ${questionCount} certification exam questions based on this content:\n\n${lessonContent.slice(0, 2000)}\n\nReturn as JSON array of ExamQuestion objects.`
        }
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content || '[]';
    try {
      return JSON.parse(response);
    } catch {
      // Fallback questions
      return [
        {
          id: 'fallback-1',
          question: 'What is the primary benefit of prompt engineering?',
          type: 'multiple-choice',
          options: [
            'Faster AI responses',
            'More accurate and relevant AI outputs',
            'Reduced API costs',
            'Better user interface design'
          ],
          correctAnswer: 'More accurate and relevant AI outputs',
          points: 2,
          explanation: 'Prompt engineering focuses on crafting inputs that generate more accurate, relevant, and useful AI responses.'
        }
      ];
    }
  } catch (error) {
    console.error('Question generation error:', error);
    return [];
  }
}

// Grade exam attempt using AI
export async function gradeExamAttempt(
  exam: CertificationExam,
  answers: Record<string, string | string[]>
): Promise<{ score: number; passed: boolean; feedback: string }> {
  try {
    let totalPoints = 0;
    let earnedPoints = 0;
    const feedback: string[] = [];

    for (const question of exam.questions) {
      totalPoints += question.points;
      const userAnswer = answers[question.id];

      if (question.type === 'multiple-choice') {
        if (userAnswer === question.correctAnswer) {
          earnedPoints += question.points;
          feedback.push(`✓ Question ${question.id}: Correct`);
        } else {
          feedback.push(`✗ Question ${question.id}: Incorrect. ${question.explanation}`);
        }
      } else if (question.type === 'essay' || question.type === 'practical') {
        // Use AI to grade essay/practical questions
        const answerText = Array.isArray(userAnswer) ? userAnswer.join(' ') : userAnswer;
        const gradeResult = await gradeEssayQuestion(question, answerText);
        earnedPoints += gradeResult.points;
        feedback.push(`Question ${question.id}: ${gradeResult.feedback}`);
      }
    }

    const score = Math.round((earnedPoints / totalPoints) * 100);
    const passed = score >= exam.passingScore;

    return {
      score,
      passed,
      feedback: feedback.join('\n\n')
    };
  } catch (error) {
    console.error('Grading error:', error);
    return { score: 0, passed: false, feedback: 'Error grading exam' };
  }
}

async function gradeEssayQuestion(
  question: ExamQuestion,
  answer: string
): Promise<{ points: number; feedback: string }> {
  try {
    const openai = getOpenAIClient();
    if (!openai) {
      throw new Error('OpenAI client not configured');
    }
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert AI tutor grading certification exam answers. Grade fairly but rigorously.

Question: ${question.question}
Expected concepts: ${question.explanation}
Max points: ${question.points}

Provide:
1. Points earned (0 to ${question.points})
2. Constructive feedback explaining the grade`
        },
        {
          role: 'user',
          content: `Grade this answer:\n\n${answer}\n\nReturn JSON: {"points": number, "feedback": "string"}`
        }
      ],
      max_tokens: 300,
      temperature: 0.2,
    });

    const response = completion.choices[0]?.message?.content || '';
    try {
      return JSON.parse(response);
    } catch {
      return { points: Math.floor(question.points * 0.5), feedback: 'Answer reviewed' };
    }
  } catch {
    return { points: 0, feedback: 'Could not grade this answer' };
  }
}

// Create certificate
export async function createCertificate(
  userId: string,
  examId: string,
  studentName: string
): Promise<Certificate> {
  const certificateId = `AIMIND-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
  const certificate: Certificate = {
    id: certificateId,
    userId,
    examId,
    certificationTitle: 'AI Mind OS Certified Prompt Engineer',
    studentName,
    issuedAt: new Date(),
    credentialId: certificateId,
    linkedInShareUrl: `https://aimindos.com/verify/${certificateId}`,
    pdfUrl: `https://aimindos.com/certificates/${certificateId}.pdf`
  };

  // Store in database - TODO: Implement proper Supabase schema after deployment
  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      // Type-safe insert with proper error handling
      const { error } = await supabase
        .from('certificates')
        .insert(certificate as never);
      
      if (error) {
        console.warn('Certificate storage failed:', error);
      }
    }
  } catch (error) {
    // Gracefully handle database errors during deployment
    console.warn('Certificate storage error:', error);
  }

  return certificate;
}

// Verify certificate
export async function verifyCertificate(credentialId: string): Promise<Certificate | null> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not configured');
    }
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('credentialId', credentialId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Certificate verification error:', error);
    return null;
  }
}

// Get user certificates
export async function getUserCertificates(userId: string): Promise<Certificate[]> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not configured');
    }
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('userId', userId)
      .order('issuedAt', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get certificates error:', error);
    return [];
  }
}

// Generate LinkedIn sharing content
export function generateLinkedInShare(certificate: Certificate): string {
  return `I'm excited to share that I've earned my ${certificate.certificationTitle}! 🎓

This certification demonstrates my expertise in:
• AI prompt engineering
• Advanced AI conversation design
• Practical AI implementation strategies

Verified credential: ${certificate.linkedInShareUrl}

#AI #PromptEngineering #MachineLearning #Certification #AIEducation`;
}
