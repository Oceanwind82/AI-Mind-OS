// AI Mind OS - Mastermind Onboarding System
// Neural initiation sequence for dangerous thinkers

export interface CognitiveProfile {
  id: string
  userId: string
  archetype: UserArchetype
  cognitiveRank: number
  neuralPathway: NeuralPathway
  xpLevel: number
  currentStreak: number
  longestStreak: number
  personalityVector: PersonalityTraits
  completedInitiation: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PersonalityTraits {
  pressure_response: 'calculated' | 'aggressive' | 'adaptive' | 'strategic'
  operating_style: 'builder' | 'strategist' | 'predator' | 'analyst'
  preference_vector: 'automation' | 'creation' | 'domination' | 'optimization'
  risk_tolerance: 'conservative' | 'moderate' | 'high' | 'extreme'
  cognitive_speed: 'methodical' | 'rapid' | 'instant' | 'prescient'
}

export type UserArchetype = 
  | 'signal_breaker'      // Information warfare specialist
  | 'neural_architect'    // System designer and builder
  | 'cognitive_predator'  // Aggressive optimizer
  | 'data_mutant'        // Pattern recognition master
  | 'memory_diver'       // Deep analysis expert
  | 'protocol_ghost'     // System infiltration specialist

export type NeuralPathway = 
  | 'the_engineer'       // Technical mastery path
  | 'the_strategist'     // Strategic thinking path
  | 'the_predator'       // Aggressive optimization path
  | 'the_architect'      // System design path
  | 'the_ghost'          // Stealth and infiltration path

export interface OnboardingQuestion {
  id: string
  category: keyof PersonalityTraits
  question: string
  subtitle?: string
  options: OnboardingOption[]
  neural_effect: string // Visual effect description
}

export interface OnboardingOption {
  id: string
  text: string
  traits: Partial<PersonalityTraits>
  neural_impact: number // 1-5 intensity
  danger_level: 1 | 2 | 3 | 4 | 5
}

export interface LearningPath {
  id: string
  archetype: UserArchetype
  pathway: NeuralPathway
  modules: LearningModule[]
  estimated_completion: number // days
  difficulty_curve: 'linear' | 'exponential' | 'adaptive'
}

export interface LearningModule {
  id: string
  title: string
  description: string
  xp_reward: number
  unlock_rank: number
  challenges: Challenge[]
  neural_drills: NeuralDrill[]
}

export interface Challenge {
  id: string
  title: string
  type: 'quiz' | 'project' | 'simulation' | 'neural_drill'
  difficulty: 1 | 2 | 3 | 4 | 5
  xp_reward: number
  completion_criteria: string
}

export interface NeuralDrill {
  id: string
  name: string
  description: string
  drill_type: 'pattern_recognition' | 'speed_thinking' | 'memory_palace' | 'logic_chains'
  target_time: number // seconds
  success_threshold: number // percentage
}

// Archetype Configuration
export const ARCHETYPE_CONFIG: Record<UserArchetype, {
  name: string
  description: string
  neural_color: string
  danger_level: 1 | 2 | 3 | 4 | 5
  primary_traits: string[]
  unlock_message: string
  signature_ability: string
  icon: string
}> = {
  signal_breaker: {
    name: 'Signal Breaker',
    description: 'Information warfare specialist',
    neural_color: '#ff0040',
    danger_level: 4,
    primary_traits: ['analytical', 'disruptive', 'pattern_focused'],
    unlock_message: 'You see through the noise to find the signal. Reality bends to your analytical precision.',
    signature_ability: 'Information Deconstruction',
    icon: '⚡'
  },
  neural_architect: {
    name: 'Neural Architect',
    description: 'System designer and builder',
    neural_color: '#8b5cf6',
    danger_level: 5,
    primary_traits: ['systematic', 'visionary', 'precision_focused'],
    unlock_message: 'You build the frameworks that others inhabit. Your constructs shape reality.',
    signature_ability: 'Reality Architecture',
    icon: '🏗️'
  },
  cognitive_predator: {
    name: 'Cognitive Predator',
    description: 'Aggressive optimizer',
    neural_color: '#ff6b00',
    danger_level: 5,
    primary_traits: ['aggressive', 'results_focused', 'speed_oriented'],
    unlock_message: 'You hunt inefficiency with lethal precision. Others run; you optimize.',
    signature_ability: 'Systematic Dominance',
    icon: '🦅'
  },
  data_mutant: {
    name: 'Data Mutant',
    description: 'Pattern recognition master',
    neural_color: '#00ff88',
    danger_level: 3,
    primary_traits: ['intuitive', 'pattern_focused', 'deep_thinking'],
    unlock_message: 'Data flows through you like blood. Patterns reveal themselves to your touch.',
    signature_ability: 'Pattern Synthesis',
    icon: '🧬'
  },
  memory_diver: {
    name: 'Memory Diver',
    description: 'Deep analysis expert',
    neural_color: '#9333ea',
    danger_level: 3,
    primary_traits: ['analytical', 'deep_thinking', 'precision_focused'],
    unlock_message: 'You dive deep where others fear to tread. Memory yields its secrets to you.',
    signature_ability: 'Deep Memory Access',
    icon: '🧠'
  },
  protocol_ghost: {
    name: 'Protocol Ghost',
    description: 'System infiltration specialist',
    neural_color: '#999999',
    danger_level: 4,
    primary_traits: ['strategic', 'adaptive', 'precision_focused'],
    unlock_message: 'You move through systems like smoke through cracks. Invisible. Inevitable.',
    signature_ability: 'System Phase Shift',
    icon: '👻'
  }
}

// Neural Pathway Configuration
export const PATHWAY_CONFIG: Record<NeuralPathway, {
  name: string
  description: string
  focus_areas: string[]
  neural_signature: string
  progression_style: string
}> = {
  the_engineer: {
    name: "The Engineer",
    description: "Technical mastery through systematic building and optimization",
    focus_areas: ["System Architecture", "Technical Implementation", "Optimization Protocols"],
    neural_signature: "Builds solutions that scale beyond human limitations",
    progression_style: "Methodical escalation with compound technical gains"
  },
  the_strategist: {
    name: "The Strategist", 
    description: "Strategic thinking through pattern analysis and systematic planning",
    focus_areas: ["Strategic Planning", "Pattern Analysis", "System Coordination"],
    neural_signature: "Sees moves before they're made, patterns before they emerge",
    progression_style: "Branching decision trees with strategic depth multipliers"
  },
  the_predator: {
    name: "The Predator",
    description: "Aggressive optimization through systematic elimination of weakness",
    focus_areas: ["Aggressive Optimization", "Weakness Elimination", "Competitive Advantage"],
    neural_signature: "Hunts inefficiency with systematic precision",
    progression_style: "Exponential power gains through competitive elimination"
  },
  the_architect: {
    name: "The Architect",
    description: "System design through cognitive construction and mind engineering",
    focus_areas: ["Cognitive Design", "System Construction", "Mind Engineering"],
    neural_signature: "Builds cognitive infrastructure for dangerous minds",
    progression_style: "Compound construction with recursive system improvements"
  },
  the_ghost: {
    name: "The Ghost",
    description: "Stealth optimization through invisible operations and system infiltration",
    focus_areas: ["Stealth Operations", "System Infiltration", "Invisible Optimization"],
    neural_signature: "Optimizes systems from within, unseen but unstoppable",
    progression_style: "Stealth multipliers with hidden compound advantages"
  }
}

// XP and Ranking System
export const XP_THRESHOLDS = [
  { rank: 1, xp: 0, title: "Neural Initiate" },
  { rank: 2, xp: 100, title: "Cognitive Apprentice" },
  { rank: 3, xp: 300, title: "Mind Hacker" },
  { rank: 4, xp: 600, title: "Neural Operator" },
  { rank: 5, xp: 1000, title: "Cognitive Predator" },
  { rank: 6, xp: 1500, title: "Mind Architect" },
  { rank: 7, xp: 2100, title: "Neural Sovereign" },
  { rank: 8, xp: 2800, title: "Consciousness Master" },
  { rank: 9, xp: 3600, title: "Cognitive Overlord" },
  { rank: 10, xp: 5000, title: "Mind God" }
]

// Streak System Configuration
export const STREAK_CONFIG = {
  colors: {
    1: "#6b7280",    // Gray - Starting
    7: "#10b981",    // Green - Building
    14: "#3b82f6",   // Blue - Strong
    21: "#8b5cf6",   // Purple - Dangerous
    30: "#f59e0b",   // Amber - Elite
    50: "#ef4444",   // Red - Legendary
    100: "#ff00ff"   // Magenta - Godlike
  },
  pulse_intensity: {
    1: "low",
    7: "medium", 
    21: "high",
    50: "extreme",
    100: "godlike"
  },
  streak_saver: {
    cost_xp: 50,
    cooldown_hours: 24,
    max_uses_per_week: 3
  }
}
