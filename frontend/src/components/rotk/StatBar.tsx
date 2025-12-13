/**
 * StatBar - HP/AE/Guard/Strain bars with period styling
 */

import React from 'react';
import '../styles/rotkTheme.css';

export type BarType = 'hp' | 'ae' | 'guard' | 'strain';

interface StatBarProps {
  type: BarType;
  current: number;
  max: number;
  label?: string;
  showValue?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  style?: React.CSSProperties;
}

const barGradients: Record<BarType, string> = {
  hp: 'linear-gradient(90deg, #8B0000 0%, #CC3333 50%, #8B0000 100%)',
  ae: 'linear-gradient(90deg, #4169E1 0%, #6B8DEF 50%, #4169E1 100%)',
  guard: 'linear-gradient(90deg, #A0A0A0 0%, #C0C0C0 50%, #A0A0A0 100%)',
  strain: 'linear-gradient(90deg, #B8860B 0%, #DAA520 50%, #B8860B 100%)',
};

const barColors: Record<BarType, string> = {
  hp: '#CC3333',
  ae: '#6B8DEF',
  guard: '#C0C0C0',
  strain: '#DAA520',
};

const sizeStyles = {
  small: { height: 6, fontSize: '0.625rem' },
  medium: { height: 10, fontSize: '0.75rem' },
  large: { height: 14, fontSize: '0.875rem' },
};

export function StatBar({
  type,
  current,
  max,
  label,
  showValue = true,
  size = 'medium',
  className = '',
  style = {},
}: StatBarProps) {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  const { height, fontSize } = sizeStyles[size];
  
  // For strain, the bar fills as strain accumulates (danger indicator)
  const isStrainLow = type === 'strain' && percentage > 75;
  
  return (
    <div
      className={`rotk-stat-bar ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.125rem',
        width: '100%',
        ...style,
      }}
    >
      {(label || showValue) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: '"Inter", sans-serif',
            fontSize,
            fontWeight: 600,
            color: '#FDF6E3',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          {label && (
            <span style={{ 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              color: barColors[type],
            }}>
              {label}
            </span>
          )}
          {showValue && (
            <span>
              {current}
              <span style={{ opacity: 0.7 }}>/{max}</span>
            </span>
          )}
        </div>
      )}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height,
          background: '#2D2D2D',
          borderRadius: height / 2,
          border: '1px solid #CD7F32',
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${percentage}%`,
            background: barGradients[type],
            borderRadius: height / 2,
            transition: 'width 250ms cubic-bezier(0, 0, 0.2, 1)',
            boxShadow: `0 0 8px ${barColors[type]}40`,
          }}
        />
        {/* Highlight line */}
        <div
          style={{
            position: 'absolute',
            top: 1,
            left: 2,
            right: 2,
            height: 2,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
            borderRadius: 1,
            pointerEvents: 'none',
          }}
        />
        {/* Danger pulse for high strain */}
        {isStrainLow && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255,0,0,0.2)',
              animation: 'rotk-pulse-glow 1s ease-in-out infinite',
            }}
          />
        )}
      </div>
    </div>
  );
}

export default StatBar;
