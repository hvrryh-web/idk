import { promises as fs } from 'fs';
import path from 'path';

/**
 * Metadata for an ASCII asset
 */
export type AssetMetadata = {
  name: string;
  width: number;
  height: number;
  anchor: { x: number; y: number };
  type: 'background' | 'character' | 'effect';
  tags: string[];
};

/**
 * Represents an ASCII art asset with its content and dimensions
 */
export type AsciiAsset = {
  name: string;
  lines: string[];
  width: number;
  height: number;
  // Optional anchor metadata for future use
  anchor?: { x: number; y: number };
  metadata?: AssetMetadata;
};

/**
 * Blend mode for overlay composition
 */
export type BlendMode = 'replace' | 'transparent' | 'blend';

/**
 * Defines how to overlay an ASCII asset on a scene
 */
export type Overlay = {
  assetName: string;
  x: number; // column index (0-based) where the asset's anchor will be placed
  y: number; // row index (0-based)
  anchor?: 'bottom-center' | 'center' | { x: number; y: number };
  blendMode?: BlendMode; // How to blend with background (default: 'replace')
  opacity?: number; // For future use (0-1, default: 1)
};

/**
 * Specification for composing a scene with background and overlays
 */
export type SceneSpec = {
  background: string;
  overlays: Overlay[];
  transparentChar?: string; // Character to treat as transparent (default: '.')
};

const ASSETS_DIR = path.resolve(process.cwd(), 'src', 'assets', 'ascii');

// Asset cache
const assetCache = new Map<string, { asset: AsciiAsset; timestamp: number }>();
const MAX_CACHE_SIZE = 50;
let cacheHits = 0;
let cacheMisses = 0;

/**
 * Load metadata for an ASCII asset if it exists
 * 
 * @param name - Name of the asset
 * @returns Promise resolving to metadata or null if not found
 */
export async function loadAssetMetadata(name: string): Promise<AssetMetadata | null> {
  try {
    const metaPath = path.join(ASSETS_DIR, `${name}.meta.json`);
    const raw = await fs.readFile(metaPath, 'utf-8');
    return JSON.parse(raw) as AssetMetadata;
  } catch {
    return null;
  }
}

/**
 * Load an ASCII asset from disk with optional metadata and caching.
 * Asset file expected at src/assets/ascii/{name}.txt
 * Metadata file expected at src/assets/ascii/{name}.meta.json
 * 
 * @param name - Name of the asset file (without .txt extension)
 * @param useCache - Whether to use cache (default: true)
 * @returns Promise resolving to the loaded ASCII asset
 */
export async function loadAssetFromDisk(name: string, useCache: boolean = true): Promise<AsciiAsset> {
  // Check cache
  if (useCache && assetCache.has(name)) {
    const entry = assetCache.get(name)!;
    entry.timestamp = Date.now(); // Update LRU
    cacheHits++;
    return entry.asset;
  }
  
  cacheMisses++;
  
  const assetPath = path.join(ASSETS_DIR, `${name}.txt`);
  const raw = await fs.readFile(assetPath, 'utf-8');
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const width = Math.max(...lines.map((l) => l.length));
  const height = lines.length;
  
  // Load metadata if available
  const metadata = await loadAssetMetadata(name);
  
  const asset: AsciiAsset = {
    name,
    lines,
    width,
    height,
    anchor: metadata?.anchor,
    metadata: metadata || undefined,
  };
  
  // Store in cache
  if (useCache) {
    // Evict oldest if at capacity
    if (assetCache.size >= MAX_CACHE_SIZE) {
      let oldestKey: string | null = null;
      let oldestTime = Infinity;
      for (const [key, entry] of assetCache.entries()) {
        if (entry.timestamp < oldestTime) {
          oldestTime = entry.timestamp;
          oldestKey = key;
        }
      }
      if (oldestKey) {
        assetCache.delete(oldestKey);
      }
    }
    
    assetCache.set(name, { asset, timestamp: Date.now() });
  }
  
  return asset;
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  const total = cacheHits + cacheMisses;
  return {
    size: assetCache.size,
    hits: cacheHits,
    misses: cacheMisses,
    hitRate: total > 0 ? cacheHits / total : 0,
  };
}

/**
 * Clear the asset cache
 */
export function clearCache() {
  assetCache.clear();
  cacheHits = 0;
  cacheMisses = 0;
}

/**
 * Preload common assets into cache
 */
export async function preloadCommonAssets() {
  const commonAssets = [
    'forest', 'cave', 'temple', 'ocean',
    'man', 'woman', 'cultivator', 'elder', 'guardian',
    'sparkles', 'energy', 'smoke',
  ];

  for (const name of commonAssets) {
    try {
      await loadAssetFromDisk(name);
    } catch (err) {
      console.warn(`Failed to preload asset '${name}':`, err);
    }
  }
  
  console.log(`Preloaded ${commonAssets.length} common assets into cache`);
}

/**
 * List all available assets by type
 * 
 * @param type - Optional type filter (background, character, effect)
 * @returns Promise resolving to array of asset names
 */
export async function listAssets(type?: string): Promise<string[]> {
  const files = await fs.readdir(ASSETS_DIR);
  const assetNames = files
    .filter((f) => f.endsWith('.txt'))
    .map((f) => f.replace('.txt', ''));
  
  if (!type) {
    return assetNames;
  }
  
  // Filter by type using metadata
  const filtered: string[] = [];
  for (const name of assetNames) {
    const metadata = await loadAssetMetadata(name);
    if (metadata && metadata.type === type) {
      filtered.push(name);
    }
  }
  return filtered;
}

/**
 * Compute anchor offset for an asset based on the anchor type
 * 
 * @param asset - The ASCII asset
 * @param anchor - Anchor specification ('bottom-center', 'center', or coordinates)
 * @returns Object with anchor x and y offsets
 */
function computeAnchorOffset(
  asset: AsciiAsset,
  anchor: Overlay['anchor']
): { ax: number; ay: number } {
  // Use metadata anchor if available and no override is specified
  if (!anchor && asset.anchor) {
    return { ax: asset.anchor.x, ay: asset.anchor.y };
  }
  
  if (!anchor || anchor === 'bottom-center') {
    return { ax: Math.floor(asset.width / 2), ay: asset.height - 1 };
  }
  if (anchor === 'center') {
    return { ax: Math.floor(asset.width / 2), ay: Math.floor(asset.height / 2) };
  }
  // explicit coordinates
  if (typeof anchor === 'object' && 'x' in anchor && 'y' in anchor) {
    return {
      ax: Math.floor(anchor.x ?? asset.width / 2),
      ay: Math.floor(anchor.y ?? asset.height / 2),
    };
  }
  // fallback to bottom-center
  return { ax: Math.floor(asset.width / 2), ay: asset.height - 1 };
}

/**
 * Compose a scene by overlaying ASCII assets on a background.
 * 
 * Overlay rules:
 * - 'replace' mode: Non-space characters replace background (default)
 * - 'transparent' mode: Uses transparentChar (default '.') as transparent
 * - 'blend' mode: Only overlay where background is space
 * - Overlays with parts outside the background are clipped
 * - Uses metadata anchor points if available
 * 
 * @param spec - Scene specification with background and overlays
 * @returns Promise resolving to the composed ASCII scene as a string
 */
export async function composeScene(spec: SceneSpec): Promise<string> {
  const background = await loadAssetFromDisk(spec.background);
  const transparentChar = spec.transparentChar || '.';

  // Create 2D buffer initialized with background characters (pad with spaces)
  const canvas: string[][] = [];
  for (let r = 0; r < background.height; r++) {
    const line = background.lines[r] ?? '';
    const row: string[] = [];
    for (let c = 0; c < background.width; c++) {
      row.push(line[c] ?? ' ');
    }
    canvas.push(row);
  }

  // Overlay each asset
  for (const ov of spec.overlays) {
    const asset = await loadAssetFromDisk(ov.assetName);
    const { ax, ay } = computeAnchorOffset(asset, ov.anchor);
    const blendMode = ov.blendMode || 'replace';
    
    // Asset position: top-left corner where we'll start drawing
    const top = ov.y - ay;
    const left = ov.x - ax;

    for (let r = 0; r < asset.height; r++) {
      const destR = top + r;
      if (destR < 0 || destR >= canvas.length) continue;
      const assetLine = asset.lines[r] ?? '';
      for (let c = 0; c < asset.width; c++) {
        const destC = left + c;
        if (destC < 0 || destC >= background.width) continue;
        const ch = assetLine[c] ?? ' ';
        
        // Apply blend mode
        if (blendMode === 'transparent') {
          // Treat transparentChar as transparent
          if (ch !== ' ' && ch !== transparentChar) {
            canvas[destR][destC] = ch;
          }
        } else if (blendMode === 'blend') {
          // Only overlay where background is space
          if (ch !== ' ' && canvas[destR][destC] === ' ') {
            canvas[destR][destC] = ch;
          }
        } else {
          // Default 'replace' mode: non-space characters replace background
          if (ch !== ' ') {
            canvas[destR][destC] = ch;
          }
        }
      }
    }
  }

  return canvas.map((row) => row.join('')).join('\n');
}
