// components/gamification/UserStats.tsx
// Phase 4.3: Gamification UI - User Statistics Dashboard

'use client'

import React, { useState, useEffect } from 'react';

interface UserStatsData {
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
  rank?: number;
  levelInfo: {
    currentLevel: number;
    nextLevelXP: number;
    progress: number;
  };
}

interface UserStatsProps {
  userId: string;
  className?: string;
}

export function UserStats({ userId, className = '' }: UserStatsProps) {
  const [stats, setStats] = useState<UserStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchUserStats();
    }
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/gamification/stats?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.error || 'Failed to fetch user stats');
      }
    } catch (err) {
      setError('Failed to fetch user stats');
      console.error('User stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg p-6 shadow-lg ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-4"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className={`bg-white rounded-lg p-6 shadow-lg ${className}`}>
        <div className="text-center text-red-600">
          <p>Failed to load user statistics</p>
          <button 
            onClick={fetchUserStats}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Header with Level Info */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Level {stats.level}</h2>
            <p className="opacity-90">
              {stats.rank ? `Global Rank #${stats.rank}` : 'Ranking...'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{stats.totalPoints.toLocaleString()}</div>
            <div className="text-sm opacity-90">Total Points</div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress to Level {stats.level + 1}</span>
            <span>{stats.levelInfo.progress}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-1000"
              data-progress={stats.levelInfo.progress}
            />
          </div>
          <div className="text-xs text-center mt-1 opacity-75">
            {stats.levelInfo.nextLevelXP} XP to next level
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Streak */}
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 flex items-center justify-center">
              🔥 {stats.currentStreak}
            </div>
            <div className="text-sm text-gray-600 mt-1">Day Streak</div>
            <div className="text-xs text-gray-500">
              Best: {stats.longestStreak} days
            </div>
          </div>

          {/* Lessons */}
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 flex items-center justify-center">
              📚 {stats.lessonsCompleted}
            </div>
            <div className="text-sm text-gray-600 mt-1">Lessons</div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>

          {/* Average Score */}
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 flex items-center justify-center">
              ⭐ {stats.averageScore}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Avg Score</div>
            <div className="text-xs text-gray-500">
              {stats.averageScore >= 90 ? 'Excellent!' : 
               stats.averageScore >= 80 ? 'Great!' : 
               stats.averageScore >= 70 ? 'Good!' : 'Keep learning!'}
            </div>
          </div>

          {/* Study Time */}
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 flex items-center justify-center">
              ⏱️ {formatTime(stats.studyTimeMinutes)}
            </div>
            <div className="text-sm text-gray-600 mt-1">Study Time</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>

          {/* Certifications */}
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 flex items-center justify-center">
              🏆 {stats.certificationsEarned}
            </div>
            <div className="text-sm text-gray-600 mt-1">Certificates</div>
            <div className="text-xs text-gray-500">Earned</div>
          </div>

          {/* Experience Points */}
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600 flex items-center justify-center">
              ⚡ {stats.experiencePoints.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-1">Experience</div>
            <div className="text-xs text-gray-500">Points</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex flex-wrap gap-2 justify-center">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
              View Achievements
            </button>
            <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm">
              See Leaderboard
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
              Continue Learning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact version for dashboards
interface CompactUserStatsProps {
  userId: string;
  className?: string;
}

export function CompactUserStats({ userId, className = '' }: CompactUserStatsProps) {
  const [stats, setStats] = useState<UserStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUserStats();
    }
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`/api/gamification/stats?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Compact user stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className={`bg-white rounded-lg p-4 shadow ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg p-4 shadow ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Your Progress</h3>
        <span className="text-sm text-gray-600">Level {stats.level}</span>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-lg font-bold text-blue-600">{stats.totalPoints.toLocaleString()}</div>
          <div className="text-xs text-gray-600">Points</div>
        </div>
        <div>
          <div className="text-lg font-bold text-orange-600">{stats.currentStreak}</div>
          <div className="text-xs text-gray-600">Streak</div>
        </div>
        <div>
          <div className="text-lg font-bold text-green-600">{stats.lessonsCompleted}</div>
          <div className="text-xs text-gray-600">Lessons</div>
        </div>
      </div>

      {/* Mini Progress Bar */}
      <div className="mt-3">
        <div className="text-xs text-gray-600 mb-1">Level Progress</div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            data-progress={stats.levelInfo.progress}
          />
        </div>
      </div>
    </div>
  );
}
