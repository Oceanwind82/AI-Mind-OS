// components/gamification/AchievementCard.tsx
// Phase 4.3: Gamification UI - Achievement Cards

'use client'

import React from 'react';
import { Achievement } from '../../lib/gamification';

interface AchievementCardProps {
  achievement: Achievement;
  className?: string;
}

const rarityColors = {
  common: 'border-gray-300 bg-gray-50',
  rare: 'border-blue-300 bg-blue-50',
  epic: 'border-purple-300 bg-purple-50',
  legendary: 'border-yellow-300 bg-yellow-50'
};

const rarityGradients = {
  common: 'from-gray-100 to-gray-200',
  rare: 'from-blue-100 to-blue-200',
  epic: 'from-purple-100 to-purple-200',
  legendary: 'from-yellow-100 to-yellow-200'
};

export function AchievementCard({ achievement, className = '' }: AchievementCardProps) {
  const isUnlocked = (achievement.progress || 0) >= 100;
  const progress = achievement.progress || 0;

  return (
    <div className={`
      relative p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-lg
      ${isUnlocked ? rarityColors[achievement.rarity] : 'border-gray-200 bg-gray-100'}
      ${isUnlocked ? 'transform hover:scale-105' : 'opacity-75'}
      ${className}
    `}>
      {/* Rarity Gradient Overlay */}
      {isUnlocked && (
        <div className={`
          absolute inset-0 rounded-lg bg-gradient-to-br opacity-20 pointer-events-none
          ${rarityGradients[achievement.rarity]}
        `} />
      )}

      {/* Unlocked Badge */}
      {isUnlocked && achievement.unlockedAt && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
          ✓ UNLOCKED
        </div>
      )}

      {/* Achievement Icon */}
      <div className="flex items-center justify-center mb-3">
        <div className={`
          text-4xl p-3 rounded-full 
          ${isUnlocked ? 'bg-white shadow-md' : 'bg-gray-200'}
        `}>
          {achievement.icon}
        </div>
      </div>

      {/* Achievement Info */}
      <div className="text-center">
        <h3 className={`
          font-semibold text-lg mb-1
          ${isUnlocked ? 'text-gray-900' : 'text-gray-600'}
        `}>
          {achievement.title}
        </h3>
        
        <p className={`
          text-sm mb-3
          ${isUnlocked ? 'text-gray-700' : 'text-gray-500'}
        `}>
          {achievement.description}
        </p>

        {/* Progress Bar */}
        {!isUnlocked && progress > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500`}
                data-progress={progress}
              />
            </div>
          </div>
        )}

        {/* Points and Rarity */}
        <div className="flex justify-between items-center text-sm">
          <div className={`
            flex items-center space-x-1
            ${isUnlocked ? 'text-green-600' : 'text-gray-500'}
          `}>
            <span>💎</span>
            <span className="font-semibold">{achievement.points} pts</span>
          </div>
          
          <div className={`
            px-2 py-1 rounded-full text-xs font-bold uppercase
            ${achievement.rarity === 'common' ? 'bg-gray-200 text-gray-700' : ''}
            ${achievement.rarity === 'rare' ? 'bg-blue-200 text-blue-700' : ''}
            ${achievement.rarity === 'epic' ? 'bg-purple-200 text-purple-700' : ''}
            ${achievement.rarity === 'legendary' ? 'bg-yellow-200 text-yellow-700' : ''}
          `}>
            {achievement.rarity}
          </div>
        </div>

        {/* Unlock Date */}
        {isUnlocked && achievement.unlockedAt && (
          <div className="mt-2 text-xs text-gray-500">
            Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}

// Achievement Grid Component
interface AchievementGridProps {
  achievements: Achievement[];
  filter?: 'all' | 'unlocked' | 'locked' | 'in-progress';
  className?: string;
}

export function AchievementGrid({ achievements, filter = 'all', className = '' }: AchievementGridProps) {
  const filteredAchievements = achievements.filter(achievement => {
    const progress = achievement.progress || 0;
    switch (filter) {
      case 'unlocked':
        return progress >= 100;
      case 'locked':
        return progress === 0;
      case 'in-progress':
        return progress > 0 && progress < 100;
      default:
        return true;
    }
  });

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {filteredAchievements.map(achievement => (
        <AchievementCard 
          key={achievement.id} 
          achievement={achievement}
        />
      ))}
    </div>
  );
}

// Achievement Stats Component
interface AchievementStatsProps {
  achievements: Achievement[];
  className?: string;
}

export function AchievementStats({ achievements, className = '' }: AchievementStatsProps) {
  const unlocked = achievements.filter(a => (a.progress || 0) >= 100).length;
  const inProgress = achievements.filter(a => (a.progress || 0) > 0 && (a.progress || 0) < 100).length;
  const totalPoints = achievements
    .filter(a => (a.progress || 0) >= 100)
    .reduce((sum, a) => sum + a.points, 0);

  const completionRate = Math.round((unlocked / achievements.length) * 100);

  return (
    <div className={`bg-white rounded-lg p-6 shadow-lg ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievement Progress</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">{unlocked}</div>
          <div className="text-sm text-gray-600">Unlocked</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{inProgress}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">{totalPoints}</div>
          <div className="text-sm text-gray-600">Points Earned</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600">{completionRate}%</div>
          <div className="text-sm text-gray-600">Complete</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Overall Progress</span>
          <span>{unlocked} / {achievements.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000`}
            data-completion={completionRate}
          />
        </div>
      </div>
    </div>
  );
}
