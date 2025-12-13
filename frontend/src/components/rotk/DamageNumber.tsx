/**
 * DamageNumber - Floating damage/heal number with animations
 */

import React, { useEffect, useState } from 'react';
import '../../styles/rotkTheme.css';

export type DamageType = 'damage' | 'critical' | 'heal' | 'block';

interface DamageNumberProps {
  value: number;
  type?: DamageType;
  position?: { x: number; y: number };
  onComplete?: () => void;
  className?: string;
}

const typeStyles: Record<DamageType, React.CSSProperties> = {
  damage: {
    color: '#C41E3A',
    textShadow: `
      0 0 10px #8B0000,
      2px 2px 0 #1A1A1A,
      -2px -2px 0 #1A1A1A,
      2px -2px 0 #1A1A1A,
      -2px 2px 0 #1A1A1A
    `,
  },
  critical: {
    color: '#D4AF37',
    textShadow: `
      0 0 15px #D4AF37,
      0 0 30px #CD7F32,
      2px 2px 0 #1A1A1A,
      -2px -2px 0 #1A1A1A,
      2px -2px 0 #1A1A1A,
      -2px 2px 0 #1A1A1A
    `,
  },
  heal: {
    color: '#00A86B',
    textShadow: `
      0 0 10px #006B3F,
      2px 2px 0 #1A1A1A,
      -2px -2px 0 #1A1A1A,
      2px -2px 0 #1A1A1A,
      -2px 2px 0 #1A1A1A
    `,
  },
  block: {
    color: '#C0C0C0',
    textShadow: `
      0 0 8px #A0A0A0,
      2px 2px 0 #1A1A1A,
      -2px -2px 0 #1A1A1A,
      2px -2px 0 #1A1A1A,
      -2px 2px 0 #1A1A1A
    `,
  },
};

const animations: Record<DamageType, string> = {
  damage: 'rotk-damage-float 1s cubic-bezier(0, 0, 0.2, 1) forwards',
  critical: 'rotk-damage-critical 1.2s cubic-bezier(0, 0, 0.2, 1) forwards',
  heal: 'rotk-heal-float 1s cubic-bezier(0, 0, 0.2, 1) forwards',
  block: 'rotk-damage-float 0.8s cubic-bezier(0, 0, 0.2, 1) forwards',
};

const fontSizes: Record<DamageType, string> = {
  damage: '2.5rem',
  critical: '3rem',
  heal: '2.5rem',
  block: '2rem',
};

export function DamageNumber({
  value,
  type = 'damage',
  position = { x: 0, y: 0 },
  onComplete,
  className = '',
}: DamageNumberProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const duration = type === 'critical' ? 1200 : 1000;
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [type, onComplete]);
  
  if (!isVisible) return null;
  
  const prefix = type === 'heal' ? '+' : type === 'block' ? '🛡️' : '-';
  
  return (
    <div
      className={`rotk-damage-number ${className}`}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        fontFamily: '"Cinzel", Georgia, serif',
        fontWeight: 800,
        fontSize: fontSizes[type],
        lineHeight: 1,
        pointerEvents: 'none',
        zIndex: 100,
        animation: animations[type],
        ...typeStyles[type],
      }}
    >
      {prefix}{Math.abs(value)}
    </div>
  );
}

/**
 * DamageNumberContainer - Container for managing multiple floating damage numbers
 */
interface DamageInstance {
  id: string;
  value: number;
  type: DamageType;
  position: { x: number; y: number };
}

export function useDamageNumbers() {
  const [damages, setDamages] = useState<DamageInstance[]>([]);
  
  const addDamage = (value: number, type: DamageType, position: { x: number; y: number }) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setDamages(prev => [...prev, { id, value, type, position }]);
  };
  
  const removeDamage = (id: string) => {
    setDamages(prev => prev.filter(d => d.id !== id));
  };
  
  const DamageContainer = () => (
    <>
      {damages.map(d => (
        <DamageNumber
          key={d.id}
          value={d.value}
          type={d.type}
          position={d.position}
          onComplete={() => removeDamage(d.id)}
        />
      ))}
    </>
  );
  
  return { addDamage, DamageContainer };
}

export default DamageNumber;
