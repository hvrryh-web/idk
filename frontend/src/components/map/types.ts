/**
 * Map Layer Types
 * 
 * Type definitions for the dynamic layered map system
 */

export type MapLayerLevel = 'world' | 'regional' | 'city' | 'tactical';

export interface MapLocation {
  id: string;
  name: string;
  nameCjk?: string;
  type: 'capital' | 'city' | 'fort' | 'village' | 'landmark' | 'camp';
  faction?: 'wei' | 'shu' | 'wu' | 'neutral' | 'player' | 'contested';
  position: { x: number; y: number }; // Percentage-based position
  level?: number; // Development level
  population?: number;
  description?: string;
  childLocations?: string[]; // IDs of locations at the next zoom level
  parentLocation?: string; // ID of parent location at previous zoom level
}

export interface MapRegion {
  id: string;
  name: string;
  nameCjk?: string;
  faction?: 'wei' | 'shu' | 'wu' | 'neutral' | 'contested';
  bounds: { x1: number; y1: number; x2: number; y2: number }; // Percentage-based bounds
  locations: string[]; // IDs of locations in this region
  color?: string;
}

export interface MapRoad {
  id: string;
  from: string; // Location ID
  to: string; // Location ID
  type: 'major' | 'minor' | 'river' | 'trade';
  controlledBy?: 'wei' | 'shu' | 'wu' | 'neutral' | 'contested';
}

export interface MapLayer {
  level: MapLayerLevel;
  name: string;
  nameCjk?: string;
  locations: MapLocation[];
  regions?: MapRegion[];
  roads?: MapRoad[];
  focusLocationId?: string; // When zooming into a specific location
}

export interface MapViewState {
  currentLayer: MapLayerLevel;
  focusLocationId: string | null;
  selectedLocationId: string | null;
  pan: { x: number; y: number };
  zoom: number;
  visibleLayers: {
    terrain: boolean;
    roads: boolean;
    factions: boolean;
    fogOfWar: boolean;
    units: boolean;
  };
}

export interface MapNavigationEvent {
  type: 'zoom-in' | 'zoom-out' | 'select' | 'pan' | 'toggle-layer';
  targetLocationId?: string;
  targetLayer?: MapLayerLevel;
  layerType?: keyof MapViewState['visibleLayers'];
}

// Faction colors for consistent styling
export const FACTION_COLORS = {
  wei: { primary: '#C41E3A', secondary: '#8B0000', name: 'Wei', nameCjk: '魏' },
  shu: { primary: '#00A86B', secondary: '#006B3F', name: 'Shu', nameCjk: '蜀' },
  wu: { primary: '#4169E1', secondary: '#2E5C7B', name: 'Wu', nameCjk: '吴' },
  neutral: { primary: '#757575', secondary: '#424242', name: 'Neutral', nameCjk: '中立' },
  contested: { primary: '#DAA520', secondary: '#B8860B', name: 'Contested', nameCjk: '争夺' },
  player: { primary: '#D4AF37', secondary: '#CD7F32', name: 'Player', nameCjk: '玩家' },
} as const;

// Location type icons and styling
export const LOCATION_TYPES = {
  capital: { icon: '🏯', size: 'large', importance: 5 },
  city: { icon: '🏙️', size: 'medium', importance: 4 },
  fort: { icon: '🏰', size: 'medium', importance: 3 },
  village: { icon: '🏘️', size: 'small', importance: 2 },
  landmark: { icon: '⛩️', size: 'small', importance: 1 },
  camp: { icon: '⛺', size: 'small', importance: 1 },
} as const;

// Map layer configurations
export const MAP_LAYER_CONFIG: Record<MapLayerLevel, {
  name: string;
  nameCjk: string;
  minZoom: number;
  maxZoom: number;
  defaultZoom: number;
}> = {
  world: { name: 'World', nameCjk: '天下', minZoom: 0.5, maxZoom: 2, defaultZoom: 1 },
  regional: { name: 'Region', nameCjk: '州郡', minZoom: 0.8, maxZoom: 3, defaultZoom: 1.5 },
  city: { name: 'City', nameCjk: '城池', minZoom: 1, maxZoom: 4, defaultZoom: 2 },
  tactical: { name: 'Tactical', nameCjk: '战场', minZoom: 1.5, maxZoom: 5, defaultZoom: 2.5 },
};
