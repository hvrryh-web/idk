/**
 * PersonalHubPage - Hub page for personal character interactions
 * 
 * Nested navigation for: Conversation, Showcase
 */

import { useNavigate } from "react-router-dom";
import { 
  MessageCircle, 
  Image,
  ArrowLeft,
  User,
  Heart,
  Star
} from "lucide-react";
import Button from "../components/Button";

interface PersonalOption {
  id: string;
  title: string;
  titleCjk: string;
  description: string;
  icon: React.ElementType;
  route: string;
  color: string;
  status: 'available' | 'coming-soon';
}

const personalOptions: PersonalOption[] = [
  {
    id: "conversation",
    title: "Conversation",
    titleCjk: "对话",
    description: "Engage in deep conversations with characters, build relationships and uncover secrets",
    icon: MessageCircle,
    route: "/conversation",
    color: "var(--soul-essence)",
    status: "available",
  },
  {
    id: "showcase",
    title: "Showcase Gallery",
    titleCjk: "展示",
    description: "View character portraits, collected items, and achievement displays",
    icon: Image,
    route: "/showcase",
    color: "var(--imperial-gold)",
    status: "available",
  },
  {
    id: "relationships",
    title: "Relationships",
    titleCjk: "关系",
    description: "Track bonds, rivalries, and connection levels with NPCs",
    icon: Heart,
    route: "/relationships",
    color: "var(--dynasty-crimson)",
    status: "coming-soon",
  },
  {
    id: "achievements",
    title: "Achievements",
    titleCjk: "成就",
    description: "View unlocked achievements, titles, and milestones",
    icon: Star,
    route: "/achievements",
    color: "var(--earth-yellow)",
    status: "coming-soon",
  },
];

export default function PersonalHubPage() {
  const navigate = useNavigate();

  return (
    <div 
      className="personal-hub-page"
      style={{
        background: 'var(--parchment)',
        borderRadius: '18px',
        boxShadow: '0 4px 24px rgba(124,63,0,0.08)',
        border: '6px solid #c9b18a',
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
          borderBottom: '3px solid var(--soul-essence)',
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
              borderRadius: '50%',
              background: 'var(--gradient-dynasty)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid var(--imperial-gold)',
            }}
          >
            <User size={32} color="white" />
          </div>
          <div>
            <h1 
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.5rem',
                color: 'var(--soul-essence)',
                margin: 0,
              }}
            >
              Personal <span style={{ color: 'var(--imperial-gold)' }}>个人</span>
            </h1>
            <p style={{ margin: '0.5rem 0 0', color: '#666' }}>
              Character interactions and personal collections
            </p>
          </div>
        </div>
      </div>

      {/* Personal Options Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {personalOptions.map((option) => (
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
                <h3 style={{ margin: 0, fontSize: '1.35rem', color: '#3a2c13' }}>
                  {option.title}
                </h3>
                <span style={{ fontSize: '0.9rem', color: option.color, fontWeight: 'bold' }}>
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
          textAlign: 'center',
        }}
      >
        <Button variant="primary" size="large" onClick={() => navigate("/personal")}>
          Personal View Screen
        </Button>
      </div>
    </div>
  );
}
