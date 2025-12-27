// app/api/gamification/leaderboard/route.ts
// Phase 4.3: Gamification API - Global Leaderboard

import { NextRequest, NextResponse } from 'next/server';
import { getGlobalLeaderboard } from '../../../../lib/gamification';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');

    if (limit > 500) {
      return NextResponse.json(
        { error: 'Limit cannot exceed 500' }, 
        { status: 400 }
      );
    }

    const leaderboard = await getGlobalLeaderboard(limit);

    return NextResponse.json({
      success: true,
      data: leaderboard,
      total: leaderboard.length
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch leaderboard',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
