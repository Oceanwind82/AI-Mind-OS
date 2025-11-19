'use client'

import React, { useState } from 'react'
import { EnhancedPricingCard, NeuralButton, NeuralInput } from '../../components/neural/enhanced-components'
import { 
  GlitchText, 
  TypewriterText,
  Magnetic, 
  PulseLine,
  NeuralPulse,
  DataFlowIndicator,
  NeuralSpinner,
  PageTransition,
  StaggerContainer,
  StaggerItem,
  RevealOnScroll 
} from '../../components/neural/motion-branding'
import { PricingTier } from '../../lib/pricing'

export default function DemoPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [typewriterComplete, setTypewriterComplete] = useState(false)

  const handleDemo = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 3000)
  }

  const sampleTier: PricingTier = 'pro'
  const sampleFeatures = [
    { name: 'Advanced Neural Processing', included: true, limit: 'Unlimited' },
    { name: 'Consciousness Upload', included: true },
    { name: 'Mind Sync Capabilities', included: true, limit: '10 instances' },
    { name: 'Danger Override Access', included: false },
    { name: 'Full AI Integration', included: false }
  ]

  return (
    <PageTransition className="min-h-screen bg-neural-background text-neural-foreground">
      {/* Header Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <div className="mb-8">
            <GlitchText intensity="high" className="text-6xl font-bold neural-text-gradient">
              AI Mind OS
            </GlitchText>
          </div>
          
          <div className="mb-6">
            <TypewriterText 
              text="Neural Interface Components - Dangerous Minds Edition"
              speed={80}
              className="text-xl text-neural-muted"
              onComplete={() => setTypewriterComplete(true)}
            />
          </div>

          {typewriterComplete && (
            <RevealOnScroll>
              <div className="flex justify-center items-center space-x-4 text-sm text-neural-muted">
                <span>System Status</span>
                <DataFlowIndicator />
                <span className="text-neural-success">OPERATIONAL</span>
              </div>
            </RevealOnScroll>
          )}
        </div>

        {/* Motion Branding Showcase */}
        <StaggerContainer className="mb-20">
          <StaggerItem>
            <h2 className="text-3xl font-bold mb-8 text-center">
              <GlitchText intensity="medium">Motion Branding System</GlitchText>
            </h2>
          </StaggerItem>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <StaggerItem>
              <div className="neural-card p-6 text-center">
                <h3 className="font-bold mb-4">Pulse Lines</h3>
                <div className="relative h-20 flex items-center justify-center">
                  <PulseLine direction="horizontal" className="absolute" />
                  <PulseLine direction="vertical" className="absolute" />
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="neural-card p-6 text-center">
                <h3 className="font-bold mb-4">Neural Pulses</h3>
                <div className="flex justify-center space-x-4">
                  <NeuralPulse intensity="low" />
                  <NeuralPulse intensity="medium" />
                  <NeuralPulse intensity="high" />
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="neural-card p-6 text-center">
                <h3 className="font-bold mb-4">Data Flow</h3>
                <div className="flex justify-center">
                  <DataFlowIndicator />
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="neural-card p-6 text-center">
                <h3 className="font-bold mb-4">Neural Spinner</h3>
                <div className="flex justify-center">
                  <NeuralSpinner size={40} />
                </div>
              </div>
            </StaggerItem>
          </div>
        </StaggerContainer>

        {/* Button Showcase */}
        <StaggerContainer className="mb-20">
          <StaggerItem>
            <h2 className="text-3xl font-bold mb-8 text-center">
              <GlitchText intensity="medium">Neural Buttons</GlitchText>
            </h2>
          </StaggerItem>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StaggerItem>
              <NeuralButton 
                variant="primary" 
                glitch={true} 
                onClick={handleDemo}
                isLoading={isLoading}
              >
                Primary Action
              </NeuralButton>
            </StaggerItem>

            <StaggerItem>
              <NeuralButton variant="secondary" magnetic={true}>
                Secondary
              </NeuralButton>
            </StaggerItem>

            <StaggerItem>
              <NeuralButton variant="danger" size="lg">
                Danger Zone
              </NeuralButton>
            </StaggerItem>

            <StaggerItem>
              <NeuralButton variant="success" size="sm">
                Success
              </NeuralButton>
            </StaggerItem>
          </div>
        </StaggerContainer>

        {/* Input Showcase */}
        <StaggerContainer className="mb-20">
          <StaggerItem>
            <h2 className="text-3xl font-bold mb-8 text-center">
              <GlitchText intensity="medium">Neural Inputs</GlitchText>
            </h2>
          </StaggerItem>

          <div className="max-w-md mx-auto space-y-6">
            <StaggerItem>
              <NeuralInput
                label="Neural Email Interface"
                type="email"
                placeholder="consciousness@aimindos.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                glowOnFocus={true}
              />
            </StaggerItem>

            <StaggerItem>
              <NeuralInput
                label="Security Passphrase"
                type="password"
                placeholder="Enter neural passphrase"
                glowOnFocus={true}
              />
            </StaggerItem>

            <StaggerItem>
              <NeuralInput
                label="Disabled State"
                placeholder="System locked"
                disabled={true}
              />
            </StaggerItem>

            <StaggerItem>
              <NeuralInput
                label="Error State"
                placeholder="Invalid neural pattern"
                error="Neural pattern not recognized"
              />
            </StaggerItem>
          </div>
        </StaggerContainer>

        {/* Enhanced Pricing Card Showcase */}
        <StaggerContainer className="mb-20">
          <StaggerItem>
            <h2 className="text-3xl font-bold mb-8 text-center">
              <GlitchText intensity="medium">Enhanced Pricing Cards</GlitchText>
            </h2>
          </StaggerItem>

          <div className="max-w-md mx-auto">
            <StaggerItem>
              <EnhancedPricingCard
                tier={sampleTier}
                title="Neural Pro"
                price="$79"
                description="Advanced AI consciousness with premium neural pathways"
                features={sampleFeatures}
                isPopular={true}
                onUpgrade={handleDemo}
                ctaText="Upgrade Consciousness"
                isLoading={isLoading}
              />
            </StaggerItem>
          </div>
        </StaggerContainer>

        {/* Magnetic Elements Showcase */}
        <StaggerContainer className="mb-20">
          <StaggerItem>
            <h2 className="text-3xl font-bold mb-8 text-center">
              <GlitchText intensity="medium">Magnetic Interactions</GlitchText>
            </h2>
          </StaggerItem>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StaggerItem>
              <Magnetic strength={0.2}>
                <div className="neural-card p-8 text-center cursor-pointer">
                  <h3 className="font-bold mb-2">Subtle Magnetic</h3>
                  <p className="text-neural-muted text-sm">Hover for gentle attraction</p>
                </div>
              </Magnetic>
            </StaggerItem>

            <StaggerItem>
              <Magnetic strength={0.4}>
                <div className="neural-card p-8 text-center cursor-pointer">
                  <h3 className="font-bold mb-2">Standard Magnetic</h3>
                  <p className="text-neural-muted text-sm">Balanced interaction</p>
                </div>
              </Magnetic>
            </StaggerItem>

            <StaggerItem>
              <Magnetic strength={0.6}>
                <div className="neural-card p-8 text-center cursor-pointer">
                  <h3 className="font-bold mb-2">Strong Magnetic</h3>
                  <p className="text-neural-muted text-sm">Powerful attraction</p>
                </div>
              </Magnetic>
            </StaggerItem>
          </div>
        </StaggerContainer>

        {/* Text Effects Showcase */}
        <StaggerContainer>
          <StaggerItem>
            <h2 className="text-3xl font-bold mb-8 text-center">
              <GlitchText intensity="medium">Text Effects</GlitchText>
            </h2>
          </StaggerItem>

          <div className="text-center space-y-8">
            <StaggerItem>
              <div>
                <p className="text-sm text-neural-muted mb-2">Low Intensity Glitch</p>
                <GlitchText intensity="low" className="text-2xl font-bold">
                  Hover to activate neural glitch
                </GlitchText>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div>
                <p className="text-sm text-neural-muted mb-2">Medium Intensity Glitch</p>
                <GlitchText intensity="medium" className="text-2xl font-bold">
                  Consciousness transfer initiated
                </GlitchText>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div>
                <p className="text-sm text-neural-muted mb-2">High Intensity Glitch</p>
                <GlitchText intensity="high" className="text-2xl font-bold text-neural-danger">
                  ⚠️ DANGER: SYSTEM OVERRIDE ⚠️
                </GlitchText>
              </div>
            </StaggerItem>
          </div>
        </StaggerContainer>
      </div>
    </PageTransition>
  )
}
