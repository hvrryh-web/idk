"""Tests for ASCII art API endpoints."""

import io
from unittest.mock import MagicMock
from uuid import uuid4

import pytest
from PIL import Image


@pytest.fixture
def sample_image_file():
    """Create a sample image file for testing."""
    img = Image.new("RGB", (100, 100), color="white")
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return buffer


def test_get_presets(client):
    """Test getting available ASCII art presets."""
    response = client.get("/api/v1/ascii/presets")
    assert response.status_code == 200

    presets = response.json()
    assert "retro_terminal" in presets
    assert "cyberpunk" in presets
    assert "wuxia" in presets

    # Check structure
    for preset in presets.values():
        assert "name" in preset
        assert "description" in preset
        assert "use_color" in preset


def test_convert_image_success(client_with_mock_db, sample_image_file):
    """Test successful image conversion."""
    client, mock_db = client_with_mock_db

    # Mock database query to return None (no cached artifact)
    mock_query = MagicMock()
    mock_query.filter.return_value.filter.return_value.first.return_value = None
    mock_db.query.return_value = mock_query

    # Mock the artifact that will be created
    created_artifact = MagicMock()
    created_artifact.id = uuid4()
    created_artifact.ascii_art = "test ascii"
    created_artifact.width = 100
    created_artifact.height = 50
    created_artifact.style = "retro_terminal"
    created_artifact.preset_name = "Retro Terminal"
    created_artifact.content_hash = "abc123"
    created_artifact.use_color = False

    # Mock db.refresh to set the artifact ID
    def mock_refresh(obj):
        obj.id = created_artifact.id
        obj.ascii_art = created_artifact.ascii_art
        obj.width = created_artifact.width
        obj.height = created_artifact.height
        obj.style = created_artifact.style
        obj.preset_name = created_artifact.preset_name
        obj.content_hash = created_artifact.content_hash
        obj.use_color = created_artifact.use_color

    mock_db.refresh = mock_refresh

    response = client.post(
        "/api/v1/ascii/convert?style=retro_terminal",
        files={"file": ("test.png", sample_image_file, "image/png")},
    )

    assert response.status_code == 200
    data = response.json()

    assert "id" in data
    assert "ascii_art" in data
    assert "width" in data
    assert "height" in data
    assert data["style"] == "retro_terminal"
    assert "content_hash" in data

    # Check that the artifact was saved to DB
    assert mock_db.add.called
    assert mock_db.commit.called


def test_convert_image_invalid_style(client_with_mock_db, sample_image_file):
    """Test conversion with invalid style."""
    client, _ = client_with_mock_db

    response = client.post(
        "/api/v1/ascii/convert?style=invalid_style",
        files={"file": ("test.png", sample_image_file, "image/png")},
    )

    assert response.status_code == 400
    assert "Invalid style" in response.json()["detail"]


def test_convert_image_invalid_file_type(client_with_mock_db):
    """Test conversion with non-image file."""
    client, _ = client_with_mock_db

    # Create a text file
    text_file = io.BytesIO(b"This is not an image")

    response = client.post(
        "/api/v1/ascii/convert",
        files={"file": ("test.txt", text_file, "text/plain")},
    )

    assert response.status_code == 400
    assert "must be an image" in response.json()["detail"]


def test_convert_image_cached(client_with_mock_db, sample_image_file):
    """Test that cached artifacts are returned."""
    client, mock_db = client_with_mock_db

    # Mock database query to return a cached artifact
    cached_artifact = MagicMock()
    cached_artifact.id = uuid4()
    cached_artifact.ascii_art = "cached ascii art"
    cached_artifact.width = 80
    cached_artifact.height = 40
    cached_artifact.style = "retro_terminal"
    cached_artifact.preset_name = "Retro Terminal"
    cached_artifact.content_hash = "abc123"
    cached_artifact.use_color = False

    mock_query = MagicMock()
    mock_query.filter.return_value.filter.return_value.first.return_value = cached_artifact
    mock_db.query.return_value = mock_query

    response = client.post(
        "/api/v1/ascii/convert?style=retro_terminal",
        files={"file": ("test.png", sample_image_file, "image/png")},
    )

    assert response.status_code == 200
    data = response.json()

    assert data["id"] == str(cached_artifact.id)
    assert data["ascii_art"] == "cached ascii art"

    # Check that no new artifact was added
    assert not mock_db.add.called


def test_get_ascii_artifact(client_with_mock_db):
    """Test retrieving a specific ASCII artifact."""
    client, mock_db = client_with_mock_db

    artifact_id = uuid4()
    mock_artifact = MagicMock()
    mock_artifact.id = artifact_id
    mock_artifact.ascii_art = "test ascii art"
    mock_artifact.width = 80
    mock_artifact.height = 40
    mock_artifact.style = "retro_terminal"
    mock_artifact.preset_name = "Retro Terminal"
    mock_artifact.content_hash = "abc123"
    mock_artifact.use_color = False

    mock_query = MagicMock()
    mock_query.filter.return_value.first.return_value = mock_artifact
    mock_db.query.return_value = mock_query

    response = client.get(f"/api/v1/ascii/{artifact_id}")

    assert response.status_code == 200
    data = response.json()

    assert data["id"] == str(artifact_id)
    assert data["ascii_art"] == "test ascii art"
    assert data["width"] == 80


def test_get_ascii_artifact_not_found(client_with_mock_db):
    """Test retrieving a non-existent artifact."""
    client, mock_db = client_with_mock_db

    mock_query = MagicMock()
    mock_query.filter.return_value.first.return_value = None
    mock_db.query.return_value = mock_query

    artifact_id = uuid4()
    response = client.get(f"/api/v1/ascii/{artifact_id}")

    assert response.status_code == 404
    assert "not found" in response.json()["detail"]


def test_list_ascii_artifacts(client_with_mock_db):
    """Test listing ASCII artifacts."""
    client, mock_db = client_with_mock_db

    # Create mock artifacts
    mock_artifacts = []
    for i in range(3):
        artifact = MagicMock()
        artifact.id = uuid4()
        artifact.width = 80
        artifact.height = 40
        artifact.style = "retro_terminal"
        artifact.preset_name = "Retro Terminal"
        artifact.content_hash = f"hash{i}"
        artifact.created_at = "2024-01-01T00:00:00"
        mock_artifacts.append(artifact)

    mock_query = MagicMock()
    mock_query.order_by.return_value.offset.return_value.limit.return_value.all.return_value = (
        mock_artifacts
    )
    mock_db.query.return_value = mock_query

    response = client.get("/api/v1/ascii")

    assert response.status_code == 200
    data = response.json()

    assert len(data) == 3
    assert all("id" in item for item in data)
    assert all("width" in item for item in data)


def test_convert_with_dimensions(client_with_mock_db, sample_image_file):
    """Test conversion with custom dimensions."""
    client, mock_db = client_with_mock_db

    mock_query = MagicMock()
    mock_query.filter.return_value.filter.return_value.first.return_value = None
    mock_db.query.return_value = mock_query

    # Mock the artifact that will be created
    created_artifact = MagicMock()
    created_artifact.id = uuid4()

    def mock_refresh(obj):
        obj.id = created_artifact.id

    mock_db.refresh = mock_refresh

    response = client.post(
        "/api/v1/ascii/convert?style=retro_terminal&width=40&height=20",
        files={"file": ("test.png", sample_image_file, "image/png")},
    )

    assert response.status_code == 200
    data = response.json()

    assert data["width"] == 40
    assert data["height"] == 20
