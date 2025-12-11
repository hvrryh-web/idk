import { promises as fs } from 'fs';
import path from 'path';
import { loadAssetFromDisk, loadAssetMetadata, AssetMetadata, AsciiAsset } from './generator';

/**
 * Asset quality metrics
 */
export type AssetQuality = {
  valid: boolean;
  errors: string[];
  warnings: string[];
  metrics: {
    averageDensity: number;
    minLineLength: number;
    maxLineLength: number;
    widthConsistency: number; // 0-1, 1 = perfect
    hasMetadata: boolean;
    metadataAccurate: boolean;
  };
};

/**
 * Validate an ASCII asset for quality and consistency
 * 
 * @param assetName - Name of the asset to validate
 * @returns Quality report with errors and warnings
 */
export async function validateAsset(assetName: string): Promise<AssetQuality> {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    const asset = await loadAssetFromDisk(assetName);
    const metadata = await loadAssetMetadata(assetName);
    
    // Check metadata exists
    const hasMetadata = metadata !== null;
    if (!hasMetadata) {
      warnings.push('No metadata file found');
    }
    
    // Check line lengths
    const lineLengths = asset.lines.map(l => l.length);
    const minLineLength = Math.min(...lineLengths);
    const maxLineLength = Math.max(...lineLengths);
    
    // Check if all lines are padded to width
    const paddingIssues = asset.lines.filter((line, i) => 
      line.length < asset.width
    );
    if (paddingIssues.length > 0) {
      warnings.push(`${paddingIssues.length} lines are shorter than declared width (${asset.width})`);
    }
    
    // Check trailing spaces
    const trailingSpaceLines = asset.lines.filter(line => 
      line.length > 0 && line[line.length - 1] !== ' ' && line.length < asset.width
    );
    if (trailingSpaceLines.length > 0) {
      warnings.push(`${trailingSpaceLines.length} lines missing trailing space padding`);
    }
    
    // Calculate character density
    const totalChars = asset.lines.join('').length;
    const nonSpaceChars = asset.lines.join('').replace(/ /g, '').length;
    const averageDensity = nonSpaceChars / totalChars;
    
    // Check density consistency across lines
    const lineDensities = asset.lines.map(line => {
      const chars = line.replace(/ /g, '').length;
      return line.length > 0 ? chars / line.length : 0;
    });
    const densityVariance = variance(lineDensities);
    if (densityVariance > 0.1) {
      warnings.push(`High density variance (${densityVariance.toFixed(2)}), asset may look unbalanced`);
    }
    
    // Check metadata accuracy
    let metadataAccurate = true;
    if (metadata) {
      if (metadata.width !== asset.width) {
        errors.push(`Metadata width (${metadata.width}) doesn't match actual width (${asset.width})`);
        metadataAccurate = false;
      }
      if (metadata.height !== asset.height) {
        errors.push(`Metadata height (${metadata.height}) doesn't match actual height (${asset.height})`);
        metadataAccurate = false;
      }
      if (metadata.anchor) {
        if (metadata.anchor.x >= asset.width || metadata.anchor.x < 0) {
          errors.push(`Anchor x (${metadata.anchor.x}) is out of bounds [0, ${asset.width})`);
          metadataAccurate = false;
        }
        if (metadata.anchor.y >= asset.height || metadata.anchor.y < 0) {
          errors.push(`Anchor y (${metadata.anchor.y}) is out of bounds [0, ${asset.height})`);
          metadataAccurate = false;
        }
      }
    }
    
    // Check for empty lines
    const emptyLines = asset.lines.filter(line => line.trim().length === 0);
    if (emptyLines.length === asset.lines.length) {
      errors.push('Asset is completely empty');
    } else if (emptyLines.length > asset.lines.length / 2) {
      warnings.push(`${emptyLines.length} empty lines, asset may be too sparse`);
    }
    
    // Width consistency (how close lines are to declared width)
    const widthConsistency = 1 - (maxLineLength - minLineLength) / asset.width;
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      metrics: {
        averageDensity,
        minLineLength,
        maxLineLength,
        widthConsistency,
        hasMetadata,
        metadataAccurate,
      },
    };
  } catch (err: any) {
    return {
      valid: false,
      errors: [`Failed to load asset: ${err.message}`],
      warnings: [],
      metrics: {
        averageDensity: 0,
        minLineLength: 0,
        maxLineLength: 0,
        widthConsistency: 0,
        hasMetadata: false,
        metadataAccurate: false,
      },
    };
  }
}

/**
 * Calculate variance of an array of numbers
 */
function variance(arr: number[]): number {
  if (arr.length === 0) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const squaredDiffs = arr.map(x => Math.pow(x - mean, 2));
  return squaredDiffs.reduce((a, b) => a + b, 0) / arr.length;
}

/**
 * Normalize an asset by padding lines to width
 * 
 * @param asset - Asset to normalize
 * @returns Normalized asset
 */
export function normalizeAsset(asset: AsciiAsset): AsciiAsset {
  const normalizedLines = asset.lines.map(line => {
    // Pad to width
    if (line.length < asset.width) {
      return line + ' '.repeat(asset.width - line.length);
    }
    // Trim if too long
    if (line.length > asset.width) {
      return line.substring(0, asset.width);
    }
    return line;
  });
  
  return {
    ...asset,
    lines: normalizedLines,
  };
}

/**
 * Validate a scene specification before composition
 * 
 * @param spec - Scene specification to validate
 * @returns Validation result with errors
 */
export async function validateSceneSpec(spec: any): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];
  
  // Check required fields
  if (!spec.background) {
    errors.push('Missing required field: background');
  }
  if (!spec.overlays) {
    errors.push('Missing required field: overlays');
  } else if (!Array.isArray(spec.overlays)) {
    errors.push('Field overlays must be an array');
  }
  
  // Validate background exists
  if (spec.background) {
    try {
      await loadAssetFromDisk(spec.background);
    } catch (err: any) {
      errors.push(`Background asset '${spec.background}' not found: ${err.message}`);
    }
  }
  
  // Validate overlays
  if (Array.isArray(spec.overlays)) {
    for (let i = 0; i < spec.overlays.length; i++) {
      const overlay = spec.overlays[i];
      
      if (!overlay.assetName) {
        errors.push(`Overlay ${i}: missing assetName`);
        continue;
      }
      
      if (typeof overlay.x !== 'number') {
        errors.push(`Overlay ${i}: x must be a number`);
      }
      
      if (typeof overlay.y !== 'number') {
        errors.push(`Overlay ${i}: y must be a number`);
      }
      
      // Check if asset exists
      try {
        await loadAssetFromDisk(overlay.assetName);
      } catch (err: any) {
        errors.push(`Overlay ${i}: asset '${overlay.assetName}' not found`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Run validation on all assets in the library
 * 
 * @returns Map of asset names to quality reports
 */
export async function validateAllAssets(): Promise<Map<string, AssetQuality>> {
  const ASSETS_DIR = path.resolve(process.cwd(), 'src', 'assets', 'ascii');
  const files = await fs.readdir(ASSETS_DIR);
  const assetNames = files
    .filter(f => f.endsWith('.txt'))
    .map(f => f.replace('.txt', ''));
  
  const results = new Map<string, AssetQuality>();
  
  for (const name of assetNames) {
    const quality = await validateAsset(name);
    results.set(name, quality);
  }
  
  return results;
}

/**
 * Generate a quality report for all assets
 * 
 * @returns Human-readable report
 */
export async function generateQualityReport(): Promise<string> {
  const results = await validateAllAssets();
  const lines: string[] = [];
  
  lines.push('='.repeat(60));
  lines.push('ASCII Asset Quality Report');
  lines.push('='.repeat(60));
  lines.push('');
  
  let validCount = 0;
  let warningCount = 0;
  let errorCount = 0;
  
  for (const [name, quality] of results) {
    if (quality.valid && quality.warnings.length === 0) {
      validCount++;
      lines.push(`✅ ${name}`);
    } else if (quality.valid && quality.warnings.length > 0) {
      warningCount++;
      lines.push(`⚠️  ${name} (${quality.warnings.length} warnings)`);
      quality.warnings.forEach(w => lines.push(`   - ${w}`));
    } else {
      errorCount++;
      lines.push(`❌ ${name} (${quality.errors.length} errors)`);
      quality.errors.forEach(e => lines.push(`   - ${e}`));
    }
    
    // Show metrics
    lines.push(`   Density: ${(quality.metrics.averageDensity * 100).toFixed(1)}% | Consistency: ${(quality.metrics.widthConsistency * 100).toFixed(1)}%`);
    lines.push('');
  }
  
  lines.push('='.repeat(60));
  lines.push(`Summary: ${validCount} valid, ${warningCount} warnings, ${errorCount} errors`);
  lines.push('='.repeat(60));
  
  return lines.join('\n');
}
