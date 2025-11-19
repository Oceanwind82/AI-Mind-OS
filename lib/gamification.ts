// lib/gamification.ts
// Phase 4.3: Gamification System - Achievement badges, leaderboards, and retention mechanics

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Achievement Types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'completion' | 'streak' | 'mastery' | 'community' | 'milestone';
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: {
    type: 'lesson_completed' | 'streak_days' | 'score_achieved' | 'certification_earned' | 'referrals_made' | 'total_points';
    value: number;
    target?: string;
  };
  unlockedAt?: Date;
  progress?: number; // 0-100
}

// User Progress & Stats
export interface UserStats {
  userId: string;
  totalPoints: number;
  level: number;
  experiencePoints: number;
  currentStreak: number;
  longestStreak: number;
  lessonsCompleted: number;
  certificationsEarned: number;
  averageScore: number;
  studyTimeMinutes: number;
  lastActiveDate: Date;
  achievementsUnlocked: string[];
  badges: string[];
  rank?: number; // Global ranking
}

// Leaderboard Entry
export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  points: number;
  level: number;
  rank: number;
  streak: number;
  badge?: string; // Top badge to display
}

// Predefined Achievements System
export const ACHIEVEMENTS: Achievement[] = [
  // Learning Achievements
  {
    id: 'first_lesson',
    title: 'First Steps',
    description: 'Complete your first AI lesson',
    icon: '🎯',
    category: 'learning',
    points: 50,
    rarity: 'common',
    requirement: { type: 'lesson_completed', value: 1 }
  },
  {
    id: 'quick_learner',
    title: 'Quick Learner',
    description: 'Complete 5 lessons in one day',
    icon: '⚡',
    category: 'learning',
    points: 200,
    rarity: 'rare',
    requirement: { type: 'lesson_completed', value: 5 }
  },
  {
    id: 'ai_novice',
    title: 'AI Novice',
    description: 'Complete 10 AI lessons',
    icon: '🤖',
    category: 'completion',
    points: 300,
    rarity: 'rare',
    requirement: { type: 'lesson_completed', value: 10 }
  },
  {
    id: 'prompt_master',
    title: 'Prompt Master',
    description: 'Complete all prompt engineering lessons',
    icon: '🎭',
    category: 'mastery',
    points: 500,
    rarity: 'epic',
    requirement: { type: 'lesson_completed', value: 15, target: 'prompt-engineering' }
  },

  // Streak Achievements
  {
    id: 'consistency_champion',
    title: 'Consistency Champion',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    category: 'streak',
    points: 350,
    rarity: 'rare',
    requirement: { type: 'streak_days', value: 7 }
  },
  {
    id: 'dedication_master',
    title: 'Dedication Master',
    description: 'Maintain a 30-day learning streak',
    icon: '💎',
    category: 'streak',
    points: 1000,
    rarity: 'legendary',
    requirement: { type: 'streak_days', value: 30 }
  },

  // Score Achievements
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Score 100% on any lesson',
    icon: '⭐',
    category: 'mastery',
    points: 250,
    rarity: 'rare',
    requirement: { type: 'score_achieved', value: 100 }
  },
  {
    id: 'excellence_seeker',
    title: 'Excellence Seeker',
    description: 'Maintain 90%+ average score',
    icon: '🏆',
    category: 'mastery',
    points: 600,
    rarity: 'epic',
    requirement: { type: 'score_achieved', value: 90 }
  },

  // Certification Achievements
  {
    id: 'certified_beginner',
    title: 'Certified Beginner',
    description: 'Earn your first AI certification',
    icon: '📜',
    category: 'milestone',
    points: 750,
    rarity: 'epic',
    requirement: { type: 'certification_earned', value: 1 }
  },
  {
    id: 'ai_expert',
    title: 'AI Expert',
    description: 'Earn 3 AI certifications',
    icon: '🎓',
    category: 'milestone',
    points: 1500,
    rarity: 'legendary',
    requirement: { type: 'certification_earned', value: 3 }
  },

  // Community Achievements
  {
    id: 'team_player',
    title: 'Team Player',
    description: 'Refer 3 friends to AI Mind OS',
    icon: '🤝',
    category: 'community',
    points: 400,
    rarity: 'rare',
    requirement: { type: 'referrals_made', value: 3 }
  },

  // Milestone Achievements
  {
    id: 'points_collector',
    title: 'Points Collector',
    description: 'Earn 5,000 total points',
    icon: '💰',
    category: 'milestone',
    points: 500,
    rarity: 'epic',
    requirement: { type: 'total_points', value: 5000 }
  },
  {
    id: 'ai_legend',
    title: 'AI Legend',
    description: 'Earn 25,000 total points',
    icon: '👑',
    category: 'milestone',
    points: 2500,
    rarity: 'legendary',
    requirement: { type: 'total_points', value: 25000 }
  }
];

// Level System Calculation
export function calculateLevel(experiencePoints: number): { level: number; nextLevelXP: number; progress: number } {
  // XP required doubles every 5 levels with base 1000
  let level = 1;
  let totalXP = 0;
  let xpForLevel = 1000;

  while (totalXP + xpForLevel <= experiencePoints) {
    totalXP += xpForLevel;
    level++;
    
    // Increase XP requirement every 5 levels
    if (level % 5 === 0) {
      xpForLevel = Math.floor(xpForLevel * 1.5);
    }
  }

  const progress = Math.floor(((experiencePoints - totalXP) / xpForLevel) * 100);
  
  return {
    level,
    nextLevelXP: xpForLevel,
    progress
  };
}

// Achievement Functions
export async function checkAchievements(userId: string, userStats: UserStats): Promise<Achievement[]> {
  const newlyUnlocked: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    // Skip if already unlocked
    if (userStats.achievementsUnlocked.includes(achievement.id)) {
      continue;
    }

    let isUnlocked = false;

    switch (achievement.requirement.type) {
      case 'lesson_completed':
        isUnlocked = userStats.lessonsCompleted >= achievement.requirement.value;
        break;
      case 'streak_days':
        isUnlocked = userStats.currentStreak >= achievement.requirement.value;
        break;
      case 'score_achieved':
        isUnlocked = userStats.averageScore >= achievement.requirement.value;
        break;
      case 'certification_earned':
        isUnlocked = userStats.certificationsEarned >= achievement.requirement.value;
        break;
      case 'total_points':
        isUnlocked = userStats.totalPoints >= achievement.requirement.value;
        break;
    }

    if (isUnlocked) {
      newlyUnlocked.push(achievement);
      
      // Award points and update database
      await awardAchievement(userId, achievement);
    }
  }

  return newlyUnlocked;
}

export async function awardAchievement(userId: string, achievement: Achievement): Promise<void> {
  try {
    // Add achievement to user's unlocked achievements
    await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievement.id,
        unlocked_at: new Date().toISOString(),
        points_awarded: achievement.points
      });

    // Update user's total points
    const { data: currentStats } = await supabase
      .from('user_stats')
      .select('total_points, experience_points')
      .eq('user_id', userId)
      .single();

    if (currentStats) {
      const newTotalPoints = currentStats.total_points + achievement.points;
      const newXP = currentStats.experience_points + achievement.points;
      const levelInfo = calculateLevel(newXP);

      await supabase
        .from('user_stats')
        .update({
          total_points: newTotalPoints,
          experience_points: newXP,
          level: levelInfo.level
        })
        .eq('user_id', userId);
    }
  } catch (error) {
    console.error('Error awarding achievement:', error);
  }
}

// Leaderboard Functions
export async function getGlobalLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
  try {
    const { data: leaderboard } = await supabase
      .from('user_stats')
      .select(`
        user_id,
        total_points,
        level,
        current_streak,
        profiles:user_id (username, avatar_url)
      `)
      .order('total_points', { ascending: false })
      .limit(limit);

    if (!leaderboard) return [];

    return leaderboard.map((entry: { user_id: string; total_points: number; level: number; current_streak: number; profiles?: { username: string; avatar_url: string }[] }, index) => ({
      userId: entry.user_id,
      username: entry.profiles?.[0]?.username || 'Anonymous',
      avatar: entry.profiles?.[0]?.avatar_url,
      points: entry.total_points,
      level: entry.level,
      rank: index + 1,
      streak: entry.current_streak,
      badge: getBadgeForRank(index + 1)
    }));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

export async function getUserRank(userId: string): Promise<number> {
  try {
    const { data: userStats } = await supabase
      .from('user_stats')
      .select('total_points')
      .eq('user_id', userId)
      .single();

    if (!userStats) return 0;

    const { count } = await supabase
      .from('user_stats')
      .select('*', { count: 'exact', head: true })
      .gt('total_points', userStats.total_points);

    return (count || 0) + 1;
  } catch (error) {
    console.error('Error fetching user rank:', error);
    return 0;
  }
}

function getBadgeForRank(rank: number): string {
  if (rank === 1) return '👑'; // Crown for #1
  if (rank <= 3) return '🏆'; // Trophy for top 3
  if (rank <= 10) return '🥇'; // Gold for top 10
  if (rank <= 25) return '🥈'; // Silver for top 25
  if (rank <= 50) return '🥉'; // Bronze for top 50
  return '⭐'; // Star for everyone else
}

// Streak Management
export async function updateUserStreak(userId: string): Promise<{ currentStreak: number; isNewRecord: boolean }> {
  try {
    const { data: userStats } = await supabase
      .from('user_stats')
      .select('current_streak, longest_streak, last_active_date')
      .eq('user_id', userId)
      .single();

    if (!userStats) {
      throw new Error('User stats not found');
    }

    const now = new Date();
    const lastActive = new Date(userStats.last_active_date);
    const daysDiff = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

    let newStreak = userStats.current_streak;
    let isNewRecord = false;

    if (daysDiff === 1) {
      // Consecutive day - increment streak
      newStreak = userStats.current_streak + 1;
    } else if (daysDiff > 1) {
      // Streak broken - reset to 1
      newStreak = 1;
    }
    // If daysDiff === 0, same day, no change to streak

    // Check if new longest streak
    if (newStreak > userStats.longest_streak) {
      isNewRecord = true;
    }

    // Update database
    await supabase
      .from('user_stats')
      .update({
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, userStats.longest_streak),
        last_active_date: now.toISOString()
      })
      .eq('user_id', userId);

    return { currentStreak: newStreak, isNewRecord };
  } catch (error) {
    console.error('Error updating user streak:', error);
    return { currentStreak: 0, isNewRecord: false };
  }
}

// Progress Tracking
export async function updateUserProgress(
  userId: string, 
  action: 'lesson_completed' | 'certification_earned' | 'quiz_score',
  data: { score?: number; studyTime?: number; category?: string }
): Promise<UserStats | null> {
  try {
    const { data: currentStats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!currentStats) {
      // Create initial stats
      const initialStats = {
        user_id: userId,
        total_points: 0,
        level: 1,
        experience_points: 0,
        current_streak: 1,
        longest_streak: 1,
        lessons_completed: action === 'lesson_completed' ? 1 : 0,
        certifications_earned: action === 'certification_earned' ? 1 : 0,
        average_score: data.score || 0,
        study_time_minutes: data.studyTime || 0,
        last_active_date: new Date().toISOString(),
        achievements_unlocked: [],
        badges: []
      };

      await supabase.from('user_stats').insert(initialStats);
      return {
        userId,
        totalPoints: initialStats.total_points,
        level: initialStats.level,
        experiencePoints: initialStats.experience_points,
        currentStreak: initialStats.current_streak,
        longestStreak: initialStats.longest_streak,
        lessonsCompleted: initialStats.lessons_completed,
        certificationsEarned: initialStats.certifications_earned,
        averageScore: initialStats.average_score,
        studyTimeMinutes: initialStats.study_time_minutes,
        lastActiveDate: new Date(initialStats.last_active_date),
        achievementsUnlocked: initialStats.achievements_unlocked,
        badges: initialStats.badges
      };
    }

    // Update existing stats
    interface StatUpdates {
      last_active_date: string;
      lessons_completed?: number;
      certifications_earned?: number;
      experience_points?: number;
      total_points?: number;
      average_score?: number;
      study_time_minutes?: number;
      level?: number;
    }
    
    const updates: StatUpdates = {
      last_active_date: new Date().toISOString()
    };

    if (action === 'lesson_completed') {
      updates.lessons_completed = currentStats.lessons_completed + 1;
      updates.experience_points = currentStats.experience_points + 100; // Base XP per lesson
      updates.total_points = currentStats.total_points + 100;
    }

    if (action === 'certification_earned') {
      updates.certifications_earned = currentStats.certifications_earned + 1;
      updates.experience_points = currentStats.experience_points + 500; // Higher XP for certs
      updates.total_points = currentStats.total_points + 500;
    }

    if (data.score !== undefined) {
      // Update average score
      const totalLessons = currentStats.lessons_completed + (action === 'lesson_completed' ? 1 : 0);
      const currentTotal = currentStats.average_score * currentStats.lessons_completed;
      updates.average_score = Math.round((currentTotal + data.score) / totalLessons);
    }

    if (data.studyTime) {
      updates.study_time_minutes = currentStats.study_time_minutes + data.studyTime;
    }

    // Calculate new level
    const newXP = updates.experience_points || currentStats.experience_points;
    const levelInfo = calculateLevel(newXP);
    updates.level = levelInfo.level;

    await supabase
      .from('user_stats')
      .update(updates)
      .eq('user_id', userId);

    const updatedStats = { ...currentStats, ...updates };
    
    // Check for new achievements
    await checkAchievements(userId, updatedStats as UserStats);

    return updatedStats as UserStats;
  } catch (error) {
    console.error('Error updating user progress:', error);
    return null;
  }
}

// Get User's Achievement Progress
export async function getUserAchievementProgress(userId: string): Promise<Achievement[]> {
  try {
    const { data: userStats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!userStats) return [];

    const { data: unlockedAchievements } = await supabase
      .from('user_achievements')
      .select('achievement_id, unlocked_at')
      .eq('user_id', userId);

    const unlockedIds = unlockedAchievements?.map(a => a.achievement_id) || [];

    return ACHIEVEMENTS.map(achievement => {
      const isUnlocked = unlockedIds.includes(achievement.id);
      let progress = 0;

      if (!isUnlocked) {
        // Calculate progress towards achievement
        switch (achievement.requirement.type) {
          case 'lesson_completed':
            progress = Math.min((userStats.lessons_completed / achievement.requirement.value) * 100, 100);
            break;
          case 'streak_days':
            progress = Math.min((userStats.current_streak / achievement.requirement.value) * 100, 100);
            break;
          case 'score_achieved':
            progress = Math.min((userStats.average_score / achievement.requirement.value) * 100, 100);
            break;
          case 'certification_earned':
            progress = Math.min((userStats.certifications_earned / achievement.requirement.value) * 100, 100);
            break;
          case 'total_points':
            progress = Math.min((userStats.total_points / achievement.requirement.value) * 100, 100);
            break;
        }
      } else {
        progress = 100;
      }

      return {
        ...achievement,
        progress: Math.round(progress),
        unlockedAt: isUnlocked ? unlockedAchievements?.find(a => a.achievement_id === achievement.id)?.unlocked_at : undefined
      };
    });
  } catch (error) {
    console.error('Error fetching achievement progress:', error);
    return [];
  }
}

const gamificationSystem = {
  ACHIEVEMENTS,
  calculateLevel,
  checkAchievements,
  awardAchievement,
  getGlobalLeaderboard,
  getUserRank,
  updateUserStreak,
  updateUserProgress,
  getUserAchievementProgress
};

export default gamificationSystem;
