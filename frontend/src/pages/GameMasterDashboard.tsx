/**
 * GameMasterDashboard - Main dashboard for Game Masters
 * 
 * Provides access to all GM control panels and monitoring tools.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, 
  Map, 
  Users, 
  Swords, 
  MessageSquare,
  Eye,
  Layers,
  Zap,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { ROTKPageLayout, ROTKButton } from '../components/rotk';
import { getCurrentSession, clearSession, isGameMaster } from './ProfileLoaderPage';

interface GMTab {
  id: string;
  label: string;
  labelCjk: string;
  icon: React.ElementType;
}

const gmTabs: GMTab[] = [
  { id: 'overview', label: 'Overview', labelCjk: '总览', icon: Eye },
  { id: 'tokens', label: 'Token Manager', labelCjk: '角色管理', icon: Users },
  { id: 'map', label: 'Map Control', labelCjk: '地图控制', icon: Map },
  { id: 'combat', label: 'Combat Control', labelCjk: '战斗控制', icon: Swords },
  { id: 'chat', label: 'GM Chat', labelCjk: '主持通讯', icon: MessageSquare },
  { id: 'effects', label: 'Effects & Fog', labelCjk: '效果迷雾', icon: Layers },
];

export default function GameMasterDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [session] = useState(getCurrentSession());
  const [vttState, setVttState] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verify GM access
    if (!isGameMaster()) {
      navigate('/profile');
      return;
    }
    
    // Load initial VTT state
    fetchVTTState();
  }, [navigate]);

  const fetchVTTState = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/vtt/state?include_hidden=true');
      if (response.ok) {
        const data = await response.json();
        setVttState(data);
      }
    } catch (error) {
      console.warn('Failed to fetch VTT state:', error);
      // Set mock state for offline mode
      setVttState({
        map: null,
        tokens: [],
        fog_of_war: {},
        chat_messages: [],
        initiative: [],
        phase: 'exploration'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    navigate('/profile');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPanel vttState={vttState} onRefresh={fetchVTTState} loading={loading} />;
      case 'tokens':
        return <TokenManagerPanel vttState={vttState} onRefresh={fetchVTTState} />;
      case 'map':
        return <MapControlPanel vttState={vttState} onRefresh={fetchVTTState} />;
      case 'combat':
        return <CombatControlPanel vttState={vttState} onRefresh={fetchVTTState} />;
      case 'chat':
        return <GMChatPanel vttState={vttState} onRefresh={fetchVTTState} />;
      case 'effects':
        return <EffectsPanel vttState={vttState} onRefresh={fetchVTTState} />;
      default:
        return null;
    }
  };

  return (
    <ROTKPageLayout
      title="Game Master Control Panel"
      titleCjk="游戏主持控制台"
      subtitle={`Session: ${session?.sessionId || 'Unknown'}`}
      variant="ink"
      icon={<Crown size={28} color="var(--rotk-gold)" />}
      accentColor="var(--rotk-gold)"
      showBackButton={false}
      showHomeButton={false}
      headerActions={
        <ROTKButton variant="secondary" size="small" icon={LogOut} onClick={handleLogout}>
          Logout
        </ROTKButton>
      }
    >
      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          padding: '1rem',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '8px',
          border: '1px solid var(--rotk-bronze)',
        }}
      >
        {gmTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              background: activeTab === tab.id ? 'var(--rotk-gold)' : 'transparent',
              color: activeTab === tab.id ? 'var(--rotk-ink-black)' : 'var(--rotk-parchment)',
              border: `2px solid ${activeTab === tab.id ? 'var(--rotk-gold)' : 'var(--rotk-bronze)'}`,
              borderRadius: '6px',
              fontFamily: 'var(--rotk-font-heading)',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
            <span style={{ opacity: 0.7, fontSize: '0.8rem' }}>{tab.labelCjk}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        style={{
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '8px',
          border: '1px solid var(--rotk-bronze)',
          padding: '1.5rem',
          minHeight: '500px',
        }}
      >
        {renderTabContent()}
      </div>
    </ROTKPageLayout>
  );
}

// ============================================
// Overview Panel
// ============================================
function OverviewPanel({ vttState, onRefresh, loading }: { vttState: any; onRefresh: () => void; loading: boolean }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: 'var(--rotk-gold)' }}>Game Overview</h2>
        <ROTKButton variant="secondary" size="small" icon={RefreshCw} onClick={onRefresh} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </ROTKButton>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {/* Current Map */}
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--rotk-bronze)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Map size={20} color="var(--rotk-jade)" />
            <span style={{ color: 'var(--rotk-parchment-aged)', fontSize: '0.9rem' }}>Current Map</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--rotk-parchment)' }}>
            {vttState?.map?.name || 'No Map Loaded'}
          </div>
        </div>

        {/* Active Tokens */}
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--rotk-bronze)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Users size={20} color="var(--rotk-blue)" />
            <span style={{ color: 'var(--rotk-parchment-aged)', fontSize: '0.9rem' }}>Active Tokens</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--rotk-parchment)' }}>
            {vttState?.tokens?.length || 0}
          </div>
        </div>

        {/* Game Phase */}
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--rotk-bronze)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Zap size={20} color="var(--rotk-cinnabar)" />
            <span style={{ color: 'var(--rotk-parchment-aged)', fontSize: '0.9rem' }}>Game Phase</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--rotk-parchment)', textTransform: 'capitalize' }}>
            {vttState?.phase || 'Exploration'}
          </div>
        </div>

        {/* Initiative Count */}
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--rotk-bronze)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Swords size={20} color="var(--rotk-gold)" />
            <span style={{ color: 'var(--rotk-parchment-aged)', fontSize: '0.9rem' }}>In Initiative</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--rotk-parchment)' }}>
            {vttState?.initiative?.length || 0}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ color: 'var(--rotk-gold)', marginBottom: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <ROTKButton variant="primary" size="medium" icon={Swords}>Start Combat</ROTKButton>
          <ROTKButton variant="gold" size="medium" icon={Users}>Add Token</ROTKButton>
          <ROTKButton variant="secondary" size="medium" icon={MessageSquare}>Broadcast Message</ROTKButton>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Token Manager Panel
// ============================================
function TokenManagerPanel({ vttState, onRefresh }: { vttState: any; onRefresh: () => void }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newToken, setNewToken] = useState({
    name: '',
    type: 'npc',
    x: 5,
    y: 5,
    hp: 100,
    maxHp: 100,
    visible: true,
  });

  const handleAddToken = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/vtt/tokens/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newToken.name,
          type: newToken.type,
          position: { x: newToken.x, y: newToken.y },
          hp: newToken.hp,
          max_hp: newToken.maxHp,
          visible_to_players: newToken.visible,
        }),
      });
      
      if (response.ok) {
        setShowAddForm(false);
        setNewToken({ name: '', type: 'npc', x: 5, y: 5, hp: 100, maxHp: 100, visible: true });
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to add token:', error);
    }
  };

  const handleRemoveToken = async (tokenId: string) => {
    try {
      await fetch(`http://localhost:8000/api/v1/vtt/tokens/${tokenId}`, {
        method: 'DELETE',
      });
      onRefresh();
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  };

  const monsterTemplates = [
    { name: 'Bandit', type: 'enemy', hp: 30, maxHp: 30 },
    { name: 'Guard Captain', type: 'enemy', hp: 80, maxHp: 80 },
    { name: 'Spirit Beast', type: 'enemy', hp: 120, maxHp: 120 },
    { name: 'Demonic Cultivator', type: 'enemy', hp: 200, maxHp: 200 },
    { name: 'Elder Dragon', type: 'enemy', hp: 500, maxHp: 500 },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: 'var(--rotk-gold)' }}>Token Manager</h2>
        <ROTKButton variant="gold" size="medium" icon={Users} onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add Token'}
        </ROTKButton>
      </div>

      {/* Quick Add Monster Templates */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: 'var(--rotk-parchment-aged)', marginBottom: '0.75rem', fontSize: '1rem' }}>Quick Add Monsters</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {monsterTemplates.map((template) => (
            <button
              key={template.name}
              onClick={() => {
                setNewToken({ ...newToken, ...template });
                setShowAddForm(true);
              }}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(196,30,58,0.3)',
                border: '1px solid var(--rotk-cinnabar)',
                borderRadius: '4px',
                color: 'var(--rotk-parchment)',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              + {template.name} (HP: {template.hp})
            </button>
          ))}
        </div>
      </div>

      {/* Add Token Form */}
      {showAddForm && (
        <div style={{ 
          background: 'rgba(0,0,0,0.4)', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          border: '2px solid var(--rotk-gold)',
          marginBottom: '1.5rem',
        }}>
          <h3 style={{ color: 'var(--rotk-gold)', marginBottom: '1rem' }}>New Token</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--rotk-parchment-aged)', fontSize: '0.85rem' }}>Name</label>
              <input
                type="text"
                value={newToken.name}
                onChange={(e) => setNewToken({ ...newToken, name: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--rotk-bronze)', background: 'var(--rotk-ink-black)', color: 'var(--rotk-parchment)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--rotk-parchment-aged)', fontSize: '0.85rem' }}>Type</label>
              <select
                value={newToken.type}
                onChange={(e) => setNewToken({ ...newToken, type: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--rotk-bronze)', background: 'var(--rotk-ink-black)', color: 'var(--rotk-parchment)' }}
              >
                <option value="player">Player</option>
                <option value="npc">NPC</option>
                <option value="enemy">Enemy</option>
                <option value="object">Object</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--rotk-parchment-aged)', fontSize: '0.85rem' }}>Position X</label>
              <input
                type="number"
                value={newToken.x}
                onChange={(e) => setNewToken({ ...newToken, x: parseInt(e.target.value) || 0 })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--rotk-bronze)', background: 'var(--rotk-ink-black)', color: 'var(--rotk-parchment)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--rotk-parchment-aged)', fontSize: '0.85rem' }}>Position Y</label>
              <input
                type="number"
                value={newToken.y}
                onChange={(e) => setNewToken({ ...newToken, y: parseInt(e.target.value) || 0 })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--rotk-bronze)', background: 'var(--rotk-ink-black)', color: 'var(--rotk-parchment)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--rotk-parchment-aged)', fontSize: '0.85rem' }}>HP</label>
              <input
                type="number"
                value={newToken.hp}
                onChange={(e) => setNewToken({ ...newToken, hp: parseInt(e.target.value) || 0 })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--rotk-bronze)', background: 'var(--rotk-ink-black)', color: 'var(--rotk-parchment)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--rotk-parchment-aged)', fontSize: '0.85rem' }}>Max HP</label>
              <input
                type="number"
                value={newToken.maxHp}
                onChange={(e) => setNewToken({ ...newToken, maxHp: parseInt(e.target.value) || 0 })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--rotk-bronze)', background: 'var(--rotk-ink-black)', color: 'var(--rotk-parchment)' }}
              />
            </div>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--rotk-parchment)' }}>
              <input
                type="checkbox"
                checked={newToken.visible}
                onChange={(e) => setNewToken({ ...newToken, visible: e.target.checked })}
              />
              Visible to Players
            </label>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <ROTKButton variant="primary" size="medium" onClick={handleAddToken} disabled={!newToken.name}>
              Add Token
            </ROTKButton>
          </div>
        </div>
      )}

      {/* Token List */}
      <div>
        <h3 style={{ color: 'var(--rotk-parchment-aged)', marginBottom: '0.75rem' }}>Active Tokens ({vttState?.tokens?.length || 0})</h3>
        {vttState?.tokens?.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {vttState.tokens.map((token: any) => (
              <div
                key={token.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  background: 'rgba(0,0,0,0.3)',
                  border: `1px solid ${token.type === 'enemy' ? 'var(--rotk-cinnabar)' : token.type === 'player' ? 'var(--rotk-jade)' : 'var(--rotk-bronze)'}`,
                  borderRadius: '6px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--rotk-parchment)' }}>{token.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--rotk-parchment-aged)' }}>
                    {token.type.toUpperCase()} • Position: ({token.position?.x}, {token.position?.y}) • HP: {token.hp}/{token.max_hp}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!token.visible_to_players && (
                    <span style={{ padding: '0.25rem 0.5rem', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--rotk-parchment-aged)' }}>
                      Hidden
                    </span>
                  )}
                  <button
                    onClick={() => handleRemoveToken(token.id)}
                    style={{
                      padding: '0.25rem 0.75rem',
                      background: 'var(--rotk-cinnabar)',
                      border: 'none',
                      borderRadius: '4px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--rotk-parchment-aged)', fontStyle: 'italic' }}>No tokens on the map.</p>
        )}
      </div>
    </div>
  );
}

// ============================================
// Map Control Panel
// ============================================
function MapControlPanel({ vttState, onRefresh }: { vttState: any; onRefresh: () => void }) {
  const [mapConfig, setMapConfig] = useState({
    map_id: 'map-1',
    name: 'Battle Map',
    grid_size: 50,
    width: 20,
    height: 15,
    fog_enabled: false,
  });

  const mapPresets = [
    { id: 'city-streets', name: 'City Streets', width: 25, height: 20 },
    { id: 'forest-clearing', name: 'Forest Clearing', width: 20, height: 20 },
    { id: 'mountain-pass', name: 'Mountain Pass', width: 30, height: 15 },
    { id: 'palace-throne', name: 'Palace Throne Room', width: 20, height: 25 },
    { id: 'battlefield', name: 'Open Battlefield', width: 40, height: 30 },
  ];

  const handleSetMap = async () => {
    try {
      await fetch('http://localhost:8000/api/v1/vtt/map/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mapConfig),
      });
      onRefresh();
    } catch (error) {
      console.error('Failed to set map:', error);
    }
  };

  return (
    <div>
      <h2 style={{ margin: '0 0 1.5rem', color: 'var(--rotk-gold)' }}>Map Control</h2>

      {/* Current Map Info */}
      <div style={{ 
        background: 'rgba(0,0,0,0.3)', 
        padding: '1rem', 
        borderRadius: '8px', 
        marginBottom: '1.5rem',
        border: '1px solid var(--rotk-bronze)',
      }}>
        <h3 style={{ margin: '0 0 0.5rem', color: 'var(--rotk-parchment)' }}>Current Map</h3>
        {vttState?.map ? (
          <div style={{ color: 'var(--rotk-parchment-aged)' }}>
            <strong>{vttState.map.name}</strong> ({vttState.map.width}x{vttState.map.height})
            {vttState.map.fog_enabled && <span style={{ marginLeft: '0.5rem', color: 'var(--rotk-blue)' }}>• Fog Enabled</span>}
          </div>
        ) : (
          <p style={{ margin: 0, color: 'var(--rotk-parchment-aged)', fontStyle: 'italic' }}>No map loaded</p>
        )}
      </div>

      {/* Map Presets */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: 'var(--rotk-parchment-aged)', marginBottom: '0.75rem' }}>Quick Load Map</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {mapPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setMapConfig({ ...mapConfig, map_id: preset.id, name: preset.name, width: preset.width, height: preset.height })}
              style={{
                padding: '0.5rem 1rem',
                background: mapConfig.map_id === preset.id ? 'var(--rotk-jade)' : 'rgba(0,168,107,0.2)',
                border: '1px solid var(--rotk-jade)',
                borderRadius: '4px',
                color: 'var(--rotk-parchment)',
                cursor: 'pointer',
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Map Configuration */}
      <div style={{ 
        background: 'rgba(0,0,0,0.3)', 
        padding: '1.5rem', 
        borderRadius: '8px',
        border: '1px solid var(--rotk-bronze)',
      }}>
        <h3 style={{ color: 'var(--rotk-gold)', marginBottom: '1rem' }}>Map Configuration</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--rotk-parchment-aged)', fontSize: '0.85rem' }}>Map Name</label>
            <input
              type="text"
              value={mapConfig.name}
              onChange={(e) => setMapConfig({ ...mapConfig, name: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--rotk-bronze)', background: 'var(--rotk-ink-black)', color: 'var(--rotk-parchment)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--rotk-parchment-aged)', fontSize: '0.85rem' }}>Width (tiles)</label>
            <input
              type="number"
              value={mapConfig.width}
              onChange={(e) => setMapConfig({ ...mapConfig, width: parseInt(e.target.value) || 20 })}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--rotk-bronze)', background: 'var(--rotk-ink-black)', color: 'var(--rotk-parchment)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--rotk-parchment-aged)', fontSize: '0.85rem' }}>Height (tiles)</label>
            <input
              type="number"
              value={mapConfig.height}
              onChange={(e) => setMapConfig({ ...mapConfig, height: parseInt(e.target.value) || 15 })}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--rotk-bronze)', background: 'var(--rotk-ink-black)', color: 'var(--rotk-parchment)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--rotk-parchment-aged)', fontSize: '0.85rem' }}>Grid Size (px)</label>
            <input
              type="number"
              value={mapConfig.grid_size}
              onChange={(e) => setMapConfig({ ...mapConfig, grid_size: parseInt(e.target.value) || 50 })}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--rotk-bronze)', background: 'var(--rotk-ink-black)', color: 'var(--rotk-parchment)' }}
            />
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--rotk-parchment)' }}>
            <input
              type="checkbox"
              checked={mapConfig.fog_enabled}
              onChange={(e) => setMapConfig({ ...mapConfig, fog_enabled: e.target.checked })}
            />
            Enable Fog of War
          </label>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <ROTKButton variant="primary" size="medium" icon={Map} onClick={handleSetMap}>
            Load Map
          </ROTKButton>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Combat Control Panel
// ============================================
function CombatControlPanel({ vttState, onRefresh }: { vttState: any; onRefresh: () => void }) {
  const phases = ['exploration', 'combat', 'social', 'rest', 'cutscene'];

  const handleSetPhase = async (phase: string) => {
    try {
      await fetch(`http://localhost:8000/api/v1/vtt/phase/set?phase=${phase}`, {
        method: 'POST',
      });
      onRefresh();
    } catch (error) {
      console.error('Failed to set phase:', error);
    }
  };

  const handleNextInitiative = async () => {
    try {
      await fetch('http://localhost:8000/api/v1/vtt/initiative/next', {
        method: 'POST',
      });
      onRefresh();
    } catch (error) {
      console.error('Failed to advance initiative:', error);
    }
  };

  const handleClearInitiative = async () => {
    try {
      await fetch('http://localhost:8000/api/v1/vtt/initiative/clear', {
        method: 'DELETE',
      });
      onRefresh();
    } catch (error) {
      console.error('Failed to clear initiative:', error);
    }
  };

  return (
    <div>
      <h2 style={{ margin: '0 0 1.5rem', color: 'var(--rotk-gold)' }}>Combat Control</h2>

      {/* Game Phase */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--rotk-parchment-aged)', marginBottom: '0.75rem' }}>Game Phase</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {phases.map((phase) => (
            <button
              key={phase}
              onClick={() => handleSetPhase(phase)}
              style={{
                padding: '0.75rem 1.5rem',
                background: vttState?.phase === phase ? 'var(--rotk-cinnabar)' : 'rgba(196,30,58,0.2)',
                border: '2px solid var(--rotk-cinnabar)',
                borderRadius: '6px',
                color: 'var(--rotk-parchment)',
                cursor: 'pointer',
                fontWeight: 'bold',
                textTransform: 'capitalize',
              }}
            >
              {phase}
            </button>
          ))}
        </div>
      </div>

      {/* Initiative Tracker */}
      <div style={{ 
        background: 'rgba(0,0,0,0.3)', 
        padding: '1.5rem', 
        borderRadius: '8px',
        border: '1px solid var(--rotk-bronze)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, color: 'var(--rotk-gold)' }}>Initiative Order</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <ROTKButton variant="primary" size="small" onClick={handleNextInitiative}>
              Next Turn
            </ROTKButton>
            <ROTKButton variant="secondary" size="small" onClick={handleClearInitiative}>
              Clear
            </ROTKButton>
          </div>
        </div>
        
        {vttState?.initiative?.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {vttState.initiative.map((entry: any, index: number) => (
              <div
                key={entry.token_id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  background: entry.is_current ? 'rgba(212,175,55,0.3)' : 'rgba(0,0,0,0.2)',
                  border: `2px solid ${entry.is_current ? 'var(--rotk-gold)' : 'transparent'}`,
                  borderRadius: '4px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ 
                    width: '30px', 
                    height: '30px', 
                    borderRadius: '50%', 
                    background: 'var(--rotk-bronze)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: 'var(--rotk-parchment)',
                  }}>
                    {index + 1}
                  </span>
                  <span style={{ color: 'var(--rotk-parchment)', fontWeight: entry.is_current ? 'bold' : 'normal' }}>
                    {entry.name}
                  </span>
                </div>
                <span style={{ color: 'var(--rotk-gold)', fontWeight: 'bold' }}>
                  Init: {entry.initiative}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--rotk-parchment-aged)', fontStyle: 'italic' }}>No initiative set. Start combat to roll initiative.</p>
        )}
      </div>
    </div>
  );
}

// ============================================
// GM Chat Panel
// ============================================
function GMChatPanel({ vttState, onRefresh }: { vttState: any; onRefresh: () => void }) {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('narration');

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      await fetch('http://localhost:8000/api/v1/vtt/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'Game Master',
          sender_type: 'gm',
          content: message,
          message_type: messageType,
        }),
      });
      setMessage('');
      onRefresh();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleClearChat = async () => {
    try {
      await fetch('http://localhost:8000/api/v1/vtt/chat/clear', {
        method: 'DELETE',
      });
      onRefresh();
    } catch (error) {
      console.error('Failed to clear chat:', error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: 'var(--rotk-gold)' }}>GM Chat & Narration</h2>
        <ROTKButton variant="secondary" size="small" onClick={handleClearChat}>
          Clear Chat
        </ROTKButton>
      </div>

      {/* Message Input */}
      <div style={{ 
        background: 'rgba(0,0,0,0.3)', 
        padding: '1.5rem', 
        borderRadius: '8px',
        border: '1px solid var(--rotk-gold)',
        marginBottom: '1.5rem',
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--rotk-parchment-aged)' }}>Message Type</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['narration', 'action', 'chat', 'roll'].map((type) => (
              <button
                key={type}
                onClick={() => setMessageType(type)}
                style={{
                  padding: '0.5rem 1rem',
                  background: messageType === type ? 'var(--rotk-gold)' : 'transparent',
                  color: messageType === type ? 'var(--rotk-ink-black)' : 'var(--rotk-parchment)',
                  border: '1px solid var(--rotk-gold)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message or narration..."
          rows={4}
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '4px',
            border: '1px solid var(--rotk-bronze)',
            background: 'var(--rotk-ink-black)',
            color: 'var(--rotk-parchment)',
            resize: 'vertical',
            fontFamily: 'var(--rotk-font-body)',
          }}
        />
        <div style={{ marginTop: '1rem' }}>
          <ROTKButton variant="primary" size="medium" icon={MessageSquare} onClick={handleSendMessage}>
            Send to Players
          </ROTKButton>
        </div>
      </div>

      {/* Chat History */}
      <div style={{ 
        background: 'rgba(0,0,0,0.2)', 
        padding: '1rem', 
        borderRadius: '8px',
        border: '1px solid var(--rotk-bronze)',
        maxHeight: '300px',
        overflowY: 'auto',
      }}>
        <h3 style={{ color: 'var(--rotk-parchment-aged)', marginBottom: '0.75rem' }}>Recent Messages</h3>
        {vttState?.chat_messages?.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[...vttState.chat_messages].reverse().slice(0, 20).map((msg: any, index: number) => (
              <div
                key={index}
                style={{
                  padding: '0.75rem',
                  background: msg.sender_type === 'gm' ? 'rgba(212,175,55,0.1)' : 'rgba(0,0,0,0.2)',
                  borderRadius: '4px',
                  borderLeft: `3px solid ${msg.sender_type === 'gm' ? 'var(--rotk-gold)' : msg.sender_type === 'system' ? 'var(--rotk-blue)' : 'var(--rotk-jade)'}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--rotk-parchment)', fontSize: '0.85rem' }}>
                    {msg.sender} <span style={{ color: 'var(--rotk-parchment-aged)', fontWeight: 'normal' }}>({msg.message_type})</span>
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--rotk-ink-wash)' }}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p style={{ margin: 0, color: 'var(--rotk-parchment)', lineHeight: 1.4 }}>{msg.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--rotk-parchment-aged)', fontStyle: 'italic' }}>No messages yet.</p>
        )}
      </div>
    </div>
  );
}

// ============================================
// Effects Panel
// ============================================
function EffectsPanel({ vttState, onRefresh }: { vttState: any; onRefresh: () => void }) {
  const handleRevealAll = async () => {
    // Reveal a large area
    const cells = [];
    for (let x = 0; x < 30; x++) {
      for (let y = 0; y < 30; y++) {
        cells.push({ x, y });
      }
    }
    try {
      await fetch('http://localhost:8000/api/v1/vtt/fog/reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revealed_cells: cells }),
      });
      onRefresh();
    } catch (error) {
      console.error('Failed to reveal fog:', error);
    }
  };

  const handleResetFog = async () => {
    try {
      await fetch('http://localhost:8000/api/v1/vtt/fog/reset', {
        method: 'DELETE',
      });
      onRefresh();
    } catch (error) {
      console.error('Failed to reset fog:', error);
    }
  };

  const handleResetVTT = async () => {
    if (!confirm('Are you sure you want to reset all VTT state? This cannot be undone.')) return;
    
    try {
      await fetch('http://localhost:8000/api/v1/vtt/state/reset', {
        method: 'POST',
      });
      onRefresh();
    } catch (error) {
      console.error('Failed to reset VTT:', error);
    }
  };

  const revealedCount = Object.values(vttState?.fog_of_war || {}).filter(Boolean).length;

  return (
    <div>
      <h2 style={{ margin: '0 0 1.5rem', color: 'var(--rotk-gold)' }}>Effects & Fog of War</h2>

      {/* Fog of War Controls */}
      <div style={{ 
        background: 'rgba(0,0,0,0.3)', 
        padding: '1.5rem', 
        borderRadius: '8px',
        border: '1px solid var(--rotk-bronze)',
        marginBottom: '1.5rem',
      }}>
        <h3 style={{ color: 'var(--rotk-parchment)', marginBottom: '1rem' }}>Fog of War</h3>
        <p style={{ color: 'var(--rotk-parchment-aged)', marginBottom: '1rem' }}>
          Currently revealed: <strong>{revealedCount}</strong> cells
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <ROTKButton variant="primary" size="medium" onClick={handleRevealAll}>
            Reveal All
          </ROTKButton>
          <ROTKButton variant="secondary" size="medium" onClick={handleResetFog}>
            Hide All (Reset Fog)
          </ROTKButton>
        </div>
      </div>

      {/* Danger Zone */}
      <div style={{ 
        background: 'rgba(139,0,0,0.2)', 
        padding: '1.5rem', 
        borderRadius: '8px',
        border: '2px solid var(--rotk-cinnabar)',
      }}>
        <h3 style={{ color: 'var(--rotk-cinnabar)', marginBottom: '1rem' }}>⚠️ Danger Zone</h3>
        <p style={{ color: 'var(--rotk-parchment-aged)', marginBottom: '1rem' }}>
          These actions cannot be undone. Use with caution.
        </p>
        <ROTKButton variant="primary" size="medium" onClick={handleResetVTT}>
          Reset All VTT State
        </ROTKButton>
      </div>
    </div>
  );
}
