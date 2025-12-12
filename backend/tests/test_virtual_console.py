"""Tests for VirtualConsoleManager."""

import asyncio
import os
import tempfile
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.services.comfyui.virtual_console import (
    ProcessConfig,
    ProcessState,
    VirtualConsoleManager,
)


@pytest.fixture
def temp_lock_file(tmp_path):
    """Create a temporary lock file path."""
    return str(tmp_path / "test.lock")


@pytest.fixture
def stub_config(temp_lock_file):
    """Create a config for stub mode (no actual ComfyUI)."""
    return ProcessConfig(
        comfyui_path="",  # Empty path enables stub mode
        lock_file_path=temp_lock_file,
        startup_timeout=5.0,
        health_check_timeout=2.0,
    )


@pytest.fixture
def reset_singleton():
    """Reset the singleton instance before each test."""
    VirtualConsoleManager._instance = None
    yield
    VirtualConsoleManager._instance = None


class TestProcessConfig:
    """Tests for ProcessConfig defaults."""

    def test_default_values(self):
        """Test that ProcessConfig has sensible defaults."""
        config = ProcessConfig()
        assert config.health_check_timeout == 5.0
        assert config.max_restart_attempts == 3
        assert config.graceful_shutdown_timeout == 10.0

    def test_custom_values(self, temp_lock_file):
        """Test custom configuration values."""
        config = ProcessConfig(
            lock_file_path=temp_lock_file,
            max_restart_attempts=5,
            health_check_timeout=10.0,
        )
        assert config.lock_file_path == temp_lock_file
        assert config.max_restart_attempts == 5
        assert config.health_check_timeout == 10.0


class TestVirtualConsoleManagerSingleton:
    """Tests for singleton pattern."""

    def test_singleton_pattern(self, stub_config, reset_singleton):
        """Test that only one instance is created."""
        manager1 = VirtualConsoleManager(stub_config)
        manager2 = VirtualConsoleManager()

        assert manager1 is manager2

    def test_config_only_set_once(self, stub_config, reset_singleton):
        """Test that config is only set on first initialization."""
        manager1 = VirtualConsoleManager(stub_config)
        original_config = manager1.config

        # Second call with different config should not change it
        different_config = ProcessConfig(max_restart_attempts=99)
        manager2 = VirtualConsoleManager(different_config)

        assert manager2.config is original_config


class TestLockAcquisition:
    """Tests for lock file handling."""

    def test_acquire_lock_success(self, stub_config, reset_singleton):
        """Test successful lock acquisition."""
        manager = VirtualConsoleManager(stub_config)

        result = manager._acquire_lock()

        assert result is True
        assert manager._lock_file is not None
        assert os.path.exists(stub_config.lock_file_path)

        # Clean up
        manager._release_lock()

    def test_release_lock(self, stub_config, reset_singleton):
        """Test lock release."""
        manager = VirtualConsoleManager(stub_config)
        manager._acquire_lock()

        manager._release_lock()

        assert manager._lock_file is None

    def test_lock_prevents_second_instance(self, temp_lock_file, reset_singleton):
        """Test that lock prevents concurrent instances."""
        config1 = ProcessConfig(lock_file_path=temp_lock_file)
        config2 = ProcessConfig(lock_file_path=temp_lock_file)

        # First manager acquires lock
        manager1 = VirtualConsoleManager(config1)
        result1 = manager1._acquire_lock()
        assert result1 is True

        # Reset singleton to simulate second process
        VirtualConsoleManager._instance = None

        # Second manager should fail to acquire
        manager2 = VirtualConsoleManager.__new__(VirtualConsoleManager)
        manager2._initialized = False
        manager2.__init__(config2)
        result2 = manager2._acquire_lock()

        assert result2 is False

        # Clean up
        manager1._release_lock()


class TestStubMode:
    """Tests for stub mode (no actual ComfyUI)."""

    @pytest.mark.asyncio
    async def test_ensure_started_stub_mode(self, stub_config, reset_singleton):
        """Test that stub mode starts successfully."""
        manager = VirtualConsoleManager(stub_config)

        result = await manager.ensure_started()

        assert result is True
        assert manager.state == ProcessState.RUNNING

        # Clean up
        await manager.stop()

    @pytest.mark.asyncio
    async def test_health_check_stub_mode(self, stub_config, reset_singleton):
        """Test that health check returns True in stub mode."""
        manager = VirtualConsoleManager(stub_config)
        await manager.ensure_started()

        result = await manager.health_check()

        assert result is True

        await manager.stop()

    @pytest.mark.asyncio
    async def test_submit_workflow_stub_mode(self, stub_config, reset_singleton):
        """Test workflow submission in stub mode."""
        manager = VirtualConsoleManager(stub_config)
        await manager.ensure_started()

        prompt_id = await manager.submit_workflow({"test": "workflow"})

        assert prompt_id is not None
        assert len(prompt_id) > 0

        await manager.stop()

    @pytest.mark.asyncio
    async def test_get_job_status_stub_mode(self, stub_config, reset_singleton):
        """Test job status retrieval in stub mode."""
        manager = VirtualConsoleManager(stub_config)
        await manager.ensure_started()

        status = await manager.get_job_status("test-id")

        assert status is not None
        assert status["status"] == "completed"

        await manager.stop()


class TestProcessLifecycle:
    """Tests for process lifecycle management."""

    @pytest.mark.asyncio
    async def test_stop_when_stopped(self, stub_config, reset_singleton):
        """Test that stopping when already stopped is safe."""
        manager = VirtualConsoleManager(stub_config)

        # Should not raise
        await manager.stop()
        assert manager.state == ProcessState.STOPPED

    @pytest.mark.asyncio
    async def test_start_stop_cycle(self, stub_config, reset_singleton):
        """Test complete start/stop cycle."""
        manager = VirtualConsoleManager(stub_config)

        # Start
        result = await manager.ensure_started()
        assert result is True
        assert manager.state == ProcessState.RUNNING

        # Stop
        await manager.stop()
        assert manager.state == ProcessState.STOPPED

    @pytest.mark.asyncio
    async def test_multiple_ensure_started_calls(self, stub_config, reset_singleton):
        """Test that multiple ensure_started calls are safe."""
        manager = VirtualConsoleManager(stub_config)

        # Multiple starts should be idempotent
        result1 = await manager.ensure_started()
        result2 = await manager.ensure_started()
        result3 = await manager.ensure_started()

        assert result1 is True
        assert result2 is True
        assert result3 is True
        assert manager.state == ProcessState.RUNNING

        await manager.stop()


class TestCrashCallback:
    """Tests for crash callback functionality."""

    @pytest.mark.asyncio
    async def test_set_crash_callback(self, stub_config, reset_singleton):
        """Test setting crash callback."""
        manager = VirtualConsoleManager(stub_config)
        callback = MagicMock()

        manager.set_crash_callback(callback)

        assert manager._on_crash_callback is callback


class TestProperties:
    """Tests for manager properties."""

    def test_is_running_when_stopped(self, stub_config, reset_singleton):
        """Test is_running returns False when stopped."""
        manager = VirtualConsoleManager(stub_config)
        assert manager.is_running is False

    @pytest.mark.asyncio
    async def test_is_running_when_running(self, stub_config, reset_singleton):
        """Test is_running returns True when running."""
        manager = VirtualConsoleManager(stub_config)
        await manager.ensure_started()

        assert manager.is_running is True

        await manager.stop()

    def test_pid_when_stopped(self, stub_config, reset_singleton):
        """Test pid returns None when stopped."""
        manager = VirtualConsoleManager(stub_config)
        assert manager.pid is None

    def test_state_property(self, stub_config, reset_singleton):
        """Test state property."""
        manager = VirtualConsoleManager(stub_config)
        assert manager.state == ProcessState.STOPPED


class TestConcurrency:
    """Tests for concurrent access."""

    @pytest.mark.asyncio
    async def test_concurrent_ensure_started(self, stub_config, reset_singleton):
        """Test concurrent ensure_started calls."""
        manager = VirtualConsoleManager(stub_config)

        # Run multiple ensure_started calls concurrently
        results = await asyncio.gather(
            manager.ensure_started(),
            manager.ensure_started(),
            manager.ensure_started(),
        )

        assert all(results)
        assert manager.state == ProcessState.RUNNING

        await manager.stop()

    @pytest.mark.asyncio
    async def test_concurrent_health_checks(self, stub_config, reset_singleton):
        """Test concurrent health check calls."""
        manager = VirtualConsoleManager(stub_config)
        await manager.ensure_started()

        # Run multiple health checks concurrently
        results = await asyncio.gather(
            manager.health_check(),
            manager.health_check(),
            manager.health_check(),
        )

        assert all(results)

        await manager.stop()
