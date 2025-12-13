/**
 * Ro3KBattleScene - Enhanced Romance of Three Kingdoms Battle Scene
 * 
 * Features large character busts, detailed stat panels, floating damage pills,
 * and battle animations matching classic Ro3K game aesthetics.
 */

import { useState, useCallback } from 'react';
import {
  Ro3KCharacterPanel,
  Ro3KDamagePill,
  Ro3KClashDisplay,
  Ro3KCharacterStats,
} from '../../components/rotk/Ro3KBattleHUD';
import { ROTKButton } from '../../components/rotk';
import { Swords, Zap, RotateCcw, Shield } from 'lucide-react';
import '../../styles/rotkTheme.css';

// Demo character data matching Ro3K style
const leftCharacter: Ro3KCharacterStats = {
  id: 'guan-yu',
  name: 'Guan Yu',
  nameCjk: '关羽',
  troops: 8000,
  maxTroops: 10000,
  atk: 292,
  def: 312,
  int: 102,
  str: 86,
  skillName: 'Spearwall',
  skillNameCjk: '枪阵',
  unitType: 'Light Infantry',
  statusEffects: [
    { name: 'Chivalrous Spirit', type: 'buff' },
    { name: 'Dignity', type: 'buff' },
  ],
};

const rightCharacter: Ro3KCharacterStats = {
  id: 'cao-ren',
  name: 'Cao Ren',
  nameCjk: '曹仁',
  troops: 7677,
  maxTroops: 10000,
  atk: 264,
  def: 284,
  int: 59,
  str: 86,
  skillName: 'Retaliation',
  skillNameCjk: '反击',
  unitType: 'Light Infantry',
  statusEffects: [],
};

interface DamageInstance {
  id: string;
  value: number;
  type: 'normal' | 'critical' | 'heal';
  position: { x: number; y: number };
  delay: number;
}

export function Ro3KBattleScene() {
  const [leftTroops, setLeftTroops] = useState(leftCharacter.troops);
  const [rightTroops, setRightTroops] = useState(rightCharacter.troops);
  const [advantage, setAdvantage] = useState<'left' | 'right' | 'neutral'>('neutral');
  const [linkedCount, setLinkedCount] = useState(0);
  const [damageBonus, setDamageBonus] = useState(0);
  const [damages, setDamages] = useState<DamageInstance[]>([]);
  const [statusChange, setStatusChange] = useState<{ target: 'left' | 'right'; chance: number } | undefined>();

  const addDamage = useCallback((value: number, type: 'normal' | 'critical' | 'heal', x: number, delay = 0) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setDamages(prev => [...prev, { id, value, type, position: { x, y: 180 }, delay }]);
    setTimeout(() => {
      setDamages(prev => prev.filter(d => d.id !== id));
    }, 1500);
  }, []);

  const handleAttack = useCallback((side: 'left' | 'right') => {
    const baseDamage = Math.floor(Math.random() * 2000) + 500;
    const centerX = window.innerWidth / 2;
    
    if (side === 'left') {
      // Left attacks right - create multiple damage numbers
      const damages = [
        { value: Math.floor(baseDamage * 0.15), delay: 0 },
        { value: Math.floor(baseDamage * 1.0), delay: 100 },
        { value: Math.floor(baseDamage * 0.8), delay: 200 },
        { value: Math.floor(baseDamage * 0.7), delay: 300 },
      ];
      
      damages.forEach((d, i) => {
        const xOffset = (i - 1.5) * 80;
        addDamage(d.value, i === 1 ? 'critical' : 'normal', centerX + xOffset, d.delay);
      });
      
      const totalDamage = damages.reduce((sum, d) => sum + d.value, 0);
      setRightTroops(prev => Math.max(0, prev - Math.floor(totalDamage / 10)));
      setAdvantage('left');
      setLinkedCount(prev => prev + 1);
      setDamageBonus(prev => Math.min(200, prev + 30));
      setStatusChange(undefined);
    } else {
      // Right attacks left
      const damage = baseDamage;
      addDamage(damage, 'normal', centerX);
      setLeftTroops(prev => Math.max(0, prev - Math.floor(damage / 10)));
      setAdvantage('right');
      setLinkedCount(0);
      setDamageBonus(0);
      setStatusChange({ target: 'left', chance: 42 });
    }
    
    setTimeout(() => {
      setAdvantage('neutral');
    }, 2000);
  }, [addDamage]);

  const handleHeal = useCallback((side: 'left' | 'right') => {
    const heal = Math.floor(Math.random() * 500) + 200;
    const centerX = window.innerWidth / 2;
    
    if (side === 'left') {
      addDamage(heal, 'heal', centerX - 200);
      setLeftTroops(prev => Math.min(leftCharacter.maxTroops, prev + Math.floor(heal / 5)));
    } else {
      addDamage(heal, 'heal', centerX + 200);
      setRightTroops(prev => Math.min(rightCharacter.maxTroops, prev + Math.floor(heal / 5)));
    }
  }, [addDamage]);

  const handleReset = () => {
    setLeftTroops(leftCharacter.troops);
    setRightTroops(rightCharacter.troops);
    setAdvantage('neutral');
    setLinkedCount(0);
    setDamageBonus(0);
    setDamages([]);
    setStatusChange(undefined);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#1A1A1A',
      }}
    >
      {/* Battle Background - Mountain landscape */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(180deg, 
              #87CEEB 0%, 
              #B0C4DE 20%, 
              #D4C5A9 50%, 
              #8B7355 70%, 
              #654321 100%
            )
          `,
        }}
      >
        {/* Mountain silhouettes */}
        <svg
          viewBox="0 0 1920 600"
          preserveAspectRatio="xMidYMax slice"
          style={{
            position: 'absolute',
            bottom: '40%',
            width: '100%',
            height: '50%',
          }}
        >
          {/* Far mountains */}
          <path
            d="M0 600 L0 350 L300 200 L500 280 L700 150 L900 250 L1100 100 L1300 200 L1500 120 L1700 220 L1920 180 L1920 600 Z"
            fill="#6B8E8E"
            opacity="0.5"
          />
          {/* Mid mountains */}
          <path
            d="M0 600 L0 400 L200 300 L400 380 L600 250 L800 350 L1000 200 L1200 320 L1400 220 L1600 340 L1800 260 L1920 320 L1920 600 Z"
            fill="#5C7575"
            opacity="0.7"
          />
          {/* Near mountains */}
          <path
            d="M0 600 L0 450 L150 380 L350 420 L500 350 L700 400 L850 320 L1000 380 L1200 300 L1400 360 L1600 280 L1800 350 L1920 310 L1920 600 Z"
            fill="#4A5555"
            opacity="0.9"
          />
        </svg>
        
        {/* Battle dust/smoke at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: `
              radial-gradient(ellipse at 50% 100%, rgba(139, 119, 85, 0.6) 0%, transparent 60%),
              linear-gradient(180deg, transparent 0%, rgba(101, 67, 33, 0.4) 50%, rgba(60, 40, 20, 0.6) 100%)
            `,
          }}
        />
        
        {/* Battle effects - particles */}
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '45%',
            width: '10%',
            height: '20%',
            background: 'radial-gradient(ellipse at center, rgba(255, 100, 0, 0.3) 0%, transparent 70%)',
            animation: 'rotk-pulse-glow 2s ease-in-out infinite',
          }}
        />
      </div>
      
      {/* Floating Damage Pills */}
      {damages.map(d => (
        <Ro3KDamagePill
          key={d.id}
          value={d.value}
          type={d.type}
          position={d.position}
          delay={d.delay}
        />
      ))}
      
      {/* Left Character Panel */}
      <Ro3KCharacterPanel
        character={{ ...leftCharacter, troops: leftTroops }}
        side="left"
        isActive={advantage === 'left'}
        linkedCount={linkedCount > 0 ? linkedCount : undefined}
        damageBonus={damageBonus > 0 ? damageBonus : undefined}
      />
      
      {/* Right Character Panel */}
      <Ro3KCharacterPanel
        character={{ ...rightCharacter, troops: rightTroops }}
        side="right"
        isActive={advantage === 'right'}
      />
      
      {/* Center Clash Display */}
      <Ro3KClashDisplay
        leftTroops={leftTroops}
        rightTroops={rightTroops}
        advantage={advantage}
        statusChange={statusChange}
      />
      
      {/* Top Turn Indicator */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '0.5rem 2rem',
          background: 'linear-gradient(135deg, #C41E3A 0%, #8B0000 100%)',
          border: '2px solid #D4AF37',
          borderRadius: '4px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4), 0 0 20px rgba(212, 175, 55, 0.3)',
        }}
      >
        <span
          style={{
            fontFamily: '"Cinzel", Georgia, serif',
            fontSize: '1rem',
            fontWeight: 700,
            color: '#FDF6E3',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Combat Phase • Round 3
        </span>
      </div>
      
      {/* Bottom Action Buttons */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '1rem',
          padding: '1rem',
          background: 'rgba(26, 26, 26, 0.9)',
          border: '2px solid #CD7F32',
          borderRadius: '8px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.625rem', color: '#D4C5A9' }}>{leftCharacter.nameCjk}</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <ROTKButton variant="primary" size="small" icon={Swords} onClick={() => handleAttack('left')} disabled={leftTroops <= 0}>
              Attack
            </ROTKButton>
            <ROTKButton variant="gold" size="small" icon={Zap} onClick={() => handleHeal('left')} disabled={leftTroops <= 0}>
              Heal
            </ROTKButton>
          </div>
        </div>
        
        <ROTKButton variant="secondary" size="small" icon={RotateCcw} onClick={handleReset}>
          Reset
        </ROTKButton>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.625rem', color: '#D4C5A9' }}>{rightCharacter.nameCjk}</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <ROTKButton variant="primary" size="small" icon={Swords} onClick={() => handleAttack('right')} disabled={rightTroops <= 0}>
              Attack
            </ROTKButton>
            <ROTKButton variant="gold" size="small" icon={Shield} onClick={() => handleHeal('right')} disabled={rightTroops <= 0}>
              Heal
            </ROTKButton>
          </div>
        </div>
      </div>
      
      {/* Victory/Defeat Overlay */}
      {(leftTroops <= 0 || rightTroops <= 0) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.8)',
            zIndex: 200,
          }}
        >
          <div
            style={{
              padding: '2rem 4rem',
              background: leftTroops <= 0
                ? 'linear-gradient(135deg, #8B0000 0%, #4A0000 100%)'
                : 'linear-gradient(135deg, #D4AF37 0%, #CD7F32 100%)',
              border: `4px solid ${leftTroops <= 0 ? '#C41E3A' : '#D4AF37'}`,
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          >
            <h1
              style={{
                fontFamily: '"Cinzel", Georgia, serif',
                fontSize: '3rem',
                fontWeight: 800,
                color: leftTroops <= 0 ? '#FDF6E3' : '#1A1A1A',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {leftTroops <= 0 ? 'Defeat' : 'Victory'}
            </h1>
          </div>
        </div>
      )}
      
      {/* Scene Label */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          right: 20,
          padding: '0.5rem 1rem',
          background: 'rgba(26, 26, 26, 0.8)',
          border: '1px solid #CD7F32',
          borderRadius: '4px',
        }}
      >
        <span
          style={{
            fontFamily: '"Cinzel", Georgia, serif',
            fontSize: '0.75rem',
            color: '#D4AF37',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Ro3K Battle Demo
        </span>
      </div>
    </div>
  );
}

export default Ro3KBattleScene;
