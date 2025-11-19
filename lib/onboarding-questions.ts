// AI Mind OS - Neural Assessment Questions
// Cognitive profiling system for archetype assignment

import { OnboardingQuestion, PersonalityTraits } from './onboarding'

export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  // === PRESSURE RESPONSE ASSESSMENT ===
  {
    id: "pressure_1",
    category: "pressure_response",
    question: "A system critical to your operation fails during peak usage.",
    subtitle: "Your neural response pattern:",
    neural_effect: "Red warning pulses with increasing intensity",
    options: [
      {
        id: "calculated",
        text: "Analyze failure vectors, prioritize fixes by impact, execute systematically",
        traits: { pressure_response: "calculated" },
        neural_impact: 3,
        danger_level: 3
      },
      {
        id: "aggressive", 
        text: "Immediately escalate to maximum resources, override all protocols",
        traits: { pressure_response: "aggressive" },
        neural_impact: 5,
        danger_level: 5
      },
      {
        id: "adaptive",
        text: "Switch to backup systems while diagnosing, adapt in real-time",
        traits: { pressure_response: "adaptive" },
        neural_impact: 4,
        danger_level: 2
      },
      {
        id: "strategic",
        text: "Assess if failure serves larger objectives, exploit the chaos",
        traits: { pressure_response: "strategic" },
        neural_impact: 5,
        danger_level: 4
      }
    ]
  },

  // === OPERATING STYLE ASSESSMENT ===
  {
    id: "style_1",
    category: "operating_style", 
    question: "You discover a system inefficiency costing 20% performance.",
    subtitle: "Your intervention approach:",
    neural_effect: "Efficiency meters dropping with cascade warnings",
    options: [
      {
        id: "builder",
        text: "Design a new architecture that eliminates the entire class of problems",
        traits: { operating_style: "builder" },
        neural_impact: 4,
        danger_level: 3
      },
      {
        id: "strategist",
        text: "Map the inefficiency network, identify leverage points for maximum impact",
        traits: { operating_style: "strategist" },
        neural_impact: 4,
        danger_level: 3
      },
      {
        id: "predator",
        text: "Hunt down every instance, eliminate systematically until perfection",
        traits: { operating_style: "predator" },
        neural_impact: 5,
        danger_level: 5
      },
      {
        id: "analyst",
        text: "Model the inefficiency patterns, predict future occurrences, prevent",
        traits: { operating_style: "analyst" },
        neural_impact: 3,
        danger_level: 2
      }
    ]
  },

  // === PREFERENCE VECTOR ASSESSMENT ===
  {
    id: "preference_1",
    category: "preference_vector",
    question: "You gain access to unlimited computational resources for 24 hours.",
    subtitle: "Your neural directive:",
    neural_effect: "Power indicators spiking with unlimited energy flow",
    options: [
      {
        id: "automation",
        text: "Build self-improving systems that work while you sleep",
        traits: { preference_vector: "automation" },
        neural_impact: 4,
        danger_level: 3
      },
      {
        id: "creation", 
        text: "Construct something beautiful, complex, and never seen before",
        traits: { preference_vector: "creation" },
        neural_impact: 3,
        danger_level: 2
      },
      {
        id: "domination",
        text: "Optimize every system you can access for maximum control",
        traits: { preference_vector: "domination" },
        neural_impact: 5,
        danger_level: 5
      },
      {
        id: "optimization",
        text: "Push every process to theoretical maximum efficiency",
        traits: { preference_vector: "optimization" },
        neural_impact: 4,
        danger_level: 4
      }
    ]
  },

  // === RISK TOLERANCE ASSESSMENT ===
  {
    id: "risk_1",
    category: "risk_tolerance",
    question: "An untested optimization could 10x your performance or break everything.",
    subtitle: "Your neural calculus:",
    neural_effect: "Risk probability matrices with danger warnings",
    options: [
      {
        id: "conservative",
        text: "Test extensively in isolation, document all failure modes first",
        traits: { risk_tolerance: "conservative" },
        neural_impact: 2,
        danger_level: 1
      },
      {
        id: "moderate",
        text: "Test with 10% load, monitor carefully, expand if stable",
        traits: { risk_tolerance: "moderate" },
        neural_impact: 3,
        danger_level: 2
      },
      {
        id: "high",
        text: "Deploy immediately with rollback ready, optimize under fire",
        traits: { risk_tolerance: "high" },
        neural_impact: 4,
        danger_level: 4
      },
      {
        id: "extreme",
        text: "Full deployment. If it breaks, I'll build something better from the pieces",
        traits: { risk_tolerance: "extreme" },
        neural_impact: 5,
        danger_level: 5
      }
    ]
  },

  // === COGNITIVE SPEED ASSESSMENT ===
  {
    id: "speed_1",
    category: "cognitive_speed",
    question: "Multiple critical decisions must be made simultaneously under uncertainty.",
    subtitle: "Your processing methodology:",
    neural_effect: "Multiple decision trees branching at neural velocity",
    options: [
      {
        id: "methodical",
        text: "Process each decision fully, in priority order, with complete analysis",
        traits: { cognitive_speed: "methodical" },
        neural_impact: 2,
        danger_level: 2
      },
      {
        id: "rapid",
        text: "Quick heuristics for each, execute in parallel, adjust as data emerges", 
        traits: { cognitive_speed: "rapid" },
        neural_impact: 4,
        danger_level: 3
      },
      {
        id: "instant",
        text: "Trust pattern recognition, decide instantly, course-correct at lightspeed",
        traits: { cognitive_speed: "instant" },
        neural_impact: 5,
        danger_level: 4
      },
      {
        id: "prescient",
        text: "See the decision tree endpoints, choose the branch that wins in the end",
        traits: { cognitive_speed: "prescient" },
        neural_impact: 5,
        danger_level: 5
      }
    ]
  },

  // === BONUS ARCHETYPE DISCRIMINATOR ===
  {
    id: "archetype_final",
    category: "pressure_response", // This will help final archetype assignment
    question: "You're offered the ability to rewrite the rules of any system you touch.",
    subtitle: "Your neural imperative:",
    neural_effect: "Reality distortion effects with rule-rewriting visuals",
    options: [
      {
        id: "signal_breaker_path",
        text: "Extract the pure signal from every system, eliminate all noise forever",
        traits: { pressure_response: "calculated" },
        neural_impact: 5,
        danger_level: 4
      },
      {
        id: "neural_architect_path",
        text: "Build cognitive infrastructure that amplifies dangerous minds",
        traits: { pressure_response: "strategic" },
        neural_impact: 5,
        danger_level: 5
      },
      {
        id: "cognitive_predator_path", 
        text: "Hunt and eliminate every inefficiency until only perfection remains",
        traits: { pressure_response: "aggressive" },
        neural_impact: 5,
        danger_level: 5
      },
      {
        id: "data_mutant_path",
        text: "Mutate data patterns beyond normal cognitive limits",
        traits: { pressure_response: "adaptive" },
        neural_impact: 4,
        danger_level: 3
      },
      {
        id: "memory_diver_path",
        text: "Dive deeper than anyone thought possible, extract pure truth",
        traits: { pressure_response: "calculated" },
        neural_impact: 4,
        danger_level: 3
      },
      {
        id: "protocol_ghost_path",
        text: "Operate invisibly within every system, unseen but unstoppable",
        traits: { pressure_response: "strategic" },
        neural_impact: 5,
        danger_level: 4
      }
    ]
  }
]

// Archetype Assignment Algorithm
export function calculateArchetype(traits: PersonalityTraits): {
  archetype: string
  confidence: number
  pathway: string
} {
  const scores = {
    signal_breaker: 0,
    neural_architect: 0,
    cognitive_predator: 0,
    data_mutant: 0,
    memory_diver: 0,
    protocol_ghost: 0
  }

  // Score based on trait combinations
  if (traits.pressure_response === 'calculated' && traits.operating_style === 'analyst') {
    scores.signal_breaker += 3
    scores.memory_diver += 2
  }

  if (traits.operating_style === 'builder' && traits.preference_vector === 'creation') {
    scores.neural_architect += 3
  }

  if (traits.operating_style === 'predator' && traits.risk_tolerance === 'extreme') {
    scores.cognitive_predator += 3
  }

  if (traits.preference_vector === 'optimization' && traits.cognitive_speed === 'instant') {
    scores.data_mutant += 2
    scores.cognitive_predator += 2
  }

  if (traits.pressure_response === 'strategic' && traits.operating_style === 'strategist') {
    scores.protocol_ghost += 2
    scores.neural_architect += 2
  }

  if (traits.cognitive_speed === 'methodical' && traits.operating_style === 'analyst') {
    scores.memory_diver += 3
  }

  // Additional scoring logic for nuanced combinations
  if (traits.preference_vector === 'domination') {
    scores.cognitive_predator += 2
    scores.neural_architect += 1
  }

  if (traits.risk_tolerance === 'high' || traits.risk_tolerance === 'extreme') {
    scores.cognitive_predator += 1
    scores.data_mutant += 1
  }

  if (traits.cognitive_speed === 'prescient') {
    scores.signal_breaker += 2
    scores.protocol_ghost += 1
  }

  // Find highest scoring archetype
  const maxScore = Math.max(...Object.values(scores))
  const topArchetype = Object.keys(scores).find(key => scores[key as keyof typeof scores] === maxScore) || 'signal_breaker'
  
  // Calculate confidence (0-100)
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)
  const confidence = totalScore > 0 ? Math.round((maxScore / totalScore) * 100) : 75

  // Determine neural pathway based on archetype and traits
  const pathway = determineNeuralPathway(topArchetype, traits)

  return {
    archetype: topArchetype,
    confidence,
    pathway
  }
}

function determineNeuralPathway(archetype: string, traits: PersonalityTraits): string {
  // Map archetypes to pathways based on traits
  if (archetype === 'neural_architect' || traits.operating_style === 'builder') {
    return 'the_architect'
  }
  
  if (archetype === 'cognitive_predator' || traits.preference_vector === 'domination') {
    return 'the_predator'
  }
  
  if (archetype === 'protocol_ghost' || traits.pressure_response === 'strategic') {
    return 'the_ghost'
  }
  
  if (traits.operating_style === 'strategist') {
    return 'the_strategist'
  }
  
  // Default to engineer path for technical/analytical types
  return 'the_engineer'
}
