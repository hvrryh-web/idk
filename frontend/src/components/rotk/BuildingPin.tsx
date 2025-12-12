/**
 * BuildingPin - Circular building/action pin for city view
 */

import React from 'react';
import '../styles/rotkTheme.css';

export interface BuildingPinProps {
  id: string;
  icon: React.ReactNode;
  label?: string;
  level?: number;
  position?: { x: number; y: number } | { left: string; top: string };
  isSelected?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function BuildingPin({
  id,
  icon,
  label,
  level,
  position,
  isSelected = false,
  isDisabled = false,
  onClick,
  className = '',
  style = {},
}: BuildingPinProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  const positionStyle: React.CSSProperties = position
    ? 'x' in position
      ? { left: position.x, top: position.y }
      : { left: position.left, top: position.top }
    : {};
  
  const getBorderColor = () => {
    if (isDisabled) return '#424242';
    if (isSelected) return '#D4AF37';
    if (isHovered) return '#D4AF37';
    return '#CD7F32';
  };
  
  const getBackgroundColor = () => {
    if (isDisabled) return '#424242';
    if (isSelected) return 'linear-gradient(135deg, #C41E3A 0%, #8B0000 100%)';
    return 'linear-gradient(135deg, #FDF6E3 0%, #D4C5A9 100%)';
  };
  
  const getTextColor = () => {
    if (isDisabled) return '#757575';
    if (isSelected) return '#FDF6E3';
    return '#1A1A1A';
  };
  
  return (
    <div
      className={`rotk-building-pin ${className}`}
      style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'all 150ms cubic-bezier(0, 0, 0.2, 1)',
        transform: isHovered && !isDisabled ? 'scale(1.05)' : 'scale(1)',
        filter: isDisabled ? 'grayscale(1)' : 'none',
        opacity: isDisabled ? 0.6 : 1,
        zIndex: isHovered || isSelected ? 10 : 1,
        ...positionStyle,
        ...style,
      }}
      onClick={isDisabled ? undefined : onClick}
      onMouseEnter={() => !isDisabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Pin Circle */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: getBackgroundColor(),
          border: `3px solid ${getBorderColor()}`,
          boxShadow: isHovered || isSelected
            ? '0 0 10px rgba(212, 175, 55, 0.4), 0 0 20px rgba(212, 175, 55, 0.2), 0 4px 8px rgba(0,0,0,0.2)'
            : '0 4px 8px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: getTextColor(),
          fontSize: '1.5rem',
          position: 'relative',
        }}
      >
        {icon}
        
        {/* Level badge */}
        {level !== undefined && (
          <div
            style={{
              position: 'absolute',
              bottom: -4,
              right: -4,
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #D4AF37 0%, #CD7F32 100%)',
              border: '2px solid #1A1A1A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.625rem',
              fontWeight: 700,
              color: '#1A1A1A',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            {level}
          </div>
        )}
      </div>
      
      {/* Pin Stem */}
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: `12px solid ${getBorderColor()}`,
          marginTop: -2,
        }}
      />
      
      {/* Label */}
      {label && (
        <div
          style={{
            marginTop: 4,
            padding: '2px 8px',
            background: 'rgba(26, 26, 26, 0.85)',
            borderRadius: 2,
            fontFamily: '"Cinzel", Georgia, serif',
            fontSize: '0.625rem',
            fontWeight: 600,
            color: '#FDF6E3',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
            border: `1px solid ${getBorderColor()}`,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

export default BuildingPin;
