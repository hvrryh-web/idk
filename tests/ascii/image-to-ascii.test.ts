import { describe, it, expect } from 'vitest';
import { ImageToASCIIConverter, PALETTES, quickConvert } from '../src/backend/ascii/image-to-ascii';
import path from 'path';
import { promises as fs } from 'fs';
import Jimp from 'jimp';

describe('Image-to-ASCII Converter', () => {
  // Create a simple test image
  async function createTestImage(width: number, height: number, pattern: 'gradient' | 'checkerboard'): Promise<string> {
    const image = new Jimp(width, height);
    
    if (pattern === 'gradient') {
      // Horizontal gradient from black to white
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const brightness = Math.floor((x / width) * 255);
          const color = Jimp.rgbaToInt(brightness, brightness, brightness, 255);
          image.setPixelColor(color, x, y);
        }
      }
    } else if (pattern === 'checkerboard') {
      // Checkerboard pattern
      const squareSize = 10;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const isBlack = (Math.floor(x / squareSize) + Math.floor(y / squareSize)) % 2 === 0;
          const color = isBlack ? 
            Jimp.rgbaToInt(0, 0, 0, 255) : 
            Jimp.rgbaToInt(255, 255, 255, 255);
          image.setPixelColor(color, x, y);
        }
      }
    }
    
    const tempPath = `/tmp/test-image-${Date.now()}.png`;
    await image.writeAsync(tempPath);
    return tempPath;
  }

  it('should convert a gradient image to ASCII', async () => {
    const testImage = await createTestImage(100, 50, 'gradient');
    const converter = new ImageToASCIIConverter();
    
    const result = await converter.convertImage(testImage, {
      width: 40,
      palette: PALETTES.simple,
    });
    
    expect(result.ascii).toBeDefined();
    expect(result.ascii.length).toBeGreaterThan(0);
    expect(result.metadata.width).toBe(40);
    expect(result.metadata.height).toBeGreaterThan(0);
    
    // Gradient should show progression from dense to sparse characters
    const lines = result.ascii.split('\n');
    expect(lines.length).toBe(result.metadata.height);
    
    // First column should be dark (@), last column should be light (space/.)
    const firstChars = lines.map(line => line[0]);
    const lastChars = lines.map(line => line[line.length - 1]);
    
    const darkChar = PALETTES.simple[0];
    const lightChar = PALETTES.simple[PALETTES.simple.length - 1];
    
    // Most first chars should be dark
    const darkCount = firstChars.filter(c => c === darkChar).length;
    expect(darkCount).toBeGreaterThan(lines.length * 0.5);
    
    // Clean up
    await fs.unlink(testImage);
  });

  it('should respect width configuration', async () => {
    const testImage = await createTestImage(200, 100, 'gradient');
    const converter = new ImageToASCIIConverter();
    
    const result = await converter.convertImage(testImage, {
      width: 60,
    });
    
    const lines = result.ascii.split('\n');
    expect(lines[0].length).toBe(60);
    
    await fs.unlink(testImage);
  });

  it('should apply invert correctly', async () => {
    const testImage = await createTestImage(100, 50, 'gradient');
    const converter = new ImageToASCIIConverter();
    
    const normal = await converter.convertImage(testImage, {
      width: 40,
      palette: PALETTES.simple,
      invert: false,
    });
    
    const inverted = await converter.convertImage(testImage, {
      width: 40,
      palette: PALETTES.simple,
      invert: true,
    });
    
    // Inverted should have opposite pattern
    const normalFirstChar = normal.ascii.split('\n')[0][0];
    const invertedFirstChar = inverted.ascii.split('\n')[0][0];
    
    expect(normalFirstChar).not.toBe(invertedFirstChar);
    
    await fs.unlink(testImage);
  });

  it('should use different palettes', async () => {
    const testImage = await createTestImage(100, 50, 'gradient');
    const converter = new ImageToASCIIConverter();
    
    const simple = await converter.convertImage(testImage, {
      width: 40,
      palette: PALETTES.simple,
    });
    
    const detailed = await converter.convertImage(testImage, {
      width: 40,
      palette: PALETTES.detailed,
    });
    
    // Detailed palette should have more unique characters
    const simpleChars = new Set(simple.ascii.split(''));
    const detailedChars = new Set(detailed.ascii.split(''));
    
    expect(detailedChars.size).toBeGreaterThan(simpleChars.size);
    
    await fs.unlink(testImage);
  });

  it('should handle edge-enhanced algorithm', async () => {
    const testImage = await createTestImage(100, 50, 'checkerboard');
    const converter = new ImageToASCIIConverter();
    
    const result = await converter.convertImage(testImage, {
      width: 40,
      algorithm: 'edge-enhanced',
    });
    
    expect(result.ascii).toBeDefined();
    expect(result.metadata.algorithm).toBe('edge-enhanced');
    
    await fs.unlink(testImage);
  });

  it('should handle dithering algorithm', async () => {
    const testImage = await createTestImage(100, 50, 'gradient');
    const converter = new ImageToASCIIConverter();
    
    const result = await converter.convertImage(testImage, {
      width: 40,
      algorithm: 'dithering',
    });
    
    expect(result.ascii).toBeDefined();
    expect(result.metadata.algorithm).toBe('dithering');
    
    await fs.unlink(testImage);
  });

  it('should report processing time', async () => {
    const testImage = await createTestImage(100, 50, 'gradient');
    const converter = new ImageToASCIIConverter();
    
    const result = await converter.convertImage(testImage, {
      width: 40,
    });
    
    expect(result.metadata.processingTime).toBeGreaterThan(0);
    expect(result.metadata.processingTime).toBeLessThan(1000); // Should be fast
    
    await fs.unlink(testImage);
  });

  it('quickConvert should work', async () => {
    const testImage = await createTestImage(100, 50, 'gradient');
    
    const ascii = await quickConvert(testImage, 40);
    
    expect(ascii).toBeDefined();
    expect(ascii.length).toBeGreaterThan(0);
    
    await fs.unlink(testImage);
  });
});
