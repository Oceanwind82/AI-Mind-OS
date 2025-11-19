'use client';

import React, { useState } from 'react';
import { PricingTier } from '../../../lib/pricing';
import { FreeTierEngagement, WelcomeOnboarding } from '../../../components/free-tier-funnel';
import { PaywallModal, UsageLimitBanner } from '../../../components/paywall';
import { Book, MessageCircle, Search, Award, Play, Lock } from 'lucide-react';

export default function FreeTierDemoPage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showEngagement, setShowEngagement] = useState<'lessonComplete' | 'aiQuestionLimit' | 'ragSearchLimit' | 'certificationAttempt' | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [currentUsage, setCurrentUsage] = useState({
    lessons: 2,
    aiQuestions: 4,
    ragSearches: 2,
    certifications: 0,
  });



  const handleUpgrade = (tier: PricingTier) => {
    console.log(`Upgrading to ${tier}`);
    // In real app, redirect to payment flow
    alert(`Redirecting to ${tier} plan upgrade...`);
  };

  const handleFeatureClick = (feature: string, requiredUsage?: keyof typeof currentUsage) => {
    if (requiredUsage && currentUsage[requiredUsage] >= getLimits()[requiredUsage]) {
      const triggerMap = {
        lessons: 'lessonComplete' as const,
        aiQuestions: 'aiQuestionLimit' as const,
        ragSearches: 'ragSearchLimit' as const,
        certifications: 'certificationAttempt' as const,
      };
      setShowEngagement(triggerMap[requiredUsage]);
    } else if (feature === 'certification') {
      setShowPaywall(true);
    } else if (requiredUsage) {
      // Simulate usage increment
      setCurrentUsage(prev => ({
        ...prev,
        [requiredUsage]: prev[requiredUsage] + 1
      }));
    }
  };

  const getLimits = () => ({
    lessons: 3,
    aiQuestions: 5,
    ragSearches: 3,
    certifications: 0,
  });

  const limits = getLimits();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Mind OS - Free Tier Demo</h1>
              <p className="text-gray-600">Experience the free tier with interactive examples</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Free Tier
              </span>
              <button
                onClick={() => handleUpgrade('starter')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Usage Banners */}
        <div className="mb-8 space-y-4">
          <UsageLimitBanner
            feature="aiQuestions"
            remaining={limits.aiQuestions - currentUsage.aiQuestions}
            total={limits.aiQuestions}
            onUpgrade={() => handleUpgrade('starter')}
          />
          <UsageLimitBanner
            feature="ragSearches"
            remaining={limits.ragSearches - currentUsage.ragSearches}
            total={limits.ragSearches}
            onUpgrade={() => handleUpgrade('starter')}
          />
        </div>

        {/* Demo Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Demo Controls</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setShowWelcome(true)}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Show Welcome
            </button>
            <button
              onClick={() => setShowEngagement('lessonComplete')}
              className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors"
            >
              Lesson Complete Hook
            </button>
            <button
              onClick={() => setShowEngagement('aiQuestionLimit')}
              className="bg-amber-100 text-amber-700 px-4 py-2 rounded-lg hover:bg-amber-200 transition-colors"
            >
              AI Limit Hook
            </button>
            <button
              onClick={() => setShowPaywall(true)}
              className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors"
            >
              Show Paywall
            </button>
          </div>
        </div>

        {/* Free Tier Experience */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Available Features */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Free Learning Experience</h2>

            {/* Lessons Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Book className="w-6 h-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Lessons</h3>
                </div>
                <span className="text-sm text-gray-500">
                  {currentUsage.lessons}/{limits.lessons} used
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { title: 'Introduction to AI', completed: true },
                  { title: 'Prompt Engineering Basics', completed: true },
                  { title: 'AI Ethics & Safety', completed: false, locked: currentUsage.lessons >= limits.lessons },
                ].map((lesson, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      lesson.locked 
                        ? 'bg-gray-50 border-gray-200' 
                        : lesson.completed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-blue-50 border-blue-200 hover:bg-blue-100 cursor-pointer'
                    }`}
                    onClick={() => !lesson.locked && handleFeatureClick('lesson', 'lessons')}
                  >
                    <div className="flex items-center">
                      {lesson.locked ? (
                        <Lock className="w-5 h-5 text-gray-400 mr-3" />
                      ) : lesson.completed ? (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      ) : (
                        <Play className="w-5 h-5 text-blue-600 mr-3" />
                      )}
                      <span className={lesson.locked ? 'text-gray-500' : 'text-gray-900'}>
                        {lesson.title}
                      </span>
                    </div>
                    {lesson.locked && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpgrade('starter');
                        }}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                      >
                        Upgrade
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Assistant Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <MessageCircle className="w-6 h-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
                </div>
                <span className="text-sm text-gray-500">
                  {currentUsage.aiQuestions}/{limits.aiQuestions} questions today
                </span>
              </div>

              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Try asking a question:</p>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="What is machine learning?"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      disabled={currentUsage.aiQuestions >= limits.aiQuestions}
                    />
                    <button
                      onClick={() => handleFeatureClick('aiQuestion', 'aiQuestions')}
                      disabled={currentUsage.aiQuestions >= limits.aiQuestions}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        currentUsage.aiQuestions >= limits.aiQuestions
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      Ask AI
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RAG Search Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Search className="w-6 h-6 text-purple-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Knowledge Search</h3>
                </div>
                <span className="text-sm text-gray-500">
                  {currentUsage.ragSearches}/{limits.ragSearches} searches today
                </span>
              </div>

              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Search our knowledge base:</p>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Search for AI concepts..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      disabled={currentUsage.ragSearches >= limits.ragSearches}
                    />
                    <button
                      onClick={() => handleFeatureClick('ragSearch', 'ragSearches')}
                      disabled={currentUsage.ragSearches >= limits.ragSearches}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        currentUsage.ragSearches >= limits.ragSearches
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Locked Features Sidebar */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Unlock with Upgrade</h3>

            {/* Certifications */}
            <div className="bg-white rounded-lg shadow-sm p-6 relative">
              <div className="absolute top-4 right-4">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center mb-3">
                <Award className="w-6 h-6 text-gray-400 mr-2" />
                <h4 className="font-semibold text-gray-500">Certifications</h4>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Earn industry-recognized certificates to validate your AI expertise.
              </p>
              <button
                onClick={() => handleFeatureClick('certification')}
                className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                View Certificates
              </button>
            </div>

            {/* Premium Lessons */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="absolute top-4 right-4">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center mb-3">
                <Book className="w-6 h-6 text-gray-400 mr-2" />
                <h4 className="font-semibold text-gray-500">Premium Lessons</h4>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                15 advanced lessons covering deep learning, neural networks, and more.
              </p>
              <div className="space-y-2 mb-4">
                {[
                  'Advanced Neural Networks',
                  'Computer Vision Mastery',
                  'NLP & Language Models',
                  'AI in Production'
                ].map((lesson, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-400">
                    <Lock className="w-3 h-3 mr-2" />
                    {lesson}
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleUpgrade('starter')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Unlock Lessons
              </button>
            </div>

            {/* Upgrade CTA */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
              <h4 className="font-bold text-lg mb-2">Ready to Level Up?</h4>
              <p className="text-blue-100 text-sm mb-4">
                Join 10,000+ students who&apos;ve accelerated their AI learning journey.
              </p>
              <button
                onClick={() => handleUpgrade('starter')}
                className="w-full bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showWelcome && (
        <WelcomeOnboarding
          onComplete={() => setShowWelcome(false)}
          onUpgrade={handleUpgrade}
        />
      )}

      {showEngagement && (
        <FreeTierEngagement
          trigger="limit_reached"
          onUpgrade={handleUpgrade}
          onDismiss={() => setShowEngagement(null)}
        />
      )}

      {showPaywall && (
        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          currentTier="free"
          feature="Certifications"
          suggestedTier="starter"
          onUpgrade={handleUpgrade}
        />
      )}
    </div>
  );
}
