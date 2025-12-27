// Tiered Pricing System with Advanced Access Control
export type PricingTier = 'free' | 'starter' | 'pro' | 'enterprise';

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

// STRICT NO REFUND POLICY - ALL SALES ARE FINAL
export const REFUND_POLICY = {
  message: "STRICT NO REFUND POLICY - ALL SALES ARE FINAL",
  details: [
    "No refunds will be processed under any circumstances",
    "All purchases are final and non-refundable", 
    "This includes monthly/yearly subscriptions, upgrades, and unused portions",
    "By purchasing, you acknowledge and agree to this policy",
    "No chargebacks or disputes will be honored"
  ]
} as const;

export const PRICING_PLANS: Record<PricingTier, PricingPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started with AI learning',
    price: { monthly: 0, yearly: 0 },
    features: [
      { name: '3 lessons per month', included: true, limit: 3 },
      { name: '5 AI questions per day', included: true, limit: 5 },
      { name: '3 RAG searches per day', included: true, limit: 3 },
      { name: 'Basic learning progress', included: true },
      { name: 'Community support', included: true },
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
    description: 'Ideal for serious learners and early-career professionals',
    price: { monthly: 29, yearly: 290 },
    popular: true,
    features: [
      { name: 'Unlimited lessons', included: true },
      { name: 'Unlimited AI questions', included: true },
      { name: 'Unlimited RAG searches', included: true },
      { name: 'All certifications', included: true },
      { name: 'Premium lessons', included: true },
      { name: 'Email support', included: true },
      { name: 'Progress analytics', included: true },
      { name: 'Downloadable resources', included: true },
    ],
    limits: {
      lessonsPerMonth: -1, // unlimited
      aiQuestionsPerDay: -1,
      certificationsPerMonth: -1,
      ragSearchesPerDay: -1,
      downloadableResources: true,
      multiLanguageSupport: true,
      prioritySupport: false,
      customBranding: false,
      apiAccess: false,
      whitelabel: false,
      dedupedSupport: false,
      enterpriseSSO: false,
    },
    cta: 'Start Free Trial',
    stripePriceId: {
      monthly: 'price_starter_monthly',
      yearly: 'price_starter_yearly',
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'Perfect for advanced professionals and team leads',
    price: { monthly: 79, yearly: 790 },
    features: [
      { name: 'Everything in Starter', included: true },
      { name: 'Priority support', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Custom learning paths', included: true },
      { name: 'API access', included: true },
      { name: 'Multi-language support', included: true },
      { name: 'White-label options', included: true },
      { name: 'Team collaboration', included: true },
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
      dedupedSupport: false,
      enterpriseSSO: false,
    },
    cta: 'Go Pro',
    stripePriceId: {
      monthly: 'price_pro_monthly',
      yearly: 'price_pro_yearly',
    },
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    price: { monthly: 199, yearly: 1990 },
    features: [
      { name: 'Everything in Pro', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'SSO & advanced security', included: true },
      { name: 'Custom branding', included: true },
      { name: 'SLA guarantees', included: true },
      { name: 'Training & onboarding', included: true },
      { name: 'Custom reporting', included: true },
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
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  trialEnd?: Date;
  usage: {
    lessonsThisMonth: number;
    aiQuestionsToday: number;
    certificationsThisMonth: number;
    ragSearchesToday: number;
    lastReset: Date;
  };
}

// Access control functions
export class AccessControl {
  private subscription: UserSubscription;

  constructor(subscription: UserSubscription) {
    this.subscription = subscription;
  }

  canAccess(feature: string): boolean {
    const plan = PRICING_PLANS[this.subscription.tier];
    
    switch (feature) {
      case 'lessons':
        return plan.limits.lessonsPerMonth === -1 || 
               this.subscription.usage.lessonsThisMonth < plan.limits.lessonsPerMonth;
      case 'aiQuestions':
        return plan.limits.aiQuestionsPerDay === -1 || 
               this.subscription.usage.aiQuestionsToday < plan.limits.aiQuestionsPerDay;
      case 'certifications':
        return plan.limits.certificationsPerMonth > 0;
      case 'ragSearch':
        return plan.limits.ragSearchesPerDay === -1 || 
               this.subscription.usage.ragSearchesToday < plan.limits.ragSearchesPerDay;
      case 'downloadableResources':
        return plan.limits.downloadableResources;
      case 'prioritySupport':
        return plan.limits.prioritySupport;
      case 'apiAccess':
        return plan.limits.apiAccess;
      case 'whitelabel':
        return plan.limits.whitelabel;
      case 'customBranding':
        return plan.limits.customBranding;
      case 'enterpriseSSO':
        return plan.limits.enterpriseSSO;
      default:
        return false;
    }
  }

  hasReachedLimit(feature: string): boolean {
    return !this.canAccess(feature);
  }

  getRemainingUsage(feature: string): number {
    const plan = PRICING_PLANS[this.subscription.tier];
    
    switch (feature) {
      case 'lessons':
        return plan.limits.lessonsPerMonth === -1 ? -1 : 
               Math.max(0, plan.limits.lessonsPerMonth - this.subscription.usage.lessonsThisMonth);
      case 'aiQuestions':
        return plan.limits.aiQuestionsPerDay === -1 ? -1 : 
               Math.max(0, plan.limits.aiQuestionsPerDay - this.subscription.usage.aiQuestionsToday);
      case 'ragSearch':
        return plan.limits.ragSearchesPerDay === -1 ? -1 : 
               Math.max(0, plan.limits.ragSearchesPerDay - this.subscription.usage.ragSearchesToday);
      default:
        return 0;
    }
  }

  suggestUpgrade(): PricingTier | null {
    const currentTier = this.subscription.tier;
    
    if (currentTier === 'free') return 'starter';
    if (currentTier === 'starter') return 'pro';
    if (currentTier === 'pro') return 'enterprise';
    
    return null;
  }
}

// Helper functions for pricing calculations
export function getSavings(plan: PricingPlan): number {
  if (plan.price.monthly === 0) return 0;
  const monthlyTotal = plan.price.monthly * 12;
  return monthlyTotal - plan.price.yearly;
}

export function getSavingsPercentage(plan: PricingPlan): number {
  if (plan.price.monthly === 0) return 0;
  const monthlyTotal = plan.price.monthly * 12;
  const savings = monthlyTotal - plan.price.yearly;
  return Math.round((savings / monthlyTotal) * 100);
}

// Paywall message generator
export function getPaywallMessage(currentTier: PricingTier, feature: string, suggestedTier: PricingTier) {
  const messages = {
    free: {
      certifications: {
        title: "Unlock Professional Certifications",
        message: "Get industry-recognized certificates to validate your AI expertise.",
        suggestedPlan: PRICING_PLANS[suggestedTier]
      },
      premiumLessons: {
        title: "Access Premium Lessons",
        message: "Unlock 15 advanced lessons covering deep learning, neural networks, and more.",
        suggestedPlan: PRICING_PLANS[suggestedTier]
      },
      unlimited: {
        title: "Remove Usage Limits",
        message: "Get unlimited access to all AI questions, lessons, and searches.",
        suggestedPlan: PRICING_PLANS[suggestedTier]
      }
    },
    starter: {
      prioritySupport: {
        title: "Get Priority Support",
        message: "Jump the queue with priority email support and faster response times.",
        suggestedPlan: PRICING_PLANS[suggestedTier]
      },
      apiAccess: {
        title: "Unlock API Access",
        message: "Integrate AI Mind OS with your applications using our powerful API.",
        suggestedPlan: PRICING_PLANS[suggestedTier]
      },
      whitelabel: {
        title: "White-label Solutions",
        message: "Remove our branding and customize the platform for your organization.",
        suggestedPlan: PRICING_PLANS[suggestedTier]
      }
    },
    pro: {
      dedicatedSupport: {
        title: "Dedicated Support Team",
        message: "Get a dedicated support manager and guaranteed response times.",
        suggestedPlan: PRICING_PLANS[suggestedTier]
      },
      enterpriseSSO: {
        title: "Enterprise Security",
        message: "Advanced security features including SSO and compliance tools.",
        suggestedPlan: PRICING_PLANS[suggestedTier]
      }
    }
  };

  return messages[currentTier]?.[feature] || messages[currentTier]?.unlimited || {
    title: "Upgrade Required",
    message: "This feature requires a higher tier plan.",
    suggestedPlan: PRICING_PLANS[suggestedTier]
  };
}

// Free tier engagement hooks
export const FREE_TIER_HOOKS = {
  lessonComplete: {
    title: "🎉 Lesson Complete!",
    message: "You're making great progress! Ready to accelerate your learning?",
    benefits: ["Unlimited lessons", "All certifications", "Premium content"],
    urgency: "Join 10,000+ students who upgraded to unlock their full potential",
    cta: "Unlock All Lessons"
  },
  aiQuestionLimit: {
    title: "💭 Daily AI Questions Used",
    message: "You've reached your daily limit of 5 AI questions.",
    benefits: ["Unlimited AI questions", "Advanced AI models", "Priority processing"],
    urgency: "Don't let limits slow your learning momentum",
    cta: "Get Unlimited Access"
  },
  ragSearchLimit: {
    title: "🔍 Search Limit Reached",
    message: "You've used all 3 daily knowledge searches.",
    benefits: ["Unlimited searches", "Advanced search filters", "Faster results"],
    urgency: "Keep exploring our knowledge base without limits",
    cta: "Upgrade for Unlimited Search"
  },
  certificationAttempt: {
    title: "🏆 Ready for Certification?",
    message: "Certifications are available in paid plans.",
    benefits: ["Industry-recognized certificates", "LinkedIn integration", "Career advancement"],
    urgency: "Stand out in your career with verified AI skills",
    cta: "Unlock Certifications"
  }
} as const;

// Subscription management functions
export function createSubscription(userId: string, tier: PricingTier): UserSubscription {
  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  return {
    userId,
    tier,
    status: 'trialing',
    currentPeriodStart: now,
    currentPeriodEnd: nextMonth,
    cancelAtPeriodEnd: false,
    trialEnd: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
    usage: {
      lessonsThisMonth: 0,
      aiQuestionsToday: 0,
      certificationsThisMonth: 0,
      ragSearchesToday: 0,
      lastReset: now,
    },
  };
}

export function updateUsage(subscription: UserSubscription, feature: string, increment: number = 1): UserSubscription {
  const updated = { ...subscription };
  const now = new Date();
  
  // Reset daily counters if it's a new day
  if (now.toDateString() !== subscription.usage.lastReset.toDateString()) {
    updated.usage.aiQuestionsToday = 0;
    updated.usage.ragSearchesToday = 0;
    updated.usage.lastReset = now;
  }
  
  // Reset monthly counters if it's a new month
  if (now.getMonth() !== subscription.usage.lastReset.getMonth() || 
      now.getFullYear() !== subscription.usage.lastReset.getFullYear()) {
    updated.usage.lessonsThisMonth = 0;
    updated.usage.certificationsThisMonth = 0;
  }

  switch (feature) {
    case 'lessons':
      updated.usage.lessonsThisMonth += increment;
      break;
    case 'aiQuestions':
      updated.usage.aiQuestionsToday += increment;
      break;
    case 'certifications':
      updated.usage.certificationsThisMonth += increment;
      break;
    case 'ragSearch':
      updated.usage.ragSearchesToday += increment;
      break;
  }

  return updated;
}

export function canUpgrade(currentTier: PricingTier, targetTier: PricingTier): boolean {
  const tierOrder: PricingTier[] = ['free', 'starter', 'pro', 'enterprise'];
  const currentIndex = tierOrder.indexOf(currentTier);
  const targetIndex = tierOrder.indexOf(targetTier);
  
  return targetIndex > currentIndex;
}

export function canDowngrade(currentTier: PricingTier, targetTier: PricingTier): boolean {
  const tierOrder: PricingTier[] = ['free', 'starter', 'pro', 'enterprise'];
  const currentIndex = tierOrder.indexOf(currentTier);
  const targetIndex = tierOrder.indexOf(targetTier);
  
  return targetIndex < currentIndex;
}
