/**
 * ResourceHUD - Top resource HUD bar with date, action points, currencies
 */

import { Settings, Menu, Sun, Cloud, Snowflake, Leaf, LucideIcon } from 'lucide-react';
import '../styles/rotkTheme.css';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

interface Resource {
  id: string;
  icon: React.ReactNode;
  value: number;
  label?: string;
}

interface ResourceHUDProps {
  year?: number;
  season?: Season;
  actionPoints?: { current: number; max: number };
  resources?: Resource[];
  onSettingsClick?: () => void;
  onMenuClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const seasonIcons: Record<Season, LucideIcon> = {
  spring: Leaf,
  summer: Sun,
  autumn: Cloud,
  winter: Snowflake,
};

const seasonColors: Record<Season, string> = {
  spring: '#00A86B',
  summer: '#DAA520',
  autumn: '#CD7F32',
  winter: '#6FA3CF',
};

const seasonLabels: Record<Season, { en: string; cjk: string }> = {
  spring: { en: 'Spring', cjk: '春' },
  summer: { en: 'Summer', cjk: '夏' },
  autumn: { en: 'Autumn', cjk: '秋' },
  winter: { en: 'Winter', cjk: '冬' },
};

export function ResourceHUD({
  year = 200,
  month = 1,
  season = 'spring',
  actionPoints = { current: 3, max: 5 },
  resources = [],
  onSettingsClick,
  onMenuClick,
  className = '',
  style = {},
}: ResourceHUDProps) {
  const SeasonIcon = seasonIcons[season];
  
  return (
    <div
      className={`rotk-resource-hud ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 1rem',
        background: 'linear-gradient(180deg, rgba(26, 26, 26, 0.95) 0%, rgba(45, 45, 45, 0.9) 100%)',
        borderBottom: '3px solid #CD7F32',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        ...style,
      }}
    >
      {/* Left: Date/Season */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        {/* Season Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, ${seasonColors[season]}40 0%, transparent 70%)`,
            border: `2px solid ${seasonColors[season]}`,
          }}
        >
          <SeasonIcon size={20} color={seasonColors[season]} />
        </div>
        
        {/* Date Display */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span
              style={{
                fontFamily: '"Noto Serif SC", SimSun, serif',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: '#D4AF37',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              建安{year - 196}年
            </span>
            <span
              style={{
                fontFamily: '"Noto Serif SC", SimSun, serif',
                fontSize: '1rem',
                fontWeight: 600,
                color: seasonColors[season],
              }}
            >
              {seasonLabels[season].cjk}
            </span>
          </div>
          <span
            style={{
              fontFamily: '"Cinzel", Georgia, serif',
              fontSize: '0.625rem',
              fontWeight: 500,
              color: '#D4C5A9',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Year {year} • {seasonLabels[season].en}
          </span>
        </div>
      </div>
      
      {/* Center: Action Points */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.375rem 1rem',
          background: 'rgba(45, 45, 45, 0.8)',
          border: '2px solid #CD7F32',
          borderRadius: '4px',
        }}
      >
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
          Actions
        </span>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {Array.from({ length: actionPoints.max }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: i < actionPoints.current
                  ? 'linear-gradient(135deg, #D4AF37 0%, #CD7F32 100%)'
                  : '#424242',
                border: `2px solid ${i < actionPoints.current ? '#D4AF37' : '#2D2D2D'}`,
                boxShadow: i < actionPoints.current
                  ? '0 0 6px rgba(212, 175, 55, 0.5)'
                  : 'none',
              }}
            />
          ))}
        </div>
        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#D4AF37',
          }}
        >
          {actionPoints.current}/{actionPoints.max}
        </span>
      </div>
      
      {/* Right: Resources */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        {resources.map(resource => (
          <div
            key={resource.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>{resource.icon}</span>
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#FDF6E3',
              }}
            >
              {resource.value.toLocaleString()}
            </span>
          </div>
        ))}
        
        {/* System Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '0.5rem' }}>
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: '1px solid #CD7F32',
                borderRadius: '4px',
                cursor: 'pointer',
                color: '#D4C5A9',
                transition: 'all 150ms ease-out',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#D4AF37';
                e.currentTarget.style.color = '#D4AF37';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#CD7F32';
                e.currentTarget.style.color = '#D4C5A9';
              }}
            >
              <Menu size={18} />
            </button>
          )}
          {onSettingsClick && (
            <button
              onClick={onSettingsClick}
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: '1px solid #CD7F32',
                borderRadius: '4px',
                cursor: 'pointer',
                color: '#D4C5A9',
                transition: 'all 150ms ease-out',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#D4AF37';
                e.currentTarget.style.color = '#D4AF37';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#CD7F32';
                e.currentTarget.style.color = '#D4C5A9';
              }}
            >
              <Settings size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResourceHUD;
