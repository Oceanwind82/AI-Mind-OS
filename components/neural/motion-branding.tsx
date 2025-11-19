'use client'

import React, { ReactNode } from 'react'
import { motion, Variants } from 'framer-motion'

// ===============================
// NEURAL TEXT EFFECTS
// ===============================

interface GlitchTextProps {
  children: ReactNode
  intensity?: 'low' | 'medium' | 'high'
  className?: string
}

export function GlitchText({ children, intensity = 'medium', className = '' }: GlitchTextProps) {
  const glitchVariants: Variants = {
    normal: { x: 0, textShadow: '0 0 0 transparent' },
    glitch: {
      x: [-2, 2, -1, 1, 0],
      textShadow: [
        '2px 0 #ff00ff, -2px 0 #00ffff',
        '-2px 0 #ff00ff, 2px 0 #00ffff',
        '1px 0 #ff00ff, -1px 0 #00ffff',
        '0 0 0 transparent'
      ],
      transition: { duration: 0.3, times: [0, 0.2, 0.4, 0.6, 1] }
    }
  }

  const triggerProps = intensity === 'high' 
    ? { whileHover: 'glitch', whileTap: 'glitch' }
    : intensity === 'medium'
    ? { whileHover: 'glitch' }
    : {}

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={glitchVariants}
      initial="normal"
      animate="normal"
      {...triggerProps}
    >
      {children}
    </motion.span>
  )
}

interface TypewriterTextProps {
  text: string
  delay?: number
  speed?: number
  className?: string
  onComplete?: () => void
}

export function TypewriterText({ text, delay = 0, speed = 50, className = '', onComplete }: TypewriterTextProps) {
  return (
    <motion.span
      className={`inline-block ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: delay + (index * speed / 1000),
            duration: 0.1
          }}
          onAnimationComplete={index === text.length - 1 ? onComplete : undefined}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  )
}

// ===============================
// NEURAL PULSE EFFECTS
// ===============================

interface PulseLineProps {
  direction?: 'horizontal' | 'vertical'
  color?: string
  duration?: number
  className?: string
}

export function PulseLine({ direction = 'horizontal', color = 'var(--neural-cyan)', duration = 2, className = '' }: PulseLineProps) {
  const lineVariants: Variants = {
    initial: {
      [direction === 'horizontal' ? 'scaleX' : 'scaleY']: 0,
      opacity: 0
    },
    animate: {
      [direction === 'horizontal' ? 'scaleX' : 'scaleY']: [0, 1, 0],
      opacity: [0, 1, 0]
    }
  }

  const transitionProps = {
    duration,
    repeat: Infinity,
    ease: 'easeInOut' as const
  }

  return (
    <motion.div
      className={`${className} ${direction === 'horizontal' ? 'h-px w-full' : 'w-px h-full'}`}
      style={{ 
        backgroundColor: color,
        boxShadow: `0 0 10px ${color}`,
        transformOrigin: direction === 'horizontal' ? 'left center' : 'center top'
      }}
      variants={lineVariants}
      initial="initial"
      animate="animate"
      transition={transitionProps}
    />
  )
}

interface NeuralPulseProps {
  size?: number
  color?: string
  intensity?: 'low' | 'medium' | 'high'
  className?: string
}

export function NeuralPulse({ size = 20, color = 'var(--neural-electric)', intensity = 'medium', className = '' }: NeuralPulseProps) {
  const pulseScale = intensity === 'high' ? [1, 2.5, 1] : intensity === 'medium' ? [1, 2, 1] : [1, 1.5, 1]
  const duration = intensity === 'high' ? 1.5 : intensity === 'medium' ? 2 : 3

  return (
    <motion.div
      className={`rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 ${size}px ${color}`
      }}
      animate={{
        scale: pulseScale,
        opacity: [0.8, 0.4, 0.8]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  )
}

// ===============================
// MAGNETIC HOVER EFFECTS
// ===============================

interface MagneticProps {
  children: ReactNode
  strength?: number
  className?: string
}

export function Magnetic({ children, strength = 0.3, className = '' }: MagneticProps) {
  return (
    <motion.div
      className={`inline-block ${className}`}
      whileHover={{
        scale: 1 + (strength * 0.1),
        y: -2,
        transition: { type: 'spring', stiffness: 400, damping: 10 }
      }}
      whileTap={{
        scale: 1 - (strength * 0.05),
        transition: { type: 'spring', stiffness: 400, damping: 10 }
      }}
    >
      {children}
    </motion.div>
  )
}

// ===============================
// PAGE TRANSITIONS
// ===============================

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.div>
  )
}

interface StaggerContainerProps {
  children: ReactNode
  stagger?: number
  className?: string
}

export function StaggerContainer({ children, stagger = 0.1, className = '' }: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: stagger
          }
        }
      }}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: ReactNode
  className?: string
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}

// ===============================
// NEURAL LOADING STATES
// ===============================

export function NeuralSpinner({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <div 
      className={`relative neural-spinner ${className}`}
      data-size={size}
    >
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-neural-cyan/30 neural-spinner-outer"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      <motion.div
        className="absolute inset-2 rounded-full border-2 border-neural-purple/30 neural-spinner-inner"
        animate={{ rotate: -360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  )
}

export function DataFlowIndicator({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1 h-1 bg-neural-electric rounded-full"
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}

// ===============================
// NEURAL REVEAL ANIMATIONS
// ===============================

interface RevealOnScrollProps {
  children: ReactNode
  className?: string
  threshold?: number
}

export function RevealOnScroll({ children, className = '', threshold = 0.1 }: RevealOnScrollProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: threshold }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}
