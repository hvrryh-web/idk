/**
 * HomePage - Main landing hub for the WuXuxian TTRPG
 * 
 * Central navigation hub that provides quick access to all major features.
 */

import { useNavigate } from "react-router-dom";
import { 
  Map, 
  Gamepad2, 
  User, 
  Swords, 
  BookOpen, 
  BarChart2, 
  ScrollText,
  Compass
} from "lucide-react";
import Button from "../components/Button";

interface NavCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  route: string;
  color: string;
}

const navCards: NavCard[] = [
  {
    id: "map",
    title: "Map Hub",
    description: "Explore the world through dynamic, war, city, region, world, and realm maps",
    icon: Map,
    route: "/map-hub",
    color: "var(--jade-green)",
  },
  {
    id: "game",
    title: "Game Screen",
    description: "Enter the visual novel gameplay experience with Zhou Xu advisor",
    icon: Gamepad2,
    route: "/game",
    color: "var(--dynasty-red)",
  },
  {
    id: "personal",
    title: "Personal",
    description: "Character conversations and showcase gallery",
    icon: User,
    route: "/personal-hub",
    color: "var(--soul-essence)",
  },
  {
    id: "battle",
    title: "Battle & Combat",
    description: "ROTK-style battles: city, region, war, skirmish, siege, and standard combat",
    icon: Swords,
    route: "/battle-hub",
    color: "var(--fire-red)",
  },
  {
    id: "codex",
    title: "Codex",
    description: "Knowledge wiki, tutorials, character, lore, city, and world codex entries",
    icon: BookOpen,
    route: "/codex-hub",
    color: "var(--imperial-gold)",
  },
  {
    id: "stats",
    title: "Character Stats",
    description: "View detailed character statistics, abilities, and progression",
    icon: BarChart2,
    route: "/character-stats",
    color: "var(--water-blue)",
  },
  {
    id: "quests",
    title: "Quest Log",
    description: "Track active quests, objectives, and rewards",
    icon: ScrollText,
    route: "/quest-hub",
    color: "var(--earth-yellow)",
  },
  {
    id: "explore",
    title: "Alpha Test",
    description: "Launch the alpha test experience with character creation",
    icon: Compass,
    route: "/",
    color: "var(--aether-primary)",
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div 
      className="home-page"
      style={{
        background: 'var(--parchment)',
        borderRadius: '18px',
        boxShadow: '0 4px 24px rgba(124,63,0,0.08)',
        border: '6px solid #c9b18a',
        fontFamily: 'Cinzel, serif',
        color: '#3a2c13',
        padding: '2rem',
        margin: '2rem auto',
        maxWidth: '1400px',
      }}
    >
      {/* Hero Section */}
      <div 
        style={{
          textAlign: 'center',
          padding: '2rem 1rem 3rem',
          borderBottom: '3px solid var(--imperial-gold)',
          marginBottom: '2rem',
        }}
      >
        <h1 
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '3rem',
            color: 'var(--dynasty-red)',
            margin: '0 0 0.5rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          WuXuxian TTRPG
        </h1>
        <p 
          style={{
            fontSize: '1.25rem',
            color: 'var(--text-muted)',
            margin: 0,
          }}
        >
          Romance of the Three Kingdoms • Xianxia Visual Novel Experience
        </p>
      </div>

      {/* Navigation Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          padding: '1rem',
        }}
      >
        {navCards.map((card) => (
          <div
            key={card.id}
            onClick={() => navigate(card.route)}
            style={{
              background: 'linear-gradient(135deg, rgba(253,246,227,0.9), rgba(212,193,169,0.9))',
              border: `3px solid ${card.color}`,
              borderRadius: '12px',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.15), 0 0 20px ${card.color}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
          >
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '0.75rem',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: card.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 2px 8px ${card.color}60`,
                }}
              >
                <card.icon size={24} color="white" />
              </div>
              <h3 
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  color: '#3a2c13',
                }}
              >
                {card.title}
              </h3>
            </div>
            <p 
              style={{
                margin: 0,
                fontSize: '0.95rem',
                color: '#666',
                lineHeight: '1.5',
              }}
            >
              {card.description}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div 
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'rgba(0,0,0,0.03)',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <Button
          variant="primary"
          size="large"
          onClick={() => navigate("/characters")}
        >
          Character Manager
        </Button>
        <Button
          variant="secondary"
          size="large"
          onClick={() => navigate("/wiki")}
        >
          Knowledge Wiki
        </Button>
        <Button
          variant="secondary"
          size="large"
          onClick={() => navigate("/help")}
        >
          Help Center
        </Button>
      </div>
    </div>
  );
}
