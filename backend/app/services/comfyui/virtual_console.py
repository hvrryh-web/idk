"""Virtual Console Manager for ComfyUI subprocess management.

This module provides a singleton manager for the ComfyUI subprocess with:
- Lazy start: Only starts ComfyUI when first needed
- Single-instance lock: Prevents multiple ComfyUI instances
- Health checks: Monitors ComfyUI availability
- Restart on crash: Automatic restart with exponential backoff
- Graceful shutdown: Proper cleanup on application termination
"""

import asyncio
import fcntl
import logging
import os
import signal
import subprocess
import time
import uuid
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from typing import Callable, Optional

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)


class ProcessState(Enum):
    """State of the ComfyUI process."""

    STOPPED = "stopped"
    STARTING = "starting"
    RUNNING = "running"
    UNHEALTHY = "unhealthy"
    STOPPING = "stopping"
    CRASHED = "crashed"


@dataclass
class ProcessConfig:
    """Configuration for the VirtualConsoleManager."""

    # ComfyUI settings
    comfyui_path: str = ""
    comfyui_url: str = field(default_factory=lambda: settings.COMFYUI_URL)
    python_executable: str = "python"

    # Lock file settings
    lock_file_path: str = "/tmp/comfyui_virtual_console.lock"

    # Health check settings
    health_check_endpoint: str = "/system_stats"
    health_check_timeout: float = 5.0
    health_check_interval: float = 30.0
    startup_timeout: float = 60.0

    # Restart settings
    max_restart_attempts: int = 3
    restart_backoff_base: float = 2.0
    restart_backoff_max: float = 60.0

    # Shutdown settings
    graceful_shutdown_timeout: float = 10.0


class VirtualConsoleManager:
    """
    Manager for the ComfyUI subprocess.

    Provides lazy start, single-instance locking, health monitoring,
    automatic restart on crash, and graceful shutdown.

    Usage:
        manager = VirtualConsoleManager()
        await manager.ensure_started()
        is_healthy = await manager.health_check()
        await manager.stop()
    """

    _instance: Optional["VirtualConsoleManager"] = None
    _lock = asyncio.Lock()

    def __new__(cls, config: Optional[ProcessConfig] = None):
        """Ensure singleton instance."""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self, config: Optional[ProcessConfig] = None):
        """Initialize the manager."""
        if self._initialized:
            return

        self.config = config or ProcessConfig()
        self._process: Optional[subprocess.Popen] = None
        self._state = ProcessState.STOPPED
        self._lock_file: Optional[int] = None
        self._restart_count = 0
        self._last_health_check: Optional[float] = None
        self._health_check_task: Optional[asyncio.Task] = None
        self._on_crash_callback: Optional[Callable] = None
        self._initialized = True

        logger.info("VirtualConsoleManager initialized")

    @property
    def state(self) -> ProcessState:
        """Get the current process state."""
        return self._state

    @property
    def is_running(self) -> bool:
        """Check if the process is running."""
        return self._state == ProcessState.RUNNING

    @property
    def pid(self) -> Optional[int]:
        """Get the process ID if running."""
        return self._process.pid if self._process else None

    def _acquire_lock(self) -> bool:
        """
        Acquire an exclusive lock to ensure single instance.

        Returns:
            True if lock acquired, False otherwise.
        """
        lock_path = Path(self.config.lock_file_path)

        try:
            # Create lock file if it doesn't exist
            lock_path.parent.mkdir(parents=True, exist_ok=True)

            # Open lock file
            self._lock_file = os.open(
                str(lock_path),
                os.O_WRONLY | os.O_CREAT,
                0o600,
            )

            # Try to acquire exclusive lock (non-blocking)
            fcntl.flock(self._lock_file, fcntl.LOCK_EX | fcntl.LOCK_NB)

            # Write PID to lock file
            os.ftruncate(self._lock_file, 0)
            os.write(self._lock_file, f"{os.getpid()}\n".encode())

            logger.info(f"Acquired lock: {lock_path}")
            return True

        except (OSError, BlockingIOError) as e:
            logger.warning(f"Failed to acquire lock: {e}")
            if self._lock_file is not None:
                os.close(self._lock_file)
                self._lock_file = None
            return False

    def _release_lock(self) -> None:
        """Release the exclusive lock."""
        if self._lock_file is not None:
            try:
                fcntl.flock(self._lock_file, fcntl.LOCK_UN)
                os.close(self._lock_file)
                logger.info("Released lock")
            except OSError as e:
                logger.error(f"Error releasing lock: {e}")
            finally:
                self._lock_file = None

            # Remove lock file
            try:
                Path(self.config.lock_file_path).unlink(missing_ok=True)
            except OSError:
                pass

    async def ensure_started(self) -> bool:
        """
        Ensure ComfyUI is started (lazy start).

        Returns:
            True if ComfyUI is running and healthy, False otherwise.
        """
        async with self._lock:
            if self._state == ProcessState.RUNNING:
                return True

            if self._state == ProcessState.STARTING:
                # Wait for startup to complete
                return await self._wait_for_healthy()

            return await self._start()

    async def _start(self) -> bool:
        """
        Start the ComfyUI process.

        Returns:
            True if started successfully, False otherwise.
        """
        # Acquire single-instance lock
        if not self._acquire_lock():
            logger.error("Cannot start: another instance is running")
            return False

        self._state = ProcessState.STARTING
        logger.info("Starting ComfyUI process...")

        try:
            # Build command
            if not self.config.comfyui_path:
                logger.warning("ComfyUI path not configured, using stub mode")
                self._state = ProcessState.RUNNING
                return True

            cmd = [
                self.config.python_executable,
                "main.py",
                "--listen",
                "0.0.0.0",
            ]

            # Start process
            self._process = subprocess.Popen(
                cmd,
                cwd=self.config.comfyui_path,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                preexec_fn=os.setsid,  # Create new process group for cleanup
            )

            logger.info(f"ComfyUI process started with PID {self._process.pid}")

            # Wait for health check to pass
            if await self._wait_for_healthy():
                self._state = ProcessState.RUNNING
                self._restart_count = 0

                # Start health monitoring
                self._start_health_monitor()

                return True
            else:
                logger.error("ComfyUI failed to become healthy")
                await self._stop_process()
                self._state = ProcessState.CRASHED
                return False

        except Exception as e:
            logger.error(f"Failed to start ComfyUI: {e}")
            self._state = ProcessState.CRASHED
            self._release_lock()
            return False

    async def _wait_for_healthy(self) -> bool:
        """
        Wait for ComfyUI to become healthy.

        Returns:
            True if healthy within timeout, False otherwise.
        """
        start_time = time.time()
        check_interval = 1.0

        while time.time() - start_time < self.config.startup_timeout:
            if await self.health_check(timeout=2.0):
                return True

            # Check if process crashed
            if self._process and self._process.poll() is not None:
                logger.error("ComfyUI process exited unexpectedly during startup")
                return False

            await asyncio.sleep(check_interval)
            check_interval = min(check_interval * 1.5, 5.0)

        logger.error(f"ComfyUI did not become healthy within {self.config.startup_timeout}s")
        return False

    async def health_check(self, timeout: Optional[float] = None) -> bool:
        """
        Check if ComfyUI is healthy.

        Args:
            timeout: Optional timeout override.

        Returns:
            True if healthy, False otherwise.
        """
        timeout = timeout or self.config.health_check_timeout

        # In stub mode, always return True
        if not self.config.comfyui_path:
            return True

        try:
            async with httpx.AsyncClient() as client:
                url = f"{self.config.comfyui_url}{self.config.health_check_endpoint}"
                response = await client.get(url, timeout=timeout)

                is_healthy = response.status_code == 200
                self._last_health_check = time.time()

                if is_healthy:
                    logger.debug("Health check passed")
                else:
                    logger.warning(f"Health check failed: status {response.status_code}")

                return is_healthy

        except httpx.TimeoutException:
            logger.warning("Health check timed out")
            return False
        except httpx.RequestError as e:
            logger.warning(f"Health check error: {e}")
            return False

    def _start_health_monitor(self) -> None:
        """Start background health monitoring task."""
        if self._health_check_task and not self._health_check_task.done():
            return

        async def monitor():
            while self._state == ProcessState.RUNNING:
                await asyncio.sleep(self.config.health_check_interval)

                if not await self.health_check():
                    self._state = ProcessState.UNHEALTHY
                    logger.warning("ComfyUI became unhealthy")

                    # Check if process crashed
                    if self._process and self._process.poll() is not None:
                        await self._handle_crash()
                        break

        self._health_check_task = asyncio.create_task(monitor())

    async def _handle_crash(self) -> None:
        """Handle process crash with restart backoff."""
        self._state = ProcessState.CRASHED
        logger.error("ComfyUI process crashed")

        # Notify callback
        if self._on_crash_callback:
            try:
                self._on_crash_callback()
            except Exception as e:
                logger.error(f"Crash callback error: {e}")

        # Attempt restart with backoff
        if self._restart_count < self.config.max_restart_attempts:
            backoff = min(
                self.config.restart_backoff_base ** self._restart_count,
                self.config.restart_backoff_max,
            )
            self._restart_count += 1

            logger.info(
                f"Attempting restart {self._restart_count}/{self.config.max_restart_attempts} "
                f"after {backoff}s backoff"
            )

            await asyncio.sleep(backoff)

            # Clean up before restart
            self._release_lock()
            self._process = None

            # Try to restart
            if await self._start():
                logger.info("Restart successful")
            else:
                logger.error("Restart failed")
        else:
            logger.error(f"Max restart attempts ({self.config.max_restart_attempts}) exceeded")

    async def stop(self, graceful: bool = True) -> None:
        """
        Stop the ComfyUI process.

        Args:
            graceful: If True, try graceful shutdown first.
        """
        async with self._lock:
            if self._state == ProcessState.STOPPED:
                return

            self._state = ProcessState.STOPPING
            logger.info("Stopping ComfyUI process...")

            # Cancel health monitor
            if self._health_check_task:
                self._health_check_task.cancel()
                try:
                    await self._health_check_task
                except asyncio.CancelledError:
                    pass

            # Stop process
            await self._stop_process(graceful=graceful)

            # Release lock
            self._release_lock()

            self._state = ProcessState.STOPPED
            logger.info("ComfyUI process stopped")

    async def _stop_process(self, graceful: bool = True) -> None:
        """Stop the subprocess."""
        if not self._process:
            return

        try:
            # Try graceful shutdown first
            if graceful:
                # Send SIGTERM to process group
                try:
                    os.killpg(os.getpgid(self._process.pid), signal.SIGTERM)
                except ProcessLookupError:
                    return

                # Wait for graceful shutdown
                try:
                    self._process.wait(timeout=self.config.graceful_shutdown_timeout)
                    return
                except subprocess.TimeoutExpired:
                    logger.warning("Graceful shutdown timed out, forcing kill")

            # Force kill
            try:
                os.killpg(os.getpgid(self._process.pid), signal.SIGKILL)
                self._process.wait(timeout=5.0)
            except (ProcessLookupError, subprocess.TimeoutExpired):
                pass

        except Exception as e:
            logger.error(f"Error stopping process: {e}")
        finally:
            self._process = None

    def set_crash_callback(self, callback: Callable) -> None:
        """Set callback to be called when process crashes."""
        self._on_crash_callback = callback

    async def submit_workflow(self, workflow: dict) -> Optional[str]:
        """
        Submit a workflow to ComfyUI.

        Args:
            workflow: The workflow JSON to submit.

        Returns:
            The prompt ID if successful, None otherwise.
        """
        if not await self.ensure_started():
            logger.error("Cannot submit workflow: ComfyUI not running")
            return None

        # In stub mode, return a fake ID
        if not self.config.comfyui_path:
            return str(uuid.uuid4())

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.config.comfyui_url}/prompt",
                    json={"prompt": workflow},
                    timeout=30.0,
                )

                if response.status_code == 200:
                    data = response.json()
                    return data.get("prompt_id")
                else:
                    logger.error(f"Workflow submission failed: {response.status_code}")
                    return None

        except Exception as e:
            logger.error(f"Error submitting workflow: {e}")
            return None

    async def get_job_status(self, prompt_id: str) -> Optional[dict]:
        """
        Get the status of a submitted job.

        Args:
            prompt_id: The prompt ID to check.

        Returns:
            Job status dict if found, None otherwise.
        """
        # In stub mode, return completed status
        if not self.config.comfyui_path:
            return {"status": "completed", "outputs": {}}

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.config.comfyui_url}/history/{prompt_id}",
                    timeout=10.0,
                )

                if response.status_code == 200:
                    return response.json().get(prompt_id)
                return None

        except Exception as e:
            logger.error(f"Error getting job status: {e}")
            return None


# Global instance getter
def get_virtual_console_manager() -> VirtualConsoleManager:
    """Get the singleton VirtualConsoleManager instance."""
    return VirtualConsoleManager()
