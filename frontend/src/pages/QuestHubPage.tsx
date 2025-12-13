/**
 * QuestHubPage - Quest tracking and management screen
 * 
 * Displays active quests, completed quests, and quest details
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  ScrollText,
  CheckCircle2,
  Circle,
  Star,
  Clock,
  MapPin,
  Gift,
  ChevronRight,
  Home
} from "lucide-react";
import Button from "../components/Button";

interface Quest {
  id: string;
  title: string;
  titleCjk: string;
  description: string;
  type: 'main' | 'side' | 'daily' | 'hidden';
  status: 'active' | 'completed' | 'failed';
  objectives: { text: string; completed: boolean }[];
  rewards: string[];
  location: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
}

const sampleQuests: Quest[] = [
  {
    id: "1",
    title: "The Path of Cultivation",
    titleCjk: "修炼之路",
    description: "Begin your journey as a cultivator by mastering the basics of Qi manipulation.",
    type: "main",
    status: "active",
    objectives: [
      { text: "Speak with Master Zhou Xu", completed: true },
      { text: "Complete meditation training", completed: true },
      { text: "Defeat 3 training dummies", completed: false },
      { text: "Report to the Sect Elder", completed: false },
    ],
    rewards: ["500 XP", "Basic Cultivation Manual", "Iron Sword"],
    location: "Azure Cloud Sect",
    difficulty: 1,
  },
  {
    id: "2",
    title: "Gathering Spirit Herbs",
    titleCjk: "采集灵草",
    description: "The sect alchemist needs rare spirit herbs from the Misty Mountains.",
    type: "side",
    status: "active",
    objectives: [
      { text: "Collect 5 Azure Spirit Grass", completed: true },
      { text: "Collect 3 Golden Lotus Roots", completed: false },
      { text: "Return to Alchemist Chen", completed: false },
    ],
    rewards: ["200 XP", "3 Spirit Pills"],
    location: "Misty Mountains",
    difficulty: 2,
  },
  {
    id: "3",
    title: "Daily Cultivation",
    titleCjk: "每日修炼",
    description: "Maintain your cultivation progress through daily practice.",
    type: "daily",
    status: "active",
    objectives: [
      { text: "Meditate for 1 hour", completed: false },
      { text: "Practice sword forms", completed: false },
    ],
    rewards: ["50 XP", "10 Spirit Stones"],
    location: "Sect Training Grounds",
    difficulty: 1,
  },
  {
    id: "4",
    title: "The Fallen Elder",
    titleCjk: "堕落长老",
    description: "Investigated rumors of a corrupted sect elder and exposed their dark practices.",
    type: "main",
    status: "completed",
    objectives: [
      { text: "Investigate the hidden chamber", completed: true },
      { text: "Gather evidence of corruption", completed: true },
      { text: "Confront Elder Zhang", completed: true },
      { text: "Report to the Sect Master", completed: true },
    ],
    rewards: ["1000 XP", "Elder's Jade Pendant", "Sect Contribution Points x100"],
    location: "Azure Cloud Sect - Inner Sanctum",
    difficulty: 4,
  },
];

function QuestCard({ quest, onClick }: { quest: Quest; onClick: () => void }) {
  const typeColors = {
    main: "var(--imperial-gold)",
    side: "var(--water-blue)",
    daily: "var(--jade-green)",
    hidden: "var(--soul-essence)",
  };

  const typeLabels = {
    main: "Main Quest",
    side: "Side Quest",
    daily: "Daily",
    hidden: "Hidden",
  };

  const completedObjectives = quest.objectives.filter(o => o.completed).length;
  const totalObjectives = quest.objectives.length;
  const progress = (completedObjectives / totalObjectives) * 100;

  return (
    <div
      onClick={onClick}
      style={{
        background: quest.status === 'completed' 
          ? 'linear-gradient(135deg, rgba(200,200,200,0.3), rgba(180,180,180,0.3))'
          : 'linear-gradient(135deg, rgba(253,246,227,0.95), rgba(212,193,169,0.95))',
        border: `3px solid ${typeColors[quest.type]}`,
        borderRadius: '12px',
        padding: '1.25rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        opacity: quest.status === 'completed' ? 0.8 : 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 6px 20px rgba(0,0,0,0.15)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <span 
            style={{
              fontSize: '0.7rem',
              fontWeight: 'bold',
              color: 'white',
              background: typeColors[quest.type],
              padding: '0.15rem 0.5rem',
              borderRadius: '8px',
              textTransform: 'uppercase',
            }}
          >
            {typeLabels[quest.type]}
          </span>
          <h3 style={{ margin: '0.5rem 0 0', fontSize: '1.15rem', color: '#3a2c13' }}>
            {quest.title}
          </h3>
          <span style={{ fontSize: '0.85rem', color: typeColors[quest.type], fontWeight: 'bold' }}>
            {quest.titleCjk}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              size={14} 
              fill={i < quest.difficulty ? 'var(--imperial-gold)' : 'transparent'}
              color="var(--imperial-gold)"
            />
          ))}
        </div>
      </div>

      {/* Description */}
      <p style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: '#666', lineHeight: '1.4' }}>
        {quest.description}
      </p>

      {/* Location */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.85rem', color: '#888' }}>
        <MapPin size={14} />
        {quest.location}
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.8rem' }}>
          <span>Progress</span>
          <span>{completedObjectives}/{totalObjectives}</span>
        </div>
        <div style={{ height: '8px', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
          <div 
            style={{ 
              height: '100%', 
              width: `${progress}%`,
              background: quest.status === 'completed' ? 'var(--jade-green)' : typeColors[quest.type],
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Gift size={14} color="var(--imperial-gold)" />
          <span style={{ fontSize: '0.8rem', color: '#666' }}>{quest.rewards.length} Rewards</span>
        </div>
        <ChevronRight size={18} color="#999" />
      </div>
    </div>
  );
}

export default function QuestHubPage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed'>('active');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  const activeQuests = sampleQuests.filter(q => q.status === 'active');
  const completedQuests = sampleQuests.filter(q => q.status === 'completed');
  const displayedQuests = selectedTab === 'active' ? activeQuests : completedQuests;

  return (
    <div 
      className="quest-hub-page"
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
              background: 'var(--gradient-imperial)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid var(--dynasty-red)',
            }}
          >
            <ScrollText size={32} color="white" />
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
              Quest Log <span style={{ color: 'var(--imperial-gold)' }}>任务</span>
            </h1>
            <p style={{ margin: '0.5rem 0 0', color: '#666' }}>
              {activeQuests.length} Active • {completedQuests.length} Completed
            </p>
          </div>
        </div>
      </div>

      {/* Tab Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setSelectedTab('active')}
          style={{
            padding: '0.75rem 1.5rem',
            background: selectedTab === 'active' ? 'var(--imperial-gold)' : 'rgba(0,0,0,0.05)',
            color: selectedTab === 'active' ? 'white' : '#666',
            border: 'none',
            borderRadius: '8px',
            fontFamily: 'Cinzel, serif',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Circle size={16} />
          Active ({activeQuests.length})
        </button>
        <button
          onClick={() => setSelectedTab('completed')}
          style={{
            padding: '0.75rem 1.5rem',
            background: selectedTab === 'completed' ? 'var(--jade-green)' : 'rgba(0,0,0,0.05)',
            color: selectedTab === 'completed' ? 'white' : '#666',
            border: 'none',
            borderRadius: '8px',
            fontFamily: 'Cinzel, serif',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle2 size={16} />
          Completed ({completedQuests.length})
        </button>
      </div>

      {/* Quest Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {displayedQuests.map((quest) => (
          <QuestCard 
            key={quest.id} 
            quest={quest} 
            onClick={() => setSelectedQuest(quest)}
          />
        ))}
      </div>

      {displayedQuests.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <Clock size={48} color="#ccc" style={{ marginBottom: '1rem' }} />
          <p>No {selectedTab} quests found.</p>
        </div>
      )}

      {/* Quest Detail Modal */}
      {selectedQuest && (
        <div
          onClick={() => setSelectedQuest(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--parchment)',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
              border: '4px solid var(--imperial-gold)',
            }}
          >
            <h2 style={{ margin: '0 0 0.5rem', color: 'var(--dynasty-red)' }}>
              {selectedQuest.title}
            </h2>
            <p style={{ margin: '0 0 1rem', color: 'var(--imperial-gold)', fontWeight: 'bold' }}>
              {selectedQuest.titleCjk}
            </p>
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
              {selectedQuest.description}
            </p>
            
            <h3 style={{ margin: '0 0 0.75rem' }}>Objectives</h3>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
              {selectedQuest.objectives.map((obj, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {obj.completed ? (
                    <CheckCircle2 size={18} color="var(--jade-green)" />
                  ) : (
                    <Circle size={18} color="#ccc" />
                  )}
                  <span style={{ textDecoration: obj.completed ? 'line-through' : 'none', color: obj.completed ? '#888' : '#333' }}>
                    {obj.text}
                  </span>
                </li>
              ))}
            </ul>

            <h3 style={{ margin: '0 0 0.75rem' }}>Rewards</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {selectedQuest.rewards.map((reward, i) => (
                <span 
                  key={i}
                  style={{
                    background: 'var(--imperial-gold)',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                  }}
                >
                  {reward}
                </span>
              ))}
            </div>

            <Button variant="secondary" onClick={() => setSelectedQuest(null)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
