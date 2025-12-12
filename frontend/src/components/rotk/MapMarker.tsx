/**
 * MapMarker - Faction-colored map markers/pins
 */

import React from 'react';
import '../styles/rotkTheme.css';

export type FactionColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'neutral';

interface MapMarkerProps {
  id: string;
  position: { x: number; y: number } | { left: string; top: string };
  faction?: FactionColor;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  isSelected?: boolean;
  isHighlighted?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const factionColors: Record<FactionColor, { primary: string; secondary: string; glow: string }> = {
  red: { primary: '#C41E3A', secondary: '#8B0000', glow: 'rgba(196, 30, 58, 0.5)' },
  blue: { primary: '#4169E1', secondary: '#2E4A8E', glow: 'rgba(65, 105, 225, 0.5)' },
  green: { primary: '#00A86B', secondary: '#006B3F', glow: 'rgba(0, 168, 107, 0.5)' },
  yellow: { primary: '#DAA520', secondary: '#B8860B', glow: 'rgba(218, 165, 32, 0.5)' },
  purple: { primary: '#9370DB', secondary: '#6B4FA2', glow: 'rgba(147, 112, 219, 0.5)' },
  neutral: { primary: '#757575', secondary: '#424242', glow: 'rgba(117, 117, 117, 0.5)' },
};

const sizes = {
  small: { dot: 12, ring: 20, label: '0.5rem' },
  medium: { dot: 16, ring: 26, label: '0.625rem' },
  large: { dot: 22, ring: 34, label: '0.75rem' },
};

export function MapMarker({
  id,
  position,
  faction = 'neutral',
  label,
  size = 'medium',
  isSelected = false,
  isHighlighted = false,
  onClick,
  className = '',
  style = {},
}: MapMarkerProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const colors = factionColors[faction];
  const dimensions = sizes[size];
  
  const positionStyle: React.CSSProperties = 'x' in position
    ? { left: position.x, top: position.y }
    : { left: position.left, top: position.top };
  
  const shouldGlow = isSelected || isHighlighted || isHovered;
  
  return (
    <div
      className={`rotk-map-marker ${className}`}
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default',
        zIndex: isSelected ? 10 : isHovered ? 5 : 1,
        ...positionStyle,
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection ring */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            width: dimensions.ring + 8,
            height: dimensions.ring + 8,
            borderRadius: '50%',
            border: '2px solid #D4AF37',
            animation: 'rotk-pulse-glow 1.5s ease-in-out infinite',
          }}
        />
      )}
      
      {/* Outer ring */}
      <div
        style={{
          width: dimensions.ring,
          height: dimensions.ring,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          border: `2px solid ${isSelected ? '#D4AF37' : colors.primary}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: shouldGlow
            ? `0 0 12px ${colors.glow}, 0 4px 8px rgba(0,0,0,0.3)`
            : '0 2px 4px rgba(0,0,0,0.3)',
          transition: 'all 150ms cubic-bezier(0, 0, 0.2, 1)',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        {/* Inner dot */}
        <div
          style={{
            width: dimensions.dot,
            height: dimensions.dot,
            borderRadius: '50%',
            background: shouldGlow
              ? 'radial-gradient(ellipse at center, #FDF6E3 0%, #D4C5A9 100%)'
              : 'radial-gradient(ellipse at center, #FDF6E3 0%, #BEB19A 100%)',
            border: '1px solid rgba(0,0,0,0.2)',
            boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.2)',
          }}
        />
      </div>
      
      {/* Label */}
      {label && (isSelected || isHovered) && (
        <div
          style={{
            marginTop: 4,
            padding: '0.125rem 0.5rem',
            background: 'rgba(26, 26, 26, 0.9)',
            border: `1px solid ${colors.primary}`,
            borderRadius: '2px',
            fontFamily: '"Cinzel", Georgia, serif',
            fontSize: dimensions.label,
            fontWeight: 600,
            color: '#FDF6E3',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

export default MapMarker;
