import { NextResponse } from 'next/server';

// Simplified certification exams API for deployment
export async function GET() {
  return NextResponse.json({ 
    exams: [
      {
        id: 'exam_1',
        title: 'AI Mind OS Fundamentals',
        description: 'Master the fundamentals of AI Mind OS',
        active: true,
        passingScore: 80,
        timeLimit: 60,
        price: 0
      }
    ]
  });
}
