import { NextRequest, NextResponse } from 'next/server';
import { analytics } from '../../../../lib/analytics';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, category, properties, sessionId } = body;

    // Get user info from headers or session
    const userId = request.headers.get('x-user-id') || undefined;
    const userAgent = request.headers.get('user-agent') || undefined;
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1';

    // Track the event
    await analytics.track({
      userId,
      sessionId,
      event,
      category,
      properties,
      userAgent,
      ip,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
