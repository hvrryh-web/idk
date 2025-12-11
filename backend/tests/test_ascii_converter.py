"""Tests for ASCII art conversion service."""

import io
from PIL import Image
import pytest

from app.services.ascii_converter import ASCIIConverter, ASCIIStyle


@pytest.fixture
def converter():
    """Create an ASCII converter instance."""
    return ASCIIConverter(max_width=80, max_height=40)


@pytest.fixture
def sample_image_bytes():
    """Create a simple test image."""
    img = Image.new("RGB", (100, 100), color="white")
    # Draw a simple black square in the middle
    pixels = img.load()
    for x in range(40, 60):
        for y in range(40, 60):
            pixels[x, y] = (0, 0, 0)

    # Convert to bytes
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    return buffer.getvalue()


def test_converter_initialization(converter):
    """Test that the converter initializes correctly."""
    assert converter.max_width == 80
    assert converter.max_height == 40


def test_get_available_presets(converter):
    """Test that presets are available."""
    presets = converter.get_available_presets()
    assert "retro_terminal" in presets
    assert "cyberpunk" in presets
    assert "wuxia" in presets

    # Check preset structure
    assert "name" in presets["retro_terminal"]
    assert "description" in presets["retro_terminal"]
    assert "use_color" in presets["retro_terminal"]


def test_convert_image_basic(converter, sample_image_bytes):
    """Test basic image conversion."""
    result = converter.convert_image(sample_image_bytes, ASCIIStyle.RETRO_TERMINAL)

    assert "ascii_art" in result
    assert "width" in result
    assert "height" in result
    assert "style" in result
    assert "preset_name" in result
    assert "content_hash" in result
    assert "use_color" in result

    # Check that ASCII art is not empty
    assert len(result["ascii_art"]) > 0
    assert "\n" in result["ascii_art"]


def test_convert_image_different_styles(converter, sample_image_bytes):
    """Test conversion with different style presets."""
    styles = [ASCIIStyle.RETRO_TERMINAL, ASCIIStyle.CYBERPUNK, ASCIIStyle.WUXIA]

    results = []
    for style in styles:
        result = converter.convert_image(sample_image_bytes, style)
        results.append(result)
        assert result["style"] == style.value

    # Results should be different for different styles
    assert (
        results[0]["ascii_art"] != results[1]["ascii_art"]
        or results[0]["ascii_art"] != results[2]["ascii_art"]
    )


def test_convert_image_with_dimensions(converter, sample_image_bytes):
    """Test conversion with specific dimensions."""
    result = converter.convert_image(
        sample_image_bytes, ASCIIStyle.RETRO_TERMINAL, width=40, height=20
    )

    assert result["width"] == 40
    assert result["height"] == 20


def test_content_hash_consistency(converter, sample_image_bytes):
    """Test that the same image produces the same content hash."""
    result1 = converter.convert_image(sample_image_bytes, ASCIIStyle.RETRO_TERMINAL)
    result2 = converter.convert_image(sample_image_bytes, ASCIIStyle.RETRO_TERMINAL)

    assert result1["content_hash"] == result2["content_hash"]


def test_convert_small_image(converter):
    """Test conversion of a very small image."""
    # Create a tiny 10x10 image
    img = Image.new("RGB", (10, 10), color="gray")
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    image_bytes = buffer.getvalue()

    result = converter.convert_image(image_bytes, ASCIIStyle.RETRO_TERMINAL)

    assert result["width"] > 0
    assert result["height"] > 0
    assert len(result["ascii_art"]) > 0


def test_convert_large_image(converter):
    """Test that large images are scaled down."""
    # Create a large 1000x1000 image
    img = Image.new("RGB", (1000, 1000), color="gray")
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    image_bytes = buffer.getvalue()

    result = converter.convert_image(image_bytes, ASCIIStyle.RETRO_TERMINAL)

    # Should be scaled down to max dimensions
    assert result["width"] <= converter.max_width
    assert result["height"] <= converter.max_height
