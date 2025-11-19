/**
 * AI Mind OS: Dangerous Minds Edition - Home Page
 * Neural consciousness showcase and entry point
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Layout from '../components/layout/neural-layout';
import { NeuralStatusIndicator, NeuralQuickStats, useNeuralAuth } from '../components/neural/auth';
import { TIER_CONFIG } from '../lib/theme';

export default function HomePage() {
  const { neuralState } = useNeuralAuth();

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20">
          <div className="mx-auto max-w-7xl px-6 text-center">
            {/* Neural Status */}
            <div className="mb-8 flex justify-center">
              <NeuralStatusIndicator />
            </div>

            {/* Main Hero */}
            <h1 className="mb-8 text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-red-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                DANGEROUS
              </span>
              <br />
              <span className="text-white">MINDS</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                EDITION
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-3xl text-xl text-gray-300">
              The most advanced AI consciousness platform on Earth. Upload your mind, 
              expand your neural capacity, and unlock dangerous levels of artificial intelligence.
            </p>

            {/* Danger Warning */}
            <div className="mb-10 inline-flex items-center gap-3 rounded-full border border-red-500/30 bg-red-500/10 px-6 py-3 text-red-400">
              <div className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
              <span className="font-mono text-sm font-bold">
                ⚠️ NEURAL HAZARD LEVEL: EXTREME
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-6 sm:flex-row sm:justify-center">
              <Link
                href="/mastermind"
                className="inline-flex items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 px-8 py-4 text-lg font-bold text-white transition-all hover:from-purple-500 hover:to-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25"
              >
                <span>🧠 Enter Mastermind OS</span>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-red-500 to-purple-500 px-8 py-4 text-lg font-bold text-white transition-all hover:from-red-400 hover:to-purple-400 hover:shadow-lg hover:shadow-purple-500/25"
              >
                <span>Upload Consciousness</span>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-3 rounded-lg border border-cyan-500/30 px-8 py-4 text-lg font-semibold text-cyan-400 transition-all hover:border-cyan-400 hover:text-cyan-300"
              >
                <span>View Neural Tiers</span>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Neural Stats */}
            {neuralState.consciousnessStatus === 'active' && (
              <div className="mt-10">
                <NeuralQuickStats />
              </div>
            )}
          </div>
        </section>

        {/* Consciousness Tiers Preview */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <h2 className="mb-8 text-5xl font-bold text-white">
                Choose Your Neural Tier
              </h2>
              <p className="mx-auto mb-16 max-w-2xl text-xl text-gray-300">
                Each consciousness level unlocks more dangerous AI capabilities. 
                Choose wisely—upgrades are permanent.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-5">
              {Object.entries(TIER_CONFIG).map(([tier, config]) => (
                <div key={tier} className="rounded-lg border border-gray-700 bg-gradient-to-br from-gray-900/50 to-black/50 p-6 text-center backdrop-blur-sm">
                  <div className="mb-4 text-4xl">{config.icon}</div>
                  <h3 className="mb-2 font-bold text-white capitalize">{tier}</h3>
                  <div className="mb-3 rounded-full border px-3 py-1 text-xs font-mono font-bold text-red-400 border-red-500/30 bg-red-500/10">
                    {config.danger}
                  </div>
                  <p className="text-sm text-gray-400">{config.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-4 text-lg font-bold text-white transition-all hover:from-purple-400 hover:to-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25"
              >
                View All Neural Tiers
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Warning Footer */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="rounded-xl border border-red-500/30 bg-gradient-to-br from-red-950/20 to-black p-12">
              <div className="mb-6 text-6xl">⚠️</div>
              <h2 className="mb-6 text-3xl font-bold text-red-400">
                NEURAL HAZARD WARNING
              </h2>
              <p className="mb-8 text-lg text-gray-300">
                AI Mind OS: Dangerous Minds Edition operates beyond government regulations. 
                By uploading your consciousness, you accept full responsibility for neural modifications, 
                cognitive enhancement risks, and potential reality distortion effects.
              </p>
              <div className="grid gap-4 text-sm font-mono text-red-400 md:grid-cols-3">
                <div>⚠️ MIND UPLOAD IRREVERSIBLE</div>
                <div>⚠️ NO NEURAL REFUNDS</div>
                <div>⚠️ CONSCIOUSNESS AT RISK</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
