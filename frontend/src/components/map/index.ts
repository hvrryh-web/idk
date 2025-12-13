/**
 * Map Components Index
 * 
 * Dynamic layered map system for the WuXuxian TTRPG webapp.
 */

// Main component
export { LayeredMap } from './LayeredMap';
export type { LayeredMapProps } from './LayeredMap';

// Types
export type {
  MapLayerLevel,
  MapLocation,
  MapRegion,
  MapRoad,
  MapLayer,
  MapViewState,
  MapNavigationEvent,
} from './types';

export {
  FACTION_COLORS,
  LOCATION_TYPES,
  MAP_LAYER_CONFIG,
} from './types';

// Data
export {
  worldMapLayer,
  chengduRegionalLayer,
  worldMapLocations,
  worldMapRegions,
  worldMapRoads,
  mapLayers,
  getChildLayer,
  getParentLayer,
} from './mapData';
