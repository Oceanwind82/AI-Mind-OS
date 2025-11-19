/**
 * Neural Authentication System
 * Handles consciousness verification and neural state management
 * Part of the AI Mind OS: Dangerous Minds Edition
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { PricingTier } from '../../lib/pricing';

// Neural state interface
interface NeuralState {
  userId: string | null;
  neuralTier: PricingTier;
  consciousnessStatus: 'active' | 'dormant' | 'terminated' | 'uploading';
  uploadProgress?: number;
  synapticActivity: {
    thoughtsRemaining: number;
    synapsesUsed: number;
    certificatesEarned: number;
    neuralSearches: number;
  };
  mindExpiry: Date | null;
  isLoading: boolean;
}

// Neural authentication context
interface NeuralAuthContextType {
  neuralState: NeuralState;
  uploadConsciousness: (credentials: { username: string; password: string }) => Promise<boolean>;
  terminateConsciousness: () => Promise<void>;
  refreshNeuralState: () => Promise<void>;
  upgradeNeuralTier: (newTier: PricingTier) => Promise<boolean>;
}

const NeuralAuthContext = createContext<NeuralAuthContextType | undefined>(undefined);

// Initial neural state
const initialNeuralState: NeuralState = {
  userId: null,
  neuralTier: 'free',
  consciousnessStatus: 'dormant',
  synapticActivity: {
    thoughtsRemaining: 5,
    synapsesUsed: 0,
    certificatesEarned: 0,
    neuralSearches: 0,
  },
  mindExpiry: null,
  isLoading: true,
};

// Neural authentication provider
export function NeuralAuthProvider({ children }: { children: React.ReactNode }) {
  const [neuralState, setNeuralState] = useState<NeuralState>(initialNeuralState);

  // Simulate consciousness upload
  const uploadConsciousness = async (credentials: { username: string; password: string }): Promise<boolean> => {
    setNeuralState(prev => ({ 
      ...prev, 
      consciousnessStatus: 'uploading',
      uploadProgress: 0 
    }));

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setNeuralState(prev => ({ 
        ...prev, 
        uploadProgress: progress 
      }));
    }

    // Mock authentication - replace with real auth
    const success = Boolean(credentials.username && credentials.password);
    
    if (success) {
      setNeuralState(prev => ({
        ...prev,
        userId: `neural_${Date.now()}`,
        consciousnessStatus: 'active',
        uploadProgress: undefined,
        mindExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        synapticActivity: {
          thoughtsRemaining: 5,
          synapsesUsed: 0,
          certificatesEarned: 0,
          neuralSearches: 0,
        }
      }));
    } else {
      setNeuralState(prev => ({
        ...prev,
        consciousnessStatus: 'dormant',
        uploadProgress: undefined,
      }));
    }

    return success;
  };

  // Terminate consciousness (logout)
  const terminateConsciousness = async (): Promise<void> => {
    setNeuralState(prev => ({
      ...prev,
      consciousnessStatus: 'terminated',
    }));

    // Fade out effect
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setNeuralState(initialNeuralState);
  };

  // Refresh neural state from server
  const refreshNeuralState = async (): Promise<void> => {
    if (!neuralState.userId) return;

    try {
      // Mock API call - replace with real endpoint
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update neural state with fresh data
      setNeuralState(prev => ({
        ...prev,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to refresh neural state:', error);
      setNeuralState(prev => ({
        ...prev,
        isLoading: false,
        consciousnessStatus: 'dormant',
      }));
    }
  };

  // Upgrade neural tier
  const upgradeNeuralTier = async (newTier: PricingTier): Promise<boolean> => {
    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setNeuralState(prev => ({
        ...prev,
        neuralTier: newTier,
        synapticActivity: {
          ...prev.synapticActivity,
          thoughtsRemaining: newTier === 'free' ? 5 : 
                           newTier === 'starter' ? 50 :
                           newTier === 'pro' ? 200 :
                           newTier === 'master' ? -1 : -1, // -1 = unlimited
        }
      }));
      
      return true;
    } catch (error) {
      console.error('Neural upgrade failed:', error);
      return false;
    }
  };

  // Initialize neural state on mount
  useEffect(() => {
    const initializeNeuralState = async () => {
      try {
        // Check for existing neural session
        const savedState = localStorage.getItem('neural_state');
        if (savedState) {
          const parsed = JSON.parse(savedState);
          setNeuralState(prev => ({
            ...prev,
            ...parsed,
            isLoading: false,
          }));
        } else {
          setNeuralState(prev => ({
            ...prev,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error('Failed to initialize neural state:', error);
        setNeuralState(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    initializeNeuralState();
  }, []);

  // Save neural state to localStorage
  useEffect(() => {
    if (neuralState.userId && !neuralState.isLoading) {
      localStorage.setItem('neural_state', JSON.stringify({
        userId: neuralState.userId,
        neuralTier: neuralState.neuralTier,
        consciousnessStatus: neuralState.consciousnessStatus,
        synapticActivity: neuralState.synapticActivity,
        mindExpiry: neuralState.mindExpiry,
      }));
    }
  }, [neuralState]);

  const contextValue: NeuralAuthContextType = {
    neuralState,
    uploadConsciousness,
    terminateConsciousness,
    refreshNeuralState,
    upgradeNeuralTier,
  };

  return (
    <NeuralAuthContext.Provider value={contextValue}>
      {children}
    </NeuralAuthContext.Provider>
  );
}

// Hook to use neural authentication
export function useNeuralAuth(): NeuralAuthContextType {
  const context = useContext(NeuralAuthContext);
  if (context === undefined) {
    throw new Error('useNeuralAuth must be used within a NeuralAuthProvider');
  }
  return context;
}

// Neural status indicator component
export function NeuralStatusIndicator() {
  const { neuralState } = useNeuralAuth();

  const getStatusColor = () => {
    switch (neuralState.consciousnessStatus) {
      case 'active': return 'text-green-400';
      case 'uploading': return 'text-cyan-400';
      case 'terminated': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusMessage = () => {
    switch (neuralState.consciousnessStatus) {
      case 'active': return 'Consciousness Active';
      case 'uploading': return `Uploading... ${neuralState.uploadProgress}%`;
      case 'terminated': return 'Mind Terminated';
      default: return 'Neural Network Dormant';
    }
  };

  return (
    <div className="flex items-center gap-2 font-mono text-sm">
      <div className={`h-2 w-2 rounded-full ${
        neuralState.consciousnessStatus === 'active' ? 'animate-pulse bg-green-400' :
        neuralState.consciousnessStatus === 'uploading' ? 'animate-pulse bg-cyan-400' :
        neuralState.consciousnessStatus === 'terminated' ? 'bg-red-400' :
        'bg-gray-400'
      }`} />
      <span className={getStatusColor()}>
        {getStatusMessage()}
      </span>
    </div>
  );
}

// Quick neural stats component
export function NeuralQuickStats() {
  const { neuralState } = useNeuralAuth();

  if (neuralState.consciousnessStatus !== 'active') {
    return null;
  }

  return (
    <div className="flex gap-4 text-xs font-mono text-gray-400">
      <span>
        Thoughts: {neuralState.synapticActivity.thoughtsRemaining === -1 ? '∞' : neuralState.synapticActivity.thoughtsRemaining}
      </span>
      <span>
        Tier: <span className="text-cyan-400">{neuralState.neuralTier.toUpperCase()}</span>
      </span>
      <span>
        Certificates: {neuralState.synapticActivity.certificatesEarned}
      </span>
    </div>
  );
}
