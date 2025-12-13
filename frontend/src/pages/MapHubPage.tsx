/**
 * MapHubPage - Hub page for all map-related screens
 * 
 * Nested navigation for: Dynamic Map, War Map, City Map, Region Map, World Map, Realm Map
 */

import { useNavigate } from "react-router-dom";
import { 
  Map, 
  Swords, 
  Building2, 
  Mountain, 
  Globe, 
  Sparkles,
  ArrowLeft
} from "lucide-react";
import Button from "../components/Button";

interface MapOption {
  id: string;
  title: string;
  titleCjk: string;
  description: string;
  icon: React.ElementType;
  route: string;
  color: string;
  status: 'available' | 'coming-soon';
}

const mapOptions: MapOption[] = [
  {
    id: "dynamic",
    title: "Dynamic Map",
    titleCjk: "动态地图",
    description: "Interactive real-time map with live updates and event tracking",
    icon: Map,
    route: "/dynamic-map",
    color: "var(--jade-green)",
    status: "available",
  },
  {
    id: "war",
    title: "War Map",
    titleCjk: "战争地图",
    description: "Strategic overview of military conflicts and troop movements",
    icon: Swords,
    route: "/war-map",
    color: "var(--dynasty-red)",
    status: "available",
  },
  {
    id: "city",
    title: "City Map",
    titleCjk: "城市地图",
    description: "Detailed city layouts with districts, landmarks, and points of interest",
    icon: Building2,
    route: "/city",
    color: "var(--imperial-gold)",
    status: "available",
  },
  {
    id: "region",
    title: "Region Map",
    titleCjk: "地区地图",
    description: "Provincial territories, roads, and regional features",
    icon: Mountain,
    route: "/region",
    color: "var(--earth-yellow)",
    status: "available",
  },
  {
    id: "world",
    title: "World Map",
    titleCjk: "世界地图",
    description: "Full world atlas with all kingdoms, empires, and territories",
    icon: Globe,
    route: "/world",
    color: "var(--water-blue)",
    status: "available",
  },
  {
    id: "realm",
    title: "Realm Map",
    titleCjk: "境界地图",
    description: "Spiritual realms, cultivation zones, and cosmic territories",
    icon: Sparkles,
    route: "/realm-map",
    color: "var(--soul-essence)",
    status: "coming-soon",
  },
];

export default function MapHubPage() {
  const navigate = useNavigate();

  return (
    <div 
      className="map-hub-page"
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
        <div>
          <h1 
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.5rem',
              color: 'var(--dynasty-red)',
              margin: 0,
            }}
          >
            Map Hub <span style={{ color: 'var(--imperial-gold)' }}>地图中心</span>
          </h1>
          <p style={{ margin: '0.5rem 0 0', color: '#666' }}>
            Explore the world through various map perspectives
          </p>
        </div>
      </div>

      {/* Map Options Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {mapOptions.map((option) => (
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
                <h3 
                  style={{
                    margin: 0,
                    fontSize: '1.35rem',
                    color: '#3a2c13',
                  }}
                >
                  {option.title}
                </h3>
                <span 
                  style={{
                    fontSize: '0.9rem',
                    color: option.color,
                    fontWeight: 'bold',
                  }}
                >
                  {option.titleCjk}
                </span>
              </div>
            </div>
            <p 
              style={{
                margin: 0,
                fontSize: '0.95rem',
                color: '#666',
                lineHeight: '1.5',
              }}
            >
              {option.description}
            </p>
          </div>
        ))}
      </div>

      {/* Legend Map Preview */}
      <div 
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'rgba(0,0,0,0.03)',
          borderRadius: '12px',
          textAlign: 'center',
        }}
      >
        <h3 style={{ margin: '0 0 1rem', color: 'var(--dynasty-red)' }}>Quick Access</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="secondary" size="medium" onClick={() => navigate("/map")}>
            Standard Map View
          </Button>
          <Button variant="secondary" size="medium" onClick={() => navigate("/rotk/city")}>
            ROTK City Scene
          </Button>
        </div>
      </div>
    </div>
  );
}
