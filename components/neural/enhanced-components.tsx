'use client'

import React from 'react'
import { cn } from '../../lib/utils'
import { TIER_CONFIG } from '../../lib/theme'
import { PricingTier } from '../../lib/pricing'
import { 
  GlitchText, 
  Magnetic, 
  RevealOnScroll, 
  StaggerContainer, 
  StaggerItem,
  PulseLine,
  NeuralPulse,
  DataFlowIndicator,
  NeuralSpinner
} from '../neural/motion-branding'

// Helper function to convert danger level to number of indicators
function getDangerLevelCount(danger: string): number {
  const levels = { 'SAFE': 1, 'CAUTION': 2, 'WARNING': 3, 'DANGER': 4, 'LETHAL': 5 }
  return levels[danger as keyof typeof levels] || 1
}

interface EnhancedPricingCardProps {
  tier: PricingTier
  title: string
  price: string
  description: string
  features: Array<{
    name: string
    included: boolean
    limit?: number | string
  }>
  isPopular?: boolean
  isCurrentPlan?: boolean
  isLoading?: boolean
  onUpgrade: () => void
  ctaText: string
}

export function EnhancedPricingCard({
  tier,
  title,
  price,
  description,
  features,
  isPopular = false,
  isCurrentPlan = false,
  isLoading = false,
  onUpgrade,
  ctaText
}: EnhancedPricingCardProps) {
  const config = TIER_CONFIG[tier]
  
  return (
    <RevealOnScroll className="relative">
      <div
        className={cn(
          'relative rounded-3xl transition-all duration-500 border-2 backdrop-blur-xl overflow-hidden group',
          'neural-glass neural-border',
          'shadow-2xl hover:shadow-neural-glow',
          isPopular && 'ring-4 ring-neural-electric/50 shadow-neural-electric/40 scale-105 border-neural-electric/50',
          isCurrentPlan && 'ring-4 ring-emerald-500/50 border-emerald-500/50 neural-glass-success',
          !isPopular && !isCurrentPlan && 'border-neural-border'
        )}
      >
        {/* Animated border pulse for popular tier */}
        {isPopular && (
          <div className="absolute inset-0 rounded-3xl">
            <PulseLine direction="horizontal" className="absolute top-0 left-0 right-0" />
            <PulseLine direction="horizontal" className="absolute bottom-0 left-0 right-0" />
            <PulseLine direction="vertical" className="absolute left-0 top-0 bottom-0" />
            <PulseLine direction="vertical" className="absolute right-0 top-0 bottom-0" />
          </div>
        )}

        {/* Neural scan effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-neural-purple/5 to-neural-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Danger level indicator */}
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          {Array.from({ length: getDangerLevelCount(config.danger) }).map((_, i) => (
            <NeuralPulse 
              key={i} 
              size={8} 
              color={config.color} 
              intensity="low"
              className="opacity-60"
            />
          ))}
        </div>

        {/* Popular badge with glitch effect */}
        {isPopular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-gradient-to-r from-neural-electric to-neural-pink px-6 py-2 rounded-full text-xs font-bold text-black">
              <GlitchText intensity="medium">
                MOST DANGEROUS
              </GlitchText>
            </div>
          </div>
        )}

        <div className="relative p-8 z-10">
          <StaggerContainer>
            {/* Header */}
            <StaggerItem>
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <GlitchText className="text-2xl font-bold neural-text-gradient">
                    {title}
                  </GlitchText>
                  {isCurrentPlan && (
                    <span className="ml-3 text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                      ACTIVE
                    </span>
                  )}
                </div>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold neural-text-primary">
                    {price}
                  </span>
                  {price !== 'FREE' && (
                    <span className="text-neural-muted ml-2">once</span>
                  )}
                </div>
                
                <p className="text-neural-muted text-sm">
                  {description}
                </p>
              </div>
            </StaggerItem>

            {/* Features list */}
            <StaggerItem>
              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className={cn(
                      'flex items-center space-x-3 p-3 rounded-xl transition-colors',
                      feature.included 
                        ? 'bg-neural-success/10 border border-neural-success/20' 
                        : 'bg-neural-muted/5 border border-neural-muted/20'
                    )}
                  >
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                      feature.included 
                        ? 'bg-neural-success text-black' 
                        : 'bg-neural-muted/30 text-neural-muted'
                    )}>
                      {feature.included ? '✓' : '✗'}
                    </div>
                    
                    <div className="flex-1">
                      <span className={cn(
                        'text-sm',
                        feature.included ? 'text-neural-foreground' : 'text-neural-muted'
                      )}>
                        {feature.name}
                      </span>
                      {feature.limit && (
                        <span className="text-xs text-neural-muted ml-2">
                          ({feature.limit})
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </StaggerItem>

            {/* CTA Button */}
            <StaggerItem>
              <Magnetic strength={0.4}>
                <button
                  onClick={onUpgrade}
                  disabled={isLoading || isCurrentPlan}
                  className={cn(
                    'w-full py-4 px-6 rounded-2xl font-bold text-base transition-all duration-300',
                    'neural-button-primary neural-magnetic',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'flex items-center justify-center space-x-3',
                    isCurrentPlan && 'neural-button-success cursor-default'
                  )}
                >
                  {isLoading ? (
                    <>
                      <NeuralSpinner size={20} />
                      <span>Processing...</span>
                    </>
                  ) : isCurrentPlan ? (
                    <>
                      <span>Current Plan</span>
                      <DataFlowIndicator />
                    </>
                  ) : (
                    <GlitchText intensity="low">
                      {ctaText}
                    </GlitchText>
                  )}
                </button>
              </Magnetic>
            </StaggerItem>
          </StaggerContainer>
        </div>

        {/* Neural activity indicator */}
        <div className="absolute bottom-4 right-4">
          <div className="flex items-center space-x-2 text-xs text-neural-muted">
            <span>Neural Activity</span>
            <DataFlowIndicator />
          </div>
        </div>
      </div>
    </RevealOnScroll>
  )
}

// ===============================
// ENHANCED NEURAL BUTTON
// ===============================

interface NeuralButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  disabled?: boolean
  glitch?: boolean
  magnetic?: boolean
  className?: string
}

export function NeuralButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  glitch = false,
  magnetic = true,
  className = ''
}: NeuralButtonProps) {
  const baseClasses = cn(
    'inline-flex items-center justify-center font-medium transition-all duration-300',
    'rounded-2xl border-2 backdrop-blur-sm',
    'focus:outline-none focus:ring-4 focus:ring-neural-electric/30',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    {
      // Sizes
      'px-3 py-2 text-sm': size === 'sm',
      'px-6 py-3 text-base': size === 'md',
      'px-8 py-4 text-lg': size === 'lg',
      
      // Variants
      'neural-button-primary': variant === 'primary',
      'neural-button-secondary': variant === 'secondary',
      'neural-button-danger': variant === 'danger',
      'neural-button-success': variant === 'success',
    },
    magnetic && 'neural-magnetic',
    className
  )

  const ButtonContent = () => (
    <>
      {isLoading && <NeuralSpinner size={16} className="mr-2" />}
      {glitch ? (
        <GlitchText intensity="low">{children}</GlitchText>
      ) : (
        children
      )}
    </>
  )

  const button = (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={baseClasses}
      aria-label={typeof children === 'string' ? children : 'Neural button'}
    >
      <ButtonContent />
    </button>
  )

  return magnetic ? (
    <Magnetic strength={0.3}>
      {button}
    </Magnetic>
  ) : button
}

// ===============================
// ENHANCED NEURAL INPUT
// ===============================

interface NeuralInputProps {
  label?: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  disabled?: boolean
  className?: string
  glowOnFocus?: boolean
}

export function NeuralInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  className = '',
  glowOnFocus = true
}: NeuralInputProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium neural-text-primary">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            'w-full px-4 py-3 rounded-2xl border-2 transition-all duration-300',
            'neural-input bg-neural-background/50 border-neural-border',
            'text-neural-foreground placeholder-neural-muted',
            'focus:outline-none focus:border-neural-electric',
            glowOnFocus && 'focus:shadow-neural-glow',
            error && 'border-red-500 focus:border-red-500',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
        
        {glowOnFocus && (
          <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none neural-glass" />
        )}
      </div>
      
      {error && (
        <p className="text-red-400 text-xs">
          {error}
        </p>
      )}
    </div>
  )
}
