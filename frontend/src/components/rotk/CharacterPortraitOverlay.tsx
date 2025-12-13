/**
 * CharacterPortraitOverlay - Left-side character portrait with dialogue panel
 */

import React from 'react';
import Panel9Slice from './Panel9Slice';
import '../styles/rotkTheme.css';

interface CharacterPortraitOverlayProps {
  name: string;
  nameCjk?: string;
  title?: string;
  portrait?: string;
  dialogue?: string;
  isVisible?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function CharacterPortraitOverlay({
  name,
  nameCjk,
  title,
  portrait,
  dialogue,
  isVisible = true,
  className = '',
  style = {},
}: CharacterPortraitOverlayProps) {
  if (!isVisible) return null;
  
  return (
    <div
      className={`rotk-portrait-overlay ${className}`}
      style={{
        position: 'fixed',
        left: 0,
        bottom: 80,
        display: 'flex',
        alignItems: 'flex-end',
        gap: '1rem',
        padding: '1rem',
        zIndex: 20,
        ...style,
      }}
    >
      {/* Portrait */}
      <div
        style={{
          width: 200,
          height: 280,
          background: portrait
            ? `url(${portrait}) center/cover`
            : 'linear-gradient(180deg, #424242 0%, #2D2D2D 100%)',
          border: '4px solid #CD7F32',
          borderRadius: '8px',
          boxShadow: `
            0 8px 32px rgba(0,0,0,0.4),
            0 0 20px rgba(212, 175, 55, 0.2),
            inset 0 0 30px rgba(0,0,0,0.5)
          `,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Placeholder character initial if no portrait */}
        {!portrait && (
          <span
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '4rem',
              color: '#D4AF37',
              opacity: 0.5,
              fontFamily: '"Noto Serif SC", SimSun, serif',
            }}
          >
            {nameCjk?.[0] || name[0]}
          </span>
        )}
        
        {/* Name plate at bottom of portrait */}
        <div
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'linear-gradient(180deg, transparent 0%, rgba(26, 26, 26, 0.95) 100%)',
          }}
        >
          {nameCjk && (
            <h2
              style={{
                fontFamily: '"Noto Serif SC", SimSun, serif',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#D4AF37',
                margin: 0,
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)',
              }}
            >
              {nameCjk}
            </h2>
          )}
          <h3
            style={{
              fontFamily: '"Cinzel", Georgia, serif',
              fontSize: nameCjk ? '0.75rem' : '1rem',
              fontWeight: 600,
              color: '#FDF6E3',
              margin: 0,
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {name}
          </h3>
          {title && (
            <span
              style={{
                display: 'block',
                fontFamily: '"Cinzel", Georgia, serif',
                fontSize: '0.625rem',
                color: '#D4C5A9',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginTop: '0.25rem',
              }}
            >
              {title}
            </span>
          )}
        </div>
      </div>
      
      {/* Dialogue Panel */}
      {dialogue && (
        <Panel9Slice variant="parchment" corners={true}>
          <div
            style={{
              maxWidth: 400,
              minHeight: 80,
            }}
          >
            <p
              style={{
                fontFamily: '"Noto Serif SC", Inter, sans-serif',
                fontSize: '1rem',
                lineHeight: 1.6,
                color: '#1A1A1A',
                margin: 0,
              }}
            >
              {dialogue}
            </p>
          </div>
        </Panel9Slice>
      )}
    </div>
  );
}

export default CharacterPortraitOverlay;
