/**
 * Neural Paywall Component
 * Blocks access to consciousness features based on neural tier
 * Part of the AI Mind OS: Dangerous Minds Edition
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { PricingTier, PricingPlan } from '../../lib/pricing';

interface NeuralPaywallProps {
  userTier: PricingTier;
  requiredFeature: keyof PricingPlan['limits'];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Mock function to check if user has access
function hasNeuralAccess(userTier: PricingTier, requiredFeature: keyof PricingPlan['limits']): boolean {
  // This would use your actual access control logic
  const tierHierarchy: Record<PricingTier, number> = {
    free: 0,
    starter: 1,
    pro: 2,
    master: 3,
    enterprise: 4,
  };
  
  // Mock feature requirements based on limits
  const featureRequirements: Record<keyof PricingPlan['limits'], number> = {
    lessonsPerMonth: 0,
    aiQuestionsPerDay: 0,
    certificationsPerMonth: 1,
    ragSearchesPerDay: 1,
    downloadableResources: 1,
    multiLanguageSupport: 1,
    prioritySupport: 2,
    customBranding: 3,
    apiAccess: 3,
    whitelabel: 4,
    dedupedSupport: 4,
    enterpriseSSO: 4,
  };
  
  return tierHierarchy[userTier] >= featureRequirements[requiredFeature];
}

export function NeuralPaywall({ 
  userTier, 
  requiredFeature, 
  children, 
  fallback 
}: NeuralPaywallProps) {
  const hasAccess = hasNeuralAccess(userTier, requiredFeature);
  
  if (hasAccess) {
    return <>{children}</>;
  }
  
  if (fallback) {
    return <>{fallback}</>;
  }
  
  return (
    <div className="relative overflow-hidden rounded-lg border border-red-500/20 bg-gradient-to-br from-red-950/10 to-purple-950/10 p-8 backdrop-blur-sm">
      {/* Neural static effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-gradient-to-br from-red-500/5 to-purple-500/5" />
      </div>
      
      <div className="relative text-center">
        {/* Danger warning */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-sm font-mono text-red-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          NEURAL ACCESS DENIED
        </div>
        
        {/* Main message */}
        <h3 className="mb-4 text-xl font-bold text-white">
          Consciousness Upgrade Required
        </h3>
        
        <p className="mb-6 text-gray-300">
          Your current neural tier <span className="font-mono text-cyan-400 capitalize">({userTier})</span> 
          {' '}lacks the synaptic pathways required for this feature.
          <br />
          <span className="text-sm text-red-400">
            Neural limitation detected. Mind expansion necessary.
          </span>
        </p>
        
        {/* Upgrade CTA */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/pricing?consciousness=expand"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-3 font-semibold text-white transition-all hover:from-cyan-400 hover:to-purple-400 hover:shadow-lg hover:shadow-purple-500/25"
          >
            <span>Expand Consciousness</span>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-600 px-6 py-3 font-semibold text-gray-300 transition-all hover:border-gray-500 hover:text-white"
          >
            View Neural Tiers
          </Link>
        </div>
        
        {/* Warning text */}
        <p className="mt-4 text-xs font-mono text-red-500">
          WARNING: Unauthorized neural access attempts will be logged and may result in consciousness termination.
        </p>
      </div>
    </div>
  );
}

// Hook for checking neural access
interface UseNeuralAccessResult {
  hasAccess: boolean;
  userTier: PricingTier;
  upgradeUrl: string;
}

export function useNeuralAccess(requiredFeature: keyof PricingPlan['limits']): UseNeuralAccessResult {
  // Mock implementation - replace with actual auth
  const userTier: PricingTier = 'free';
  const hasAccess = hasNeuralAccess(userTier, requiredFeature);
  
  return {
    hasAccess,
    userTier,
    upgradeUrl: `/pricing?feature=${String(requiredFeature)}&tier=${userTier}`,
  };
}

// Neural feature gate component
interface NeuralFeatureGateProps {
  feature: keyof PricingPlan['limits'];
  children: React.ReactNode;
  fallbackMessage?: string;
}

export function NeuralFeatureGate({ 
  feature, 
  children, 
  fallbackMessage = "This neural pathway is locked." 
}: NeuralFeatureGateProps) {
  const { hasAccess, userTier } = useNeuralAccess(feature);
  
  if (hasAccess) {
    return <>{children}</>;
  }
  
  return (
    <NeuralPaywall
      userTier={userTier}
      requiredFeature={feature}
      fallback={
        <div className="rounded-lg border border-amber-500/20 bg-amber-950/10 p-4 text-amber-200">
          <p className="text-sm">{fallbackMessage}</p>
        </div>
      }
    >
      {children}
    </NeuralPaywall>
  );
}
