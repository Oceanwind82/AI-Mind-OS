'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { OnboardingFlow, OnboardingResult } from './onboarding-flow'
import { CommandDeck } from './command-deck'
import { StreakSystem } from './streak-system'
import { GlitchText, StaggerContainer, StaggerItem } from '../neural/motion-branding'

type AppPhase = 'onboarding' | 'command_deck' | 'streak_focus' | 'learning'

interface UserProgress {
  profile: OnboardingResult | null
  currentXP: number
  currentStreak: number
  bestStreak: number
  streakSaverActive: boolean
  lastActivity: Date
  totalLearningHours: number
  completedModules: string[]
}

export function MastermindOS() {
  const [currentPhase, setCurrentPhase] = useState<AppPhase>('onboarding')
  const [userProgress, setUserProgress] = useState<UserProgress>({
    profile: null,
    currentXP: 0,
    currentStreak: 0,
    bestStreak: 0,
    streakSaverActive: false,
    lastActivity: new Date(),
    totalLearningHours: 0,
    completedModules: []
  })

  // Load user progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('mastermind_progress')
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress)
      setUserProgress({
        ...parsed,
        lastActivity: new Date(parsed.lastActivity)
      })
      
      // If user has completed onboarding, go to command deck
      if (parsed.profile) {
        setCurrentPhase('command_deck')
      }
    }
  }, [])

  // Save user progress to localStorage
  const saveProgress = (newProgress: Partial<UserProgress>) => {
    const updatedProgress = {
      ...userProgress,
      ...newProgress,
      lastActivity: new Date()
    }
    setUserProgress(updatedProgress)
    localStorage.setItem('mastermind_progress', JSON.stringify(updatedProgress))
  }

  // Handle onboarding completion
  const handleOnboardingComplete = (result: OnboardingResult) => {
    const newProgress = {
      profile: result,
      currentXP: 150, // Starting XP bonus
      currentStreak: 1, // First day
      bestStreak: 1
    }
    
    saveProgress(newProgress)
    setCurrentPhase('command_deck')
  }

  // Handle streak system actions
  const handleStreakSaverActivate = () => {
    saveProgress({ streakSaverActive: true })
  }

  const handleContinueStreak = () => {
    const newStreak = userProgress.currentStreak + 1
    const newXP = userProgress.currentXP + (50 + newStreak * 10) // Increasing XP per streak day
    
    saveProgress({
      currentStreak: newStreak,
      bestStreak: Math.max(userProgress.bestStreak, newStreak),
      currentXP: newXP,
      streakSaverActive: false
    })
  }

  // Handle learning module start
  const handleStartLearning = () => {
    // Simulate starting learning mode
    saveProgress({
      currentXP: userProgress.currentXP + 25,
      totalLearningHours: userProgress.totalLearningHours + 0.5
    })
    
    // In a real app, this would navigate to learning content
    alert('🧠 Neural enhancement protocols initiating...\n\nLearning modules will be available in the next update!')
  }

  // Handle phase transitions
  const handlePhaseTransition = (newPhase: AppPhase) => {
    setCurrentPhase(newPhase)
  }

  return (
    <div className="min-h-screen bg-neural-black">
      <AnimatePresence mode="wait">
        {/* Onboarding Phase */}
        {currentPhase === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <OnboardingFlow 
              isVisible={true}
              onComplete={handleOnboardingComplete} 
            />
          </motion.div>
        )}

        {/* Command Deck Phase */}
        {currentPhase === 'command_deck' && userProgress.profile && (
          <motion.div
            key="command_deck"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              {/* Phase Navigation */}
              <div className="fixed top-6 right-6 z-50 flex space-x-3">
                <motion.button
                  onClick={() => handlePhaseTransition('streak_focus')}
                  className="neural-button-secondary px-4 py-2 rounded-xl text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔥 STREAKS
                </motion.button>
                
                <motion.button
                  onClick={() => setCurrentPhase('onboarding')}
                  className="neural-button-tertiary px-4 py-2 rounded-xl text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ⚙️ RECALIBRATE
                </motion.button>
              </div>

              <CommandDeck
                profile={userProgress.profile}
                currentXP={userProgress.currentXP}
                currentStreak={userProgress.currentStreak}
                onStartLearning={handleStartLearning}
              />
            </div>
          </motion.div>
        )}

        {/* Streak Focus Phase */}
        {currentPhase === 'streak_focus' && userProgress.profile && (
          <motion.div
            key="streak_focus"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="p-8"
          >
            {/* Back Navigation */}
            <div className="mb-8">
              <motion.button
                onClick={() => handlePhaseTransition('command_deck')}
                className="neural-button-secondary px-6 py-3 rounded-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Back to Command Deck
              </motion.button>
            </div>

            <StreakSystem
              currentStreak={userProgress.currentStreak}
              bestStreak={userProgress.bestStreak}
              streakSaverActive={userProgress.streakSaverActive}
              onStreakSaverActivate={handleStreakSaverActivate}
              onContinueStreak={handleContinueStreak}
            />
          </motion.div>
        )}

        {/* Loading/Error States */}
        {!userProgress.profile && currentPhase !== 'onboarding' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex items-center justify-center"
          >
            <StaggerContainer>
              <StaggerItem>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-4">
                    <GlitchText intensity="medium">
                      NEURAL INITIALIZATION
                    </GlitchText>
                  </div>
                  <div className="text-neural-text-secondary">
                    Preparing cognitive assessment protocols...
                  </div>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Stats Overlay (when not in onboarding) */}
      {currentPhase !== 'onboarding' && userProgress.profile && (
        <motion.div
          className="fixed bottom-6 left-6 neural-glass-dark p-4 rounded-2xl text-sm z-40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-neural-text-tertiary">XP:</span>
              <span className={userProgress.profile ? 'text-neural-cyan' : 'text-neutral-500'}>
                {userProgress.currentXP.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-neural-text-tertiary">Streak:</span>
              <span className="text-neural-orange">{userProgress.currentStreak}d</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-neural-text-tertiary">Hours:</span>
              <span className="text-neural-purple">{userProgress.totalLearningHours}h</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
