// AI Mind OS - Dangerous Minds Edition Design System
export const theme = {
  colors: {
    // Core backgrounds
    background: '#0d0d0d',
    foreground: '#ffffff',
    muted: '#1a1a1a',
    
    // Neural tier colors
    free: '#6b7280',         // Gray - Safe neural sampling
    starter: '#10b981',      // Emerald - Basic consciousness upload  
    pro: '#6366f1',          // Indigo - Advanced neural matrix
    master: '#8b5cf6',       // Purple - Creator-level AI consciousness
    enterprise: '#f59e0b',   // Amber - Full organizational mind control
    
    // Danger states
    danger: {
      safe: '#10b981',       // Green
      caution: '#3b82f6',    // Blue
      warning: '#6366f1',    // Indigo
      danger: '#8b5cf6',     // Purple
      lethal: '#ef4444',     // Red
    },
    
    // Cyber accents
    neon: {
      cyan: '#06b6d4',
      purple: '#8b5cf6',
      pink: '#ec4899',
      green: '#10b981',
      red: '#ef4444',
      yellow: '#f59e0b',
    },
    
    // Neural states
    neural: {
      inactive: '#374151',
      processing: '#8b5cf6',
      active: '#10b981', 
      overload: '#ef4444',
    }
  },
  
  fonts: {
    heading: ['Space Grotesk', 'Inter', 'sans-serif'],
    body: ['Inter', 'sans-serif'],
    mono: ['JetBrains Mono', 'Consolas', 'monospace'],
  },
  
  radius: {
    sm: '0.375rem',    // 6px
    md: '0.5rem',      // 8px  
    lg: '0.75rem',     // 12px
    xl: '1rem',        // 16px
    '2xl': '1.5rem',   // 24px
    '3xl': '2rem',     // 32px
    full: '9999px'
  },
  
  shadow: {
    card: '0 4px 24px rgba(0, 0, 0, 0.4)',
    hover: '0 2px 12px rgba(255, 255, 255, 0.1)',
    neon: '0 0 20px rgba(139, 92, 246, 0.3)',
    neural: '0 0 30px rgba(16, 185, 129, 0.2)',
    danger: '0 0 25px rgba(239, 68, 68, 0.3)',
  },
  
  gradients: {
    neural: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
    danger: 'linear-gradient(135deg, #ef4444, #f59e0b)', 
    success: 'linear-gradient(135deg, #10b981, #06b6d4)',
    cyber: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
    matrix: 'linear-gradient(180deg, rgba(0,0,0,0.9), rgba(139,92,246,0.1))',
  },
  
  animation: {
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    glow: 'glow 3s ease-in-out infinite alternate',
    neural: 'neural-pulse 1.5s ease-in-out infinite',
    matrix: 'matrix-flow 20s linear infinite',
  },
  
  spacing: {
    neural: '1.25rem',     // 20px - Standard neural spacing
    section: '5rem',       // 80px - Major section gaps
    component: '2rem',     // 32px - Component spacing
  }
} as const;

// Tier configuration with danger levels
export const TIER_CONFIG = {
  free: {
    color: theme.colors.free,
    danger: 'SAFE',
    dangerColor: theme.colors.danger.safe,
    icon: '⚡',
    description: 'Basic neural sampling'
  },
  starter: {
    color: theme.colors.starter, 
    danger: 'CAUTION',
    dangerColor: theme.colors.danger.caution,
    icon: '⭐',
    description: 'Consciousness upload initiated'
  },
  pro: {
    color: theme.colors.pro,
    danger: 'WARNING', 
    dangerColor: theme.colors.danger.warning,
    icon: '👑',
    description: 'Advanced neural matrix access'
  },
  master: {
    color: theme.colors.master,
    danger: 'DANGER',
    dangerColor: theme.colors.danger.danger,
    icon: '✨',
    description: 'Creator-level AI consciousness'
  },
  enterprise: {
    color: theme.colors.enterprise,
    danger: 'LETHAL',
    dangerColor: theme.colors.danger.lethal,
    icon: '🏢',
    description: 'Full organizational mind control'
  }
} as const;

// Utility functions
export const getThemeColor = (tier: keyof typeof TIER_CONFIG) => TIER_CONFIG[tier].color;
export const getDangerLevel = (tier: keyof typeof TIER_CONFIG) => TIER_CONFIG[tier].danger;
export const getTierIcon = (tier: keyof typeof TIER_CONFIG) => TIER_CONFIG[tier].icon;

export default theme;
