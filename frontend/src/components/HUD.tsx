import React from 'react';
import { Heart, Zap, Shield, Target, Wind } from 'lucide-react';

interface HUDProps {
  character?: {
    name: string;
    level: number;
    hp: number;
    maxHp: number;
    ae: number;
    maxAe: number;
    guard: number;
    strain: number;
    scl: number;
  };
  gameState?: {
    round: number;
    phase: string;
  };
}

export default function HUD({ character, gameState }: HUDProps) {
  // Default character for demo
  const char = character || {
    name: 'Cultivator',
    level: 5,
    hp: 85,
    maxHp: 120,
    ae: 45,
    maxAe: 60,
    guard: 12,
    strain: 8,
    scl: 7,
  };

  const state = gameState || {
    round: 1,
    phase: 'Player Turn',
  };

  const hpPercent = (char.hp / char.maxHp) * 100;
  const aePercent = (char.ae / char.maxAe) * 100;

  return (
    <div className="game-hud">
      {/* Top HUD Bar - Game State */}
      <div className="hud-top-bar">
        <div className="hud-round-indicator">
          <span className="hud-label">ROUND</span>
          <span className="hud-value">{state.round}</span>
        </div>
        <div className="hud-phase-indicator">
          <span className="hud-phase-text">{state.phase}</span>
        </div>
        <div className="hud-scl-indicator">
          <span className="hud-label">SCL</span>
          <span className="hud-value scl-badge">{char.scl}</span>
        </div>
      </div>

      {/* Bottom Left HUD - Character Stats */}
      <div className="hud-character-panel">
        <div className="hud-character-header">
          <div className="character-avatar">
            <div className="avatar-placeholder">{char.name[0]}</div>
          </div>
          <div className="character-info">
            <h3 className="character-name">{char.name}</h3>
            <span className="character-level">Level {char.level}</span>
          </div>
        </div>

        {/* HP Bar */}
        <div className="hud-stat-row">
          <div className="stat-icon hp-icon">
            <Heart size={20} strokeWidth={2} />
          </div>
          <div className="stat-bar-container">
            <div className="stat-label-row">
              <span className="stat-label">HP</span>
              <span className="stat-value">{char.hp}/{char.maxHp}</span>
            </div>
            <div className="stat-bar">
              <div 
                className="stat-bar-fill hp-fill" 
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* AE Bar */}
        <div className="hud-stat-row">
          <div className="stat-icon ae-icon">
            <Zap size={20} strokeWidth={2} />
          </div>
          <div className="stat-bar-container">
            <div className="stat-label-row">
              <span className="stat-label">AE</span>
              <span className="stat-value">{char.ae}/{char.maxAe}</span>
            </div>
            <div className="stat-bar">
              <div 
                className="stat-bar-fill ae-fill" 
                style={{ width: `${aePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="hud-secondary-stats">
          <div className="secondary-stat">
            <Shield size={16} strokeWidth={2} />
            <span className="secondary-stat-label">Guard</span>
            <span className="secondary-stat-value">{char.guard}</span>
          </div>
          <div className="secondary-stat">
            <Target size={16} strokeWidth={2} />
            <span className="secondary-stat-label">Strain</span>
            <span className="secondary-stat-value strain-value">{char.strain}</span>
          </div>
        </div>
      </div>

      {/* Bottom Right HUD - Quick Actions */}
      <div className="hud-quick-actions">
        <button className="quick-action-btn">
          <Wind size={20} strokeWidth={2} />
          <span>Quick Action</span>
        </button>
        <button className="quick-action-btn">
          <Target size={20} strokeWidth={2} />
          <span>Technique</span>
        </button>
      </div>
    </div>
  );
}
