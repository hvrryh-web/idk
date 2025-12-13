/**
 * Panel9Slice - A 9-slice panel component with period-piece styling
 * 
 * Supports parchment, lacquer, and ink variants with ornate bronze corner decorations.
 */

import React from 'react';
import '../../styles/rotkTheme.css';

export type PanelVariant = 'parchment' | 'lacquer' | 'ink';

interface Panel9SliceProps {
  variant?: PanelVariant;
  corners?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const panelStyles: Record<PanelVariant, React.CSSProperties> = {
  parchment: {
    background: 'linear-gradient(135deg, #FDF6E3 0%, #D4C5A9 100%)',
    border: '2px solid #CD7F32',
    borderRadius: '4px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)',
    color: '#1A1A1A',
  },
  lacquer: {
    background: 'linear-gradient(135deg, #C41E3A 0%, #8B0000 100%)',
    border: '2px solid #D4AF37',
    borderRadius: '4px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
    color: '#FDF6E3',
  },
  ink: {
    background: '#1A1A1A',
    border: '1px solid #CD7F32',
    borderRadius: '4px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.1)',
    color: '#FDF6E3',
  },
};

const cornerSvg = (position: 'tl' | 'tr' | 'bl' | 'br') => {
  const rotations: Record<string, string> = {
    tl: '0',
    tr: '90',
    bl: '270',
    br: '180',
  };
  
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      style={{
        position: 'absolute',
        ...(position.includes('t') ? { top: -2 } : { bottom: -2 }),
        ...(position.includes('l') ? { left: -2 } : { right: -2 }),
        transform: `rotate(${rotations[position]}deg)`,
        pointerEvents: 'none',
      }}
    >
      <path
        d="M2 2 L22 2 L22 6 L6 6 L6 22 L2 22 Z"
        fill="#D4AF37"
        stroke="#B8960F"
        strokeWidth="1"
      />
      <path
        d="M4 4 L4 8 L8 8 L8 4 Z"
        fill="#CD7F32"
      />
      <circle cx="6" cy="6" r="2" fill="#D4AF37" />
    </svg>
  );
};

export function Panel9Slice({ 
  variant = 'parchment', 
  corners = true,
  children, 
  className = '',
  style = {},
}: Panel9SliceProps) {
  return (
    <div
      className={`rotk-panel-${variant} ${className}`}
      style={{
        ...panelStyles[variant],
        position: 'relative',
        padding: '1.5rem',
        ...style,
      }}
    >
      {corners && (
        <>
          {cornerSvg('tl')}
          {cornerSvg('tr')}
          {cornerSvg('bl')}
          {cornerSvg('br')}
        </>
      )}
      {children}
    </div>
  );
}

export default Panel9Slice;
