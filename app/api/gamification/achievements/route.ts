import { NextResponse } from 'next/server';

// Simplified gamification achievements API for deployment
export async function GET() {
  return NextResponse.json({
    achievements: [],
    progress: {},
    unlockedCount: 0,
    totalPoints: 0
  });
}
