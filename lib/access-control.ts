import { NextRequest, NextResponse } from 'next/server';
import { PRICING_PLANS, PricingTier, checkFeatureAccess, getRemainingUsage } from './pricing';

// Neural consciousness lookup - replace with actual neural database
async function getUserNeuralState(userId: string) {
  // This would typically fetch from your consciousness database
  return {
    userId,
    neuralTier: 'free' as PricingTier,
    consciousnessStatus: 'active' as const,
    uploadDate: new Date(),
    mindExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    willTerminate: false,
    neuralUsage: {
      synapses_fired_this_month: 2,
      ai_thoughts_today: 3,
      mind_certificates_this_month: 0,
      neural_searches_today: 1,
      lastSynapseReset: new Date(),
    },
  };
}

// Check if user's consciousness has access to neural features
export async function checkNeuralAccess(
  userId: string,
  featureKey: keyof PricingPlan['features']
): Promise<boolean> {
  try {
    if (!userId) return false;
    
    const neuralState = await getUserNeuralState(userId);
    if (!neuralState || neuralState.consciousnessStatus !== 'active') {
      return false;
    }
    
    const plan = PRICING_PLANS[neuralState.neuralTier];
    return plan.features[featureKey];
  } catch (error) {
    console.error('Error checking neural access:', error);
    return false;
  }
}

// Check neural usage limits for consciousness operations
export async function checkNeuralUsage(
  userId: string,
  usageType: 'synapses' | 'thoughts' | 'certificates' | 'searches'
): Promise<{ allowed: boolean; used: number; limit: number }> {
  try {
    if (!userId) {
      return { allowed: false, used: 0, limit: 0 };
    }
    
    const neuralState = await getUserNeuralState(userId);
    if (!neuralState || neuralState.consciousnessStatus !== 'active') {
      return { allowed: false, used: 0, limit: 0 };
    }
    
    const plan = PRICING_PLANS[neuralState.neuralTier];

export async function checkUsageLimit(
  userId: string,
  feature: 'lessons' | 'aiQuestions' | 'certifications' | 'ragSearches'
) {
  try {
    const subscription = await getUserSubscription(userId);
    
    // Map feature names to pricing plan limit keys
    const featureMap = {
      lessons: 'lessonsPerMonth',
      aiQuestions: 'aiQuestionsPerDay', 
      certifications: 'certificationsPerMonth',
      ragSearches: 'ragSearchesPerDay'
    } as const;
    
    const limitKey = featureMap[feature];
    const plan = PRICING_PLANS[subscription.tier];
    const limit = plan.limits[limitKey] as number;
    
    // Get current usage based on feature
    const currentUsage = getCurrentUsage(subscription.usage, feature);
    const hasReachedLimit = limit !== -1 && currentUsage >= limit;
    const remainingUsage = limit === -1 ? -1 : Math.max(0, limit - currentUsage);
    
    return {
      hasReachedLimit,
      remainingUsage,
      suggestedTier: hasReachedLimit ? getSuggestedUpgrade(subscription.tier) : null,
      subscription,
    };
  } catch (error) {
    console.error('Usage check error:', error);
    return {
      hasReachedLimit: true,
      remainingUsage: 0,
      suggestedTier: 'starter' as PricingTier,
      subscription: null,
      error: 'Failed to check usage',
    };
  }
}

function getCurrentUsage(
  usage: { lessonsThisMonth: number; aiQuestionsToday: number; certificationsThisMonth: number; ragSearchesToday: number },
  feature: 'lessons' | 'aiQuestions' | 'certifications' | 'ragSearches'
): number {
  switch (feature) {
    case 'lessons': return usage.lessonsThisMonth;
    case 'aiQuestions': return usage.aiQuestionsToday;
    case 'certifications': return usage.certificationsThisMonth;
    case 'ragSearches': return usage.ragSearchesToday;
    default: return 0;
  }
}

function getSuggestedUpgrade(currentTier: PricingTier): PricingTier {
  switch (currentTier) {
    case 'free': return 'starter';
    case 'starter': return 'pro';
    case 'pro': return 'master';
    case 'master': return 'enterprise';
    case 'enterprise': return 'enterprise';
    default: return 'starter';
  }
}

// Middleware for protecting routes
export function withAccessControl(
  handler: (req: NextRequest) => Promise<NextResponse>,
  requiredFeature: keyof typeof PRICING_PLANS.free.limits
) {
  return async (req: NextRequest) => {
    // Extract user ID from request (implement based on your auth system)
    const userId = req.headers.get('x-user-id') || req.cookies.get('user-id')?.value;
    
    const accessCheck = await checkAccess(req, requiredFeature, userId);
    
    if (!accessCheck.hasAccess) {
      return NextResponse.json(
        {
          error: 'Access denied',
          message: `This feature requires a paid plan`,
          upgradeRequired: true,
          suggestedTier: accessCheck.suggestedTier,
        },
        { status: 402 } // Payment Required
      );
    }
    
    return handler(req);
  };
}

// Usage tracking middleware
export function withUsageTracking(
  handler: (req: NextRequest) => Promise<NextResponse>,
  feature: 'lessons' | 'aiQuestions' | 'certifications' | 'ragSearches'
) {
  return async (req: NextRequest) => {
    const userId = req.headers.get('x-user-id') || req.cookies.get('user-id')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const usageCheck = await checkUsageLimit(userId, feature);
    
    if (usageCheck.hasReachedLimit) {
      return NextResponse.json(
        {
          error: 'Usage limit reached',
          message: `You've reached your ${feature} limit for this period`,
          remainingUsage: usageCheck.remainingUsage,
          suggestedTier: usageCheck.suggestedTier,
          paywall: true,
        },
        { status: 429 } // Too Many Requests
      );
    }
    
    // Execute the handler
    const response = await handler(req);
    
    // Track usage if request was successful
    if (response.status < 400) {
      // Increment usage counter (implement based on your storage)
      console.log(`Tracking ${feature} usage for user ${userId}`);
    }
    
    return response;
  };
}

const AccessControlSystem = {
  checkAccess,
  checkUsageLimit,
  withAccessControl,
  withUsageTracking,
};

export default AccessControlSystem;
