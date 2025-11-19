// app/api/gamification/stats/route.ts
// Phase 4.3: Gamification API - User Statistics and Progress

import { NextRequest, NextResponse } from 'next/server';
import { updateUserProgress, getUserRank, updateUserStreak, calculateLevel } from '../../../../lib/gamification';
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
      return NextResponse.json(
        { error: 'userId is required' }, 
        { status: 400 }
      );
    }

    // Get user stats from database
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

    // Get user's global rank
    const rank = await getUserRank(userId);

    // Calculate level information
    const levelInfo = calculateLevel(userStats.experience_points);

    // Format response
    const stats = {
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
      lastActiveDate: userStats.last_active_date,
      achievementsUnlocked: userStats.achievements_unlocked || [],
      badges: userStats.badges || [],
      rank,
      levelInfo: {
        currentLevel: levelInfo.level,
        nextLevelXP: levelInfo.nextLevelXP,
        progress: levelInfo.progress
      }
    };

    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch user stats',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, action, data } = await request.json();

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'userId and action are required' }, 
        { status: 400 }
      );
    }

    let updatedStats = null;
    let streakInfo = null;

    // Handle different actions
    switch (action) {
      case 'lesson_completed':
        updatedStats = await updateUserProgress(userId, 'lesson_completed', {
          score: data.score,
          studyTime: data.studyTime,
          category: data.category
        });
        streakInfo = await updateUserStreak(userId);
        break;
      
      case 'certification_earned':
        updatedStats = await updateUserProgress(userId, 'certification_earned', {});
        streakInfo = await updateUserStreak(userId);
        break;
      
      case 'quiz_score':
        updatedStats = await updateUserProgress(userId, 'quiz_score', {
          score: data.score,
          studyTime: data.studyTime
        });
        break;
      
      case 'update_streak':
        streakInfo = await updateUserStreak(userId);
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid action type' }, 
          { status: 400 }
        );
    }

    // Get updated rank
    const rank = updatedStats ? await getUserRank(userId) : null;

    // Prepare response
    const responseData: { 
      success: boolean; 
      message: string; 
      stats?: object; 
      streak?: object; 
    } = {
      success: true,
      message: 'Stats updated successfully'
    };

    if (updatedStats) {
      const levelInfo = calculateLevel(updatedStats.experiencePoints);
      responseData.stats = {
        ...updatedStats,
        rank,
        levelInfo: {
          currentLevel: levelInfo.level,
          nextLevelXP: levelInfo.nextLevelXP,
          progress: levelInfo.progress
        }
      };
    }

    if (streakInfo) {
      responseData.streak = streakInfo;
      if (streakInfo.isNewRecord) {
        responseData.message += ` New streak record: ${streakInfo.currentStreak} days! 🔥`;
      }
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error updating user stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update user stats',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
