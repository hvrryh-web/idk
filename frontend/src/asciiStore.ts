const STORAGE_KEY = "gameRoomAsciiArt";
let memoryStore = "";

const hasStorage = () => typeof window !== "undefined" && "localStorage" in window;

export const saveAsciiArt = (art: string) => {
  memoryStore = art;
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, art);
  } catch (error) {
    console.warn("Unable to persist ASCII art:", error);
  }
};

export const loadAsciiArt = () => {
  if (hasStorage()) {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        memoryStore = stored;
        return stored;
      }
    } catch (error) {
      console.warn("Unable to load stored ASCII art:", error);
    }
  }

  return memoryStore;
};
