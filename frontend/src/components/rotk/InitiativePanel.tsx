/**
 * InitiativePanel - Combat turn order display panel
 * 
 * Shows initiative order with character portraits and turn indicators.
 * Used in combat scenes to track who acts next.
 */

import React from 'react';
import { ChevronRight, Clock, Zap } from 'lucide-react';
import '../../styles/rotkTheme.css';

export interface InitiativeEntry {
  id: string;
  name: string;
  nameCjk?: string;
  portrait?: string;
  initiative: number;
  isAlly?: boolean;
  isActive?: boolean;
  hasActed?: boolean;
  statusEffects?: string[];
}

export interface InitiativePanelProps {
  entries: InitiativeEntry[];
  currentTurn: number;
  roundNumber?: number;
  onEntryClick?: (id: string) => void;
  orientation?: 'horizontal' | 'vertical';
  showInitiativeValue?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function InitiativePanel({
  entries,
  currentTurn,
  roundNumber = 1,
  onEntryClick,
  orientation = 'horizontal',
  showInitiativeValue = true,
  className = '',
  style = {},
}: InitiativePanelProps) {
  const sortedEntries = [...entries].sort((a, b) => b.initiative - a.initiative);
  
  return (
    <div
      className={`rotk-initiative-panel ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
        background: 'linear-gradient(180deg, rgba(26, 26, 26, 0.95) 0%, rgba(45, 45, 45, 0.9) 100%)',
        border: '2px solid #CD7F32',
        borderRadius: '4px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
        ...style,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid rgba(205, 127, 50, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={16} color="#D4AF37" />
          <span
            style={{
              fontFamily: '"Cinzel", Georgia, serif',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#D4AF37',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Initiative
          </span>
        </div>
        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#D4C5A9',
          }}
        >
          Round {roundNumber}
        </span>
      </div>
      
      {/* Initiative Entries */}
      <div
        style={{
          display: 'flex',
          flexDirection: orientation === 'horizontal' ? 'row' : 'column',
          gap: orientation === 'horizontal' ? '0.25rem' : '0.375rem',
          overflowX: orientation === 'horizontal' ? 'auto' : 'visible',
          overflowY: orientation === 'vertical' ? 'auto' : 'visible',
          maxHeight: orientation === 'vertical' ? '400px' : 'auto',
          paddingBottom: orientation === 'horizontal' ? '0.25rem' : 0,
        }}
      >
        {sortedEntries.map((entry, index) => (
          <InitiativeEntryCard
            key={entry.id}
            entry={entry}
            isCurrentTurn={index === currentTurn}
            turnIndex={index}
            onEntryClick={onEntryClick}
            orientation={orientation}
            showInitiativeValue={showInitiativeValue}
          />
        ))}
      </div>
    </div>
  );
}

interface InitiativeEntryCardProps {
  entry: InitiativeEntry;
  isCurrentTurn: boolean;
  turnIndex: number;
  onEntryClick?: (id: string) => void;
  orientation: 'horizontal' | 'vertical';
  showInitiativeValue: boolean;
}

function InitiativeEntryCard({
  entry,
  isCurrentTurn,
  turnIndex,
  onEntryClick,
  orientation,
  showInitiativeValue,
}: InitiativeEntryCardProps) {
  const borderColor = entry.isAlly ? '#00A86B' : '#C41E3A';
  // glowColor reserved for future hover/active effects
  
  if (orientation === 'horizontal') {
    return (
      <div
        onClick={() => onEntryClick?.(entry.id)}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0.375rem',
          borderRadius: '4px',
          background: entry.hasActed
            ? 'rgba(45, 45, 45, 0.5)'
            : 'linear-gradient(180deg, rgba(66, 66, 66, 0.8) 0%, rgba(45, 45, 45, 0.6) 100%)',
          border: `2px solid ${isCurrentTurn ? '#D4AF37' : entry.hasActed ? '#424242' : borderColor}`,
          boxShadow: isCurrentTurn
            ? '0 0 12px rgba(212, 175, 55, 0.5), 0 0 24px rgba(212, 175, 55, 0.3)'
            : entry.hasActed
              ? 'none'
              : `0 2px 8px rgba(0, 0, 0, 0.3)`,
          opacity: entry.hasActed ? 0.6 : 1,
          cursor: onEntryClick ? 'pointer' : 'default',
          transition: 'all 200ms ease',
          minWidth: 56,
        }}
      >
        {/* Current turn indicator */}
        {isCurrentTurn && (
          <div
            style={{
              position: 'absolute',
              top: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#D4AF37',
            }}
          >
            <ChevronRight size={14} style={{ transform: 'rotate(90deg)' }} />
          </div>
        )}
        
        {/* Portrait */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: entry.portrait
              ? `url(${entry.portrait}) center/cover`
              : `linear-gradient(135deg, ${entry.isAlly ? '#006B3F' : '#8B0000'} 0%, ${entry.isAlly ? '#00A86B' : '#C41E3A'} 100%)`,
            border: `2px solid ${entry.hasActed ? '#424242' : borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            color: '#FDF6E3',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
            filter: entry.hasActed ? 'grayscale(0.8)' : 'none',
          }}
        >
          {!entry.portrait && (entry.nameCjk?.[0] || entry.name[0])}
        </div>
        
        {/* Name */}
        <span
          style={{
            fontFamily: entry.nameCjk ? '"Noto Serif SC", SimSun, serif' : '"Inter", sans-serif',
            fontSize: '0.625rem',
            fontWeight: 600,
            color: entry.hasActed ? '#757575' : '#FDF6E3',
            marginTop: '0.25rem',
            maxWidth: 56,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: 'center',
          }}
        >
          {entry.nameCjk || entry.name}
        </span>
        
        {/* Initiative value */}
        {showInitiativeValue && (
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.625rem',
              fontWeight: 600,
              color: entry.hasActed ? '#424242' : '#D4C5A9',
              display: 'flex',
              alignItems: 'center',
              gap: '0.125rem',
            }}
          >
            <Zap size={10} />
            {entry.initiative}
          </span>
        )}
      </div>
    );
  }
  
  // Vertical orientation
  return (
    <div
      onClick={() => onEntryClick?.(entry.id)}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.5rem 0.75rem',
        borderRadius: '4px',
        background: entry.hasActed
          ? 'rgba(45, 45, 45, 0.5)'
          : 'linear-gradient(90deg, rgba(66, 66, 66, 0.8) 0%, rgba(45, 45, 45, 0.6) 100%)',
        border: `2px solid ${isCurrentTurn ? '#D4AF37' : entry.hasActed ? '#424242' : borderColor}`,
        boxShadow: isCurrentTurn
          ? '0 0 12px rgba(212, 175, 55, 0.5), 0 0 24px rgba(212, 175, 55, 0.3)'
          : entry.hasActed
            ? 'none'
            : `0 2px 8px rgba(0, 0, 0, 0.3)`,
        opacity: entry.hasActed ? 0.6 : 1,
        cursor: onEntryClick ? 'pointer' : 'default',
        transition: 'all 200ms ease',
      }}
    >
      {/* Current turn indicator */}
      {isCurrentTurn && (
        <div
          style={{
            position: 'absolute',
            left: -12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#D4AF37',
          }}
        >
          <ChevronRight size={16} />
        </div>
      )}
      
      {/* Turn order number */}
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: isCurrentTurn
            ? 'linear-gradient(135deg, #D4AF37 0%, #B8960F 100%)'
            : 'rgba(45, 45, 45, 0.8)',
          border: `1px solid ${isCurrentTurn ? '#D4AF37' : '#424242'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: isCurrentTurn ? '#1A1A1A' : '#757575',
          flexShrink: 0,
        }}
      >
        {turnIndex + 1}
      </div>
      
      {/* Portrait */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: entry.portrait
            ? `url(${entry.portrait}) center/cover`
            : `linear-gradient(135deg, ${entry.isAlly ? '#006B3F' : '#8B0000'} 0%, ${entry.isAlly ? '#00A86B' : '#C41E3A'} 100%)`,
          border: `2px solid ${entry.hasActed ? '#424242' : borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          color: '#FDF6E3',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
          filter: entry.hasActed ? 'grayscale(0.8)' : 'none',
          flexShrink: 0,
        }}
      >
        {!entry.portrait && (entry.nameCjk?.[0] || entry.name[0])}
      </div>
      
      {/* Name and Initiative */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: entry.nameCjk ? '"Noto Serif SC", SimSun, serif' : '"Cinzel", Georgia, serif',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: entry.hasActed ? '#757575' : '#FDF6E3',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {entry.nameCjk || entry.name}
        </div>
        {entry.name && entry.nameCjk && (
          <div
            style={{
              fontFamily: '"Cinzel", Georgia, serif',
              fontSize: '0.625rem',
              color: entry.hasActed ? '#424242' : '#D4C5A9',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {entry.name}
          </div>
        )}
      </div>
      
      {/* Initiative value */}
      {showInitiativeValue && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.25rem 0.5rem',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '2px',
          }}
        >
          <Zap size={12} color={entry.hasActed ? '#424242' : '#D4AF37'} />
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: entry.hasActed ? '#424242' : '#D4C5A9',
            }}
          >
            {entry.initiative}
          </span>
        </div>
      )}
      
      {/* Status effects */}
      {entry.statusEffects && entry.statusEffects.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '0.125rem',
          }}
        >
          {entry.statusEffects.slice(0, 3).map((effect, i) => (
            <div
              key={i}
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00A86B 0%, #006B3F 100%)',
                border: '1px solid #006B3F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.5rem',
                color: '#FDF6E3',
              }}
            >
              {effect[0]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InitiativePanel;
