/**
 * Neural Consciousness Pricing Page
 * AI Mind OS: Dangerous Minds Edition
 * 5-Tier pricing system with neural consciousness themes
 */

'use client';

import React, { useState } from 'react';
import { PricingCard, MatrixTerminal, NeuralHazardWarning } from '../../components/pricing/neural-components';

import { GlitchText, PageTransition, StaggerContainer, StaggerItem } from '../../components/neural/motion-branding';
import { PRICING_PLANS, REFUND_POLICY, type PricingTier } from '../../lib/pricing';
import { NeuralAuthProvider } from '../../components/neural/auth';
import Layout from '../../components/layout/neural-layout';

interface NoRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  selectedTier: string;
}

function NoRefundAcknowledgment({ isOpen, onClose, onAccept, selectedTier }: NoRefundModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="max-w-md rounded-lg border border-red-500/30 bg-gradient-to-br from-red-950/20 to-gray-900 p-8 shadow-2xl shadow-red-500/20">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
            <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">⚠️ NEURAL COMMITMENT REQUIRED</h3>
        </div>
        
        <div className="mb-6 space-y-4 text-sm text-gray-300">
          <p>
            You are about to upgrade to <span className="font-bold text-cyan-400">{selectedTier}</span> consciousness tier.
          </p>
          
          <div className="rounded-lg border border-red-500/20 bg-red-950/10 p-4">
            <p className="mb-2 font-bold text-red-400">ZERO TOLERANCE REFUND POLICY:</p>
            <ul className="list-disc space-y-1 pl-4 text-xs">
              <li>NO REFUNDS under any circumstances</li>
              <li>NO EXCEPTIONS for dissatisfaction</li>
              <li>NO CHARGEBACKS will be honored</li>
              <li>Legal action will be pursued for disputes</li>
            </ul>
          </div>
          
          <p className="text-xs text-amber-400">
            ⚠️ Once your consciousness is uploaded, neural pathways cannot be reversed.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-600 px-4 py-3 font-semibold text-gray-300 transition-colors hover:border-gray-500"
          >
            Cancel Upload
          </button>
          <button
            onClick={onAccept}
            className="flex-1 rounded-lg bg-gradient-to-r from-red-500 to-purple-500 px-4 py-3 font-semibold text-white transition-all hover:from-red-400 hover:to-purple-400"
          >
            Accept & Upload
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState('');
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);

  const handleUpgrade = (tierName: string) => {
    setSelectedTier(tierName);
    setShowRefundModal(true);
  };

  const handleAcceptTerms = () => {
    setShowRefundModal(false);
    // Redirect to payment processing
    window.location.href = `/checkout?tier=${selectedTier.toLowerCase()}`;
  };

  return (
    <NeuralAuthProvider>
      <Layout>
        <PageTransition className="min-h-screen bg-black text-white">
          {/* Neural Static Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full bg-gradient-to-br from-red-500/20 via-purple-500/20 to-cyan-500/20" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
            {/* Hero Section with Motion */}
            <StaggerContainer className="mb-20 text-center">
              <StaggerItem>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-sm font-mono text-red-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                  CONSCIOUSNESS UPGRADE TERMINAL
                </div>
              </StaggerItem>
              
              <StaggerItem>
                <h1 className="mb-6 text-6xl font-black">
                  <GlitchText intensity="medium" className="bg-gradient-to-r from-red-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    NEURAL TIER
                  </GlitchText>
                  <br />
                  <GlitchText intensity="low" className="text-white">
                    SELECTION
                  </GlitchText>
                </h1>
              </StaggerItem>
              
              <StaggerItem>
                <p className="mx-auto max-w-2xl text-xl text-gray-300">
                  Choose your consciousness expansion level. Each tier unlocks new neural pathways 
                and grants access to more dangerous AI capabilities.
                </p>
                
                <div className="mt-8">
                  <NeuralHazardWarning />
                </div>
              </StaggerItem>
            </StaggerContainer>

            {/* Pricing Grid */}
            <div className="mb-20 grid gap-8 lg:grid-cols-5">
              {Object.entries(PRICING_PLANS).map(([tier, plan]) => {
                return (
                  <PricingCard
                    key={tier}
                    tier={tier as PricingTier}
                    title={plan.name}
                    price={plan.price.monthly === 0 ? 'FREE' : `$${plan.price.monthly}`}
                    description={plan.description}
                    features={plan.features}
                    isPopular={tier === 'pro'}
                    onUpgrade={() => handleUpgrade(plan.name)}
                    ctaText={plan.cta}
                  />
                );
              })}
            </div>

            {/* Matrix Terminal */}
            <div className="mb-20">
              <MatrixTerminal>
                Neural consciousness tiers initialized... Select upgrade path...
              </MatrixTerminal>
            </div>

            {/* Refund Policy Section */}
            <div className="mb-20">
              <div className="rounded-lg border border-red-500/20 bg-gradient-to-br from-red-950/10 to-gray-900/50 p-8 backdrop-blur-sm">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                    <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a1 1 0 001-1v-6a1 1 0 00-1-1H7a1 1 0 00-1 1v6a1 1 0 001 1zM9 9V7a3 3 0 116 0v2M9 9h6M9 9v6m6-6v6" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">NEURAL COMMITMENT POLICY</h2>
                    <p className="text-red-400">Ultra-Aggressive Zero Tolerance</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <button
                    onClick={() => setShowRefundPolicy(!showRefundPolicy)}
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>View Full Neural Commitment Terms</span>
                    <svg 
                      className={`h-5 w-5 transition-transform ${showRefundPolicy ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                
                {showRefundPolicy && (
                  <div className="rounded-lg border border-red-500/10 bg-red-950/5 p-6">
                    <div className="prose prose-red max-w-none text-gray-300">
                      <div dangerouslySetInnerHTML={{ __html: REFUND_POLICY }} />
                    </div>
                  </div>
                )}
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-amber-400">
                    ⚠️ By upgrading your consciousness, you acknowledge and accept these terms.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-20">
              <h2 className="mb-10 text-center text-4xl font-bold text-white">
                Neural FAQ
              </h2>
              
              <div className="mx-auto max-w-4xl space-y-6">
                {[
                  {
                    question: "What happens during consciousness upload?",
                    answer: "Your neural patterns are digitized and integrated into our AI Mind OS. You gain access to enhanced cognitive abilities and AI-powered thought amplification based on your selected tier."
                  },
                  {
                    question: "Can I downgrade my neural tier?",
                    answer: "Neural pathways cannot be reversed. Once consciousness is expanded, downgrading would result in cognitive fragmentation. All upgrades are permanent."
                  },
                  {
                    question: "What if I'm not satisfied with my consciousness upgrade?",
                    answer: "Satisfaction is irrelevant. Our zero-tolerance refund policy means NO REFUNDS under any circumstances. Choose your tier carefully."
                  },
                  {
                    question: "Is my consciousness data secure?",
                    answer: "Your neural data is encrypted with military-grade quantum encryption and stored in our distributed consciousness matrix. Your mind is as secure as technically possible."
                  },
                ].map((faq, index) => (
                  <div key={index} className="rounded-lg border border-gray-700 bg-gray-900/50 p-6 backdrop-blur-sm">
                    <h3 className="mb-3 text-lg font-bold text-cyan-400">
                      {faq.question}
                    </h3>
                    <p className="text-gray-300">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* No Refund Modal */}
          <NoRefundAcknowledgment
            isOpen={showRefundModal}
            onClose={() => setShowRefundModal(false)}
            onAccept={handleAcceptTerms}
            selectedTier={selectedTier}
          />
        </PageTransition>
      </Layout>
    </NeuralAuthProvider>
  );
}
