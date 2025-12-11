import type { CharacterAvatar as AvatarType } from "../types";
import "../styles/CharacterAvatar.css";

interface CharacterAvatarProps {
  avatar?: AvatarType;
  name: string;
  size?: "small" | "medium" | "large";
  showName?: boolean;
}

export default function CharacterAvatar({
  avatar,
  name,
  size = "medium",
  showName = false,
}: CharacterAvatarProps) {
  // Default avatar if none provided
  const defaultAvatar: AvatarType = {
    color: "#95A5A6",
    icon: "default",
    backgroundPattern: "none",
  };

  const currentAvatar = avatar || defaultAvatar;
  const sizeClass = `avatar-${size}`;

  // Generate icon based on icon identifier
  const getIconSymbol = (icon: string): string => {
    const iconMap: Record<string, string> = {
      monk: "🧘",
      phoenix: "🔥",
      sage: "📿",
      guardian: "🛡️",
      adept: "⚡",
      elder: "👴",
      merchant: "💰",
      alchemist: "⚗️",
      poet: "📜",
      warrior: "⚔️",
      mage: "🔮",
      default: "👤",
    };
    return iconMap[icon] || iconMap.default;
  };

  // Generate background pattern
  const getPatternStyle = (pattern?: string): React.CSSProperties => {
    if (!pattern || pattern === "none") return {};

    const patterns: Record<string, string> = {
      waves: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)",
      flames: "radial-gradient(circle at 50% 100%, rgba(255,255,255,0.2) 0%, transparent 70%)",
      lotus: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)",
      mountain: "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.2) 100%)",
      lightning: "repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(255,255,255,0.15) 5px, rgba(255,255,255,0.15) 10px)",
      scroll: "repeating-linear-gradient(90deg, transparent, transparent 15px, rgba(255,255,255,0.1) 15px, rgba(255,255,255,0.1) 16px)",
      coins: "radial-gradient(circle at 30% 30%, rgba(255,215,0,0.2) 0%, transparent 50%)",
      shield: "linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%)",
      potion: "radial-gradient(circle at 50% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)",
      stars: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.2) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.15) 0%, transparent 40%)",
    };

    return {
      backgroundImage: patterns[pattern] || "",
    };
  };

  return (
    <div className={`character-avatar-container ${sizeClass}`}>
      <div
        className="character-avatar"
        style={{
          backgroundColor: currentAvatar.color,
          ...getPatternStyle(currentAvatar.backgroundPattern),
        }}
      >
        <div className="avatar-icon">{getIconSymbol(currentAvatar.icon || "")}</div>
        {currentAvatar.portraitUrl && (
          <img
            src={currentAvatar.portraitUrl}
            alt={name}
            className="avatar-portrait"
          />
        )}
      </div>
      {showName && <div className="avatar-name">{name}</div>}
    </div>
  );
}
