/**
 * Character Compositor
 * 
 * Handles rendering and exporting character composites
 */

import {
  AssetManifest,
  CharacterAppearance,
  ExportOptions,
  SwatchType,
} from "../data/types";
import { CANVAS_DIMENSIONS } from "../data/defaults";
import {
  collectLayers,
  loadImage,
  applyTint,
  getSwatchColor,
} from "./layers";

/**
 * Render character to a canvas
 */
export async function renderCharacter(
  manifest: AssetManifest,
  appearance: CharacterAppearance,
  canvas: HTMLCanvasElement
): Promise<void> {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  // Set canvas dimensions
  canvas.width = CANVAS_DIMENSIONS.FULL_BODY.width;
  canvas.height = CANVAS_DIMENSIONS.FULL_BODY.height;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Collect and sort layers
  const layers = collectLayers(manifest, appearance);

  // Render each layer
  for (const layer of layers) {
    try {
      const img = await loadImage(layer.path);
      
      // Check if this layer should be tinted
      let finalImage: HTMLImageElement | HTMLCanvasElement = img;
      
      if (layer.swatchApplicable && layer.swatchApplicable.length > 0) {
        // Apply tint based on swatch selection
        const swatchType = layer.swatchApplicable[0]; // Use first applicable swatch type
        const swatchId = appearance.swatches[swatchType as SwatchType];
        
        if (swatchId) {
          const color = getSwatchColor(manifest, swatchType, swatchId);
          if (color) {
            finalImage = applyTint(img, color, 0.5);
          }
        }
      }

      // Draw the layer at its anchor position
      const x = layer.anchor?.x || 0;
      const y = layer.anchor?.y || 0;
      
      if (finalImage instanceof HTMLCanvasElement) {
        ctx.drawImage(finalImage, x - finalImage.width / 2, y);
      } else {
        ctx.drawImage(finalImage, x - finalImage.width / 2, y);
      }
    } catch (error) {
      console.warn(`Failed to render layer: ${layer.path}`, error);
      // Continue rendering other layers even if one fails
    }
  }
}

/**
 * Export character composite as PNG blob
 */
export async function exportCompositePNG(
  manifest: AssetManifest,
  appearance: CharacterAppearance,
  options: ExportOptions = { format: "full-body" }
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  
  // Determine dimensions
  if (options.format === "portrait") {
    canvas.width = options.width || CANVAS_DIMENSIONS.PORTRAIT.width;
    canvas.height = options.height || CANVAS_DIMENSIONS.PORTRAIT.height;
  } else {
    canvas.width = options.width || CANVAS_DIMENSIONS.FULL_BODY.width;
    canvas.height = options.height || CANVAS_DIMENSIONS.FULL_BODY.height;
  }

  // Set background if specified
  if (options.backgroundColor) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = options.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  // Render character
  await renderCharacter(manifest, appearance, canvas);

  // If portrait, crop to upper portion
  if (options.format === "portrait") {
    const portraitCanvas = document.createElement("canvas");
    portraitCanvas.width = canvas.width;
    portraitCanvas.height = CANVAS_DIMENSIONS.PORTRAIT.height;
    const ctx = portraitCanvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(
        canvas,
        0,
        0,
        canvas.width,
        CANVAS_DIMENSIONS.PORTRAIT.height,
        0,
        0,
        portraitCanvas.width,
        portraitCanvas.height
      );
    }
    return new Promise((resolve, reject) => {
      portraitCanvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to create blob"));
        }
      }, "image/png");
    });
  }

  // Convert canvas to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Failed to create blob"));
      }
    }, "image/png");
  });
}

/**
 * Download exported PNG
 */
export function downloadPNG(blob: Blob, filename: string = "character.png"): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
