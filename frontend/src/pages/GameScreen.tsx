import { useCallback, useEffect, useState } from "react";
import ChatRoom from "../components/ChatRoom";
import CharacterPanel from "../components/CharacterPanel";
import RoomList from "../components/RoomList";
import TvAsciiPanel from "../components/TvAsciiPanel";
import { fetchAsciiArt } from "../api";
import "../styles/GameScreen.css";

export default function GameScreen() {
  const [selectedRoom, setSelectedRoom] = useState<string>("main");
  const [asciiArt, setAsciiArt] = useState("");
  const [asciiError, setAsciiError] = useState<string | null>(null);
  const [loadingArt, setLoadingArt] = useState(false);

  const refreshAsciiArt = useCallback(async () => {
    setLoadingArt(true);
    setAsciiError(null);
    try {
      const result = await fetchAsciiArt("default");
      setAsciiArt(result.art || "");
    } catch (error) {
      console.error("Failed to fetch ASCII art", error);
      setAsciiError("Unable to fetch ASCII art. Try swapping again.");
    } finally {
      setLoadingArt(false);
    }
  }, []);

  useEffect(() => {
    refreshAsciiArt();
  }, [refreshAsciiArt]);

  return (
    <div className="game-screen">
      <aside className="game-sidebar">
        <RoomList onRoomSelect={setSelectedRoom} selectedRoom={selectedRoom} />
        <CharacterPanel />
      </aside>
      <main className="game-main">
        <section className="game-content">
          <div className="game-panels">
            <div className="chat-panel">
              <ChatRoom roomId={selectedRoom} />
            </div>
            <TvAsciiPanel
              asciiArt={asciiArt}
              onRefresh={refreshAsciiArt}
              loading={loadingArt}
              error={asciiError}
            />
          </div>
        </section>
        <footer className="combat-hud-area">
          <div className="combat-placeholder">
            Combat HUD (Phase 2)
          </div>
        </footer>
      </main>
    </div>
  );
}
