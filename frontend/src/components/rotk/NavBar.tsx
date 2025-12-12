/**
 * NavBar - Bottom navigation bar with icon+label tabs
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import '../styles/rotkTheme.css';

export interface NavTab {
  id: string;
  label: string;
  labelCjk?: string;
  icon: LucideIcon;
}

interface NavBarProps {
  tabs: NavTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function NavBar({
  tabs,
  activeTab,
  onTabChange,
  className = '',
  style = {},
}: NavBarProps) {
  return (
    <nav
      className={`rotk-navbar ${className}`}
      style={{
        display: 'flex',
        alignItems: 'stretch',
        background: 'linear-gradient(180deg, #2D2D2D 0%, #1A1A1A 100%)',
        borderTop: '3px solid #CD7F32',
        borderBottom: '2px solid #1A1A1A',
        padding: '0.25rem',
        gap: '0.25rem',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.3)',
        ...style,
      }}
    >
      {tabs.map(tab => {
        const isActive = tab.id === activeTab;
        const Icon = tab.icon;
        
        return (
          <NavTabButton
            key={tab.id}
            tab={tab}
            isActive={isActive}
            onClick={() => onTabChange(tab.id)}
          />
        );
      })}
    </nav>
  );
}

interface NavTabButtonProps {
  tab: NavTab;
  isActive: boolean;
  onClick: () => void;
}

function NavTabButton({ tab, isActive, onClick }: NavTabButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const Icon = tab.icon;
  
  const getBackground = () => {
    if (isActive) return 'linear-gradient(135deg, #C41E3A 0%, #8B0000 100%)';
    if (isHovered) return 'linear-gradient(135deg, #424242 0%, #2D2D2D 100%)';
    return 'linear-gradient(135deg, #FDF6E3 0%, #D4C5A9 100%)';
  };
  
  const getColor = () => {
    if (isActive) return '#FDF6E3';
    if (isHovered) return '#D4AF37';
    return '#1A1A1A';
  };
  
  const getBorder = () => {
    if (isActive) return '2px solid #D4AF37';
    if (isHovered) return '2px solid #D4AF37';
    return '2px solid #CD7F32';
  };
  
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.25rem',
        padding: '0.5rem 0.75rem',
        background: getBackground(),
        border: getBorder(),
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'all 150ms cubic-bezier(0, 0, 0.2, 1)',
        boxShadow: isActive
          ? '0 0 10px rgba(212, 175, 55, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
          : isHovered
          ? '0 0 8px rgba(212, 175, 55, 0.3)'
          : 'none',
      }}
    >
      <Icon
        size={20}
        strokeWidth={2}
        style={{
          color: getColor(),
          filter: isActive ? 'drop-shadow(0 0 4px rgba(212, 175, 55, 0.5))' : 'none',
        }}
      />
      {tab.labelCjk && (
        <span
          style={{
            fontFamily: '"Noto Serif SC", SimSun, serif',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: getColor(),
            lineHeight: 1,
          }}
        >
          {tab.labelCjk}
        </span>
      )}
      <span
        style={{
          fontFamily: '"Cinzel", Georgia, serif',
          fontSize: '0.625rem',
          fontWeight: 600,
          color: getColor(),
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          lineHeight: 1,
          opacity: tab.labelCjk ? 0.8 : 1,
        }}
      >
        {tab.label}
      </span>
    </button>
  );
}

export default NavBar;
