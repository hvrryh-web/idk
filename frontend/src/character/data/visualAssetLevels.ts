/**
 * Visual Asset Quality Levels - Frontend Types and Utilities
 * 
 * Defines the hierarchy of visual asset quality levels and provides
 * utilities for accessing and managing character visual assets.
 */

/**
 * Visual asset quality levels in descending order
 */
export enum AssetQualityLevel {
  /** Highest quality - wiki pages and promotional use */
  WIKI_DETAILED = "wiki_detailed",
  /** Standard gameplay - character sheets, editor preview */
  STANDARD_GAMEPLAY = "standard_gameplay",
  /** Player character battle tokens for combat grid */
  BATTLE_TOKEN_PC = "battle_token_pc",
  /** NPC battle tokens for combat grid */
  BATTLE_TOKEN_NPC = "battle_token_npc",
  /** Top-down tokens for tactical battle maps */
  BATTLE_MAP_TOKEN = "battle_map_token",
  /** ASCII art for combat illustrations */
  ASCII_COMBAT = "ascii_combat",
  /** ASCII art for map event illustrations */
  ASCII_MAP_EVENT = "ascii_map_event",
}

/**
 * Character types that determine asset eligibility
 */
export enum CharacterType {
  PLAYER_CHARACTER = "player_character",
  NAMED_NPC = "named_npc",
  GENERIC_NPC = "generic_npc",
}

/**
 * Token size options
 */
export type TokenSize = "large" | "medium" | "small";

/**
 * Asset resolution configuration
 */
export interface AssetResolution {
  width: number;
  height: number;
  unit?: "pixels" | "characters";
}

/**
 * Quality level configuration
 */
export interface QualityLevelConfig {
  tier: number;
  name: string;
  description: string;
  resolutions: Record<string, AssetResolution>;
  useCases: string[];
  eligibleCharacterTypes: CharacterType[];
}

/**
 * Character visual assets at all quality levels
 */
export interface CharacterVisualAssets {
  characterId: string;
  characterType: CharacterType;
  
  wiki?: {
    portrait?: string;
    portraitVariants?: Record<string, string>;
    fullbody?: string;
    fullbodyVariants?: Record<string, string>;
    expressions?: string;
  };
  
  standard?: {
    portrait: string;
    thumbnail: string;
  };
  
  tokens?: {
    battle: {
      large: string;
      medium: string;
      small: string;
    };
    map: {
      standard: string;
      large?: string;
    };
  };
  
  ascii?: {
    idle?: string;
    attack?: string;
    defend?: string;
    cast?: string;
    hurt?: string;
    dead?: string;
    mapIcon?: string;
  };
}

/**
 * Configuration for quality level metadata
 */
export const QUALITY_LEVEL_CONFIG: Record<AssetQualityLevel, QualityLevelConfig> = {
  [AssetQualityLevel.WIKI_DETAILED]: {
    tier: 1,
    name: "Wiki Detailed Art",
    description: "Highest quality character renders for wiki pages",
    resolutions: {
      portrait: { width: 1024, height: 1536 },
      fullbody: { width: 1024, height: 1536 },
      expressions: { width: 2048, height: 3072 },
    },
    useCases: [
      "Wiki character pages",
      "Character highlight galleries",
      "Promotional materials",
    ],
    eligibleCharacterTypes: [CharacterType.PLAYER_CHARACTER, CharacterType.NAMED_NPC],
  },
  
  [AssetQualityLevel.STANDARD_GAMEPLAY]: {
    tier: 2,
    name: "Standard Gameplay Art",
    description: "Quality character art for general gameplay",
    resolutions: {
      portrait: { width: 512, height: 768 },
      thumbnail: { width: 128, height: 192 },
    },
    useCases: [
      "Character creation editor",
      "In-game panels",
      "Conversation UI",
    ],
    eligibleCharacterTypes: [
      CharacterType.PLAYER_CHARACTER,
      CharacterType.NAMED_NPC,
      CharacterType.GENERIC_NPC,
    ],
  },
  
  [AssetQualityLevel.BATTLE_TOKEN_PC]: {
    tier: 3,
    name: "PC Battle Tokens",
    description: "Player character tokens for combat grid",
    resolutions: {
      large: { width: 128, height: 128 },
      medium: { width: 64, height: 64 },
      small: { width: 32, height: 32 },
    },
    useCases: ["Combat grid", "Turn order tracker", "Party display"],
    eligibleCharacterTypes: [CharacterType.PLAYER_CHARACTER],
  },
  
  [AssetQualityLevel.BATTLE_TOKEN_NPC]: {
    tier: 3,
    name: "NPC Battle Tokens",
    description: "NPC tokens for combat grid",
    resolutions: {
      large: { width: 128, height: 128 },
      medium: { width: 64, height: 64 },
      small: { width: 32, height: 32 },
    },
    useCases: ["Enemy tokens", "Allied NPC tokens", "Boss indicators"],
    eligibleCharacterTypes: [CharacterType.NAMED_NPC, CharacterType.GENERIC_NPC],
  },
  
  [AssetQualityLevel.BATTLE_MAP_TOKEN]: {
    tier: 4,
    name: "Battle Map Tokens",
    description: "Top-down tokens for tactical maps",
    resolutions: {
      standard: { width: 64, height: 64 },
      large: { width: 128, height: 128 },
    },
    useCases: ["Tactical battle map", "Position tracking", "Formation display"],
    eligibleCharacterTypes: [
      CharacterType.PLAYER_CHARACTER,
      CharacterType.NAMED_NPC,
      CharacterType.GENERIC_NPC,
    ],
  },
  
  [AssetQualityLevel.ASCII_COMBAT]: {
    tier: 5,
    name: "ASCII Combat Art",
    description: "Text-based art for combat illustrations",
    resolutions: {
      character: { width: 20, height: 25, unit: "characters" },
      effect: { width: 15, height: 15, unit: "characters" },
    },
    useCases: ["Text-mode combat", "Combat log illustrations", "Accessibility mode"],
    eligibleCharacterTypes: [
      CharacterType.PLAYER_CHARACTER,
      CharacterType.NAMED_NPC,
      CharacterType.GENERIC_NPC,
    ],
  },
  
  [AssetQualityLevel.ASCII_MAP_EVENT]: {
    tier: 5,
    name: "ASCII Map Event Art",
    description: "ASCII illustrations for map events",
    resolutions: {
      icon: { width: 10, height: 10, unit: "characters" },
      scene: { width: 60, height: 20, unit: "characters" },
    },
    useCases: ["Map event icons", "Encounter previews", "Location illustrations"],
    eligibleCharacterTypes: [
      CharacterType.PLAYER_CHARACTER,
      CharacterType.NAMED_NPC,
      CharacterType.GENERIC_NPC,
    ],
  },
};

/**
 * Get eligible quality levels for a character type
 */
export function getEligibleQualityLevels(
  characterType: CharacterType
): AssetQualityLevel[] {
  return Object.entries(QUALITY_LEVEL_CONFIG)
    .filter(([_, config]) => 
      config.eligibleCharacterTypes.includes(characterType)
    )
    .map(([level, _]) => level as AssetQualityLevel)
    .sort((a, b) => 
      QUALITY_LEVEL_CONFIG[a].tier - QUALITY_LEVEL_CONFIG[b].tier
    );
}

/**
 * Check if a character type is eligible for wiki-quality art
 */
export function isEligibleForWikiArt(characterType: CharacterType): boolean {
  return QUALITY_LEVEL_CONFIG[AssetQualityLevel.WIKI_DETAILED]
    .eligibleCharacterTypes.includes(characterType);
}

/**
 * Get the appropriate battle token quality level for a character type
 */
export function getBattleTokenLevel(
  characterType: CharacterType
): AssetQualityLevel {
  return characterType === CharacterType.PLAYER_CHARACTER
    ? AssetQualityLevel.BATTLE_TOKEN_PC
    : AssetQualityLevel.BATTLE_TOKEN_NPC;
}

/**
 * Get asset URL paths for a character
 */
export function getAssetPaths(
  characterId: string,
  basePath: string = "/assets/characters"
): CharacterVisualAssets {
  const charPath = `${basePath}/${characterId}`;
  
  return {
    characterId,
    characterType: CharacterType.PLAYER_CHARACTER, // Default, should be set by caller
    
    wiki: {
      portrait: `${charPath}/wiki/portrait_default.png`,
      fullbody: `${charPath}/wiki/fullbody_default.png`,
      expressions: `${charPath}/wiki/expressions.png`,
    },
    
    standard: {
      portrait: `${charPath}/standard/portrait.png`,
      thumbnail: `${charPath}/standard/thumbnail.png`,
    },
    
    tokens: {
      battle: {
        large: `${charPath}/tokens/battle_128.png`,
        medium: `${charPath}/tokens/battle_64.png`,
        small: `${charPath}/tokens/battle_32.png`,
      },
      map: {
        standard: `${charPath}/tokens/map_64.png`,
        large: `${charPath}/tokens/map_128.png`,
      },
    },
    
    ascii: {
      idle: `${charPath}/ascii/idle.txt`,
      attack: `${charPath}/ascii/attack.txt`,
      defend: `${charPath}/ascii/defend.txt`,
      cast: `${charPath}/ascii/cast.txt`,
      hurt: `${charPath}/ascii/hurt.txt`,
      dead: `${charPath}/ascii/dead.txt`,
      mapIcon: `${charPath}/ascii/map_icon.txt`,
    },
  };
}

/**
 * Get the best available asset for a quality level with fallback
 */
export function getBestAvailableAsset(
  assets: CharacterVisualAssets,
  preferredLevel: AssetQualityLevel,
  assetType: string = "portrait"
): string | null {
  // Define fallback chain
  const fallbackChain: AssetQualityLevel[] = [
    AssetQualityLevel.WIKI_DETAILED,
    AssetQualityLevel.STANDARD_GAMEPLAY,
    AssetQualityLevel.BATTLE_TOKEN_PC,
    AssetQualityLevel.BATTLE_TOKEN_NPC,
  ];
  
  // Start from preferred level and work down
  const startIndex = fallbackChain.indexOf(preferredLevel);
  const orderedLevels = startIndex >= 0
    ? [...fallbackChain.slice(startIndex), ...fallbackChain.slice(0, startIndex)]
    : fallbackChain;
  
  for (const level of orderedLevels) {
    let asset: string | undefined;
    
    switch (level) {
      case AssetQualityLevel.WIKI_DETAILED:
        asset = assetType === "portrait" 
          ? assets.wiki?.portrait 
          : assets.wiki?.fullbody;
        break;
      case AssetQualityLevel.STANDARD_GAMEPLAY:
        asset = assetType === "portrait"
          ? assets.standard?.portrait
          : assets.standard?.thumbnail;
        break;
      case AssetQualityLevel.BATTLE_TOKEN_PC:
      case AssetQualityLevel.BATTLE_TOKEN_NPC:
        asset = assets.tokens?.battle.large;
        break;
    }
    
    if (asset) return asset;
  }
  
  return null;
}

/**
 * Fetch character visual assets from the API
 */
export async function fetchCharacterAssets(
  characterId: string
): Promise<CharacterVisualAssets | null> {
  try {
    const response = await fetch(`/api/v1/characters/${characterId}/assets`);
    if (!response.ok) {
      console.error(`Failed to fetch assets for character ${characterId}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching character assets:`, error);
    return null;
  }
}

/**
 * Request wiki art generation for a character
 */
export async function requestWikiArtGeneration(
  characterId: string,
  variants: string[] = ["portrait", "fullbody", "expressions"]
): Promise<{ jobId: string; estimatedTime: number } | null> {
  try {
    const response = await fetch(`/api/v1/characters/${characterId}/generate-wiki-art`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variants, priority: "normal" }),
    });
    
    if (!response.ok) {
      console.error(`Failed to request wiki art generation`);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error requesting wiki art generation:`, error);
    return null;
  }
}

/**
 * Request battle token generation for a character
 */
export async function requestTokenGeneration(
  characterId: string,
  sizes: TokenSize[] = ["large", "medium", "small"],
  frameStyle: "gold" | "silver" | "bronze" | "iron" = "gold"
): Promise<Record<TokenSize, string> | null> {
  try {
    const response = await fetch(`/api/v1/characters/${characterId}/generate-tokens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sizes, frame_style: frameStyle }),
    });
    
    if (!response.ok) {
      console.error(`Failed to request token generation`);
      return null;
    }
    
    const result = await response.json();
    return result.tokens;
  } catch (error) {
    console.error(`Error requesting token generation:`, error);
    return null;
  }
}

/**
 * Request ASCII art generation for a character
 */
export async function requestAsciiGeneration(
  characterId: string,
  poses: string[] = ["idle", "attack", "defend"],
  style: "detailed" | "simple" = "detailed"
): Promise<Record<string, string> | null> {
  try {
    const response = await fetch(`/api/v1/characters/${characterId}/generate-ascii`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ poses, style }),
    });
    
    if (!response.ok) {
      console.error(`Failed to request ASCII generation`);
      return null;
    }
    
    const result = await response.json();
    return result.ascii_assets;
  } catch (error) {
    console.error(`Error requesting ASCII generation:`, error);
    return null;
  }
}
