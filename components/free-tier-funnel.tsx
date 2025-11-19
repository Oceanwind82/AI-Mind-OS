'use client';

import React, { useState } from 'react';
import { PricingTier } from '../lib/pricing';
import { X, Star, TrendingUp, Users, Trophy, ArrowRight, Gift } from 'lucide-react';

interface FreeTierEngagementProps {
  trigger: 'limit_reached' | 'feature_blocked' | 'usage_warning';
  onUpgrade: (tier: PricingTier) => void;
  onDismiss: () => void;
}

export function FreeTierEngagement({ trigger: _trigger, onUpgrade, onDismiss }: FreeTierEngagementProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showFullModal, setShowFullModal] = useState(false);
  
  const hook = {
    title: 'Upgrade Required',
    description: 'Unlock more features with a paid plan',
    cta: 'Upgrade Now'
  };

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss();
  };

  const handleShowMore = () => {
    setShowFullModal(true);
  };

  // Toast notification for gentle engagement
  if (!showFullModal) {
    return (
      <div className="fixed top-4 right-4 z-50 max-w-sm">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 relative">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">
                {hook.title}
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                {hook.description}
              </p>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => onUpgrade('starter')}
                  className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {hook.cta}
                </button>
                <button
                  onClick={handleShowMore}
                  className="text-xs text-blue-600 px-3 py-1 hover:bg-blue-50 rounded-md transition-colors"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full modal for detailed engagement
  return <FreeTierUpgradeModal onUpgrade={onUpgrade} onClose={handleDismiss} />;
}

interface FreeTierUpgradeModalProps {
  onUpgrade: (tier: PricingTier) => void;
  onClose: () => void;
}

function FreeTierUpgradeModal({ onUpgrade, onClose }: FreeTierUpgradeModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 pb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2">
              Ready to Unlock Your AI Potential? 🚀
            </h2>
            <p className="text-blue-100">
              Join thousands of learners who&apos;ve accelerated their AI journey
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Social Proof */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-8 text-center">
              <div>
                <div className="flex items-center justify-center mb-1">
                  <Users className="w-5 h-5 text-blue-600 mr-1" />
                  <span className="font-bold text-2xl text-gray-900">10,000+</span>
                </div>
                <p className="text-sm text-gray-600">Active Learners</p>
              </div>
              <div>
                <div className="flex items-center justify-center mb-1">
                  <TrendingUp className="w-5 h-5 text-green-600 mr-1" />
                  <span className="font-bold text-2xl text-gray-900">95%</span>
                </div>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
              <div>
                <div className="flex items-center justify-center mb-1">
                  <Trophy className="w-5 h-5 text-yellow-600 mr-1" />
                  <span className="font-bold text-2xl text-gray-900">5,000+</span>
                </div>
                <p className="text-sm text-gray-600">Certificates Earned</p>
              </div>
            </div>
          </div>

          {/* Upgrade Benefits */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-900">What You&apos;ll Get:</h3>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <Star className="w-3 h-3 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">15 Premium Lessons</h4>
                    <p className="text-sm text-gray-600">Advanced AI concepts and real-world applications</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">10x More AI Questions</h4>
                    <p className="text-sm text-gray-600">50 questions per day vs 5 in free tier</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <Trophy className="w-3 h-3 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Professional Certificates</h4>
                    <p className="text-sm text-gray-600">Validate your skills with industry-recognized certs</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-900">Limited Time Offer:</h3>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center mb-2">
                  <Gift className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-semibold text-green-800">7-Day Free Trial</span>
                </div>
                <p className="text-sm text-green-700 mb-3">
                  Try everything risk-free. Cancel anytime during trial.
                </p>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">$29/month</div>
                  <div className="text-sm text-gray-500 line-through">Usually $39</div>
                  <div className="text-sm text-green-600 font-medium">Save $10/month</div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-white font-semibold text-sm">SR</span>
              </div>
              <div>
                <p className="text-sm text-gray-700 mb-2">
                  &quot;AI Mind OS transformed my career in just 3 months. The lessons are practical 
                  and the AI assistant helped me understand complex concepts quickly.&quot;
                </p>
                <div className="text-xs text-gray-600">
                  <strong>Sarah Rodriguez</strong> - Data Scientist at Google
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => onUpgrade('starter')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center text-lg"
            >
              Start Your 7-Day Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            
            <p className="text-xs text-red-600 text-center font-semibold">
              ⚠️ NO REFUNDS - ALL SALES FINAL
            </p>
            
            <button
              onClick={onClose}
              className="w-full text-gray-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              I&apos;ll Upgrade Later
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
              <span>✓ No Credit Card Required</span>
              <span>✓ Cancel Anytime</span>
              <span>✓ 30-Day Money Back</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface WelcomeOnboardingProps {
  onComplete: () => void;
  onUpgrade: (tier: PricingTier) => void;
}

export function WelcomeOnboarding({ onComplete, onUpgrade }: WelcomeOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    {
      title: "Welcome to AI Mind OS! 🎉",
      description: "You're about to embark on an incredible AI learning journey. Let's get you started!",
      action: "Begin Journey",
    },
    {
      title: "Explore Your Free Tier",
      description: "You have access to 3 foundational lessons, 5 AI questions per day, and community support.",
      action: "Start Learning",
    },
    {
      title: "Ready for More?",
      description: "When you're ready to accelerate your learning, upgrade to unlock 15 premium lessons and advanced features.",
      action: "Explore Plans",
    },
  ];

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === steps.length - 1) {
      // Last step - show pricing
      onUpgrade('starter');
    } else {
      setIsVisible(false);
      onComplete();
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        {/* Progress Indicator */}
        <div className="flex mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-2 rounded-full mx-1 ${
                index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600">
            {currentStepData.description}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleNext}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {currentStepData.action}
          </button>
          
          <button
            onClick={handleSkip}
            className="w-full text-gray-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  );
}

const FreeTierFunnel = {
  FreeTierEngagement,
  WelcomeOnboarding,
};

export default FreeTierFunnel;
