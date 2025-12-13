/**
 * Map Data
 * 
 * Sample data for the dynamic layered map system based on Three Kingdoms geography
 */

import { MapLocation, MapRegion, MapRoad, MapLayer } from './types';

// ============================================
// WORLD MAP DATA (Largest Layer)
// ============================================

export const worldMapLocations: MapLocation[] = [
  // Wei Territory (Northern China)
  {
    id: 'luoyang',
    name: 'Luoyang',
    nameCjk: '洛阳',
    type: 'capital',
    faction: 'wei',
    position: { x: 52, y: 38 },
    level: 5,
    population: 500000,
    description: 'The ancient capital of the Han Dynasty, now seat of Wei power.',
    childLocations: ['luoyang-palace', 'luoyang-market', 'luoyang-garrison'],
  },
  {
    id: 'xuchang',
    name: 'Xuchang',
    nameCjk: '许昌',
    type: 'city',
    faction: 'wei',
    position: { x: 58, y: 42 },
    level: 4,
    population: 200000,
    description: 'The political center where Cao Cao held the Emperor.',
    childLocations: ['xuchang-palace', 'xuchang-barracks'],
  },
  {
    id: 'changan',
    name: "Chang'an",
    nameCjk: '长安',
    type: 'capital',
    faction: 'wei',
    position: { x: 35, y: 35 },
    level: 5,
    population: 400000,
    description: 'The ancient capital of the Western Han, gateway to the west.',
    childLocations: ['changan-palace', 'changan-market'],
  },
  {
    id: 'ye',
    name: 'Ye',
    nameCjk: '邺',
    type: 'city',
    faction: 'wei',
    position: { x: 55, y: 28 },
    level: 4,
    population: 180000,
    description: "Cao Cao's base of operations and military headquarters.",
  },
  {
    id: 'jingzhou-north',
    name: 'Fancheng',
    nameCjk: '樊城',
    type: 'fort',
    faction: 'wei',
    position: { x: 50, y: 55 },
    level: 3,
    population: 50000,
    description: 'Strategic fortress guarding the northern approach to Jingzhou.',
  },

  // Shu Territory (Western China / Sichuan)
  {
    id: 'chengdu',
    name: 'Chengdu',
    nameCjk: '成都',
    type: 'capital',
    faction: 'shu',
    position: { x: 25, y: 55 },
    level: 5,
    population: 350000,
    description: 'Capital of Shu Han, the Land of Abundance.',
    childLocations: ['chengdu-palace', 'chengdu-academy', 'chengdu-market'],
  },
  {
    id: 'hanzhong',
    name: 'Hanzhong',
    nameCjk: '汉中',
    type: 'city',
    faction: 'shu',
    position: { x: 30, y: 45 },
    level: 4,
    population: 120000,
    description: 'The northern gateway to Shu, heavily fortified.',
  },
  {
    id: 'jiameng',
    name: 'Jiameng Pass',
    nameCjk: '剑门关',
    type: 'fort',
    faction: 'shu',
    position: { x: 28, y: 50 },
    level: 3,
    population: 20000,
    description: 'The impregnable pass protecting Chengdu.',
  },
  {
    id: 'baidi',
    name: 'Baidicheng',
    nameCjk: '白帝城',
    type: 'city',
    faction: 'shu',
    position: { x: 35, y: 58 },
    level: 3,
    population: 40000,
    description: 'Fortress city where Liu Bei passed, gateway to the Yangtze.',
  },

  // Wu Territory (Eastern/Southern China)
  {
    id: 'jianye',
    name: 'Jianye',
    nameCjk: '建业',
    type: 'capital',
    faction: 'wu',
    position: { x: 72, y: 52 },
    level: 5,
    population: 300000,
    description: 'Capital of Wu, later known as Nanjing.',
    childLocations: ['jianye-palace', 'jianye-harbor', 'jianye-market'],
  },
  {
    id: 'wuchang',
    name: 'Wuchang',
    nameCjk: '武昌',
    type: 'city',
    faction: 'wu',
    position: { x: 58, y: 58 },
    level: 4,
    population: 150000,
    description: 'Major city on the Yangtze, naval headquarters.',
  },
  {
    id: 'jiangxia',
    name: 'Jiangxia',
    nameCjk: '江夏',
    type: 'city',
    faction: 'wu',
    position: { x: 55, y: 62 },
    level: 3,
    population: 80000,
    description: 'Strategic city controlling the middle Yangtze.',
  },
  {
    id: 'lujiang',
    name: 'Lujiang',
    nameCjk: '庐江',
    type: 'city',
    faction: 'wu',
    position: { x: 68, y: 55 },
    level: 3,
    population: 60000,
    description: 'Important city in the Wu heartland.',
  },
  {
    id: 'panyu',
    name: 'Panyu',
    nameCjk: '番禺',
    type: 'city',
    faction: 'wu',
    position: { x: 65, y: 78 },
    level: 3,
    population: 100000,
    description: 'Southern port city, gateway to the sea.',
  },

  // Contested/Neutral Territories
  {
    id: 'nanyang',
    name: 'Nanyang',
    nameCjk: '南阳',
    type: 'city',
    faction: 'neutral',
    position: { x: 48, y: 50 },
    level: 3,
    population: 100000,
    description: 'Strategic crossroads, often contested between factions.',
  },
  {
    id: 'xiangyang',
    name: 'Xiangyang',
    nameCjk: '襄阳',
    type: 'fort',
    faction: 'neutral',
    position: { x: 50, y: 52 },
    level: 4,
    population: 80000,
    description: 'Mighty fortress city, key to controlling Jingzhou.',
  },
  {
    id: 'jingzhou',
    name: 'Jingzhou',
    nameCjk: '荆州',
    type: 'city',
    faction: 'contested',
    position: { x: 52, y: 60 },
    level: 4,
    population: 120000,
    description: 'The most contested region, claimed by all three kingdoms.',
  },
];

export const worldMapRegions: MapRegion[] = [
  {
    id: 'region-wei',
    name: 'Wei Territory',
    nameCjk: '魏国',
    faction: 'wei',
    bounds: { x1: 30, y1: 15, x2: 75, y2: 48 },
    locations: ['luoyang', 'xuchang', 'changan', 'ye', 'jingzhou-north'],
    color: 'rgba(196, 30, 58, 0.15)',
  },
  {
    id: 'region-shu',
    name: 'Shu Territory',
    nameCjk: '蜀国',
    faction: 'shu',
    bounds: { x1: 15, y1: 40, x2: 40, y2: 70 },
    locations: ['chengdu', 'hanzhong', 'jiameng', 'baidi'],
    color: 'rgba(0, 168, 107, 0.15)',
  },
  {
    id: 'region-wu',
    name: 'Wu Territory',
    nameCjk: '吴国',
    faction: 'wu',
    bounds: { x1: 55, y1: 48, x2: 85, y2: 85 },
    locations: ['jianye', 'wuchang', 'jiangxia', 'lujiang', 'panyu'],
    color: 'rgba(65, 105, 225, 0.15)',
  },
  {
    id: 'region-contested',
    name: 'Contested Lands',
    nameCjk: '争夺之地',
    faction: 'contested',
    bounds: { x1: 40, y1: 48, x2: 58, y2: 68 },
    locations: ['nanyang', 'xiangyang', 'jingzhou'],
    color: 'rgba(218, 165, 32, 0.15)',
  },
];

export const worldMapRoads: MapRoad[] = [
  // Wei internal roads
  { id: 'road-luoyang-xuchang', from: 'luoyang', to: 'xuchang', type: 'major', controlledBy: 'wei' },
  { id: 'road-luoyang-changan', from: 'luoyang', to: 'changan', type: 'major', controlledBy: 'wei' },
  { id: 'road-luoyang-ye', from: 'luoyang', to: 'ye', type: 'major', controlledBy: 'wei' },
  { id: 'road-xuchang-fancheng', from: 'xuchang', to: 'jingzhou-north', type: 'minor', controlledBy: 'wei' },
  
  // Shu internal roads
  { id: 'road-chengdu-hanzhong', from: 'chengdu', to: 'hanzhong', type: 'major', controlledBy: 'shu' },
  { id: 'road-chengdu-jiameng', from: 'chengdu', to: 'jiameng', type: 'major', controlledBy: 'shu' },
  { id: 'road-chengdu-baidi', from: 'chengdu', to: 'baidi', type: 'minor', controlledBy: 'shu' },
  
  // Wu internal roads
  { id: 'road-jianye-wuchang', from: 'jianye', to: 'wuchang', type: 'major', controlledBy: 'wu' },
  { id: 'road-wuchang-jiangxia', from: 'wuchang', to: 'jiangxia', type: 'minor', controlledBy: 'wu' },
  { id: 'road-jianye-lujiang', from: 'jianye', to: 'lujiang', type: 'minor', controlledBy: 'wu' },
  
  // Contested roads
  { id: 'road-fancheng-xiangyang', from: 'jingzhou-north', to: 'xiangyang', type: 'major', controlledBy: 'contested' },
  { id: 'road-xiangyang-jingzhou', from: 'xiangyang', to: 'jingzhou', type: 'major', controlledBy: 'contested' },
  { id: 'road-nanyang-xiangyang', from: 'nanyang', to: 'xiangyang', type: 'minor', controlledBy: 'neutral' },
  { id: 'road-jingzhou-jiangxia', from: 'jingzhou', to: 'jiangxia', type: 'minor', controlledBy: 'contested' },
  { id: 'road-baidi-jingzhou', from: 'baidi', to: 'jingzhou', type: 'minor', controlledBy: 'contested' },
  
  // Rivers
  { id: 'river-yellow', from: 'changan', to: 'luoyang', type: 'river' },
  { id: 'river-yangtze-west', from: 'baidi', to: 'jingzhou', type: 'river' },
  { id: 'river-yangtze-east', from: 'jingzhou', to: 'jianye', type: 'river' },
];

// ============================================
// REGIONAL MAP DATA (Chengdu Region Example)
// ============================================

export const chengduRegionLocations: MapLocation[] = [
  {
    id: 'chengdu-palace',
    name: 'Imperial Palace',
    nameCjk: '皇宫',
    type: 'capital',
    faction: 'shu',
    position: { x: 50, y: 35 },
    level: 5,
    parentLocation: 'chengdu',
    description: 'The seat of the Shu Han government.',
  },
  {
    id: 'chengdu-academy',
    name: 'Academy',
    nameCjk: '学院',
    type: 'landmark',
    faction: 'shu',
    position: { x: 35, y: 45 },
    level: 3,
    parentLocation: 'chengdu',
    description: 'Center of learning and cultivation.',
  },
  {
    id: 'chengdu-market',
    name: 'Grand Market',
    nameCjk: '集市',
    type: 'city',
    faction: 'shu',
    position: { x: 60, y: 55 },
    level: 4,
    parentLocation: 'chengdu',
    description: 'The bustling commercial heart of Chengdu.',
  },
  {
    id: 'chengdu-barracks',
    name: 'Military Barracks',
    nameCjk: '军营',
    type: 'fort',
    faction: 'shu',
    position: { x: 70, y: 40 },
    level: 3,
    parentLocation: 'chengdu',
    description: 'Training grounds for the Shu army.',
  },
  {
    id: 'chengdu-temple',
    name: 'Temple of the Five Emperors',
    nameCjk: '五帝庙',
    type: 'landmark',
    faction: 'shu',
    position: { x: 25, y: 60 },
    level: 2,
    parentLocation: 'chengdu',
    description: 'Ancient temple for worship and meditation.',
  },
  {
    id: 'chengdu-farms',
    name: 'Fertile Fields',
    nameCjk: '良田',
    type: 'village',
    faction: 'shu',
    position: { x: 45, y: 75 },
    level: 2,
    parentLocation: 'chengdu',
    description: 'Rich farmland producing grain for the city.',
  },
];

// ============================================
// COMPLETE MAP LAYERS
// ============================================

export const worldMapLayer: MapLayer = {
  level: 'world',
  name: 'Three Kingdoms',
  nameCjk: '三国',
  locations: worldMapLocations,
  regions: worldMapRegions,
  roads: worldMapRoads,
};

export const chengduRegionalLayer: MapLayer = {
  level: 'regional',
  name: 'Chengdu Region',
  nameCjk: '成都郡',
  locations: chengduRegionLocations,
  focusLocationId: 'chengdu',
};

// Map layer registry for navigation
export const mapLayers: Record<string, MapLayer> = {
  world: worldMapLayer,
  'regional-chengdu': chengduRegionalLayer,
};

// Get child layer for a location
export function getChildLayer(locationId: string): MapLayer | null {
  const location = worldMapLocations.find(l => l.id === locationId);
  if (!location?.childLocations) return null;
  
  const layerKey = `regional-${locationId}`;
  return mapLayers[layerKey] || null;
}

// Get parent layer for a location
export function getParentLayer(locationId: string): MapLayer | null {
  // Find the location in any regional layer
  for (const [key, layer] of Object.entries(mapLayers)) {
    if (key === 'world') continue;
    const location = layer.locations.find(l => l.id === locationId);
    if (location?.parentLocation) {
      return worldMapLayer;
    }
  }
  return null;
}
