/**
 * CharacterPortrait - Smart character portrait component
 * 
 * Automatically loads character portraits with fallback to generated SVG
 * when assets are missing. Integrates with the character asset service.
 */

import React, { useState, useEffect } from 'react';
import { useCharacterAssets } from '../../services/useCharacterAssets';
import { FACTION_COLORS } from '../../services/characterAssetService';
import '../../styles/rotkTheme.css';

export type PortraitSize = 'small' | 'medium' | 'large' | 'full';
export type PortraitShape = 'square' | 'circle' | 'bust';

export interface CharacterPortraitProps {
  characterId: string;
  size?: PortraitSize;
  shape?: PortraitShape;
  showName?: boolean;
  showFactionBorder?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const SIZE_MAP: Record<PortraitSize, { width: number; height: number }> = {
  small: { width: 48, height: 48 },
  medium: { width: 80, height: 100 },
  large: { width: 120, height: 150 },
  full: { width: 200, height: 250 },
};

export function CharacterPortrait({
  characterId,
  size = 'medium',
  shape = 'square',
  showName = false,
  showFactionBorder = true,
  isActive = false,
  onClick,
  className = '',
  style = {},
}: CharacterPortraitProps) {
  const { character, portrait, isLoading } = useCharacterAssets(characterId);
  const [imageError, setImageError] = useState(false);

  // Reset error when character changes
  useEffect(() => {
    setImageError(false);
  }, [characterId]);

  const dimensions = SIZE_MAP[size];
  const factionColors = character 
    ? FACTION_COLORS[character.faction] 
    : FACTION_COLORS.neutral;

  const borderRadius = shape === 'circle' 
    ? '50%' 
    : shape === 'bust' 
      ? '4px 4px 50% 50%' 
      : '4px';

  const handleImageError = () => {
    setImageError(true);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div
        className={`character-portrait loading ${className}`}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          borderRadius,
          background: 'linear-gradient(135deg, #2D2D2D 0%, #424242 100%)',
          border: '2px solid #CD7F32',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'rotk-pulse-glow 1.5s ease-in-out infinite',
          ...style,
        }}
      >
        <div
          style={{
            width: '30%',
            height: '30%',
            borderRadius: '50%',
            border: '2px solid #D4AF37',
            borderTopColor: 'transparent',
            animation: 'rotk-spin-slow 1s linear infinite',
          }}
        />
      </div>
    );
  }

  // Render fallback if no portrait available or image error
  const shouldUseFallback = !portrait || imageError;

  return (
    <div
      className={`character-portrait ${isActive ? 'active' : ''} ${className}`}
      onClick={onClick}
      style={{
        position: 'relative',
        width: dimensions.width,
        height: showName ? dimensions.height + 24 : dimensions.height,
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {/* Portrait container */}
      <div
        style={{
          width: dimensions.width,
          height: dimensions.height,
          borderRadius,
          overflow: 'hidden',
          border: showFactionBorder 
            ? `3px solid ${isActive ? '#D4AF37' : factionColors.primary}`
            : '2px solid #CD7F32',
          boxShadow: isActive
            ? `0 0 15px ${factionColors.primary}80, 0 4px 12px rgba(0,0,0,0.4)`
            : '0 4px 12px rgba(0,0,0,0.3)',
          transition: 'all 200ms ease',
          transform: isActive ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        {shouldUseFallback ? (
          // Fallback SVG display
          <div
            style={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, ${factionColors.primary} 0%, ${factionColors.secondary} 100%)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem',
            }}
          >
            <span
              style={{
                fontFamily: '"Noto Serif SC", SimSun, serif',
                fontSize: size === 'small' ? '1.25rem' : size === 'medium' ? '2rem' : '3rem',
                fontWeight: 700,
                color: factionColors.text,
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              {character?.nameCjk?.[0] || character?.name?.[0] || '?'}
            </span>
            {size !== 'small' && character && (
              <span
                style={{
                  fontFamily: '"Cinzel", Georgia, serif',
                  fontSize: size === 'medium' ? '0.5rem' : '0.625rem',
                  fontWeight: 600,
                  color: factionColors.text,
                  opacity: 0.8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {character.style}
              </span>
            )}
          </div>
        ) : (
          // Actual portrait image
          <img
            src={portrait}
            alt={character?.name || characterId}
            onError={handleImageError}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
            }}
          />
        )}

        {/* Missing asset indicator */}
        {character && !character.hasPortrait && !character.hasBust && (
          <div
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#DAA520',
              border: '1px solid #FDF6E3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.5rem',
              color: '#1A1A1A',
              fontWeight: 700,
            }}
            title="Asset needs generation"
          >
            !
          </div>
        )}
      </div>

      {/* Character name label */}
      {showName && character && (
        <div
          style={{
            marginTop: '0.25rem',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: '"Noto Serif SC", SimSun, serif',
              fontSize: size === 'small' ? '0.625rem' : '0.75rem',
              fontWeight: 600,
              color: '#FDF6E3',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {character.nameCjk}
          </span>
        </div>
      )}
    </div>
  );
}

export default CharacterPortrait;
