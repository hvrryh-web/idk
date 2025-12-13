/**
 * Tooltip - Period-styled parchment tooltip
 */

import React from 'react';
import '../styles/rotkTheme.css';

interface TooltipProps {
  title?: string;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  isVisible?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Tooltip({
  title,
  content,
  position = 'top',
  isVisible = true,
  className = '',
  style = {},
}: TooltipProps) {
  if (!isVisible) return null;
  
  const arrowStyles: Record<string, React.CSSProperties> = {
    top: {
      bottom: -8,
      left: '50%',
      transform: 'translateX(-50%)',
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
      borderTop: '8px solid #CD7F32',
    },
    bottom: {
      top: -8,
      left: '50%',
      transform: 'translateX(-50%)',
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
      borderBottom: '8px solid #CD7F32',
    },
    left: {
      right: -8,
      top: '50%',
      transform: 'translateY(-50%)',
      borderTop: '8px solid transparent',
      borderBottom: '8px solid transparent',
      borderLeft: '8px solid #CD7F32',
    },
    right: {
      left: -8,
      top: '50%',
      transform: 'translateY(-50%)',
      borderTop: '8px solid transparent',
      borderBottom: '8px solid transparent',
      borderRight: '8px solid #CD7F32',
    },
  };
  
  return (
    <div
      className={`rotk-tooltip ${className}`}
      style={{
        position: 'relative',
        display: 'inline-block',
        padding: '0.75rem 1rem',
        background: 'linear-gradient(135deg, #FDF6E3 0%, #D4C5A9 100%)',
        border: '2px solid #CD7F32',
        borderRadius: '4px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        maxWidth: 280,
        ...style,
      }}
    >
      {/* Corner decorations */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        style={{ position: 'absolute', top: -2, left: -2 }}
      >
        <path d="M0 0 L16 0 L16 4 L4 4 L4 16 L0 16 Z" fill="#D4AF37" />
      </svg>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        style={{ position: 'absolute', top: -2, right: -2, transform: 'rotate(90deg)' }}
      >
        <path d="M0 0 L16 0 L16 4 L4 4 L4 16 L0 16 Z" fill="#D4AF37" />
      </svg>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        style={{ position: 'absolute', bottom: -2, left: -2, transform: 'rotate(-90deg)' }}
      >
        <path d="M0 0 L16 0 L16 4 L4 4 L4 16 L0 16 Z" fill="#D4AF37" />
      </svg>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        style={{ position: 'absolute', bottom: -2, right: -2, transform: 'rotate(180deg)' }}
      >
        <path d="M0 0 L16 0 L16 4 L4 4 L4 16 L0 16 Z" fill="#D4AF37" />
      </svg>
      
      {/* Arrow */}
      <div
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          ...arrowStyles[position],
        }}
      />
      
      {/* Content */}
      {title && (
        <h4
          style={{
            fontFamily: '"Cinzel", Georgia, serif',
            fontSize: '0.875rem',
            fontWeight: 700,
            color: '#8B0000',
            margin: 0,
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderBottom: '1px solid #CD7F32',
            paddingBottom: '0.375rem',
          }}
        >
          {title}
        </h4>
      )}
      <div
        style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.75rem',
          lineHeight: 1.5,
          color: '#1A1A1A',
        }}
      >
        {content}
      </div>
    </div>
  );
}

export default Tooltip;
