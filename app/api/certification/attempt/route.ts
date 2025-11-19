import { NextRequest, NextResponse } from 'next/server';

// Simplified certification attempt API for deployment
export async function POST(request: NextRequest) {
  try {
    const { examId, userId, answers } = await request.json();

    // Mock response for deployment
    return NextResponse.json({ 
      attempt: {
        id: `attempt_${Date.now()}`,
        userId,
        examId,
        score: 85,
        passed: true,
        completedAt: new Date().toISOString()
      },
      result: {
        score: 85,
        passed: true,
        totalQuestions: answers?.length || 10,
        correctAnswers: Math.floor((answers?.length || 10) * 0.85)
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process exam attempt' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ attempts: [] });
}
