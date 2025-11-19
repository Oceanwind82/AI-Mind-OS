'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlitchText, TypewriterText, NeuralPulse, DataFlowIndicator } from '../neural/motion-branding'
import { ARCHETYPE_CONFIG, PATHWAY_CONFIG, type UserArchetype, type NeuralPathway } from '../../lib/onboarding'

interface ArchetypeAssignmentProps {
  archetype: UserArchetype
  pathway: NeuralPathway
  confidence: number
  onComplete: () => void
  isVisible: boolean
}

export function ArchetypeAssignment({ 
  archetype, 
  pathway, 
  confidence, 
  onComplete, 
  isVisible 
}: ArchetypeAssignmentProps) {
  const [phase, setPhase] = useState<'analyzing' | 'revealing' | 'confirming'>('analyzing')
  const [showArchetype, setShowArchetype] = useState(false)
  const [showPathway, setShowPathway] = useState(false)
  const [showSignature, setShowSignature] = useState(false)

  const archetypeConfig = ARCHETYPE_CONFIG[archetype]
  const pathwayConfig = PATHWAY_CONFIG[pathway]

  useEffect(() => {
    if (!isVisible) return

    const sequence = async () => {
      // Phase 1: Analyzing
      setTimeout(() => setPhase('revealing'), 2000)
      
      // Phase 2: Revealing
      setTimeout(() => setShowArchetype(true), 3000)
      setTimeout(() => setShowPathway(true), 4500)
      setTimeout(() => setShowSignature(true), 6000)
      setTimeout(() => setPhase('confirming'), 7000)
      
      // Phase 3: Complete
      setTimeout(() => onComplete(), 9000)
    }

    sequence()
  }, [isVisible, onComplete])

  if (!isVisible) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-neural-black flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Neural Background with Archetype Color */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at center, ${archetypeConfig.neural_color}15 0%, transparent 70%)`
          }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Danger Level Visualization */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: archetypeConfig.danger_level }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-full h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${archetypeConfig.neural_color}, transparent)`,
                top: `${20 + (i * 15)}%`
              }}
              animate={{
                opacity: [0, 1, 0],
                scaleX: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                repeatDelay: 2
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-5xl px-8">
        {/* Phase 1: Analyzing */}
        <AnimatePresence>
          {phase === 'analyzing' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-3xl font-mono text-neural-cyan mb-8">
                <TypewriterText 
                  text="ANALYZING COGNITIVE PATTERNS..."
                  speed={50}
                />
              </div>
              
              <div className="flex justify-center items-center space-x-8">
                <DataFlowIndicator />
                <div className="text-neural-text-secondary font-mono">
                  Neural Pattern Match: {confidence}%
                </div>
                <DataFlowIndicator />
              </div>

              <div className="grid grid-cols-3 gap-8 mt-12">
                {['PRESSURE VECTORS', 'OPERATING STYLE', 'PREFERENCE MATRIX'].map((label, i) => (
                  <motion.div
                    key={label}
                    className="neural-glass-bright p-6 rounded-2xl"
                    animate={{
                      borderColor: [
                        'rgba(255,255,255,0.1)',
                        archetypeConfig.neural_color + '50',
                        'rgba(255,255,255,0.1)'
                      ]
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.5,
                      repeat: Infinity
                    }}
                  >
                    <div className="text-sm text-neural-text-tertiary font-mono mb-2">
                      {label}
                    </div>
                    <div className="h-2 bg-neural-surface-2 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-neural-cyan to-neural-purple"
                        animate={{ width: ['0%', '100%', '0%'] }}
                        transition={{
                          duration: 1.5,
                          delay: i * 0.3,
                          repeat: Infinity,
                          repeatDelay: 1
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 2: Revealing */}
        <AnimatePresence>
          {phase === 'revealing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {/* Archetype Reveal */}
              <AnimatePresence>
                {showArchetype && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="mb-16"
                  >
                    <div className="mb-8">
                      <div className="text-2xl text-neural-text-secondary font-mono mb-4">
                        ARCHETYPE IDENTIFIED
                      </div>
                      
                      <div className="text-8xl font-black mb-6 neural-text-accent">
                        <GlitchText intensity="high">
                          {archetypeConfig.name.toUpperCase()}
                        </GlitchText>
                      </div>

                      <div className="text-xl text-neural-text-secondary max-w-3xl mx-auto mb-8">
                        {archetypeConfig.description}
                      </div>

                      {/* Danger Level Display */}
                      <div className="flex justify-center items-center space-x-4 mb-8">
                        <span className="text-neural-text-tertiary font-mono text-sm">
                          DANGER LEVEL:
                        </span>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <NeuralPulse
                            key={i}
                            size={12}
                            color={i < archetypeConfig.danger_level ? archetypeConfig.neural_color : '#333'}
                            intensity={i < archetypeConfig.danger_level ? "high" : "low"}
                          />
                        ))}
                        <span className="font-bold text-lg neural-text-accent">
                          {archetypeConfig.danger_level}/5
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pathway Reveal */}
              <AnimatePresence>
                {showPathway && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="neural-glass-bright p-8 rounded-3xl border-2"
                    style={{ borderColor: archetypeConfig.neural_color + '50' }}
                  >
                    <div className="text-lg text-neural-text-secondary font-mono mb-4">
                      NEURAL PATHWAY ASSIGNED
                    </div>
                    
                    <div className="text-4xl font-bold mb-4 neural-text-accent">
                      {pathwayConfig.name}
                    </div>
                    
                    <div className="text-neural-text-secondary mb-6">
                      {pathwayConfig.description}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {pathwayConfig.focus_areas.map((area, i) => (
                        <motion.div
                          key={area}
                          className="px-4 py-2 neural-glass rounded-xl border border-neural-border"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.2 }}
                        >
                          {area}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Signature Ability Reveal */}
              <AnimatePresence>
                {showSignature && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                  >
                    <div className="text-sm text-neural-text-tertiary font-mono mb-4">
                      SIGNATURE ABILITY UNLOCKED
                    </div>
                    
                    <div className="text-3xl font-bold mb-6 neural-glow-cyan neural-text-accent">
                      ◉ {archetypeConfig.signature_ability}
                    </div>

                    <motion.div
                      className="text-lg text-neural-text-primary font-medium italic max-w-2xl mx-auto"
                      animate={{
                        textShadow: [
                          '0 0 0 transparent',
                          `0 0 20px ${archetypeConfig.neural_color}50`,
                          '0 0 0 transparent'
                        ]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity
                      }}
                    >
                      &ldquo;{archetypeConfig.unlock_message}&rdquo;
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 3: Confirming */}
        <AnimatePresence>
          {phase === 'confirming' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-3xl font-mono text-neural-cyan mb-6">
                NEURAL PROFILE CONFIRMED
              </div>
              
              <div className="text-neural-text-secondary font-mono mb-8">
                Initializing cognitive enhancement protocols...
              </div>

              <motion.div
                className="w-64 h-2 bg-neural-surface-2 rounded-full mx-auto overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-neural-cyan to-neural-purple"
                  animate={{ width: ['0%', '100%'] }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
