'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  GlitchText, 
  NeuralPulse, 
  DataFlowIndicator, 
  StaggerContainer, 
  StaggerItem,
  Magnetic 
} from '../neural/motion-branding'
import { ARCHETYPE_CONFIG, PATHWAY_CONFIG, XP_THRESHOLDS, STREAK_CONFIG } from '../../lib/onboarding'
import { OnboardingResult } from './onboarding-flow'

interface CommandDeckProps {
  profile: OnboardingResult
  currentXP: number
  currentStreak: number
  onStartLearning: () => void
}

interface NeuralStat {
  label: string
  value: string | number
  trend: 'up' | 'down' | 'stable'
  color: string
}

export function CommandDeck({ profile, currentXP, currentStreak, onStartLearning }: CommandDeckProps) {
  const [activeModule, setActiveModule] = useState<string | null>(null)
  const [neuralActivity, setNeuralActivity] = useState(0)

  const archetypeConfig = ARCHETYPE_CONFIG[profile.archetype]
  const pathwayConfig = PATHWAY_CONFIG[profile.pathway]
  
  // Calculate current rank
  const currentRank = XP_THRESHOLDS
    .sort((a, b) => b.xp - a.xp)
    .find(threshold => currentXP >= threshold.xp) || XP_THRESHOLDS[0]
  
  const nextRank = XP_THRESHOLDS.find(threshold => threshold.xp > currentXP)
  const progressToNext = nextRank 
    ? ((currentXP - currentRank.xp) / (nextRank.xp - currentRank.xp)) * 100
    : 100

  // Get streak color and intensity
  const streakColor = Object.entries(STREAK_CONFIG.colors)
    .sort(([a], [b]) => parseInt(b) - parseInt(a))
    .find(([threshold]) => currentStreak >= parseInt(threshold))?.[1] || STREAK_CONFIG.colors[1]

  // Neural stats
  const neuralStats: NeuralStat[] = [
    {
      label: 'Neural Rank',
      value: currentRank.title,
      trend: 'up',
      color: '#00ffff'
    },
    {
      label: 'XP Level',
      value: currentXP.toLocaleString(),
      trend: 'up',
      color: '#8b5cf6'
    },
    {
      label: 'Active Streak',
      value: `${currentStreak} days`,
      trend: currentStreak > 0 ? 'up' : 'stable',
      color: streakColor
    },
    {
      label: 'Confidence',
      value: `${profile.confidence}%`,
      trend: 'stable',
      color: archetypeConfig.neural_color
    }
  ]

  // Simulate neural activity
  useEffect(() => {
    const interval = setInterval(() => {
      setNeuralActivity(Math.floor(Math.random() * 100))
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-neural-black text-neural-text-primary p-8">
      {/* CSS Variables for dynamic colors */}
      <style jsx>{`
        .archetype-color {
          color: ${archetypeConfig.neural_color};
        }
        .archetype-border {
          border-color: ${archetypeConfig.neural_color}50;
        }
        .archetype-text {
          color: ${archetypeConfig.neural_color};
        }
        .stat-color-0 { color: #00ffff; }
        .stat-color-1 { color: #8b5cf6; }
        .stat-color-2 { color: ${streakColor}; }
        .stat-color-3 { color: ${archetypeConfig.neural_color}; }
      `}</style>

      {/* Command Deck Header */}
      <StaggerContainer className="mb-12">
        <StaggerItem>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <GlitchText intensity="medium">
                  COMMAND DECK
                </GlitchText>
              </h1>
              <p className="text-neural-text-secondary">
                Neural interface for {archetypeConfig.name}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <DataFlowIndicator />
              <div className="text-sm text-neural-text-tertiary">
                Neural Activity: {neuralActivity}%
              </div>
            </div>
          </div>
        </StaggerItem>

        {/* Archetype Status Banner */}
        <StaggerItem>
          <motion.div
            className="neural-glass-bright p-6 rounded-3xl border-2 archetype-border"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-6xl">
                  {archetypeConfig.icon}
                </div>
                
                <div>
                  <div className="text-2xl font-bold mb-2 archetype-color">
                    {archetypeConfig.name}
                  </div>
                  <div className="text-neural-text-secondary mb-2">
                    Path: {pathwayConfig.name}
                  </div>
                  <div className="text-sm text-neural-text-tertiary">
                    {pathwayConfig.neural_signature}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-neural-text-tertiary">Danger Level:</span>
                  {Array.from({ length: archetypeConfig.danger_level }).map((_, i) => (
                    <NeuralPulse
                      key={i}
                      size={8}
                      color={archetypeConfig.neural_color}
                      intensity="medium"
                    />
                  ))}
                </div>
                <div className="text-sm font-mono archetype-text">
                  {archetypeConfig.signature_ability}
                </div>
              </div>
            </div>
          </motion.div>
        </StaggerItem>
      </StaggerContainer>

      {/* Neural Stats Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {neuralStats.map((stat, statIndex) => (
          <StaggerItem key={stat.label}>
            <motion.div
              className="neural-card p-6 text-center"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-sm text-neural-text-tertiary mb-2 uppercase tracking-wider">
                {stat.label}
              </div>
              
              <div className={`text-3xl font-bold mb-3 stat-color-${statIndex}`}>
                {stat.value}
              </div>
              
              <div className="flex items-center justify-center space-x-2">
                <motion.div
                  className={`w-2 h-2 rounded-full stat-color-${statIndex}`}
                  animate={{
                    scale: stat.trend === 'up' ? [1, 1.3, 1] : [1],
                    opacity: stat.trend === 'up' ? [0.5, 1, 0.5] : [0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: stat.trend === 'up' ? Infinity : 0
                  }}
                />
                <span className="text-xs text-neural-text-tertiary">
                  {stat.trend === 'up' ? '↗' : stat.trend === 'down' ? '↘' : '→'}
                </span>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* XP Progress Section */}
      <StaggerContainer className="mb-12">
        <StaggerItem>
          <div className="neural-glass-bright p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Neural Progression</h2>
              <div className="text-neural-text-secondary">
                {nextRank ? `${Math.ceil(progressToNext)}% to ${nextRank.title}` : 'Max Rank Achieved'}
              </div>
            </div>
            
            <div className="relative">
              <div className="w-full h-4 bg-neural-surface-2 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-neural-cyan to-neural-purple"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNext}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
              
              <div className="flex justify-between mt-2 text-sm text-neural-text-tertiary">
                <span>{currentRank.title}</span>
                {nextRank && <span>{nextRank.title}</span>}
              </div>
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>

      {/* Learning Modules Grid */}
      <StaggerContainer className="mb-12">
        <StaggerItem>
          <h2 className="text-2xl font-bold mb-8">
            <GlitchText intensity="low">Neural Learning Modules</GlitchText>
          </h2>
        </StaggerItem>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pathwayConfig.focus_areas.map((area) => (
            <StaggerItem key={area}>
              <Magnetic strength={0.3}>
                <motion.div
                  className={`neural-card cursor-pointer relative overflow-hidden ${
                    activeModule === area ? 'neural-glow-cyan' : ''
                  }`}
                  onClick={() => setActiveModule(activeModule === area ? null : area)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">{area}</h3>
                      <NeuralPulse 
                        size={10} 
                        color={archetypeConfig.neural_color}
                        intensity="low"
                      />
                    </div>
                    
                    <div className="text-neural-text-secondary text-sm mb-4">
                      Advanced {area.toLowerCase()} training protocols
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-neural-text-tertiary">
                        Progress: {Math.floor(Math.random() * 100)}%
                      </div>
                      <div className="text-xs archetype-text">
                        +{50 + Math.floor(Math.random() * 100)} XP
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-neural-cyan/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              </Magnetic>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>

      {/* Action Center */}
      <StaggerContainer>
        <StaggerItem>
          <div className="text-center">
            <Magnetic strength={0.4}>
              <motion.button
                onClick={onStartLearning}
                className="neural-button-primary text-xl px-12 py-6 rounded-3xl font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <GlitchText intensity="low">
                  BEGIN NEURAL ENHANCEMENT
                </GlitchText>
              </motion.button>
            </Magnetic>
            
            <div className="mt-6 text-neural-text-tertiary">
              Ready to expand your cognitive capabilities?
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </div>
  )
}
