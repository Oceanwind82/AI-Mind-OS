// components/gamification/Leaderboard.tsx
// Phase 4.3: Gamification UI - Leaderboard Components

'use client'

import React, { useState, useEffect } from 'react';
import type { LeaderboardEntry } from '../../lib/gamification';

interface LeaderboardProps {
  limit?: number;
  className?: string;
}

export function Leaderboard({ limit = 100, className = '' }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/gamification/leaderboard?limit=${limit}`);
      const data = await response.json();

      if (data.success) {
        setLeaderboard(data.data);
      } else {
        setError(data.error || 'Failed to fetch leaderboard');
      }
    } catch (err) {
      setError('Failed to fetch leaderboard');
      console.error('Leaderboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [limit]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className={`bg-white rounded-lg p-6 shadow-lg ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-4"></div>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 mb-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="flex-1 h-4 bg-gray-300 rounded"></div>
              <div className="w-16 h-4 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg p-6 shadow-lg ${className}`}>
        <div className="text-center text-red-600">
          <p>Failed to load leaderboard</p>
          <button 
            onClick={fetchLeaderboard}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          🏆 Global Leaderboard
        </h2>
        <p className="text-purple-100 mt-1">Top AI learners worldwide</p>
      </div>

      <div className="p-6">
        <div className="space-y-3">
          {leaderboard.map((entry) => (
            <LeaderboardEntry 
              key={entry.userId} 
              entry={entry}
            />
          ))}
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No leaderboard data available</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface LeaderboardEntryProps {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
}

function LeaderboardEntry({ entry, isCurrentUser = false }: LeaderboardEntryProps) {
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getBadgeSize = (rank: number) => {
    if (rank <= 3) return 'text-xl';
    return 'text-lg';
  };

  return (
    <div className={`
      flex items-center p-4 rounded-lg border transition-all duration-200 hover:shadow-md
      ${isCurrentUser ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
    `}>
      {/* Rank Badge */}
      <div className={`
        w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm
        ${getRankStyle(entry.rank)}
      `}>
        {entry.rank <= 3 ? entry.badge : entry.rank}
      </div>

      {/* User Avatar */}
      <div className="ml-4 w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
        {entry.avatar ? (
          <div 
            className="w-full h-full rounded-full bg-gray-300"
            title={entry.username}
          >
            {/* Avatar placeholder */}
            {entry.username.charAt(0).toUpperCase()}
          </div>
        ) : (
          entry.username.charAt(0).toUpperCase()
        )}
      </div>

      {/* User Info */}
      <div className="ml-4 flex-1">
        <div className="flex items-center space-x-2">
          <h3 className={`font-semibold ${isCurrentUser ? 'text-blue-700' : 'text-gray-900'}`}>
            {entry.username}
            {isCurrentUser && <span className="text-blue-500 ml-1">(You)</span>}
          </h3>
          <span className="text-gray-500 text-sm">Level {entry.level}</span>
        </div>
        
        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
          <span className="flex items-center">
            💎 {entry.points.toLocaleString()} pts
          </span>
          {entry.streak > 0 && (
            <span className="flex items-center">
              🔥 {entry.streak} day streak
            </span>
          )}
        </div>
      </div>

      {/* Top Badge */}
      {entry.badge && (
        <div className={`
          text-2xl ${getBadgeSize(entry.rank)}
        `}>
          {entry.badge}
        </div>
      )}
    </div>
  );
}

// Compact Leaderboard for sidebars
interface CompactLeaderboardProps {
  limit?: number;
  className?: string;
}

export function CompactLeaderboard({ limit = 5, className = '' }: CompactLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [limit]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`/api/gamification/leaderboard?limit=${limit}`);
      const data = await response.json();
      if (data.success) {
        setLeaderboard(data.data.slice(0, limit));
      }
    } catch (err) {
      console.error('Compact leaderboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg p-4 shadow ${className}`}>
        <div className="animate-pulse space-y-2">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
              <div className="flex-1 h-3 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg p-4 shadow ${className}`}>
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
        🏆 Top Learners
      </h3>
      
      <div className="space-y-2">
        {leaderboard.map((entry, index) => (
          <div key={entry.userId} className="flex items-center space-x-2 text-sm">
            <span className="w-6 text-center font-semibold text-gray-600">
              {index + 1}
            </span>
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-xs font-semibold">
              {entry.username.charAt(0).toUpperCase()}
            </div>
            <span className="flex-1 truncate text-gray-900">{entry.username}</span>
            <span className="text-gray-600 text-xs">
              {entry.points.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t">
        <a 
          href="/leaderboard" 
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View Full Leaderboard →
        </a>
      </div>
    </div>
  );
}
