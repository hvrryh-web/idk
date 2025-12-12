/**
 * Fate Card Builder - Zustand Store
 * 
 * Central state management for the Fate Card Builder feature.
 */

import { create } from "zustand";
import {
  BuildState,
  BuildStep,
  CategoryId,
  CommittedAnswer,
  AnswerToken,
  Side,
  ExportData,
  CharacterSummary
} from "../types";
import { SeededRNG, generateSeed } from "../utils/seededRng";
import { getDeckByCategoryId } from "../data/tokenDecks";
import { getFateCardByCategoryId } from "../data/fateCards";
import {
  canProceedFromFoundation,
  isCategoryComplete
} from "../utils/validation";

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = "fateCardBuilder_state";

// ============================================================================
// Initial State
// ============================================================================

function getInitialBuildState(): BuildState {
  return {
    seed: generateSeed(),
    mode: "standard",
    step: BuildStep.SETUP,
    foundation: {
      action: "",
      problem: ""
    },
    categories: {},
    complications: [],
    complicationCount: 0,
    drawHistory: [],
    createdAt: Date.now(),
    lastModified: Date.now()
  };
}

// ============================================================================
// Store Interface
// ============================================================================

interface FateCardBuilderState {
  // Core state
  buildState: BuildState;
  rng: SeededRNG;
  
  // Current draw state (for active category)
  currentCategoryId: CategoryId | null;
  currentQuestionIndex: number;
  drawnTokens: [AnswerToken, AnswerToken, AnswerToken] | null;
  selectedTokenId: string | null;
  selectedSide: Side | null;
  
  // UI state
  isExporting: boolean;
  
  // Actions - Setup
  setSeed: (seed: string) => void;
  setMode: (mode: "standard" | "quick" | "custom") => void;
  goToStep: (step: BuildStep) => void;
  
  // Actions - Foundation
  setActionStatement: (action: string) => void;
  setProblemStatement: (problem: string) => void;
  validateFoundation: () => boolean;
  
  // Actions - Token Drawing
  setCurrentCategory: (categoryId: CategoryId) => void;
  setCurrentQuestion: (questionIndex: number) => void;
  drawTokens: () => void;
  selectToken: (tokenId: string) => void;
  selectSide: (side: Side) => void;
  commitAnswer: () => void;
  undoAnswer: (questionIndex: number) => void;
  
  // Actions - Reroll/Burn
  rerollOneToken: (tokenId: string) => void;
  burnAllTokens: () => void;
  canReroll: () => boolean;
  canBurn: () => boolean;
  
  // Actions - Complications
  addComplication: (categoryId: CategoryId, reason: string, description: string) => void;
  translateTrigger: () => void;
  
  // Actions - Navigation
  nextStep: () => void;
  prevStep: () => void;
  canProceedToNextStep: () => boolean;
  
  // Actions - Persistence
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => boolean;
  clearLocalStorage: () => void;
  
  // Actions - Export
  exportToJSON: () => string;
  exportToSummary: () => string;
  importFromJSON: (json: string) => boolean;
  
  // Actions - Reset
  resetBuild: () => void;
}

// ============================================================================
// Store Implementation
// ============================================================================

export const useFateCardBuilderStore = create<FateCardBuilderState>(
  (set, get) => ({
    // Initial state
    buildState: getInitialBuildState(),
    rng: new SeededRNG(generateSeed()),
    currentCategoryId: null,
    currentQuestionIndex: 0,
    drawnTokens: null,
    selectedTokenId: null,
    selectedSide: null,
    isExporting: false,
    
    // Setup actions
    setSeed: (seed: string) => {
      set(state => ({
        buildState: { ...state.buildState, seed },
        rng: new SeededRNG(seed)
      }));
    },
    
    setMode: (mode) => {
      set(state => ({
        buildState: { ...state.buildState, mode }
      }));
    },
    
    goToStep: (step: BuildStep) => {
      set(state => ({
        buildState: { ...state.buildState, step }
      }));
    },
    
    // Foundation actions
    setActionStatement: (action: string) => {
      set(state => ({
        buildState: {
          ...state.buildState,
          foundation: { ...state.buildState.foundation, action: action.trim() },
          lastModified: Date.now()
        }
      }));
    },
    
    setProblemStatement: (problem: string) => {
      set(state => ({
        buildState: {
          ...state.buildState,
          foundation: { ...state.buildState.foundation, problem: problem.trim() },
          lastModified: Date.now()
        }
      }));
    },
    
    validateFoundation: () => {
      const { buildState } = get();
      return canProceedFromFoundation(buildState.foundation);
    },
    
    // Token drawing actions
    setCurrentCategory: (categoryId: CategoryId) => {
      set({
        currentCategoryId: categoryId,
        currentQuestionIndex: 0,
        drawnTokens: null,
        selectedTokenId: null,
        selectedSide: null
      });
      
      // Initialize category progress if not exists
      const { buildState } = get();
      if (!buildState.categories[categoryId]) {
        const fateCard = getFateCardByCategoryId(categoryId);
        if (fateCard) {
          set(state => ({
            buildState: {
              ...state.buildState,
              categories: {
                ...state.buildState.categories,
                [categoryId]: {
                  fateCardId: fateCard.id,
                  answers: [],
                  completed: false,
                  rerollUsed: false,
                  burnCount: 0
                }
              }
            }
          }));
        }
      }
    },
    
    setCurrentQuestion: (questionIndex: number) => {
      set({
        currentQuestionIndex: questionIndex,
        drawnTokens: null,
        selectedTokenId: null,
        selectedSide: null
      });
    },
    
    drawTokens: () => {
      const { currentCategoryId, rng, buildState } = get();
      if (!currentCategoryId) return;
      
      const deck = getDeckByCategoryId(currentCategoryId);
      if (!deck) return;
      
      // Draw 3 tokens
      const drawn = rng.pickN(deck.tokens, 3) as [AnswerToken, AnswerToken, AnswerToken];
      
      // Record draw in history
      const rngState = rng.getState();
      set(state => ({
        drawnTokens: drawn,
        buildState: {
          ...state.buildState,
          drawHistory: [
            ...state.buildState.drawHistory,
            {
              categoryId: currentCategoryId,
              questionIndex: state.currentQuestionIndex,
              drawnTokenIds: [drawn[0].id, drawn[1].id, drawn[2].id] as [string, string, string],
              rngState
            }
          ]
        }
      }));
    },
    
    selectToken: (tokenId: string) => {
      set({ selectedTokenId: tokenId, selectedSide: null });
    },
    
    selectSide: (side: Side) => {
      set({ selectedSide: side });
    },
    
    commitAnswer: () => {
      const {
        currentCategoryId,
        currentQuestionIndex,
        selectedTokenId,
        selectedSide,
        drawnTokens
      } = get();
      
      if (!currentCategoryId || !selectedTokenId || !selectedSide || !drawnTokens) {
        return;
      }
      
      const selectedToken = drawnTokens.find(t => t.id === selectedTokenId);
      if (!selectedToken) return;
      
      const answer: CommittedAnswer = {
        questionIndex: currentQuestionIndex,
        tokenId: selectedTokenId,
        side: selectedSide,
        text: selectedToken.sides[selectedSide],
        tags: selectedToken.tags?.[selectedSide]
      };
      
      set(state => {
        const categoryProgress = state.buildState.categories[currentCategoryId];
        if (!categoryProgress) return state;
        
        const updatedAnswers = [...categoryProgress.answers.filter(a => a.questionIndex !== currentQuestionIndex), answer];
        const completed = updatedAnswers.length === 4;
        
        return {
          buildState: {
            ...state.buildState,
            categories: {
              ...state.buildState.categories,
              [currentCategoryId]: {
                ...categoryProgress,
                answers: updatedAnswers,
                completed
              }
            },
            lastModified: Date.now()
          },
          drawnTokens: null,
          selectedTokenId: null,
          selectedSide: null
        };
      });
    },
    
    undoAnswer: (questionIndex: number) => {
      const { currentCategoryId } = get();
      if (!currentCategoryId) return;
      
      set(state => {
        const categoryProgress = state.buildState.categories[currentCategoryId];
        if (!categoryProgress) return state;
        
        const updatedAnswers = categoryProgress.answers.filter(a => a.questionIndex !== questionIndex);
        
        return {
          buildState: {
            ...state.buildState,
            categories: {
              ...state.buildState.categories,
              [currentCategoryId]: {
                ...categoryProgress,
                answers: updatedAnswers,
                completed: false
              }
            },
            lastModified: Date.now()
          }
        };
      });
    },
    
    // Reroll/Burn actions
    rerollOneToken: (tokenId: string) => {
      const { currentCategoryId, drawnTokens, rng } = get();
      if (!currentCategoryId || !drawnTokens) return;
      
      const deck = getDeckByCategoryId(currentCategoryId);
      if (!deck) return;
      
      // Find unused tokens
      const usedIds = drawnTokens.map(t => t.id);
      const availableTokens = deck.tokens.filter(t => !usedIds.includes(t.id));
      
      if (availableTokens.length === 0) return;
      
      // Pick a new token
      const newToken = rng.pickN(availableTokens, 1)[0];
      
      // Replace the token
      const newDrawn = drawnTokens.map(t => t.id === tokenId ? newToken : t) as [AnswerToken, AnswerToken, AnswerToken];
      
      set(state => ({
        drawnTokens: newDrawn,
        buildState: {
          ...state.buildState,
          categories: {
            ...state.buildState.categories,
            [currentCategoryId]: {
              ...state.buildState.categories[currentCategoryId]!,
              rerollUsed: true
            }
          }
        }
      }));
    },
    
    burnAllTokens: () => {
      const { currentCategoryId, addComplication } = get();
      if (!currentCategoryId) return;
      
      // Add complication
      addComplication(
        currentCategoryId,
        "burn",
        "Used Burn to redraw all tokens"
      );
      
      // Redraw tokens
      get().drawTokens();
      
      // Increment burn count
      set(state => ({
        buildState: {
          ...state.buildState,
          categories: {
            ...state.buildState.categories,
            [currentCategoryId]: {
              ...state.buildState.categories[currentCategoryId]!,
              burnCount: (state.buildState.categories[currentCategoryId]?.burnCount || 0) + 1
            }
          }
        }
      }));
    },
    
    canReroll: () => {
      const { currentCategoryId, buildState } = get();
      if (!currentCategoryId) return false;
      
      const categoryProgress = buildState.categories[currentCategoryId];
      return categoryProgress ? !categoryProgress.rerollUsed : true;
    },
    
    canBurn: () => {
      return true; // Burn is always available (but adds complication)
    },
    
    // Complication actions
    addComplication: (categoryId: CategoryId, reason: string, description: string) => {
      set(state => ({
        buildState: {
          ...state.buildState,
          complications: [
            ...state.buildState.complications,
            {
              timestamp: Date.now(),
              categoryId,
              reason,
              description
            }
          ],
          complicationCount: state.buildState.complicationCount + 1,
          lastModified: Date.now()
        }
      }));
    },
    
    translateTrigger: () => {
      const { currentCategoryId, addComplication } = get();
      if (!currentCategoryId) return;
      
      addComplication(
        currentCategoryId,
        "translate_trigger",
        "Translated technique trigger type to resolve constraint"
      );
    },
    
    // Navigation actions
    nextStep: () => {
      const { buildState, canProceedToNextStep } = get();
      if (!canProceedToNextStep()) return;
      
      const nextStep = buildState.step + 1;
      if (nextStep <= BuildStep.REVIEW) {
        set(state => ({
          buildState: { ...state.buildState, step: nextStep as BuildStep }
        }));
      }
    },
    
    prevStep: () => {
      const { buildState } = get();
      const prevStep = buildState.step - 1;
      if (prevStep >= BuildStep.SETUP) {
        set(state => ({
          buildState: { ...state.buildState, step: prevStep as BuildStep }
        }));
      }
    },
    
    canProceedToNextStep: () => {
      const { buildState } = get();
      
      // Setup step: just need a seed
      if (buildState.step === BuildStep.SETUP) {
        return !!buildState.seed;
      }
      
      // Foundation chat: must have valid statements
      if (buildState.step === BuildStep.FOUNDATION_CHAT) {
        return canProceedFromFoundation(buildState.foundation);
      }
      
      // Category steps: must complete all 4 questions
      const categorySteps = [
        BuildStep.PRIOR_LIFE_DEMISE,
        BuildStep.RELIFE_VESSEL,
        BuildStep.CURSED_TECHNIQUE_CORE,
        BuildStep.TECHNIQUE_MECHANISM,
        BuildStep.BINDING_VOWS_COSTS,
        BuildStep.GROWTH_AWAKENING
      ];
      
      if (categorySteps.includes(buildState.step)) {
        const categoryMap: Record<number, CategoryId> = {
          [BuildStep.PRIOR_LIFE_DEMISE]: CategoryId.PRIOR_LIFE_DEMISE,
          [BuildStep.RELIFE_VESSEL]: CategoryId.RELIFE_VESSEL,
          [BuildStep.CURSED_TECHNIQUE_CORE]: CategoryId.CURSED_TECHNIQUE_CORE,
          [BuildStep.TECHNIQUE_MECHANISM]: CategoryId.TECHNIQUE_MECHANISM,
          [BuildStep.BINDING_VOWS_COSTS]: CategoryId.BINDING_VOWS_COSTS,
          [BuildStep.GROWTH_AWAKENING]: CategoryId.GROWTH_AWAKENING
        };
        
        const categoryId = categoryMap[buildState.step];
        const progress = buildState.categories[categoryId];
        return isCategoryComplete(progress);
      }
      
      // Review step: can always proceed (to finish)
      return true;
    },
    
    // Persistence actions
    saveToLocalStorage: () => {
      const { buildState } = get();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(buildState));
      } catch (error) {
        console.error("Failed to save to localStorage:", error);
      }
    },
    
    loadFromLocalStorage: () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const buildState = JSON.parse(saved) as BuildState;
          set({
            buildState,
            rng: new SeededRNG(buildState.seed)
          });
          return true;
        }
      } catch (error) {
        console.error("Failed to load from localStorage:", error);
      }
      return false;
    },
    
    clearLocalStorage: () => {
      localStorage.removeItem(STORAGE_KEY);
    },
    
    // Export actions
    exportToJSON: () => {
      const { buildState } = get();
      const exportData: ExportData = {
        version: "1.0.0",
        buildState,
        summary: generateSummary(buildState)
      };
      return JSON.stringify(exportData, null, 2);
    },
    
    exportToSummary: () => {
      const { buildState } = get();
      return generateSummaryText(buildState);
    },
    
    importFromJSON: (json: string) => {
      try {
        const data = JSON.parse(json) as ExportData;
        set({
          buildState: data.buildState,
          rng: new SeededRNG(data.buildState.seed)
        });
        return true;
      } catch (error) {
        console.error("Failed to import from JSON:", error);
        return false;
      }
    },
    
    // Reset action
    resetBuild: () => {
      const initial = getInitialBuildState();
      set({
        buildState: initial,
        rng: new SeededRNG(initial.seed),
        currentCategoryId: null,
        currentQuestionIndex: 0,
        drawnTokens: null,
        selectedTokenId: null,
        selectedSide: null
      });
    }
  })
);

// ============================================================================
// Helper Functions
// ============================================================================

function generateSummary(buildState: BuildState): CharacterSummary {
  // This is a placeholder - will be enhanced with better generation logic
  return {
    foundation: buildState.foundation,
    background: "Generated background based on fate card choices...",
    technique: "Generated technique description...",
    actionToTechniqueMapping: `The technique "${buildState.foundation.action}" manifests as a magical extension...`,
    problemToOriginMapping: `The power arose because "${buildState.foundation.problem}"...`,
    complications: buildState.complications.map(c => c.description),
    categoryAnswers: {}
  };
}

function generateSummaryText(buildState: BuildState): string {
  let text = "=== CHARACTER FATE CARD BUILD ===\n\n";
  text += `Seed: ${buildState.seed}\n`;
  text += `Complications: ${buildState.complicationCount}\n\n`;
  
  text += "--- FOUNDATION ---\n";
  text += `Action: ${buildState.foundation.action}\n`;
  text += `Problem: ${buildState.foundation.problem}\n\n`;
  
  // Add category answers
  Object.entries(buildState.categories).forEach(([categoryId, progress]) => {
    const fateCard = getFateCardByCategoryId(categoryId as CategoryId);
    if (fateCard && progress) {
      text += `--- ${fateCard.name.toUpperCase()} ---\n`;
      progress.answers.forEach(answer => {
        const question = fateCard.questions[answer.questionIndex];
        text += `Q${answer.questionIndex + 1}: ${question.text}\n`;
        text += `A: ${answer.text}\n\n`;
      });
    }
  });
  
  if (buildState.complications.length > 0) {
    text += "--- COMPLICATIONS ---\n";
    buildState.complications.forEach((c, i) => {
      text += `${i + 1}. ${c.description}\n`;
    });
  }
  
  return text;
}
