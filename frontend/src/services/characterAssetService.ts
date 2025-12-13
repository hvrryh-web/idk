/**
 * Character Asset Service
 * 
 * Manages character visual assets with automatic detection of missing assets
 * and integration with ComfyUI for AI art generation.
 * 
 * Features:
 * - Pre-fills character data from saved records
 * - Detects missing visual assets
 * - Provides fallback images
 * - Tracks asset generation status
 */

// Asset types
export type AssetType = 'portrait' | 'bust' | 'thumbnail';
export type AssetFormat = 'png' | 'jpg' | 'webp';

// Asset paths
export const ASSET_PATHS = {
  portraits: '/assets/characters/portraits',
  busts: '/assets/characters/busts',
  thumbnails: '/assets/characters/thumbnails',
  generated: '/assets/characters/generated',
  fallback: '/assets/characters/fallback',
} as const;

// Character data interface
export interface CharacterAssetData {
  id: string;
  name: string;
  nameCjk: string;
  faction: 'shu' | 'wei' | 'wu' | 'neutral';
  style: 'warrior' | 'strategist' | 'general' | 'noble' | 'villain' | 'female_warrior' | 'advisor';
  description?: string;
  // Asset paths (filled when available)
  portraitUrl?: string;
  bustUrl?: string;
  thumbnailUrl?: string;
  // Asset status
  hasPortrait: boolean;
  hasBust: boolean;
  hasThumbnail: boolean;
  // Generation status
  isGenerating?: boolean;
  lastGenerated?: string;
}

// Default character database
export const CHARACTER_DATABASE: Record<string, Omit<CharacterAssetData, 'portraitUrl' | 'bustUrl' | 'thumbnailUrl' | 'hasPortrait' | 'hasBust' | 'hasThumbnail'>> = {
  'guan-yu': {
    id: 'guan-yu',
    name: 'Guan Yu',
    nameCjk: '关羽',
    faction: 'shu',
    style: 'warrior',
    description: 'Legendary warrior with long black beard, red face, green robe armor, wielding Green Dragon Crescent Blade',
  },
  'zhang-fei': {
    id: 'zhang-fei',
    name: 'Zhang Fei',
    nameCjk: '张飞',
    faction: 'shu',
    style: 'warrior',
    description: 'Fierce warrior with wild beard, intimidating expression, wielding serpent spear',
  },
  'zhao-yun': {
    id: 'zhao-yun',
    name: 'Zhao Yun',
    nameCjk: '赵云',
    faction: 'shu',
    style: 'warrior',
    description: 'Noble young warrior in white armor, handsome features, wielding dragon spear',
  },
  'zhuge-liang': {
    id: 'zhuge-liang',
    name: 'Zhuge Liang',
    nameCjk: '诸葛亮',
    faction: 'shu',
    style: 'strategist',
    description: 'Wise strategist with feather fan, white robe, calm expression, knowing smile',
  },
  'liu-bei': {
    id: 'liu-bei',
    name: 'Liu Bei',
    nameCjk: '刘备',
    faction: 'shu',
    style: 'noble',
    description: 'Benevolent lord with long earlobes, kind expression, imperial yellow robes',
  },
  'cao-cao': {
    id: 'cao-cao',
    name: 'Cao Cao',
    nameCjk: '曹操',
    faction: 'wei',
    style: 'villain',
    description: 'Ambitious warlord with sharp features, calculating gaze, dark ornate armor',
  },
  'cao-ren': {
    id: 'cao-ren',
    name: 'Cao Ren',
    nameCjk: '曹仁',
    faction: 'wei',
    style: 'general',
    description: 'Stalwart general with determined expression, heavy armor, defensive stance',
  },
  'zhang-liao': {
    id: 'zhang-liao',
    name: 'Zhang Liao',
    nameCjk: '张辽',
    faction: 'wei',
    style: 'warrior',
    description: 'Fierce general with sharp eyes, Wei armor, halberd weapon',
  },
  'sima-yi': {
    id: 'sima-yi',
    name: 'Sima Yi',
    nameCjk: '司马懿',
    faction: 'wei',
    style: 'advisor',
    description: 'Cunning strategist with hawk-like gaze, dark robes, scheming expression',
  },
  'sun-quan': {
    id: 'sun-quan',
    name: 'Sun Quan',
    nameCjk: '孙权',
    faction: 'wu',
    style: 'noble',
    description: 'Young lord with purple eyes, noble bearing, Wu kingdom robes',
  },
  'zhou-yu': {
    id: 'zhou-yu',
    name: 'Zhou Yu',
    nameCjk: '周瑜',
    faction: 'wu',
    style: 'strategist',
    description: 'Handsome strategist and musician, elegant robes, confident expression',
  },
  'lu-xun': {
    id: 'lu-xun',
    name: 'Lu Xun',
    nameCjk: '陆逊',
    faction: 'wu',
    style: 'strategist',
    description: 'Young scholar-general, scholarly appearance, determined eyes',
  },
  'diao-chan': {
    id: 'diao-chan',
    name: 'Diao Chan',
    nameCjk: '貂蝉',
    faction: 'neutral',
    style: 'female_warrior',
    description: 'Beautiful dancer with flowing silk robes, graceful pose, moonlit scene',
  },
  'lu-bu': {
    id: 'lu-bu',
    name: 'Lu Bu',
    nameCjk: '吕布',
    faction: 'neutral',
    style: 'villain',
    description: 'Mightiest warrior with phoenix plume, ornate armor, riding Red Hare, intimidating presence',
  },
};

// Faction color mapping for fallback images
export const FACTION_COLORS = {
  shu: { primary: '#00A86B', secondary: '#006B3F', text: '#FDF6E3' },
  wei: { primary: '#4169E1', secondary: '#2E4A7D', text: '#FDF6E3' },
  wu: { primary: '#C41E3A', secondary: '#8B0000', text: '#FDF6E3' },
  neutral: { primary: '#757575', secondary: '#424242', text: '#FDF6E3' },
} as const;

// Asset status cache
const assetStatusCache: Map<string, boolean> = new Map();

/**
 * Check if an asset exists at the given URL
 */
async function checkAssetExists(url: string): Promise<boolean> {
  // Check cache first
  if (assetStatusCache.has(url)) {
    return assetStatusCache.get(url)!;
  }

  try {
    const response = await fetch(url, { method: 'HEAD' });
    const exists = response.ok;
    assetStatusCache.set(url, exists);
    return exists;
  } catch {
    assetStatusCache.set(url, false);
    return false;
  }
}

/**
 * Get the asset URL for a character
 */
export function getAssetUrl(
  characterId: string,
  assetType: AssetType,
  format: AssetFormat = 'png'
): string {
  const basePath = ASSET_PATHS[assetType === 'portrait' ? 'portraits' : assetType === 'bust' ? 'busts' : 'thumbnails'];
  return `${basePath}/${characterId}.${format}`;
}

/**
 * Get the generated asset URL (from ComfyUI)
 */
export function getGeneratedAssetUrl(
  characterId: string,
  format: AssetFormat = 'png'
): string {
  return `${ASSET_PATHS.generated}/${characterId}.${format}`;
}

/**
 * Generate a fallback SVG for a character
 */
export function generateFallbackSvg(character: CharacterAssetData): string {
  const colors = FACTION_COLORS[character.faction];
  const initial = character.nameCjk?.[0] || character.name[0];
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 250">
      <defs>
        <linearGradient id="bg-${character.id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary}"/>
          <stop offset="100%" style="stop-color:${colors.secondary}"/>
        </linearGradient>
      </defs>
      <rect width="200" height="250" fill="url(#bg-${character.id})"/>
      <rect x="5" y="5" width="190" height="240" fill="none" stroke="#D4AF37" stroke-width="2" rx="4"/>
      <text x="100" y="120" text-anchor="middle" dominant-baseline="middle" 
            font-family="Noto Serif SC, serif" font-size="80" font-weight="bold" fill="${colors.text}">
        ${initial}
      </text>
      <text x="100" y="200" text-anchor="middle" 
            font-family="Cinzel, serif" font-size="14" fill="${colors.text}" opacity="0.8">
        ${character.name}
      </text>
    </svg>
  `.trim();
  
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Get full character data with asset status
 */
export async function getCharacterWithAssets(characterId: string): Promise<CharacterAssetData | null> {
  const baseData = CHARACTER_DATABASE[characterId];
  if (!baseData) {
    return null;
  }

  // Check for assets in order of preference
  const portraitUrl = getAssetUrl(characterId, 'portrait');
  const bustUrl = getAssetUrl(characterId, 'bust');
  const thumbnailUrl = getAssetUrl(characterId, 'thumbnail');
  const generatedUrl = getGeneratedAssetUrl(characterId);

  const [hasPortrait, hasBust, hasThumbnail, hasGenerated] = await Promise.all([
    checkAssetExists(portraitUrl),
    checkAssetExists(bustUrl),
    checkAssetExists(thumbnailUrl),
    checkAssetExists(generatedUrl),
  ]);

  return {
    ...baseData,
    portraitUrl: hasPortrait ? portraitUrl : hasGenerated ? generatedUrl : undefined,
    bustUrl: hasBust ? bustUrl : hasGenerated ? generatedUrl : undefined,
    thumbnailUrl: hasThumbnail ? thumbnailUrl : hasGenerated ? generatedUrl : undefined,
    hasPortrait: hasPortrait || hasGenerated,
    hasBust: hasBust || hasGenerated,
    hasThumbnail: hasThumbnail || hasGenerated,
  };
}

/**
 * Get all characters with their asset status
 */
export async function getAllCharactersWithAssets(): Promise<CharacterAssetData[]> {
  const characterIds = Object.keys(CHARACTER_DATABASE);
  const results = await Promise.all(
    characterIds.map(id => getCharacterWithAssets(id))
  );
  return results.filter((c): c is CharacterAssetData => c !== null);
}

/**
 * Get characters that are missing assets
 */
export async function getMissingAssetCharacters(): Promise<CharacterAssetData[]> {
  const allCharacters = await getAllCharactersWithAssets();
  return allCharacters.filter(c => !c.hasPortrait && !c.hasBust && !c.hasThumbnail);
}

/**
 * Get the best available portrait URL for a character
 * Falls back to generated SVG if no assets available
 */
export async function getCharacterPortrait(characterId: string): Promise<string> {
  const character = await getCharacterWithAssets(characterId);
  
  if (!character) {
    // Return a generic fallback
    return generateFallbackSvg({
      id: characterId,
      name: characterId,
      nameCjk: characterId[0].toUpperCase(),
      faction: 'neutral',
      style: 'warrior',
      hasPortrait: false,
      hasBust: false,
      hasThumbnail: false,
    });
  }

  // Return the best available asset
  if (character.portraitUrl) return character.portraitUrl;
  if (character.bustUrl) return character.bustUrl;
  if (character.thumbnailUrl) return character.thumbnailUrl;

  // Generate fallback SVG
  return generateFallbackSvg(character);
}

/**
 * Clear the asset status cache (useful after generating new assets)
 */
export function clearAssetCache(): void {
  assetStatusCache.clear();
}

/**
 * Prefill character data from the database
 */
export function prefillCharacterData(characterId: string): Partial<CharacterAssetData> | null {
  return CHARACTER_DATABASE[characterId] || null;
}

/**
 * Get all character IDs
 */
export function getAllCharacterIds(): string[] {
  return Object.keys(CHARACTER_DATABASE);
}

/**
 * Check if ComfyUI generation is needed for a character
 */
export async function needsGeneration(characterId: string): Promise<boolean> {
  const character = await getCharacterWithAssets(characterId);
  return character !== null && !character.hasPortrait && !character.hasBust && !character.hasThumbnail;
}

/**
 * Get characters needing generation
 */
export async function getCharactersNeedingGeneration(): Promise<string[]> {
  const allCharacters = await getAllCharactersWithAssets();
  return allCharacters
    .filter(c => !c.hasPortrait && !c.hasBust && !c.hasThumbnail)
    .map(c => c.id);
}

export default {
  getAssetUrl,
  getGeneratedAssetUrl,
  generateFallbackSvg,
  getCharacterWithAssets,
  getAllCharactersWithAssets,
  getMissingAssetCharacters,
  getCharacterPortrait,
  clearAssetCache,
  prefillCharacterData,
  getAllCharacterIds,
  needsGeneration,
  getCharactersNeedingGeneration,
  CHARACTER_DATABASE,
  FACTION_COLORS,
  ASSET_PATHS,
};
