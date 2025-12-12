/**
 * Default Character Appearance and Configuration
 * 
 * Provides sensible defaults for character customization
 */

import {
  CharacterAppearance,
  BaseModel,
  CategoryType,
  SwatchType,
  SCHEMA_VERSION,
} from "./types";

/**
 * Default character appearance with male base
 */
export const DEFAULT_MALE_APPEARANCE: CharacterAppearance = {
  version: SCHEMA_VERSION,
  baseModel: BaseModel.MALE,
  selections: {
    [CategoryType.HAIR]: "hair-001",
    [CategoryType.EYES]: "eyes-001",
    [CategoryType.BROWS]: "brows-001",
    [CategoryType.MOUTH]: "mouth-001",
    [CategoryType.OUTFIT]: "outfit-001",
  },
  swatches: {
    [SwatchType.SKIN]: "skin-medium",
    [SwatchType.HAIR]: "hair-black",
    [SwatchType.FABRIC]: "fabric-jade",
  },
};

/**
 * Default character appearance with female base
 */
export const DEFAULT_FEMALE_APPEARANCE: CharacterAppearance = {
  version: SCHEMA_VERSION,
  baseModel: BaseModel.FEMALE,
  selections: {
    [CategoryType.HAIR]: "hair-001",
    [CategoryType.EYES]: "eyes-001",
    [CategoryType.BROWS]: "brows-001",
    [CategoryType.MOUTH]: "mouth-001",
    [CategoryType.OUTFIT]: "outfit-001",
  },
  swatches: {
    [SwatchType.SKIN]: "skin-fair",
    [SwatchType.HAIR]: "hair-black",
    [SwatchType.FABRIC]: "fabric-silk",
  },
};

/**
 * Get default appearance for a base model
 */
export function getDefaultAppearance(
  baseModel: BaseModel
): CharacterAppearance {
  return baseModel === BaseModel.MALE
    ? { ...DEFAULT_MALE_APPEARANCE }
    : { ...DEFAULT_FEMALE_APPEARANCE };
}

/**
 * Canvas dimensions for rendering
 */
export const CANVAS_DIMENSIONS = {
  FULL_BODY: {
    width: 512,
    height: 768,
  },
  PORTRAIT: {
    width: 512,
    height: 512,
  },
};

/**
 * Layer rendering order (by index)
 */
export const LAYER_ORDER = [
  "base_body",
  "face_base",
  "eyes",
  "brows",
  "mouth",
  "hair_back",
  "outfit_inner",
  "outfit_outer",
  "accessories",
  "hair_front",
] as const;

/**
 * Maximum history size for undo/redo
 */
export const MAX_HISTORY_SIZE = 50;

/**
 * Local storage key for saving character appearances
 */
export const STORAGE_KEY = "wuxuxian_character_appearance";
