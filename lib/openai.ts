import OpenAI from 'openai';

// Initialize OpenAI client with environment safety
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

// Generate AI response for lesson questions
export async function generateLessonResponse(
  userQuestion: string,
  context: LessonContext,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    const systemPrompt = createSystemPrompt(context);
    
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userQuestion }
    ];

    const completion = await openai.chat.completions.create({
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

// Generate lesson summary
export async function generateLessonSummary(
  lessonTitle: string,
  allSections: { title: string; content: string }[]
): Promise<string> {
  try {
    const contentOverview = allSections
      .map(section => `**${section.title}**: ${section.content.slice(0, 150)}...`)
      .join('\n\n');

    const completion = await openai.chat.completions.create({
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
    const completion = await openai.chat.completions.create({
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
