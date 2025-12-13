/**
 * CityHubScene - Demo scene with 3D city background, building pins, top HUD, character portrait
 */

import { useState } from 'react';
import {
  ResourceHUD,
  BuildingPin,
  CharacterPortraitOverlay,
  Panel9Slice,
} from '../../components/rotk';
import {
  Home,
  Store,
  Beer,
  Hammer,
  Crown,
  Shield,
  Users,
  Castle,
} from 'lucide-react';
import '../../styles/rotkTheme.css';

const buildings = [
  { id: 'farm', icon: <Home size={24} />, label: 'Farm', level: 3, position: { left: '15%', top: '45%' } },
  { id: 'market', icon: <Store size={24} />, label: 'Market', level: 2, position: { left: '28%', top: '55%' } },
  { id: 'tavern', icon: <Beer size={24} />, label: 'Tavern', level: 1, position: { left: '42%', top: '48%' } },
  { id: 'workshop', icon: <Hammer size={24} />, label: 'Workshop', level: 2, position: { left: '58%', top: '52%' } },
  { id: 'palace', icon: <Crown size={24} />, label: 'Palace', level: 4, position: { left: '50%', top: '30%' } },
  { id: 'garrison', icon: <Shield size={24} />, label: 'Garrison', level: 3, position: { left: '72%', top: '45%' } },
  { id: 'home', icon: <Users size={24} />, label: 'Residence', level: 2, position: { left: '85%', top: '55%' } },
  { id: 'gates', icon: <Castle size={24} />, label: 'City Gates', level: 5, position: { left: '50%', top: '75%' } },
];

const resources = [
  { id: 'gold', icon: '💰', value: 12500, label: 'Gold' },
  { id: 'grain', icon: '🌾', value: 8900, label: 'Grain' },
  { id: 'wood', icon: '🪵', value: 4200, label: 'Wood' },
  { id: 'iron', icon: '⛏️', value: 1800, label: 'Iron' },
];

export function CityHubScene() {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [showDialogue, setShowDialogue] = useState(true);
  
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#1A1A1A',
      }}
    >
      {/* 3D City Background Placeholder */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(180deg, 
              #4a6fa5 0%, 
              #7a9cc6 20%, 
              #a5c4e6 40%, 
              #c9ddf0 60%, 
              #d4c5a9 80%, 
              #bfae8e 100%
            )
          `,
          opacity: 0.8,
        }}
      >
        {/* Stylized mountains/buildings silhouette */}
        <svg
          viewBox="0 0 1920 400"
          preserveAspectRatio="xMidYMax slice"
          style={{
            position: 'absolute',
            bottom: '20%',
            width: '100%',
            height: '50%',
          }}
        >
          {/* Distant mountains */}
          <path
            d="M0 400 L0 250 L200 180 L400 220 L600 150 L800 200 L1000 120 L1200 180 L1400 140 L1600 190 L1800 160 L1920 200 L1920 400 Z"
            fill="#5a7a9e"
            opacity="0.6"
          />
          {/* Mid-ground buildings */}
          <path
            d="M0 400 L0 280 L100 280 L100 250 L150 250 L150 220 L180 220 L180 250 L250 250 L250 280 L350 280 L350 240 L380 240 L380 200 L400 180 L420 200 L420 240 L450 240 L450 280 L600 280 L600 260 L650 260 L650 240 L680 240 L680 220 L720 220 L720 200 L750 180 L780 200 L780 220 L820 220 L820 240 L850 240 L850 260 L900 260 L900 280 L1000 280 L1000 240 L1050 240 L1050 200 L1100 200 L1100 150 L1150 130 L1200 150 L1200 200 L1250 200 L1250 240 L1300 240 L1300 280 L1400 280 L1400 260 L1450 260 L1450 230 L1500 230 L1500 260 L1550 260 L1550 280 L1700 280 L1700 250 L1750 250 L1750 220 L1800 220 L1800 250 L1850 250 L1850 280 L1920 280 L1920 400 Z"
            fill="#3a5272"
            opacity="0.8"
          />
          {/* Foreground city wall */}
          <path
            d="M0 400 L0 320 L100 320 L100 300 L120 300 L120 320 L200 320 L200 300 L220 300 L220 320 L400 320 L400 290 L420 290 L420 320 L600 320 L600 290 L620 290 L620 320 L800 320 L800 290 L820 290 L820 320 L1000 320 L1000 290 L1020 290 L1020 320 L1200 320 L1200 290 L1220 290 L1220 320 L1400 320 L1400 290 L1420 290 L1420 320 L1600 320 L1600 290 L1620 290 L1620 320 L1800 320 L1800 290 L1820 290 L1820 320 L1920 320 L1920 400 Z"
            fill="#2d4a6a"
          />
        </svg>
        
        {/* Ground */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '20%',
            background: 'linear-gradient(180deg, #a08060 0%, #8a6b4a 50%, #6a5030 100%)',
          }}
        />
      </div>
      
      {/* Top Resource HUD */}
      <ResourceHUD
        year={200}
        season="spring"
        actionPoints={{ current: 3, max: 5 }}
        resources={resources}
        onSettingsClick={() => console.log('Settings clicked')}
        onMenuClick={() => console.log('Menu clicked')}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30 }}
      />
      
      {/* Building Pins */}
      {buildings.map(building => (
        <BuildingPin
          key={building.id}
          id={building.id}
          icon={building.icon}
          label={building.label}
          level={building.level}
          position={building.position}
          isSelected={selectedBuilding === building.id}
          onClick={() => {
            setSelectedBuilding(selectedBuilding === building.id ? null : building.id);
            setShowDialogue(true);
          }}
        />
      ))}
      
      {/* Character Portrait Overlay */}
      <CharacterPortraitOverlay
        name="Zhuge Liang"
        nameCjk="诸葛亮"
        title="Prime Minister of Shu"
        dialogue={
          selectedBuilding
            ? `My lord, you have selected the ${buildings.find(b => b.id === selectedBuilding)?.label}. This facility is crucial for our kingdom's prosperity. What would you like to do?`
            : 'Welcome to Chengdu, my lord. Our city flourishes under your wise rule. Select a building to manage your domain.'
        }
        isVisible={showDialogue}
      />
      
      {/* Building Info Panel (when selected) */}
      {selectedBuilding && (
        <Panel9Slice
          variant="parchment"
          style={{
            position: 'absolute',
            right: 20,
            top: 80,
            width: 280,
            zIndex: 25,
          }}
        >
          <h3
            style={{
              fontFamily: '"Cinzel", Georgia, serif',
              fontSize: '1.125rem',
              fontWeight: 700,
              color: '#8B0000',
              margin: 0,
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {buildings.find(b => b.id === selectedBuilding)?.label}
          </h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
            }}
          >
            <span style={{ fontSize: '0.75rem', color: '#424242' }}>Level:</span>
            <span
              style={{
                padding: '0.125rem 0.5rem',
                background: 'linear-gradient(135deg, #D4AF37 0%, #CD7F32 100%)',
                borderRadius: '2px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#1A1A1A',
              }}
            >
              {buildings.find(b => b.id === selectedBuilding)?.level}
            </span>
          </div>
          <p
            style={{
              fontSize: '0.75rem',
              lineHeight: 1.5,
              color: '#424242',
              margin: 0,
            }}
          >
            This building provides essential resources and services for your city.
            Upgrade it to increase production and unlock new capabilities.
          </p>
        </Panel9Slice>
      )}
      
      {/* Scene Title */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          padding: '0.5rem 1rem',
          background: 'rgba(26, 26, 26, 0.8)',
          border: '1px solid #CD7F32',
          borderRadius: '4px',
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
          City Hub Demo
        </span>
      </div>
    </div>
  );
}

export default CityHubScene;
