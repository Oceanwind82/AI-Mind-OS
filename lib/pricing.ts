// Tiered Pricing System with Advanced Access Control
export type PricingTier = 'free' | 'starter' | 'pro' | 'master' | 'enterprise';

export interface PricingPlan {
  id: PricingTier;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  popular?: boolean;
  features: {
    name: string;
    included: boolean;
    limit?: number | string;
    description?: string;
  }[];
  limits: {
    lessonsPerMonth: number;
    aiQuestionsPerDay: number;
    certificationsPerMonth: number;
    ragSearchesPerDay: number;
    downloadableResources: boolean;
    multiLanguageSupport: boolean;
    prioritySupport: boolean;
    customBranding: boolean;
    apiAccess: boolean;
    whitelabel: boolean;
    dedupedSupport: boolean;
    enterpriseSSO: boolean;
  };
  cta: string;
  stripePriceId: {
    monthly: string;
    yearly: string;
  };
}

// 🚫 ABSOLUTELY NO REFUNDS - ZERO TOLERANCE POLICY 🚫
export const REFUND_POLICY = {
  message: "🚫 ABSOLUTELY NO REFUNDS - ZERO TOLERANCE POLICY 🚫",
  legalDisclaimer: "BY CLICKING ANY PURCHASE BUTTON, YOU IRREVOCABLY WAIVE ALL REFUND RIGHTS",
  details: [
    "❌ ZERO refunds under ANY circumstances - NO EXCEPTIONS",
    "❌ ALL purchases are 100% FINAL and NON-REFUNDABLE", 
    "❌ Includes: one-time payments, upgrades, downgrades, unused portions",
    "❌ Technical issues, dissatisfaction, or buyer's remorse = NO REFUND",
    "❌ Chargebacks will be disputed with full legal action",
    "❌ Credit card disputes will be fought aggressively",
    "❌ Bank reversals will be challenged immediately",
    "❌ You acknowledge this is a DIGITAL SERVICE with immediate access",
    "❌ By purchasing, you LEGALLY WAIVE all refund rights forever"
  ],
  consequences: [
    "Attempted chargebacks will result in account termination",
    "Fraudulent refund claims will be reported to authorities", 
    "Legal fees will be pursued for illegitimate disputes",
    "All refund attempts will be publicly documented"
  ],
  emphasis: "⚠️ THINK CAREFULLY BEFORE PURCHASING - NO EXCEPTIONS ⚠️"
} as const;

export const PRICING_PLANS: Record<PricingTier, PricingPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'For curious minds',
    price: { monthly: 0, yearly: 0 },
    features: [
      { name: '3 lessons per month', included: true, limit: 3 },
      { name: '5 AI questions per day', included: true, limit: 5 },
      { name: 'Limited RAG search', included: true, limit: 3 },
      { name: 'Community access', included: true },
      { name: 'Basic learning progress', included: true },
      { name: 'Certifications', included: false },
      { name: 'Premium lessons', included: false },
      { name: 'Priority support', included: false },
    ],
    limits: {
      lessonsPerMonth: 3,
      aiQuestionsPerDay: 5,
      certificationsPerMonth: 0,
      ragSearchesPerDay: 3,
      downloadableResources: false,
      multiLanguageSupport: false,
      prioritySupport: false,
      customBranding: false,
      apiAccess: false,
      whitelabel: false,
      dedupedSupport: false,
      enterpriseSSO: false,
    },
    cta: 'Get Started Free',
    stripePriceId: {
      monthly: '',
      yearly: '',
    },
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    description: 'For beginners unlocking full access',
    price: { monthly: 29, yearly: 290 },
    popular: true,
    features: [
      { name: 'Unlimited lessons', included: true },
      { name: '25 AI questions per day', included: true, limit: 25 },
      { name: 'Basic certifications', included: true },
      { name: 'RAG search (standard)', included: true },
      { name: 'No watermark', included: true },
      { name: 'Email support', included: true },
      { name: 'Progress analytics', included: true },
      { name: 'API access', included: false },
    ],
    limits: {
      lessonsPerMonth: -1, // unlimited
      aiQuestionsPerDay: 25,
      certificationsPerMonth: 3,
      ragSearchesPerDay: 15,
      downloadableResources: true,
      multiLanguageSupport: true,
      prioritySupport: false,
      customBranding: false,
      apiAccess: false,
      whitelabel: false,
      dedupedSupport: false,
      enterpriseSSO: false,
    },
    cta: 'Unlock Full Access',
    stripePriceId: {
      monthly: 'price_starter_monthly',
      yearly: 'price_starter_yearly',
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'For serious independent learners',
    price: { monthly: 79, yearly: 790 },
    features: [
      { name: 'Unlimited lessons + AI', included: true },
      { name: 'Advanced certifications', included: true },
      { name: 'API access', included: true },
      { name: 'AI essay grading + RAG+', included: true },
      { name: 'Lesson export (PDF/JSON)', included: true },
      { name: 'Priority support', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Multi-language support', included: true },
    ],
    limits: {
      lessonsPerMonth: -1,
      aiQuestionsPerDay: -1,
      certificationsPerMonth: -1,
      ragSearchesPerDay: -1,
      downloadableResources: true,
      multiLanguageSupport: true,
      prioritySupport: true,
      customBranding: false,
      apiAccess: true,
      whitelabel: false,
      dedupedSupport: true,
      enterpriseSSO: false,
    },
    cta: 'Go Pro',
    stripePriceId: {
      monthly: 'price_pro_monthly',
      yearly: 'price_pro_yearly',
    },
  },
  master: {
    id: 'master',
    name: 'Master',
    description: 'For creators and future coaches',
    price: { monthly: 149, yearly: 1490 },
    features: [
      { name: 'Everything in Pro', included: true },
      { name: 'Lesson generator access', included: true },
      { name: 'AI trainer toolkit', included: true },
      { name: 'Custom branding', included: true },
      { name: 'AI prompt templates', included: true },
      { name: 'Advanced export options', included: true },
      { name: 'Creator analytics', included: true },
      { name: 'Premium support', included: true },
    ],
    limits: {
      lessonsPerMonth: -1,
      aiQuestionsPerDay: -1,
      certificationsPerMonth: -1,
      ragSearchesPerDay: -1,
      downloadableResources: true,
      multiLanguageSupport: true,
      prioritySupport: true,
      customBranding: true,
      apiAccess: true,
      whitelabel: false,
      dedupedSupport: true,
      enterpriseSSO: false,
    },
    cta: 'Become a Master',
    stripePriceId: {
      monthly: 'price_master_monthly',
      yearly: 'price_master_yearly',
    },
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For organizations, teams, or schools',
    price: { monthly: 299, yearly: 2990 },
    features: [
      { name: 'All features unlocked', included: true },
      { name: 'Multi-user support', included: true },
      { name: 'Admin dashboard', included: true },
      { name: 'White-label options', included: true },
      { name: 'Enterprise onboarding', included: true },
      { name: 'Early access to new features', included: true },
      { name: 'Dedicated account manager', included: true },
      { name: 'Custom integrations', included: true },
    ],
    limits: {
      lessonsPerMonth: -1,
      aiQuestionsPerDay: -1,
      certificationsPerMonth: -1,
      ragSearchesPerDay: -1,
      downloadableResources: true,
      multiLanguageSupport: true,
      prioritySupport: true,
      customBranding: true,
      apiAccess: true,
      whitelabel: true,
      dedupedSupport: true,
      enterpriseSSO: true,
    },
    cta: 'Contact Sales',
    stripePriceId: {
      monthly: 'price_enterprise_monthly',
      yearly: 'price_enterprise_yearly',
    },
  },
};

// User subscription interface
export interface UserSubscription {
  userId: string;
  tier: PricingTier;
  stripePriceId?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
  cancelAtPeriodEnd: boolean;
  metadata?: Record<string, unknown>;
}

// Usage tracking interface
export interface UsageTracking {
  userId: string;
  tier: PricingTier;
  period: string; // YYYY-MM format
  lessonsCompleted: number;
  aiQuestionsAsked: number;
  certificationsEarned: number;
  ragSearchesPerformed: number;
  lastUpdated: Date;
}

// Access control functions
export const checkFeatureAccess = (userTier: PricingTier, feature: keyof PricingPlan['limits']): boolean => {
  const plan = PRICING_PLANS[userTier];
  return plan.limits[feature] === true || plan.limits[feature] === -1;
};

export const getRemainingUsage = (
  userTier: PricingTier, 
  currentUsage: Partial<UsageTracking>,
  feature: 'lessonsPerMonth' | 'aiQuestionsPerDay' | 'certificationsPerMonth' | 'ragSearchesPerDay'
): number => {
  const plan = PRICING_PLANS[userTier];
  const limit = plan.limits[feature] as number;
  
  if (limit === -1) return -1; // unlimited
  
  const used = currentUsage[feature.replace('PerMonth', 'Completed').replace('PerDay', 'Asked').replace('certificationsPerMonth', 'certificationsEarned').replace('ragSearchesPerDay', 'ragSearchesPerformed') as keyof UsageTracking] as number || 0;
  
  return Math.max(0, limit - used);
};

// Paywall trigger messages based on user's current tier and attempted action
export const getPaywallMessage = (userTier: PricingTier, feature: string): { title: string; message: string; suggestedPlan: PricingPlan } => {
  const messages: Record<PricingTier, Record<string, { title: string; message: string; suggestedPlan: PricingPlan }>> = {
    free: {
      certifications: {
        title: 'Unlock Certifications',
        message: 'Earn industry-recognized AI certifications to advance your career. Upgrade to access our complete certification program.',
        suggestedPlan: PRICING_PLANS.starter
      },
      premiumLessons: {
        title: 'Access Premium Lessons',
        message: 'Unlock advanced AI topics and hands-on projects designed by industry experts. Perfect for serious learners.',
        suggestedPlan: PRICING_PLANS.starter
      },
      unlimited: {
        title: 'Remove Usage Limits',
        message: 'You\'ve hit your monthly limit. Upgrade to continue learning without restrictions.',
        suggestedPlan: PRICING_PLANS.starter
      }
    },
    starter: {
      apiAccess: {
        title: 'Unlock API Access',
        message: 'Integrate AI Mind OS into your own applications and projects. Build custom solutions with our powerful API.',
        suggestedPlan: PRICING_PLANS.pro
      },
      advancedFeatures: {
        title: 'Access Advanced Features',
        message: 'Unlock AI essay grading, advanced export options, and priority support to accelerate your learning.',
        suggestedPlan: PRICING_PLANS.pro
      }
    },
    pro: {
      creatorTools: {
        title: 'Unlock Creator Tools',
        message: 'Access our lesson generator, AI trainer toolkit, and custom branding options to create and share your own content.',
        suggestedPlan: PRICING_PLANS.master
      },
      customBranding: {
        title: 'Enable Custom Branding',
        message: 'White-label your learning experience with custom branding and advanced creator analytics.',
        suggestedPlan: PRICING_PLANS.master
      }
    },
    master: {
      enterprise: {
        title: 'Scale to Enterprise',
        message: 'Ready for multi-user support, admin dashboards, and white-label solutions? Let\'s discuss your enterprise needs.',
        suggestedPlan: PRICING_PLANS.enterprise
      }
    },
    enterprise: {
      maxTier: {
        title: 'You\'re All Set!',
        message: 'You have access to all features. Contact support if you need additional customization.',
        suggestedPlan: PRICING_PLANS.enterprise
      }
    }
  };

  return messages[userTier][feature] || messages[userTier]['unlimited'] || {
    title: 'Upgrade Required',
    message: 'This feature requires a higher tier subscription.',
    suggestedPlan: PRICING_PLANS.pro
  };
};

// Helper to get next tier suggestion
export const getNextTier = (currentTier: PricingTier): PricingTier | null => {
  const tierOrder: PricingTier[] = ['free', 'starter', 'pro', 'master', 'enterprise'];
  const currentIndex = tierOrder.indexOf(currentTier);
  return currentIndex < tierOrder.length - 1 ? tierOrder[currentIndex + 1] : null;
};

// Calculate upgrade price difference
export const getUpgradePrice = (currentTier: PricingTier, targetTier: PricingTier, billingCycle: 'monthly' | 'yearly' = 'monthly'): number => {
  const currentPrice = PRICING_PLANS[currentTier].price[billingCycle];
  const targetPrice = PRICING_PLANS[targetTier].price[billingCycle];
  return Math.max(0, targetPrice - currentPrice);
};

// Stripe integration helpers
export const getStripePriceId = (tier: PricingTier, billingCycle: 'monthly' | 'yearly'): string => {
  return PRICING_PLANS[tier].stripePriceId[billingCycle];
};

// Feature comparison helper
export const compareFeatures = (tier1: PricingTier, tier2: PricingTier) => {
  const plan1 = PRICING_PLANS[tier1];
  const plan2 = PRICING_PLANS[tier2];
  
  return {
    tier1: plan1,
    tier2: plan2,
    differences: {
      lessonsPerMonth: plan2.limits.lessonsPerMonth - (plan1.limits.lessonsPerMonth === -1 ? Infinity : plan1.limits.lessonsPerMonth),
      aiQuestionsPerDay: plan2.limits.aiQuestionsPerDay - (plan1.limits.aiQuestionsPerDay === -1 ? Infinity : plan1.limits.aiQuestionsPerDay),
      // Add more comparisons as needed
    }
  };
};

export default PRICING_PLANS;
