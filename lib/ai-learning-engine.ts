import { OpenAI } from 'openai';

// Initialize OpenAI client for learning intelligence
const openai = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here'
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

export interface LearnerProfile {
  userId: string;
  name: string;
  email: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading' | 'mixed';
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  interests: string[];
  goals: string[];
  availableTime: number; // minutes per week
  preferredDifficulty: 'easy' | 'moderate' | 'challenging' | 'adaptive';
  completedLessons: string[];
  currentStreak: number;
  totalStudyTime: number; // minutes
  lastActiveDate: Date;
  performanceMetrics: {
    averageScore: number;
    completionRate: number;
    retentionRate: number;
    engagementScore: number;
  };
  preferences: {
    reminderFrequency: 'daily' | 'weekly' | 'custom' | 'none';
    studyTimePreference: 'morning' | 'afternoon' | 'evening' | 'flexible';
    contentFormat: 'text' | 'video' | 'audio' | 'interactive' | 'mixed';
    pacePreference: 'slow' | 'moderate' | 'fast' | 'adaptive';
  };
}

export interface LearningPath {
  id: string;
  userId: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
  estimatedDuration: number; // minutes
  totalLessons: number;
  completedLessons: number;
  progress: number; // percentage
  lessons: LearningPathLesson[];
  prerequisites: string[];
  learningObjectives: string[];
  createdAt: Date;
  updatedAt: Date;
  customizations: {
    adaptedForLearningStyle: boolean;
    difficultyAdjusted: boolean;
    contentPersonalized: boolean;
    scheduleOptimized: boolean;
  };
}

export interface LearningPathLesson {
  lessonId: string;
  title: string;
  description: string;
  duration: number; // minutes
  difficulty: number; // 1-10 scale
  prerequisites: string[];
  concepts: string[];
  isCompleted: boolean;
  score?: number;
  timeSpent?: number;
  adaptations: {
    contentFormat: string;
    difficultyLevel: string;
    additionalResources: string[];
  };
}

export interface LearningRecommendation {
  type: 'next-lesson' | 'review' | 'challenge' | 'break' | 'path-change';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  reasoning: string;
  actionItem: string;
  estimatedTime: number;
  lessonId?: string;
  pathId?: string;
  dueDate?: Date;
}

export interface LearningAnalytics {
  userId: string;
  totalPaths: number;
  activePaths: number;
  completedPaths: number;
  overallProgress: number;
  averageSessionTime: number;
  studyStreak: number;
  strongAreas: string[];
  improvementAreas: string[];
  learningVelocity: number; // lessons per week
  retentionScore: number;
  engagementTrend: 'increasing' | 'stable' | 'decreasing';
  recommendedActions: LearningRecommendation[];
}

class AILearningEngine {
  private static instance: AILearningEngine;
  private learnerProfiles: Map<string, LearnerProfile> = new Map();
  private learningPaths: Map<string, LearningPath> = new Map();
  private learningHistory: Map<string, Array<{
    action: string;
    timestamp: Date;
    data: Record<string, unknown>;
  }>> = new Map();

  static getInstance(): AILearningEngine {
    if (!AILearningEngine.instance) {
      AILearningEngine.instance = new AILearningEngine();
    }
    return AILearningEngine.instance;
  }

  // Create or update learner profile with AI-driven insights
  async createLearnerProfile(
    userId: string,
    basicInfo: {
      name: string;
      email: string;
      goals: string[];
      availableTime: number;
    },
    assessmentResults?: {
      skillLevel: number; // 1-10
      learningStylePreferences: string[];
      topicInterests: string[];
    }
  ): Promise<LearnerProfile> {
    try {
      // AI-powered learning style detection
      const learningStyle = await this.detectLearningStyle(
        assessmentResults?.learningStylePreferences || []
      );

      // AI-driven proficiency assessment
      const proficiencyLevel = this.determineProficiencyLevel(
        assessmentResults?.skillLevel || 5
      );

      // Generate AI recommendations for interests
      const enhancedInterests = await this.enhanceInterests(
        assessmentResults?.topicInterests || [],
        basicInfo.goals
      );

      const profile: LearnerProfile = {
        userId,
        name: basicInfo.name,
        email: basicInfo.email,
        learningStyle,
        proficiencyLevel,
        interests: enhancedInterests,
        goals: basicInfo.goals,
        availableTime: basicInfo.availableTime,
        preferredDifficulty: 'adaptive',
        completedLessons: [],
        currentStreak: 0,
        totalStudyTime: 0,
        lastActiveDate: new Date(),
        performanceMetrics: {
          averageScore: 0,
          completionRate: 0,
          retentionRate: 0,
          engagementScore: 0
        },
        preferences: {
          reminderFrequency: 'daily',
          studyTimePreference: 'flexible',
          contentFormat: learningStyle === 'visual' ? 'video' : 
                        learningStyle === 'auditory' ? 'audio' : 'mixed',
          pacePreference: 'adaptive'
        }
      };

      this.learnerProfiles.set(userId, profile);
      this.trackLearningAction(userId, 'profile_created', { profile });

      return profile;
    } catch (error) {
      console.error('Learner Profile Creation Error:', error);
      throw new Error('Failed to create learner profile.');
    }
  }

  // Generate personalized learning path with AI optimization
  async generatePersonalizedPath(
    userId: string,
    pathGoal: string,
    targetDuration?: number, // in weeks
    specificTopics?: string[]
  ): Promise<LearningPath> {
    try {
      const profile = this.learnerProfiles.get(userId);
      if (!profile) {
        throw new Error('Learner profile not found. Please create a profile first.');
      }

      // AI-powered path generation
      const pathStructure = await this.generatePathStructure(
        pathGoal,
        profile,
        targetDuration,
        specificTopics
      );

      // Create lessons with AI adaptations
      const lessons = await this.generateAdaptiveLessons(
        pathStructure.lessons,
        profile
      );

      const learningPath: LearningPath = {
        id: `path_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        title: pathStructure.title,
        description: pathStructure.description,
        difficulty: pathStructure.difficulty,
        estimatedDuration: pathStructure.estimatedDuration,
        totalLessons: lessons.length,
        completedLessons: 0,
        progress: 0,
        lessons,
        prerequisites: pathStructure.prerequisites,
        learningObjectives: pathStructure.learningObjectives,
        createdAt: new Date(),
        updatedAt: new Date(),
        customizations: {
          adaptedForLearningStyle: true,
          difficultyAdjusted: true,
          contentPersonalized: true,
          scheduleOptimized: true
        }
      };

      this.learningPaths.set(learningPath.id, learningPath);
      this.trackLearningAction(userId, 'path_generated', { 
        pathId: learningPath.id, 
        goal: pathGoal,
        lessonCount: lessons.length 
      });

      return learningPath;
    } catch (error) {
      console.error('Personalized Path Generation Error:', error);
      throw new Error('Failed to generate personalized learning path.');
    }
  }

  // Get intelligent learning recommendations
  async getPersonalizedRecommendations(userId: string): Promise<LearningRecommendation[]> {
    try {
      const profile = this.learnerProfiles.get(userId);
      if (!profile) {
        return [];
      }

      const userPaths = Array.from(this.learningPaths.values())
        .filter(path => path.userId === userId);

      const recommendations: LearningRecommendation[] = [];

      // AI-powered recommendation generation
      if (openai) {
        const aiRecommendations = await this.generateAIRecommendations(profile, userPaths);
        recommendations.push(...aiRecommendations);
      }

      // Rule-based recommendations
      const ruleBasedRecommendations = this.generateRuleBasedRecommendations(profile, userPaths);
      recommendations.push(...ruleBasedRecommendations);

      // Sort by priority and relevance
      return recommendations
        .sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        })
        .slice(0, 10); // Top 10 recommendations

    } catch (error) {
      console.error('Recommendation Generation Error:', error);
      return [];
    }
  }

  // Adaptive difficulty adjustment based on performance
  async adaptPathDifficulty(pathId: string, performanceData: {
    recentScores: number[];
    timeSpentPerLesson: number[];
    strugglingConcepts: string[];
  }): Promise<LearningPath> {
    try {
      const path = this.learningPaths.get(pathId);
      if (!path) {
        throw new Error('Learning path not found.');
      }

      const profile = this.learnerProfiles.get(path.userId);
      if (!profile) {
        throw new Error('Learner profile not found.');
      }

      // AI-driven difficulty analysis
      const difficultyAdjustment = await this.calculateDifficultyAdjustment(
        performanceData,
        profile
      );

      // Apply adjustments to upcoming lessons
      path.lessons = path.lessons.map((lesson, index) => {
        if (!lesson.isCompleted && index >= path.completedLessons) {
          lesson.difficulty = Math.max(1, Math.min(10, 
            lesson.difficulty + difficultyAdjustment
          ));
          
          // Adapt content format based on struggles
          if (performanceData.strugglingConcepts.some(concept => 
            lesson.concepts.includes(concept)
          )) {
            lesson.adaptations.additionalResources.push(
              `Supplementary materials for ${lesson.concepts.join(', ')}`
            );
          }
        }
        return lesson;
      });

      path.updatedAt = new Date();
      this.learningPaths.set(pathId, path);

      this.trackLearningAction(path.userId, 'difficulty_adapted', {
        pathId,
        adjustment: difficultyAdjustment,
        strugglingConcepts: performanceData.strugglingConcepts
      });

      return path;
    } catch (error) {
      console.error('Difficulty Adaptation Error:', error);
      throw new Error('Failed to adapt path difficulty.');
    }
  }

  // Track learning progress and update analytics
  async updateLearningProgress(
    userId: string,
    pathId: string,
    lessonId: string,
    progressData: {
      completed: boolean;
      score?: number;
      timeSpent: number;
      conceptsLearned: string[];
      difficulties?: string[];
    }
  ): Promise<void> {
    try {
      const path = this.learningPaths.get(pathId);
      const profile = this.learnerProfiles.get(userId);

      if (!path || !profile) {
        throw new Error('Path or profile not found.');
      }

      // Update lesson progress
      const lessonIndex = path.lessons.findIndex(l => l.lessonId === lessonId);
      if (lessonIndex !== -1) {
        path.lessons[lessonIndex].isCompleted = progressData.completed;
        path.lessons[lessonIndex].score = progressData.score;
        path.lessons[lessonIndex].timeSpent = progressData.timeSpent;

        if (progressData.completed) {
          path.completedLessons++;
          profile.completedLessons.push(lessonId);
        }
      }

      // Update path progress
      path.progress = (path.completedLessons / path.totalLessons) * 100;
      path.updatedAt = new Date();

      // Update profile metrics
      profile.totalStudyTime += progressData.timeSpent;
      profile.lastActiveDate = new Date();

      if (progressData.score) {
        const scores = path.lessons
          .filter(l => l.isCompleted && l.score)
          .map(l => l.score!);
        profile.performanceMetrics.averageScore = 
          scores.reduce((sum, score) => sum + score, 0) / scores.length;
      }

      // Calculate streak
      profile.currentStreak = this.calculateStreak(userId);

      // Update engagement score based on AI analysis
      profile.performanceMetrics.engagementScore = 
        await this.calculateEngagementScore(userId, progressData);

      // Store updates
      this.learningPaths.set(pathId, path);
      this.learnerProfiles.set(userId, profile);

      this.trackLearningAction(userId, 'progress_updated', {
        pathId,
        lessonId,
        ...progressData
      });

    } catch (error) {
      console.error('Progress Update Error:', error);
      throw new Error('Failed to update learning progress.');
    }
  }

  // Get comprehensive learning analytics
  getLearningAnalytics(userId: string): LearningAnalytics {
    const profile = this.learnerProfiles.get(userId);
    const userPaths = Array.from(this.learningPaths.values())
      .filter(path => path.userId === userId);

    if (!profile) {
      throw new Error('Learner profile not found.');
    }

    const completedPaths = userPaths.filter(path => path.progress === 100).length;
    const activePaths = userPaths.filter(path => path.progress > 0 && path.progress < 100).length;
    const overallProgress = userPaths.length > 0 
      ? userPaths.reduce((sum, path) => sum + path.progress, 0) / userPaths.length 
      : 0;

    // Calculate learning velocity (lessons per week)
    const recentLessons = profile.completedLessons.filter(() => {
      // In a real implementation, you'd have lesson completion timestamps
      return true; // Simplified for now
    }).length;

    const analytics: LearningAnalytics = {
      userId,
      totalPaths: userPaths.length,
      activePaths,
      completedPaths,
      overallProgress,
      averageSessionTime: profile.totalStudyTime / Math.max(profile.completedLessons.length, 1),
      studyStreak: profile.currentStreak,
      strongAreas: this.identifyStrongAreas(profile, userPaths),
      improvementAreas: this.identifyImprovementAreas(profile, userPaths),
      learningVelocity: recentLessons,
      retentionScore: profile.performanceMetrics.retentionRate,
      engagementTrend: this.calculateEngagementTrend(userId),
      recommendedActions: []
    };

    return analytics;
  }

  // Get learner profile
  getLearnerProfile(userId: string): LearnerProfile | undefined {
    return this.learnerProfiles.get(userId);
  }

  // Get learning paths for user
  getUserLearningPaths(userId: string): LearningPath[] {
    return Array.from(this.learningPaths.values())
      .filter(path => path.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  // Private helper methods
  private async detectLearningStyle(
    preferences: string[]
  ): Promise<LearnerProfile['learningStyle']> {
    if (!openai || preferences.length === 0) {
      return 'mixed';
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an educational psychologist expert in learning styles. Analyze the preferences and determine the primary learning style: visual, auditory, kinesthetic, reading, or mixed.'
          },
          {
            role: 'user',
            content: `Analyze these learning preferences and determine the primary learning style: ${preferences.join(', ')}`
          }
        ],
        max_tokens: 50,
        temperature: 0.3
      });

      const result = response.choices[0]?.message?.content?.toLowerCase() || 'mixed';
      
      if (['visual', 'auditory', 'kinesthetic', 'reading'].includes(result)) {
        return result as LearnerProfile['learningStyle'];
      }
      
      return 'mixed';
    } catch {
      return 'mixed';
    }
  }

  private determineProficiencyLevel(skillLevel: number): LearnerProfile['proficiencyLevel'] {
    if (skillLevel <= 3) return 'beginner';
    if (skillLevel <= 6) return 'intermediate';
    if (skillLevel <= 8) return 'advanced';
    return 'expert';
  }

  private async enhanceInterests(
    baseInterests: string[],
    goals: string[]
  ): Promise<string[]> {
    if (!openai) {
      return baseInterests;
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an AI education specialist. Given basic interests and goals, suggest related AI/ML topics that would be valuable to learn. Return as a comma-separated list.'
          },
          {
            role: 'user',
            content: `Base interests: ${baseInterests.join(', ')}. Goals: ${goals.join(', ')}. Suggest 5-8 related AI/ML learning topics.`
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      });

      const suggestions = response.choices[0]?.message?.content
        ?.split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0) || [];

      return [...new Set([...baseInterests, ...suggestions])].slice(0, 10);
    } catch {
      return baseInterests;
    }
  }

  private async generatePathStructure(
    goal: string,
    profile: LearnerProfile,
    targetDuration?: number,
    specificTopics?: string[]
  ): Promise<{
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
    estimatedDuration: number;
    prerequisites: string[];
    learningObjectives: string[];
    lessons: Array<{ title: string; concepts: string[]; duration: number }>;
  }> {
    if (!openai) {
      // Fallback structure
      return {
        title: `Learning Path: ${goal}`,
        description: `Personalized learning path for ${goal}`,
        difficulty: profile.proficiencyLevel as 'beginner' | 'intermediate' | 'advanced',
        estimatedDuration: targetDuration ? targetDuration * 60 : 300, // 5 hours default
        prerequisites: [],
        learningObjectives: [`Master ${goal}`, 'Apply concepts practically'],
        lessons: [
          { title: `Introduction to ${goal}`, concepts: ['basics'], duration: 30 },
          { title: `Advanced ${goal}`, concepts: ['advanced'], duration: 45 }
        ]
      };
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert AI curriculum designer. Create a structured learning path based on the goal, learner profile, and requirements.

Return a JSON object with:
- title: Clear, engaging title
- description: 2-3 sentence description
- difficulty: beginner/intermediate/advanced/mixed
- estimatedDuration: total minutes
- prerequisites: array of required knowledge
- learningObjectives: array of specific objectives
- lessons: array of lessons with title, concepts array, and duration

Adapt for learning style: ${profile.learningStyle}, proficiency: ${profile.proficiencyLevel}`
          },
          {
            role: 'user',
            content: `Create a learning path for: "${goal}"
            ${specificTopics ? `Specific topics to include: ${specificTopics.join(', ')}` : ''}
            ${targetDuration ? `Target duration: ${targetDuration} weeks` : ''}
            Available time per week: ${profile.availableTime} minutes
            Interests: ${profile.interests.join(', ')}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        try {
          return JSON.parse(content);
        } catch {
          // Fallback if JSON parsing fails
          return {
            title: `AI Learning Path: ${goal}`,
            description: `Comprehensive personalized learning path designed for ${goal} mastery.`,
            difficulty: profile.proficiencyLevel as 'beginner' | 'intermediate' | 'advanced',
            estimatedDuration: targetDuration ? targetDuration * 60 : 360,
            prerequisites: profile.proficiencyLevel === 'beginner' ? [] : ['Basic AI knowledge'],
            learningObjectives: [
              `Understand core concepts of ${goal}`,
              `Apply ${goal} in practical scenarios`,
              'Build confidence in advanced topics'
            ],
            lessons: [
              { title: `Foundations of ${goal}`, concepts: ['fundamentals', 'theory'], duration: 45 },
              { title: `Practical ${goal} Applications`, concepts: ['applications', 'examples'], duration: 60 },
              { title: `Advanced ${goal} Techniques`, concepts: ['advanced', 'optimization'], duration: 75 }
            ]
          };
        }
      }
    } catch (error) {
      console.error('Path structure generation error:', error);
    }

    // Final fallback
    return {
      title: `Learning Path: ${goal}`,
      description: `Structured learning path for ${goal}`,
      difficulty: 'mixed',
      estimatedDuration: 300,
      prerequisites: [],
      learningObjectives: [`Master ${goal}`],
      lessons: [{ title: goal, concepts: ['general'], duration: 60 }]
    };
  }

  private async generateAdaptiveLessons(
    lessonStructures: Array<{ title: string; concepts: string[]; duration: number }>,
    profile: LearnerProfile
  ): Promise<LearningPathLesson[]> {
    return lessonStructures.map((structure, index) => ({
      lessonId: `lesson_${Date.now()}_${index}`,
      title: structure.title,
      description: `Learn about ${structure.concepts.join(', ')}`,
      duration: structure.duration,
      difficulty: this.calculateLessonDifficulty(profile.proficiencyLevel, index),
      prerequisites: index > 0 ? [`lesson_${Date.now()}_${index - 1}`] : [],
      concepts: structure.concepts,
      isCompleted: false,
      adaptations: {
        contentFormat: profile.preferences.contentFormat,
        difficultyLevel: profile.preferredDifficulty,
        additionalResources: []
      }
    }));
  }

  private calculateLessonDifficulty(proficiency: string, lessonIndex: number): number {
    const baseLevel = {
      beginner: 2,
      intermediate: 4,
      advanced: 6,
      expert: 8
    }[proficiency] || 4;

    // Gradually increase difficulty
    return Math.min(10, baseLevel + Math.floor(lessonIndex / 2));
  }

  private async generateAIRecommendations(
    profile: LearnerProfile,
    _paths: LearningPath[]
  ): Promise<LearningRecommendation[]> {
    if (!openai) return [];

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an AI learning advisor. Generate personalized learning recommendations based on the learner profile and progress. Return as JSON array with type, priority, title, description, reasoning, actionItem, estimatedTime fields.'
          },
          {
            role: 'user',
            content: `Profile: ${JSON.stringify({
              proficiency: profile.proficiencyLevel,
              completedLessons: profile.completedLessons.length,
              averageScore: profile.performanceMetrics.averageScore,
              interests: profile.interests,
              goals: profile.goals
            })}
            
            Active paths: ${_paths.length}
            Generate 3-5 personalized recommendations.`
          }
        ],
        max_tokens: 800,
        temperature: 0.7
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        try {
          return JSON.parse(content);
        } catch {
          return [];
        }
      }
    } catch (error) {
      console.error('AI recommendations error:', error);
    }

    return [];
  }

  private generateRuleBasedRecommendations(
    profile: LearnerProfile,
    paths: LearningPath[]
  ): LearningRecommendation[] {
    const recommendations: LearningRecommendation[] = [];

    // Use paths for future path-based recommendations
    void paths;

    // Streak maintenance
    if (profile.currentStreak > 0) {
      recommendations.push({
        type: 'next-lesson',
        priority: 'high',
        title: 'Maintain Your Streak!',
        description: `Keep your ${profile.currentStreak}-day streak going`,
        reasoning: 'Consistent daily practice is key to learning success',
        actionItem: 'Complete your next lesson today',
        estimatedTime: 30
      });
    }

    // Low completion rate
    if (profile.performanceMetrics.completionRate < 0.7) {
      recommendations.push({
        type: 'review',
        priority: 'medium',
        title: 'Review Previous Materials',
        description: 'Strengthen your foundation before moving forward',
        reasoning: 'Low completion rate suggests concepts need reinforcement',
        actionItem: 'Review and practice previous lessons',
        estimatedTime: 45
      });
    }

    // Challenge for high performers
    if (profile.performanceMetrics.averageScore > 0.9) {
      recommendations.push({
        type: 'challenge',
        priority: 'low',
        title: 'Ready for a Challenge?',
        description: 'Try advanced topics to accelerate your learning',
        reasoning: 'High performance indicates readiness for more complex material',
        actionItem: 'Explore advanced learning paths',
        estimatedTime: 60
      });
    }

    return recommendations;
  }

  private async calculateDifficultyAdjustment(
    performanceData: {
      recentScores: number[];
      timeSpentPerLesson: number[];
      strugglingConcepts: string[];
    },
    _profile: LearnerProfile
  ): Promise<number> {
    // Profile could be used for personalized difficulty adjustments
    void _profile;
    
    const avgScore = performanceData.recentScores.reduce((a, b) => a + b, 0) / performanceData.recentScores.length;
    const avgTime = performanceData.timeSpentPerLesson.reduce((a, b) => a + b, 0) / performanceData.timeSpentPerLesson.length;
    
    let adjustment = 0;

    // Score-based adjustment
    if (avgScore < 0.6) adjustment -= 1; // Make easier
    else if (avgScore > 0.9) adjustment += 1; // Make harder

    // Time-based adjustment
    const expectedTime = 45; // Expected minutes per lesson
    if (avgTime > expectedTime * 1.5) adjustment -= 0.5; // Taking too long
    else if (avgTime < expectedTime * 0.5) adjustment += 0.5; // Too fast

    // Struggling concepts
    if (performanceData.strugglingConcepts.length > 2) adjustment -= 0.5;

    return Math.max(-2, Math.min(2, adjustment));
  }

  private calculateStreak(userId: string): number {
    // Simplified streak calculation - in production, use actual date tracking
    const profile = this.learnerProfiles.get(userId);
    if (!profile) return 0;

    const today = new Date();
    const lastActive = profile.lastActiveDate;
    const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff <= 1) {
      return profile.currentStreak + (daysDiff === 0 ? 0 : 1);
    }
    
    return 0; // Streak broken
  }

  private async calculateEngagementScore(
    _userId: string,
    progressData: { timeSpent: number; conceptsLearned: string[]; difficulties?: string[] }
  ): Promise<number> {
    // Simple engagement scoring based on multiple factors
    let score = 0.5; // Base score

    // Time engagement
    if (progressData.timeSpent > 30) score += 0.2;
    if (progressData.timeSpent > 60) score += 0.1;

    // Learning depth
    if (progressData.conceptsLearned.length > 3) score += 0.1;
    if (progressData.conceptsLearned.length > 5) score += 0.1;

    // Difficulty handling
    if (!progressData.difficulties || progressData.difficulties.length === 0) {
      score += 0.1; // No reported difficulties
    }

    return Math.min(1, score);
  }

  private identifyStrongAreas(profile: LearnerProfile, paths: LearningPath[]): string[] {
    // Analyze completed lessons and high scores to identify strengths
    const concepts = new Map<string, number>();
    
    paths.forEach(path => {
      path.lessons.forEach(lesson => {
        if (lesson.isCompleted && lesson.score && lesson.score > 0.8) {
          lesson.concepts.forEach(concept => {
            concepts.set(concept, (concepts.get(concept) || 0) + 1);
          });
        }
      });
    });

    return Array.from(concepts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([concept]) => concept);
  }

  private identifyImprovementAreas(profile: LearnerProfile, paths: LearningPath[]): string[] {
    // Analyze low scores and incomplete lessons to identify improvement areas
    const concepts = new Map<string, number>();
    
    paths.forEach(path => {
      path.lessons.forEach(lesson => {
        if ((lesson.isCompleted && lesson.score && lesson.score < 0.6) || !lesson.isCompleted) {
          lesson.concepts.forEach(concept => {
            concepts.set(concept, (concepts.get(concept) || 0) + 1);
          });
        }
      });
    });

    return Array.from(concepts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([concept]) => concept);
  }

  private calculateEngagementTrend(userId: string): 'increasing' | 'stable' | 'decreasing' {
    // Simplified trend calculation - in production, analyze historical data
    const profile = this.learnerProfiles.get(userId);
    if (!profile) return 'stable';

    // Use engagement score as trend indicator
    if (profile.performanceMetrics.engagementScore > 0.8) return 'increasing';
    if (profile.performanceMetrics.engagementScore < 0.4) return 'decreasing';
    return 'stable';
  }

  private trackLearningAction(
    userId: string,
    action: string,
    data: Record<string, unknown>
  ): void {
    const history = this.learningHistory.get(userId) || [];
    history.push({
      action,
      timestamp: new Date(),
      data
    });
    
    // Keep only last 1000 actions
    if (history.length > 1000) {
      history.splice(0, history.length - 1000);
    }
    
    this.learningHistory.set(userId, history);
  }
}

// Export singleton instance
export const aiLearningEngine = AILearningEngine.getInstance();

// React Hook for AI Learning Engine Integration
export function useAILearning() {
  const createProfile = async (
    userId: string,
    basicInfo: {
      name: string;
      email: string;
      goals: string[];
      availableTime: number;
    },
    assessmentResults?: {
      skillLevel: number;
      learningStylePreferences: string[];
      topicInterests: string[];
    }
  ) => {
    return await aiLearningEngine.createLearnerProfile(userId, basicInfo, assessmentResults);
  };

  const generatePath = async (
    userId: string,
    goal: string,
    targetDuration?: number,
    specificTopics?: string[]
  ) => {
    return await aiLearningEngine.generatePersonalizedPath(userId, goal, targetDuration, specificTopics);
  };

  const getRecommendations = async (userId: string) => {
    return await aiLearningEngine.getPersonalizedRecommendations(userId);
  };

  const updateProgress = async (
    userId: string,
    pathId: string,
    lessonId: string,
    progressData: {
      completed: boolean;
      score?: number;
      timeSpent: number;
      conceptsLearned: string[];
      difficulties?: string[];
    }
  ) => {
    return await aiLearningEngine.updateLearningProgress(userId, pathId, lessonId, progressData);
  };

  const adaptDifficulty = async (
    pathId: string,
    performanceData: {
      recentScores: number[];
      timeSpentPerLesson: number[];
      strugglingConcepts: string[];
    }
  ) => {
    return await aiLearningEngine.adaptPathDifficulty(pathId, performanceData);
  };

  const getProfile = (userId: string) => aiLearningEngine.getLearnerProfile(userId);
  const getPaths = (userId: string) => aiLearningEngine.getUserLearningPaths(userId);
  const getAnalytics = (userId: string) => aiLearningEngine.getLearningAnalytics(userId);

  return {
    createProfile,
    generatePath,
    getRecommendations,
    updateProgress,
    adaptDifficulty,
    getProfile,
    getPaths,
    getAnalytics
  };
}

// Export main AI learning engine
export default aiLearningEngine;
