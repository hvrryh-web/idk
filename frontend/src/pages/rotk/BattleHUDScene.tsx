/**
 * BattleHUDScene - Demo scene with battle HUD, character plates, clash indicator, damage numbers
 */

import React, { useState, useCallback } from 'react';
import {
  CharacterPlate,
  ClashIndicator,
  StatusChip,
  ROTKButton,
  useDamageNumbers,
  CharacterPlateUnit,
} from '../../components/rotk';
import { Swords, Shield, Zap, RotateCcw } from 'lucide-react';
import '../../styles/rotkTheme.css';

const leftUnit: CharacterPlateUnit = {
  id: 'player-1',
  name: 'Zhao Yun',
  nameCjk: '赵云',
  title: 'Five Tiger General',
  unitType: 'Cavalry',
  hp: 85,
  maxHp: 120,
  guard: 12,
  strain: 8,
  ae: 45,
  maxAe: 60,
  skill: 'Dragon Spear',
  skillCjk: '龙胆',
  buffs: [{ label: 'ATK', value: '+15%' }],
};

const rightUnit: CharacterPlateUnit = {
  id: 'enemy-1',
  name: 'Zhang Liao',
  nameCjk: '张辽',
  title: 'Wei General',
  unitType: 'Infantry',
  hp: 102,
  maxHp: 150,
  guard: 8,
  strain: 15,
  ae: 30,
  maxAe: 50,
  skill: 'Retaliation',
  skillCjk: '反击',
  debuffs: [{ label: 'DEF', value: '-10%' }],
};

export function BattleHUDScene() {
  const [leftHP, setLeftHP] = useState(leftUnit.hp);
  const [rightHP, setRightHP] = useState(rightUnit.hp);
  const [advantage, setAdvantage] = useState<'left' | 'right' | 'neutral'>('neutral');
  const [combo, setCombo] = useState(0);
  const [statusText, setStatusText] = useState('');
  
  const { addDamage, DamageContainer } = useDamageNumbers();
  
  const handleAttack = useCallback((side: 'left' | 'right') => {
    const damage = Math.floor(Math.random() * 30) + 15;
    const isCritical = Math.random() < 0.2;
    const finalDamage = isCritical ? damage * 2 : damage;
    
    if (side === 'left') {
      // Left attacks right
      const newHP = Math.max(0, rightHP - finalDamage);
      setRightHP(newHP);
      addDamage(finalDamage, isCritical ? 'critical' : 'damage', { x: window.innerWidth * 0.65, y: 200 });
      setAdvantage('left');
      setStatusText('Attack!');
      setCombo(c => c + 1);
    } else {
      // Right attacks left
      const newHP = Math.max(0, leftHP - finalDamage);
      setLeftHP(newHP);
      addDamage(finalDamage, isCritical ? 'critical' : 'damage', { x: window.innerWidth * 0.35, y: 200 });
      setAdvantage('right');
      setStatusText('Counter!');
      setCombo(0);
    }
    
    setTimeout(() => {
      setStatusText('');
      setAdvantage('neutral');
    }, 1500);
  }, [leftHP, rightHP, addDamage]);
  
  const handleHeal = useCallback((side: 'left' | 'right') => {
    const heal = Math.floor(Math.random() * 20) + 10;
    
    if (side === 'left') {
      const maxHP = leftUnit.maxHp;
      setLeftHP(hp => Math.min(maxHP, hp + heal));
      addDamage(heal, 'heal', { x: window.innerWidth * 0.35, y: 200 });
    } else {
      const maxHP = rightUnit.maxHp;
      setRightHP(hp => Math.min(maxHP, hp + heal));
      addDamage(heal, 'heal', { x: window.innerWidth * 0.65, y: 200 });
    }
  }, [addDamage]);
  
  const handleReset = () => {
    setLeftHP(leftUnit.hp);
    setRightHP(rightUnit.hp);
    setAdvantage('neutral');
    setCombo(0);
    setStatusText('');
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
      {/* Battle Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at center, #2D2D2D 0%, #1A1A1A 70%, #0A0A0A 100%)
          `,
        }}
      >
        {/* Battlefield atmosphere */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(180deg, 
                rgba(139, 0, 0, 0.1) 0%, 
                transparent 30%, 
                transparent 70%, 
                rgba(0, 0, 0, 0.3) 100%
              )
            `,
          }}
        />
        
        {/* Smoke/dust effects */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '30%',
            background: 'linear-gradient(180deg, transparent 0%, rgba(100, 80, 60, 0.2) 100%)',
          }}
        />
      </div>
      
      {/* Floating Damage Numbers Container */}
      <DamageContainer />
      
      {/* Battle HUD Layout */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem',
          boxSizing: 'border-box',
        }}
      >
        {/* Top: Turn/Phase Indicator */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
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
        </div>
        
        {/* Main Battle Area */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
          }}
        >
          {/* Left Character Plate */}
          <CharacterPlate
            unit={{ ...leftUnit, hp: leftHP }}
            side="left"
            isActive={advantage === 'left'}
          />
          
          {/* Center: Clash Indicator */}
          <ClashIndicator
            advantage={advantage}
            statusText={statusText}
            linkedCombo={combo > 0 ? combo : undefined}
          />
          
          {/* Right Character Plate */}
          <CharacterPlate
            unit={{ ...rightUnit, hp: rightHP }}
            side="right"
            isActive={advantage === 'right'}
          />
        </div>
        
        {/* Bottom: Action Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '2rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.625rem', color: '#D4C5A9', textTransform: 'uppercase' }}>
              {leftUnit.nameCjk}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <ROTKButton
                variant="primary"
                size="medium"
                icon={Swords}
                onClick={() => handleAttack('left')}
                disabled={leftHP <= 0}
              >
                Attack
              </ROTKButton>
              <ROTKButton
                variant="gold"
                size="medium"
                icon={Zap}
                onClick={() => handleHeal('left')}
                disabled={leftHP <= 0}
              >
                Heal
              </ROTKButton>
            </div>
          </div>
          
          <ROTKButton
            variant="secondary"
            size="medium"
            icon={RotateCcw}
            onClick={handleReset}
          >
            Reset
          </ROTKButton>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.625rem', color: '#D4C5A9', textTransform: 'uppercase' }}>
              {rightUnit.nameCjk}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <ROTKButton
                variant="primary"
                size="medium"
                icon={Swords}
                onClick={() => handleAttack('right')}
                disabled={rightHP <= 0}
              >
                Attack
              </ROTKButton>
              <ROTKButton
                variant="gold"
                size="medium"
                icon={Zap}
                onClick={() => handleHeal('right')}
                disabled={rightHP <= 0}
              >
                Heal
              </ROTKButton>
            </div>
          </div>
        </div>
        
        {/* Victory/Defeat Overlay */}
        {(leftHP <= 0 || rightHP <= 0) && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.7)',
              zIndex: 100,
            }}
          >
            <div
              style={{
                padding: '2rem 4rem',
                background: leftHP <= 0
                  ? 'linear-gradient(135deg, #8B0000 0%, #4A0000 100%)'
                  : 'linear-gradient(135deg, #D4AF37 0%, #CD7F32 100%)',
                border: `4px solid ${leftHP <= 0 ? '#C41E3A' : '#D4AF37'}`,
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}
            >
              <h1
                style={{
                  fontFamily: '"Cinzel", Georgia, serif',
                  fontSize: '3rem',
                  fontWeight: 800,
                  color: leftHP <= 0 ? '#FDF6E3' : '#1A1A1A',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  textShadow: leftHP <= 0
                    ? '0 4px 8px rgba(0,0,0,0.5)'
                    : '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                {leftHP <= 0 ? 'Defeat' : 'Victory'}
              </h1>
            </div>
          </div>
        )}
      </div>
      
      {/* Scene Title */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          padding: '0.5rem 1rem',
          background: 'rgba(26, 26, 26, 0.8)',
          border: '1px solid #CD7F32',
          borderRadius: '4px',
          zIndex: 10,
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
          Battle HUD Demo
        </span>
      </div>
    </div>
  );
}

export default BattleHUDScene;
