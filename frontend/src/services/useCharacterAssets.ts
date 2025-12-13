/**
 * useCharacterAssets Hook
 * 
 * React hook for managing character visual assets with automatic
 * detection of missing assets and fallback generation.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  CharacterAssetData,
  getCharacterWithAssets,
  getAllCharactersWithAssets,
  getCharacterPortrait,
  getMissingAssetCharacters,
  clearAssetCache,
  generateFallbackSvg,
  prefillCharacterData,
  CHARACTER_DATABASE,
} from './characterAssetService';

export interface UseCharacterAssetsResult {
  // Single character
  character: CharacterAssetData | null;
  portrait: string | null;
  isLoading: boolean;
  error: string | null;
  // Actions
  refresh: () => void;
}

export interface UseAllCharacterAssetsResult {
  characters: CharacterAssetData[];
  missingAssets: CharacterAssetData[];
  isLoading: boolean;
  error: string | null;
  // Actions
  refresh: () => void;
  getPortrait: (characterId: string) => string;
}

/**
 * Hook for getting a single character's assets
 */
export function useCharacterAssets(characterId: string | null): UseCharacterAssetsResult {
  const [character, setCharacter] = useState<CharacterAssetData | null>(null);
  const [portrait, setPortrait] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAssets = useCallback(async () => {
    if (!characterId) {
      setCharacter(null);
      setPortrait(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [charData, portraitUrl] = await Promise.all([
        getCharacterWithAssets(characterId),
        getCharacterPortrait(characterId),
      ]);

      setCharacter(charData);
      setPortrait(portraitUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load character assets');
      
      // Try to use prefilled data with fallback
      const prefilled = prefillCharacterData(characterId);
      if (prefilled) {
        const fallbackChar: CharacterAssetData = {
          ...prefilled as CharacterAssetData,
          hasPortrait: false,
          hasBust: false,
          hasThumbnail: false,
        };
        setCharacter(fallbackChar);
        setPortrait(generateFallbackSvg(fallbackChar));
      }
    } finally {
      setIsLoading(false);
    }
  }, [characterId]);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  const refresh = useCallback(() => {
    clearAssetCache();
    loadAssets();
  }, [loadAssets]);

  return { character, portrait, isLoading, error, refresh };
}

/**
 * Hook for getting all characters with their asset status
 */
export function useAllCharacterAssets(): UseAllCharacterAssetsResult {
  const [characters, setCharacters] = useState<CharacterAssetData[]>([]);
  const [missingAssets, setMissingAssets] = useState<CharacterAssetData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cache for portraits
  const [portraitCache, setPortraitCache] = useState<Record<string, string>>({});

  const loadAllAssets = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [allChars, missing] = await Promise.all([
        getAllCharactersWithAssets(),
        getMissingAssetCharacters(),
      ]);

      setCharacters(allChars);
      setMissingAssets(missing);

      // Pre-cache portraits for missing characters
      const newCache: Record<string, string> = {};
      for (const char of missing) {
        newCache[char.id] = generateFallbackSvg(char);
      }
      setPortraitCache(prev => ({ ...prev, ...newCache }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load character assets');
      
      // Fallback to database entries
      const fallbackChars: CharacterAssetData[] = Object.values(CHARACTER_DATABASE).map(c => ({
        ...c,
        hasPortrait: false,
        hasBust: false,
        hasThumbnail: false,
      }));
      setCharacters(fallbackChars);
      setMissingAssets(fallbackChars);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllAssets();
  }, [loadAllAssets]);

  const refresh = useCallback(() => {
    clearAssetCache();
    setPortraitCache({});
    loadAllAssets();
  }, [loadAllAssets]);

  const getPortrait = useCallback((characterId: string): string => {
    // Check cache first
    if (portraitCache[characterId]) {
      return portraitCache[characterId];
    }

    // Find character
    const char = characters.find(c => c.id === characterId);
    if (char) {
      if (char.portraitUrl) return char.portraitUrl;
      if (char.bustUrl) return char.bustUrl;
      if (char.thumbnailUrl) return char.thumbnailUrl;
      
      // Generate and cache fallback
      const fallback = generateFallbackSvg(char);
      setPortraitCache(prev => ({ ...prev, [characterId]: fallback }));
      return fallback;
    }

    // Character not found, generate generic fallback
    const prefilled = prefillCharacterData(characterId);
    if (prefilled) {
      const fallbackChar: CharacterAssetData = {
        ...prefilled as CharacterAssetData,
        hasPortrait: false,
        hasBust: false,
        hasThumbnail: false,
      };
      const fallback = generateFallbackSvg(fallbackChar);
      setPortraitCache(prev => ({ ...prev, [characterId]: fallback }));
      return fallback;
    }

    // Last resort
    return '';
  }, [characters, portraitCache]);

  return { characters, missingAssets, isLoading, error, refresh, getPortrait };
}

/**
 * Hook for checking if assets need generation
 */
export function useAssetGenerationStatus(): {
  needsGeneration: boolean;
  missingCount: number;
  missingIds: string[];
  isChecking: boolean;
} {
  const { missingAssets, isLoading } = useAllCharacterAssets();

  return {
    needsGeneration: missingAssets.length > 0,
    missingCount: missingAssets.length,
    missingIds: missingAssets.map(c => c.id),
    isChecking: isLoading,
  };
}

export default useCharacterAssets;
