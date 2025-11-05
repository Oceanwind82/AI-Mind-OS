import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';
import { checkBotId } from 'botid/server';

const TEMP_USER_ID = '550e8400-e29b-41d4-a716-446655440001';

export async function POST(request: NextRequest) {
  // Check if the request is from a bot
  const verification = await checkBotId();
  
  if (verification.isBot) {
    return NextResponse.json(
      { error: 'Bot detected. Access denied.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { lessonId, status, score } = body;
    
    const userId = request.headers.get('x-user-id') || TEMP_USER_ID;
    
    if (!lessonId || !status) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    
    const supabase = createServiceClient();
    
    const xpEarned = status === 'completed' ? (score ? Math.floor(score * 10) : 50) : 25;
    const completionPercentage = status === 'completed' ? 100 : (status === 'in_progress' ? 50 : 0);
    
    const { error: progressError } = await supabase
      .from('progress_tracking')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        status,
        completion_percentage: completionPercentage,
        xp_earned: status === 'completed' ? xpEarned : 0,
        completed_at: status === 'completed' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,lesson_id'
      });
    
    if (progressError) {
      console.error('Progress tracking error:', progressError);
      return NextResponse.json({ success: false, error: 'Failed to update progress' }, { status: 500 });
    }
    
    if (status === 'completed') {
      const { error: xpError } = await supabase.rpc('update_user_xp_and_streak', {
        p_user_id: userId,
        p_xp_earned: xpEarned
      });
      
      if (xpError) {
        console.error('XP update error:', xpError);
      }
    }
    
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    const response = {
      success: true,
      data: {
        xpGained: status === 'completed' ? xpEarned : 0,
        totalXP: profile?.total_xp || 0,
        newLevel: Math.floor((profile?.total_xp || 0) / 1000) + 1,
        streakDays: profile?.current_streak || 0,
        achievements: []
      }
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Progress API error:', error);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || TEMP_USER_ID;
    
    const supabase = createServiceClient();
    
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    const { data: lessons } = await supabase
      .from('progress_tracking')
      .select('*')
      .eq('user_id', userId);
    
    const totalXP = profile?.total_xp || 0;
    const level = Math.floor(totalXP / 1000) + 1;
    const lessonsCompleted = lessons?.filter(l => l.status === 'completed').length || 0;
    
    const responseData = {
      userId,
      totalXP,
      level,
      currentStreak: profile?.current_streak || 0,
      maxStreak: profile?.max_streak || 0,
      lessonsCompleted,
      lessons: lessons || []
    };
    
    return NextResponse.json({ success: true, data: responseData });
  } catch (error) {
    console.error('Progress GET error:', error);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
