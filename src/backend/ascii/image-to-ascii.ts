/**
 * Image-to-ASCII Art Converter
 * 
 * Converts images to ASCII art using brightness mapping and advanced algorithms.
 * Supports multiple character palettes, aspect ratio correction, and various
 * conversion strategies.
 */

import sharp from 'sharp';
import Jimp from 'jimp';

/**
 * Character palettes ordered from dense (dark) to sparse (light)
 */
export const PALETTES = {
  // 10-level palette (simple, fast)
  simple: '@%#*+=-:. ',
  
  // 70-level palette (detailed, high quality) - reference standard
  detailed: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
  
  // 15-level palette (balanced quality/performance)
  balanced: '@&#$%+*!=;:-,. ',
  
  // Block elements palette (uniform density)
  blocks: '█▓▒░ ',
  
  // Custom game palette (combat-optimized)
  game: '▓▒░.:- ',
  
  // High contrast palette
  highContrast: '█▄▀ ',
  
  // Extended block palette
  blockExtended: '█▉▊▋▌▍▎▏ ',
};

/**
 * Configuration for image-to-ASCII conversion
 */
export interface ImageToASCIIConfig {
  /** Output width in characters */
  width: number;
  
  /** Output height in characters (auto-calculated if not provided) */
  height?: number;
  
  /** Character palette to use (dense to sparse) */
  palette?: string;
  
  /** Invert brightness mapping (light becomes dark) */
  invert?: boolean;
  
  /** Conversion algorithm */
  algorithm?: 'brightness' | 'edge-enhanced' | 'dithering';
  
  /** Contrast adjustment (-1 to 1) */
  contrast?: number;
  
  /** Brightness adjustment (-1 to 1) */
  brightness?: number;
  
  /** Character aspect ratio correction (default: 0.5 for typical fonts) */
  aspectRatio?: number;
}

/**
 * Result of ASCII conversion
 */
export interface ASCIIResult {
  /** ASCII art as string */
  ascii: string;
  
  /** Metadata about the conversion */
  metadata: {
    width: number;
    height: number;
    characters: number;
    processingTime: number;
    algorithm: string;
    palette: string;
  };
}

/**
 * Image-to-ASCII Art Converter
 */
export class ImageToASCIIConverter {
  private defaultConfig: Partial<ImageToASCIIConfig> = {
    palette: PALETTES.balanced,
    invert: false,
    algorithm: 'brightness',
    contrast: 0,
    brightness: 0,
    aspectRatio: 0.5,
  };

  /**
   * Convert an image file to ASCII art
   * 
   * @param imagePath - Path to image file
   * @param config - Conversion configuration
   * @returns ASCII art result
   */
  async convertImage(
    imagePath: string,
    config: ImageToASCIIConfig
  ): Promise<ASCIIResult> {
    const startTime = Date.now();
    const fullConfig = { ...this.defaultConfig, ...config };
    
    // Load and process image with sharp (high performance)
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    
    // Calculate height maintaining aspect ratio
    const aspectRatio = fullConfig.aspectRatio!;
    const height = fullConfig.height || 
      Math.floor(
        (metadata.height! / metadata.width!) * fullConfig.width * aspectRatio
      );
    
    // Apply brightness and contrast adjustments
    let pipeline = image.resize(fullConfig.width, height, { fit: 'fill' });
    
    if (fullConfig.brightness !== 0 || fullConfig.contrast !== 0) {
      pipeline = pipeline.modulate({
        brightness: 1 + fullConfig.brightness!,
        saturation: 1,
      }).linear(1 + fullConfig.contrast!, 0);
    }
    
    // Convert to grayscale and get raw pixel data
    const { data, info } = await pipeline
      .grayscale()
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    // Convert pixel data to ASCII based on algorithm
    let ascii: string;
    switch (fullConfig.algorithm) {
      case 'edge-enhanced':
        ascii = this.convertWithEdgeDetection(data, info, fullConfig);
        break;
      case 'dithering':
        ascii = this.convertWithDithering(data, info, fullConfig);
        break;
      default:
        ascii = this.convertWithBrightness(data, info, fullConfig);
    }
    
    const processingTime = Date.now() - startTime;
    
    return {
      ascii,
      metadata: {
        width: info.width,
        height: info.height,
        characters: info.width * info.height,
        processingTime,
        algorithm: fullConfig.algorithm!,
        palette: fullConfig.palette!.length + ' chars',
      },
    };
  }

  /**
   * Convert image URL to ASCII art
   * 
   * @param url - Image URL
   * @param config - Conversion configuration
   * @returns ASCII art result
   */
  async convertURL(
    url: string,
    config: ImageToASCIIConfig
  ): Promise<ASCIIResult> {
    // Download image using Jimp (supports URLs)
    const image = await Jimp.read(url);
    const tempPath = `/tmp/ascii-temp-${Date.now()}.png`;
    await image.writeAsync(tempPath);
    
    const result = await this.convertImage(tempPath, config);
    
    // Clean up temp file
    try {
      const fs = await import('fs/promises');
      await fs.unlink(tempPath);
    } catch (err) {
      console.warn('Failed to clean up temp file:', err);
    }
    
    return result;
  }

  /**
   * Convert base64 image to ASCII art
   * 
   * @param base64 - Base64 encoded image
   * @param config - Conversion configuration
   * @returns ASCII art result
   */
  async convertBase64(
    base64: string,
    config: ImageToASCIIConfig
  ): Promise<ASCIIResult> {
    // Remove data URL prefix if present
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    const tempPath = `/tmp/ascii-temp-${Date.now()}.png`;
    const fs = await import('fs/promises');
    await fs.writeFile(tempPath, buffer);
    
    const result = await this.convertImage(tempPath, config);
    
    // Clean up
    try {
      await fs.unlink(tempPath);
    } catch (err) {
      console.warn('Failed to clean up temp file:', err);
    }
    
    return result;
  }

  /**
   * Convert pixel data to ASCII using brightness mapping
   * 
   * @param data - Pixel data buffer
   * @param info - Image info
   * @param config - Configuration
   * @returns ASCII string
   */
  private convertWithBrightness(
    data: Buffer,
    info: { width: number; height: number; channels: number },
    config: Required<ImageToASCIIConfig>
  ): string {
    const palette = config.palette;
    const ascii: string[] = [];
    
    for (let y = 0; y < info.height; y++) {
      let line = '';
      for (let x = 0; x < info.width; x++) {
        const idx = (y * info.width + x) * info.channels;
        let brightness = data[idx]; // 0-255
        
        // Invert if requested
        if (config.invert) {
          brightness = 255 - brightness;
        }
        
        // Map brightness to character index
        const charIdx = Math.floor(
          (brightness / 255) * (palette.length - 1)
        );
        line += palette[charIdx];
      }
      ascii.push(line);
    }
    
    return ascii.join('\n');
  }

  /**
   * Convert with edge detection enhancement
   * 
   * @param data - Pixel data buffer
   * @param info - Image info
   * @param config - Configuration
   * @returns ASCII string
   */
  private convertWithEdgeDetection(
    data: Buffer,
    info: { width: number; height: number; channels: number },
    config: Required<ImageToASCIIConfig>
  ): string {
    const palette = config.palette;
    const ascii: string[] = [];
    
    // Sobel operator kernels
    const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
    const sobelY = [[1, 2, 1], [0, 0, 0], [-1, -2, -1]];
    
    for (let y = 0; y < info.height; y++) {
      let line = '';
      for (let x = 0; x < info.width; x++) {
        const idx = (y * info.width + x) * info.channels;
        let brightness = data[idx];
        
        // Calculate edge strength using Sobel operator
        let gx = 0, gy = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const ny = Math.max(0, Math.min(info.height - 1, y + ky));
            const nx = Math.max(0, Math.min(info.width - 1, x + kx));
            const nidx = (ny * info.width + nx) * info.channels;
            const pixel = data[nidx];
            
            gx += pixel * sobelX[ky + 1][kx + 1];
            gy += pixel * sobelY[ky + 1][kx + 1];
          }
        }
        
        const edgeStrength = Math.sqrt(gx * gx + gy * gy);
        
        // Combine brightness (70%) and edge strength (30%)
        const combined = brightness * 0.7 + Math.min(255, edgeStrength) * 0.3;
        
        if (config.invert) {
          brightness = 255 - combined;
        } else {
          brightness = combined;
        }
        
        // Map to character
        const charIdx = Math.floor(
          (brightness / 255) * (palette.length - 1)
        );
        line += palette[charIdx];
      }
      ascii.push(line);
    }
    
    return ascii.join('\n');
  }

  /**
   * Convert with Floyd-Steinberg dithering
   * 
   * @param data - Pixel data buffer
   * @param info - Image info
   * @param config - Configuration
   * @returns ASCII string
   */
  private convertWithDithering(
    data: Buffer,
    info: { width: number; height: number; channels: number },
    config: Required<ImageToASCIIConfig>
  ): string {
    const palette = config.palette;
    const ascii: string[] = [];
    
    // Create working copy of pixel data
    const pixels: number[][] = [];
    for (let y = 0; y < info.height; y++) {
      pixels[y] = [];
      for (let x = 0; x < info.width; x++) {
        const idx = (y * info.width + x) * info.channels;
        pixels[y][x] = data[idx];
      }
    }
    
    // Floyd-Steinberg dithering
    for (let y = 0; y < info.height; y++) {
      let line = '';
      for (let x = 0; x < info.width; x++) {
        const oldPixel = pixels[y][x];
        
        // Find nearest palette entry
        const charIdx = Math.floor(
          (oldPixel / 255) * (palette.length - 1)
        );
        const newPixel = (charIdx / (palette.length - 1)) * 255;
        
        line += palette[charIdx];
        
        // Calculate and distribute error
        const error = oldPixel - newPixel;
        
        if (x + 1 < info.width) {
          pixels[y][x + 1] += error * 7 / 16;
        }
        if (y + 1 < info.height) {
          if (x > 0) {
            pixels[y + 1][x - 1] += error * 3 / 16;
          }
          pixels[y + 1][x] += error * 5 / 16;
          if (x + 1 < info.width) {
            pixels[y + 1][x + 1] += error * 1 / 16;
          }
        }
      }
      ascii.push(line);
    }
    
    return ascii.join('\n');
  }
}

/**
 * Quick conversion function for simple use cases
 * 
 * @param imagePath - Path to image
 * @param width - Output width in characters
 * @param palette - Character palette (optional)
 * @returns ASCII art string
 */
export async function quickConvert(
  imagePath: string,
  width: number = 80,
  palette: string = PALETTES.balanced
): Promise<string> {
  const converter = new ImageToASCIIConverter();
  const result = await converter.convertImage(imagePath, {
    width,
    palette,
  });
  return result.ascii;
}
