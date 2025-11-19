// Analytics Event Types
export interface AnalyticsEvent {
  id: string;
  userId?: string;
  sessionId: string;
  event: string;
  category: 'user' | 'lesson' | 'certification' | 'payment' | 'ai' | 'gamification';
  properties: Record<string, string | number | boolean | undefined>;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
  country?: string;
  referrer?: string;
}

// User Behavior Tracking
export interface UserBehavior {
  userId: string;
  sessionId: string;
  pageViews: number;
  timeOnSite: number;
  bounceRate: boolean;
  conversionFunnel: {
    visited: boolean;
    engaged: boolean;
    started_lesson: boolean;
    completed_lesson: boolean;
    attempted_certification: boolean;
    purchased_subscription: boolean;
  };
  learningPattern: {
    preferredLanguage: string;
    averageSessionDuration: number;
    completionRate: number;
    strugglingTopics: string[];
    masteredTopics: string[];
  };
}

// Real-time Metrics
export interface RealTimeMetrics {
  activeUsers: number;
  concurrent_sessions: number;
  lessons_in_progress: number;
  certifications_active: number;
  ai_interactions_per_minute: number;
  revenue_per_hour: number;
  top_performing_content: string[];
  user_satisfaction_score: number;
}

// Revenue Analytics
export interface RevenueAnalytics {
  daily_revenue: number;
  monthly_recurring_revenue: number;
  customer_lifetime_value: number;
  churn_rate: number;
  conversion_rate: number;
  average_order_value: number;
  subscription_growth_rate: number;
  revenue_by_country: Record<string, number>;
  revenue_by_plan: Record<string, number>;
}

// AI Usage Analytics
export interface AIAnalytics {
  total_ai_interactions: number;
  average_response_time: number;
  user_satisfaction_rating: number;
  most_asked_questions: Array<{ question: string; count: number }>;
  ai_accuracy_score: number;
  language_usage_distribution: Record<string, number>;
  topic_popularity: Record<string, number>;
  prompt_effectiveness_score: number;
}

// Learning Analytics
export interface LearningAnalytics {
  completion_rates_by_lesson: Record<string, number>;
  average_time_per_lesson: Record<string, number>;
  certification_pass_rates: Record<string, number>;
  learning_path_effectiveness: Record<string, number>;
  knowledge_retention_score: number;
  skill_progression_rate: number;
  preferred_learning_times: Record<string, number>;
}

// Analytics Service Class
export class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private static instance: AnalyticsService;

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Track Events
  async track(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<void> {
    const analyticsEvent: AnalyticsEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...event,
    };

    this.events.push(analyticsEvent);

    // In production, send to analytics service
    if (process.env.NODE_ENV === 'production') {
      await this.sendToAnalyticsService(analyticsEvent);
    }

    // Real-time processing
    await this.processRealTimeEvent(analyticsEvent);
  }

  // Page View Tracking
  async trackPageView(
    userId: string | undefined,
    sessionId: string,
    page: string,
    referrer?: string
  ): Promise<void> {
    await this.track({
      userId,
      sessionId,
      event: 'page_view',
      category: 'user',
      properties: {
        page,
        referrer,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Lesson Interaction Tracking
  async trackLessonInteraction(
    userId: string | undefined,
    sessionId: string,
    lessonId: string,
    action: 'start' | 'progress' | 'complete' | 'abandon',
    timeSpent?: number,
    completionPercentage?: number
  ): Promise<void> {
    await this.track({
      userId,
      sessionId,
      event: `lesson_${action}`,
      category: 'lesson',
      properties: {
        lessonId,
        action,
        timeSpent,
        completionPercentage,
      },
    });
  }

  // AI Interaction Tracking
  async trackAIInteraction(
    userId: string | undefined,
    sessionId: string,
    question: string,
    response: string,
    responseTime: number,
    language: string,
    satisfaction?: number
  ): Promise<void> {
    await this.track({
      userId,
      sessionId,
      event: 'ai_interaction',
      category: 'ai',
      properties: {
        question: question.substring(0, 100), // Truncate for privacy
        responseLength: response.length,
        responseTime,
        language,
        satisfaction,
      },
    });
  }

  // Certification Tracking
  async trackCertificationAttempt(
    userId: string,
    sessionId: string,
    certificationId: string,
    score: number,
    passed: boolean,
    timeSpent: number
  ): Promise<void> {
    await this.track({
      userId,
      sessionId,
      event: 'certification_attempt',
      category: 'certification',
      properties: {
        certificationId,
        score,
        passed,
        timeSpent,
      },
    });
  }

  // Payment Tracking
  async trackPaymentEvent(
    userId: string,
    sessionId: string,
    event: 'checkout_started' | 'payment_completed' | 'subscription_upgraded' | 'subscription_cancelled',
    amount?: number,
    plan?: string,
    currency?: string
  ): Promise<void> {
    await this.track({
      userId,
      sessionId,
      event,
      category: 'payment',
      properties: {
        amount,
        plan,
        currency,
      },
    });
  }

  // Gamification Tracking
  async trackGamificationEvent(
    userId: string,
    sessionId: string,
    event: 'xp_earned' | 'achievement_unlocked' | 'level_up' | 'badge_earned',
    points?: number,
    achievementId?: string,
    level?: number
  ): Promise<void> {
    await this.track({
      userId,
      sessionId,
      event,
      category: 'gamification',
      properties: {
        points,
        achievementId,
        level,
      },
    });
  }

  // Get Real-time Metrics
  async getRealTimeMetrics(): Promise<RealTimeMetrics> {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const recentEvents = this.events.filter(e => e.timestamp >= oneHourAgo);

    return {
      activeUsers: new Set(recentEvents.map(e => e.userId).filter(Boolean)).size,
      concurrent_sessions: new Set(recentEvents.map(e => e.sessionId)).size,
      lessons_in_progress: recentEvents.filter(e => e.event === 'lesson_start').length,
      certifications_active: recentEvents.filter(e => e.event === 'certification_attempt').length,
      ai_interactions_per_minute: recentEvents.filter(e => e.event === 'ai_interaction').length / 60,
      revenue_per_hour: recentEvents
        .filter(e => e.event === 'payment_completed')
        .reduce((sum, e) => sum + (Number(e.properties.amount) || 0), 0),
      top_performing_content: this.getTopPerformingContent(recentEvents),
      user_satisfaction_score: this.calculateSatisfactionScore(recentEvents),
    };
  }

  // Get Revenue Analytics
  async getRevenueAnalytics(): Promise<RevenueAnalytics> {
    const paymentEvents = this.events.filter(e => e.category === 'payment');
    
    return {
      daily_revenue: this.calculateDailyRevenue(paymentEvents),
      monthly_recurring_revenue: this.calculateMRR(paymentEvents),
      customer_lifetime_value: this.calculateCLV(paymentEvents),
      churn_rate: this.calculateChurnRate(paymentEvents),
      conversion_rate: this.calculateConversionRate(),
      average_order_value: this.calculateAOV(paymentEvents),
      subscription_growth_rate: this.calculateGrowthRate(paymentEvents),
      revenue_by_country: this.getRevenueByCountry(paymentEvents),
      revenue_by_plan: this.getRevenueByPlan(paymentEvents),
    };
  }

  // Get AI Analytics
  async getAIAnalytics(): Promise<AIAnalytics> {
    const aiEvents = this.events.filter(e => e.category === 'ai');
    
    return {
      total_ai_interactions: aiEvents.length,
      average_response_time: this.calculateAverageResponseTime(aiEvents),
      user_satisfaction_rating: this.calculateAISatisfaction(aiEvents),
      most_asked_questions: this.getMostAskedQuestions(aiEvents),
      ai_accuracy_score: this.calculateAIAccuracy(aiEvents),
      language_usage_distribution: this.getLanguageDistribution(aiEvents),
      topic_popularity: this.getTopicPopularity(),
      prompt_effectiveness_score: this.calculatePromptEffectiveness(aiEvents),
    };
  }

  // Get Learning Analytics
  async getLearningAnalytics(): Promise<LearningAnalytics> {
    const lessonEvents = this.events.filter(e => e.category === 'lesson');
    const certificationEvents = this.events.filter(e => e.category === 'certification');
    
    return {
      completion_rates_by_lesson: this.calculateCompletionRates(lessonEvents),
      average_time_per_lesson: this.calculateAverageTimePerLesson(lessonEvents),
      certification_pass_rates: this.calculatePassRates(certificationEvents),
      learning_path_effectiveness: this.calculatePathEffectiveness(lessonEvents),
      knowledge_retention_score: this.calculateRetentionScore(lessonEvents),
      skill_progression_rate: this.calculateProgressionRate(lessonEvents),
      preferred_learning_times: this.getPreferredLearningTimes(lessonEvents),
    };
  }

  // Private helper methods
  private async sendToAnalyticsService(event: AnalyticsEvent): Promise<void> {
    // In production, send to external analytics service (Google Analytics, Mixpanel, etc.)
    console.log('Sending to analytics service:', event);
  }

  private async processRealTimeEvent(event: AnalyticsEvent): Promise<void> {
    // Process real-time events for immediate insights
    if (event.category === 'payment' && event.event === 'payment_completed') {
      // Trigger real-time revenue notifications
      await this.notifyRevenueEvent(event);
    }
  }

  private async notifyRevenueEvent(event: AnalyticsEvent): Promise<void> {
    // Send notifications for important revenue events
    console.log('Revenue event notification:', event);
  }

  private getTopPerformingContent(events: AnalyticsEvent[]): string[] {
    const lessonCounts = events
      .filter(e => e.event === 'lesson_complete')
      .reduce((acc, e) => {
        const lessonId = String(e.properties.lessonId || 'unknown');
        acc[lessonId] = (acc[lessonId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(lessonCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([lessonId]) => lessonId);
  }

  private calculateSatisfactionScore(events: AnalyticsEvent[]): number {
    const satisfactionEvents = events.filter(e => 
      e.category === 'ai' && e.properties.satisfaction !== undefined
    );
    
    if (satisfactionEvents.length === 0) return 0;
    
    const totalSatisfaction = satisfactionEvents.reduce(
      (sum, e) => sum + (Number(e.properties.satisfaction) || 0), 0
    );
    
    return totalSatisfaction / satisfactionEvents.length;
  }

  private calculateDailyRevenue(events: AnalyticsEvent[]): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return events
      .filter(e => e.event === 'payment_completed' && e.timestamp >= today)
      .reduce((sum, e) => sum + (Number(e.properties.amount) || 0), 0);
  }

  private calculateMRR(events: AnalyticsEvent[]): number {
    // Simplified MRR calculation
    const subscriptionEvents = events.filter(e => 
      e.event === 'payment_completed' && e.properties.plan
    );
    
    return subscriptionEvents.reduce((sum, e) => sum + (Number(e.properties.amount) || 0), 0);
  }

  private calculateCLV(events: AnalyticsEvent[]): number {
    // Simplified CLV calculation
    const avgOrderValue = this.calculateAOV(events);
    const avgOrderFrequency = events.filter(e => e.event === 'payment_completed').length / 30; // per month
    const avgCustomerLifespan = 12; // months
    
    return avgOrderValue * avgOrderFrequency * avgCustomerLifespan;
  }

  private calculateChurnRate(events: AnalyticsEvent[]): number {
    const cancellations = events.filter(e => e.event === 'subscription_cancelled').length;
    const totalSubscriptions = events.filter(e => e.event === 'payment_completed').length;
    
    return totalSubscriptions > 0 ? (cancellations / totalSubscriptions) * 100 : 0;
  }

  private calculateConversionRate(): number {
    const visitors = new Set(this.events.map(e => e.sessionId)).size;
    const conversions = this.events.filter(e => e.event === 'payment_completed').length;
    
    return visitors > 0 ? (conversions / visitors) * 100 : 0;
  }

  private calculateAOV(events: AnalyticsEvent[]): number {
    const paymentEvents = events.filter(e => e.event === 'payment_completed');
    if (paymentEvents.length === 0) return 0;
    
    const totalRevenue = paymentEvents.reduce((sum, e) => sum + (Number(e.properties.amount) || 0), 0);
    return totalRevenue / paymentEvents.length;
  }

  private calculateGrowthRate(events: AnalyticsEvent[]): number {
    // Simplified growth rate calculation
    const thisMonth = events.filter(e => 
      e.event === 'payment_completed' && 
      e.timestamp.getMonth() === new Date().getMonth()
    );
    
    const lastMonth = events.filter(e => 
      e.event === 'payment_completed' && 
      e.timestamp.getMonth() === new Date().getMonth() - 1
    );
    
    if (lastMonth.length === 0) return 0;
    return ((thisMonth.length - lastMonth.length) / lastMonth.length) * 100;
  }

  private getRevenueByCountry(events: AnalyticsEvent[]): Record<string, number> {
    return events
      .filter(e => e.event === 'payment_completed')
      .reduce((acc, e) => {
        const country = String(e.country || 'Unknown');
        acc[country] = (acc[country] || 0) + (Number(e.properties.amount) || 0);
        return acc;
      }, {} as Record<string, number>);
  }

  private getRevenueByPlan(events: AnalyticsEvent[]): Record<string, number> {
    return events
      .filter(e => e.event === 'payment_completed')
      .reduce((acc, e) => {
        const plan = String(e.properties.plan || 'Unknown');
        acc[plan] = (acc[plan] || 0) + (Number(e.properties.amount) || 0);
        return acc;
      }, {} as Record<string, number>);
  }

  private calculateAverageResponseTime(events: AnalyticsEvent[]): number {
    const responseTimes = events
      .filter(e => e.properties.responseTime !== undefined)
      .map(e => Number(e.properties.responseTime))
      .filter(time => !isNaN(time));
    
    if (responseTimes.length === 0) return 0;
    return responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
  }

  private calculateAISatisfaction(events: AnalyticsEvent[]): number {
    return this.calculateSatisfactionScore(events);
  }

  private getMostAskedQuestions(events: AnalyticsEvent[]): Array<{ question: string; count: number }> {
    const questionCounts = events
      .filter(e => e.properties.question && typeof e.properties.question === 'string')
      .reduce((acc, e) => {
        const question = String(e.properties.question);
        acc[question] = (acc[question] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(questionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([question, count]) => ({ question, count }));
  }

  private calculateAIAccuracy(events: AnalyticsEvent[]): number {
    // Simplified accuracy calculation based on satisfaction
    return this.calculateSatisfactionScore(events) * 20; // Convert to 0-100 scale
  }

  private getLanguageDistribution(events: AnalyticsEvent[]): Record<string, number> {
    return events
      .filter(e => e.properties.language && typeof e.properties.language === 'string')
      .reduce((acc, e) => {
        const lang = String(e.properties.language);
        acc[lang] = (acc[lang] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
  }

  private getTopicPopularity(): Record<string, number> {
    // Extract topics from lesson interactions
    const lessonEvents = this.events.filter(e => e.category === 'lesson');
    return lessonEvents.reduce((acc, e) => {
      const lessonId = String(e.properties.lessonId || 'unknown');
      acc[lessonId] = (acc[lessonId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private calculatePromptEffectiveness(events: AnalyticsEvent[]): number {
    // Simplified effectiveness based on satisfaction and response time
    const avgSatisfaction = this.calculateSatisfactionScore(events);
    const avgResponseTime = this.calculateAverageResponseTime(events);
    
    // Lower response time and higher satisfaction = better effectiveness
    return avgSatisfaction * (1000 / Math.max(avgResponseTime, 100));
  }

  private calculateCompletionRates(events: AnalyticsEvent[]): Record<string, number> {
    const startEvents = events.filter(e => e.event === 'lesson_start');
    const completeEvents = events.filter(e => e.event === 'lesson_complete');
    
    const rates: Record<string, number> = {};
    
    startEvents.forEach(e => {
      const lessonId = String(e.properties.lessonId || 'unknown');
      const starts = startEvents.filter(se => String(se.properties.lessonId) === lessonId).length;
      const completions = completeEvents.filter(ce => String(ce.properties.lessonId) === lessonId).length;
      
      rates[lessonId] = starts > 0 ? (completions / starts) * 100 : 0;
    });
    
    return rates;
  }

  private calculateAverageTimePerLesson(events: AnalyticsEvent[]): Record<string, number> {
    const lessonTimes: Record<string, number[]> = {};
    
    events
      .filter(e => e.properties.timeSpent !== undefined)
      .forEach(e => {
        const lessonId = String(e.properties.lessonId || 'unknown');
        const timeSpent = Number(e.properties.timeSpent);
        if (!isNaN(timeSpent)) {
          if (!lessonTimes[lessonId]) lessonTimes[lessonId] = [];
          lessonTimes[lessonId].push(timeSpent);
        }
      });
    
    const averages: Record<string, number> = {};
    Object.entries(lessonTimes).forEach(([lessonId, times]) => {
      averages[lessonId] = times.reduce((sum, time) => sum + time, 0) / times.length;
    });
    
    return averages;
  }

  private calculatePassRates(events: AnalyticsEvent[]): Record<string, number> {
    const attempts = events.filter(e => e.event === 'certification_attempt');
    const certificationRates: Record<string, { total: number; passed: number }> = {};
    
    attempts.forEach(e => {
      const certId = String(e.properties.certificationId || 'unknown');
      if (!certificationRates[certId]) {
        certificationRates[certId] = { total: 0, passed: 0 };
      }
      
      certificationRates[certId].total++;
      if (e.properties.passed === true) {
        certificationRates[certId].passed++;
      }
    });
    
    const rates: Record<string, number> = {};
    Object.entries(certificationRates).forEach(([certId, { total, passed }]) => {
      rates[certId] = total > 0 ? (passed / total) * 100 : 0;
    });
    
    return rates;
  }

  private calculatePathEffectiveness(events: AnalyticsEvent[]): Record<string, number> {
    // Simplified path effectiveness based on completion rates
    return this.calculateCompletionRates(events);
  }

  private calculateRetentionScore(events: AnalyticsEvent[]): number {
    const uniqueUsers = new Set(events.map(e => e.userId).filter(Boolean));
    const returningUsers = new Set();
    
    uniqueUsers.forEach(userId => {
      const userEvents = events.filter(e => e.userId === userId);
      const uniqueDays = new Set(userEvents.map(e => e.timestamp.toDateString()));
      
      if (uniqueDays.size > 1) {
        returningUsers.add(userId);
      }
    });
    
    return uniqueUsers.size > 0 ? (returningUsers.size / uniqueUsers.size) * 100 : 0;
  }

  private calculateProgressionRate(events: AnalyticsEvent[]): number {
    const completions = events.filter(e => e.event === 'lesson_complete');
    const uniqueUsers = new Set(completions.map(e => e.userId).filter(Boolean));
    
    let totalProgressions = 0;
    uniqueUsers.forEach(userId => {
      const userCompletions = completions.filter(e => e.userId === userId);
      totalProgressions += userCompletions.length;
    });
    
    return uniqueUsers.size > 0 ? totalProgressions / uniqueUsers.size : 0;
  }

  private getPreferredLearningTimes(events: AnalyticsEvent[]): Record<string, number> {
    const hourCounts: Record<string, number> = {};
    
    events.forEach(e => {
      const hour = e.timestamp.getHours();
      const timeSlot = `${hour}:00-${hour + 1}:00`;
      hourCounts[timeSlot] = (hourCounts[timeSlot] || 0) + 1;
    });
    
    return hourCounts;
  }
}

// Export singleton instance
export const analytics = AnalyticsService.getInstance();

// Client-side tracking utilities
export const trackEvent = async (
  event: string,
  category: AnalyticsEvent['category'],
  properties: Record<string, string | number | boolean> = {}
) => {
  if (typeof window !== 'undefined') {
    // Client-side tracking - send to API route
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        category,
        properties,
        sessionId: getSessionId(),
      }),
    });
  }
};

// Generate or get session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return 'server-session';
  
  let sessionId = localStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

// Page view tracking hook for React components
export const usePageTracking = (pageName: string) => {
  if (typeof window !== 'undefined') {
    trackEvent('page_view', 'user', { page: pageName });
  }
};
