import { loadAssetMetadata, listAssets } from './generator';

/**
 * Chat tag that can trigger scene changes
 */
export type ChatTag = {
  keyword: string;
  assetType: 'background' | 'character' | 'effect';
  assetName?: string;
  tags?: string[];
};

/**
 * Result of parsing chat for scene tags
 */
export type ParsedScene = {
  background?: string;
  characters: Array<{ name: string; position?: 'left' | 'center' | 'right' }>;
  effects: Array<{ name: string; position?: { x: number; y: number } }>;
};

/**
 * Built-in chat tags that map keywords to assets
 */
const CHAT_TAGS: ChatTag[] = [
  // Backgrounds
  { keyword: 'forest', assetType: 'background', assetName: 'forest' },
  { keyword: 'cave', assetType: 'background', assetName: 'cave' },
  { keyword: 'temple', assetType: 'background', assetName: 'temple' },
  { keyword: 'ocean', assetType: 'background', assetName: 'ocean' },
  { keyword: 'outdoor', assetType: 'background', tags: ['outdoor'] },
  { keyword: 'indoor', assetType: 'background', tags: ['indoor'] },
  
  // Characters
  { keyword: 'man', assetType: 'character', assetName: 'man' },
  { keyword: 'woman', assetType: 'character', assetName: 'woman' },
  { keyword: 'cultivator', assetType: 'character', assetName: 'cultivator' },
  { keyword: 'elder', assetType: 'character', assetName: 'elder' },
  { keyword: 'guardian', assetType: 'character', assetName: 'guardian' },
  
  // Effects
  { keyword: 'sparkle', assetType: 'effect', assetName: 'sparkles' },
  { keyword: 'magic', assetType: 'effect', tags: ['magic'] },
  { keyword: 'smoke', assetType: 'effect', assetName: 'smoke' },
  { keyword: 'energy', assetType: 'effect', assetName: 'energy' },
  { keyword: 'power', assetType: 'effect', tags: ['power'] },
];

/**
 * Find asset by name or tags
 * 
 * @param assetType - Type of asset to find
 * @param name - Specific asset name (optional)
 * @param tags - Tags to match (optional)
 * @returns Promise resolving to asset name or null
 */
async function findAsset(
  assetType: string,
  name?: string,
  tags?: string[]
): Promise<string | null> {
  if (name) {
    return name;
  }
  
  if (tags && tags.length > 0) {
    const assets = await listAssets(assetType);
    for (const assetName of assets) {
      const metadata = await loadAssetMetadata(assetName);
      if (metadata && tags.some((tag) => metadata.tags.includes(tag))) {
        return assetName;
      }
    }
  }
  
  return null;
}

/**
 * Parse chat text for scene tags and generate scene specification
 * 
 * Example:
 * "The cultivator enters the forest" -> { background: 'forest', characters: ['cultivator'] }
 * "Elder summons energy" -> { characters: ['elder'], effects: ['energy'] }
 * 
 * @param chatText - Text from game chat to parse
 * @returns Promise resolving to parsed scene data
 */
export async function parseChatForScene(chatText: string): Promise<ParsedScene> {
  const lowerText = chatText.toLowerCase();
  const result: ParsedScene = {
    characters: [],
    effects: [],
  };
  
  // Find matching tags
  for (const tag of CHAT_TAGS) {
    if (lowerText.includes(tag.keyword)) {
      const asset = await findAsset(tag.assetType, tag.assetName, tag.tags);
      
      if (asset) {
        if (tag.assetType === 'background' && !result.background) {
          result.background = asset;
        } else if (tag.assetType === 'character') {
          // Determine position based on context
          let position: 'left' | 'center' | 'right' = 'center';
          if (lowerText.includes('left') || lowerText.includes('approaches')) {
            position = 'left';
          } else if (lowerText.includes('right') || lowerText.includes('departs')) {
            position = 'right';
          }
          result.characters.push({ name: asset, position });
        } else if (tag.assetType === 'effect') {
          result.effects.push({ name: asset });
        }
      }
    }
  }
  
  return result;
}

/**
 * Convert parsed scene to scene specification
 * 
 * @param parsed - Parsed scene data
 * @param backgroundWidth - Width of the background (for positioning)
 * @returns Scene specification ready for composition
 */
export function parsedSceneToSpec(
  parsed: ParsedScene,
  backgroundWidth: number = 48
): any {
  const spec: any = {
    background: parsed.background || 'forest',
    overlays: [],
  };
  
  // Position characters
  const positions = {
    left: Math.floor(backgroundWidth * 0.25),
    center: Math.floor(backgroundWidth * 0.5),
    right: Math.floor(backgroundWidth * 0.75),
  };
  
  for (const char of parsed.characters) {
    const x = positions[char.position || 'center'];
    spec.overlays.push({
      assetName: char.name,
      x,
      y: 6, // Default ground level
    });
  }
  
  // Position effects
  for (const effect of parsed.effects) {
    const x = effect.position?.x || Math.floor(backgroundWidth * 0.5);
    const y = effect.position?.y || 3;
    spec.overlays.push({
      assetName: effect.name,
      x,
      y,
    });
  }
  
  return spec;
}

/**
 * Generate scene spec from chat text
 * 
 * @param chatText - Text from game chat
 * @returns Promise resolving to scene specification
 */
export async function chatToSceneSpec(chatText: string): Promise<any> {
  const parsed = await parseChatForScene(chatText);
  return parsedSceneToSpec(parsed);
}
