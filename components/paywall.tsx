'use client';

import React from 'react';
import { PRICING_PLANS, PricingTier, getPaywallMessage } from '../lib/pricing';
import { X, Star, Check, ArrowRight, Zap, Crown } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: PricingTier;
  feature: string;
  suggestedTier: PricingTier;
  onUpgrade: (tier: PricingTier) => void;
}

export function PaywallModal({
  isOpen,
  onClose,
  currentTier,
  feature,
  suggestedTier,
  onUpgrade
}: PaywallModalProps) {
  if (!isOpen) return null;

  const paywallData = getPaywallMessage(currentTier, feature);
  const suggestedPlan = PRICING_PLANS[suggestedTier];

  const getTierIcon = (tier: PricingTier) => {
    switch (tier) {
      case 'free': return <Zap className="w-6 h-6 text-green-500" />;
      case 'starter': return <Star className="w-6 h-6 text-blue-500" />;
      case 'pro': return <Crown className="w-6 h-6 text-purple-500" />;
      case 'enterprise': return <Crown className="w-6 h-6 text-orange-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {getTierIcon(suggestedTier)}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {paywallData.title}
            </h2>
            <p className="text-gray-600">
              {paywallData.message}
            </p>
          </div>
        </div>

        {/* Plan Details */}
        <div className="px-6 pb-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{suggestedPlan.name}</h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  ${Math.round(suggestedPlan.price.yearly / 12)}
                </div>
                <div className="text-sm text-gray-500">/month</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{suggestedPlan.description}</p>
            
            {/* Key Benefits */}
            <div className="space-y-2">
              {suggestedPlan.features.filter(f => f.included).slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center text-sm">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{feature.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => onUpgrade(suggestedTier)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              {suggestedPlan.cta}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            
            <button
              onClick={onClose}
              className="w-full text-gray-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="px-6 pb-6">
          <div className="border-t pt-4">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center">
                <Check className="w-3 h-3 mr-1" />
                7-day free trial
              </span>
              <span className="flex items-center">
                <Check className="w-3 h-3 mr-1" />
                Cancel anytime
              </span>
              <span className="flex items-center text-red-600">
                <X className="w-3 h-3 mr-1" />
                NO REFUNDS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface UsageLimitBannerProps {
  feature: 'lessons' | 'aiQuestions' | 'certifications' | 'ragSearches';
  remaining: number;
  total: number;
  onUpgrade: () => void;
}

export function UsageLimitBanner({
  feature,
  remaining,
  total,
  onUpgrade
}: UsageLimitBannerProps) {
  const percentage = ((total - remaining) / total) * 100;
  const isNearLimit = percentage >= 80;
  const isAtLimit = remaining === 0;

  const getFeatureDisplayName = (feature: string) => {
    switch (feature) {
      case 'aiQuestions': return 'AI Questions';
      case 'ragSearches': return 'RAG Searches';
      case 'lessons': return 'Lessons';
      case 'certifications': return 'Certifications';
      default: return feature;
    }
  };

  if (!isNearLimit) return null;

  return (
    <div className={`rounded-lg p-4 mb-4 ${
      isAtLimit 
        ? 'bg-red-50 border border-red-200' 
        : 'bg-amber-50 border border-amber-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isAtLimit ? 'bg-red-500' : 'bg-amber-500'
            }`} />
            <h4 className={`font-medium ${
              isAtLimit ? 'text-red-800' : 'text-amber-800'
            }`}>
              {isAtLimit ? 'Limit Reached' : 'Approaching Limit'}
            </h4>
          </div>
          <p className={`text-sm ${
            isAtLimit ? 'text-red-700' : 'text-amber-700'
          }`}>
            {isAtLimit 
              ? `You've used all ${total} ${getFeatureDisplayName(feature).toLowerCase()} for this period.`
              : `${remaining} ${getFeatureDisplayName(feature).toLowerCase()} remaining out of ${total}.`
            }
          </p>
          
          {/* Progress Bar */}
          <ProgressBar percentage={percentage} isAtLimit={isAtLimit} />
        </div>
        
        <button
          onClick={onUpgrade}
          className={`ml-4 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            isAtLimit
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-amber-600 text-white hover:bg-amber-700'
          }`}
        >
          Upgrade
        </button>
      </div>
    </div>
  );
}

// Progress bar component with dynamic width
function ProgressBar({ percentage, isAtLimit }: { percentage: number; isAtLimit: boolean }) {
  const getWidthClass = (percentage: number) => {
    if (percentage >= 100) return 'w-full';
    if (percentage >= 90) return 'w-11/12';
    if (percentage >= 80) return 'w-4/5';
    if (percentage >= 75) return 'w-3/4';
    if (percentage >= 66) return 'w-2/3';
    if (percentage >= 50) return 'w-1/2';
    if (percentage >= 33) return 'w-1/3';
    if (percentage >= 25) return 'w-1/4';
    return 'w-1/5';
  };

  return (
    <div className="mt-2 bg-white rounded-full h-2 relative overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 absolute top-0 left-0 ${
          isAtLimit ? 'bg-red-500' : 'bg-amber-500'
        } ${getWidthClass(percentage)}`}
      />
    </div>
  );
}

interface FeatureLockedProps {
  feature: string;
  requiredTier: PricingTier;
  onUpgrade: () => void;
  className?: string;
}

export function FeatureLocked({
  feature,
  requiredTier,
  onUpgrade,
  className = ""
}: FeatureLockedProps) {
  const plan = PRICING_PLANS[requiredTier];
  
  return (
    <div className={`bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-6 text-center ${className}`}>
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
          <Crown className="w-6 h-6 text-gray-400" />
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {feature} Available in {plan.name}
      </h3>
      
      <p className="text-gray-600 mb-4">
        Upgrade to unlock this premium feature and enhance your AI learning experience.
      </p>
      
      <button
        onClick={onUpgrade}
        className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Upgrade to {plan.name}
      </button>
    </div>
  );
}

const PaywallComponents = {
  PaywallModal,
  UsageLimitBanner,
  FeatureLocked,
};

export default PaywallComponents;
