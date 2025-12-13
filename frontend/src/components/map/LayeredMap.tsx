/**
 * LayeredMap - Dynamic multi-level map component
 * 
 * Provides zoom navigation between world, regional, city, and tactical map levels.
 * Features faction territories, roads/rivers, location markers, and fog of war.
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  MapLocation,
  MapRegion,
  MapRoad,
  MapLayer,
  MapLayerLevel,
  MapViewState,
  FACTION_COLORS,
  LOCATION_TYPES,
  MAP_LAYER_CONFIG,
} from './types';
import { worldMapLayer, getChildLayer } from './mapData';
import { Panel9Slice, ROTKButton } from '../rotk';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  EyeOff,
  Map,
  Layers,
  Navigation,
} from 'lucide-react';
import '../../styles/rotkTheme.css';

export interface LayeredMapProps {
  initialLayer?: MapLayerLevel;
  onLocationSelect?: (location: MapLocation) => void;
  onLayerChange?: (layer: MapLayerLevel, focusLocationId?: string) => void;
  showControls?: boolean;
  showLegend?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function LayeredMap({
  initialLayer = 'world',
  onLocationSelect,
  onLayerChange,
  showControls = true,
  showLegend = true,
  className = '',
  style = {},
}: LayeredMapProps) {
  // View state
  const [viewState, setViewState] = useState<MapViewState>({
    currentLayer: initialLayer,
    focusLocationId: null,
    selectedLocationId: null,
    pan: { x: 0, y: 0 },
    zoom: MAP_LAYER_CONFIG[initialLayer].defaultZoom,
    visibleLayers: {
      terrain: true,
      roads: true,
      factions: true,
      fogOfWar: false,
      units: true,
    },
  });

  // Current map layer data
  const [currentMapData, setCurrentMapData] = useState<MapLayer>(worldMapLayer);

  // Get layer config
  const layerConfig = MAP_LAYER_CONFIG[viewState.currentLayer];

  // Handle location click
  const handleLocationClick = useCallback((location: MapLocation) => {
    setViewState(prev => ({
      ...prev,
      selectedLocationId: prev.selectedLocationId === location.id ? null : location.id,
    }));
    onLocationSelect?.(location);
  }, [onLocationSelect]);

  // Handle zoom in (drill down to child layer)
  const handleZoomIn = useCallback((locationId?: string) => {
    const targetId = locationId || viewState.selectedLocationId;
    if (!targetId) {
      // Just increase zoom level
      setViewState(prev => ({
        ...prev,
        zoom: Math.min(prev.zoom + 0.5, layerConfig.maxZoom),
      }));
      return;
    }

    // Try to get child layer
    const childLayer = getChildLayer(targetId);
    if (childLayer) {
      const newLayerLevel = childLayer.level;
      setCurrentMapData(childLayer);
      setViewState(prev => ({
        ...prev,
        currentLayer: newLayerLevel,
        focusLocationId: targetId,
        selectedLocationId: null,
        zoom: MAP_LAYER_CONFIG[newLayerLevel].defaultZoom,
      }));
      onLayerChange?.(newLayerLevel, targetId);
    } else {
      // Just increase zoom
      setViewState(prev => ({
        ...prev,
        zoom: Math.min(prev.zoom + 0.5, layerConfig.maxZoom),
      }));
    }
  }, [viewState.selectedLocationId, layerConfig.maxZoom, onLayerChange]);

  // Handle zoom out (go to parent layer)
  const handleZoomOut = useCallback(() => {
    if (viewState.currentLayer !== 'world') {
      // Go back to world map
      setCurrentMapData(worldMapLayer);
      setViewState(prev => ({
        ...prev,
        currentLayer: 'world',
        focusLocationId: null,
        selectedLocationId: null,
        zoom: MAP_LAYER_CONFIG.world.defaultZoom,
      }));
      onLayerChange?.('world');
    } else {
      // Just decrease zoom
      setViewState(prev => ({
        ...prev,
        zoom: Math.max(prev.zoom - 0.5, layerConfig.minZoom),
      }));
    }
  }, [viewState.currentLayer, layerConfig.minZoom, onLayerChange]);

  // Reset view
  const handleResetView = useCallback(() => {
    setCurrentMapData(worldMapLayer);
    setViewState({
      currentLayer: 'world',
      focusLocationId: null,
      selectedLocationId: null,
      pan: { x: 0, y: 0 },
      zoom: MAP_LAYER_CONFIG.world.defaultZoom,
      visibleLayers: {
        terrain: true,
        roads: true,
        factions: true,
        fogOfWar: false,
        units: true,
      },
    });
    onLayerChange?.('world');
  }, [onLayerChange]);

  // Toggle visibility layer
  const toggleVisibleLayer = useCallback((layer: keyof MapViewState['visibleLayers']) => {
    setViewState(prev => ({
      ...prev,
      visibleLayers: {
        ...prev.visibleLayers,
        [layer]: !prev.visibleLayers[layer],
      },
    }));
  }, []);

  // Get selected location data
  const selectedLocation = useMemo(() => {
    if (!viewState.selectedLocationId) return null;
    return currentMapData.locations.find(l => l.id === viewState.selectedLocationId) || null;
  }, [viewState.selectedLocationId, currentMapData.locations]);

  return (
    <div
      className={`layered-map ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 500,
        background: '#1A1A1A',
        borderRadius: '8px',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Map Container */}
      <div
        className="map-viewport"
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
        }}
      >
        {/* Background Layer */}
        <MapBackground layer={viewState.currentLayer} zoom={viewState.zoom} />

        {/* Faction Regions Layer */}
        {viewState.visibleLayers.factions && currentMapData.regions && (
          <RegionsLayer regions={currentMapData.regions} />
        )}

        {/* Roads/Rivers Layer */}
        {viewState.visibleLayers.roads && currentMapData.roads && (
          <RoadsLayer
            roads={currentMapData.roads}
            locations={currentMapData.locations}
          />
        )}

        {/* Fog of War Layer */}
        {viewState.visibleLayers.fogOfWar && (
          <FogOfWarLayer />
        )}

        {/* Locations Layer */}
        <LocationsLayer
          locations={currentMapData.locations}
          selectedId={viewState.selectedLocationId}
          onLocationClick={handleLocationClick}
          onLocationDoubleClick={(loc) => handleZoomIn(loc.id)}
        />
      </div>

      {/* Layer Indicator */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          padding: '0.5rem 1rem',
          background: 'rgba(26, 26, 26, 0.9)',
          border: '2px solid #CD7F32',
          borderRadius: '4px',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Map size={16} color="#D4AF37" />
          <span
            style={{
              fontFamily: '"Noto Serif SC", SimSun, serif',
              fontSize: '1rem',
              fontWeight: 700,
              color: '#D4AF37',
            }}
          >
            {currentMapData.nameCjk}
          </span>
          <span
            style={{
              fontFamily: '"Cinzel", Georgia, serif',
              fontSize: '0.75rem',
              color: '#D4C5A9',
              textTransform: 'uppercase',
            }}
          >
            {currentMapData.name}
          </span>
        </div>
        <div
          style={{
            fontSize: '0.625rem',
            color: '#757575',
            marginTop: '0.25rem',
          }}
        >
          {layerConfig.name} View • Zoom: {(viewState.zoom * 100).toFixed(0)}%
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <div
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            zIndex: 20,
          }}
        >
          <ROTKButton
            variant="secondary"
            size="small"
            icon={ZoomIn}
            onClick={() => handleZoomIn()}
            title="Zoom In"
          >
            +
          </ROTKButton>
          <ROTKButton
            variant="secondary"
            size="small"
            icon={ZoomOut}
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            −
          </ROTKButton>
          <ROTKButton
            variant="secondary"
            size="small"
            icon={Maximize2}
            onClick={handleResetView}
            title="Reset View"
          >
            ⌂
          </ROTKButton>
          <div style={{ height: 8 }} />
          <LayerToggleButton
            icon={<Layers size={14} />}
            label="Factions"
            active={viewState.visibleLayers.factions}
            onClick={() => toggleVisibleLayer('factions')}
          />
          <LayerToggleButton
            icon={<Navigation size={14} />}
            label="Roads"
            active={viewState.visibleLayers.roads}
            onClick={() => toggleVisibleLayer('roads')}
          />
          <LayerToggleButton
            icon={viewState.visibleLayers.fogOfWar ? <Eye size={14} /> : <EyeOff size={14} />}
            label="Fog"
            active={viewState.visibleLayers.fogOfWar}
            onClick={() => toggleVisibleLayer('fogOfWar')}
          />
        </div>
      )}

      {/* Legend */}
      {showLegend && (
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            padding: '0.75rem',
            background: 'rgba(26, 26, 26, 0.9)',
            border: '1px solid #CD7F32',
            borderRadius: '4px',
            zIndex: 20,
          }}
        >
          <h4
            style={{
              fontFamily: '"Cinzel", Georgia, serif',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#D4AF37',
              margin: 0,
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
            }}
          >
            Factions
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {Object.entries(FACTION_COLORS).slice(0, 4).map(([key, value]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: value.primary,
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                />
                <span style={{ fontSize: '0.625rem', color: '#D4C5A9' }}>
                  {value.nameCjk} {value.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Location Panel */}
      {selectedLocation && (
        <Panel9Slice
          variant="lacquer"
          style={{
            position: 'absolute',
            right: 16,
            bottom: 16,
            width: 280,
            zIndex: 25,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3
                style={{
                  fontFamily: '"Noto Serif SC", SimSun, serif',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#D4AF37',
                  margin: 0,
                }}
              >
                {selectedLocation.nameCjk}
              </h3>
              <h4
                style={{
                  fontFamily: '"Cinzel", Georgia, serif',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#FDF6E3',
                  margin: 0,
                  textTransform: 'uppercase',
                }}
              >
                {selectedLocation.name}
              </h4>
            </div>
            <span style={{ fontSize: '1.5rem' }}>
              {LOCATION_TYPES[selectedLocation.type].icon}
            </span>
          </div>

          {selectedLocation.faction && (
            <div
              style={{
                display: 'inline-block',
                marginTop: '0.5rem',
                padding: '0.125rem 0.5rem',
                background: FACTION_COLORS[selectedLocation.faction].primary,
                borderRadius: '2px',
                fontSize: '0.625rem',
                fontWeight: 600,
                color: '#FDF6E3',
                textTransform: 'uppercase',
              }}
            >
              {FACTION_COLORS[selectedLocation.faction].name}
            </div>
          )}

          {selectedLocation.description && (
            <p
              style={{
                fontSize: '0.75rem',
                lineHeight: 1.5,
                color: '#D4C5A9',
                margin: '0.75rem 0 0 0',
              }}
            >
              {selectedLocation.description}
            </p>
          )}

          {selectedLocation.childLocations && selectedLocation.childLocations.length > 0 && (
            <ROTKButton
              variant="gold"
              size="small"
              icon={ZoomIn}
              onClick={() => handleZoomIn(selectedLocation.id)}
              style={{ marginTop: '0.75rem', width: '100%' }}
            >
              Enter {selectedLocation.name}
            </ROTKButton>
          )}
        </Panel9Slice>
      )}
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

// Map background based on layer level
function MapBackground({ layer, zoom }: { layer: MapLayerLevel; zoom: number }) {
  const backgrounds: Record<MapLayerLevel, React.CSSProperties> = {
    world: {
      background: `
        radial-gradient(ellipse at 50% 30%, #a5c4e6 0%, #7a9cc6 30%, #4a6fa5 60%, #2d4a6a 100%)
      `,
    },
    regional: {
      background: `
        linear-gradient(135deg, #D4C5A9 0%, #BEB19A 50%, #A08060 100%)
      `,
    },
    city: {
      background: `
        linear-gradient(180deg, #6a5030 0%, #8a6b4a 30%, #a08060 60%, #c9b18a 100%)
      `,
    },
    tactical: {
      background: `
        linear-gradient(180deg, #2D2D2D 0%, #424242 100%)
      `,
    },
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        ...backgrounds[layer],
        transform: `scale(${zoom})`,
        transformOrigin: 'center center',
        transition: 'transform 300ms ease',
      }}
    >
      {/* Parchment texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

// Faction regions overlay
function RegionsLayer({ regions }: { regions: MapRegion[] }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {regions.map(region => (
        <rect
          key={region.id}
          x={`${region.bounds.x1}%`}
          y={`${region.bounds.y1}%`}
          width={`${region.bounds.x2 - region.bounds.x1}%`}
          height={`${region.bounds.y2 - region.bounds.y1}%`}
          fill={region.color || 'transparent'}
          stroke={FACTION_COLORS[region.faction || 'neutral'].primary}
          strokeWidth={0.3}
          strokeDasharray="2,2"
          opacity={0.6}
        />
      ))}
    </svg>
  );
}

// Roads and rivers overlay
function RoadsLayer({
  roads,
  locations,
}: {
  roads: MapRoad[];
  locations: MapLocation[];
}) {
  const getLocationPos = (id: string) => {
    const loc = locations.find(l => l.id === id);
    return loc ? loc.position : { x: 50, y: 50 };
  };

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {roads.map(road => {
        const from = getLocationPos(road.from);
        const to = getLocationPos(road.to);
        const isRiver = road.type === 'river';
        const color = isRiver
          ? '#4682B4'
          : road.controlledBy
            ? FACTION_COLORS[road.controlledBy].primary
            : '#8B5A2B';
        
        return (
          <line
            key={road.id}
            x1={`${from.x}%`}
            y1={`${from.y}%`}
            x2={`${to.x}%`}
            y2={`${to.y}%`}
            stroke={color}
            strokeWidth={isRiver ? 1.5 : road.type === 'major' ? 0.8 : 0.4}
            strokeDasharray={road.type === 'minor' ? '2,2' : undefined}
            opacity={isRiver ? 0.6 : 0.4}
          />
        );
      })}
    </svg>
  );
}

// Fog of war overlay
function FogOfWarLayer() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(26, 26, 26, 0.7) 100%)
        `,
        pointerEvents: 'none',
      }}
    >
      {/* Animated ink wash effect */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='fog'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02' numOctaves='3' seed='5'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23fog)' opacity='0.4'/%3E%3C/svg%3E")`,
          opacity: 0.5,
          animation: 'rotk-spin-slow 60s linear infinite',
        }}
      />
    </div>
  );
}

// Locations markers layer
function LocationsLayer({
  locations,
  selectedId,
  onLocationClick,
  onLocationDoubleClick,
}: {
  locations: MapLocation[];
  selectedId: string | null;
  onLocationClick: (loc: MapLocation) => void;
  onLocationDoubleClick: (loc: MapLocation) => void;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}
    >
      {locations.map(location => {
        const typeInfo = LOCATION_TYPES[location.type];
        const factionColor = location.faction
          ? FACTION_COLORS[location.faction]
          : FACTION_COLORS.neutral;
        const size = typeInfo.size === 'large' ? 48 : typeInfo.size === 'medium' ? 36 : 28;
        
        return (
          <div
            key={location.id}
            onClick={() => onLocationClick(location)}
            onDoubleClick={() => onLocationDoubleClick(location)}
            style={{
              position: 'absolute',
              left: `${location.position.x}%`,
              top: `${location.position.y}%`,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'auto',
              cursor: 'pointer',
              zIndex: selectedId === location.id ? 100 : typeInfo.importance * 10,
            }}
          >
            <div
              style={{
                width: size,
                height: size,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${factionColor.primary} 0%, ${factionColor.secondary} 100%)`,
                border: `3px solid ${selectedId === location.id ? '#D4AF37' : '#CD7F32'}`,
                boxShadow: selectedId === location.id
                  ? '0 0 16px rgba(212, 175, 55, 0.6), 0 4px 12px rgba(0,0,0,0.4)'
                  : '0 2px 8px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: typeInfo.size === 'large' ? '1.5rem' : typeInfo.size === 'medium' ? '1.25rem' : '1rem',
                transition: 'all 200ms ease',
                transform: selectedId === location.id ? 'scale(1.15)' : 'scale(1)',
              }}
            >
              {typeInfo.icon}
            </div>
            
            {/* Location label */}
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: 4,
                padding: '2px 6px',
                background: 'rgba(26, 26, 26, 0.9)',
                border: `1px solid ${factionColor.primary}`,
                borderRadius: 2,
                whiteSpace: 'nowrap',
              }}
            >
              <span
                style={{
                  fontFamily: '"Noto Serif SC", SimSun, serif',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  color: '#FDF6E3',
                }}
              >
                {location.nameCjk || location.name}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Layer toggle button component
function LayerToggleButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={`Toggle ${label}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        border: `2px solid ${active ? '#D4AF37' : '#424242'}`,
        borderRadius: 4,
        background: active
          ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(205, 127, 50, 0.2) 100%)'
          : 'rgba(45, 45, 45, 0.8)',
        color: active ? '#D4AF37' : '#757575',
        cursor: 'pointer',
        transition: 'all 200ms ease',
      }}
    >
      {icon}
    </button>
  );
}

export default LayeredMap;
