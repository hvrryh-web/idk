"""
Character Visual Asset Integration Service

Provides integration between the character creation system and the visual asset
generation pipeline, supporting multiple quality levels from wiki-detailed art
down to ASCII combat illustrations.
"""

import json
import logging
import os
import uuid
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)


class AssetQualityLevel(str, Enum):
    """Visual asset quality levels in descending order of quality."""
    WIKI_DETAILED = "wiki_detailed"
    STANDARD_GAMEPLAY = "standard_gameplay"
    BATTLE_TOKEN_PC = "battle_token_pc"
    BATTLE_TOKEN_NPC = "battle_token_npc"
    BATTLE_MAP_TOKEN = "battle_map_token"
    ASCII_COMBAT = "ascii_combat"
    ASCII_MAP_EVENT = "ascii_map_event"


class CharacterType(str, Enum):
    """Character types that determine asset eligibility."""
    PLAYER_CHARACTER = "player_character"
    NAMED_NPC = "named_npc"
    GENERIC_NPC = "generic_npc"


@dataclass
class VisualTraits:
    """Visual characteristics of a character."""
    gender: str = "female"
    age_range: str = "young_adult"
    hair_color: str = "black"
    hair_style: str = "long flowing"
    eye_color: str = "brown"
    skin_tone: str = "fair"
    build: str = "average"
    distinctive_features: Optional[str] = None


@dataclass
class OutfitConfig:
    """Outfit configuration for a character."""
    description: str = "cultivation robes"
    primary_color: str = "white"
    secondary_color: str = "blue"
    accent_color: Optional[str] = None
    armor_elements: Optional[List[str]] = None
    style_tier: str = "medium"


@dataclass
class CharacterVisualConfig:
    """Complete visual configuration for a character."""
    char_id: str
    display_name: str
    character_type: CharacterType
    faction: str = "Neutral"
    visual_traits: VisualTraits = field(default_factory=VisualTraits)
    outfit: OutfitConfig = field(default_factory=OutfitConfig)
    signature_props: Optional[Dict[str, Any]] = None
    palette: Optional[Dict[str, str]] = None
    
    def is_eligible_for_wiki_art(self) -> bool:
        """Check if character is eligible for wiki-quality art."""
        return self.character_type in [
            CharacterType.PLAYER_CHARACTER,
            CharacterType.NAMED_NPC
        ]
    
    def to_manifest_entry(self) -> Dict[str, Any]:
        """Convert to wiki character manifest entry format."""
        return {
            "char_id": self.char_id,
            "display_name": self.display_name,
            "role": self._get_role_string(),
            "faction": self.faction,
            "character_type": self.character_type.value,
            "allowed": self.is_eligible_for_wiki_art(),
            "visual_traits": {
                "gender": self.visual_traits.gender,
                "age_range": self.visual_traits.age_range,
                "hair_color": self.visual_traits.hair_color,
                "hair_style": self.visual_traits.hair_style,
                "eye_color": self.visual_traits.eye_color,
                "skin_tone": self.visual_traits.skin_tone,
                "build": self.visual_traits.build,
                "distinctive_features": self.visual_traits.distinctive_features
            },
            "outfit": {
                "description": self.outfit.description,
                "primary_color": self.outfit.primary_color,
                "secondary_color": self.outfit.secondary_color,
                "accent_color": self.outfit.accent_color,
                "armor_elements": self.outfit.armor_elements,
                "style_tier": self.outfit.style_tier
            },
            "signature_props": self.signature_props or {},
            "palette": self.palette or self._generate_default_palette(),
            "variants": {
                "portrait": ["default"],
                "fullbody": ["default"],
                "expressions": ["standard_6"] if self.is_eligible_for_wiki_art() else None
            },
            "generation_seeds": {
                "portrait_base": self._generate_seed("portrait"),
                "fullbody_base": self._generate_seed("fullbody"),
                "expressions_base": self._generate_seed("expressions")
            }
        }
    
    def _get_role_string(self) -> str:
        """Get human-readable role string."""
        role_map = {
            CharacterType.PLAYER_CHARACTER: "Player Character",
            CharacterType.NAMED_NPC: "Named Character",
            CharacterType.GENERIC_NPC: "Generic NPC"
        }
        return role_map.get(self.character_type, "Unknown")
    
    def _generate_seed(self, prefix: str) -> int:
        """Generate deterministic seed from character ID."""
        seed_str = f"{self.char_id}_{prefix}"
        return abs(hash(seed_str)) % 2147483647
    
    def _generate_default_palette(self) -> Dict[str, str]:
        """Generate default color palette based on outfit colors."""
        return {
            "primary": self._color_name_to_hex(self.outfit.primary_color),
            "secondary": self._color_name_to_hex(self.outfit.secondary_color),
            "accent": self._color_name_to_hex(self.outfit.accent_color or "gold")
        }
    
    @staticmethod
    def _color_name_to_hex(color_name: str) -> str:
        """Convert color name to hex (simplified)."""
        color_map = {
            "white": "#FFFFFF",
            "black": "#1C1C1C",
            "red": "#C41E3A",
            "blue": "#007FFF",
            "green": "#00A86B",
            "gold": "#D4AF37",
            "silver": "#C0C0C0",
            "jade": "#00A86B",
            "crimson": "#DC143C",
            "purple": "#800080"
        }
        # Check if already hex
        if color_name.startswith("#"):
            return color_name
        # Try to find in map (case insensitive partial match)
        lower_name = color_name.lower()
        for key, value in color_map.items():
            if key in lower_name:
                return value
        return "#808080"  # Default gray


@dataclass
class AssetGenerationRequest:
    """Request for generating visual assets at a specific quality level."""
    character_config: CharacterVisualConfig
    quality_levels: List[AssetQualityLevel]
    variants: Optional[List[str]] = None
    priority: str = "normal"


@dataclass
class AssetGenerationResult:
    """Result of visual asset generation."""
    char_id: str
    quality_level: AssetQualityLevel
    success: bool
    assets: Dict[str, str] = field(default_factory=dict)
    error: Optional[str] = None


class VisualAssetIntegrationService:
    """
    Service for integrating character creation with visual asset generation.
    
    Provides methods to:
    - Convert character appearance to generation configs
    - Request asset generation at different quality levels
    - Derive lower-quality assets from higher-quality sources
    - Manage asset storage and retrieval
    """
    
    def __init__(
        self,
        assets_base_path: str = "assets/characters",
        comfyui_url: Optional[str] = None
    ):
        self.assets_base_path = Path(assets_base_path)
        self.comfyui_url = comfyui_url or os.getenv("COMFYUI_URL", "http://127.0.0.1:8188")
    
    def convert_appearance_to_config(
        self,
        appearance: Dict[str, Any],
        character_id: str,
        display_name: str,
        character_type: CharacterType = CharacterType.PLAYER_CHARACTER,
        faction: str = "Neutral"
    ) -> CharacterVisualConfig:
        """
        Convert a CharacterAppearance object to CharacterVisualConfig.
        
        This bridges the frontend character creator with the visual asset pipeline.
        """
        # Extract base model (gender)
        base_model = appearance.get("baseModel", "female")
        gender = "female" if base_model == "female" else "male"
        
        # Extract selections
        selections = appearance.get("selections", {})
        swatches = appearance.get("swatches", {})
        
        # Build visual traits from selections
        visual_traits = VisualTraits(
            gender=gender,
            hair_color=self._swatch_to_color_name(swatches.get("hair", "")),
            hair_style=self._option_to_style(selections.get("hair", "")),
            eye_color=self._extract_eye_color(selections.get("eyes", "")),
            skin_tone=self._swatch_to_skin_tone(swatches.get("skin", "")),
            build="average"  # Could be expanded
        )
        
        # Build outfit from selections
        outfit = OutfitConfig(
            description=self._option_to_outfit_description(selections.get("outfit", "")),
            primary_color=self._swatch_to_color_name(swatches.get("fabric", "")),
            secondary_color="white",  # Default
            style_tier="medium"
        )
        
        return CharacterVisualConfig(
            char_id=character_id,
            display_name=display_name,
            character_type=character_type,
            faction=faction,
            visual_traits=visual_traits,
            outfit=outfit
        )
    
    def get_eligible_quality_levels(
        self,
        character_type: CharacterType
    ) -> List[AssetQualityLevel]:
        """Get quality levels available for a character type."""
        # All character types get basic assets
        levels = [
            AssetQualityLevel.STANDARD_GAMEPLAY,
            AssetQualityLevel.BATTLE_MAP_TOKEN,
            AssetQualityLevel.ASCII_COMBAT,
            AssetQualityLevel.ASCII_MAP_EVENT
        ]
        
        # Add type-specific tokens
        if character_type == CharacterType.PLAYER_CHARACTER:
            levels.append(AssetQualityLevel.BATTLE_TOKEN_PC)
            levels.append(AssetQualityLevel.WIKI_DETAILED)
        elif character_type == CharacterType.NAMED_NPC:
            levels.append(AssetQualityLevel.BATTLE_TOKEN_NPC)
            levels.append(AssetQualityLevel.WIKI_DETAILED)
        else:
            levels.append(AssetQualityLevel.BATTLE_TOKEN_NPC)
        
        return levels
    
    def get_asset_paths(
        self,
        char_id: str,
        quality_level: AssetQualityLevel
    ) -> Dict[str, Path]:
        """Get expected file paths for assets at a quality level."""
        char_path = self.assets_base_path / char_id
        
        paths = {
            AssetQualityLevel.WIKI_DETAILED: {
                "portrait": char_path / "wiki" / "portrait_default.png",
                "fullbody": char_path / "wiki" / "fullbody_default.png",
                "expressions": char_path / "wiki" / "expressions.png"
            },
            AssetQualityLevel.STANDARD_GAMEPLAY: {
                "portrait": char_path / "standard" / "portrait.png",
                "thumbnail": char_path / "standard" / "thumbnail.png"
            },
            AssetQualityLevel.BATTLE_TOKEN_PC: {
                "large": char_path / "tokens" / "battle_128.png",
                "medium": char_path / "tokens" / "battle_64.png",
                "small": char_path / "tokens" / "battle_32.png"
            },
            AssetQualityLevel.BATTLE_TOKEN_NPC: {
                "large": char_path / "tokens" / "battle_128.png",
                "medium": char_path / "tokens" / "battle_64.png",
                "small": char_path / "tokens" / "battle_32.png"
            },
            AssetQualityLevel.BATTLE_MAP_TOKEN: {
                "standard": char_path / "tokens" / "map_64.png",
                "large": char_path / "tokens" / "map_128.png"
            },
            AssetQualityLevel.ASCII_COMBAT: {
                "idle": char_path / "ascii" / "idle.txt",
                "attack": char_path / "ascii" / "attack.txt",
                "defend": char_path / "ascii" / "defend.txt",
                "cast": char_path / "ascii" / "cast.txt",
                "hurt": char_path / "ascii" / "hurt.txt",
                "dead": char_path / "ascii" / "dead.txt"
            },
            AssetQualityLevel.ASCII_MAP_EVENT: {
                "icon": char_path / "ascii" / "map_icon.txt"
            }
        }
        
        return paths.get(quality_level, {})
    
    def check_asset_availability(
        self,
        char_id: str
    ) -> Dict[AssetQualityLevel, Dict[str, bool]]:
        """Check which assets exist for a character."""
        availability = {}
        
        for level in AssetQualityLevel:
            paths = self.get_asset_paths(char_id, level)
            level_availability = {}
            for asset_type, path in paths.items():
                level_availability[asset_type] = path.exists()
            availability[level] = level_availability
        
        return availability
    
    def generate_manifest_for_characters(
        self,
        characters: List[CharacterVisualConfig],
        output_path: str
    ) -> str:
        """Generate a wiki characters manifest file."""
        manifest = {
            "name": "Wiki Characters Manifest",
            "version": "1.0.0",
            "metadata": {
                "generated_by": "VisualAssetIntegrationService",
                "character_count": len(characters)
            },
            "generation_config": {
                "output_base_path": str(self.assets_base_path),
                "checkpoint_model": "anythingV5.safetensors",
                "house_style_lora": None,
                "enable_background_removal": False,
                "generate_thumbnails": True,
                "thumbnail_size": {"width": 256, "height": 384}
            },
            "characters": [char.to_manifest_entry() for char in characters]
        }
        
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w') as f:
            json.dump(manifest, f, indent=2)
        
        logger.info(f"Generated manifest with {len(characters)} characters at {output_path}")
        return output_path
    
    def derive_lower_quality_assets(
        self,
        char_id: str,
        source_level: AssetQualityLevel,
        target_level: AssetQualityLevel
    ) -> AssetGenerationResult:
        """
        Derive lower-quality assets from higher-quality source.
        
        Derivation paths:
        - wiki_detailed → standard_gameplay (downscale)
        - standard_gameplay → battle_tokens (crop and frame)
        - standard_gameplay → battle_map_tokens (silhouette)
        - standard_gameplay → ascii (image-to-ascii conversion)
        """
        # Check source exists
        source_paths = self.get_asset_paths(char_id, source_level)
        source_portrait = source_paths.get("portrait")
        
        if not source_portrait or not source_portrait.exists():
            return AssetGenerationResult(
                char_id=char_id,
                quality_level=target_level,
                success=False,
                error=f"Source asset not found: {source_portrait}"
            )
        
        target_paths = self.get_asset_paths(char_id, target_level)
        
        try:
            # Ensure target directory exists
            for path in target_paths.values():
                path.parent.mkdir(parents=True, exist_ok=True)
            
            # Derivation logic (placeholder - actual implementation would use image processing)
            if target_level == AssetQualityLevel.STANDARD_GAMEPLAY:
                # Downscale from wiki to standard
                self._downscale_image(source_portrait, target_paths["portrait"], (512, 768))
                self._downscale_image(source_portrait, target_paths["thumbnail"], (128, 192))
            
            elif target_level in [AssetQualityLevel.BATTLE_TOKEN_PC, AssetQualityLevel.BATTLE_TOKEN_NPC]:
                # Crop and frame for battle tokens
                self._create_battle_token(source_portrait, target_paths["large"], 128)
                self._create_battle_token(source_portrait, target_paths["medium"], 64)
                self._create_battle_token(source_portrait, target_paths["small"], 32)
            
            elif target_level == AssetQualityLevel.BATTLE_MAP_TOKEN:
                # Create map token
                self._create_map_token(source_portrait, target_paths["standard"], 64)
            
            elif target_level == AssetQualityLevel.ASCII_COMBAT:
                # Convert to ASCII
                self._convert_to_ascii(source_portrait, target_paths["idle"])
            
            assets = {k: str(v) for k, v in target_paths.items() if v.exists()}
            
            return AssetGenerationResult(
                char_id=char_id,
                quality_level=target_level,
                success=True,
                assets=assets
            )
            
        except Exception as e:
            logger.exception(f"Failed to derive assets: {e}")
            return AssetGenerationResult(
                char_id=char_id,
                quality_level=target_level,
                success=False,
                error=str(e)
            )
    
    # Private helper methods
    
    def _swatch_to_color_name(self, swatch_id: str) -> str:
        """Convert swatch ID to color name."""
        # In a full implementation, this would look up the swatch in the manifest
        # For now, extract color from swatch ID if possible
        if not swatch_id:
            return "black"
        parts = swatch_id.lower().split("-")
        return parts[-1] if parts else "black"
    
    def _swatch_to_skin_tone(self, swatch_id: str) -> str:
        """Convert skin swatch to tone description."""
        tone_map = {
            "light": "fair porcelain",
            "medium": "warm olive",
            "dark": "rich brown",
            "pale": "pale ivory"
        }
        if not swatch_id:
            return "fair"
        for key, value in tone_map.items():
            if key in swatch_id.lower():
                return value
        return "fair"
    
    def _option_to_style(self, option_id: str) -> str:
        """Convert option ID to style description."""
        if not option_id:
            return "simple"
        # Extract style from option ID (e.g., "hair-001" -> lookup name)
        style_map = {
            "001": "long flowing",
            "002": "topknot bun",
            "003": "half up half down",
            "004": "braided crown",
            "005": "short warrior"
        }
        for key, value in style_map.items():
            if key in option_id:
                return value
        return "simple"
    
    def _extract_eye_color(self, option_id: str) -> str:
        """Extract eye color from option ID."""
        # Default brown, could be enhanced with option lookup
        return "brown"
    
    def _option_to_outfit_description(self, option_id: str) -> str:
        """Convert outfit option to description."""
        if not option_id:
            return "simple robes"
        outfit_map = {
            "001": "cultivation robes with flowing sleeves",
            "002": "warrior armor with shoulder guards",
            "003": "scholar robes with embroidered trim",
            "004": "noble court attire",
            "005": "practical traveler garb"
        }
        for key, value in outfit_map.items():
            if key in option_id:
                return value
        return "cultivation robes"
    
    def _downscale_image(self, source: Path, target: Path, size: Tuple[int, int]) -> None:
        """Downscale an image to target size."""
        # Placeholder - actual implementation would use PIL/Pillow
        logger.info(f"Would downscale {source} to {target} at {size}")
        # In production:
        # from PIL import Image
        # img = Image.open(source)
        # img.thumbnail(size, Image.LANCZOS)
        # img.save(target)
    
    def _create_battle_token(self, source: Path, target: Path, size: int) -> None:
        """Create circular battle token from portrait."""
        logger.info(f"Would create battle token from {source} to {target} at {size}x{size}")
        # In production: face detection, circular crop, frame overlay
    
    def _create_map_token(self, source: Path, target: Path, size: int) -> None:
        """Create top-down map token from portrait."""
        logger.info(f"Would create map token from {source} to {target} at {size}x{size}")
        # In production: silhouette extraction, faction color fill
    
    def _convert_to_ascii(self, source: Path, target: Path) -> None:
        """Convert image to ASCII art."""
        logger.info(f"Would convert {source} to ASCII at {target}")
        # In production: call the existing image-to-ascii service


# Singleton instance
_service: Optional[VisualAssetIntegrationService] = None


def get_visual_asset_service() -> VisualAssetIntegrationService:
    """Get the global visual asset integration service."""
    global _service
    if _service is None:
        _service = VisualAssetIntegrationService()
    return _service
