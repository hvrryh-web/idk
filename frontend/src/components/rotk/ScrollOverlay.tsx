/**
 * ScrollOverlay - Overlay component with scroll/parchment styling
 * 
 * Used for menus, dialogs, event choices, and NPC conversations.
 * Features slow fade and ink blot transition animations.
 */

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import '../../styles/rotkTheme.css';

export type OverlayVariant = 'scroll' | 'paper' | 'ink';
export type OverlaySize = 'small' | 'medium' | 'large' | 'fullscreen';
export type TransitionStyle = 'fade' | 'inkBlot' | 'brushReveal' | 'none';

export interface ScrollOverlayProps {
  isOpen: boolean;
  onClose?: () => void;
  variant?: OverlayVariant;
  size?: OverlaySize;
  title?: string;
  titleCjk?: string;
  transition?: TransitionStyle;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const variantStyles: Record<OverlayVariant, React.CSSProperties> = {
  scroll: {
    background: 'linear-gradient(135deg, #FDF6E3 0%, #D4C5A9 100%)',
    border: '3px solid #CD7F32',
    color: '#1A1A1A',
  },
  paper: {
    background: 'linear-gradient(180deg, #FDF6E3 0%, #E8DCC8 50%, #D4C5A9 100%)',
    border: '2px solid #B8960F',
    color: '#1A1A1A',
  },
  ink: {
    background: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)',
    border: '2px solid #D4AF37',
    color: '#FDF6E3',
  },
};

const sizeStyles: Record<OverlaySize, React.CSSProperties> = {
  small: { width: '320px', maxHeight: '400px' },
  medium: { width: '480px', maxHeight: '600px' },
  large: { width: '640px', maxHeight: '80vh' },
  fullscreen: { width: '90vw', height: '90vh', maxWidth: '1200px' },
};

export function ScrollOverlay({
  isOpen,
  onClose,
  variant = 'scroll',
  size = 'medium',
  title,
  titleCjk,
  transition = 'inkBlot',
  showCloseButton = true,
  closeOnBackdrop = true,
  children,
  className = '',
  style = {},
}: ScrollOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay to trigger animation
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      // Wait for exit animation before hiding
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, transition === 'none' ? 0 : 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, transition]);
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose?.();
    }
  };
  
  if (!isVisible) return null;
  
  const getBackdropStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 80,
      transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
    };
    
    if (transition === 'inkBlot') {
      return {
        ...baseStyle,
        background: isAnimating
          ? 'radial-gradient(ellipse at center, rgba(26, 26, 26, 0.9) 0%, rgba(0, 0, 0, 0.95) 100%)'
          : 'radial-gradient(ellipse at center, transparent 0%, transparent 100%)',
        backdropFilter: isAnimating ? 'blur(4px)' : 'blur(0px)',
      };
    }
    
    return {
      ...baseStyle,
      background: isAnimating ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0)',
      backdropFilter: isAnimating ? 'blur(2px)' : 'blur(0px)',
    };
  };
  
  const getPanelAnimation = (): React.CSSProperties => {
    if (transition === 'none') {
      return {};
    }
    
    if (transition === 'inkBlot') {
      return {
        opacity: isAnimating ? 1 : 0,
        transform: isAnimating ? 'scale(1)' : 'scale(0.85)',
        transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
        // Ink blot clip-path effect
        clipPath: isAnimating
          ? 'ellipse(100% 100% at 50% 50%)'
          : 'ellipse(0% 0% at 50% 50%)',
      };
    }
    
    if (transition === 'brushReveal') {
      return {
        opacity: isAnimating ? 1 : 0,
        clipPath: isAnimating ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
        transition: 'all 600ms cubic-bezier(0.4, 0, 0.2, 1)',
      };
    }
    
    // Default fade
    return {
      opacity: isAnimating ? 1 : 0,
      transform: isAnimating ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
      transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    };
  };
  
  return (
    <div
      className="rotk-scroll-overlay-backdrop"
      style={getBackdropStyle()}
      onClick={handleBackdropClick}
    >
      {/* Ink Blot Effect Layer (for inkBlot transition) */}
      {transition === 'inkBlot' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `
              radial-gradient(circle at 30% 40%, rgba(26, 26, 26, ${isAnimating ? 0.3 : 0}) 0%, transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(45, 45, 45, ${isAnimating ? 0.2 : 0}) 0%, transparent 40%),
              radial-gradient(circle at 50% 30%, rgba(0, 0, 0, ${isAnimating ? 0.1 : 0}) 0%, transparent 60%)
            `,
            transition: 'all 800ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      )}
      
      {/* Main Panel */}
      <div
        className={`rotk-scroll-overlay-panel ${className}`}
        style={{
          position: 'relative',
          borderRadius: '8px',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          ...variantStyles[variant],
          ...sizeStyles[size],
          ...getPanelAnimation(),
          ...style,
        }}
      >
        {/* Decorative scroll edges */}
        {variant === 'scroll' && (
          <>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 16,
                background: 'linear-gradient(180deg, #E8DCC8 0%, transparent 100%)',
                borderBottom: '1px solid rgba(205, 127, 50, 0.3)',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 16,
                background: 'linear-gradient(0deg, #BEB19A 0%, transparent 100%)',
                borderTop: '1px solid rgba(205, 127, 50, 0.3)',
                pointerEvents: 'none',
              }}
            />
          </>
        )}
        
        {/* Header */}
        {(title || showCloseButton) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.5rem',
              borderBottom: `2px solid ${variant === 'ink' ? '#D4AF37' : '#CD7F32'}`,
              background: variant === 'ink'
                ? 'linear-gradient(180deg, rgba(45, 45, 45, 0.8) 0%, transparent 100%)'
                : 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%)',
            }}
          >
            <div>
              {titleCjk && (
                <h2
                  style={{
                    fontFamily: '"Noto Serif SC", SimSun, serif',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: variant === 'ink' ? '#D4AF37' : '#8B0000',
                    margin: 0,
                    lineHeight: 1.2,
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {titleCjk}
                </h2>
              )}
              {title && (
                <h3
                  style={{
                    fontFamily: '"Cinzel", Georgia, serif',
                    fontSize: titleCjk ? '0.875rem' : '1.25rem',
                    fontWeight: 600,
                    color: variant === 'ink' ? '#FDF6E3' : '#1A1A1A',
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {title}
                </h3>
              )}
            </div>
            
            {showCloseButton && onClose && (
              <button
                onClick={onClose}
                style={{
                  width: 32,
                  height: 32,
                  border: `2px solid ${variant === 'ink' ? '#D4AF37' : '#CD7F32'}`,
                  borderRadius: 4,
                  background: variant === 'ink'
                    ? 'linear-gradient(135deg, #424242 0%, #2D2D2D 100%)'
                    : 'linear-gradient(135deg, #FDF6E3 0%, #D4C5A9 100%)',
                  color: variant === 'ink' ? '#FDF6E3' : '#1A1A1A',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#D4AF37';
                  e.currentTarget.style.boxShadow = '0 0 8px rgba(212, 175, 55, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = variant === 'ink' ? '#D4AF37' : '#CD7F32';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div
          style={{
            padding: '1.5rem',
            overflowY: 'auto',
            maxHeight: size === 'fullscreen' ? 'calc(90vh - 80px)' : 'calc(100% - 80px)',
          }}
        >
          {children}
        </div>
        
        {/* Bronze corner decorations */}
        <CornerDecoration position="tl" variant={variant} />
        <CornerDecoration position="tr" variant={variant} />
        <CornerDecoration position="bl" variant={variant} />
        <CornerDecoration position="br" variant={variant} />
      </div>
    </div>
  );
}

// Corner decoration component
function CornerDecoration({ position, variant }: { position: 'tl' | 'tr' | 'bl' | 'br'; variant: OverlayVariant }) {
  const rotations: Record<string, string> = {
    tl: '0',
    tr: '90',
    bl: '270',
    br: '180',
  };
  
  const cornerColor = variant === 'ink' ? '#D4AF37' : '#CD7F32';
  const accentColor = variant === 'ink' ? '#B8960F' : '#A66628';
  
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      style={{
        position: 'absolute',
        ...(position.includes('t') ? { top: -3 } : { bottom: -3 }),
        ...(position.includes('l') ? { left: -3 } : { right: -3 }),
        transform: `rotate(${rotations[position]}deg)`,
        pointerEvents: 'none',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
      }}
    >
      <path
        d="M2 2 L26 2 L26 8 L8 8 L8 26 L2 26 Z"
        fill={cornerColor}
        stroke={accentColor}
        strokeWidth="1"
      />
      <path
        d="M5 5 L5 10 L10 10 L10 5 Z"
        fill={accentColor}
      />
      <circle cx="7.5" cy="7.5" r="2.5" fill={cornerColor} />
    </svg>
  );
}

export default ScrollOverlay;
