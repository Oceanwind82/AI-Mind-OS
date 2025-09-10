import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lessonId, status, score } = body;
    
    if (!lessonId || !status) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    
    const mockResponse = {
      success: true,
      data: {
        xpGained: status === 'completed' ? (score ? Math.floor(score * 10) : 50) : 25,
        newLevel: undefined,
        streakDays: undefined,
        achievements: []
      }
    };
    
    return NextResponse.json(mockResponse);
  } catch {
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}

export async function GET() {
  const mockData = {
    userId: 'demo-user',
    totalXP: 1250,
    level: 3,
    currentStreak: 7,
    lessonsCompleted: 15,
    lessons: []
  };
  
  return NextResponse.json({ success: true, data: mockData });
}
