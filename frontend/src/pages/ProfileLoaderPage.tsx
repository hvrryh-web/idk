/**
 * ProfileLoaderPage - Profile selection and session management
 * 
 * Allows users to select Player 1, Player 2, or Game Master profiles.
 * Game Master requires password authentication.
 * Creates unique session IDs based on date.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Users, 
  Crown, 
  Lock, 
  Eye, 
  EyeOff,
  Loader2,
  AlertCircle
} from 'lucide-react';

// Session storage key
const SESSION_KEY = 'wuxuxian_session';

export interface GameSession {
  sessionId: string;
  profileType: 'player1' | 'player2' | 'gamemaster';
  isGameMaster: boolean;
  createdAt: string;
}

interface ProfileCardProps {
  id: 'player1' | 'player2' | 'gamemaster';
  title: string;
  titleCjk: string;
  description: string;
  icon: React.ElementType;
  color: string;
  requiresPassword: boolean;
  onSelect: (id: string, password?: string) => void;
  loading: boolean;
  selected: boolean;
}

function ProfileCard({ 
  id, 
  title, 
  titleCjk, 
  description, 
  icon: Icon, 
  color, 
  requiresPassword,
  onSelect,
  loading,
  selected
}: ProfileCardProps) {
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () => {
    if (requiresPassword) {
      setShowPasswordInput(true);
    } else {
      onSelect(id);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelect(id, password);
  };

  return (
    <div
      style={{
        background: selected 
          ? `linear-gradient(135deg, ${color}20, ${color}40)`
          : 'linear-gradient(135deg, rgba(253,246,227,0.95), rgba(212,193,169,0.95))',
        border: `4px solid ${selected ? color : 'var(--rotk-bronze)'}`,
        borderRadius: '16px',
        padding: '2rem',
        cursor: loading ? 'wait' : 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: selected ? `0 0 30px ${color}40` : 'var(--rotk-shadow-raised)',
      }}
      onClick={!showPasswordInput && !loading ? handleClick : undefined}
      onMouseEnter={(e) => {
        if (!loading && !showPasswordInput) {
          e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
          e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.2), 0 0 30px ${color}30`;
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = 'var(--rotk-shadow-raised)';
        }
      }}
    >
      {/* Lock icon for GM */}
      {requiresPassword && !showPasswordInput && (
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'var(--rotk-ink-black)',
            borderRadius: '50%',
            padding: '0.5rem',
          }}
        >
          <Lock size={16} color="var(--rotk-gold)" />
        </div>
      )}

      {/* Icon */}
      <div
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${color}, ${color}cc)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          border: '4px solid var(--rotk-gold)',
          boxShadow: `0 0 20px ${color}60`,
        }}
      >
        {loading && selected ? (
          <Loader2 size={48} color="white" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
        ) : (
          <Icon size={48} color="white" />
        )}
      </div>

      {/* Title */}
      <h2
        style={{
          textAlign: 'center',
          margin: '0 0 0.5rem',
          fontFamily: 'var(--rotk-font-heading)',
          fontSize: '1.75rem',
          color: 'var(--rotk-ink-black)',
        }}
      >
        {title}
      </h2>
      <p
        style={{
          textAlign: 'center',
          margin: '0 0 1rem',
          color: color,
          fontWeight: 'bold',
          fontSize: '1.25rem',
        }}
      >
        {titleCjk}
      </p>
      <p
        style={{
          textAlign: 'center',
          margin: 0,
          color: 'var(--rotk-ink-wash)',
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>

      {/* Password Input for GM */}
      {showPasswordInput && (
        <form 
          onSubmit={handlePasswordSubmit}
          onClick={(e) => e.stopPropagation()}
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'rgba(0,0,0,0.05)',
            borderRadius: '8px',
          }}
        >
          <label
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 'bold',
              color: 'var(--rotk-ink-black)',
            }}
          >
            Enter Game Master Password
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password..."
                autoFocus
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 1rem',
                  border: '2px solid var(--rotk-bronze)',
                  borderRadius: '8px',
                  fontFamily: 'var(--rotk-font-body)',
                  fontSize: '1rem',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={!password || loading}
              style={{
                padding: '0.75rem 1.5rem',
                background: loading ? 'var(--rotk-ink-wash)' : 'var(--rotk-cinnabar)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: loading ? 'wait' : 'pointer',
              }}
            >
              {loading ? '...' : 'Enter'}
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowPasswordInput(false);
              setPassword('');
            }}
            style={{
              marginTop: '0.5rem',
              background: 'none',
              border: 'none',
              color: 'var(--rotk-ink-wash)',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default function ProfileLoaderPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProfileSelect = async (profileType: string, password?: string) => {
    setLoading(true);
    setSelectedProfile(profileType);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/v1/sessions/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_type: profileType,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store session
        const session: GameSession = {
          sessionId: data.session_id,
          profileType: data.profile_type,
          isGameMaster: data.is_game_master,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));

        // Navigate based on profile
        if (data.is_game_master) {
          navigate('/gm-dashboard');
        } else {
          navigate('/home');
        }
      } else {
        setError(data.error || 'Login failed');
        setSelectedProfile(null);
      }
    } catch (err) {
      // Fallback for when backend is not running - create local session
      // Note: In development mode without backend, GM access requires backend
      console.warn('Backend not available, creating local session');
      
      if (profileType === 'gamemaster') {
        // GM requires backend authentication - cannot validate offline
        setError('Game Master login requires backend connection. Please ensure the server is running.');
        setSelectedProfile(null);
        setLoading(false);
        return;
      }

      const dateKey = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const randomToken = Math.random().toString(36).substring(2, 10);
      
      const session: GameSession = {
        sessionId: `${profileType}-${dateKey}-${randomToken}`,
        profileType: profileType as 'player1' | 'player2' | 'gamemaster',
        isGameMaster: profileType === 'gamemaster',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));

      if (profileType === 'gamemaster') {
        navigate('/gm-dashboard');
      } else {
        navigate('/home');
      }
    } finally {
      setLoading(false);
    }
  };

  const profiles = [
    {
      id: 'player1' as const,
      title: 'Player 1',
      titleCjk: '玩家一',
      description: 'Join the game as the first player. Experience the story and combat as a hero.',
      icon: User,
      color: 'var(--rotk-jade)',
      requiresPassword: false,
    },
    {
      id: 'player2' as const,
      title: 'Player 2',
      titleCjk: '玩家二',
      description: 'Join as the second player. Cooperate or compete in this epic adventure.',
      icon: Users,
      color: 'var(--rotk-blue)',
      requiresPassword: false,
    },
    {
      id: 'gamemaster' as const,
      title: 'Game Master',
      titleCjk: '游戏主持',
      description: 'Control the game world, manage NPCs, and guide the story. Password protected.',
      icon: Crown,
      color: 'var(--rotk-cinnabar)',
      requiresPassword: true,
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, var(--rotk-ink-black) 0%, var(--rotk-charcoal) 100%)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1
          style={{
            fontFamily: 'var(--rotk-font-heading)',
            fontSize: '3.5rem',
            color: 'var(--rotk-gold)',
            margin: '0 0 0.5rem',
            textShadow: '0 0 30px rgba(212,175,55,0.5)',
          }}
        >
          WuXuxian TTRPG
        </h1>
        <p
          style={{
            fontFamily: 'var(--rotk-font-heading-cjk)',
            fontSize: '2rem',
            color: 'var(--rotk-cinnabar)',
            margin: '0 0 1rem',
          }}
        >
          武侠仙
        </p>
        <p
          style={{
            color: 'var(--rotk-parchment-aged)',
            fontSize: '1.1rem',
          }}
        >
          Select your profile to begin your journey
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem 1.5rem',
            background: 'rgba(196,30,58,0.2)',
            border: '2px solid var(--rotk-cinnabar)',
            borderRadius: '8px',
            marginBottom: '2rem',
            color: 'var(--rotk-parchment)',
          }}
        >
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Profile Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          width: '100%',
        }}
      >
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            {...profile}
            onSelect={handleProfileSelect}
            loading={loading}
            selected={selectedProfile === profile.id}
          />
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: '3rem',
          textAlign: 'center',
          color: 'var(--rotk-ink-wash)',
          fontSize: '0.9rem',
        }}
      >
        <p>Romance of the Three Kingdoms • Xianxia Visual Novel TTRPG</p>
        <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>
          Session tokens are generated using date-based keys for tracking
        </p>
      </div>

      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Utility function to get current session
export function getCurrentSession(): GameSession | null {
  const stored = localStorage.getItem(SESSION_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

// Utility function to clear session
export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

// Utility function to check if user is Game Master
export function isGameMaster(): boolean {
  const session = getCurrentSession();
  return session?.isGameMaster ?? false;
}
