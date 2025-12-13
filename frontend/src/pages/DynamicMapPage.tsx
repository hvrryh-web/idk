/**
 * DynamicMapPage - Showcase page for the dynamic layered map system
 * 
 * Displays the full-featured LayeredMap component with all controls.
 */

import { useState, useCallback } from 'react';
import { LayeredMap, MapLocation, MapLayerLevel } from '../components/map';
import { Panel9Slice, ROTKButton, ResourceHUD } from '../components/rotk';
import { Map, Info, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/rotkTheme.css';

const resources = [
  { id: 'gold', icon: '💰', value: 25000, label: 'Gold' },
  { id: 'grain', icon: '🌾', value: 18000, label: 'Grain' },
  { id: 'troops', icon: '⚔️', value: 45000, label: 'Troops' },
];

export function DynamicMapPage() {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [currentLayer, setCurrentLayer] = useState<MapLayerLevel>('world');
  const [showInfo, setShowInfo] = useState(true);

  const handleLocationSelect = useCallback((location: MapLocation) => {
    setSelectedLocation(location);
  }, []);

  const handleLayerChange = useCallback((layer: MapLayerLevel, _focusId?: string) => {
    setCurrentLayer(layer);
    setSelectedLocation(null);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#1A1A1A',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Resource HUD */}
      <ResourceHUD
        year={220}
        season="spring"
        actionPoints={{ current: 4, max: 5 }}
        resources={resources}
        onSettingsClick={() => console.log('Settings clicked')}
        onMenuClick={() => navigate('/')}
      />

      {/* Main Map Area */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          padding: '1rem',
          boxSizing: 'border-box',
        }}
      >
        <LayeredMap
          initialLayer="world"
          onLocationSelect={handleLocationSelect}
          onLayerChange={handleLayerChange}
          showControls={true}
          showLegend={true}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '8px',
            border: '3px solid #CD7F32',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        />

        {/* Back Button */}
        <ROTKButton
          variant="secondary"
          size="small"
          icon={ArrowLeft}
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            zIndex: 30,
          }}
        >
          Back
        </ROTKButton>

        {/* Info Toggle */}
        <ROTKButton
          variant={showInfo ? 'gold' : 'secondary'}
          size="small"
          icon={Info}
          onClick={() => setShowInfo(!showInfo)}
          style={{
            position: 'absolute',
            bottom: 24,
            right: 320,
            zIndex: 30,
          }}
        >
          {showInfo ? 'Hide Info' : 'Show Info'}
        </ROTKButton>

        {/* Info Panel */}
        {showInfo && (
          <Panel9Slice
            variant="parchment"
            style={{
              position: 'absolute',
              top: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              maxWidth: 500,
              zIndex: 25,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Map size={20} color="#8B0000" />
              <h2
                style={{
                  fontFamily: '"Cinzel", Georgia, serif',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#8B0000',
                  margin: 0,
                  textTransform: 'uppercase',
                }}
              >
                Dynamic Layered Map System
              </h2>
            </div>
            <p
              style={{
                fontSize: '0.75rem',
                lineHeight: 1.5,
                color: '#424242',
                margin: 0,
              }}
            >
              <strong>Click</strong> on a location to select it. <strong>Double-click</strong> to zoom into locations with sub-areas.
              Use the controls on the right to zoom, toggle layers, and reset the view.
              Currently viewing: <strong>{currentLayer.charAt(0).toUpperCase() + currentLayer.slice(1)} Map</strong>
              {selectedLocation && (
                <> | Selected: <strong>{selectedLocation.nameCjk || selectedLocation.name}</strong></>
              )}
            </p>
          </Panel9Slice>
        )}
      </div>

      {/* Scene Label */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          padding: '0.5rem 1rem',
          background: 'rgba(26, 26, 26, 0.9)',
          border: '1px solid #CD7F32',
          borderRadius: '4px',
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: '"Cinzel", Georgia, serif',
            fontSize: '0.75rem',
            color: '#D4AF37',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Dynamic Map Demo
        </span>
      </div>
    </div>
  );
}

export default DynamicMapPage;
