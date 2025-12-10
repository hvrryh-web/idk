"""Tests for character API endpoints."""
import uuid
from unittest.mock import MagicMock

from app.models.characters import Character, CharacterType


def test_list_characters_empty(client_with_mock_db):
    """Test listing characters when database is empty."""
    client, mock_db = client_with_mock_db

    # Mock empty query result
    mock_query = MagicMock()
    mock_query.order_by.return_value.all.return_value = []
    mock_db.query.return_value = mock_query

    response = client.get("/api/v1/characters/")
    assert response.status_code == 200
    assert response.json() == []


def test_create_character(client_with_mock_db):
    """Test creating a new character."""
    client, mock_db = client_with_mock_db

    # Create a mock character that will be returned
    test_id = uuid.uuid4()
    _mock_character = Character(
        id=test_id, name="Test Hero", type=CharacterType.pc, level=5, description="A test character"
    )

    # Mock the database session methods
    mock_db.add = MagicMock()
    mock_db.commit = MagicMock()
    mock_db.refresh = MagicMock(side_effect=lambda obj: setattr(obj, "id", test_id) or None)

    character_data = {
        "name": "Test Hero",
        "type": "pc",
        "level": 5,
        "description": "A test character",
    }
    response = client.post("/api/v1/characters/", json=character_data)
    assert response.status_code == 201

    data = response.json()
    assert data["name"] == "Test Hero"
    assert data["type"] == "pc"
    assert data["level"] == 5
    assert data["description"] == "A test character"
    assert "id" in data
    # Verify it's a valid UUID
    uuid.UUID(data["id"])


def test_get_character_not_found(client_with_mock_db):
    """Test getting a character that doesn't exist."""
    client, mock_db = client_with_mock_db

    # Mock query to return None
    mock_query = MagicMock()
    mock_query.filter.return_value.first.return_value = None
    mock_db.query.return_value = mock_query

    fake_id = str(uuid.uuid4())
    response = client.get(f"/api/v1/characters/{fake_id}")
    assert response.status_code == 404
    assert response.json()["detail"] == "Character not found"


def test_list_characters_with_data(client_with_mock_db):
    """Test listing characters with existing data."""
    client, mock_db = client_with_mock_db

    # Create mock characters
    test_id = uuid.uuid4()
    mock_character = Character(id=test_id, name="Test Hero", type=CharacterType.pc, level=5)

    # Mock query result
    mock_query = MagicMock()
    mock_query.order_by.return_value.all.return_value = [mock_character]
    mock_db.query.return_value = mock_query

    response = client.get("/api/v1/characters/")
    assert response.status_code == 200

    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Test Hero"
    assert data[0]["type"] == "pc"


def test_get_character_by_id(client_with_mock_db):
    """Test getting a specific character by ID."""
    client, mock_db = client_with_mock_db

    test_id = uuid.uuid4()
    mock_character = Character(id=test_id, name="Test Hero", type=CharacterType.pc, level=5)

    # Mock query to return the character
    mock_query = MagicMock()
    mock_query.filter.return_value.first.return_value = mock_character
    mock_db.query.return_value = mock_query

    response = client.get(f"/api/v1/characters/{test_id}")
    assert response.status_code == 200

    data = response.json()
    assert data["id"] == str(test_id)
    assert data["name"] == "Test Hero"


def test_create_character_with_stats(client_with_mock_db):
    """Test creating a character with stats."""
    client, mock_db = client_with_mock_db

    test_id = uuid.uuid4()
    test_stats = {"might": 5, "cunning": 3, "spirit": 4}

    # Mock the database session methods
    mock_db.add = MagicMock()
    mock_db.commit = MagicMock()
    mock_db.refresh = MagicMock(side_effect=lambda obj: setattr(obj, "id", test_id) or None)

    character_data = {"name": "Warrior", "type": "npc", "level": 10, "stats": test_stats}
    response = client.post("/api/v1/characters/", json=character_data)
    assert response.status_code == 201

    data = response.json()
    assert data["stats"] == test_stats
