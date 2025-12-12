/**
 * Layer Utilities
 * 
 * Handles layer ordering and composition logic
 */

import { LayerType, AssetLayer, CharacterAppearance, AssetManifest } from "../data/types";
import { LAYER_ORDER } from "../data/defaults";
import { getOptionById, getBaseModelDef } from "../data/manifest";

/**
 * Get sorted layers for rendering based on LAYER_ORDER
 */
export function getSortedLayers(layers: AssetLayer[]): AssetLayer[] {
  return [...layers].sort((a, b) => {
    const indexA = LAYER_ORDER.indexOf(a.layerType);
    const indexB = LAYER_ORDER.indexOf(b.layerType);
    return indexA - indexB;
  });
}

/**
 * Collect all layers for a character appearance
 */
export function collectLayers(
  manifest: AssetManifest,
  appearance: CharacterAppearance
): AssetLayer[] {
  const layers: AssetLayer[] = [];

  // Add base model layer
  const baseModelDef = getBaseModelDef(manifest, appearance.baseModel);
  if (baseModelDef) {
    layers.push({
      layerType: LayerType.BASE_BODY,
      path: baseModelDef.path,
      anchor: baseModelDef.anchor,
      maskPath: baseModelDef.maskPath,
    });
  }

  // Add layers from selected options in each category
  manifest.categories.forEach((category) => {
    const selectedOptionId = appearance.selections[category.id];
    if (selectedOptionId) {
      const option = getOptionById(category, selectedOptionId);
      if (option && option.layers) {
        layers.push(...option.layers);
      }
    }
  });

  return getSortedLayers(layers);
}

/**
 * Load an image from a path
 */
export function loadImage(path: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
    img.src = path;
  });
}

/**
 * Apply color tint to image using canvas
 * This is a simple tinting approach; more sophisticated masking can be added later
 */
export function applyTint(
  sourceImage: HTMLImageElement,
  hexColor: string,
  opacity: number = 1.0
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = sourceImage.width;
  canvas.height = sourceImage.height;
  const ctx = canvas.getContext("2d");
  
  if (!ctx) {
    return canvas;
  }

  // Draw original image
  ctx.drawImage(sourceImage, 0, 0);

  // Apply color tint using multiply blend mode
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = hexColor;
  ctx.globalAlpha = opacity;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Restore original alpha channel
  ctx.globalCompositeOperation = "destination-in";
  ctx.globalAlpha = 1.0;
  ctx.drawImage(sourceImage, 0, 0);

  return canvas;
}

/**
 * Get hex color for a swatch selection
 */
export function getSwatchColor(
  manifest: AssetManifest,
  swatchType: string,
  swatchId: string
): string | null {
  const palette = manifest.swatchPalettes.find((p) => p.type === swatchType);
  if (!palette) return null;
  
  const swatch = palette.swatches.find((s) => s.id === swatchId);
  return swatch ? swatch.hexColor : null;
}
