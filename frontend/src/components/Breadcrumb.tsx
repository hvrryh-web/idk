/**
 * Breadcrumb - Navigation breadcrumb component for page hierarchy
 * 
 * Provides visual path navigation and quick access to parent pages
 */

import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ElementType;
}

// Route to breadcrumb mapping
const routeBreadcrumbs: Record<string, BreadcrumbItem[]> = {
  "/home": [{ label: "Home", path: "/home", icon: Home }],
  "/profile": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Profile", path: "/profile" },
  ],
  "/game": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Game", path: "/game" },
  ],
  "/map-hub": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Map Hub", path: "/map-hub" },
  ],
  "/dynamic-map": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Map Hub", path: "/map-hub" },
    { label: "Dynamic Map", path: "/dynamic-map" },
  ],
  "/war-map": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Map Hub", path: "/map-hub" },
    { label: "War Map", path: "/war-map" },
  ],
  "/city": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Map Hub", path: "/map-hub" },
    { label: "City", path: "/city" },
  ],
  "/region": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Map Hub", path: "/map-hub" },
    { label: "Region", path: "/region" },
  ],
  "/world": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Map Hub", path: "/map-hub" },
    { label: "World", path: "/world" },
  ],
  "/realm-map": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Map Hub", path: "/map-hub" },
    { label: "Realm", path: "/realm-map" },
  ],
  "/battle-hub": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Battle Hub", path: "/battle-hub" },
  ],
  "/combat-test": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Battle Hub", path: "/battle-hub" },
    { label: "Combat Test", path: "/combat-test" },
  ],
  "/rotk/city": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Battle Hub", path: "/battle-hub" },
    { label: "ROTK City", path: "/rotk/city" },
  ],
  "/rotk/war": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Battle Hub", path: "/battle-hub" },
    { label: "ROTK War", path: "/rotk/war" },
  ],
  "/rotk/battle": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Battle Hub", path: "/battle-hub" },
    { label: "ROTK Battle", path: "/rotk/battle" },
  ],
  "/rotk/siege": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Battle Hub", path: "/battle-hub" },
    { label: "ROTK Siege", path: "/rotk/siege" },
  ],
  "/codex-hub": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Codex Hub", path: "/codex-hub" },
  ],
  "/wiki": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Codex Hub", path: "/codex-hub" },
    { label: "Wiki", path: "/wiki" },
  ],
  "/srd": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Codex Hub", path: "/codex-hub" },
    { label: "SRD Book", path: "/srd" },
  ],
  "/codex-styleboard": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Codex Hub", path: "/codex-hub" },
    { label: "Style Board", path: "/codex-styleboard" },
  ],
  "/codex-characters": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Codex Hub", path: "/codex-hub" },
    { label: "Characters", path: "/codex-characters" },
  ],
  "/personal-hub": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Personal Hub", path: "/personal-hub" },
  ],
  "/personal": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Personal Hub", path: "/personal-hub" },
    { label: "Personal View", path: "/personal" },
  ],
  "/conversation": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Personal Hub", path: "/personal-hub" },
    { label: "Conversation", path: "/conversation" },
  ],
  "/quest-hub": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Quest Hub", path: "/quest-hub" },
  ],
  "/tools-hub": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Tools Hub", path: "/tools-hub" },
  ],
  "/fate-card-builder": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Tools Hub", path: "/tools-hub" },
    { label: "Fate Card Builder", path: "/fate-card-builder" },
  ],
  "/ascii-art": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Tools Hub", path: "/tools-hub" },
    { label: "ASCII Art", path: "/ascii-art" },
  ],
  "/ascii": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Tools Hub", path: "/tools-hub" },
    { label: "ASCII Visualizer", path: "/ascii" },
  ],
  "/characters": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Characters", path: "/characters" },
  ],
  "/characters/create": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Characters", path: "/characters" },
    { label: "Create", path: "/characters/create" },
  ],
  "/character/create": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Tools Hub", path: "/tools-hub" },
    { label: "Character Creator", path: "/character/create" },
  ],
  "/characters/showcase": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Characters", path: "/characters" },
    { label: "Showcase", path: "/characters/showcase" },
  ],
  "/character-stats": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Character Stats", path: "/character-stats" },
  ],
  "/help": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Help", path: "/help" },
  ],
  "/gm-dashboard": [
    { label: "Home", path: "/home", icon: Home },
    { label: "GM Dashboard", path: "/gm-dashboard" },
  ],
  "/showcase": [
    { label: "Home", path: "/home", icon: Home },
    { label: "Showcase", path: "/showcase" },
  ],
};

export default function Breadcrumb() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get breadcrumb items for current path
  const items = routeBreadcrumbs[location.pathname] || [
    { label: "Home", path: "/home", icon: Home },
  ];

  // Don't show breadcrumb on home page or root
  if (location.pathname === "/home" || location.pathname === "/") {
    return null;
  }

  return (
    <nav 
      className="breadcrumb"
      aria-label="Breadcrumb navigation"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 2rem',
        background: 'rgba(253,246,227,0.95)',
        borderBottom: '1px solid var(--imperial-gold, #d4af37)',
        fontFamily: 'Cinzel, serif',
        fontSize: '0.9rem',
        flexWrap: 'wrap',
      }}
    >
      {items.map((item, index) => (
        <span key={item.path} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {index > 0 && (
            <ChevronRight 
              size={16} 
              style={{ color: 'var(--imperial-bronze, #cd7f32)', opacity: 0.7 }} 
            />
          )}
          <button
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: 'none',
              border: 'none',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              cursor: index === items.length - 1 ? 'default' : 'pointer',
              color: index === items.length - 1 ? 'var(--dynasty-red, #8b0000)' : '#666',
              fontWeight: index === items.length - 1 ? 'bold' : 'normal',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              if (index !== items.length - 1) {
                e.currentTarget.style.background = 'rgba(212,175,55,0.2)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
            }}
            disabled={index === items.length - 1}
          >
            {item.icon && <item.icon size={14} />}
            {item.label}
          </button>
        </span>
      ))}
    </nav>
  );
}
