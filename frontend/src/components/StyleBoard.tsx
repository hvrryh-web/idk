
import { useEffect, useState } from "react";
import './StyleBoard.css';

const backgrounds = [
  '/assets/backgrounds/map-bg.jpg',
  '/assets/backgrounds/city-bg.jpg'
];
const banners = [
  '/assets/banners/banner.png',
  '/assets/banners/jade-plaque.png'
];
const fx = [
  '/assets/fx/brushstroke-fx.png'
];
const yutoSanoArtworks = [
  'https://gokuragukai.com/wp-content/uploads/2022/03/yuto-sano-1.jpg',
  'https://gokuragukai.com/wp-content/uploads/2022/03/yuto-sano-2.jpg',
  'https://gokuragukai.com/wp-content/uploads/2022/03/yuto-sano-3.jpg'
];

function getCharacterNameFromFilename(filename: string) {
  // e.g. lu-bu-yuto-sano.jpg => Lu Bu
  const base = filename.replace(/-yuto-sano.*$/, '').replace(/-/g, ' ');
  return base.replace(/\b\w/g, c => c.toUpperCase());
}

export default function StyleBoard() {
  const [characterAssets, setCharacterAssets] = useState<string[]>([]);

  useEffect(() => {
    // Dynamically list all character assets in /assets/characters (requires backend or static manifest)
    // For demo, hardcode known assets
    setCharacterAssets([
      '/assets/characters/lu-bu-yuto-sano.jpg',
      '/assets/characters/diao-chan-yuto-sano.jpg'
    ]);
  }, []);

  return (
    <div className="style-board">
      <h2>Three Kingdoms Style Board</h2>
      <section>
        <h3>Yuto Sano LoRA / Style Embedding</h3>
        <div className="artwork-row">
          {yutoSanoArtworks.map((url, i) => (
            <img key={i} src={url} alt={`Yuto Sano artwork ${i+1}`} className="artwork" />
          ))}
        </div>
      </section>
      <section>
        <h3>Character Portraits (Latest)</h3>
        <div className="asset-row">
          {characterAssets.map((src, i) => (
            <div key={i} className="asset-preview character-preview">
              <img src={src} alt={getCharacterNameFromFilename(src.split('/').pop() || '')} />
              <div className="fx-overlay bloom" />
              <div className="fx-overlay vignette" />
              <div className="fx-overlay grain" />
              <div className="character-name">{getCharacterNameFromFilename(src.split('/').pop() || '')}</div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3>Backgrounds (LUT, Bloom, Vignette, Grain)</h3>
        <div className="asset-row">
          {backgrounds.map((src, i) => (
            <div key={i} className="asset-preview bg-preview">
              <img src={src} alt={`Background ${i+1}`} />
              <div className="fx-overlay bloom" />
              <div className="fx-overlay vignette" />
              <div className="fx-overlay grain" />
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3>Banners & Jade Plaques (LUT)</h3>
        <div className="asset-row">
          {banners.map((src, i) => (
            <div key={i} className="asset-preview banner-preview">
              <img src={src} alt={`Banner ${i+1}`} />
              <div className="fx-overlay lut" />
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3>FX Overlays (Brushstroke, Bloom)</h3>
        <div className="asset-row">
          {fx.map((src, i) => (
            <div key={i} className="asset-preview fx-preview">
              <img src={src} alt={`FX ${i+1}`} />
              <div className="fx-overlay bloom" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
