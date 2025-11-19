// app/api/gamification/achievements/route.ts
// Phase 4.3: Gamification API - Achievement Management

import { NextRequest, NextResponse } from 'next/server';
import { getUserAchievementProgress, checkAchievements, ACHIEVEMENTS } from '../../../../lib/gamification';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      // Return all available achievements without progress
      return NextResponse.json({
        success: true,
        data: ACHIEVEMENTS.map(achievement => ({
          ...achievement,
          progress: 0,
          unlockedAt: null
        }))
      });
    }

    const achievements = await getUserAchievementProgress(userId);

    return NextResponse.json({
      success: true,
      data: achievements,
      stats: {
        total: ACHIEVEMENTS.length,
        unlocked: achievements.filter(a => a.progress === 100).length,
        inProgress: achievements.filter(a => (a.progress || 0) > 0 && (a.progress || 0) < 100).length
      }
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch achievements',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, action } = await request.json();

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'userId and action are required' }, 
        { status: 400 }
      );
    }

    // Get current user stats
    const { data: userStats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!userStats) {
      return NextResponse.json(
        { error: 'User stats not found' }, 
        { status: 404 }
      );
    }

    // Check for new achievements
    const newAchievements = await checkAchievements(userId, {
      userId: userStats.user_id,
      totalPoints: userStats.total_points,
      level: userStats.level,
      experiencePoints: userStats.experience_points,
      currentStreak: userStats.current_streak,
      longestStreak: userStats.longest_streak,
      lessonsCompleted: userStats.lessons_completed,
      certificationsEarned: userStats.certifications_earned,
      averageScore: userStats.average_score,
      studyTimeMinutes: userStats.study_time_minutes,
      lastActiveDate: new Date(userStats.last_active_date),
      achievementsUnlocked: userStats.achievements_unlocked || [],
      badges: userStats.badges || []
    });

    return NextResponse.json({
      success: true,
      newAchievements,
      message: newAchievements.length > 0 
        ? `Congratulations! You unlocked ${newAchievements.length} new achievement${newAchievements.length > 1 ? 's' : ''}!`
        : 'No new achievements unlocked'
    });
  } catch (error) {
    console.error('Error checking achievements:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check achievements',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
