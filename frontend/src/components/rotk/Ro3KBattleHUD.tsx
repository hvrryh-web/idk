/**
 * Ro3KBattleHUD - Enhanced Romance of Three Kingdoms style Battle HUD
 * 
 * Features large character busts, detailed stat panels, linked damage indicators,
 * and skill name banners matching classic Ro3K game aesthetics.
 */

import React from 'react';
import { Shield, Swords, Brain, Target, Users } from 'lucide-react';
import '../../styles/rotkTheme.css';

export interface Ro3KCharacterStats {
  id: string;
  name: string;
  nameCjk: string;
  portrait?: string;
  // Primary stats
  troops: number;
  maxTroops: number;
  // Combat stats
  atk: number;
  def: number;
  int: number;
  str: number;
  // Skill info
  skillName: string;
  skillNameCjk?: string;
  // Unit info
  unitType: string;
  // Status
  statusEffects?: Array<{ name: string; value?: string; type: 'buff' | 'debuff' }>;
}

interface Ro3KCharacterPanelProps {
  character: Ro3KCharacterStats;
  side: 'left' | 'right';
  isActive?: boolean;
  linkedCount?: number;
  damageBonus?: number;
}

export function Ro3KCharacterPanel({
  character,
  side,
  isActive = false,
  linkedCount,
  damageBonus,
}: Ro3KCharacterPanelProps) {
  const troopPercent = (character.troops / character.maxTroops) * 100;
  
  return (
    <div
      style={{
        position: 'absolute',
        [side]: 0,
        bottom: 0,
        width: '45%',
        height: '100%',
        display: 'flex',
        flexDirection: side === 'left' ? 'row' : 'row-reverse',
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}
    >
      {/* Large Character Portrait Bust */}
      <div
        style={{
          position: 'relative',
          width: '45%',
          height: '90%',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: side === 'left' ? 'flex-start' : 'flex-end',
          overflow: 'hidden',
          filter: isActive ? 'none' : 'brightness(0.8)',
          transition: 'filter 300ms ease',
        }}
      >
        {/* Portrait placeholder with gradient */}
        <div
          style={{
            width: '100%',
            height: '100%',
            background: character.portrait
              ? `url(${character.portrait}) center bottom/contain no-repeat`
              : `linear-gradient(${side === 'left' ? '135deg' : '225deg'}, 
                  ${side === 'left' ? '#1a472a' : '#5c1a1a'} 0%, 
                  ${side === 'left' ? '#2d5a3d' : '#8b2c2c'} 50%, 
                  transparent 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Character initial if no portrait */}
          {!character.portrait && (
            <span
              style={{
                fontSize: '8rem',
                fontFamily: '"Noto Serif SC", SimSun, serif',
                fontWeight: 900,
                color: side === 'left' ? '#00A86B' : '#C41E3A',
                opacity: 0.3,
                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
              }}
            >
              {character.nameCjk[0]}
            </span>
          )}
        </div>
        
        {/* Status effect badges */}
        {character.statusEffects && character.statusEffects.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 20,
              [side]: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}
          >
            {character.statusEffects.map((effect, i) => (
              <div
                key={i}
                style={{
                  padding: '0.25rem 0.5rem',
                  background: effect.type === 'buff'
                    ? 'linear-gradient(135deg, #00A86B 0%, #006B3F 100%)'
                    : 'linear-gradient(135deg, #C41E3A 0%, #8B0000 100%)',
                  border: `1px solid ${effect.type === 'buff' ? '#00A86B' : '#C41E3A'}`,
                  borderRadius: '2px',
                  fontSize: '0.625rem',
                  fontFamily: '"Cinzel", Georgia, serif',
                  fontWeight: 600,
                  color: '#FDF6E3',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  whiteSpace: 'nowrap',
                }}
              >
                {effect.name} {effect.value && <span style={{ color: '#D4AF37' }}>{effect.value}</span>}
              </div>
            ))}
          </div>
        )}
        
        {/* Linked combo indicator */}
        {linkedCount && linkedCount > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '40%',
              [side === 'left' ? 'right' : 'left']: -20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            {/* Linked portraits */}
            <div style={{ display: 'flex', gap: '0.125rem' }}>
              {Array.from({ length: linkedCount }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '4px',
                    background: 'linear-gradient(135deg, #424242 0%, #2D2D2D 100%)',
                    border: '2px solid #D4AF37',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  }}
                />
              ))}
            </div>
            <div
              style={{
                padding: '0.25rem 0.75rem',
                background: 'linear-gradient(135deg, #C41E3A 0%, #8B0000 100%)',
                border: '2px solid #D4AF37',
                borderRadius: '4px',
                boxShadow: '0 0 15px rgba(212, 175, 55, 0.5)',
              }}
            >
              <span
                style={{
                  fontFamily: '"Cinzel", Georgia, serif',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#D4AF37',
                }}
              >
                {linkedCount} Linked
              </span>
              {damageBonus && (
                <span
                  style={{
                    marginLeft: '0.5rem',
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#FDF6E3',
                  }}
                >
                  Damage +{damageBonus}%
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Stats Panel */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '0.5rem',
          pointerEvents: 'auto',
        }}
      >
        {/* Top decorative border */}
        <div
          style={{
            height: 4,
            background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)',
            marginBottom: '0.5rem',
          }}
        />
        
        {/* Character Name & ID */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem',
            flexDirection: side === 'left' ? 'row' : 'row-reverse',
          }}
        >
          {/* Character initial badge */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '4px',
              background: side === 'left'
                ? 'linear-gradient(135deg, #00A86B 0%, #006B3F 100%)'
                : 'linear-gradient(135deg, #C41E3A 0%, #8B0000 100%)',
              border: '2px solid #D4AF37',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: '"Noto Serif SC", SimSun, serif',
              fontSize: '1rem',
              fontWeight: 700,
              color: '#FDF6E3',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {character.nameCjk[0]}
          </div>
          
          <div style={{ textAlign: side === 'left' ? 'left' : 'right' }}>
            <div
              style={{
                fontFamily: '"Noto Serif SC", SimSun, serif',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#FDF6E3',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                lineHeight: 1,
              }}
            >
              {character.nameCjk}
            </div>
            <div
              style={{
                fontFamily: '"Cinzel", Georgia, serif',
                fontSize: '0.625rem',
                fontWeight: 600,
                color: '#D4C5A9',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {character.name}
            </div>
          </div>
        </div>
        
        {/* Troop Count & HP Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.375rem',
            flexDirection: side === 'left' ? 'row' : 'row-reverse',
          }}
        >
          <Users size={16} color="#D4AF37" />
          <div style={{ flex: 1 }}>
            {/* Troop count display */}
            <div
              style={{
                display: 'flex',
                justifyContent: side === 'left' ? 'flex-start' : 'flex-end',
                alignItems: 'baseline',
                gap: '0.25rem',
                marginBottom: '0.125rem',
              }}
            >
              <span
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#FDF6E3',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                {character.troops.toLocaleString()}
              </span>
              <span
                style={{
                  fontFamily: '"Cinzel", Georgia, serif',
                  fontSize: '0.625rem',
                  color: '#D4C5A9',
                  textTransform: 'uppercase',
                }}
              >
                {character.unitType}
              </span>
            </div>
            
            {/* HP Bar */}
            <div
              style={{
                height: 8,
                background: '#2D2D2D',
                borderRadius: 4,
                border: '1px solid #CD7F32',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${troopPercent}%`,
                  background: troopPercent > 50
                    ? 'linear-gradient(90deg, #00A86B 0%, #4CAF50 100%)'
                    : troopPercent > 25
                    ? 'linear-gradient(90deg, #DAA520 0%, #FFD700 100%)'
                    : 'linear-gradient(90deg, #C41E3A 0%, #FF6B6B 100%)',
                  transition: 'width 300ms ease',
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Combat Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.375rem',
            padding: '0.5rem',
            background: 'rgba(26, 26, 26, 0.8)',
            border: '1px solid #CD7F32',
            borderRadius: '4px',
          }}
        >
          <StatDisplay icon={<Swords size={12} />} label="ATK" value={character.atk} color="#C41E3A" side={side} />
          <StatDisplay icon={<Brain size={12} />} label="INT" value={character.int} color="#6B8DEF" side={side} />
          <StatDisplay icon={<Target size={12} />} label="STR" value={character.str} color="#DAA520" side={side} />
          <StatDisplay icon={<Shield size={12} />} label="DEF" value={character.def} color="#C0C0C0" side={side} />
        </div>
        
        {/* Skill Name Banner */}
        <div
          style={{
            marginTop: '0.5rem',
            padding: '0.375rem 0.75rem',
            background: 'linear-gradient(90deg, rgba(45, 45, 45, 0.9) 0%, rgba(26, 26, 26, 0.95) 50%, rgba(45, 45, 45, 0.9) 100%)',
            border: '1px solid #CD7F32',
            borderRadius: '4px',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* Crossed swords decoration */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: -8,
              transform: 'translateX(-50%)',
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#1A1A1A',
              border: '1px solid #CD7F32',
              borderRadius: '50%',
            }}
          >
            <Swords size={12} color="#D4AF37" />
          </div>
          
          <span
            style={{
              fontFamily: '"Cinzel", Georgia, serif',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#D4C5A9',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {character.skillName}
          </span>
        </div>
      </div>
    </div>
  );
}

// Stat display helper component
function StatDisplay({
  icon,
  label,
  value,
  color,
  side,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  side: 'left' | 'right';
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        flexDirection: side === 'left' ? 'row' : 'row-reverse',
      }}
    >
      <div style={{ color }}>{icon}</div>
      <span
        style={{
          fontFamily: '"Cinzel", Georgia, serif',
          fontSize: '0.625rem',
          fontWeight: 600,
          color,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.875rem',
          fontWeight: 700,
          color: '#FDF6E3',
          marginLeft: side === 'left' ? 'auto' : 0,
          marginRight: side === 'right' ? 'auto' : 0,
        }}
      >
        {value}
      </span>
    </div>
  );
}

// Ro3K style damage pill
export interface Ro3KDamagePillProps {
  value: number;
  type?: 'normal' | 'critical' | 'heal';
  position: { x: number; y: number };
  delay?: number;
}

export function Ro3KDamagePill({
  value,
  type = 'normal',
  position,
  delay = 0,
}: Ro3KDamagePillProps) {
  const colors = {
    normal: { bg: 'linear-gradient(180deg, #3B5998 0%, #2D4373 100%)', border: '#5B79B8' },
    critical: { bg: 'linear-gradient(180deg, #D4AF37 0%, #CD7F32 100%)', border: '#F5D48A' },
    heal: { bg: 'linear-gradient(180deg, #00A86B 0%, #006B3F 100%)', border: '#4CAF50' },
  };
  
  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        padding: '0.375rem 1rem',
        background: colors[type].bg,
        border: `2px solid ${colors[type].border}`,
        borderRadius: '20px',
        boxShadow: `0 4px 12px rgba(0,0,0,0.4), 0 0 10px ${colors[type].border}40`,
        animation: `rotk-damage-float 1.2s cubic-bezier(0, 0, 0.2, 1) ${delay}ms forwards`,
        zIndex: 100,
      }}
    >
      <span
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: type === 'critical' ? '1.5rem' : '1.25rem',
          fontWeight: 800,
          color: '#FDF6E3',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
        }}
      >
        {type === 'heal' ? '+' : ''}{value.toLocaleString()}
      </span>
    </div>
  );
}

// Center clash display
export interface Ro3KClashDisplayProps {
  leftTroops: number;
  rightTroops: number;
  advantage?: 'left' | 'right' | 'neutral';
  statusChange?: { target: 'left' | 'right'; chance: number };
}

export function Ro3KClashDisplay({
  leftTroops,
  rightTroops,
  advantage = 'neutral',
  statusChange,
}: Ro3KClashDisplayProps) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 60,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      {/* Left troop count */}
      <div
        style={{
          padding: '0.5rem 1rem',
          background: advantage === 'left'
            ? 'linear-gradient(135deg, #00A86B 0%, #006B3F 100%)'
            : 'linear-gradient(135deg, #424242 0%, #2D2D2D 100%)',
          border: `2px solid ${advantage === 'left' ? '#4CAF50' : '#CD7F32'}`,
          borderRadius: '4px',
          boxShadow: advantage === 'left' ? '0 0 15px rgba(0, 168, 107, 0.5)' : 'none',
        }}
      >
        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#FDF6E3',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          {leftTroops.toLocaleString()}
        </span>
      </div>
      
      {/* Center crossed swords */}
      <div
        style={{
          position: 'relative',
          width: 60,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(45, 45, 45, 0.9) 0%, transparent 70%)',
          }}
        />
        <Swords
          size={36}
          color="#D4AF37"
          style={{
            filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))',
          }}
        />
        
        {/* Status change indicator */}
        {statusChange && (
          <div
            style={{
              position: 'absolute',
              [statusChange.target === 'left' ? 'left' : 'right']: -80,
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '0.25rem 0.5rem',
              background: 'linear-gradient(135deg, #6B8DEF 0%, #4169E1 100%)',
              border: '1px solid #8BA8EF',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                fontFamily: '"Cinzel", Georgia, serif',
                fontSize: '0.625rem',
                color: '#FDF6E3',
              }}
            >
              Status Change
            </span>
            <span
              style={{
                marginLeft: '0.25rem',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.625rem',
                color: '#FDF6E3',
              }}
            >
              🎲 {statusChange.chance}%
            </span>
          </div>
        )}
      </div>
      
      {/* Right troop count */}
      <div
        style={{
          padding: '0.5rem 1rem',
          background: advantage === 'right'
            ? 'linear-gradient(135deg, #C41E3A 0%, #8B0000 100%)'
            : 'linear-gradient(135deg, #424242 0%, #2D2D2D 100%)',
          border: `2px solid ${advantage === 'right' ? '#FF6B6B' : '#CD7F32'}`,
          borderRadius: '4px',
          boxShadow: advantage === 'right' ? '0 0 15px rgba(196, 30, 58, 0.5)' : 'none',
        }}
      >
        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#FDF6E3',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          {rightTroops.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default Ro3KCharacterPanel;
