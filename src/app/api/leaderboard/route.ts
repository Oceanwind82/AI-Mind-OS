import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = createServiceClient();
    
    // Fetch leaderboard data using the public view
    const { data: leaderboard, error } = await supabase
      .from('leaderboard')
      .select('*')
      .limit(100);
    
    if (error) {
      console.error('Leaderboard fetch error:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch leaderboard' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: leaderboard || [] 
    });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
