'use client';

import { useState } from 'react';
import { PRICING_PLANS, PlanTier } from '../lib/stripe';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: PlanTier;
  onUpgrade: (tier: PlanTier) => void;
}

export default function UpgradeModal({ isOpen, onClose, currentTier, onUpgrade }: UpgradeModalProps) {
  const [loading, setLoading] = useState<PlanTier | null>(null);

  if (!isOpen) return null;

  const handleUpgrade = async (tier: PlanTier) => {
    setLoading(tier);
    try {
      await onUpgrade(tier);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Upgrade to Pro</h2>
              <p className="text-gray-600 mt-1">Unlock unlimited AI tutoring and advanced features</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(PRICING_PLANS).map(([tier, plan]) => (
              <div
                key={tier}
                className={`relative rounded-xl border-2 p-6 ${
                  tier === 'pro' 
                    ? 'border-blue-500 bg-blue-50' 
                    : tier === 'master'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200'
                }`}
              >
                {tier === 'pro' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    {plan.price > 0 && <span className="text-gray-600">/month</span>}
                  </div>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  {currentTier === tier ? (
                    <div className="w-full py-3 px-4 bg-gray-100 text-gray-600 rounded-lg text-center font-medium">
                      Current Plan
                    </div>
                  ) : tier === 'free' ? (
                    <div className="w-full py-3 px-4 bg-gray-100 text-gray-600 rounded-lg text-center font-medium">
                      Free Forever
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(tier as PlanTier)}
                      disabled={loading !== null}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                        tier === 'pro'
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading === tier ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        `Upgrade to ${plan.name}`
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="text-center text-sm text-gray-600">
            <p>✨ All plans include access to GPT-4 powered AI tutoring</p>
            <p>🔒 Secure payments powered by Stripe • Cancel anytime</p>
          </div>
        </div>
      </div>
    </div>
  );
}
