/**
 * ToolsHubPage - Hub page for all game tools and utilities
 * 
 * Nested navigation for: ASCII Art Generator, Fate Card Builder, 
 * Character Creator, Combat Test Arena, and more
 */

import { useNavigate } from "react-router-dom";
import { 
  Palette, 
  Sparkles,
  UserPlus,
  Swords,
  Image,
  Wand2,
  ArrowLeft,
  Wrench,
  Home
} from "lucide-react";
import Button from "../components/Button";

interface ToolOption {
  id: string;
  title: string;
  titleCjk: string;
  description: string;
  icon: React.ElementType;
  route: string;
  color: string;
  status: 'available' | 'coming-soon';
  category: 'creation' | 'utility';
}

const toolOptions: ToolOption[] = [
  {
    id: "fate-card",
    title: "Fate Card Builder",
    titleCjk: "命运卡牌构建器",
    description: "Create custom fate cards with unique abilities and effects",
    icon: Sparkles,
    route: "/fate-card-builder",
    color: "var(--soul-essence)",
    status: "available",
    category: "creation",
  },
  {
    id: "character-creator",
    title: "Character Creator",
    titleCjk: "角色创建器",
    description: "Build new characters with the full creation wizard",
    icon: UserPlus,
    route: "/character/create",
    color: "var(--jade-green)",
    status: "available",
    category: "creation",
  },
  {
    id: "character-creation",
    title: "Quick Character",
    titleCjk: "快速创建",
    description: "Streamlined character creation with templates",
    icon: Wand2,
    route: "/characters/create",
    color: "var(--water-blue)",
    status: "available",
    category: "creation",
  },
  {
    id: "ascii-art",
    title: "ASCII Art Generator",
    titleCjk: "ASCII艺术生成器",
    description: "Generate ASCII art portraits and character visuals",
    icon: Palette,
    route: "/ascii-art",
    color: "var(--imperial-gold)",
    status: "available",
    category: "utility",
  },
  {
    id: "ascii-visualizer",
    title: "ASCII Visualizer",
    titleCjk: "ASCII可视化",
    description: "View and edit ASCII art with real-time preview",
    icon: Image,
    route: "/ascii",
    color: "var(--imperial-bronze)",
    status: "available",
    category: "utility",
  },
  {
    id: "combat-test",
    title: "Combat Test Arena",
    titleCjk: "战斗测试场",
    description: "Test combat mechanics and battle simulations",
    icon: Swords,
    route: "/combat-test",
    color: "var(--dynasty-red)",
    status: "available",
    category: "utility",
  },
];

export default function ToolsHubPage() {
  const navigate = useNavigate();

  const creationTools = toolOptions.filter(o => o.category === 'creation');
  const utilityTools = toolOptions.filter(o => o.category === 'utility');

  const renderToolCard = (option: ToolOption) => (
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
            boxShadow: option.status === 'available' ? `0 2px 8px ${option.color}60` : 'none',
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
  );

  return (
    <div 
      className="tools-hub-page"
      style={{
        background: 'var(--parchment)',
        borderRadius: '18px',
        boxShadow: '0 4px 24px rgba(124,63,0,0.08)',
        border: '6px solid var(--jade-green)',
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
          borderBottom: '3px solid var(--jade-green)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Button
            variant="secondary"
            size="small"
            icon={Home}
            onClick={() => navigate("/home")}
          >
            Home
          </Button>
          <Button
            variant="secondary"
            size="small"
            icon={ArrowLeft}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--jade-green), var(--jade-green-dark, #0d6e4f))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid var(--imperial-gold)',
            }}
          >
            <Wrench size={32} color="white" />
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
              Tools <span style={{ color: 'var(--jade-green)' }}>工具</span>
            </h1>
            <p style={{ margin: '0.5rem 0 0', color: '#666' }}>
              Character creation, art generation, and utility tools
            </p>
          </div>
        </div>
      </div>

      {/* Creation Tools Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 
          style={{ 
            color: 'var(--dynasty-red)', 
            fontSize: '1.5rem', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <UserPlus size={24} /> Creation Tools
        </h2>
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {creationTools.map(renderToolCard)}
        </div>
      </div>

      {/* Utility Tools Section */}
      <div>
        <h2 
          style={{ 
            color: 'var(--dynasty-red)', 
            fontSize: '1.5rem', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Wrench size={24} /> Utility Tools
        </h2>
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {utilityTools.map(renderToolCard)}
        </div>
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
        <Button variant="primary" size="medium" onClick={() => navigate("/characters")}>
          👤 Character Manager
        </Button>
        <Button variant="secondary" size="medium" onClick={() => navigate("/characters/showcase")}>
          🖼️ Character Showcase
        </Button>
      </div>
    </div>
  );
}
