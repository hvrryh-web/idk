import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import DomainSourceSheet from "./pages/DomainSourceSheet";
import HelpPage from "./pages/HelpPage";
import WikiIndex from "./pages/WikiIndex";
import WikiArticle from "./pages/WikiArticle";
import SRDBook from "./pages/SRDBook";
import CharacterManager from "./pages/CharacterManager";
import ASCIIArtManager from "./pages/ASCIIArtManager";
import CombatView from "./components/combat/CombatView";
import AsciiVisualizer from "./pages/AsciiVisualizer";

export default function App() {
  // Use global API hook for error/debug info
  const apiDiagnostics = useApi();
  const { apiError, lastApiCall, lastStatus } = apiDiagnostics;

  return (
    <ErrorBoundary>
      <ApiErrorBanner error={apiError} />
      <DebugPanel lastApiCall={lastApiCall} lastStatus={lastStatus} apiError={apiError} />
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route path="/" element={<GameRoom systemStatus={apiDiagnostics} />} />
            <Route path="/game" element={<GameScreen />} />
            <Route path="/profile/:id" element={<ProfileSheet />} />
            <Route path="/cultivation/:id" element={<CultivationSheet />} />
            <Route path="/soul-core/:id" element={<SoulCoreSheet />} />
            <Route path="/domain-source/:id" element={<DomainSourceSheet />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/wiki" element={<WikiIndex />} />
            <Route path="/wiki/:id" element={<WikiArticle />} />
            <Route path="/srd" element={<SRDBook />} />
            <Route path="/characters" element={<CharacterManager />} />
            <Route path="/ascii-art" element={<ASCIIArtManager />} />
            <Route path="/combat/:encounterId" element={<CombatView />} />
            <Route path="/ascii" element={<AsciiVisualizer />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
