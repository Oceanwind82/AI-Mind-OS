import { NextRequest, NextResponse } from 'next/server';
import { analytics } from '../../../../lib/analytics';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';

    let data;
    
    switch (type) {
      case 'realtime':
        data = await analytics.getRealTimeMetrics();
        break;
      case 'revenue':
        data = await analytics.getRevenueAnalytics();
        break;
      case 'ai':
        data = await analytics.getAIAnalytics();
        break;
      case 'learning':
        data = await analytics.getLearningAnalytics();
        break;
      case 'overview':
      default:
        data = {
          realtime: await analytics.getRealTimeMetrics(),
          revenue: await analytics.getRevenueAnalytics(),
          ai: await analytics.getAIAnalytics(),
          learning: await analytics.getLearningAnalytics(),
        };
        break;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Analytics dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
