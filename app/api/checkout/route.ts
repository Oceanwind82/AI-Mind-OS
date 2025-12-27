import { NextRequest, NextResponse } from 'next/server';

// Simplified checkout API for deployment
export async function POST(request: NextRequest) {
  try {
    const { planTier } = await request.json();

    // Mock checkout session for deployment
    return NextResponse.json({
      sessionId: `cs_test_${Date.now()}`,
      url: '#',
      planTier,
      status: 'demo_mode'
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
