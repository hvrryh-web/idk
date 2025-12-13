import CharacterPreview from './components/CharacterPreview';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useApi } from "./api";
import GameRoom from "./pages/GameRoom";
import GameScreen from "./pages/GameScreen";
import ProfileSheet from "./pages/ProfileSheet";
import CultivationSheet from "./pages/CultivationSheet";
import SoulCoreSheet from "./pages/SoulCoreSheet";
import StyleBoard from './components/StyleBoard';
import DomainSourceSheet from "./pages/DomainSourceSheet";
import HelpPage from "./pages/HelpPage";
import WikiIndex from "./pages/WikiIndex";
import WikiArticle from "./pages/WikiArticle";
import SRDBook from "./pages/SRDBook";
import CharacterManager from "./pages/CharacterManager";
import ASCIIArtManager from "./pages/ASCIIArtManager";
import CombatView from "./components/combat/CombatView";
import AsciiVisualizer from "./pages/AsciiVisualizer";
import MapScreen from "./screens/MapScreen";
import WarMapScreen from "./screens/WarMapScreen";
import CityScreen from "./screens/CityScreen";
import RegionalMapScreen from "./screens/RegionalMapScreen";
import WorldMapScreen from "./screens/WorldMapScreen";
import PersonalViewScreen from "./screens/PersonalViewScreen";
import ConversationScreen from "./screens/ConversationScreen";
import CharacterCreation from "./components/CharacterCreation";
import CharacterCodex from "./components/CharacterCodex";
import { FateCardBuilderPage } from "./fateCardBuilder/pages/FateCardBuilderPage";
import { ZhouXuWidget } from "./components/advisor";
import { CityHubScene, WarCouncilScene, BattleHUDScene, SiegeOverlayScene, ComponentShowcaseScene, Ro3KBattleScene } from "./pages/rotk";
import { CharacterCreatorPage } from "./character/CharacterCreatorPage";
import TestBattle from "./pages/TestBattle";
import DynamicMapPage from "./pages/DynamicMapPage";
import CharacterShowcasePage from "./pages/CharacterShowcasePage";
// New Hub Pages
import HomePage from "./pages/HomePage";
import MapHubPage from "./pages/MapHubPage";
import PersonalHubPage from "./pages/PersonalHubPage";
import BattleHubPage from "./pages/BattleHubPage";
import CodexHubPage from "./pages/CodexHubPage";
import CharacterStatsPage from "./pages/CharacterStatsPage";
import QuestHubPage from "./pages/QuestHubPage";
import ShowcasePage from "./pages/ShowcasePage";
import RealmMapPage from "./pages/RealmMapPage";
import CodexStyleBoardPage from "./pages/CodexStyleBoardPage";
import CodexCharactersPage from "./pages/CodexCharactersPage";
import ToolsHubPage from "./pages/ToolsHubPage";
// Profile and Game Master Pages
import ProfileLoaderPage from "./pages/ProfileLoaderPage";
import GameMasterDashboard from "./pages/GameMasterDashboard";
// Navigation Components
import Breadcrumb from "./components/Breadcrumb";

// Wrapper component for Zhou Xu widget to access React Router navigation
function ZhouXuWithNavigation() {
  const navigate = useNavigate();
  return (
    <ZhouXuWidget 
      onOpenFullHelp={() => navigate('/help')}
      onNavigateToArticle={(id) => navigate(`/wiki/${id}`)}
    />
  );
}

export default function App() {
  // Initialize API diagnostics hook for error tracking (used for future diagnostics panel)
  useApi();

  return (
    <BrowserRouter>
      <div className="app">
        <nav className="global-nav">
          <a href="/home" title="Main Hub">🏠 Home</a>
          <a href="/game" title="Visual Novel Game Screen">🎮 Game</a>
          <a href="/map-hub" title="Maps & World">🗺️ Maps</a>
          <a href="/battle-hub" title="Combat & Battles">⚔️ Battle</a>
          <a href="/characters" title="Character Manager">👤 Characters</a>
          <a href="/tools-hub" title="Tools & Utilities">🛠️ Tools</a>
          <a href="/codex-hub" title="Knowledge Wiki & Codex">📚 Codex</a>
          <span className="nav-separator">|</span>
          <a href="/help" title="Help & Documentation">❓ Help</a>
          <a href="/profile" title="Switch Profile or Start New Session">🔐 Profile</a>
        </nav>
        <Breadcrumb />
        <Routes>
          {/* Profile Selection & Game Master */}
          <Route path="/profile" element={<ProfileLoaderPage />} />
          <Route path="/gm-dashboard" element={<GameMasterDashboard />} />
          
          {/* Main Hub Pages */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/map-hub" element={<MapHubPage />} />
          <Route path="/personal-hub" element={<PersonalHubPage />} />
          <Route path="/battle-hub" element={<BattleHubPage />} />
          <Route path="/codex-hub" element={<CodexHubPage />} />
          <Route path="/tools-hub" element={<ToolsHubPage />} />
          <Route path="/character-stats" element={<CharacterStatsPage />} />
          <Route path="/character-stats/:id" element={<CharacterStatsPage />} />
          <Route path="/quest-hub" element={<QuestHubPage />} />
          <Route path="/showcase" element={<ShowcasePage />} />
          <Route path="/realm-map" element={<RealmMapPage />} />
          <Route path="/codex-styleboard" element={<CodexStyleBoardPage />} />
          <Route path="/codex-characters" element={<CodexCharactersPage />} />
          
          {/* Alpha Test Entry Point */}
          <Route path="/" element={<GameRoom />} />
          <Route path="/game" element={<GameScreen />} />
          <Route path="/map" element={<MapScreen />} />
          <Route path="/dynamic-map" element={<DynamicMapPage />} />
          <Route path="/war-map" element={<WarMapScreen />} />
          <Route path="/city" element={<CityScreen />} />
          <Route path="/region" element={<RegionalMapScreen />} />
          <Route path="/world" element={<WorldMapScreen />} />
          <Route path="/personal" element={<PersonalViewScreen />} />
          <Route path="/conversation" element={<ConversationScreen />} />
          <Route path="/profile/:id" element={<ProfileSheet />} />
          <Route path="/cultivation/:id" element={<CultivationSheet />} />
          <Route path="/soul-core/:id" element={<SoulCoreSheet />} />
          <Route path="/domain-source/:id" element={<DomainSourceSheet />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/wiki" element={<WikiIndex />} />
          <Route path="/wiki/:id" element={<WikiArticle />} />
          <Route path="/srd" element={<SRDBook />} />
          <Route path="/characters" element={<CharacterManager />} />
          <Route path="/characters/create" element={<CharacterCreation />} />
          <Route path="/character/create" element={<CharacterCreatorPage />} />
          <Route path="/ascii-art" element={<ASCIIArtManager />} />
          
          {/* Battle & Combat Routes */}
          <Route path="/combat/:encounterId" element={<CombatView />} />
          <Route path="/combat-test" element={<TestBattle />} />
          <Route path="/rotk/city" element={<CityHubScene />} />
          <Route path="/rotk/war" element={<WarCouncilScene />} />
          <Route path="/rotk/battle" element={<BattleHUDScene />} />
          <Route path="/rotk/ro3k-battle" element={<Ro3KBattleScene />} />
          <Route path="/rotk/siege" element={<SiegeOverlayScene />} />
          <Route path="/rotk/showcase" element={<ComponentShowcaseScene />} />
          
          {/* Other Routes */}
          <Route path="/ascii" element={<AsciiVisualizer />} />
          <Route path="/fate-card-builder" element={<FateCardBuilderPage />} />
          <Route path="/characters/showcase" element={<CharacterShowcasePage />} />
        </Routes>
        <StyleBoard />
        <CharacterPreview />
        <CharacterCodex />
        {/* Zhou Xu Divine Advisor - Global help widget */}
        <ZhouXuWithNavigation />
      </div>
    </BrowserRouter>
  );
}
