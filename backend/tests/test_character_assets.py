"""Tests for character assets API endpoints."""

import os
import tempfile
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    """Create a test client."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def temp_asset_dir(tmp_path):
    """Create a temporary asset directory."""
    asset_dir = tmp_path / "assets" / "characters"
    asset_dir.mkdir(parents=True)
    return str(asset_dir)


class TestAssetRequestValidation:
    """Tests for input validation on asset generation endpoints."""

    def test_valid_character_name(self, client):
        """Test that valid character names are accepted."""
        response = client.post(
            "/api/v1/assets/generate-character-asset",
            json={"character_name": "Liu Bei", "style": "yuto-sano"},
        )
        # Should succeed (200) or validation pass (not 422)
        assert response.status_code in [200, 500]  # 500 if dir creation fails

    def test_character_name_too_long(self, client):
        """Test that character names over 100 chars are rejected."""
        response = client.post(
            "/api/v1/assets/generate-character-asset",
            json={"character_name": "A" * 101, "style": "yuto-sano"},
        )
        assert response.status_code == 422

    def test_empty_character_name(self, client):
        """Test that empty character names are rejected."""
        response = client.post(
            "/api/v1/assets/generate-character-asset",
            json={"character_name": "", "style": "yuto-sano"},
        )
        assert response.status_code == 422

    def test_character_name_with_special_chars(self, client):
        """Test that character names with special chars are rejected."""
        response = client.post(
            "/api/v1/assets/generate-character-asset",
            json={"character_name": "Liu<script>alert(1)</script>Bei", "style": "yuto-sano"},
        )
        assert response.status_code == 422

    def test_character_name_with_path_traversal(self, client):
        """Test that path traversal in character name is rejected."""
        response = client.post(
            "/api/v1/assets/generate-character-asset",
            json={"character_name": "../../../etc/passwd", "style": "yuto-sano"},
        )
        assert response.status_code == 422

    def test_invalid_style(self, client):
        """Test that invalid styles are rejected."""
        response = client.post(
            "/api/v1/assets/generate-character-asset",
            json={"character_name": "Liu Bei", "style": "invalid-style"},
        )
        assert response.status_code == 422

    def test_description_too_long(self, client):
        """Test that descriptions over 1000 chars are rejected."""
        response = client.post(
            "/api/v1/assets/generate-character-asset",
            json={
                "character_name": "Liu Bei",
                "style": "yuto-sano",
                "description": "A" * 1001,
            },
        )
        assert response.status_code == 422


class TestMultiVariantValidation:
    """Tests for input validation on multi-variant endpoint."""

    def test_valid_request(self, client):
        """Test that valid multi-variant requests are accepted."""
        response = client.post(
            "/api/v1/assets/generate-character-variants",
            json={
                "character_name": "Guan Yu",
                "variants": ["yuto-sano", "ink-wash"],
            },
        )
        assert response.status_code in [200, 500]

    def test_too_many_variants(self, client):
        """Test that more than 10 variants are rejected."""
        response = client.post(
            "/api/v1/assets/generate-character-variants",
            json={
                "character_name": "Guan Yu",
                "variants": ["yuto-sano"] * 11,
            },
        )
        assert response.status_code == 422

    def test_invalid_variant_style(self, client):
        """Test that invalid variant styles are rejected."""
        response = client.post(
            "/api/v1/assets/generate-character-variants",
            json={
                "character_name": "Guan Yu",
                "variants": ["yuto-sano", "invalid-style"],
            },
        )
        assert response.status_code == 422

    def test_descriptions_exceed_variants(self, client):
        """Test that more descriptions than variants are rejected."""
        response = client.post(
            "/api/v1/assets/generate-character-variants",
            json={
                "character_name": "Guan Yu",
                "variants": ["yuto-sano"],
                "descriptions": ["desc1", "desc2", "desc3"],
            },
        )
        assert response.status_code == 422


class TestAssetGeneration:
    """Tests for actual asset generation functionality."""

    def test_generates_asset_file(self, client, tmp_path, monkeypatch):
        """Test that asset files are created (stub mode)."""
        # Patch the get_asset_directory function
        asset_dir = tmp_path / "assets" / "characters"
        asset_dir.mkdir(parents=True)

        def mock_get_asset_directory():
            return str(asset_dir)

        monkeypatch.setattr(
            "app.api.character_assets.get_asset_directory",
            mock_get_asset_directory,
        )

        response = client.post(
            "/api/v1/assets/generate-character-asset",
            json={"character_name": "Test Hero", "style": "yuto-sano"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert "/assets/characters/" in data["url"]
        assert data["character"] == "Test Hero"

        # Check file was created
        expected_filename = "test-hero-yuto-sano.jpg"
        expected_path = asset_dir / expected_filename
        assert expected_path.exists()

    def test_generates_multiple_variants(self, client, tmp_path, monkeypatch):
        """Test that multiple variant files are created."""
        asset_dir = tmp_path / "assets" / "characters"
        asset_dir.mkdir(parents=True)

        def mock_get_asset_directory():
            return str(asset_dir)

        monkeypatch.setattr(
            "app.api.character_assets.get_asset_directory",
            mock_get_asset_directory,
        )

        response = client.post(
            "/api/v1/assets/generate-character-variants",
            json={
                "character_name": "Test Hero",
                "variants": ["yuto-sano", "ink-wash"],
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert "results" in data
        assert len(data["results"]) == 2
        assert data["total"] == 2

        # Check files were created
        assert (asset_dir / "test-hero-yuto-sano.jpg").exists()
        assert (asset_dir / "test-hero-ink-wash.jpg").exists()


class TestPathSafety:
    """Tests to ensure path safety is enforced in asset generation."""

    def test_character_name_sanitized(self, client, tmp_path, monkeypatch):
        """Test that character names are sanitized in filenames."""
        asset_dir = tmp_path / "assets" / "characters"
        asset_dir.mkdir(parents=True)

        def mock_get_asset_directory():
            return str(asset_dir)

        monkeypatch.setattr(
            "app.api.character_assets.get_asset_directory",
            mock_get_asset_directory,
        )

        # Try name with spaces (allowed but converted to dashes)
        response = client.post(
            "/api/v1/assets/generate-character-asset",
            json={"character_name": "Liu Bei", "style": "yuto-sano"},
        )

        assert response.status_code == 200
        # Check the generated filename is safe
        data = response.json()
        assert "../" not in data["url"]
        assert ".." not in data["url"]


class TestResponseFormat:
    """Tests for response format consistency."""

    def test_single_asset_response_format(self, client, tmp_path, monkeypatch):
        """Test that single asset response has correct format."""
        asset_dir = tmp_path / "assets" / "characters"
        asset_dir.mkdir(parents=True)

        def mock_get_asset_directory():
            return str(asset_dir)

        monkeypatch.setattr(
            "app.api.character_assets.get_asset_directory",
            mock_get_asset_directory,
        )

        response = client.post(
            "/api/v1/assets/generate-character-asset",
            json={"character_name": "Test", "style": "yuto-sano"},
        )

        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "url" in data
        assert "character" in data
        assert "style" in data

    def test_multi_variant_response_format(self, client, tmp_path, monkeypatch):
        """Test that multi-variant response has correct format."""
        asset_dir = tmp_path / "assets" / "characters"
        asset_dir.mkdir(parents=True)

        def mock_get_asset_directory():
            return str(asset_dir)

        monkeypatch.setattr(
            "app.api.character_assets.get_asset_directory",
            mock_get_asset_directory,
        )

        response = client.post(
            "/api/v1/assets/generate-character-variants",
            json={"character_name": "Test", "variants": ["yuto-sano"]},
        )

        assert response.status_code == 200
        data = response.json()
        assert "results" in data
        assert "total" in data
        assert isinstance(data["results"], list)

        for result in data["results"]:
            assert "status" in result
            assert "url" in result
            assert "character" in result
            assert "variant" in result
