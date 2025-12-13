/**
 * ClashIndicator - Center battle clash indicator with crossed weapons
 */

import React from 'react';
import { Swords } from 'lucide-react';
import StatusChip from './StatusChip';
import '../../styles/rotkTheme.css';

export type AdvantageType = 'left' | 'right' | 'neutral';

interface ClashIndicatorProps {
  advantage?: AdvantageType;
  statusText?: string;
  linkedCombo?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function ClashIndicator({
  advantage = 'neutral',
  statusText,
  linkedCombo,
  className = '',
  style = {},
}: ClashIndicatorProps) {
  const getAdvantageColor = () => {
    switch (advantage) {
      case 'left':
        return '#00A86B';
      case 'right':
        return '#C41E3A';
      default:
        return '#D4AF37';
    }
  };
  
  return (
    <div
      className={`rotk-clash-indicator ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        ...style,
      }}
    >
      {/* Clash Icon */}
      <div
        style={{
          position: 'relative',
          width: 80,
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Outer ring */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            border: '3px solid #CD7F32',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(26, 26, 26, 0.9) 0%, rgba(45, 45, 45, 0.8) 100%)',
            boxShadow: `
              0 0 20px rgba(212, 175, 55, 0.3),
              inset 0 0 20px rgba(0,0,0,0.5)
            `,
          }}
        />
        
        {/* Inner glow */}
        <div
          style={{
            position: 'absolute',
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, ${getAdvantageColor()}40 0%, transparent 70%)`,
          }}
        />
        
        {/* Crossed swords icon */}
        <Swords
          size={36}
          strokeWidth={2}
          style={{
            color: getAdvantageColor(),
            filter: `drop-shadow(0 0 8px ${getAdvantageColor()})`,
            zIndex: 1,
          }}
        />
        
        {/* Advantage arrows */}
        <div
          style={{
            position: 'absolute',
            left: -30,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '1.5rem',
            color: advantage === 'left' ? '#00A86B' : '#757575',
            textShadow: advantage === 'left' ? '0 0 10px #00A86B' : 'none',
            opacity: advantage === 'left' ? 1 : 0.3,
          }}
        >
          ←
        </div>
        <div
          style={{
            position: 'absolute',
            right: -30,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '1.5rem',
            color: advantage === 'right' ? '#C41E3A' : '#757575',
            textShadow: advantage === 'right' ? '0 0 10px #C41E3A' : 'none',
            opacity: advantage === 'right' ? 1 : 0.3,
          }}
        >
          →
        </div>
      </div>
      
      {/* Status Text */}
      {statusText && (
        <StatusChip
          variant={advantage === 'left' ? 'buff' : advantage === 'right' ? 'debuff' : 'neutral'}
          label={statusText}
          showArrow={false}
        />
      )}
      
      {/* Linked Combo Indicator */}
      {linkedCombo !== undefined && linkedCombo > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.25rem 0.75rem',
            background: 'linear-gradient(135deg, #D4AF37 0%, #CD7F32 100%)',
            border: '2px solid #B8960F',
            borderRadius: '4px',
            boxShadow: '0 0 10px rgba(212, 175, 55, 0.4)',
          }}
        >
          <span
            style={{
              fontFamily: '"Cinzel", Georgia, serif',
              fontSize: '0.625rem',
              fontWeight: 600,
              color: '#1A1A1A',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            COMBO
          </span>
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '1rem',
              fontWeight: 800,
              color: '#1A1A1A',
            }}
          >
            ×{linkedCombo}
          </span>
        </div>
      )}
    </div>
  );
}

export default ClashIndicator;
