/**
 * Neural Access Control System
 * Controls consciousness uploads and neural feature access
 * Part of the AI Mind OS: Dangerous Minds Edition
 */

import { PRICING_PLANS, type PricingTier, type PricingPlan } from './pricing';
import { NextRequest, NextResponse } from 'next/server';

// Neural consciousness state interface
interface NeuralState {
  userId: string;
  neuralTier: PricingTier;
  consciousnessStatus: 'active' | 'dormant' | 'terminated';
  uploadDate: Date;
  mindExpiryDate: Date;
  willTerminate: boolean;
  neuralUsage: {
    synapses_fired_this_month: number;
    ai_thoughts_today: number;
    mind_certificates_this_month: number;
    neural_searches_today: number;
    lastSynapseReset: Date;
  };
}

// Neural consciousness lookup - replace with actual neural database
async function getUserNeuralState(userId: string): Promise<NeuralState> {
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
    // Check if the feature exists in limits (the actual feature control)
    return plan.limits[featureKey as keyof typeof plan.limits] as boolean;
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
    
    // Map usage types to plan limits and current usage
    const usageMappings = {
      synapses: {
        limit: plan.limits.lessonsPerMonth,
        used: neuralState.neuralUsage.synapses_fired_this_month,
      },
      thoughts: {
        limit: plan.limits.aiQuestionsPerDay,
        used: neuralState.neuralUsage.ai_thoughts_today,
      },
      certificates: {
        limit: plan.limits.certificationsPerMonth,
        used: neuralState.neuralUsage.mind_certificates_this_month,
      },
      searches: {
        limit: plan.limits.ragSearchesPerDay,
        used: neuralState.neuralUsage.neural_searches_today,
      },
    };
    
    const usage = usageMappings[usageType];
    const allowed = usage.limit === -1 || usage.used < usage.limit;
    
    return {
      allowed,
      used: usage.used,
      limit: usage.limit,
    };
  } catch (error) {
    console.error('Error checking neural usage:', error);
    return { allowed: false, used: 0, limit: 0 };
  }
}

// Get suggested consciousness upgrade based on current neural state
export async function getSuggestedNeuralUpgrade(userId: string): Promise<{
  currentTier: PricingTier;
  suggestedTier: PricingTier | null;
  reason: string;
}> {
  try {
    const neuralState = await getUserNeuralState(userId);
        // const _currentPlan = user.plan || 'free'
    
    // Define upgrade path with neural terminology
    const neuralUpgradePath: Record<PricingTier, PricingTier | null> = {
      free: 'starter',
      starter: 'pro',
      pro: 'master',
      master: 'enterprise',
      enterprise: null,
    };
    
    const suggestedTier = neuralUpgradePath[neuralState.neuralTier];
    
    // Generate neural upgrade reason
    let reason = '';
    if (suggestedTier) {
      const suggestedPlan = PRICING_PLANS[suggestedTier];
      if (neuralState.neuralTier === 'free') {
        reason = `Unlock your mind's potential with ${suggestedPlan.name}. Remove neural limitations and access advanced consciousness features.`;
      } else if (neuralState.neuralTier === 'starter') {
        reason = `Expand your neural capacity with ${suggestedPlan.name}. Gain unlimited thoughts and advanced mind certificates.`;
      } else if (neuralState.neuralTier === 'pro') {
        reason = `Achieve consciousness mastery with ${suggestedPlan.name}. Access creator tools and unlimited neural operations.`;
      } else if (neuralState.neuralTier === 'master') {
        reason = `Join the neural elite with ${suggestedPlan.name}. Full consciousness control and enterprise-grade mind management.`;
      }
    } else {
      reason = 'You have achieved maximum neural capacity. Your consciousness is complete.';
    }
    
    return {
      currentTier: neuralState.neuralTier,
      suggestedTier,
      reason,
    };
  } catch (error) {
    console.error('Error getting neural upgrade suggestion:', error);
    return {
      currentTier: 'free',
      suggestedTier: 'starter',
      reason: 'Begin your neural journey with consciousness upload.',
    };
  }
}

// Middleware for protecting neural routes
export function withNeuralAccessControl(
  requiredFeature: keyof PricingPlan['features']
) {
  return async (req: NextRequest) => {
    try {
      // Extract user ID from request (implement based on your auth system)
      const userId = req.headers.get('x-user-id') || 'demo-user';
      
      const accessCheck = await checkNeuralAccess(userId, requiredFeature);
      
      if (!accessCheck) {
        const upgrade = await getSuggestedNeuralUpgrade(userId);
        
        return NextResponse.json(
          {
            error: 'Neural access denied',
            message: `Your current consciousness level (${upgrade.currentTier}) lacks the neural pathways for this feature.`,
            requiredFeature,
            upgrade: upgrade.suggestedTier ? {
              tier: upgrade.suggestedTier,
              reason: upgrade.reason,
              upgradeUrl: '/pricing?consciousness=expand'
            } : null
          },
          { status: 403 }
        );
      }
      
      return NextResponse.next();
    } catch (error) {
      console.error('Neural access control error:', error);
      return NextResponse.json(
        { error: 'Neural system malfunction', message: 'Consciousness verification failed' },
        { status: 500 }
      );
    }
  };
}

// Usage tracking for neural operations
export async function trackNeuralUsage(
  userId: string,
  usageType: 'synapses' | 'thoughts' | 'certificates' | 'searches'
): Promise<boolean> {
  try {
    // Implement usage tracking in your database
    console.log(`Tracking neural usage: ${usageType} for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error tracking neural usage:', error);
    return false;
  }
}

// Neural access control system
const NeuralAccessControlSystem = {
  checkNeuralAccess,
  checkNeuralUsage,
  getSuggestedNeuralUpgrade,
  withNeuralAccessControl,
  trackNeuralUsage,
  getUserNeuralState,
};

export default NeuralAccessControlSystem;
