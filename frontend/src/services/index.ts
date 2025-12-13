/**
 * Services Index
 * 
 * Exports all frontend services for the WuXuxian TTRPG webapp.
 */

// Character Asset Service
export {
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
} from './characterAssetService';

export type {
  AssetType,
  AssetFormat,
  CharacterAssetData,
} from './characterAssetService';

// Character Asset Hooks
export {
  useCharacterAssets,
  useAllCharacterAssets,
  useAssetGenerationStatus,
} from './useCharacterAssets';

export type {
  UseCharacterAssetsResult,
  UseAllCharacterAssetsResult,
} from './useCharacterAssets';
