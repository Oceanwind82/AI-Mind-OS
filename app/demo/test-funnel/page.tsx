'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, PlayCircle, Users, TrendingUp, Award, ArrowRight } from 'lucide-react';

export default function FreeTierTestPage() {
  const [completedTests, setCompletedTests] = useState<Set<string>>(new Set());

  const testScenarios = [
    {
      id: 'welcome-flow',
      title: 'Welcome Onboarding',
      description: 'Test the first-time user experience and value proposition',
      priority: 'High',
      href: '/demo/free-tier?test=welcome',
    },
    {
      id: 'usage-limits',
      title: 'Usage Limit Banners',
      description: 'Test warning banners as users approach their limits',
      priority: 'High',
      href: '/demo/free-tier?test=limits',
    },
    {
      id: 'engagement-hooks',
      title: 'Engagement Hooks',
      description: 'Test contextual upgrade prompts after key actions',
      priority: 'High',
      href: '/demo/free-tier?test=engagement',
    },
    {
      id: 'paywall-modal',
      title: 'Paywall Modals',
      description: 'Test upgrade modals for locked premium features',
      priority: 'High',
      href: '/demo/free-tier?test=paywall',
    },
    {
      id: 'feature-discovery',
      title: 'Feature Discovery',
      description: 'Test how users discover and interact with available features',
      priority: 'Medium',
      href: '/demo/free-tier?test=discovery',
    },
    {
      id: 'conversion-optimization',
      title: 'Conversion Points',
      description: 'Test all upgrade touchpoints and conversion messaging',
      priority: 'High',
      href: '/demo/free-tier?test=conversion',
    },
  ];

  const conversionMetrics = [
    { label: 'Free to Starter Conversion', target: '15%', current: '12.3%', status: 'improving' },
    { label: 'Trial to Paid Conversion', target: '35%', current: '31.8%', status: 'good' },
    { label: 'Feature Discovery Rate', target: '80%', current: '76.2%', status: 'good' },
    { label: 'Onboarding Completion', target: '70%', current: '68.5%', status: 'improving' },
  ];

  const toggleTest = (testId: string) => {
    const newCompleted = new Set(completedTests);
    if (newCompleted.has(testId)) {
      newCompleted.delete(testId);
    } else {
      newCompleted.add(testId);
    }
    setCompletedTests(newCompleted);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Free Tier Funnel Testing</h1>
              <p className="text-gray-600 mt-2">Test and optimize the free tier conversion experience</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Tests Completed</div>
                <div className="text-2xl font-bold text-green-600">
                  {completedTests.size}/{testScenarios.length}
                </div>
              </div>
              <Link
                href="/demo/free-tier"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Launch Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Conversion Metrics Dashboard */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
            Conversion Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {conversionMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">{metric.current}</div>
                <div className="text-sm text-gray-600 mb-2">{metric.label}</div>
                <div className="flex items-center justify-center">
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    metric.status === 'good' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    Target: {metric.target}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Scenarios */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Test Scenarios</h2>
            <div className="space-y-4">
              {testScenarios.map((test) => (
                <div
                  key={test.id}
                  className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${
                    completedTests.has(test.id) 
                      ? 'border-green-500 bg-green-50' 
                      : test.priority === 'High' 
                      ? 'border-red-500' 
                      : 'border-yellow-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="font-semibold text-gray-900 mr-3">{test.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          test.priority === 'High' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {test.priority}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{test.description}</p>
                      <div className="flex items-center space-x-3">
                        <Link
                          href={test.href}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
                        >
                          Run Test <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                        <button
                          onClick={() => toggleTest(test.id)}
                          className={`text-sm font-medium ${
                            completedTests.has(test.id) 
                              ? 'text-green-600 hover:text-green-700' 
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {completedTests.has(test.id) ? '✓ Completed' : 'Mark Complete'}
                        </button>
                      </div>
                    </div>
                    <div className="ml-4">
                      {completedTests.has(test.id) ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testing Checklist */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Testing Checklist</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-gray-900 mb-3">User Experience</h3>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>Welcome flow is engaging and informative</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>Usage limits are clearly communicated</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>Upgrade prompts feel helpful, not pushy</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>Feature discovery is intuitive</span>
                    </label>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Conversion Optimization</h3>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>Value proposition is clear at each touchpoint</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>Social proof elements are prominent</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>Upgrade CTAs are strategically placed</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>Pricing information is easily accessible</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Technical Validation</h3>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>Usage tracking works accurately</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>Modals and banners display correctly</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>Responsive design on all devices</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>Analytics events fire properly</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Optimization Recommendations */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Award className="w-6 h-6 text-purple-600 mr-2" />
            Optimization Recommendations
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">High Impact Improvements</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-2 mt-0.5">HIGH</span>
                  Add progress indicators to onboarding flow
                </li>
                <li className="flex items-start">
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-2 mt-0.5">HIGH</span>
                  Implement smart timing for upgrade prompts
                </li>
                <li className="flex items-start">
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-2 mt-0.5">HIGH</span>
                  Add &quot;What you&apos;ll miss&quot; messaging to paywalls
                </li>
                <li className="flex items-start">
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mr-2 mt-0.5">MED</span>
                  Enhance social proof with user testimonials
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">A/B Testing Opportunities</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Welcome modal vs. inline onboarding</li>
                <li>• Usage limit banner positioning</li>
                <li>• Upgrade CTA button colors and copy</li>
                <li>• Free trial vs. freemium messaging</li>
                <li>• Paywall modal timing and triggers</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Ready to Launch the Funnel?</h3>
              <p className="text-blue-100">Test all scenarios and validate the conversion flow</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/pricing"
                className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                View Pricing Page
              </Link>
              <Link
                href="/demo/free-tier"
                className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors inline-flex items-center"
              >
                <Users className="w-5 h-5 mr-2" />
                Start Testing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
