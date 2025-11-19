'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  GlitchText, 
  NeuralPulse, 
  StaggerContainer, 
  StaggerItem,
  Magnetic 
} from '../neural/motion-branding'
import { STREAK_CONFIG } from '../../lib/onboarding'

interface StreakSystemProps {
  currentStreak: number
  bestStreak: number
  streakSaverActive: boolean
  onStreakSaverActivate: () => void
  onContinueStreak: () => void
}

interface StreakNode {
  id: number
  day: number
  completed: boolean
  active: boolean
  color: string
  intensity: 'low' | 'medium' | 'high' | 'extreme'
}

interface StreakReward {
  milestone: number
  reward: string
  neural_bonus: string
  unlocked: boolean
}

export function StreakSystem({ 
  currentStreak, 
  bestStreak, 
  streakSaverActive, 
  onStreakSaverActivate, 
  onContinueStreak 
}: StreakSystemProps) {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)
  const [pulsingNodes, setPulsingNodes] = useState<Set<number>>(new Set())
  const [streakDanger, setStreakDanger] = useState(false)

  // Get current streak color and intensity
  const getCurrentStreakData = () => {
    const colorEntry = Object.entries(STREAK_CONFIG.colors)
      .sort(([a], [b]) => parseInt(b) - parseInt(a))
      .find(([threshold]) => currentStreak >= parseInt(threshold))
    
    const color = colorEntry?.[1] || STREAK_CONFIG.colors[1]
    
    let intensity: 'low' | 'medium' | 'high' | 'extreme' = 'low'
    if (currentStreak >= 30) intensity = 'extreme'
    else if (currentStreak >= 21) intensity = 'high'
    else if (currentStreak >= 7) intensity = 'medium'
    
    return { color, intensity }
  }

  const { color: streakColor, intensity: streakIntensity } = getCurrentStreakData()

  // Generate streak nodes (past 30 days + future 30 days)
  const generateStreakNodes = (): StreakNode[] => {
    const nodes: StreakNode[] = []
    const totalNodes = 60
    const centerNode = 30
    
    for (let i = 0; i < totalNodes; i++) {
      const dayOffset = i - centerNode
      const dayNumber = dayOffset
      const isCompleted = dayOffset <= 0 && Math.abs(dayOffset) < currentStreak
      const isActive = dayOffset === 1 // Tomorrow
      
      let nodeColor = '#333333'
      let nodeIntensity: 'low' | 'medium' | 'high' | 'extreme' = 'low'
      
      if (isCompleted) {
        const streakDay = currentStreak + dayOffset
        const colorEntry = Object.entries(STREAK_CONFIG.colors)
          .sort(([a], [b]) => parseInt(b) - parseInt(a))
          .find(([threshold]) => streakDay >= parseInt(threshold))
        nodeColor = colorEntry?.[1] || STREAK_CONFIG.colors[1]
        
        if (streakDay >= 30) nodeIntensity = 'extreme'
        else if (streakDay >= 21) nodeIntensity = 'high'
        else if (streakDay >= 7) nodeIntensity = 'medium'
      }
      
      nodes.push({
        id: i,
        day: dayNumber,
        completed: isCompleted,
        active: isActive,
        color: nodeColor,
        intensity: nodeIntensity
      })
    }
    
    return nodes
  }

  const streakNodes = generateStreakNodes()

  // Streak rewards/milestones
  const streakRewards: StreakReward[] = [
    {
      milestone: 7,
      reward: 'Neural Accelerator',
      neural_bonus: '+15% learning speed',
      unlocked: currentStreak >= 7
    },
    {
      milestone: 14,
      reward: 'Cognitive Enhancer',
      neural_bonus: '+25% retention rate',
      unlocked: currentStreak >= 14
    },
    {
      milestone: 21,
      reward: 'Mind Amplifier',
      neural_bonus: '+50% XP gain',
      unlocked: currentStreak >= 21
    },
    {
      milestone: 30,
      reward: 'Neural Overdrive',
      neural_bonus: 'Unlock dangerous protocols',
      unlocked: currentStreak >= 30
    },
    {
      milestone: 50,
      reward: 'Cognitive Singularity',
      neural_bonus: 'Transcend normal limits',
      unlocked: currentStreak >= 50
    },
    {
      milestone: 100,
      reward: 'Mind God Mode',
      neural_bonus: 'Reality manipulation protocols',
      unlocked: currentStreak >= 100
    }
  ]

  // Simulate streak danger detection
  useEffect(() => {
    const now = new Date()
    const lastActivity = new Date(Date.now() - 20 * 60 * 60 * 1000) // 20 hours ago
    const hoursWithoutActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60)
    
    setStreakDanger(hoursWithoutActivity > 20 && currentStreak > 0)
  }, [currentStreak])

  // Animate pulsing nodes
  useEffect(() => {
    if (currentStreak > 0) {
      const interval = setInterval(() => {
        setPulsingNodes(new Set([
          currentStreak - 1, // Last completed day
          currentStreak, // Today (if active)
          Math.floor(Math.random() * Math.min(currentStreak, 10)) // Random recent day
        ]))
      }, 3000)
      
      return () => clearInterval(interval)
    }
  }, [currentStreak])

  return (
    <div className="neural-glass-bright p-8 rounded-3xl">
      {/* CSS for dynamic colors */}
      <style jsx>{`
        .streak-color { color: ${streakColor}; }
        .streak-glow { 
          box-shadow: 0 0 20px ${streakColor}40; 
          border-color: ${streakColor}50;
        }
      `}</style>

      {/* Header Section */}
      <StaggerContainer className="mb-8">
        <StaggerItem>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                <GlitchText intensity="medium">
                  NEURAL STREAK SYSTEM
                </GlitchText>
              </h2>
              <div className="flex items-center space-x-6">
                <div className="text-lg text-neural-text-secondary">
                  Current: <span className="streak-color font-bold">{currentStreak} days</span>
                </div>
                <div className="text-lg text-neural-text-secondary">
                  Best: <span className="text-neural-cyan font-bold">{bestStreak} days</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <NeuralPulse 
                size={24} 
                color={streakColor}
                intensity={streakIntensity === 'extreme' ? 'high' : streakIntensity}
              />
            </div>
          </div>
        </StaggerItem>

        {/* Streak Danger Alert */}
        <AnimatePresence>
          {streakDanger && (
            <StaggerItem>
              <motion.div
                className="neural-alert p-6 rounded-2xl border-2 border-red-500 bg-red-500/10 mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">⚠️</div>
                    <div>
                      <div className="text-lg font-bold text-red-400">
                        STREAK DANGER DETECTED
                      </div>
                      <div className="text-neural-text-secondary">
                        Your {currentStreak}-day streak is at risk. Act now to maintain neural continuity.
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    {!streakSaverActive && (
                      <Magnetic strength={0.3}>
                        <motion.button
                          onClick={onStreakSaverActivate}
                          className="neural-button-secondary px-4 py-2 rounded-xl text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          ACTIVATE STREAK SAVER
                        </motion.button>
                      </Magnetic>
                    )}
                    
                    <Magnetic strength={0.3}>
                      <motion.button
                        onClick={onContinueStreak}
                        className="neural-button-primary px-4 py-2 rounded-xl text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        CONTINUE STREAK
                      </motion.button>
                    </Magnetic>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          )}
        </AnimatePresence>
      </StaggerContainer>

      {/* Neural Pathway Visualization */}
      <StaggerContainer className="mb-8">
        <StaggerItem>
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">Neural Pathway Map</h3>
            <div className="neural-surface-2 p-6 rounded-2xl">
              <div className="flex items-center justify-center space-x-2 overflow-x-auto">
                {streakNodes.map((node) => (
                  <motion.div
                    key={node.id}
                    className={`relative flex-shrink-0 w-4 h-4 rounded-full cursor-pointer ${
                      node.completed ? 'streak-glow' : 'bg-neural-surface-3'
                    } ${node.active ? 'ring-2 ring-neural-cyan' : ''}`}
                    style={{
                      backgroundColor: node.completed ? node.color : undefined
                    }}
                    onHoverStart={() => setHoveredNode(node.id)}
                    onHoverEnd={() => setHoveredNode(null)}
                    animate={{
                      scale: pulsingNodes.has(node.id) ? [1, 1.5, 1] : 1,
                      opacity: node.completed ? 1 : 0.3
                    }}
                    transition={{
                      duration: pulsingNodes.has(node.id) ? 2 : 0.3,
                      repeat: pulsingNodes.has(node.id) ? Infinity : 0
                    }}
                    whileHover={{ scale: 1.5 }}
                  >
                    {/* Tooltip */}
                    <AnimatePresence>
                      {hoveredNode === node.id && (
                        <motion.div
                          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-neural-black text-neural-text-primary px-3 py-2 rounded-lg text-xs whitespace-nowrap z-10"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                        >
                          Day {node.day === 0 ? 'Today' : node.day > 0 ? `+${node.day}` : node.day}
                          {node.completed && <div className="text-green-400">✓ Completed</div>}
                          {node.active && <div className="text-neural-cyan">→ Next</div>}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex justify-between mt-4 text-xs text-neural-text-tertiary">
                <span>30 days ago</span>
                <span>Today</span>
                <span>30 days ahead</span>
              </div>
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>

      {/* Streak Rewards */}
      <StaggerContainer>
        <StaggerItem>
          <h3 className="text-xl font-bold mb-6">Neural Enhancement Rewards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {streakRewards.map((reward) => (
              <StaggerItem key={reward.milestone}>
                <motion.div
                  className={`neural-card relative overflow-hidden ${
                    reward.unlocked ? 'neural-glow-cyan' : 'opacity-50'
                  }`}
                  whileHover={reward.unlocked ? { scale: 1.03 } : {}}
                >
                  <div className="relative z-10 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl">
                        {reward.unlocked ? '🏆' : '🔒'}
                      </div>
                      <div className="text-sm text-neural-text-tertiary">
                        {reward.milestone} days
                      </div>
                    </div>
                    
                    <div className="font-bold mb-2">
                      {reward.reward}
                    </div>
                    
                    <div className="text-sm text-neural-text-secondary">
                      {reward.neural_bonus}
                    </div>
                    
                    {reward.unlocked && (
                      <div className="absolute top-2 right-2">
                        <NeuralPulse 
                          size={8} 
                          color="#00ff88"
                          intensity="medium"
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Reward glow effect */}
                  {reward.unlocked && (
                    <div className="absolute inset-0 bg-gradient-to-br from-neural-cyan/10 via-transparent to-neural-purple/10" />
                  )}
                </motion.div>
              </StaggerItem>
            ))}
          </div>
        </StaggerItem>
      </StaggerContainer>

      {/* Streak Saver Status */}
      <AnimatePresence>
        {streakSaverActive && (
          <StaggerContainer className="mt-8">
            <StaggerItem>
              <motion.div
                className="neural-glass-dark p-6 rounded-2xl border-2 border-neural-purple"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">🛡️</div>
                  <div>
                    <div className="text-lg font-bold text-neural-purple">
                      STREAK SAVER PROTOCOL ACTIVE
                    </div>
                    <div className="text-neural-text-secondary">
                      Your streak is protected for the next 24 hours. Neural continuity maintained.
                    </div>
                  </div>
                  <div className="ml-auto">
                    <NeuralPulse 
                      size={16} 
                      color="#8b5cf6"
                      intensity="high"
                    />
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          </StaggerContainer>
        )}
      </AnimatePresence>
    </div>
  )
}
