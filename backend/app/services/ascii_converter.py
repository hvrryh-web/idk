"""ASCII art conversion service with style presets."""

import hashlib
import io
from dataclasses import dataclass
from enum import Enum
from typing import Optional

from PIL import Image


class ASCIIStyle(str, Enum):
    """Available ASCII art style presets."""

    CYBERPUNK = "cyberpunk"
    WUXIA = "wuxia"
    RETRO_TERMINAL = "retro_terminal"


@dataclass
class ASCIIPreset:
    """Configuration for an ASCII style preset."""

    name: str
    char_ramp: str
    description: str
    invert: bool = False
    use_color: bool = False


# Predefined style presets
PRESETS = {
    ASCIIStyle.CYBERPUNK: ASCIIPreset(
        name="Cyberpunk Neon",
        char_ramp=" .:-=+*#%@",
        description="High-contrast cyberpunk aesthetic with bold characters",
        invert=False,
        use_color=True,
    ),
    ASCIIStyle.WUXIA: ASCIIPreset(
        name="Wuxia Ink",
        char_ramp=" .'`^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
        description="Flowing brush-stroke aesthetic inspired by ink paintings",
        invert=True,
        use_color=False,
    ),
    ASCIIStyle.RETRO_TERMINAL: ASCIIPreset(
        name="Retro Terminal",
        char_ramp=" ░▒▓█",
        description="Classic block-shading terminal aesthetic",
        invert=False,
        use_color=False,
    ),
}


class ASCIIConverter:
    """Converts images to ASCII art with various styles."""

    def __init__(self, max_width: int = 160, max_height: int = 90):
        """
        Initialize the ASCII converter.

        Args:
            max_width: Maximum width in characters
            max_height: Maximum height in characters
        """
        self.max_width = max_width
        self.max_height = max_height

    def convert_image(
        self,
        image_data: bytes,
        style: ASCIIStyle = ASCIIStyle.RETRO_TERMINAL,
        width: Optional[int] = None,
        height: Optional[int] = None,
    ) -> dict:
        """
        Convert an image to ASCII art.

        Args:
            image_data: Raw image bytes
            style: ASCII style preset to use
            width: Target width in characters (optional)
            height: Target height in characters (optional)

        Returns:
            Dictionary containing ASCII art and metadata
        """
        # Load and preprocess image
        image = Image.open(io.BytesIO(image_data))
        image = self._preprocess_image(image, width, height)

        # Get style preset
        preset = PRESETS[style]

        # Convert to ASCII
        ascii_art = self._image_to_ascii(image, preset)

        # Generate content hash for caching
        content_hash = hashlib.sha256(image_data).hexdigest()[:16]

        return {
            "ascii_art": ascii_art,
            "width": image.width,
            "height": image.height,
            "style": style.value,
            "preset_name": preset.name,
            "content_hash": content_hash,
            "use_color": preset.use_color,
        }

    def _preprocess_image(
        self, image: Image.Image, width: Optional[int], height: Optional[int]
    ) -> Image.Image:
        """
        Preprocess image for ASCII conversion.

        Args:
            image: PIL Image object
            width: Target width
            height: Target height

        Returns:
            Preprocessed PIL Image
        """
        # Convert to grayscale
        image = image.convert("L")

        # Calculate target dimensions
        if width is None and height is None:
            # Auto-scale to fit max dimensions
            aspect_ratio = image.width / image.height
            if aspect_ratio > self.max_width / self.max_height:
                width = self.max_width
                height = int(width / aspect_ratio * 0.5)  # Adjust for character aspect ratio
            else:
                height = self.max_height
                width = int(height * aspect_ratio * 2)  # Adjust for character aspect ratio
        elif width is None:
            height = min(height, self.max_height)
            width = int(image.width * height / image.height * 2)
        elif height is None:
            width = min(width, self.max_width)
            height = int(image.height * width / image.width * 0.5)
        else:
            width = min(width, self.max_width)
            height = min(height, self.max_height)

        # Resize image
        image = image.resize((width, height), Image.Resampling.LANCZOS)

        return image

    def _image_to_ascii(self, image: Image.Image, preset: ASCIIPreset) -> str:
        """
        Convert preprocessed image to ASCII art.

        Args:
            image: Preprocessed grayscale PIL Image
            preset: ASCII style preset

        Returns:
            ASCII art as a string
        """
        pixels = image.load()
        char_ramp = preset.char_ramp
        ramp_length = len(char_ramp)

        ascii_lines = []
        for y in range(image.height):
            line = []
            for x in range(image.width):
                # Get pixel brightness (0-255)
                brightness = pixels[x, y]

                # Invert if needed
                if preset.invert:
                    brightness = 255 - brightness

                # Map brightness to character
                char_index = int(brightness / 255 * (ramp_length - 1))
                line.append(char_ramp[char_index])

            ascii_lines.append("".join(line))

        return "\n".join(ascii_lines)

    def get_available_presets(self) -> dict:
        """
        Get all available style presets.

        Returns:
            Dictionary of preset configurations
        """
        return {
            style.value: {
                "name": preset.name,
                "description": preset.description,
                "use_color": preset.use_color,
            }
            for style, preset in PRESETS.items()
        }
