import OpenAI from 'openai';
import { ragVectorSearch, RAGResponse } from './rag-vector-search';

// Initialize OpenAI client with environment safety
const openai = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here'
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

// Helper function to check OpenAI availability
function checkOpenAI(): OpenAI {
  if (!openai) {
    throw new Error('OpenAI client not initialized. Please configure OPENAI_API_KEY.');
  }
  return openai;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LessonContext {
  lessonTitle: string;
  sectionTitle: string;
  sectionContent: string;
  lessonSlug: string;
}

export interface ExamQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'essay' | 'practical';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  explanation: string;
}

export interface MultiLanguageSupport {
  language: 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'pt' | 'it';
  region?: string;
  rtl?: boolean;
}

export interface LocalizedLessonContext extends LessonContext {
  language: MultiLanguageSupport['language'];
  culturalContext?: string;
}

// Generate contextual system prompt for lesson AI assistant
function createSystemPrompt(context: LessonContext): string {
  return `You are an expert AI tutor helping students learn about AI and prompt engineering. 

Current Context:
- Lesson: "${context.lessonTitle}"
- Section: "${context.sectionTitle}"
- Student is learning: ${context.sectionContent.slice(0, 200)}...

Your role:
- Answer questions about this specific lesson section
- Provide clear, actionable explanations
- Use examples relevant to AI/prompt engineering
- Keep responses concise but thorough
- Encourage further learning

Tone: Helpful, encouraging, and professional. Make complex concepts accessible.`;
}

// Multi-language system prompt generator
function createMultiLanguageSystemPrompt(context: LocalizedLessonContext): string {
  const languageSettings = {
    en: { name: 'English', formality: 'professional', examples: 'business scenarios' },
    es: { name: 'Spanish', formality: 'respectful', examples: 'business and academic contexts' },
    fr: { name: 'French', formality: 'formal', examples: 'professional and educational settings' },
    de: { name: 'German', formality: 'structured', examples: 'technical and business applications' },
    ja: { name: 'Japanese', formality: 'respectful', examples: 'business and technology contexts' },
    zh: { name: 'Chinese', formality: 'respectful', examples: 'business and educational scenarios' },
    pt: { name: 'Portuguese', formality: 'warm', examples: 'business and educational contexts' },
    it: { name: 'Italian', formality: 'expressive', examples: 'creative and business applications' }
  };

  const lang = languageSettings[context.language];
  const culturalNote = context.culturalContext ? `\nCultural context: ${context.culturalContext}` : '';

  return `You are an expert AI tutor helping students learn about AI and prompt engineering. Respond in ${lang.name} with a ${lang.formality} tone.

Current Context:
- Lesson: "${context.lessonTitle}"
- Section: "${context.sectionTitle}"
- Student is learning: ${context.sectionContent.slice(0, 200)}...
- Language: ${lang.name}${culturalNote}

Your role:
- Answer questions about this specific lesson section in fluent ${lang.name}
- Provide clear, actionable explanations appropriate for ${lang.name} speakers
- Use examples relevant to ${lang.examples}
- Keep responses concise but thorough
- Encourage further learning with culturally appropriate motivation
- Adapt technical terms appropriately for ${lang.name} context

Tone: Helpful, encouraging, and professional. Make complex AI concepts accessible in ${lang.name}.`;
}

// Generate AI response for lesson questions
export async function generateLessonResponse(
  userQuestion: string,
  context: LessonContext,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    if (!openai) {
      return 'AI assistant is currently unavailable. Please configure OpenAI API key.';
    }

    const systemPrompt = createSystemPrompt(context);
    
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userQuestion }
    ];

    const completion = await checkOpenAI().chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.';
  }
}

// Generate multi-language AI response
export async function generateMultiLanguageLessonResponse(
  userQuestion: string,
  context: LocalizedLessonContext,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    const client = checkOpenAI();
    const systemPrompt = createMultiLanguageSystemPrompt(context);
    
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userQuestion }
    ];

    const completion = await client.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      max_tokens: 600,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || getLocalizedErrorMessage(context.language);
  } catch (error) {
    console.error('Multi-language OpenAI API Error:', error);
    return getLocalizedErrorMessage(context.language, 'connection');
  }
}

// Localized error messages
function getLocalizedErrorMessage(language: MultiLanguageSupport['language'], type: 'general' | 'connection' = 'general'): string {
  const errors = {
    en: {
      general: 'I apologize, but I encountered an error. Please try again.',
      connection: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.'
    },
    es: {
      general: 'Lo siento, pero encontré un error. Por favor, inténtalo de nuevo.',
      connection: 'Lo siento, pero tengo problemas de conexión ahora mismo. Por favor, inténtalo en un momento.'
    },
    fr: {
      general: 'Je m\'excuse, mais j\'ai rencontré une erreur. Veuillez réessayer.',
      connection: 'Je m\'excuse, mais j\'ai des difficultés de connexion en ce moment. Veuillez réessayer dans un moment.'
    },
    de: {
      general: 'Entschuldigung, aber ich bin auf einen Fehler gestoßen. Bitte versuchen Sie es erneut.',
      connection: 'Entschuldigung, aber ich habe momentan Verbindungsprobleme. Bitte versuchen Sie es in einem Moment erneut.'
    },
    ja: {
      general: '申し訳ございませんが、エラーが発生しました。もう一度お試しください。',
      connection: '申し訳ございませんが、現在接続に問題があります。少々お待ちいただいてから再度お試しください。'
    },
    zh: {
      general: '很抱歉，我遇到了一个错误。请再试一次。',
      connection: '很抱歉，我现在连接有问题。请稍等片刻再试。'
    },
    pt: {
      general: 'Peço desculpas, mas encontrei um erro. Por favor, tente novamente.',
      connection: 'Peço desculpas, mas estou com problemas de conexão agora. Por favor, tente novamente em um momento.'
    },
    it: {
      general: 'Mi scuso, ma ho riscontrato un errore. Per favore, riprova.',
      connection: 'Mi scuso, ma sto avendo problemi di connessione ora. Per favore, riprova tra un momento.'
    }
  };

  return errors[language][type];
}

// Generate lesson summary
export async function generateLessonSummary(
  lessonTitle: string,
  allSections: { title: string; content: string }[]
): Promise<string> {
  try {
    const contentOverview = allSections
      .map(section => `**${section.title}**: ${section.content.slice(0, 150)}...`)
      .join('\n\n');

    const completion = await checkOpenAI().chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at creating concise, actionable lesson summaries for AI education content. Create bullet-point summaries that highlight key takeaways and actionable insights.'
        },
        {
          role: 'user',
          content: `Create a comprehensive summary of this lesson "${lessonTitle}":\n\n${contentOverview}\n\nFormat as bullet points with key takeaways and actionable insights.`
        }
      ],
      max_tokens: 300,
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content || 'Summary unavailable at the moment.';
  } catch (error) {
    console.error('Summary generation error:', error);
    return 'Summary unavailable at the moment.';
  }
}

// Generate follow-up questions
export async function generateFollowUpQuestions(
  sectionTitle: string,
  sectionContent: string
): Promise<string[]> {
  try {
    const completion = await checkOpenAI().chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Generate 3 thoughtful follow-up questions that encourage deeper thinking about the topic. Questions should be practical and help the learner apply the concepts.'
        },
        {
          role: 'user',
          content: `Based on this lesson section "${sectionTitle}":\n\n${sectionContent.slice(0, 500)}\n\nGenerate 3 follow-up questions as a JSON array of strings.`
        }
      ],
      max_tokens: 200,
      temperature: 0.6,
    });

    const response = completion.choices[0]?.message?.content || '[]';
    try {
      return JSON.parse(response);
    } catch {
      // Fallback if JSON parsing fails
      return [
        "How could you apply this concept in your current work?",
        "What questions do you still have about this topic?",
        "Can you think of a real-world example of this concept?"
      ];
    }
  } catch (error) {
    console.error('Follow-up questions error:', error);
    return [
      "How could you apply this concept in your current work?",
      "What questions do you still have about this topic?",
      "Can you think of a real-world example of this concept?"
    ];
  }
}

// Enhanced AI function for certification exam creation
export async function generateCertificationExam(
  lessonContent: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate',
  questionCount: number = 10
): Promise<ExamQuestion[]> {
  try {
    const completion = await checkOpenAI().chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert certification exam creator for AI and prompt engineering. Create challenging, practical questions that test real understanding, not just memorization.

Difficulty: ${difficulty}
Question Distribution:
- 60% Multiple Choice (4 options each)
- 25% Short Essay (2-3 sentences)
- 15% Practical Scenarios

For each question, provide:
- Unique ID
- Clear question text
- Type (multiple-choice, essay, practical)
- Options (for MC)
- Correct answer(s)
- Point value (1-5)
- Detailed explanation

Focus on:
- Real-world application
- Critical thinking
- Problem-solving
- Best practices
- Common pitfalls

Return as valid JSON array.`
        },
        {
          role: 'user',
          content: `Create ${questionCount} certification exam questions based on this AI/Prompt Engineering content:\n\n${lessonContent.slice(0, 3000)}`
        }
      ],
      max_tokens: 3000,
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content || '[]';
    try {
      return JSON.parse(response);
    } catch {
      // Fallback questions for AI Mind OS
      return [
        {
          id: 'aimind-001',
          question: 'What is the most critical factor in creating effective AI prompts?',
          type: 'multiple-choice',
          options: [
            'Using complex technical language',
            'Providing clear, specific context and instructions',
            'Making prompts as short as possible',
            'Always asking for JSON responses'
          ],
          correctAnswer: 'Providing clear, specific context and instructions',
          points: 3,
          explanation: 'Effective prompts require clear context and specific instructions to guide the AI toward the desired output.'
        },
        {
          id: 'aimind-002',
          question: 'Explain how temperature settings affect AI response creativity and consistency.',
          type: 'essay',
          correctAnswer: 'Temperature controls randomness - lower values (0.1-0.3) produce consistent, focused responses while higher values (0.7-1.0) increase creativity and variation.',
          points: 4,
          explanation: 'Temperature is a key parameter that balances creativity with reliability in AI responses.'
        },
        {
          id: 'aimind-003',
          question: 'A client wants an AI to generate marketing copy that sounds "human but professional." Design a prompt strategy.',
          type: 'practical',
          correctAnswer: 'Use role-based prompts with tone specification, examples, and context about target audience and brand voice.',
          points: 5,
          explanation: 'Practical prompt engineering requires understanding business needs and translating them into effective AI instructions.'
        }
      ];
    }
  } catch (error) {
    console.error('Certification exam generation error:', error);
    return [];
  }
}

// Translate lesson content
export async function translateLessonContent(
  content: string,
  targetLanguage: MultiLanguageSupport['language'],
  contentType: 'lesson' | 'summary' | 'question' = 'lesson'
): Promise<string> {
  try {
    const languageNames = {
      en: 'English',
      es: 'Spanish',
      fr: 'French', 
      de: 'German',
      ja: 'Japanese',
      zh: 'Chinese (Simplified)',
      pt: 'Portuguese',
      it: 'Italian'
    };

    const completion = await checkOpenAI().chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert translator specializing in AI and technical education content. Translate the following ${contentType} content to ${languageNames[targetLanguage]}.

Guidelines:
- Maintain technical accuracy
- Adapt examples to be culturally relevant
- Keep the educational tone and structure
- Preserve formatting (markdown, bullet points, etc.)
- Use appropriate technical terminology for ${languageNames[targetLanguage]}
- Ensure the translation flows naturally for native speakers

Focus on educational clarity and cultural appropriateness.`
        },
        {
          role: 'user',
          content: `Translate this ${contentType} content to ${languageNames[targetLanguage]}:\n\n${content}`
        }
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content || content;
  } catch (error) {
    console.error('Translation error:', error);
    return content; // Return original content if translation fails
  }
}

// Generate localized certification exams
export async function generateLocalizedCertificationExam(
  lessonContent: string,
  language: MultiLanguageSupport['language'],
  difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate',
  questionCount: number = 10
): Promise<ExamQuestion[]> {
  try {
    const languageNames = {
      en: 'English',
      es: 'Spanish',
      fr: 'French',
      de: 'German', 
      ja: 'Japanese',
      zh: 'Chinese',
      pt: 'Portuguese',
      it: 'Italian'
    };

    const completion = await checkOpenAI().chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert certification exam creator for AI and prompt engineering. Create challenging, practical questions in ${languageNames[language]} that test real understanding.

Language: ${languageNames[language]}
Difficulty: ${difficulty}
Question Distribution:
- 60% Multiple Choice (4 options each)
- 25% Short Essay (2-3 sentences)
- 15% Practical Scenarios

For each question, provide:
- Unique ID
- Clear question text in ${languageNames[language]}
- Type (multiple-choice, essay, practical)
- Options (for MC) in ${languageNames[language]}
- Correct answer(s) in ${languageNames[language]}
- Point value (1-5)
- Detailed explanation in ${languageNames[language]}

Cultural considerations:
- Use examples relevant to ${languageNames[language]}-speaking regions
- Adapt business scenarios appropriately
- Ensure technical terms are properly localized

Return as valid JSON array with all text in ${languageNames[language]}.`
        },
        {
          role: 'user',
          content: `Create ${questionCount} certification exam questions in ${languageNames[language]} based on this AI/Prompt Engineering content:\n\n${lessonContent.slice(0, 3000)}`
        }
      ],
      max_tokens: 3500,
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content || '[]';
    try {
      return JSON.parse(response);
    } catch {
      // Return localized fallback questions
      return getLocalizedFallbackQuestions(language);
    }
  } catch (error) {
    console.error('Localized exam generation error:', error);
    return getLocalizedFallbackQuestions(language);
  }
}

// Fallback questions for different languages
function getLocalizedFallbackQuestions(language: MultiLanguageSupport['language']): ExamQuestion[] {
  const questions = {
    en: [
      {
        id: 'aimind-en-001',
        question: 'What is the most critical factor in creating effective AI prompts?',
        type: 'multiple-choice' as const,
        options: [
          'Using complex technical language',
          'Providing clear, specific context and instructions',
          'Making prompts as short as possible',
          'Always asking for JSON responses'
        ],
        correctAnswer: 'Providing clear, specific context and instructions',
        points: 3,
        explanation: 'Effective prompts require clear context and specific instructions to guide the AI toward the desired output.'
      }
    ],
    es: [
      {
        id: 'aimind-es-001',
        question: '¿Cuál es el factor más crítico para crear prompts de IA efectivos?',
        type: 'multiple-choice' as const,
        options: [
          'Usar lenguaje técnico complejo',
          'Proporcionar contexto claro e instrucciones específicas',
          'Hacer los prompts lo más cortos posible',
          'Siempre pedir respuestas en JSON'
        ],
        correctAnswer: 'Proporcionar contexto claro e instrucciones específicas',
        points: 3,
        explanation: 'Los prompts efectivos requieren contexto claro e instrucciones específicas para guiar la IA hacia el resultado deseado.'
      }
    ],
    fr: [
      {
        id: 'aimind-fr-001',
        question: 'Quel est le facteur le plus critique pour créer des prompts IA efficaces?',
        type: 'multiple-choice' as const,
        options: [
          'Utiliser un langage technique complexe',
          'Fournir un contexte clair et des instructions spécifiques',
          'Rendre les prompts aussi courts que possible',
          'Toujours demander des réponses JSON'
        ],
        correctAnswer: 'Fournir un contexte clair et des instructions spécifiques',
        points: 3,
        explanation: 'Les prompts efficaces nécessitent un contexte clair et des instructions spécifiques pour guider l\'IA vers le résultat souhaité.'
      }
    ],
    de: [
      {
        id: 'aimind-de-001',
        question: 'Was ist der kritischste Faktor beim Erstellen effektiver KI-Prompts?',
        type: 'multiple-choice' as const,
        options: [
          'Komplexe technische Sprache verwenden',
          'Klaren Kontext und spezifische Anweisungen bereitstellen',
          'Prompts so kurz wie möglich machen',
          'Immer nach JSON-Antworten fragen'
        ],
        correctAnswer: 'Klaren Kontext und spezifische Anweisungen bereitstellen',
        points: 3,
        explanation: 'Effektive Prompts erfordern klaren Kontext und spezifische Anweisungen, um die KI zur gewünschten Ausgabe zu führen.'
      }
    ],
    ja: [
      {
        id: 'aimind-ja-001',
        question: '効果的なAIプロンプトを作成する上で最も重要な要素は何ですか？',
        type: 'multiple-choice' as const,
        options: [
          '複雑な技術用語を使用する',
          '明確で具体的なコンテキストと指示を提供する',
          'プロンプトをできるだけ短くする',
          '常にJSON形式での回答を求める'
        ],
        correctAnswer: '明確で具体的なコンテキストと指示を提供する',
        points: 3,
        explanation: '効果的なプロンプトには、AIを望ましい出力に導くための明確なコンテキストと具体的な指示が必要です。'
      }
    ],
    zh: [
      {
        id: 'aimind-zh-001',
        question: '创建有效AI提示词最关键的因素是什么？',
        type: 'multiple-choice' as const,
        options: [
          '使用复杂的技术语言',
          '提供清晰、具体的上下文和指令',
          '让提示词尽可能简短',
          '总是要求JSON格式的回答'
        ],
        correctAnswer: '提供清晰、具体的上下文和指令',
        points: 3,
        explanation: '有效的提示词需要清晰的上下文和具体的指令来引导AI产生期望的输出。'
      }
    ],
    pt: [
      {
        id: 'aimind-pt-001',
        question: 'Qual é o fator mais crítico para criar prompts de IA eficazes?',
        type: 'multiple-choice' as const,
        options: [
          'Usar linguagem técnica complexa',
          'Fornecer contexto claro e instruções específicas',
          'Tornar os prompts o mais curtos possível',
          'Sempre pedir respostas em JSON'
        ],
        correctAnswer: 'Fornecer contexto claro e instruções específicas',
        points: 3,
        explanation: 'Prompts eficazes requerem contexto claro e instruções específicas para guiar a IA em direção ao resultado desejado.'
      }
    ],
    it: [
      {
        id: 'aimind-it-001',
        question: 'Qual è il fattore più critico per creare prompt AI efficaci?',
        type: 'multiple-choice' as const,
        options: [
          'Usare linguaggio tecnico complesso',
          'Fornire contesto chiaro e istruzioni specifiche',
          'Rendere i prompt il più corti possibile',
          'Chiedere sempre risposte in JSON'
        ],
        correctAnswer: 'Fornire contesto chiaro e istruzioni specifiche',
        points: 3,
        explanation: 'I prompt efficaci richiedono contesto chiaro e istruzioni specifiche per guidare l\'IA verso l\'output desiderato.'
      }
    ]
  };

  return questions[language] || questions.en;
}

// AI-powered essay grading for certifications
export async function gradeCertificationEssay(
  question: string,
  expectedConcepts: string,
  studentAnswer: string,
  maxPoints: number
): Promise<{ score: number; feedback: string; percentage: number }> {
  try {
    const completion = await checkOpenAI().chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert AI tutor grading certification exam essays. Grade fairly and provide constructive feedback.

Grading Criteria:
- Accuracy of concepts (40%)
- Depth of understanding (30%)
- Practical application (20%)
- Clarity of communication (10%)

Question: ${question}
Expected concepts: ${expectedConcepts}
Max points: ${maxPoints}

Provide:
1. Score (0 to ${maxPoints})
2. Detailed feedback explaining strengths and areas for improvement
3. Percentage score

Be encouraging but maintain certification standards.`
        },
        {
          role: 'user',
          content: `Grade this student answer:\n\n"${studentAnswer}"\n\nReturn JSON: {"score": number, "feedback": "detailed string", "percentage": number}`
        }
      ],
      max_tokens: 400,
      temperature: 0.2,
    });

    const response = completion.choices[0]?.message?.content || '';
    try {
      const result = JSON.parse(response);
      return {
        score: result.score || 0,
        feedback: result.feedback || 'Answer reviewed',
        percentage: result.percentage || Math.round((result.score / maxPoints) * 100)
      };
    } catch {
      const estimatedScore = Math.min(maxPoints, Math.max(0, Math.floor(maxPoints * 0.6)));
      return {
        score: estimatedScore,
        feedback: 'Your answer demonstrates understanding of key concepts. Consider providing more specific examples and practical applications.',
        percentage: Math.round((estimatedScore / maxPoints) * 100)
      };
    }
  } catch (error) {
    console.error('Essay grading error:', error);
    return {
      score: 0,
      feedback: 'Unable to grade this response. Please try again.',
      percentage: 0
    };
  }
}

// Enhanced lesson response with RAG integration
export async function generateRAGEnhancedLessonResponse(
  userQuestion: string,
  context: LessonContext,
  conversationHistory: ChatMessage[] = []
): Promise<{
  response: string;
  ragData?: RAGResponse;
  sources: Array<{
    title: string;
    source: string;
    relevance: number;
  }>;
}> {
  try {
    // First, try to get context-aware response using RAG
    const ragResponse = await ragVectorSearch.ragQuery(userQuestion, {
      maxSources: 3,
      includeFollowUp: false,
      responseStyle: 'conversational'
    });

    // If RAG found relevant content, use it as enhanced context
    if (ragResponse.confidence > 50 && ragResponse.sources.length > 0) {
      const enhancedContext = `${context.sectionContent}\n\nAdditional Context:\n${ragResponse.sources.map(s => s.snippet).join('\n')}`;
      
      const enhancedContextObj = {
        ...context,
        sectionContent: enhancedContext
      };

      const aiResponse = await generateLessonResponse(userQuestion, enhancedContextObj, conversationHistory);
      
      return {
        response: aiResponse,
        ragData: ragResponse,
        sources: ragResponse.sources.map(s => ({
          title: s.title,
          source: s.source,
          relevance: s.relevance
        }))
      };
    } else {
      // Fallback to standard lesson response
      const response = await generateLessonResponse(userQuestion, context, conversationHistory);
      return {
        response,
        sources: []
      };
    }
  } catch (error) {
    console.error('RAG-enhanced response error:', error);
    // Fallback to standard response
    const response = await generateLessonResponse(userQuestion, context, conversationHistory);
    return {
      response,
      sources: []
    };
  }
}

// Convenience exports for RAG functionality
export { ragVectorSearch, type RAGResponse, type VectorDocument, type SearchResult } from './rag-vector-search';
export { searchLessons, askAI, addLessonContent, getSearchStats } from './rag-vector-search';
