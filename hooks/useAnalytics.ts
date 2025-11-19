'use client';

import { useEffect, useCallback } from 'react';
import { trackEvent } from '../lib/analytics';

// Custom hook for page tracking
export const usePageTracking = (pageName: string, additionalData?: Record<string, string | number | boolean>) => {
  useEffect(() => {
    trackEvent('page_view', 'user', { 
      page: pageName,
      ...additionalData 
    });
  }, [pageName, additionalData]);
};

// Custom hook for lesson tracking
export const useLessonTracking = () => {
  const trackLessonStart = useCallback((lessonId: string) => {
    trackEvent('lesson_start', 'lesson', { lessonId });
  }, []);

  const trackLessonProgress = useCallback((lessonId: string, completionPercentage: number, timeSpent: number) => {
    trackEvent('lesson_progress', 'lesson', { 
      lessonId, 
      completionPercentage, 
      timeSpent 
    });
  }, []);

  const trackLessonComplete = useCallback((lessonId: string, timeSpent: number) => {
    trackEvent('lesson_complete', 'lesson', { 
      lessonId, 
      timeSpent 
    });
  }, []);

  const trackLessonAbandon = useCallback((lessonId: string, completionPercentage: number, timeSpent: number) => {
    trackEvent('lesson_abandon', 'lesson', { 
      lessonId, 
      completionPercentage, 
      timeSpent 
    });
  }, []);

  return {
    trackLessonStart,
    trackLessonProgress,
    trackLessonComplete,
    trackLessonAbandon,
  };
};

// Custom hook for AI interaction tracking
export const useAITracking = () => {
  const trackAIInteraction = useCallback((
    question: string, 
    responseLength: number, 
    responseTime: number, 
    language: string = 'en',
    satisfaction?: number
  ) => {
    trackEvent('ai_interaction', 'ai', {
      question: question.substring(0, 100), // Truncate for privacy
      responseLength,
      responseTime,
      language,
      ...(satisfaction !== undefined && { satisfaction }),
    });
  }, []);

  const trackAISatisfaction = useCallback((interactionId: string, rating: number) => {
    trackEvent('ai_satisfaction', 'ai', {
      interactionId,
      rating,
    });
  }, []);

  return {
    trackAIInteraction,
    trackAISatisfaction,
  };
};

// Custom hook for certification tracking
export const useCertificationTracking = () => {
  const trackCertificationStart = useCallback((certificationId: string) => {
    trackEvent('certification_start', 'certification', { certificationId });
  }, []);

  const trackCertificationComplete = useCallback((certificationId: string, score: number, passed: boolean, timeSpent: number) => {
    trackEvent('certification_complete', 'certification', {
      certificationId,
      score,
      passed,
      timeSpent,
    });
  }, []);

  const trackQuestionAnswer = useCallback((questionId: string, correct: boolean, timeSpent: number) => {
    trackEvent('question_answer', 'certification', {
      questionId,
      correct,
      timeSpent,
    });
  }, []);

  return {
    trackCertificationStart,
    trackCertificationComplete,
    trackQuestionAnswer,
  };
};

// Custom hook for payment tracking
export const usePaymentTracking = () => {
  const trackCheckoutStart = useCallback((plan: string, amount: number) => {
    trackEvent('checkout_started', 'payment', { plan, amount });
  }, []);

  const trackPaymentComplete = useCallback((plan: string, amount: number, currency: string = 'USD') => {
    trackEvent('payment_completed', 'payment', { plan, amount, currency });
  }, []);

  const trackSubscriptionUpgrade = useCallback((fromPlan: string, toPlan: string, amount: number) => {
    trackEvent('subscription_upgraded', 'payment', { fromPlan, toPlan, amount });
  }, []);

  const trackSubscriptionCancel = useCallback((plan: string, reason?: string) => {
    trackEvent('subscription_cancelled', 'payment', { 
      plan, 
      ...(reason && { reason })
    });
  }, []);

  return {
    trackCheckoutStart,
    trackPaymentComplete,
    trackSubscriptionUpgrade,
    trackSubscriptionCancel,
  };
};

// Custom hook for gamification tracking
export const useGamificationTracking = () => {
  const trackXPEarned = useCallback((points: number, source: string) => {
    trackEvent('xp_earned', 'gamification', { points, source });
  }, []);

  const trackAchievementUnlocked = useCallback((achievementId: string, points: number) => {
    trackEvent('achievement_unlocked', 'gamification', { achievementId, points });
  }, []);

  const trackLevelUp = useCallback((newLevel: number, totalXP: number) => {
    trackEvent('level_up', 'gamification', { newLevel, totalXP });
  }, []);

  const trackBadgeEarned = useCallback((badgeId: string, category: string) => {
    trackEvent('badge_earned', 'gamification', { badgeId, category });
  }, []);

  return {
    trackXPEarned,
    trackAchievementUnlocked,
    trackLevelUp,
    trackBadgeEarned,
  };
};

// Custom hook for user engagement tracking
export const useEngagementTracking = () => {
  const trackButtonClick = useCallback((buttonName: string, location: string) => {
    trackEvent('button_click', 'user', { buttonName, location });
  }, []);

  const trackFeatureUsage = useCallback((featureName: string, duration?: number) => {
    trackEvent('feature_usage', 'user', { 
      featureName, 
      ...(duration !== undefined && { duration })
    });
  }, []);

  const trackSearchQuery = useCallback((query: string, resultsCount: number) => {
    trackEvent('search_query', 'user', { 
      query: query.substring(0, 100), // Truncate for privacy
      resultsCount 
    });
  }, []);

  const trackErrorEncounter = useCallback((errorType: string, errorMessage: string, location: string) => {
    trackEvent('error_encountered', 'user', { 
      errorType, 
      errorMessage: errorMessage.substring(0, 200), // Truncate
      location 
    });
  }, []);

  return {
    trackButtonClick,
    trackFeatureUsage,
    trackSearchQuery,
    trackErrorEncounter,
  };
};

// Auto-track page visibility changes
export const useVisibilityTracking = (pageName: string) => {
  useEffect(() => {
    let startTime = Date.now();
    let isVisible = !document.hidden;

    const handleVisibilityChange = () => {
      const now = Date.now();
      const timeSpent = now - startTime;

      if (document.hidden && isVisible) {
        // Page became hidden
        trackEvent('page_blur', 'user', { page: pageName, timeSpent });
        isVisible = false;
      } else if (!document.hidden && !isVisible) {
        // Page became visible
        trackEvent('page_focus', 'user', { page: pageName });
        isVisible = true;
        startTime = now;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Track final time spent when component unmounts
      if (isVisible) {
        const timeSpent = Date.now() - startTime;
        trackEvent('page_unload', 'user', { page: pageName, timeSpent });
      }
    };
  }, [pageName]);
};

// Auto-track scroll depth
export const useScrollTracking = (pageName: string) => {
  useEffect(() => {
    let maxScrollDepth = 0;
    const trackingPoints = [25, 50, 75, 100]; // Percentage milestones
    const trackedPoints = new Set<number>();

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;

      maxScrollDepth = Math.max(maxScrollDepth, scrollPercent);

      // Track milestone points
      trackingPoints.forEach(point => {
        if (scrollPercent >= point && !trackedPoints.has(point)) {
          trackedPoints.add(point);
          trackEvent('scroll_depth', 'user', { 
            page: pageName, 
            depth: point 
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      
      // Track final max scroll depth
      trackEvent('max_scroll_depth', 'user', { 
        page: pageName, 
        maxDepth: Math.round(maxScrollDepth) 
      });
    };
  }, [pageName]);
};

// Performance tracking hook
export const usePerformanceTracking = (pageName: string) => {
  useEffect(() => {
    // Track page load performance
    const trackPerformance = () => {
      if ('performance' in window && 'getEntriesByType' in window.performance) {
        const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          trackEvent('page_performance', 'user', {
            page: pageName,
            loadTime: Math.round(navigation.loadEventEnd - navigation.fetchStart),
            domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
            firstContentfulPaint: Math.round(navigation.responseEnd - navigation.fetchStart),
          });
        }
      }
    };

    // Wait for page to fully load
    if (document.readyState === 'complete') {
      trackPerformance();
    } else {
      window.addEventListener('load', trackPerformance);
      return () => window.removeEventListener('load', trackPerformance);
    }
  }, [pageName]);
};
