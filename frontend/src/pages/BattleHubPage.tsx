/**
 * BattleHubPage - Hub page for all battle and combat screens
 * 
 * Nested navigation for: ROTK Battle City, Region, War, Skirmish, Siege, Standard
 */

import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  Mountain, 
  Flag,
  Users,
  Castle,
  Swords,
  ArrowLeft,
  Shield
} from "lucide-react";
import Button from "../components/Button";

interface BattleOption {
  id: string;
  title: string;
  titleCjk: string;
  description: string;
  icon: React.ElementType;
  route: string;
  color: string;
  status: 'available' | 'coming-soon';
  category: 'strategic' | 'tactical';
}

const battleOptions: BattleOption[] = [
  {
    id: "city",
    title: "ROTK Battle: City",
    titleCjk: "城市战",
    description: "Urban warfare within city walls, district control and siege defense",
    icon: Building2,
    route: "/rotk/city",
    color: "var(--imperial-gold)",
    status: "available",
    category: "strategic",
  },
  {
    id: "region",
    title: "ROTK Battle: Region",
    titleCjk: "地区战",
    description: "Regional control battles across provinces and territories",
    icon: Mountain,
    route: "/battle-region",
    color: "var(--earth-yellow)",
    status: "coming-soon",
    category: "strategic",
  },
  {
    id: "war",
    title: "ROTK Battle: War",
    titleCjk: "战争",
    description: "Large-scale warfare with multiple armies and strategic objectives",
    icon: Flag,
    route: "/rotk/war",
    color: "var(--dynasty-red)",
    status: "available",
    category: "strategic",
  },
  {
    id: "skirmish",
    title: "Combat: Skirmish",
    titleCjk: "小规模战斗",
    description: "Small-scale tactical encounters, ambushes, and quick clashes",
    icon: Users,
    route: "/battle-skirmish",
    color: "var(--jade-green)",
    status: "coming-soon",
    category: "tactical",
  },
  {
    id: "siege",
    title: "Combat: Siege",
    titleCjk: "围城战",
    description: "Fortification assaults with siege weapons and defensive structures",
    icon: Castle,
    route: "/rotk/siege",
    color: "var(--imperial-bronze)",
    status: "available",
    category: "tactical",
  },
  {
    id: "standard",
    title: "Combat: Standard",
    titleCjk: "标准战斗",
    description: "Traditional party vs enemy combat with full technique system",
    icon: Swords,
    route: "/rotk/battle",
    color: "var(--fire-red)",
    status: "available",
    category: "tactical",
  },
];

export default function BattleHubPage() {
  const navigate = useNavigate();

  const strategicBattles = battleOptions.filter(o => o.category === 'strategic');
  const tacticalBattles = battleOptions.filter(o => o.category === 'tactical');

  const renderBattleCard = (option: BattleOption) => (
    <div
      key={option.id}
      onClick={() => option.status === 'available' && navigate(option.route)}
      style={{
        background: option.status === 'available' 
          ? 'linear-gradient(135deg, rgba(26,26,26,0.95), rgba(45,45,45,0.95))'
          : 'linear-gradient(135deg, rgba(60,60,60,0.5), rgba(40,40,40,0.5))',
        border: `3px solid ${option.status === 'available' ? option.color : '#555'}`,
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
          e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.4), 0 0 30px ${option.color}50`;
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
            background: option.status === 'available' ? option.color : '#555',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: option.status === 'available' ? `0 2px 12px ${option.color}80` : 'none',
          }}
        >
          <option.icon size={28} color="white" />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--parchment)' }}>
            {option.title}
          </h3>
          <span style={{ fontSize: '0.9rem', color: option.color, fontWeight: 'bold' }}>
            {option.titleCjk}
          </span>
        </div>
      </div>
      <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--burnt-parchment)', lineHeight: '1.5' }}>
        {option.description}
      </p>
    </div>
  );

  return (
    <div 
      className="battle-hub-page"
      style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        borderRadius: '18px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 40px rgba(139,0,0,0.2)',
        border: '6px solid var(--dynasty-red)',
        fontFamily: 'Cinzel, serif',
        color: 'var(--parchment)',
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
          borderBottom: '3px solid var(--dynasty-red)',
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
              background: 'var(--gradient-blood)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid var(--imperial-gold)',
              boxShadow: '0 0 20px rgba(139,0,0,0.5)',
            }}
          >
            <Shield size={32} color="var(--imperial-gold)" />
          </div>
          <div>
            <h1 
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.5rem',
                color: 'var(--parchment)',
                margin: 0,
                textShadow: '0 0 20px rgba(139,0,0,0.5)',
              }}
            >
              Battle & Combat <span style={{ color: 'var(--imperial-gold)' }}>战斗</span>
            </h1>
            <p style={{ margin: '0.5rem 0 0', color: 'var(--burnt-parchment)' }}>
              Strategic warfare and tactical combat systems
            </p>
          </div>
        </div>
      </div>

      {/* Strategic Battles Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 
          style={{ 
            color: 'var(--imperial-gold)', 
            fontSize: '1.5rem', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Flag size={24} /> Strategic Battles
        </h2>
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {strategicBattles.map(renderBattleCard)}
        </div>
      </div>

      {/* Tactical Combat Section */}
      <div>
        <h2 
          style={{ 
            color: 'var(--imperial-gold)', 
            fontSize: '1.5rem', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Swords size={24} /> Tactical Combat
        </h2>
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {tacticalBattles.map(renderBattleCard)}
        </div>
      </div>

      {/* Quick Access */}
      <div 
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'rgba(139,0,0,0.2)',
          borderRadius: '12px',
          border: '1px solid var(--dynasty-red)',
          textAlign: 'center',
        }}
      >
        <Button variant="primary" size="large" onClick={() => navigate("/combat-test")}>
          ⚔️ Enter Combat Test Arena
        </Button>
      </div>
    </div>
  );
}
