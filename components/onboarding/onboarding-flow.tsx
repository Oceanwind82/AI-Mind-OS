'use client'

import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { OSBootSequence } from './boot-sequence'
import { QuestionEngine } from './question-engine'
import { ArchetypeAssignment } from './archetype-assignment'
import { PersonalityTraits, UserArchetype, NeuralPathway } from '../../lib/onboarding'
import { calculateArchetype } from '../../lib/onboarding-questions'

interface OnboardingFlowProps {
  isVisible: boolean
  onComplete: (result: OnboardingResult) => void
}

export interface OnboardingResult {
  archetype: UserArchetype
  pathway: NeuralPathway
  traits: PersonalityTraits
  confidence: number
}

type OnboardingPhase = 'boot' | 'assessment' | 'archetype' | 'complete'

export function OnboardingFlow({ isVisible, onComplete }: OnboardingFlowProps) {
  const [currentPhase, setCurrentPhase] = useState<OnboardingPhase>('boot')
  const [assessmentResult, setAssessmentResult] = useState<{
    traits: PersonalityTraits
    archetype: UserArchetype
    pathway: NeuralPathway
    confidence: number
  } | null>(null)

  const handleBootComplete = () => {
    setCurrentPhase('assessment')
  }

  const handleAssessmentComplete = (traits: PersonalityTraits) => {
    const result = calculateArchetype(traits)
    
    setAssessmentResult({
      traits,
      archetype: result.archetype as UserArchetype,
      pathway: result.pathway as NeuralPathway,
      confidence: result.confidence
    })
    
    setCurrentPhase('archetype')
  }

  const handleArchetypeComplete = () => {
    if (assessmentResult) {
      onComplete({
        archetype: assessmentResult.archetype,
        pathway: assessmentResult.pathway,
        traits: assessmentResult.traits,
        confidence: assessmentResult.confidence
      })
    }
    
    setCurrentPhase('complete')
  }

  return (
    <AnimatePresence mode="wait">
      {isVisible && currentPhase === 'boot' && (
        <OSBootSequence
          key="boot"
          isVisible={true}
          onComplete={handleBootComplete}
        />
      )}
      
      {isVisible && currentPhase === 'assessment' && (
        <QuestionEngine
          key="assessment"
          isVisible={true}
          onComplete={handleAssessmentComplete}
        />
      )}
      
      {isVisible && currentPhase === 'archetype' && assessmentResult && (
        <ArchetypeAssignment
          key="archetype"
          isVisible={true}
          archetype={assessmentResult.archetype}
          pathway={assessmentResult.pathway}
          confidence={assessmentResult.confidence}
          onComplete={handleArchetypeComplete}
        />
      )}
    </AnimatePresence>
  )
}

// Hook for managing onboarding state
export function useOnboardingFlow() {
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(false)
  const [onboardingResult, setOnboardingResult] = useState<OnboardingResult | null>(null)

  const startOnboarding = () => {
    setIsOnboardingVisible(true)
  }

  const handleOnboardingComplete = (result: OnboardingResult) => {
    setOnboardingResult(result)
    setIsOnboardingVisible(false)
    
    // Store result in localStorage for persistence
    localStorage.setItem('neural_profile', JSON.stringify({
      ...result,
      completedAt: new Date().toISOString()
    }))
  }

  const hasCompletedOnboarding = () => {
    if (onboardingResult) return true
    
    const stored = localStorage.getItem('neural_profile')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setOnboardingResult(parsed)
        return true
      } catch {
        return false
      }
    }
    
    return false
  }

  return {
    isOnboardingVisible,
    onboardingResult,
    startOnboarding,
    handleOnboardingComplete,
    hasCompletedOnboarding
  }
}
