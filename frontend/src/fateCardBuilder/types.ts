/**
 * Fate Card Builder - Type Definitions
 * 
 * Types for the step-based character creator that generates
 * an isekai reincarnation background + cursed technique.
 */

// ============================================================================
// Foundation Chat Types
// ============================================================================

export interface FoundationStatements {
  action: string; // "I <verb> <object/target> (to/for <goal>)"
  problem: string; // "Because <cause>, I <constraint/need/can't/must> ..."
}

export interface FoundationValidation {
  action: {
    valid: boolean;
    error?: string;
  };
  problem: {
    valid: boolean;
    error?: string;
  };
}

// ============================================================================
// Fate Card & Token Types
// ============================================================================

export enum CategoryId {
  PRIOR_LIFE_DEMISE = "prior_life_demise",
  RELIFE_VESSEL = "relife_vessel",
  CURSED_TECHNIQUE_CORE = "cursed_technique_core",
  TECHNIQUE_MECHANISM = "technique_mechanism",
  BINDING_VOWS_COSTS = "binding_vows_costs",
  GROWTH_AWAKENING = "growth_awakening",
}

export enum Side {
  NORTH = "N",
  EAST = "E",
  SOUTH = "S",
  WEST = "W",
}

export interface FateCardQuestion {
  index: number;
  text: string;
  guidance?: string; // Optional hint for the player
}

export interface FateCardData {
  id: string;
  categoryId: CategoryId;
  name: string;
  description: string;
  deckId: string; // References the answer token deck
  questions: [FateCardQuestion, FateCardQuestion, FateCardQuestion, FateCardQuestion];
}

export interface AnswerTokenSides {
  [Side.NORTH]: string;
  [Side.EAST]: string;
  [Side.SOUTH]: string;
  [Side.WEST]: string;
}

export interface AnswerTokenTags {
  [Side.NORTH]?: string[];
  [Side.EAST]?: string[];
  [Side.SOUTH]?: string[];
  [Side.WEST]?: string[];
}

export interface AnswerToken {
  id: string;
  label: string; // Short label for the token (e.g., "Betrayal", "Fire")
  sides: AnswerTokenSides;
  tags?: AnswerTokenTags; // Optional tags for constraint resolution
}

export interface AnswerTokenDeck {
  deckId: string;
  categoryId: CategoryId;
  tokens: AnswerToken[];
}

// ============================================================================
// Build State Types
// ============================================================================

export interface CommittedAnswer {
  questionIndex: number;
  tokenId: string;
  side: Side;
  text: string;
  tags?: string[];
}

export interface CategoryProgress {
  fateCardId: string;
  answers: CommittedAnswer[];
  completed: boolean;
  rerollUsed: boolean; // Free reroll used for this category
  burnCount: number; // Number of burns (full redraws) used
}

export interface ComplicationEntry {
  timestamp: number;
  categoryId: CategoryId;
  reason: string; // "burn" | "translate_trigger" | etc.
  description: string;
}

export enum BuildStep {
  SETUP = 0,
  FOUNDATION_CHAT = 1,
  PRIOR_LIFE_DEMISE = 2,
  RELIFE_VESSEL = 3,
  CURSED_TECHNIQUE_CORE = 4,
  TECHNIQUE_MECHANISM = 5,
  BINDING_VOWS_COSTS = 6,
  GROWTH_AWAKENING = 7,
  REVIEW = 8,
}

export interface BuildState {
  // Session info
  seed: string; // Seed for reproducible randomization
  mode: "standard" | "quick" | "custom"; // Build mode
  step: BuildStep;
  
  // Foundation chat (required before any fate cards)
  foundation: FoundationStatements;
  
  // Category progress
  categories: {
    [CategoryId.PRIOR_LIFE_DEMISE]?: CategoryProgress;
    [CategoryId.RELIFE_VESSEL]?: CategoryProgress;
    [CategoryId.CURSED_TECHNIQUE_CORE]?: CategoryProgress;
    [CategoryId.TECHNIQUE_MECHANISM]?: CategoryProgress;
    [CategoryId.BINDING_VOWS_COSTS]?: CategoryProgress;
    [CategoryId.GROWTH_AWAKENING]?: CategoryProgress;
  };
  
  // Complications tracking
  complications: ComplicationEntry[];
  complicationCount: number;
  
  // Token draw history (for undo/replay)
  drawHistory: {
    categoryId: CategoryId;
    questionIndex: number;
    drawnTokenIds: [string, string, string];
    rngState: number; // RNG state at time of draw
  }[];
  
  // Timestamps
  createdAt: number;
  lastModified: number;
}

// ============================================================================
// UI State Types
// ============================================================================

export interface TokenDrawState {
  drawnTokens: [AnswerToken, AnswerToken, AnswerToken] | null;
  selectedTokenId: string | null;
  selectedSide: Side | null;
  canCommit: boolean;
}

export interface CategoryStepState {
  categoryId: CategoryId;
  currentQuestionIndex: number;
  drawState: TokenDrawState;
  rerollsRemaining: number;
  canBurn: boolean;
}

// ============================================================================
// Export Types
// ============================================================================

export interface ExportData {
  version: string; // Schema version (e.g., "1.0.0")
  buildState: BuildState;
  summary: CharacterSummary;
}

export interface CharacterSummary {
  foundation: FoundationStatements;
  background: string; // Generated background text
  technique: string; // Generated technique description
  actionToTechniqueMapping: string;
  problemToOriginMapping: string;
  complications: string[];
  categoryAnswers: {
    [key in CategoryId]?: {
      categoryName: string;
      answers: {
        question: string;
        answer: string;
      }[];
    };
  };
}

// ============================================================================
// Validation Types
// ============================================================================

export interface ConstraintViolation {
  type: "contradiction" | "incompatibility";
  categoryA: CategoryId;
  categoryB: CategoryId;
  description: string;
  suggestionText: string;
  canTranslateTrigger: boolean;
}

export interface ValidationResult {
  valid: boolean;
  violations: ConstraintViolation[];
  warnings: string[];
}
