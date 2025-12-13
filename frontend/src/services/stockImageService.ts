/**
 * Stock Image Service
 * 
 * Frontend service for fetching and managing stock images from the backend.
 * Provides integration with ComfyUI pipelines for asset generation.
 */

const API_BASE = 'http://localhost:8000/api/v1/stock-images';

// ============================================
// Types
// ============================================

export interface StockAsset {
  id: string;
  name: string;
  filename: string;
  tags: string[];
  style: string;
  dimensions: { width: number; height: number };
  placeholder?: boolean;
  description?: string;
}

export interface CategoryInfo {
  id: string;
  description: string;
  subcategories: string[];
  asset_count: number;
}

export interface AssetSearchResult {
  asset: StockAsset;
  category: string;
  subcategory: string;
  url: string;
}

export interface PlaceholderOptions {
  type: 'character' | 'background' | 'item' | 'effect' | 'ui';
  width?: number;
  height?: number;
  label?: string;
  style?: string;
  colorScheme?: 'default' | 'violence' | 'influence' | 'revelation';
}

export interface GenerateOptions {
  category: string;
  subcategory: string;
  prompt: string;
  style?: string;
  seed?: number;
  width?: number;
  height?: number;
}

export interface StockImageStats {
  version: string;
  last_updated: string;
  total_assets: number;
  placeholder_count: number;
  generated_count: number;
  categories: Record<string, { total: number; subcategories: number }>;
}

// ============================================
// API Functions
// ============================================

/**
 * List all available categories
 */
export async function getCategories(): Promise<CategoryInfo[]> {
  const response = await fetch(`${API_BASE}/categories`);
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }
  const data = await response.json();
  return data.categories;
}

/**
 * List assets in a category/subcategory
 */
export async function listAssets(
  category: string,
  subcategory: string
): Promise<{ description: string; assets: StockAsset[] }> {
  const response = await fetch(`${API_BASE}/list/${category}/${subcategory}`);
  if (!response.ok) {
    throw new Error(`Failed to list assets: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Get detailed info about a specific asset
 */
export async function getAssetInfo(assetId: string): Promise<AssetSearchResult> {
  const response = await fetch(`${API_BASE}/info/${assetId}`);
  if (!response.ok) {
    throw new Error(`Failed to get asset info: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Get a random asset from a category
 */
export async function getRandomAsset(
  category: string,
  subcategory: string,
  tags?: string[]
): Promise<AssetSearchResult> {
  const params = new URLSearchParams();
  if (tags && tags.length > 0) {
    params.set('tags', tags.join(','));
  }
  
  const url = `${API_BASE}/random/${category}/${subcategory}${params.toString() ? '?' + params : ''}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to get random asset: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Get the URL for a stock image file
 */
export function getStockImageUrl(category: string, subcategory: string, filename: string): string {
  return `${API_BASE}/file/${category}/${subcategory}/${filename}`;
}

/**
 * Generate a placeholder SVG
 */
export async function generatePlaceholder(options: PlaceholderOptions): Promise<string> {
  const response = await fetch(`${API_BASE}/generate-placeholder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: options.type,
      width: options.width || 512,
      height: options.height || 768,
      label: options.label,
      style: options.style || 'xianxia',
      color_scheme: options.colorScheme || 'default',
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to generate placeholder: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.svg;
}

/**
 * Convert placeholder SVG to data URL for use in img tags
 */
export function svgToDataUrl(svg: string): string {
  const encoded = encodeURIComponent(svg);
  return `data:image/svg+xml,${encoded}`;
}

/**
 * Generate placeholder as data URL directly
 */
export async function getPlaceholderDataUrl(options: PlaceholderOptions): Promise<string> {
  const svg = await generatePlaceholder(options);
  return svgToDataUrl(svg);
}

/**
 * Queue a new stock image generation via ComfyUI
 */
export async function generateStockImage(options: GenerateOptions): Promise<{
  success: boolean;
  job_id?: string;
  message: string;
  estimated_time?: number;
}> {
  const response = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to generate stock image: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Search for assets by name, tags, or description
 */
export async function searchAssets(
  query: string,
  category?: string,
  limit?: number
): Promise<AssetSearchResult[]> {
  const params = new URLSearchParams({ q: query });
  if (category) params.set('category', category);
  if (limit) params.set('limit', limit.toString());
  
  const response = await fetch(`${API_BASE}/search?${params}`);
  if (!response.ok) {
    throw new Error(`Failed to search assets: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.results;
}

/**
 * Get all available tags
 */
export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const response = await fetch(`${API_BASE}/tags`);
  if (!response.ok) {
    throw new Error(`Failed to get tags: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.tags;
}

/**
 * Get stock image library statistics
 */
export async function getStats(): Promise<StockImageStats> {
  const response = await fetch(`${API_BASE}/stats`);
  if (!response.ok) {
    throw new Error(`Failed to get stats: ${response.statusText}`);
  }
  return response.json();
}

// ============================================
// Convenience Functions
// ============================================

/**
 * Get a character portrait (placeholder or actual)
 */
export async function getCharacterPortrait(
  type: 'cultivator' | 'npc' | 'advisor' = 'cultivator',
  tags?: string[]
): Promise<string> {
  try {
    const subcategoryMap = {
      cultivator: 'cultivators',
      npc: 'npcs',
      advisor: 'advisors',
    };
    
    const result = await getRandomAsset('characters', subcategoryMap[type], tags);
    return getStockImageUrl('characters', subcategoryMap[type], result.asset.filename);
  } catch {
    // Fallback to generated placeholder
    return getPlaceholderDataUrl({
      type: 'character',
      label: type.charAt(0).toUpperCase() + type.slice(1),
    });
  }
}

/**
 * Get a background image
 */
export async function getBackgroundImage(
  type: 'landscape' | 'city' | 'interior' = 'landscape',
  tags?: string[]
): Promise<string> {
  try {
    const subcategoryMap = {
      landscape: 'landscapes',
      city: 'cities',
      interior: 'interiors',
    };
    
    const result = await getRandomAsset('backgrounds', subcategoryMap[type], tags);
    return getStockImageUrl('backgrounds', subcategoryMap[type], result.asset.filename);
  } catch {
    return getPlaceholderDataUrl({
      type: 'background',
      width: 1920,
      height: 1080,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    });
  }
}

/**
 * Get Zhou Xu advisor portrait
 */
export async function getZhouXuPortrait(): Promise<string> {
  try {
    const result = await getAssetInfo('advisor-zhou-xu-01');
    return result.url;
  } catch {
    return getPlaceholderDataUrl({
      type: 'character',
      label: 'Zhou Xu',
      colorScheme: 'influence',
    });
  }
}

/**
 * Get a qi aura effect based on pillar
 */
export async function getQiAura(
  pillar: 'violence' | 'influence' | 'revelation'
): Promise<string> {
  try {
    const result = await getAssetInfo(`aura-${pillar}-01`);
    return result.url;
  } catch {
    return getPlaceholderDataUrl({
      type: 'effect',
      width: 256,
      height: 256,
      label: `${pillar} Aura`,
      colorScheme: pillar,
    });
  }
}
