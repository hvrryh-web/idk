"""
Tests for Zhou Xu Divine Advisor API

Tests the chatbot functionality, session management, and memory logging system.
"""

import pytest
from fastapi.testclient import TestClient
import os
import json
import shutil
from datetime import datetime

# Import the app
from app.main import app

client = TestClient(app)

# Test player ID
TEST_PLAYER_ID = "test_player_001"
TEST_LOGS_DIR = "storage/zhou_xu_logs"


@pytest.fixture(autouse=True)
def cleanup_test_logs():
    """Clean up test player logs before and after each test."""
    test_dir = os.path.join(TEST_LOGS_DIR, TEST_PLAYER_ID)
    if os.path.exists(test_dir):
        shutil.rmtree(test_dir)
    yield
    if os.path.exists(test_dir):
        shutil.rmtree(test_dir)


class TestChatEndpoint:
    """Tests for the /zhou-xu/chat endpoint."""
    
    def test_basic_greeting(self):
        """Test sending a greeting message."""
        response = client.post(
            "/api/v1/zhou-xu/chat",
            json={
                "player_id": TEST_PLAYER_ID,
                "message": "Hello Zhou Xu!"
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "response" in data
        assert "emotional_state" in data
        assert "conversation_type" in data
        assert "tags_used" in data
        assert "session_id" in data
        
        # Should detect greeting conversation type
        assert data["conversation_type"] == "greeting"
    
    def test_how_are_you(self):
        """Test 'how are you' detection."""
        response = client.post(
            "/api/v1/zhou-xu/chat",
            json={
                "player_id": TEST_PLAYER_ID,
                "message": "How are you today?"
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        assert data["conversation_type"] == "how_are_you"
    
    def test_emotional_detection_sad(self):
        """Test sad emotional state detection."""
        response = client.post(
            "/api/v1/zhou-xu/chat",
            json={
                "player_id": TEST_PLAYER_ID,
                "message": "I'm feeling really sad and upset today"
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        assert data["emotional_state"] == "sad"
    
    def test_emotional_detection_happy(self):
        """Test happy emotional state detection."""
        response = client.post(
            "/api/v1/zhou-xu/chat",
            json={
                "player_id": TEST_PLAYER_ID,
                "message": "I won the battle! I'm so happy!"
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        assert data["emotional_state"] == "happy"
    
    def test_session_persistence(self):
        """Test that session ID is returned and can be reused."""
        # First message
        response1 = client.post(
            "/api/v1/zhou-xu/chat",
            json={
                "player_id": TEST_PLAYER_ID,
                "message": "Hello!"
            }
        )
        session_id = response1.json()["session_id"]
        
        # Second message with same session
        response2 = client.post(
            "/api/v1/zhou-xu/chat",
            json={
                "player_id": TEST_PLAYER_ID,
                "message": "How's the weather?",
                "session_id": session_id
            }
        )
        
        assert response2.json()["session_id"] == session_id
    
    def test_empty_message_rejected(self):
        """Test that empty messages are rejected."""
        response = client.post(
            "/api/v1/zhou-xu/chat",
            json={
                "player_id": TEST_PLAYER_ID,
                "message": ""
            }
        )
        assert response.status_code == 400


class TestSessionEndpoints:
    """Tests for session management endpoints."""
    
    def test_get_session(self):
        """Test getting session data."""
        # Create a session first
        chat_response = client.post(
            "/api/v1/zhou-xu/chat",
            json={
                "player_id": TEST_PLAYER_ID,
                "message": "Hello!"
            }
        )
        session_id = chat_response.json()["session_id"]
        
        # Get session info
        response = client.get(f"/api/v1/zhou-xu/session/{session_id}")
        assert response.status_code == 200
        data = response.json()
        
        assert data["session_id"] == session_id
        assert data["player_id"] == TEST_PLAYER_ID
        assert "message_count" in data
        assert "recent_messages" in data
    
    def test_get_nonexistent_session(self):
        """Test getting a non-existent session."""
        response = client.get("/api/v1/zhou-xu/session/nonexistent-session-id")
        assert response.status_code == 404
    
    def test_end_session(self):
        """Test ending a session."""
        # Create a session
        chat_response = client.post(
            "/api/v1/zhou-xu/chat",
            json={
                "player_id": TEST_PLAYER_ID,
                "message": "Hello!"
            }
        )
        session_id = chat_response.json()["session_id"]
        
        # End the session
        response = client.post(f"/api/v1/zhou-xu/end-session/{session_id}")
        assert response.status_code == 200
        assert response.json()["success"] == True
        
        # Verify session is gone
        get_response = client.get(f"/api/v1/zhou-xu/session/{session_id}")
        assert get_response.status_code == 404


class TestQuestEventLogging:
    """Tests for quest event logging."""
    
    def test_log_quest_event(self):
        """Test logging a quest event."""
        # Create a session first
        chat_response = client.post(
            "/api/v1/zhou-xu/chat",
            json={
                "player_id": TEST_PLAYER_ID,
                "message": "Hello!"
            }
        )
        
        # Log a quest event
        response = client.post(
            f"/api/v1/zhou-xu/log-quest-event?player_id={TEST_PLAYER_ID}",
            json={
                "event_type": "started",
                "quest_name": "The Dragon's Lair",
                "description": "Accepted quest to slay the dragon"
            }
        )
        assert response.status_code == 200
        assert response.json()["success"] == True
    
    def test_log_quest_no_session(self):
        """Test logging quest event without a session fails."""
        response = client.post(
            "/api/v1/zhou-xu/log-quest-event?player_id=no_session_player",
            json={
                "event_type": "started",
                "quest_name": "Test Quest",
                "description": "Test"
            }
        )
        assert response.status_code == 404


class TestSaveLoadEndpoints:
    """Tests for save and load functionality."""
    
    def test_save_session(self):
        """Test manual save."""
        # Create a session with some messages
        chat_response = client.post(
            "/api/v1/zhou-xu/chat",
            json={
                "player_id": TEST_PLAYER_ID,
                "message": "Hello! Let's have a conversation."
            }
        )
        session_id = chat_response.json()["session_id"]
        
        # Save the session
        save_response = client.post(
            "/api/v1/zhou-xu/save",
            json={
                "player_id": TEST_PLAYER_ID,
                "session_id": session_id
            }
        )
        assert save_response.status_code == 200
        data = save_response.json()
        assert data["success"] == True
        assert "saved_as" in data
    
    def test_auto_save(self):
        """Test auto-save endpoint."""
        # Create a session
        chat_response = client.post(
            "/api/v1/zhou-xu/chat",
            json={
                "player_id": TEST_PLAYER_ID,
                "message": "Hello!"
            }
        )
        session_id = chat_response.json()["session_id"]
        
        # Auto-save
        response = client.post(f"/api/v1/zhou-xu/auto-save/{session_id}")
        assert response.status_code == 200
        assert response.json()["auto_saved"] == True
    
    def test_logs_status(self):
        """Test getting logs status."""
        response = client.get(f"/api/v1/zhou-xu/logs/status/{TEST_PLAYER_ID}")
        assert response.status_code == 200
        data = response.json()
        
        assert "has_auto_save" in data
        assert "manual_saves" in data
        assert "total_size_kb" in data
    
    def test_clear_logs(self):
        """Test clearing logs."""
        # Create and save a session first
        chat_response = client.post(
            "/api/v1/zhou-xu/chat",
            json={
                "player_id": TEST_PLAYER_ID,
                "message": "Hello!"
            }
        )
        session_id = chat_response.json()["session_id"]
        
        client.post(
            "/api/v1/zhou-xu/save",
            json={
                "player_id": TEST_PLAYER_ID,
                "session_id": session_id
            }
        )
        
        # Clear logs
        response = client.delete(f"/api/v1/zhou-xu/logs/clear/{TEST_PLAYER_ID}")
        assert response.status_code == 200
        assert response.json()["success"] == True


class TestDiagnostics:
    """Tests for diagnostic endpoints."""
    
    def test_get_diagnostics(self):
        """Test getting diagnostics."""
        response = client.get("/api/v1/zhou-xu/diagnostics")
        assert response.status_code == 200
        data = response.json()
        
        assert "status" in data
        assert "logs_directory" in data
        assert "logs_exist" in data
        assert "player_count" in data
        assert "total_size_mb" in data
        assert "issues" in data
        assert "recommendations" in data
    
    def test_get_active_sessions(self):
        """Test getting active sessions info."""
        # Create a session
        client.post(
            "/api/v1/zhou-xu/chat",
            json={
                "player_id": TEST_PLAYER_ID,
                "message": "Hello!"
            }
        )
        
        response = client.get("/api/v1/zhou-xu/diagnostics/active-sessions")
        assert response.status_code == 200
        data = response.json()
        
        assert "active_session_count" in data
        assert "sessions" in data
        assert data["active_session_count"] >= 1
    
    def test_run_cleanup(self):
        """Test running cleanup."""
        response = client.post("/api/v1/zhou-xu/diagnostics/cleanup")
        assert response.status_code == 200
        assert response.json()["success"] == True
    
    def test_get_response_tags(self):
        """Test getting response tag tables."""
        response = client.get("/api/v1/zhou-xu/response-tags")
        assert response.status_code == 200
        data = response.json()
        
        assert "emotional_tags" in data
        assert "conversation_types" in data
        assert "keyword_patterns" in data
        assert "response_categories" in data


class TestSecurityAndEdgeCases:
    """Tests for security and edge cases."""
    
    def test_path_traversal_protection(self):
        """Test that path traversal is blocked."""
        response = client.get(
            f"/api/v1/zhou-xu/logs/load/{TEST_PLAYER_ID}/../../../etc/passwd"
        )
        assert response.status_code == 400
    
    def test_session_ownership(self):
        """Test that players can only save their own sessions."""
        # Create a session for player 1
        chat_response = client.post(
            "/api/v1/zhou-xu/chat",
            json={
                "player_id": "player_one",
                "message": "Hello!"
            }
        )
        session_id = chat_response.json()["session_id"]
        
        # Try to save as different player
        save_response = client.post(
            "/api/v1/zhou-xu/save",
            json={
                "player_id": "player_two",
                "session_id": session_id
            }
        )
        assert save_response.status_code == 403
    
    def test_very_long_message(self):
        """Test handling of very long messages."""
        long_message = "Hello! " * 500  # About 3500 characters
        
        response = client.post(
            "/api/v1/zhou-xu/chat",
            json={
                "player_id": TEST_PLAYER_ID,
                "message": long_message
            }
        )
        assert response.status_code == 200
    
    def test_special_characters(self):
        """Test handling of special characters."""
        response = client.post(
            "/api/v1/zhou-xu/chat",
            json={
                "player_id": TEST_PLAYER_ID,
                "message": "Hello! 你好! 🎮 <script>alert('xss')</script>"
            }
        )
        assert response.status_code == 200
        # Response should not contain the script tag unescaped
        # (this is handled by JSON serialization)
