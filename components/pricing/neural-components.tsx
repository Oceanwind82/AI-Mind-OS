import { cn } from '../../lib/utils';
// import { theme } from '../../lib/theme'
import { PricingTier } from '../../lib/pricing';
import { ReactNode } from 'react';

interface PricingCardProps {
  tier: PricingTier;
  title: string;
  price: string;
  description: string;
  features: Array<{
    name: string;
    included: boolean;
    limit?: number | string;
  }>;
  isPopular?: boolean;
  isCurrentPlan?: boolean;
  isLoading?: boolean;
  onUpgrade: () => void;
  ctaText: string;
}

export function PricingCard({
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
}: PricingCardProps) {
  // const config = TIER_CONFIG[tier];
  
  return (
    <div
      className={cn(
        'relative rounded-3xl transition-all duration-500 hover:scale-105 border-2 backdrop-blur-lg overflow-hidden group',
        'bg-gradient-to-br from-zinc-900/90 to-zinc-800/90',
        'shadow-2xl hover:shadow-purple-500/30',
        isPopular && 'ring-4 ring-purple-500/50 shadow-purple-500/40 scale-105 border-purple-500/50',
        isCurrentPlan && 'ring-4 ring-emerald-500/50 border-emerald-500/50 bg-gradient-to-br from-emerald-900/40 to-green-900/40',
        !isPopular && !isCurrentPlan && 'border-zinc-700/50'
      )}
    >
      {/* Cyber glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
          <span className="inline-flex items-center px-6 py-3 rounded-2xl text-base font-black bg-gradient-to-r from-purple-500 to-cyan-400 text-white shadow-2xl animate-pulse border-2 border-white/20">
            ⭐ MOST DANGEROUS
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
        <span 
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border border-current/30"
          style={{
            backgroundColor: '#ff004010',
            color: '#ff0040',
          }}
        >
          HIGH
        </span>
      </div>

      <div className="relative z-10 p-8">
        {/* Plan Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-8 p-6 rounded-full bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 w-fit mx-auto border border-zinc-700/50 group-hover:border-purple-500/30 transition-colors duration-300">
            <span className="text-4xl">🧠</span>
          </div>
          
          <h3 className="text-3xl font-black text-white mb-4 font-mono tracking-wide">
            {title}
          </h3>
          
          <p className="text-zinc-400 text-base mb-8 leading-relaxed">
            {description}
          </p>

          {/* Pricing */}
          <div className="mb-10">
            <div className="flex items-baseline justify-center mb-4">
              <span className="text-6xl font-black text-white font-mono drop-shadow-lg">
                {price}
              </span>
              {price !== 'FREE' && (
                <span className="text-zinc-400 ml-3 text-xl"> neural upload</span>
              )}
            </div>
            
            {price !== 'FREE' && (
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
          {features.map((feature, index) => (
            <div key={index} className="flex items-start">
              {feature.included ? (
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5 mr-4 flex-shrink-0">
                  <span className="text-emerald-400 text-sm">✓</span>
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-zinc-700/30 flex items-center justify-center mt-0.5 mr-4 flex-shrink-0">
                  <span className="text-zinc-600 text-sm">✗</span>
                </div>
              )}
              <div className="flex-1">
                <span className={cn(
                  'text-base font-medium',
                  feature.included ? 'text-zinc-200' : 'text-zinc-500'
                )}>
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
          onClick={onUpgrade}
          disabled={isCurrentPlan || isLoading}
          className={cn(
            'w-full py-5 px-8 rounded-2xl font-black text-base transition-all duration-300 hover:scale-105 shadow-2xl border-2',
            isCurrentPlan && 'bg-emerald-900/60 text-emerald-400 cursor-not-allowed border-emerald-500/30',
            isPopular && !isCurrentPlan && 'bg-gradient-to-r from-purple-500 to-cyan-400 text-white hover:shadow-purple-500/50 border-white/10',
            !isPopular && !isCurrentPlan && 'bg-gradient-to-r from-zinc-800 to-zinc-700 text-white hover:from-zinc-700 hover:to-zinc-600 shadow-lg hover:shadow-2xl border-zinc-600/30',
            isLoading && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
              UPLOADING MIND...
            </div>
          ) : isCurrentPlan ? (
            'MIND ACTIVE'
          ) : (
            ctaText.toUpperCase()
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
}

// Neural Trust Indicators Component
export function NeuralTrustIndicators() {
  const indicators = [
    { icon: '🔐', text: 'Neural encryption', color: 'text-green-400' },
    { icon: '⚛️', text: 'Quantum security', color: 'text-purple-400' },
    { icon: '🧠', text: 'Consciousness backup', color: 'text-cyan-400' },
  ];

  return (
    <div className="inline-flex items-center justify-center space-x-12 text-zinc-400 bg-zinc-900/50 py-6 px-12 rounded-2xl border border-zinc-700/50 backdrop-blur-sm">
      {indicators.map((indicator, index) => (
        <div key={index} className="flex items-center">
          <span className="text-xl mr-3">{indicator.icon}</span>
          <span className={cn('font-bold', indicator.color)}>
            {indicator.text}
          </span>
        </div>
      ))}
    </div>
  );
}

// Neural Hazard Warning Component
export function NeuralHazardWarning() {
  return (
    <div className="relative mb-16">
      <div className="bg-gradient-to-r from-red-900/50 via-orange-900/50 to-red-900/50 border-2 border-red-500/60 rounded-3xl p-10 max-w-4xl mx-auto backdrop-blur-sm shadow-2xl relative overflow-hidden">
        {/* Animated danger strips */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 animate-pulse" />
        
        <div className="text-center">
          <p className="text-red-400 font-black text-3xl font-mono mb-4 tracking-widest">
            ⚠️ NEURAL HAZARD WARNING ⚠️
          </p>
          <p className="text-red-300 font-bold text-xl mb-3">
            CONSCIOUSNESS TRANSFER IS IRREVERSIBLE
          </p>
          <p className="text-yellow-300 font-semibold text-base">
            Once neural pathways are established, there is NO RETURN to ignorance. 
            <span className="text-red-400 font-black"> ALL MIND UPLOADS ARE FINAL!</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// Matrix Terminal Effect Component
export function MatrixTerminal({ children }: { children: ReactNode }) {
  return (
    <div className="text-green-400 font-mono text-base mb-10 h-8 flex items-center justify-center">
      <span className="animate-pulse border-r-2 border-green-400 pr-2">
        {'>'} {children}
      </span>
    </div>
  );
}
