/**
 * Character Creator Store
 * 
 * Zustand store for managing character customization state
 */

import { create } from "zustand";
import {
  AssetManifest,
  CharacterAppearance,
  BaseModel,
  CategoryType,
  SwatchType,
  HistoryState,
} from "../data/types";
import { getDefaultAppearance, STORAGE_KEY, MAX_HISTORY_SIZE } from "../data/defaults";
import { loadManifest } from "../data/manifest";

interface CharacterCreatorState {
  // Manifest
  manifest: AssetManifest | null;
  manifestLoading: boolean;
  manifestError: string | null;

  // Current appearance
  appearance: CharacterAppearance;

  // History for undo/redo
  history: HistoryState[];
  historyIndex: number;

  // UI state
  selectedCategory: CategoryType;
  isExporting: boolean;

  // Actions
  loadManifest: () => Promise<void>;
  setBaseModel: (baseModel: BaseModel) => void;
  selectOption: (category: CategoryType, optionId: string) => void;
  selectSwatch: (swatchType: SwatchType, swatchId: string) => void;
  setSelectedCategory: (category: CategoryType) => void;
  randomize: (seed?: number) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  exportAppearance: () => string;
  importAppearance: (json: string) => void;
}

/**
 * Seeded random number generator
 */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

/**
 * Create a new history state
 */
function createHistoryState(appearance: CharacterAppearance): HistoryState {
  return {
    appearance: JSON.parse(JSON.stringify(appearance)),
    timestamp: Date.now(),
  };
}

export const useCharacterCreatorStore = create<CharacterCreatorState>(
  (set, get) => ({
    // Initial state
    manifest: null,
    manifestLoading: false,
    manifestError: null,
    appearance: getDefaultAppearance(BaseModel.FEMALE),
    history: [],
    historyIndex: -1,
    selectedCategory: CategoryType.HAIR,
    isExporting: false,

    // Load manifest
    loadManifest: async () => {
      set({ manifestLoading: true, manifestError: null });
      try {
        const manifest = await loadManifest();
        set({ manifest, manifestLoading: false });
      } catch (error) {
        set({
          manifestError: error instanceof Error ? error.message : "Failed to load manifest",
          manifestLoading: false,
        });
      }
    },

    // Set base model
    setBaseModel: (baseModel: BaseModel) => {
      const state = get();
      const newAppearance = {
        ...state.appearance,
        baseModel,
      };
      
      // Add to history
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(createHistoryState(newAppearance));
      
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift();
      }

      set({
        appearance: newAppearance,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
    },

    // Select an option in a category
    selectOption: (category: CategoryType, optionId: string) => {
      const state = get();
      const newAppearance = {
        ...state.appearance,
        selections: {
          ...state.appearance.selections,
          [category]: optionId,
        },
      };

      // Add to history
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(createHistoryState(newAppearance));
      
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift();
      }

      set({
        appearance: newAppearance,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
    },

    // Select a swatch
    selectSwatch: (swatchType: SwatchType, swatchId: string) => {
      const state = get();
      const newAppearance = {
        ...state.appearance,
        swatches: {
          ...state.appearance.swatches,
          [swatchType]: swatchId,
        },
      };

      // Add to history
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(createHistoryState(newAppearance));
      
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift();
      }

      set({
        appearance: newAppearance,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
    },

    // Set selected category
    setSelectedCategory: (category: CategoryType) => {
      set({ selectedCategory: category });
    },

    // Randomize appearance
    randomize: (seed?: number) => {
      const state = get();
      const { manifest, appearance } = state;
      
      if (!manifest) return;

      const rng = seed !== undefined ? seededRandom(seed) : Math.random;
      const newAppearance = { ...appearance };

      // Randomize each category
      manifest.categories.forEach((category) => {
        if (category.options.length > 0) {
          const randomIndex = Math.floor(rng() * category.options.length);
          newAppearance.selections[category.id] = category.options[randomIndex].id;
        }
      });

      // Randomize swatches
      manifest.swatchPalettes.forEach((palette) => {
        if (palette.swatches.length > 0) {
          const randomIndex = Math.floor(rng() * palette.swatches.length);
          newAppearance.swatches[palette.type] = palette.swatches[randomIndex].id;
        }
      });

      if (seed !== undefined) {
        newAppearance.seed = seed;
      }

      // Add to history
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(createHistoryState(newAppearance));
      
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift();
      }

      set({
        appearance: newAppearance,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
    },

    // Undo
    undo: () => {
      const state = get();
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        set({
          appearance: JSON.parse(JSON.stringify(state.history[newIndex].appearance)),
          historyIndex: newIndex,
        });
      }
    },

    // Redo
    redo: () => {
      const state = get();
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        set({
          appearance: JSON.parse(JSON.stringify(state.history[newIndex].appearance)),
          historyIndex: newIndex,
        });
      }
    },

    // Reset to default
    reset: () => {
      const state = get();
      const defaultAppearance = getDefaultAppearance(state.appearance.baseModel);
      
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(createHistoryState(defaultAppearance));
      
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift();
      }

      set({
        appearance: defaultAppearance,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
    },

    // Save to localStorage
    saveToLocalStorage: () => {
      const state = get();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.appearance));
      } catch (error) {
        console.error("Failed to save to localStorage:", error);
      }
    },

    // Load from localStorage
    loadFromLocalStorage: () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const appearance = JSON.parse(stored);
          set({
            appearance,
            history: [createHistoryState(appearance)],
            historyIndex: 0,
          });
        }
      } catch (error) {
        console.error("Failed to load from localStorage:", error);
      }
    },

    // Export appearance as JSON
    exportAppearance: () => {
      const state = get();
      return JSON.stringify(state.appearance, null, 2);
    },

    // Import appearance from JSON
    importAppearance: (json: string) => {
      try {
        const appearance = JSON.parse(json);
        const state = get();
        
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(createHistoryState(appearance));
        
        if (newHistory.length > MAX_HISTORY_SIZE) {
          newHistory.shift();
        }

        set({
          appearance,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      } catch (error) {
        console.error("Failed to import appearance:", error);
        throw error;
      }
    },
  })
);
