import { AsciiAsset, loadAssetFromDisk as loadAssetFromDiskOriginal } from './generator';

/**
 * LRU Cache for ASCII assets
 */
class AssetCache {
  private cache: Map<string, { asset: AsciiAsset; timestamp: number }> = new Map();
  private maxSize: number;
  private hits: number = 0;
  private misses: number = 0;

  constructor(maxSize: number = 50) {
    this.maxSize = maxSize;
  }

  /**
   * Get an asset from cache
   */
  get(name: string): AsciiAsset | null {
    const entry = this.cache.get(name);
    if (entry) {
      // Update timestamp (LRU)
      entry.timestamp = Date.now();
      this.hits++;
      return entry.asset;
    }
    this.misses++;
    return null;
  }

  /**
   * Store an asset in cache
   */
  set(name: string, asset: AsciiAsset): void {
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    this.cache.set(name, {
      asset,
      timestamp: Date.now(),
    });
  }

  /**
   * Evict the least recently used asset
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Clear the entire cache
   */
  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; hits: number; misses: number; hitRate: number } {
    const total = this.hits + this.misses;
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? this.hits / total : 0,
    };
  }

  /**
   * Preload common assets into cache
   */
  async preload(assetNames: string[]): Promise<void> {
    for (const name of assetNames) {
      try {
        const asset = await loadAssetFromDiskOriginal(name);
        this.set(name, asset);
      } catch (err) {
        console.warn(`Failed to preload asset '${name}':`, err);
      }
    }
  }
}

// Global cache instance
const globalCache = new AssetCache(50);

/**
 * Load an asset with caching
 * 
 * @param name - Name of the asset
 * @param useCache - Whether to use cache (default: true)
 * @returns Promise resolving to the asset
 */
export async function loadAssetFromDisk(name: string, useCache: boolean = true): Promise<AsciiAsset> {
  if (useCache) {
    const cached = globalCache.get(name);
    if (cached) {
      return cached;
    }
  }

  const asset = await loadAssetFromDiskOriginal(name);
  
  if (useCache) {
    globalCache.set(name, asset);
  }

  return asset;
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return globalCache.getStats();
}

/**
 * Clear the asset cache
 */
export function clearCache() {
  globalCache.clear();
}

/**
 * Preload common assets
 */
export async function preloadCommonAssets() {
  const commonAssets = [
    'forest',
    'cave',
    'temple',
    'ocean',
    'man',
    'woman',
    'cultivator',
    'elder',
    'guardian',
    'sparkles',
    'energy',
    'smoke',
  ];

  await globalCache.preload(commonAssets);
  console.log(`Preloaded ${commonAssets.length} common assets into cache`);
}
