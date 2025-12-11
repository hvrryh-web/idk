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
    <div className="game-hud-persona">
      {/* Top Status Bar - Persona Style */}
      <div className="hud-top-status-bar">
        <div className="hud-status-left">
          <div className="status-badge">
            <span className="badge-label">ROUND</span>
            <span className="badge-value">{state.round}</span>
          </div>
          <div className="status-phase">
            <span className="phase-text">{state.phase}</span>
          </div>
        </div>
        <div className="hud-status-right">
          <div className="status-badge scl-badge-wrapper">
            <span className="badge-label">SCL</span>
            <span className="badge-value scl-value">{char.scl}</span>
          </div>
        </div>
      </div>

      {/* Bottom HUD Bar - Character Info (Persona 4/5 Style) */}
      <div className="hud-bottom-bar">
        {/* Left Section - Character Identity */}
        <div className="hud-char-identity">
          <div className="char-avatar-box">
            <div className="avatar-inner">{char.name[0]}</div>
          </div>
          <div className="char-name-level">
            <h3 className="char-name-text">{char.name}</h3>
            <span className="char-level-text">LV.{char.level}</span>
          </div>
        </div>

        {/* Center Section - HP and AE Bars */}
        <div className="hud-stats-bars">
          <div className="stat-bar-item">
            <div className="stat-bar-header">
              <Heart size={18} strokeWidth={2.5} />
              <span className="stat-bar-label">HP</span>
              <span className="stat-bar-value">{char.hp}<span className="stat-max">/{char.maxHp}</span></span>
            </div>
            <div className="stat-progress-bar">
              <div className="stat-progress-fill hp-progress" style={{ width: `${hpPercent}%` }} />
            </div>
          </div>
          <div className="stat-bar-item">
            <div className="stat-bar-header">
              <Zap size={18} strokeWidth={2.5} />
              <span className="stat-bar-label">AE</span>
              <span className="stat-bar-value">{char.ae}<span className="stat-max">/{char.maxAe}</span></span>
            </div>
            <div className="stat-progress-bar">
              <div className="stat-progress-fill ae-progress" style={{ width: `${aePercent}%` }} />
            </div>
          </div>
        </div>

        {/* Right Section - Secondary Stats and Actions */}
        <div className="hud-right-section">
          <div className="hud-mini-stats">
            <div className="mini-stat-box">
              <Shield size={14} strokeWidth={2} />
              <span className="mini-stat-value">{char.guard}</span>
            </div>
            <div className="mini-stat-box strain-box">
              <Target size={14} strokeWidth={2} />
              <span className="mini-stat-value">{char.strain}</span>
            </div>
          </div>
          <div className="hud-action-buttons">
            <button className="hud-action-btn action-primary">
              <Wind size={16} strokeWidth={2.5} />
            </button>
            <button className="hud-action-btn action-secondary">
              <Target size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
