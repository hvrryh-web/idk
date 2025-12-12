import CharacterPreview from './components/CharacterPreview';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ErrorBoundary } from "./ErrorBoundary";
import { ApiErrorBanner } from "./ApiErrorBanner";
import React from "react";
import { useApi } from "./api";
import { DebugPanel } from "./DebugPanel";
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
import { CharacterCreatorPage } from "./character/CharacterCreatorPage";
import { FateCardBuilderPage } from "./fateCardBuilder/pages/FateCardBuilderPage";
import { ZhouXuWidget } from "./components/advisor";

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
  // Use global API hook for error/debug info
  const apiDiagnostics = useApi();
  const { apiError, lastApiCall, lastStatus } = apiDiagnostics;

  return (
    <BrowserRouter>
      <div className="app">
        <nav className="global-nav">
          <a href="/">Home</a>
          <a href="/map">Map</a>
          <a href="/war-map">War Map</a>
          <a href="/city">City</a>
          <a href="/region">Region</a>
          <a href="/world">World</a>
          <a href="/personal">Personal</a>
          <a href="/conversation">Conversation</a>
          <a href="/rotk/city">ROTK City</a>
          <a href="/rotk/war">ROTK War</a>
          <a href="/rotk/battle">ROTK Battle</a>
          <a href="/rotk/siege">ROTK Siege</a>
        </nav>
        <Routes>
          <Route path="/" element={<GameRoom />} />
          <Route path="/game" element={<GameScreen />} />
          <Route path="/map" element={<MapScreen />} />
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
          <Route path="/combat/:encounterId" element={<CombatView />} />
          <Route path="/ascii" element={<AsciiVisualizer />} />
          <Route path="/fate-card-builder" element={<FateCardBuilderPage />} />
          <Route path="/rotk/city" element={<CityHubScene />} />
          <Route path="/rotk/war" element={<WarCouncilScene />} />
          <Route path="/rotk/battle" element={<BattleHUDScene />} />
          <Route path="/rotk/siege" element={<SiegeOverlayScene />} />
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
