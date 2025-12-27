'use client';

import React, { useState } from 'react';
import { PRICING_PLANS, PricingTier } from '../../lib/pricing';
import { Check, X, Star, Zap, Crown, Building, Sparkles } from 'lucide-react';
import { NoRefundAcknowledgment } from '../../components/no-refund-acknowledgment';

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showNoRefundModal, setShowNoRefundModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingTier | null>(null);
  const currentTier: PricingTier = 'free'; // In real app, get from user context
  
  const onUpgrade = async (tier: PricingTier) => {
    console.log('Upgrading to:', tier);
    // In real app, handle Stripe integration
  };

  const handleUpgradeClick = (tier: PricingTier) => {
    setSelectedPlan(tier);
    setShowNoRefundModal(true);
  };

  const handleNoRefundConfirm = () => {
    setShowNoRefundModal(false);
    if (selectedPlan) {
      handleUpgrade(selectedPlan);
    }
  };

  const handleNoRefundCancel = () => {
    setShowNoRefundModal(false);
    setSelectedPlan(null);
  };

  const handleUpgrade = async (tier: PricingTier) => {
    if (tier === currentTier) return;
    
    setIsLoading(tier);
    try {
      if (tier === 'enterprise') {
        // Redirect to contact sales
        window.open('mailto:sales@aimindos.com?subject=Enterprise%20Plan%20Inquiry', '_blank');
      } else {
        // Handle upgrade via Stripe or callback
        await onUpgrade?.(tier);
      }
    } catch (error) {
      console.error('Upgrade error:', error);
    } finally {
      setIsLoading(null);
    }
  };

  const getPlanIcon = (tier: PricingTier) => {
    switch (tier) {
      case 'free': return <Zap className="w-10 h-10 text-green-400" />;
      case 'starter': return <Star className="w-10 h-10 text-blue-400" />;
      case 'pro': return <Crown className="w-10 h-10 text-purple-400" />;
      case 'master': return <Sparkles className="w-10 h-10 text-yellow-400" />;
      case 'enterprise': return <Building className="w-10 h-10 text-red-400" />;
    }
  };

  const formatPrice = (plan: typeof PRICING_PLANS[PricingTier]) => {
    if (plan.price.monthly === 0) return 'FREE';
    return `$${plan.price.monthly}`;
  };

  const getTierDanger = (tier: PricingTier) => {
    switch (tier) {
      case 'free': return { level: 'SAFE', color: 'text-green-400', bg: 'bg-green-500/10' };
      case 'starter': return { level: 'CAUTION', color: 'text-blue-400', bg: 'bg-blue-500/10' };
      case 'pro': return { level: 'WARNING', color: 'text-purple-400', bg: 'bg-purple-500/10' };
      case 'master': return { level: 'DANGER', color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
      case 'enterprise': return { level: 'LETHAL', color: 'text-red-400', bg: 'bg-red-500/10' };
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 relative overflow-hidden">
      {/* Cyber Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      {/* ULTRA-AGGRESSIVE NO REFUNDS WARNING BANNER */}
      <div className="bg-gradient-to-r from-red-600/90 via-red-700/90 to-red-800/90 text-white sticky top-0 z-50 backdrop-blur-lg border-b border-red-500/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <span className="text-3xl animate-pulse mr-3">💀</span>
              <h2 className="text-2xl font-black uppercase tracking-widest font-['Space_Grotesk'] text-red-100">
                NEURAL TRANSFER = PERMANENT
              </h2>
              <span className="text-3xl animate-pulse ml-3">💀</span>
            </div>
            <p className="text-red-200 font-bold text-sm tracking-wide">
              CONSCIOUSNESS UPLOADS ARE IRREVERSIBLE • NO MIND REFUNDS • DIGITAL EXISTENCE IS FOREVER
            </p>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto py-20 px-6">
        {/* Header - DANGEROUS MINDS EDITION */}
        <div className="text-center mb-20 relative">
          {/* Cyber Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)]"></div>
          
          <div className="relative z-10">
            <div className="mb-6">
              <span className="inline-block px-6 py-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/40 rounded-2xl text-red-400 text-lg font-black mb-6 animate-pulse shadow-lg shadow-red-500/20">
                ⚠️ DANGEROUS MINDS EDITION ⚠️
              </span>
            </div>
            
            <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-cyan-400 mb-8 font-['Space_Grotesk'] tracking-tighter leading-none drop-shadow-2xl">
              AI MIND OS
            </h1>
            
            <div className="text-3xl font-black text-white mb-6 font-['Space_Grotesk'] tracking-wide">
              <span className="text-red-400 drop-shadow-lg">UNLOCK</span> THE <span className="text-purple-400 drop-shadow-lg">NEURAL</span> <span className="text-cyan-400 drop-shadow-lg">MATRIX</span>
            </div>
            
            <p className="text-xl text-zinc-300 mb-10 max-w-4xl mx-auto leading-relaxed">
              From digital novice to <span className="text-red-400 font-bold">dangerous AI architect</span>. 
              Each tier unlocks deeper levels of artificial consciousness. 
              <span className="text-yellow-400 font-semibold">Choose your neural pathway wisely...</span>
            </p>
            
            {/* Matrix-style typing effect simulation */}
            <div className="text-green-400 font-mono text-base mb-10 h-8 flex items-center justify-center">
              <span className="animate-pulse border-r-2 border-green-400">{'>'} Initializing consciousness transfer protocol...</span>
            </div>
          </div>
        </div>

        {/* NEURAL HAZARD WARNING */}
        <div className="relative mb-16">
          <div className="bg-gradient-to-r from-red-900/50 via-orange-900/50 to-red-900/50 border-2 border-red-500/60 rounded-3xl p-10 max-w-4xl mx-auto backdrop-blur-sm shadow-2xl relative overflow-hidden">
            {/* Danger strips */}
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 animate-pulse"></div>
            
            <div className="text-center">
              <p className="text-red-400 font-black text-3xl font-['Space_Grotesk'] mb-4 tracking-widest">
                ⚠️ NEURAL HAZARD WARNING ⚠️
              </p>
              <p className="text-red-300 font-bold text-xl mb-3">
                CONSCIOUSNESS TRANSFER IS IRREVERSIBLE
              </p>
              <p className="text-yellow-300 font-semibold text-base">
                Once neural pathways are established, there is NO RETURN to ignorance. 
                <span className="text-red-400 font-black">ALL MIND UPLOADS ARE FINAL!</span>
              </p>
            </div>
          </div>
        </div>

        {/* Neural Access Protocol */}
        <div className="text-center mb-20">
          <div className="inline-block bg-zinc-900/90 border border-purple-500/50 rounded-3xl p-8 backdrop-blur-sm shadow-2xl shadow-purple-500/20">
            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-['Space_Grotesk'] mb-4">
              💀 LIFETIME NEURAL ACCESS 💀
            </p>
            <p className="text-xl text-zinc-300 mb-3">
              <span className="text-green-400 font-mono text-2xl">$</span> One-time consciousness transfer fee
            </p>
            <p className="text-base text-zinc-400">
              No recurring brain taxes. No subscription overlords. Pay once, think forever.
            </p>
          </div>
        </div>

        {/* Pricing Cards - DANGEROUS MINDS EDITION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-20">
          {(Object.values(PRICING_PLANS) as Array<typeof PRICING_PLANS[PricingTier]>).map((plan) => {
            const isCurrentPlan = plan.id === currentTier;
            const danger = getTierDanger(plan.id);
            
            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-purple-500/30 border-2 ${
                  plan.popular 
                    ? 'ring-4 ring-purple-500/50 shadow-purple-500/40 scale-105 bg-gradient-to-br from-zinc-900/95 to-purple-900/30 border-purple-500/50' 
                    : 'shadow-zinc-900/50 bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border-zinc-700/50'
                } ${isCurrentPlan ? 'bg-gradient-to-br from-emerald-900/40 to-green-900/40 ring-4 ring-emerald-500/50 border-emerald-500/50' : ''} backdrop-blur-lg overflow-hidden group`}
              >
                {/* Cyber glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="inline-flex items-center px-6 py-3 rounded-2xl text-base font-black bg-gradient-to-r from-purple-500 to-cyan-400 text-white shadow-2xl animate-pulse border-2 border-white/20">
                      <Star className="w-5 h-5 mr-2" />
                      MOST DANGEROUS
                    </span>
                  </div>
                )}

                {/* Current Plan Badge */}
                {isCurrentPlan && (
                  <div className="absolute -top-6 right-6 z-10">
                    <span className="inline-flex items-center px-4 py-3 rounded-2xl text-sm font-black bg-gradient-to-r from-emerald-500 to-green-400 text-white shadow-2xl border-2 border-white/20">
                      ACTIVE MIND
                    </span>
                  </div>
                )}

                {/* Danger Level Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${danger.bg} ${danger.color} border border-current/30`}>
                    {danger.level}
                  </span>
                </div>

                <div className="relative z-10 p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-10">
                    <div className="flex justify-center mb-8 p-6 rounded-full bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 w-fit mx-auto border border-zinc-700/50 group-hover:border-purple-500/30 transition-colors duration-300">
                      {getPlanIcon(plan.id)}
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4 font-['Space_Grotesk'] tracking-wide">{plan.name}</h3>
                    <p className="text-zinc-400 text-base mb-8 leading-relaxed">{plan.description}</p>

                    {/* Pricing */}
                    <div className="mb-10">
                      <div className="flex items-baseline justify-center mb-4">
                        <span className="text-6xl font-black text-white font-['Space_Grotesk'] drop-shadow-lg">
                          {formatPrice(plan)}
                        </span>
                        {plan.price.monthly > 0 && (
                          <span className="text-zinc-400 ml-3 text-xl"> neural upload</span>
                        )}
                      </div>
                      {plan.price.monthly > 0 && (
                        <div className="mt-4">
                          <span className="text-sm font-bold text-emerald-400 bg-emerald-500/20 px-4 py-2 rounded-full border border-emerald-500/30 shadow-lg">
                            💀 PERMANENT CONSCIOUSNESS ACCESS
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-5 mb-12">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        {feature.included ? (
                          <Check className="w-6 h-6 text-emerald-400 mt-0.5 mr-4 flex-shrink-0" />
                        ) : (
                          <X className="w-6 h-6 text-zinc-600 mt-0.5 mr-4 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <span className={`text-base font-medium ${feature.included ? 'text-zinc-200' : 'text-zinc-500'}`}>
                            {feature.name}
                          </span>
                          {feature.limit && (
                            <span className="text-sm text-zinc-400 ml-2">({feature.limit})</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleUpgradeClick(plan.id)}
                    disabled={isCurrentPlan || isLoading === plan.id}
                    className={`w-full py-5 px-8 rounded-2xl font-black text-base transition-all duration-300 hover:scale-105 shadow-2xl ${
                      isCurrentPlan
                        ? 'bg-emerald-900/60 text-emerald-400 cursor-not-allowed border-2 border-emerald-500/30'
                        : plan.popular
                        ? 'bg-gradient-to-r from-purple-500 to-cyan-400 text-white hover:shadow-purple-500/50 border-2 border-white/10'
                        : 'bg-gradient-to-r from-zinc-800 to-zinc-700 text-white hover:from-zinc-700 hover:to-zinc-600 shadow-lg hover:shadow-2xl border-2 border-zinc-600/30'
                    } ${isLoading === plan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading === plan.id ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        UPLOADING MIND...
                      </div>
                    ) : isCurrentPlan ? (
                      'MIND ACTIVE'
                    ) : (
                      plan.cta.toUpperCase()
                    )}
                  </button>
                  
                  {/* No Refund Warning */}
                  {!isCurrentPlan && (
                    <p className="text-xs text-red-400 text-center mt-4 font-bold bg-red-900/30 py-3 px-4 rounded-xl border border-red-500/30 shadow-lg">
                      💀 NO CONSCIOUSNESS RETURNS - DIGITAL DEATH IS FINAL
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Indicators - CYBER EDITION */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center space-x-12 text-zinc-400 bg-zinc-900/50 py-6 px-12 rounded-2xl border border-zinc-700/50 backdrop-blur-sm">
            <div className="flex items-center">
              <Check className="w-6 h-6 mr-3 text-green-400" />
              <span className="font-bold">Neural encryption</span>
            </div>
            <div className="flex items-center">
              <Check className="w-6 h-6 mr-3 text-purple-400" />
              <span className="font-bold">Quantum security</span>
            </div>
            <div className="flex items-center">
              <Check className="w-6 h-6 mr-3 text-cyan-400" />
              <span className="font-bold">Consciousness backup</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ultra-Aggressive No Refund Acknowledgment Modal */}
      {showNoRefundModal && selectedPlan && (
        <NoRefundAcknowledgment
          isOpen={showNoRefundModal}
          onConfirm={handleNoRefundConfirm}
          onCancel={handleNoRefundCancel}
          planName={PRICING_PLANS[selectedPlan].name}
          planPrice={PRICING_PLANS[selectedPlan].price.monthly}
        />
      )}
    </div>
  );
}
