/**
 * CodexHubPage - Hub page for all knowledge and reference content
 * 
 * Nested navigation for: Three Kingdoms Style Board, Guided Tutorial, 
 * Knowledge Wiki Links, Character Codex, Lore Codex, City Codex, World Codex
 */

import { useNavigate } from "react-router-dom";
import { 
  Layout, 
  GraduationCap,
  BookOpen,
  Users,
  Scroll,
  Building2,
  Globe,
  ArrowLeft,
  Library
} from "lucide-react";
import Button from "../components/Button";

interface CodexOption {
  id: string;
  title: string;
  titleCjk: string;
  description: string;
  icon: React.ElementType;
  route: string;
  color: string;
  status: 'available' | 'coming-soon';
}

const codexOptions: CodexOption[] = [
  {
    id: "styleboard",
    title: "Three Kingdoms Style Board",
    titleCjk: "三国风格板",
    description: "Visual style guide and component showcase for the ROTK UI system",
    icon: Layout,
    route: "/codex-styleboard",
    color: "var(--dynasty-red)",
    status: "available",
  },
  {
    id: "tutorial",
    title: "Guided Tutorial",
    titleCjk: "引导教程",
    description: "Interactive walkthrough of game mechanics and controls",
    icon: GraduationCap,
    route: "/codex-tutorial",
    color: "var(--jade-green)",
    status: "coming-soon",
  },
  {
    id: "wiki",
    title: "Knowledge Wiki",
    titleCjk: "知识百科",
    description: "Comprehensive wiki with searchable articles on all game topics",
    icon: BookOpen,
    route: "/wiki",
    color: "var(--water-blue)",
    status: "available",
  },
  {
    id: "character",
    title: "Character Codex",
    titleCjk: "人物图鉴",
    description: "Database of all characters, NPCs, and notable figures",
    icon: Users,
    route: "/codex-characters",
    color: "var(--soul-essence)",
    status: "available",
  },
  {
    id: "lore",
    title: "Lore Codex",
    titleCjk: "传说图鉴",
    description: "History, legends, cultivation paths, and world mythology",
    icon: Scroll,
    route: "/codex-lore",
    color: "var(--imperial-gold)",
    status: "coming-soon",
  },
  {
    id: "city",
    title: "City Codex",
    titleCjk: "城市图鉴",
    description: "Detailed information on cities, districts, and landmarks",
    icon: Building2,
    route: "/codex-cities",
    color: "var(--imperial-bronze)",
    status: "coming-soon",
  },
  {
    id: "world",
    title: "World Codex",
    titleCjk: "世界图鉴",
    description: "Regions, factions, political systems, and world structure",
    icon: Globe,
    route: "/codex-world",
    color: "var(--earth-yellow)",
    status: "coming-soon",
  },
];

export default function CodexHubPage() {
  const navigate = useNavigate();

  return (
    <div 
      className="codex-hub-page"
      style={{
        background: 'var(--parchment)',
        borderRadius: '18px',
        boxShadow: '0 4px 24px rgba(124,63,0,0.08)',
        border: '6px solid var(--imperial-gold)',
        fontFamily: 'Cinzel, serif',
        color: '#3a2c13',
        padding: '2rem',
        margin: '2rem auto',
        maxWidth: '1200px',
      }}
    >
      {/* Header */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '3px solid var(--imperial-gold)',
        }}
      >
        <Button
          variant="secondary"
          size="small"
          icon={ArrowLeft}
          onClick={() => navigate("/home")}
        >
          Back
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '8px',
              background: 'var(--gradient-imperial)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid var(--dynasty-red)',
            }}
          >
            <Library size={32} color="white" />
          </div>
          <div>
            <h1 
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.5rem',
                color: 'var(--dynasty-red)',
                margin: 0,
              }}
            >
              Codex <span style={{ color: 'var(--imperial-gold)' }}>图鉴</span>
            </h1>
            <p style={{ margin: '0.5rem 0 0', color: '#666' }}>
              Knowledge base, tutorials, and world reference
            </p>
          </div>
        </div>
      </div>

      {/* Codex Options Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {codexOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => option.status === 'available' && navigate(option.route)}
            style={{
              background: option.status === 'available' 
                ? 'linear-gradient(135deg, rgba(253,246,227,0.95), rgba(212,193,169,0.95))'
                : 'linear-gradient(135deg, rgba(200,200,200,0.5), rgba(180,180,180,0.5))',
              border: `3px solid ${option.status === 'available' ? option.color : '#999'}`,
              borderRadius: '12px',
              padding: '1.5rem',
              cursor: option.status === 'available' ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              opacity: option.status === 'available' ? 1 : 0.7,
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              if (option.status === 'available') {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.15), 0 0 20px ${option.color}40`;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {option.status === 'coming-soon' && (
              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'var(--imperial-bronze)',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}
              >
                Coming Soon
              </div>
            )}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '10px',
                  background: option.status === 'available' ? option.color : '#999',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <option.icon size={28} color="white" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#3a2c13' }}>
                  {option.title}
                </h3>
                <span style={{ fontSize: '0.85rem', color: option.color, fontWeight: 'bold' }}>
                  {option.titleCjk}
                </span>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#666', lineHeight: '1.5' }}>
              {option.description}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Access */}
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
        <Button variant="primary" size="medium" onClick={() => navigate("/srd")}>
          📖 Full SRD Book
        </Button>
        <Button variant="secondary" size="medium" onClick={() => navigate("/help")}>
          ❓ Help Center
        </Button>
      </div>
    </div>
  );
}
