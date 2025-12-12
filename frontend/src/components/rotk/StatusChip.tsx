/**
 * StatusChip - Buff/Debuff indicator chips with period styling
 */

import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import '../styles/rotkTheme.css';

export type ChipVariant = 'buff' | 'debuff' | 'neutral';

interface StatusChipProps {
  variant?: ChipVariant;
  label: string;
  value?: string | number;
  showArrow?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const variantStyles: Record<ChipVariant, React.CSSProperties> = {
  buff: {
    background: 'linear-gradient(135deg, #00A86B 0%, #006B3F 100%)',
    color: '#FDF6E3',
    border: '1px solid #006B3F',
    boxShadow: '0 2px 4px rgba(0,0,0,0.15), 0 0 8px rgba(0, 168, 107, 0.3)',
  },
  debuff: {
    background: 'linear-gradient(135deg, #8B0000 0%, #660000 100%)',
    color: '#FDF6E3',
    border: '1px solid #660000',
    boxShadow: '0 2px 4px rgba(0,0,0,0.15), 0 0 8px rgba(139, 0, 0, 0.3)',
  },
  neutral: {
    background: 'linear-gradient(135deg, #4682B4 0%, #2E5C7B 100%)',
    color: '#FDF6E3',
    border: '1px solid #2E5C7B',
    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
  },
};

const ArrowIcon: Record<ChipVariant, React.FC<{ size: number }>> = {
  buff: ArrowUp,
  debuff: ArrowDown,
  neutral: Minus,
};

export function StatusChip({
  variant = 'neutral',
  label,
  value,
  showArrow = true,
  className = '',
  style = {},
}: StatusChipProps) {
  const Icon = ArrowIcon[variant];
  
  return (
    <div
      className={`rotk-status-chip ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.25rem 0.5rem',
        borderRadius: '2px',
        fontFamily: '"Inter", sans-serif',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        ...variantStyles[variant],
        ...style,
      }}
    >
      {showArrow && <Icon size={12} />}
      <span>{label}</span>
      {value !== undefined && (
        <span style={{ fontWeight: 700 }}>{value}</span>
      )}
    </div>
  );
}

export default StatusChip;
