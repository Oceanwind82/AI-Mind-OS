'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlitchText, Magnetic, NeuralPulse } from '../neural/motion-branding'
import { ONBOARDING_QUESTIONS } from '../../lib/onboarding-questions'
import { OnboardingOption, PersonalityTraits } from '../../lib/onboarding'

interface QuestionEngineProps {
  onComplete: (traits: PersonalityTraits) => void
  isVisible: boolean
}

interface AnswerState {
  questionId: string
  selectedOption: OnboardingOption
}

export function QuestionEngine({ onComplete, isVisible }: QuestionEngineProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerState[]>([])
  const [showNeuralEffect, setShowNeuralEffect] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const currentQuestion = ONBOARDING_QUESTIONS[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / ONBOARDING_QUESTIONS.length) * 100

  const handleAnswer = async (option: OnboardingOption) => {
    const newAnswer: AnswerState = {
      questionId: currentQuestion.id,
      selectedOption: option
    }

    setAnswers(prev => [...prev, newAnswer])
    
    // Trigger neural effect based on option impact
    if (option.neural_impact >= 4) {
      setShowNeuralEffect(true)
      setTimeout(() => setShowNeuralEffect(false), 1000)
    }

    // Transition to next question or complete
    setIsTransitioning(true)
    
    setTimeout(() => {
      if (currentQuestionIndex < ONBOARDING_QUESTIONS.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        setIsTransitioning(false)
      } else {
        // Complete assessment - compile traits
        const traits = compilePersonalityTraits([...answers, newAnswer])
        onComplete(traits)
      }
    }, 800)
  }

  const compilePersonalityTraits = (allAnswers: AnswerState[]): PersonalityTraits => {
    const traits: Partial<PersonalityTraits> = {}

    // Compile traits from all answers
    allAnswers.forEach(answer => {
      const answerTraits = answer.selectedOption.traits
      if (answerTraits.pressure_response) traits.pressure_response = answerTraits.pressure_response
      if (answerTraits.operating_style) traits.operating_style = answerTraits.operating_style
      if (answerTraits.preference_vector) traits.preference_vector = answerTraits.preference_vector
      if (answerTraits.risk_tolerance) traits.risk_tolerance = answerTraits.risk_tolerance
      if (answerTraits.cognitive_speed) traits.cognitive_speed = answerTraits.cognitive_speed
    })

    // Fill in any missing traits with defaults
    return {
      pressure_response: traits.pressure_response || 'calculated',
      operating_style: traits.operating_style || 'analyst',
      preference_vector: traits.preference_vector || 'optimization',
      risk_tolerance: traits.risk_tolerance || 'moderate',
      cognitive_speed: traits.cognitive_speed || 'rapid'
    }
  }

  if (!isVisible || !currentQuestion) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-neural-black flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Neural Background Effects */}
      <div className="absolute inset-0 opacity-10">
        {/* Dynamic neural grid based on question category */}
        <div className={`neural-grid ${currentQuestion.category}-pattern`} />
        
        {/* Neural effect overlay */}
        <AnimatePresence>
          {showNeuralEffect && (
            <motion.div
              className="absolute inset-0 bg-gradient-radial from-neural-red/20 to-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.2 }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 1 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-8 left-8 right-8">
        <div className="flex items-center justify-between mb-4">
          <div className="text-neural-text-secondary font-mono text-sm">
            NEURAL ASSESSMENT
          </div>
          <div className="text-neural-text-secondary font-mono text-sm">
            {currentQuestionIndex + 1} / {ONBOARDING_QUESTIONS.length}
          </div>
        </div>
        
        <div className="w-full h-1 bg-neural-surface-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-neural-cyan to-neural-purple"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Question Interface */}
      <div className="relative z-10 max-w-4xl mx-auto px-8 py-16">
        <AnimatePresence mode="wait">
          {!isTransitioning && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              {/* Question Category Indicator */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full neural-glass-bright border border-neural-border-bright">
                  <div className="w-2 h-2 bg-neural-cyan rounded-full animate-pulse" />
                  <span className="text-neural-text-secondary font-mono text-sm uppercase tracking-wider">
                    {currentQuestion.category.replace('_', ' ')}
                  </span>
                </div>
              </motion.div>

              {/* Main Question */}
              <motion.div
                className="mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h1 className="text-4xl font-bold text-neural-text-primary mb-4 leading-tight">
                  <GlitchText intensity="low">
                    {currentQuestion.question}
                  </GlitchText>
                </h1>
                
                {currentQuestion.subtitle && (
                  <p className="text-xl text-neural-text-secondary">
                    {currentQuestion.subtitle}
                  </p>
                )}
              </motion.div>

              {/* Neural Effect Description */}
              <motion.div
                className="mb-12 text-neural-text-tertiary font-mono text-sm italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                ◦ {currentQuestion.neural_effect}
              </motion.div>

              {/* Answer Options */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {currentQuestion.options.map((option, index) => (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + (index * 0.1) }}
                  >
                    <Magnetic strength={0.3}>
                      <button
                        onClick={() => handleAnswer(option)}
                        className={`
                          w-full p-6 rounded-2xl text-left transition-all duration-300
                          neural-glass border-2 hover:neural-glass-bright
                          ${option.danger_level >= 4 
                            ? 'border-neural-red/30 hover:border-neural-red/60 hover:shadow-neural-glow' 
                            : option.danger_level >= 3
                            ? 'border-neural-purple/30 hover:border-neural-purple/60'
                            : 'border-neural-border hover:border-neural-border-bright'
                          }
                          group relative overflow-hidden
                        `}
                      >
                        {/* Danger Level Indicators */}
                        <div className="absolute top-4 right-4 flex space-x-1">
                          {Array.from({ length: option.danger_level }).map((_, i) => (
                            <NeuralPulse
                              key={i}
                              size={6}
                              color={option.danger_level >= 4 ? '#ff0040' : '#8b5cf6'}
                              intensity="low"
                            />
                          ))}
                        </div>

                        {/* Option Text */}
                        <div className="pr-16">
                          <p className="text-lg font-medium text-neural-text-primary group-hover:text-white transition-colors">
                            {option.text}
                          </p>
                          
                          {/* Neural Impact Indicator */}
                          <div className="mt-3 flex items-center space-x-2 text-sm">
                            <span className="text-neural-text-tertiary">Neural Impact:</span>
                            <div className="flex space-x-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    i < option.neural_impact
                                      ? 'bg-neural-cyan'
                                      : 'bg-neural-surface-2'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Hover Effect Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neural-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </button>
                    </Magnetic>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transition State */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="text-center"
            >
              <div className="text-2xl font-mono text-neural-cyan mb-4">
                PROCESSING NEURAL PATTERN...
              </div>
              <div className="flex justify-center">
                <div className="w-16 h-1 bg-neural-surface-2 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-neural-cyan"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
