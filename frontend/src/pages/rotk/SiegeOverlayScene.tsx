/**
 * SiegeOverlayScene - Demo scene with tactical map overlay, siege actions, defender status
 */

import { useState } from 'react';
import {
  Panel9Slice,
  ROTKButton,
  StatBar,
  StatusChip,
} from '../../components/rotk';
import {
  Target,
  Shield,
  Flame,
  Users,
  Crosshair,
  Flag,
} from 'lucide-react';
import '../../styles/rotkTheme.css';

interface SiegePoint {
  id: string;
  label: string;
  type: 'gate' | 'wall' | 'tower' | 'camp';
  position: { left: string; top: string };
  status: 'intact' | 'damaged' | 'breached' | 'controlled';
  defenders: number;
}

const siegePoints: SiegePoint[] = [
  { id: 'north-gate', label: 'North Gate', type: 'gate', position: { left: '50%', top: '15%' }, status: 'intact', defenders: 500 },
  { id: 'east-gate', label: 'East Gate', type: 'gate', position: { left: '85%', top: '50%' }, status: 'damaged', defenders: 350 },
  { id: 'south-gate', label: 'South Gate', type: 'gate', position: { left: '50%', top: '85%' }, status: 'breached', defenders: 100 },
  { id: 'west-gate', label: 'West Gate', type: 'gate', position: { left: '15%', top: '50%' }, status: 'intact', defenders: 400 },
  { id: 'ne-tower', label: 'NE Tower', type: 'tower', position: { left: '75%', top: '25%' }, status: 'controlled', defenders: 0 },
  { id: 'se-tower', label: 'SE Tower', type: 'tower', position: { left: '75%', top: '75%' }, status: 'damaged', defenders: 150 },
  { id: 'sw-tower', label: 'SW Tower', type: 'tower', position: { left: '25%', top: '75%' }, status: 'intact', defenders: 200 },
  { id: 'nw-tower', label: 'NW Tower', type: 'tower', position: { left: '25%', top: '25%' }, status: 'intact', defenders: 200 },
  { id: 'main-camp', label: 'Main Camp', type: 'camp', position: { left: '50%', top: '50%' }, status: 'intact', defenders: 1000 },
];

const getStatusColor = (status: SiegePoint['status']) => {
  switch (status) {
    case 'intact': return '#00A86B';
    case 'damaged': return '#DAA520';
    case 'breached': return '#C41E3A';
    case 'controlled': return '#4169E1';
    default: return '#757575';
  }
};

const getPointIcon = (type: SiegePoint['type']) => {
  switch (type) {
    case 'gate': return '🚪';
    case 'wall': return '🧱';
    case 'tower': return '🗼';
    case 'camp': return '⛺';
    default: return '📍';
  }
};

export function SiegeOverlayScene() {
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [siegeProgress] = useState(35);
  const [attackerMorale] = useState(72);
  const [defenderMorale] = useState(45);
  
  const selectedSiegePoint = siegePoints.find(p => p.id === selectedPoint);
  
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
      {/* Background - Tactical Map View */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #2D2D2D 0%, #1A1A1A 100%)',
        }}
      >
        {/* Grid overlay */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.1,
          }}
        >
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#D4AF37" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Tactical Map Overlay */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',
          height: '70%',
          background: 'linear-gradient(135deg, #D4C5A9 0%, #BEB19A 100%)',
          border: '4px solid #CD7F32',
          borderRadius: '8px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          overflow: 'hidden',
        }}
      >
        {/* City walls SVG */}
        <svg
          viewBox="0 0 400 400"
          style={{
            position: 'absolute',
            inset: '10%',
            width: '80%',
            height: '80%',
          }}
        >
          {/* Outer walls */}
          <rect
            x="50"
            y="50"
            width="300"
            height="300"
            fill="none"
            stroke="#8B5A2B"
            strokeWidth="8"
            rx="20"
          />
          
          {/* Inner castle */}
          <rect
            x="150"
            y="150"
            width="100"
            height="100"
            fill="#A08060"
            stroke="#8B5A2B"
            strokeWidth="4"
            rx="8"
          />
          
          {/* Wall damage indicators */}
          <line x1="300" y1="150" x2="350" y2="150" stroke="#C41E3A" strokeWidth="4" strokeDasharray="5,5" />
          <line x1="150" y1="350" x2="250" y2="350" stroke="#C41E3A" strokeWidth="6" />
        </svg>
        
        {/* Siege Points */}
        {siegePoints.map(point => (
          <div
            key={point.id}
            onClick={() => setSelectedPoint(selectedPoint === point.id ? null : point.id)}
            style={{
              position: 'absolute',
              left: point.position.left,
              top: point.position.top,
              transform: 'translate(-50%, -50%)',
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: `radial-gradient(ellipse at center, ${getStatusColor(point.status)}40 0%, ${getStatusColor(point.status)}80 100%)`,
              border: `3px solid ${selectedPoint === point.id ? '#D4AF37' : getStatusColor(point.status)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1.25rem',
              boxShadow: selectedPoint === point.id
                ? `0 0 15px ${getStatusColor(point.status)}, 0 0 30px rgba(212, 175, 55, 0.5)`
                : `0 0 10px ${getStatusColor(point.status)}80`,
              transition: 'all 150ms ease-out',
              zIndex: selectedPoint === point.id ? 10 : 1,
            }}
          >
            {getPointIcon(point.type)}
          </div>
        ))}
        
        {/* Legend */}
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            padding: '0.5rem',
            background: 'rgba(253, 246, 227, 0.9)',
            border: '1px solid #CD7F32',
            borderRadius: '4px',
          }}
        >
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.625rem' }}>
            {['intact', 'damaged', 'breached', 'controlled'].map(status => (
              <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: getStatusColor(status as SiegePoint['status']),
                  }}
                />
                <span style={{ textTransform: 'capitalize', color: '#424242' }}>{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Left Panel: Siege Overview */}
      <Panel9Slice
        variant="ink"
        style={{
          position: 'absolute',
          left: 20,
          top: 20,
          width: 280,
        }}
      >
        <h3
          style={{
            fontFamily: '"Cinzel", Georgia, serif',
            fontSize: '1rem',
            fontWeight: 700,
            color: '#D4AF37',
            margin: 0,
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Siege of Xiangyang
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Siege Progress */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#D4C5A9' }}>Siege Progress</span>
              <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 600 }}>{siegeProgress}%</span>
            </div>
            <div
              style={{
                height: 8,
                background: '#2D2D2D',
                borderRadius: 4,
                border: '1px solid #CD7F32',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${siegeProgress}%`,
                  background: 'linear-gradient(90deg, #C41E3A 0%, #E85C73 50%, #C41E3A 100%)',
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
          
          {/* Morale Bars */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.625rem', color: '#00A86B' }}>Attacker Morale</span>
              <StatBar type="hp" current={attackerMorale} max={100} showValue={false} size="small" />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.625rem', color: '#C41E3A' }}>Defender Morale</span>
              <StatBar type="strain" current={defenderMorale} max={100} showValue={false} size="small" />
            </div>
          </div>
          
          {/* Status Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
            <StatusChip variant="buff" label="Supply Lines" showArrow={false} />
            <StatusChip variant="debuff" label="Low Ammo" showArrow={false} />
            <StatusChip variant="neutral" label="Night Battle" showArrow={false} />
          </div>
        </div>
      </Panel9Slice>
      
      {/* Right Panel: Selected Point Details */}
      {selectedSiegePoint && (
        <Panel9Slice
          variant="parchment"
          style={{
            position: 'absolute',
            right: 20,
            top: 20,
            width: 280,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>{getPointIcon(selectedSiegePoint.type)}</span>
            <div>
              <h4
                style={{
                  fontFamily: '"Cinzel", Georgia, serif',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#8B0000',
                  margin: 0,
                }}
              >
                {selectedSiegePoint.label}
              </h4>
              <span
                style={{
                  fontSize: '0.625rem',
                  color: getStatusColor(selectedSiegePoint.status),
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                {selectedSiegePoint.status}
              </span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Users size={16} color="#424242" />
            <span style={{ fontSize: '0.875rem', color: '#424242' }}>
              Defenders: <strong>{selectedSiegePoint.defenders.toLocaleString()}</strong>
            </span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <ROTKButton
              variant="primary"
              size="small"
              icon={Crosshair}
              style={{ width: '100%' }}
              disabled={selectedSiegePoint.status === 'controlled'}
            >
              Assault
            </ROTKButton>
            <ROTKButton
              variant="secondary"
              size="small"
              icon={Flame}
              style={{ width: '100%' }}
              disabled={selectedSiegePoint.status === 'controlled'}
            >
              Fire Attack
            </ROTKButton>
            <ROTKButton
              variant="gold"
              size="small"
              icon={Flag}
              style={{ width: '100%' }}
              disabled={selectedSiegePoint.status !== 'breached'}
            >
              Capture
            </ROTKButton>
          </div>
        </Panel9Slice>
      )}
      
      {/* Bottom: Army Status */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '2rem',
        }}
      >
        <Panel9Slice variant="ink" style={{ padding: '0.75rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Shield size={24} color="#00A86B" />
            <div>
              <span style={{ fontSize: '0.625rem', color: '#D4C5A9', textTransform: 'uppercase' }}>
                Attacker Forces
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#00A86B' }}>
                45,000
              </div>
            </div>
          </div>
        </Panel9Slice>
        
        <Panel9Slice variant="lacquer" style={{ padding: '0.75rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Target size={24} color="#FDF6E3" />
            <div>
              <span style={{ fontSize: '0.625rem', color: '#D4C5A9', textTransform: 'uppercase' }}>
                Defender Forces
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FDF6E3' }}>
                12,500
              </div>
            </div>
          </div>
        </Panel9Slice>
      </div>
      
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
          Siege Overlay Demo
        </span>
      </div>
    </div>
  );
}

export default SiegeOverlayScene;
