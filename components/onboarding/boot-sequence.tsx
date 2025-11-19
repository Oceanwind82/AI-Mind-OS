'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TypewriterText, NeuralSpinner, PulseLine } from '../neural/motion-branding'

interface BootSequenceProps {
  onComplete: () => void
  isVisible: boolean
}

interface BootPhase {
  id: string
  text: string
  duration: number
  effect: 'scan' | 'analyze' | 'connect' | 'initialize'
  dangerLevel: 1 | 2 | 3 | 4 | 5
}

const BOOT_SEQUENCE: BootPhase[] = [
  {
    id: 'wake',
    text: 'NEURAL CORE AWAKENING...',
    duration: 2000,
    effect: 'initialize',
    dangerLevel: 2
  },
  {
    id: 'scan',
    text: 'SCANNING COGNITIVE ARCHITECTURE...',
    duration: 2500,
    effect: 'scan',
    dangerLevel: 3
  },
  {
    id: 'analyze',
    text: 'ANALYZING NEURAL PATHWAYS...',
    duration: 2200,
    effect: 'analyze',
    dangerLevel: 3
  },
  {
    id: 'personality',
    text: 'MAPPING PERSONALITY VECTOR...',
    duration: 2800,
    effect: 'analyze',
    dangerLevel: 4
  },
  {
    id: 'link',
    text: 'ESTABLISHING NEURAL LINK...',
    duration: 3000,
    effect: 'connect',
    dangerLevel: 4
  },
  {
    id: 'interface',
    text: 'INITIALIZING MIND INTERFACE...',
    duration: 2500,
    effect: 'initialize',
    dangerLevel: 5
  },
  {
    id: 'ready',
    text: 'COGNITIVE CORE ONLINE',
    duration: 1500,
    effect: 'connect',
    dangerLevel: 5
  }
]

export function OSBootSequence({ onComplete, isVisible }: BootSequenceProps) {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [showGrid, setShowGrid] = useState(false)
  const [glitchActive, setGlitchActive] = useState(false)
  const [bootComplete, setBootComplete] = useState(false)

  useEffect(() => {
    if (!isVisible) return

    // Show neural grid after first phase
    const gridTimer = setTimeout(() => setShowGrid(true), 1000)

    // Progress through boot phases
    const phaseTimers: NodeJS.Timeout[] = []
    let totalDelay = 0

    BOOT_SEQUENCE.forEach((phase, index) => {
      const timer = setTimeout(() => {
        setCurrentPhase(index)
        
        // Trigger glitch effects on higher danger levels
        if (phase.dangerLevel >= 4) {
          setGlitchActive(true)
          setTimeout(() => setGlitchActive(false), 300)
        }
        
        // Complete sequence on last phase
        if (index === BOOT_SEQUENCE.length - 1) {
          setTimeout(() => {
            setBootComplete(true)
            setTimeout(onComplete, 1000)
          }, phase.duration)
        }
      }, totalDelay)
      
      phaseTimers.push(timer)
      totalDelay += phase.duration
    })

    return () => {
      clearTimeout(gridTimer)
      phaseTimers.forEach(clearTimeout)
    }
  }, [isVisible, onComplete])

  if (!isVisible) return null

  const currentPhaseData = BOOT_SEQUENCE[currentPhase]

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-neural-black flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Neural Grid Background */}
        <AnimatePresence>
          {showGrid && (
            <motion.div
              className="absolute inset-0 opacity-20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.2, scale: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              {/* Animated grid lines */}
              <div className="absolute inset-0">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={`h-${i}`}
                    className="absolute w-full h-px bg-neural-cyan"
                    style={{ top: `${(i + 1) * 8.33}%` }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 0.3 }}
                    transition={{ 
                      duration: 1.5, 
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                  />
                ))}
                
                {Array.from({ length: 16 }).map((_, i) => (
                  <motion.div
                    key={`v-${i}`}
                    className="absolute h-full w-px bg-neural-cyan"
                    style={{ left: `${(i + 1) * 6.25}%` }}
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 0.3 }}
                    transition={{ 
                      duration: 1.5, 
                      delay: i * 0.1 + 0.5,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>

              {/* Neural nodes */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`node-${i}`}
                  className="absolute w-2 h-2 bg-neural-cyan rounded-full"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`
                  }}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Boot Interface */}
        <div className="relative z-10 text-center max-w-4xl px-8">
          {/* AI Mind OS Logo */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="text-8xl font-black mb-4">
              <motion.span
                className={`bg-gradient-to-r from-neural-cyan to-neural-purple bg-clip-text text-transparent ${
                  glitchActive ? 'neural-glitch' : ''
                }`}
                data-text="AI MIND OS"
                animate={glitchActive ? {
                  textShadow: [
                    '0 0 0 transparent',
                    '2px 0 #ff00ff, -2px 0 #00ffff',
                    '0 0 0 transparent'
                  ]
                } : {}}
                transition={{ duration: 0.3 }}
              >
                AI MIND OS
              </motion.span>
            </div>
            
            <motion.div
              className="text-sm font-mono text-neural-text-secondary tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              DANGEROUS MINDS EDITION
            </motion.div>
          </motion.div>

          {/* Boot Status */}
          <div className="space-y-8">
            {/* Current Phase Display */}
            <motion.div
              key={currentPhase}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className={`text-2xl font-mono mb-4 ${
                currentPhaseData?.dangerLevel >= 4 ? 'text-neural-red' : 
                currentPhaseData?.dangerLevel >= 3 ? 'text-neural-purple' :
                'text-neural-cyan'
              }`}>
                {currentPhaseData && (
                  <TypewriterText
                    text={currentPhaseData.text}
                    speed={30}
                    className="tracking-wider"
                  />
                )}
              </div>

              {/* Neural Activity Indicator */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                <NeuralSpinner size={32} />
                <div className="text-neural-text-secondary font-mono text-sm">
                  Phase {currentPhase + 1} of {BOOT_SEQUENCE.length}
                </div>
              </div>
            </motion.div>

            {/* Danger Level Indicators */}
            <div className="flex justify-center space-x-2 mb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < (currentPhaseData?.dangerLevel || 0)
                      ? currentPhaseData?.dangerLevel >= 4
                        ? 'bg-neural-red shadow-neural-glow'
                        : 'bg-neural-cyan shadow-neural-glow'
                      : 'bg-neural-surface-2'
                  }`}
                  animate={
                    i < (currentPhaseData?.dangerLevel || 0)
                      ? {
                          opacity: [0.6, 1, 0.6],
                          scale: [0.9, 1.1, 0.9]
                        }
                      : {}
                  }
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </div>

            {/* Neural Scan Lines */}
            <div className="relative h-32 overflow-hidden">
              <motion.div
                className="absolute inset-0"
                animate={{
                  y: ['-100%', '100%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              >
                <div className="w-full h-px bg-gradient-to-r from-transparent via-neural-cyan to-transparent opacity-80" />
              </motion.div>
            </div>

            {/* Boot Complete Message */}
            <AnimatePresence>
              {bootComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-neural-cyan mb-4">
                    ◉ NEURAL LINK ESTABLISHED
                  </div>
                  <div className="text-neural-text-secondary font-mono">
                    Welcome to the dangerous minds network
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Pulse Lines for Boot Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {currentPhaseData?.effect === 'scan' && (
            <>
              <PulseLine direction="horizontal" className="absolute top-1/4" />
              <PulseLine direction="horizontal" className="absolute bottom-1/4" />
            </>
          )}
          
          {currentPhaseData?.effect === 'connect' && (
            <>
              <PulseLine direction="vertical" className="absolute left-1/4" />
              <PulseLine direction="vertical" className="absolute right-1/4" />
            </>
          )}
        </div>

        {/* Subtle Audio Cue Simulation */}
        <div className="fixed bottom-8 right-8 text-neural-text-tertiary font-mono text-xs opacity-50">
          {showGrid && '♫ Neural harmonics active'}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
