/**
 * WarCouncilScene - Demo scene with map-table centerpiece, bottom nav bar, map markers
 */

import { useState } from 'react';
import {
  ResourceHUD,
  NavBar,
  MapMarker,
  Panel9Slice,
  NavTab,
} from '../../components/rotk';
import {
  Users,
  Swords,
  Brain,
  Handshake,
  Scroll,
  Eye,
} from 'lucide-react';
import '../../styles/rotkTheme.css';

const navTabs: NavTab[] = [
  { id: 'personnel', label: 'Personnel', labelCjk: '人事', icon: Users },
  { id: 'military', label: 'Military', labelCjk: '军事', icon: Swords },
  { id: 'plots', label: 'Plots', labelCjk: '谋略', icon: Brain },
  { id: 'diplomacy', label: 'Diplomacy', labelCjk: '外交', icon: Handshake },
  { id: 'policy', label: 'Policy', labelCjk: '政策', icon: Scroll },
  { id: 'espionage', label: 'Espionage', labelCjk: '间谍', icon: Eye },
];

const mapMarkers = [
  { id: 'luoyang', label: 'Luoyang', faction: 'red' as const, position: { left: '45%', top: '35%' } },
  { id: 'changan', label: "Chang'an", faction: 'red' as const, position: { left: '30%', top: '40%' } },
  { id: 'xuchang', label: 'Xuchang', faction: 'red' as const, position: { left: '55%', top: '45%' } },
  { id: 'chengdu', label: 'Chengdu', faction: 'green' as const, position: { left: '25%', top: '60%' } },
  { id: 'hanzhong', label: 'Hanzhong', faction: 'green' as const, position: { left: '28%', top: '50%' } },
  { id: 'jianye', label: 'Jianye', faction: 'blue' as const, position: { left: '70%', top: '55%' } },
  { id: 'wuchang', label: 'Wuchang', faction: 'blue' as const, position: { left: '58%', top: '58%' } },
  { id: 'jiangxia', label: 'Jiangxia', faction: 'blue' as const, position: { left: '55%', top: '62%' } },
  { id: 'nanyang', label: 'Nanyang', faction: 'neutral' as const, position: { left: '48%', top: '52%' } },
  { id: 'xiangyang', label: 'Xiangyang', faction: 'neutral' as const, position: { left: '50%', top: '55%' } },
];

const resources = [
  { id: 'gold', icon: '💰', value: 45000, label: 'Gold' },
  { id: 'grain', icon: '🌾', value: 32000, label: 'Grain' },
  { id: 'troops', icon: '⚔️', value: 85000, label: 'Troops' },
];

export function WarCouncilScene() {
  const [activeTab, setActiveTab] = useState('military');
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  
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
        year={208}
        season="autumn"
        actionPoints={{ current: 5, max: 5 }}
        resources={resources}
        onSettingsClick={() => console.log('Settings clicked')}
        onMenuClick={() => console.log('Menu clicked')}
      />
      
      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* War Room Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse at center, #2D2D2D 0%, #1A1A1A 100%)
            `,
          }}
        >
          {/* Decorative lanterns */}
          <div
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              width: 40,
              height: 60,
              background: 'linear-gradient(180deg, #C41E3A 0%, #8B0000 100%)',
              borderRadius: '4px',
              boxShadow: '0 0 20px rgba(196, 30, 58, 0.5)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: 40,
              height: 60,
              background: 'linear-gradient(180deg, #C41E3A 0%, #8B0000 100%)',
              borderRadius: '4px',
              boxShadow: '0 0 20px rgba(196, 30, 58, 0.5)',
            }}
          />
        </div>
        
        {/* Map Table */}
        <div
          style={{
            position: 'relative',
            width: '80%',
            maxWidth: 1000,
            height: '70%',
            background: 'linear-gradient(135deg, #D4C5A9 0%, #BEB19A 100%)',
            border: '8px solid #8B5A2B',
            borderRadius: '8px',
            boxShadow: `
              0 20px 60px rgba(0,0,0,0.5),
              inset 0 0 40px rgba(139, 90, 43, 0.3)
            `,
            overflow: 'hidden',
          }}
        >
          {/* Map texture overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `
                url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")
              `,
              pointerEvents: 'none',
            }}
          />
          
          {/* Compass rose */}
          <svg
            viewBox="0 0 100 100"
            width="60"
            height="60"
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              opacity: 0.6,
            }}
          >
            <circle cx="50" cy="50" r="45" fill="none" stroke="#8B5A2B" strokeWidth="2" />
            <path d="M50 10 L55 45 L50 55 L45 45 Z" fill="#C41E3A" />
            <path d="M50 90 L55 55 L50 45 L45 55 Z" fill="#424242" />
            <path d="M10 50 L45 45 L55 50 L45 55 Z" fill="#424242" />
            <path d="M90 50 L55 45 L45 50 L55 55 Z" fill="#424242" />
            <text x="50" y="8" fontSize="8" fill="#8B5A2B" textAnchor="middle">N</text>
          </svg>
          
          {/* River lines */}
          <svg
            viewBox="0 0 1000 700"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
            }}
          >
            {/* Yellow River */}
            <path
              d="M0 250 Q200 200 400 280 Q600 350 800 300 Q900 270 1000 290"
              fill="none"
              stroke="#4682B4"
              strokeWidth="8"
              opacity="0.4"
            />
            {/* Yangtze River */}
            <path
              d="M0 450 Q200 500 400 420 Q600 350 750 400 Q900 450 1000 420"
              fill="none"
              stroke="#4682B4"
              strokeWidth="10"
              opacity="0.4"
            />
          </svg>
          
          {/* Map Markers */}
          {mapMarkers.map(marker => (
            <MapMarker
              key={marker.id}
              id={marker.id}
              label={marker.label}
              faction={marker.faction}
              position={marker.position}
              isSelected={selectedMarker === marker.id}
              onClick={() => setSelectedMarker(selectedMarker === marker.id ? null : marker.id)}
            />
          ))}
          
          {/* Table edge decoration */}
          <div
            style={{
              position: 'absolute',
              inset: -4,
              border: '4px solid #D4AF37',
              borderRadius: '8px',
              pointerEvents: 'none',
            }}
          />
        </div>
        
        {/* Selected City Info Panel */}
        {selectedMarker && (
          <Panel9Slice
            variant="lacquer"
            style={{
              position: 'absolute',
              right: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 250,
            }}
          >
            <h3
              style={{
                fontFamily: '"Noto Serif SC", SimSun, serif',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#D4AF37',
                margin: 0,
                marginBottom: '0.5rem',
              }}
            >
              {mapMarkers.find(m => m.id === selectedMarker)?.label}
            </h3>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#D4C5A9',
                  textTransform: 'uppercase',
                }}
              >
                Faction:
              </span>
              <span
                style={{
                  padding: '0.125rem 0.5rem',
                  background: mapMarkers.find(m => m.id === selectedMarker)?.faction === 'red'
                    ? '#C41E3A'
                    : mapMarkers.find(m => m.id === selectedMarker)?.faction === 'blue'
                    ? '#4169E1'
                    : mapMarkers.find(m => m.id === selectedMarker)?.faction === 'green'
                    ? '#00A86B'
                    : '#757575',
                  borderRadius: '2px',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  color: '#FDF6E3',
                  textTransform: 'uppercase',
                }}
              >
                {mapMarkers.find(m => m.id === selectedMarker)?.faction}
              </span>
            </div>
            <p
              style={{
                fontSize: '0.75rem',
                lineHeight: 1.5,
                color: '#D4C5A9',
                margin: 0,
              }}
            >
              A strategic location in the central plains. 
              Control of this city provides significant military advantage.
            </p>
          </Panel9Slice>
        )}
        
        {/* Legend */}
        <div
          style={{
            position: 'absolute',
            left: 20,
            bottom: 100,
            padding: '1rem',
            background: 'rgba(26, 26, 26, 0.9)',
            border: '1px solid #CD7F32',
            borderRadius: '4px',
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {[
              { color: '#C41E3A', name: 'Wei' },
              { color: '#00A86B', name: 'Shu' },
              { color: '#4169E1', name: 'Wu' },
              { color: '#757575', name: 'Neutral' },
            ].map(faction => (
              <div key={faction.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: faction.color,
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                />
                <span style={{ fontSize: '0.625rem', color: '#D4C5A9' }}>{faction.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation Bar */}
      <NavBar
        tabs={navTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {/* Scene Title */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          right: 20,
          padding: '0.5rem 1rem',
          background: 'rgba(26, 26, 26, 0.8)',
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
          War Council Demo
        </span>
      </div>
    </div>
  );
}

export default WarCouncilScene;
