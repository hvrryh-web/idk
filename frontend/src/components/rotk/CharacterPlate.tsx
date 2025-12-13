/**
 * CharacterPlate - Battle HUD character panel with portrait, stats, and skill banner
 */

import React from 'react';
import { Shield, Zap, Target } from 'lucide-react';
import StatBar from './StatBar';
import StatusChip from './StatusChip';
import '../../styles/rotkTheme.css';

export interface CharacterPlateUnit {
  id: string;
  name: string;
  nameCjk?: string;
  title?: string;
  portrait?: string;
  unitType?: string;
  hp: number;
  maxHp: number;
  guard: number;
  strain: number;
  ae?: number;
  maxAe?: number;
  skill?: string;
  skillCjk?: string;
  buffs?: Array<{ label: string; value?: string }>;
  debuffs?: Array<{ label: string; value?: string }>;
}

interface CharacterPlateProps {
  unit: CharacterPlateUnit;
  side: 'left' | 'right';
  isActive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function CharacterPlate({
  unit,
  side,
  isActive = false,
  className = '',
  style = {},
}: CharacterPlateProps) {
  return (
    <div
      className={`rotk-character-plate ${className}`}
      style={{
        display: 'flex',
        flexDirection: side === 'left' ? 'row' : 'row-reverse',
        gap: '0.75rem',
        padding: '1rem',
        background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(45, 45, 45, 0.9) 100%)',
        border: `2px solid ${isActive ? '#D4AF37' : '#CD7F32'}`,
        borderRadius: '4px',
        boxShadow: isActive
          ? '0 0 15px rgba(212, 175, 55, 0.4), 0 4px 12px rgba(0,0,0,0.3)'
          : '0 4px 12px rgba(0,0,0,0.3)',
        minWidth: 280,
        maxWidth: 320,
        ...style,
      }}
    >
      {/* Portrait Section */}
      <div
        style={{
          width: 80,
          height: 100,
          flexShrink: 0,
          background: unit.portrait
            ? `url(${unit.portrait}) center/cover`
            : 'linear-gradient(135deg, #424242 0%, #2D2D2D 100%)',
          border: '2px solid #CD7F32',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          color: '#D4AF37',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
        }}
      >
        {!unit.portrait && unit.name[0]}
      </div>
      
      {/* Info Section */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          textAlign: side === 'left' ? 'left' : 'right',
        }}
      >
        {/* Name and Title */}
        <div>
          {unit.nameCjk && (
            <h3
              style={{
                fontFamily: '"Noto Serif SC", SimSun, serif',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#D4AF37',
                margin: 0,
                lineHeight: 1.2,
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              {unit.nameCjk}
            </h3>
          )}
          <h4
            style={{
              fontFamily: '"Cinzel", Georgia, serif',
              fontSize: unit.nameCjk ? '0.75rem' : '1rem',
              fontWeight: 600,
              color: '#FDF6E3',
              margin: 0,
              lineHeight: 1.2,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {unit.name}
          </h4>
          {unit.title && (
            <span
              style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.625rem',
                color: '#D4C5A9',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {unit.title}
            </span>
          )}
        </div>
        
        {/* Unit Type Badge */}
        {unit.unitType && (
          <div
            style={{
              display: 'inline-block',
              padding: '0.125rem 0.5rem',
              background: 'linear-gradient(135deg, #CD7F32 0%, #A66628 100%)',
              border: '1px solid #D4AF37',
              borderRadius: '2px',
              fontFamily: '"Cinzel", Georgia, serif',
              fontSize: '0.625rem',
              fontWeight: 600,
              color: '#FDF6E3',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              alignSelf: side === 'left' ? 'flex-start' : 'flex-end',
            }}
          >
            {unit.unitType}
          </div>
        )}
        
        {/* HP Bar */}
        <StatBar
          type="hp"
          current={unit.hp}
          max={unit.maxHp}
          label="HP"
          size="medium"
        />
        
        {/* Secondary Stats */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: side === 'left' ? 'flex-start' : 'flex-end',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Shield size={14} color="#C0C0C0" />
            <span
              style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#C0C0C0',
              }}
            >
              {unit.guard}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Target size={14} color="#DAA520" />
            <span
              style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#DAA520',
              }}
            >
              {unit.strain}
            </span>
          </div>
          {unit.ae !== undefined && unit.maxAe !== undefined && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Zap size={14} color="#6B8DEF" />
              <span
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#6B8DEF',
                }}
              >
                {unit.ae}/{unit.maxAe}
              </span>
            </div>
          )}
        </div>
        
        {/* Status Chips */}
        {((unit.buffs && unit.buffs.length > 0) || (unit.debuffs && unit.debuffs.length > 0)) && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.25rem',
              justifyContent: side === 'left' ? 'flex-start' : 'flex-end',
            }}
          >
            {unit.buffs?.map((buff, i) => (
              <StatusChip key={`buff-${i}`} variant="buff" label={buff.label} value={buff.value} />
            ))}
            {unit.debuffs?.map((debuff, i) => (
              <StatusChip key={`debuff-${i}`} variant="debuff" label={debuff.label} value={debuff.value} />
            ))}
          </div>
        )}
      </div>
      
      {/* Skill Banner (overlay) */}
      {unit.skill && (
        <div
          style={{
            position: 'absolute',
            [side === 'left' ? 'right' : 'left']: -10,
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '0.25rem 1rem',
            background: 'linear-gradient(135deg, #C41E3A 0%, #8B0000 100%)',
            border: '2px solid #D4AF37',
            borderRadius: '2px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4), 0 0 10px rgba(212, 175, 55, 0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          {unit.skillCjk && (
            <span
              style={{
                fontFamily: '"Noto Serif SC", SimSun, serif',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#FDF6E3',
                marginRight: '0.5rem',
              }}
            >
              「{unit.skillCjk}」
            </span>
          )}
          <span
            style={{
              fontFamily: '"Cinzel", Georgia, serif',
              fontSize: '0.625rem',
              fontWeight: 600,
              color: '#D4C5A9',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {unit.skill}
          </span>
        </div>
      )}
    </div>
  );
}

export default CharacterPlate;
