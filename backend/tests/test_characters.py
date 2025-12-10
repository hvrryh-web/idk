"""Tests for character API endpoints."""
import uuid


def test_list_characters_empty(client):
    """Test listing characters when database is empty."""
    response = client.get("/api/v1/characters/")
    assert response.status_code == 200
    assert response.json() == []


def test_create_character(client):
    """Test creating a new character."""
    character_data = {
        "name": "Test Hero",
        "type": "pc",
        "level": 5,
        "description": "A test character"
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


def test_list_characters_with_data(client):
    """Test listing characters after creating some."""
    # Create a character
    character_data = {
        "name": "Test Hero",
        "type": "pc",
        "level": 5
    }
    client.post("/api/v1/characters/", json=character_data)
    
    # List characters
    response = client.get("/api/v1/characters/")
    assert response.status_code == 200
    
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Test Hero"


def test_get_character_by_id(client):
    """Test getting a specific character by ID."""
    # Create a character
    character_data = {
        "name": "Test Hero",
        "type": "pc",
        "level": 5
    }
    create_response = client.post("/api/v1/characters/", json=character_data)
    character_id = create_response.json()["id"]
    
    # Get the character by ID
    response = client.get(f"/api/v1/characters/{character_id}")
    assert response.status_code == 200
    
    data = response.json()
    assert data["id"] == character_id
    assert data["name"] == "Test Hero"


def test_get_character_not_found(client):
    """Test getting a character that doesn't exist."""
    fake_id = str(uuid.uuid4())
    response = client.get(f"/api/v1/characters/{fake_id}")
    assert response.status_code == 404
    assert response.json()["detail"] == "Character not found"


def test_create_character_with_stats(client):
    """Test creating a character with stats."""
    character_data = {
        "name": "Warrior",
        "type": "npc",
        "level": 10,
        "stats": {"might": 5, "cunning": 3, "spirit": 4}
    }
    response = client.post("/api/v1/characters/", json=character_data)
    assert response.status_code == 201
    
    data = response.json()
    assert data["stats"] == {"might": 5, "cunning": 3, "spirit": 4}
