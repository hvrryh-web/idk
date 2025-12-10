import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GameRoom from './pages/GameRoom';
import ProfileSheet from './pages/ProfileSheet';
import CultivationSheet from './pages/CultivationSheet';
import SoulCoreSheet from './pages/SoulCoreSheet';
import DomainSourceSheet from './pages/DomainSourceSheet';
import HelpPage from './pages/HelpPage';
import WikiIndex from './pages/WikiIndex';
import WikiArticle from './pages/WikiArticle';
import SRDBook from './pages/SRDBook';
import CharacterManager from './pages/CharacterManager';
import CombatView from './components/combat/CombatView';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<GameRoom />} />
          <Route path="/profile/:id" element={<ProfileSheet />} />
          <Route path="/cultivation/:id" element={<CultivationSheet />} />
          <Route path="/soul-core/:id" element={<SoulCoreSheet />} />
          <Route path="/domain-source/:id" element={<DomainSourceSheet />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/wiki" element={<WikiIndex />} />
          <Route path="/wiki/:id" element={<WikiArticle />} />
          <Route path="/srd" element={<SRDBook />} />
          <Route path="/characters" element={<CharacterManager />} />
          <Route path="/combat/:encounterId" element={<CombatView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
