/**
 * Character Customization Data Types
 * 
 * Defines the schema for character appearance, asset manifests,
 * and customization options following the ComfyUI-driven pipeline.
 */

export const SCHEMA_VERSION = "1.0.0";

/**
 * Layer types for deterministic rendering order
 */
export enum LayerType {
  BASE_BODY = "base_body",
  FACE_BASE = "face_base",
  EYES = "eyes",
  BROWS = "brows",
  MOUTH = "mouth",
  HAIR_BACK = "hair_back",
  OUTFIT_INNER = "outfit_inner",
  OUTFIT_OUTER = "outfit_outer",
  ACCESSORIES = "accessories",
  HAIR_FRONT = "hair_front",
}

/**
 * Base model gender options
 */
export enum BaseModel {
  FEMALE = "female",
  MALE = "male",
}

/**
 * Category types for customization options
 */
export enum CategoryType {
  HAIR = "hair",
  EYES = "eyes",
  BROWS = "brows",
  MOUTH = "mouth",
  OUTFIT = "outfit",
}

/**
 * Swatch types for color customization
 */
export enum SwatchType {
  SKIN = "skin",
  HAIR = "hair",
  FABRIC = "fabric",
}

/**
 * Anchor point for layer positioning
 */
export interface Anchor {
  x: number;
  y: number;
}

/**
 * Asset layer definition
 */
export interface AssetLayer {
  layerType: LayerType;
  path: string;
  anchor?: Anchor;
  maskPath?: string;
  swatchApplicable?: SwatchType[];
}

/**
 * Individual option within a category
 */
export interface Option {
  id: string;
  name: string;
  layers: AssetLayer[];
  thumbnail?: string;
  dependencies?: string[]; // Option IDs that must be selected with this
  exclusions?: string[]; // Option IDs that cannot be selected with this
}

/**
 * Customization category definition
 */
export interface Category {
  id: CategoryType;
  name: string;
  description: string;
  options: Option[];
  required: boolean;
  defaultOptionId?: string;
}

/**
 * Color swatch definition
 */
export interface Swatch {
  id: string;
  name: string;
  hexColor: string;
  thumbnail?: string;
}

/**
 * Swatch palette for a specific type
 */
export interface SwatchPalette {
  type: SwatchType;
  name: string;
  swatches: Swatch[];
}

/**
 * Base model definition
 */
export interface BaseModelDef {
  id: BaseModel;
  name: string;
  path: string;
  anchor: Anchor;
  dimensions: {
    width: number;
    height: number;
  };
  maskPath?: string;
}

/**
 * Complete asset manifest driving the UI
 */
export interface AssetManifest {
  version: string;
  generatedAt: string;
  baseModels: BaseModelDef[];
  categories: Category[];
  swatchPalettes: SwatchPalette[];
}

/**
 * User's character appearance selection
 */
export interface CharacterAppearance {
  version: string;
  baseModel: BaseModel;
  selections: Record<CategoryType, string>; // category -> option ID
  swatches: Record<SwatchType, string>; // swatch type -> swatch ID
  seed?: number; // For reproducible randomization
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Export options for composite PNG
 */
export interface ExportOptions {
  format: "full-body" | "portrait";
  width?: number;
  height?: number;
  backgroundColor?: string;
}

/**
 * History state for undo/redo
 */
export interface HistoryState {
  appearance: CharacterAppearance;
  timestamp: number;
}
