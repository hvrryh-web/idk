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
 * Defines how to overlay an ASCII asset on a scene
 */
export type Overlay = {
  assetName: string;
  x: number; // column index (0-based) where the asset's anchor will be placed
  y: number; // row index (0-based)
  anchor?: 'bottom-center' | 'center' | { x: number; y: number };
};

/**
 * Specification for composing a scene with background and overlays
 */
export type SceneSpec = {
  background: string;
  overlays: Overlay[];
};

const ASSETS_DIR = path.resolve(process.cwd(), 'src', 'assets', 'ascii');

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
 * Load an ASCII asset from disk with optional metadata.
 * Asset file expected at src/assets/ascii/{name}.txt
 * Metadata file expected at src/assets/ascii/{name}.meta.json
 * 
 * @param name - Name of the asset file (without .txt extension)
 * @returns Promise resolving to the loaded ASCII asset
 */
export async function loadAssetFromDisk(name: string): Promise<AsciiAsset> {
  const assetPath = path.join(ASSETS_DIR, `${name}.txt`);
  const raw = await fs.readFile(assetPath, 'utf-8');
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const width = Math.max(...lines.map((l) => l.length));
  const height = lines.length;
  
  // Load metadata if available
  const metadata = await loadAssetMetadata(name);
  
  return {
    name,
    lines,
    width,
    height,
    anchor: metadata?.anchor,
    metadata: metadata || undefined,
  };
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
 * Simple overlay rules:
 * - Non-space characters from overlays replace whatever is at that position in the background.
 * - Overlays with parts outside the background are clipped.
 * - Uses metadata anchor points if available
 * 
 * @param spec - Scene specification with background and overlays
 * @returns Promise resolving to the composed ASCII scene as a string
 */
export async function composeScene(spec: SceneSpec): Promise<string> {
  const background = await loadAssetFromDisk(spec.background);

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
        // Only overlay non-space characters
        if (ch !== ' ') {
          canvas[destR][destC] = ch;
        }
      }
    }
  }

  return canvas.map((row) => row.join('')).join('\n');
}
