"""Test configuration and fixtures for backend tests."""
from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient

from app.api.deps import get_db
from app.main import app


@pytest.fixture(scope="function")
def mock_db():
    """Create a mock database session."""
    return MagicMock()


@pytest.fixture(scope="function")
def client():
    """Create a test client without database dependency."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(scope="function")
def client_with_mock_db(mock_db):
    """Create a test client with mocked database dependency."""

    def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client, mock_db
    app.dependency_overrides.clear()
