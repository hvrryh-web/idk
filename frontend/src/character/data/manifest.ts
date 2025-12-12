/**
 * Asset Manifest Loader and Validator
 * 
 * Handles loading, validation, and access to the asset manifest
 */

import {
  AssetManifest,
  CategoryType,
  SwatchType,
  BaseModel,
  ValidationResult,
  Option,
  Category,
  SwatchPalette,
  BaseModelDef,
} from "./types";

/**
 * Validates an asset manifest
 */
export function validateManifest(manifest: AssetManifest): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check version
  if (!manifest.version) {
    errors.push("Manifest missing version");
  }

  // Check base models
  if (!manifest.baseModels || manifest.baseModels.length < 2) {
    errors.push("Manifest must include at least 2 base models (male/female)");
  } else {
    const hasM = manifest.baseModels.some((b) => b.id === BaseModel.MALE);
    const hasF = manifest.baseModels.some((b) => b.id === BaseModel.FEMALE);
    if (!hasM || !hasF) {
      errors.push("Manifest must include both male and female base models");
    }
  }

  // Check categories
  if (!manifest.categories || manifest.categories.length === 0) {
    errors.push("Manifest must include at least one category");
  } else {
    manifest.categories.forEach((cat) => {
      if (!cat.id || !cat.name) {
        errors.push(`Category missing id or name: ${JSON.stringify(cat)}`);
      }
      if (!cat.options || cat.options.length < 5) {
        warnings.push(
          `Category "${cat.name}" has fewer than 5 options (${cat.options?.length || 0})`
        );
      }
      // Validate options
      cat.options?.forEach((opt) => {
        if (!opt.id || !opt.name) {
          errors.push(
            `Option in category "${cat.name}" missing id or name: ${JSON.stringify(opt)}`
          );
        }
        if (!opt.layers || opt.layers.length === 0) {
          errors.push(`Option "${opt.name}" has no layers`);
        }
      });
    });
  }

  // Check swatch palettes
  if (!manifest.swatchPalettes || manifest.swatchPalettes.length === 0) {
    warnings.push("No swatch palettes defined");
  } else {
    manifest.swatchPalettes.forEach((palette) => {
      if (!palette.type || !palette.swatches || palette.swatches.length === 0) {
        errors.push(
          `Swatch palette "${palette.name}" is missing type or swatches`
        );
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Loads the asset manifest from the public directory
 */
export async function loadManifest(): Promise<AssetManifest> {
  try {
    const response = await fetch(
      "/assets/characters/asset_manifest.json?t=" + Date.now()
    );
    if (!response.ok) {
      throw new Error(`Failed to load manifest: ${response.statusText}`);
    }
    const manifest = await response.json();
    const validation = validateManifest(manifest);
    if (!validation.valid) {
      console.error("Manifest validation errors:", validation.errors);
      throw new Error(
        `Invalid manifest: ${validation.errors.join(", ")}`
      );
    }
    if (validation.warnings.length > 0) {
      console.warn("Manifest validation warnings:", validation.warnings);
    }
    return manifest;
  } catch (error) {
    console.error("Error loading manifest:", error);
    throw error;
  }
}

/**
 * Gets a category by ID from the manifest
 */
export function getCategoryById(
  manifest: AssetManifest,
  categoryId: CategoryType
): Category | undefined {
  return manifest.categories.find((c) => c.id === categoryId);
}

/**
 * Gets an option by ID from a category
 */
export function getOptionById(
  category: Category,
  optionId: string
): Option | undefined {
  return category.options.find((o) => o.id === optionId);
}

/**
 * Gets a swatch palette by type from the manifest
 */
export function getSwatchPalette(
  manifest: AssetManifest,
  swatchType: SwatchType
): SwatchPalette | undefined {
  return manifest.swatchPalettes.find((p) => p.type === swatchType);
}

/**
 * Gets a base model definition by ID
 */
export function getBaseModelDef(
  manifest: AssetManifest,
  baseModel: BaseModel
): BaseModelDef | undefined {
  return manifest.baseModels.find((b) => b.id === baseModel);
}

/**
 * Validates option dependencies and exclusions
 */
export function validateOptionSelection(
  manifest: AssetManifest,
  categoryId: CategoryType,
  optionId: string,
  currentSelections: Record<CategoryType, string>
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const category = getCategoryById(manifest, categoryId);
  if (!category) {
    errors.push(`Category not found: ${categoryId}`);
    return { valid: false, errors, warnings };
  }

  const option = getOptionById(category, optionId);
  if (!option) {
    errors.push(`Option not found: ${optionId} in category ${categoryId}`);
    return { valid: false, errors, warnings };
  }

  // Check dependencies
  if (option.dependencies && option.dependencies.length > 0) {
    option.dependencies.forEach((depId) => {
      const found = Object.values(currentSelections).includes(depId);
      if (!found) {
        warnings.push(
          `Option "${option.name}" requires "${depId}" to be selected`
        );
      }
    });
  }

  // Check exclusions
  if (option.exclusions && option.exclusions.length > 0) {
    option.exclusions.forEach((exclId) => {
      const found = Object.values(currentSelections).includes(exclId);
      if (found) {
        errors.push(
          `Option "${option.name}" conflicts with "${exclId}"`
        );
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
