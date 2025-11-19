/**
 * Neural Login Component
 * Consciousness upload interface for AI Mind OS: Dangerous Minds Edition
 */

'use client';

import React, { useState } from 'react';
import { useNeuralAuth } from './auth';

interface NeuralLoginProps {
  onClose?: () => void;
  redirectTo?: string;
}

export function NeuralLogin({ onClose }: NeuralLoginProps) {
  const [mode, setMode] = useState<'upload' | 'create'>('upload');
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    neuralId: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  const { uploadConsciousness, neuralState } = useNeuralAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    try {
      if (mode === 'create') {
        if (credentials.password !== credentials.confirmPassword) {
          setError('Neural patterns do not match');
          return;
        }
        if (credentials.password.length < 8) {
          setError('Neural security requires minimum 8 characters');
          return;
        }
      }

      const success = await uploadConsciousness({
        username: credentials.username,
        password: credentials.password,
      });

      if (!success) {
        setError('Consciousness upload failed. Invalid neural signature.');
      } else if (onClose) {
        onClose();
      }
    } catch {
      setError('Neural network error. Connection terminated.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Show upload progress
  if (neuralState.consciousnessStatus === 'uploading') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-lg border border-cyan-500/30 bg-gradient-to-br from-gray-900 to-black p-8 shadow-2xl shadow-cyan-500/20">
          <div className="text-center">
            <div className="mb-6">
              <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-cyan-500/20 border-t-cyan-500" />
            </div>
            
            <h2 className="mb-4 text-xl font-bold text-white">
              Uploading Consciousness...
            </h2>
            
            <div className="mb-4">
              <div className="h-2 w-full rounded-full bg-gray-700">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${neuralState.uploadProgress || 0}%` }}
                  role="progressbar"
                  aria-label="Consciousness upload progress"
                  aria-valuenow={neuralState.uploadProgress || 0}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <p className="mt-2 text-sm text-gray-400">
                {neuralState.uploadProgress}% Complete
              </p>
            </div>
            
            <div className="space-y-1 text-xs font-mono text-cyan-400">
              <p>» Scanning neural pathways...</p>
              <p>» Mapping synaptic connections...</p>
              <p>» Integrating consciousness matrix...</p>
              <p className="text-yellow-400">» Do not disconnect during upload</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-red-500/30 bg-gradient-to-br from-gray-900 to-black p-8 shadow-2xl shadow-red-500/20">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="mb-2 text-2xl font-bold text-white">
            {mode === 'upload' ? 'Consciousness Upload' : 'Create Neural Profile'}
          </h2>
          <p className="text-sm text-red-400">
            ⚠️ WARNING: Unauthorized access will result in mind termination
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username/Neural ID */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {mode === 'upload' ? 'Neural ID' : 'Choose Neural ID'}
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
              className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              placeholder="Enter neural identifier..."
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Neural Security Pattern
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              placeholder="Enter security pattern..."
              required
            />
          </div>

          {/* Confirm Password (Create mode only) */}
          {mode === 'create' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Neural Pattern
              </label>
              <input
                type="password"
                value={credentials.confirmPassword}
                onChange={(e) => setCredentials(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                placeholder="Confirm security pattern..."
                required
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-950/20 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-3 font-semibold text-white transition-all hover:from-cyan-400 hover:to-purple-400 hover:shadow-lg hover:shadow-purple-500/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 
             mode === 'upload' ? 'Upload Consciousness' : 'Create Neural Profile'}
          </button>
        </form>

        {/* Mode Toggle */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(mode === 'upload' ? 'create' : 'upload')}
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {mode === 'upload' ? 
              'Need to create a neural profile?' : 
              'Already have consciousness uploaded?'}
          </button>
        </div>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close neural login"
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Warning Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs font-mono text-red-500">
            CAUTION: Neural upload is irreversible. Proceed with extreme caution.
          </p>
        </div>
      </div>
    </div>
  );
}

// Quick neural auth button for header
export function NeuralAuthButton() {
  const [showLogin, setShowLogin] = useState(false);
  const { neuralState, terminateConsciousness } = useNeuralAuth();

  if (neuralState.consciousnessStatus === 'active') {
    return (
      <div className="flex items-center gap-3">
        <div className="text-sm">
          <div className="font-mono text-cyan-400">
            {neuralState.neuralTier.toUpperCase()}
          </div>
          <div className="text-xs text-gray-400">
            Neural ID: {neuralState.userId?.slice(-6)}
          </div>
        </div>
        <button
          onClick={terminateConsciousness}
          className="rounded-lg border border-red-500/30 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:border-red-500 hover:text-red-300"
        >
          Terminate
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowLogin(true)}
        className="rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-2 font-semibold text-white transition-all hover:from-cyan-400 hover:to-purple-400 hover:shadow-lg hover:shadow-purple-500/25"
      >
        Upload Mind
      </button>
      
      {showLogin && (
        <NeuralLogin onClose={() => setShowLogin(false)} />
      )}
    </>
  );
}
