import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, PRICING_PLANS, PlanTier } from '../../../lib/stripe';
import { getCurrentUser } from '../../../lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { planTier } = await request.json();

    // Validate plan tier
    if (!planTier || !(planTier in PRICING_PLANS)) {
      return NextResponse.json(
        { error: 'Invalid plan tier' },
        { status: 400 }
      );
    }

    // Get current user
    const { user, error: authError } = await getCurrentUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const plan = PRICING_PLANS[planTier as PlanTier];
    
    // Free plan doesn't need checkout
    if (planTier === 'free') {
      return NextResponse.json(
        { error: 'Free plan does not require checkout' },
        { status: 400 }
      );
    }

    if (!plan.priceId) {
      return NextResponse.json(
        { error: 'Price ID not configured for this plan' },
        { status: 500 }
      );
    }

    // Create checkout session
    const { sessionId, url } = await createCheckoutSession(
      user.id,
      plan.priceId,
      planTier as PlanTier,
      user.email!
    );

    return NextResponse.json({ sessionId, url });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
