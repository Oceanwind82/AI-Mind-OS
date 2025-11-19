import { NextResponse } from 'next/server';

// Simplified gamification stats API for deployment
export async function GET() {
  return NextResponse.json({
    stats: {
      level: 1,
      xp: 0,
      totalXp: 0,
      streak: 0,
      totalLessons: 0,
      completedLessons: 0,
      achievements: 0
    }
  });
}
