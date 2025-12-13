/**
 * DraggableToken - Draggable token component for maps and courts
 * 
 * Used to represent characters, units, or objects on tactical maps
 * with drag-and-drop functionality.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import '../../styles/rotkTheme.css';

export type TokenVariant = 'character' | 'npc' | 'enemy' | 'object' | 'marker';
export type TokenSize = 'small' | 'medium' | 'large';

export interface DraggableTokenProps {
  id: string;
  label: string;
  labelCjk?: string;
  variant?: TokenVariant;
  size?: TokenSize;
  portrait?: string;
  icon?: React.ReactNode;
  position: { x: number; y: number };
  onPositionChange?: (id: string, position: { x: number; y: number }) => void;
  onSelect?: (id: string) => void;
  onDoubleClick?: (id: string) => void;
  isSelected?: boolean;
  isDisabled?: boolean;
  isDraggable?: boolean;
  showLabel?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const variantStyles: Record<TokenVariant, { borderColor: string; glowColor: string; bgGradient: string }> = {
  character: {
    borderColor: '#D4AF37',
    glowColor: 'rgba(212, 175, 55, 0.4)',
    bgGradient: 'linear-gradient(135deg, #CD7F32 0%, #B8960F 100%)',
  },
  npc: {
    borderColor: '#00A86B',
    glowColor: 'rgba(0, 168, 107, 0.4)',
    bgGradient: 'linear-gradient(135deg, #00A86B 0%, #006B3F 100%)',
  },
  enemy: {
    borderColor: '#C41E3A',
    glowColor: 'rgba(196, 30, 58, 0.4)',
    bgGradient: 'linear-gradient(135deg, #C41E3A 0%, #8B0000 100%)',
  },
  object: {
    borderColor: '#4682B4',
    glowColor: 'rgba(70, 130, 180, 0.4)',
    bgGradient: 'linear-gradient(135deg, #4682B4 0%, #2E5C7B 100%)',
  },
  marker: {
    borderColor: '#CD7F32',
    glowColor: 'rgba(205, 127, 50, 0.4)',
    bgGradient: 'linear-gradient(135deg, #424242 0%, #2D2D2D 100%)',
  },
};

const sizeStyles: Record<TokenSize, { size: number; fontSize: string; borderWidth: number }> = {
  small: { size: 36, fontSize: '0.625rem', borderWidth: 2 },
  medium: { size: 48, fontSize: '0.75rem', borderWidth: 3 },
  large: { size: 64, fontSize: '0.875rem', borderWidth: 4 },
};

export function DraggableToken({
  id,
  label,
  labelCjk,
  variant = 'character',
  size = 'medium',
  portrait,
  icon,
  position,
  onPositionChange,
  onSelect,
  onDoubleClick,
  isSelected = false,
  isDisabled = false,
  isDraggable = true,
  showLabel = true,
  className = '',
  style = {},
}: DraggableTokenProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const tokenRef = useRef<HTMLDivElement>(null);
  
  const { borderColor, glowColor, bgGradient } = variantStyles[variant];
  const { size: tokenSize, fontSize, borderWidth } = sizeStyles[size];
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isDraggable || isDisabled) return;
    e.preventDefault();
    
    const rect = tokenRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2,
      });
    }
    
    setIsDragging(true);
    onSelect?.(id);
  }, [id, isDraggable, isDisabled, onSelect]);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !onPositionChange) return;
    
    const parent = tokenRef.current?.parentElement;
    if (parent) {
      const parentRect = parent.getBoundingClientRect();
      const newX = e.clientX - parentRect.left - dragOffset.x;
      const newY = e.clientY - parentRect.top - dragOffset.y;
      
      // Clamp within parent bounds
      const clampedX = Math.max(tokenSize / 2, Math.min(parentRect.width - tokenSize / 2, newX));
      const clampedY = Math.max(tokenSize / 2, Math.min(parentRect.height - tokenSize / 2, newY));
      
      onPositionChange(id, { x: clampedX, y: clampedY });
    }
  }, [isDragging, id, onPositionChange, dragOffset, tokenSize]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  const handleDoubleClick = useCallback(() => {
    onDoubleClick?.(id);
  }, [id, onDoubleClick]);
  
  // Attach global mouse events for drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);
  
  return (
    <div
      ref={tokenRef}
      className={`rotk-draggable-token ${className}`}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      style={{
        position: 'absolute',
        left: position.x - tokenSize / 2,
        top: position.y - tokenSize / 2,
        width: tokenSize,
        height: tokenSize,
        borderRadius: '50%',
        background: portrait ? `url(${portrait}) center/cover` : bgGradient,
        border: `${borderWidth}px solid ${isSelected ? '#F5D48A' : borderColor}`,
        boxShadow: isSelected
          ? `0 0 12px ${glowColor}, 0 0 24px ${glowColor}, 0 4px 8px rgba(0,0,0,0.3)`
          : `0 2px 8px rgba(0,0,0,0.3)`,
        cursor: isDraggable && !isDisabled ? (isDragging ? 'grabbing' : 'grab') : 'default',
        opacity: isDisabled ? 0.5 : 1,
        filter: isDisabled ? 'grayscale(0.8)' : 'none',
        transition: isDragging ? 'none' : 'box-shadow 200ms ease, border-color 200ms ease, transform 200ms ease',
        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: isDragging ? 1000 : isSelected ? 100 : 10,
        userSelect: 'none',
        ...style,
      }}
    >
      {/* Icon or placeholder */}
      {!portrait && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FDF6E3',
            fontSize: size === 'large' ? '1.5rem' : size === 'medium' ? '1.25rem' : '1rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          {icon || (labelCjk ? labelCjk[0] : label[0])}
        </div>
      )}
      
      {/* Selection ring animation */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            border: `2px solid ${borderColor}`,
            animation: 'rotk-pulse-glow 2s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}
      
      {/* Label below token */}
      {showLabel && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: 4,
            padding: '2px 6px',
            background: 'rgba(26, 26, 26, 0.9)',
            border: `1px solid ${borderColor}`,
            borderRadius: 2,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontFamily: labelCjk ? '"Noto Serif SC", SimSun, serif' : '"Cinzel", Georgia, serif',
              fontSize,
              fontWeight: 600,
              color: '#FDF6E3',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {labelCjk || label}
          </span>
        </div>
      )}
    </div>
  );
}

export default DraggableToken;
