import { NextRequest, NextResponse } from 'next/server';
import { generateLessonResponse, ChatMessage, LessonContext } from '../../../../lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { message, lessonContext, conversationHistory } = await request.json();

    // Validate required fields
    if (!message || !lessonContext) {
      return NextResponse.json(
        { error: 'Message and lesson context are required' },
        { status: 400 }
      );
    }

    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Generate AI response
    const response = await generateLessonResponse(
      message,
      lessonContext as LessonContext,
      conversationHistory as ChatMessage[]
    );

    return NextResponse.json({ response });

  } catch (error) {
    console.error('AI Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
