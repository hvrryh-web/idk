"""
ComfyUI Client Service

Async client for communicating with ComfyUI API.
Handles workflow submission, progress tracking, and result retrieval.
"""

import asyncio
import json
import logging
import uuid
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Any, Callable, Dict, List, Optional

import aiohttp

from app.core.config import settings

logger = logging.getLogger(__name__)


class GenerationStatus(str, Enum):
    """Status of a generation job."""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


@dataclass
class GenerationJob:
    """Represents a generation job."""
    id: str
    prompt_id: Optional[str] = None
    status: GenerationStatus = GenerationStatus.PENDING
    current_layer: int = 0
    total_layers: int = 7
    progress_percent: float = 0.0
    layer_outputs: Dict[str, str] = None
    error_message: Optional[str] = None
    created_at: datetime = None
    completed_at: Optional[datetime] = None
    
    def __post_init__(self):
        if self.layer_outputs is None:
            self.layer_outputs = {}
        if self.created_at is None:
            self.created_at = datetime.utcnow()


class JobQueue:
    """Simple in-memory job queue (Redis can be added later)."""
    
    def __init__(self):
        self._jobs: Dict[str, GenerationJob] = {}
        self._lock = asyncio.Lock()
    
    async def add_job(self, job: GenerationJob) -> None:
        """Add a job to the queue."""
        async with self._lock:
            self._jobs[job.id] = job
    
    async def get_job(self, job_id: str) -> Optional[GenerationJob]:
        """Get a job by ID."""
        async with self._lock:
            return self._jobs.get(job_id)
    
    async def update_job(self, job_id: str, **kwargs) -> Optional[GenerationJob]:
        """Update a job's attributes."""
        async with self._lock:
            job = self._jobs.get(job_id)
            if job:
                for key, value in kwargs.items():
                    if hasattr(job, key):
                        setattr(job, key, value)
            return job
    
    async def remove_job(self, job_id: str) -> None:
        """Remove a job from the queue."""
        async with self._lock:
            self._jobs.pop(job_id, None)
    
    async def list_jobs(self, status: Optional[GenerationStatus] = None) -> List[GenerationJob]:
        """List all jobs, optionally filtered by status."""
        async with self._lock:
            jobs = list(self._jobs.values())
            if status:
                jobs = [j for j in jobs if j.status == status]
            return jobs


class ComfyUIClient:
    """Async client for ComfyUI API communication."""
    
    def __init__(
        self,
        base_url: Optional[str] = None,
        timeout: Optional[int] = None,
        polling_interval: Optional[int] = None,
    ):
        self.base_url = (base_url or settings.COMFYUI_URL).rstrip("/")
        self.timeout = timeout or settings.COMFYUI_TIMEOUT
        self.polling_interval = polling_interval or settings.COMFYUI_POLLING_INTERVAL
        self.job_queue = JobQueue()
        self._session: Optional[aiohttp.ClientSession] = None
        self._ws_connections: Dict[str, aiohttp.ClientWebSocketResponse] = {}
    
    async def _get_session(self) -> aiohttp.ClientSession:
        """Get or create aiohttp session."""
        if self._session is None or self._session.closed:
            timeout = aiohttp.ClientTimeout(total=self.timeout)
            self._session = aiohttp.ClientSession(timeout=timeout)
        return self._session
    
    async def close(self) -> None:
        """Close the client session."""
        if self._session and not self._session.closed:
            await self._session.close()
        for ws in self._ws_connections.values():
            await ws.close()
        self._ws_connections.clear()
    
    async def check_health(self) -> bool:
        """Check if ComfyUI server is available."""
        try:
            session = await self._get_session()
            async with session.get(f"{self.base_url}/system_stats") as response:
                return response.status == 200
        except Exception as e:
            logger.warning(f"ComfyUI health check failed: {e}")
            return False
    
    async def get_system_stats(self) -> Optional[Dict[str, Any]]:
        """Get ComfyUI system statistics."""
        try:
            session = await self._get_session()
            async with session.get(f"{self.base_url}/system_stats") as response:
                if response.status == 200:
                    return await response.json()
        except Exception as e:
            logger.error(f"Failed to get system stats: {e}")
        return None
    
    async def submit_workflow(
        self,
        workflow: Dict[str, Any],
        client_id: Optional[str] = None,
    ) -> Optional[str]:
        """
        Submit a workflow to ComfyUI for execution.
        
        Args:
            workflow: The workflow/prompt dictionary
            client_id: Optional client ID for WebSocket tracking
            
        Returns:
            prompt_id if successful, None otherwise
        """
        try:
            session = await self._get_session()
            payload = {"prompt": workflow}
            if client_id:
                payload["client_id"] = client_id
            
            async with session.post(
                f"{self.base_url}/prompt",
                json=payload,
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    return data.get("prompt_id")
                else:
                    error_text = await response.text()
                    logger.error(f"Failed to submit workflow: {error_text}")
        except Exception as e:
            logger.error(f"Error submitting workflow: {e}")
        return None
    
    async def get_history(self, prompt_id: str) -> Optional[Dict[str, Any]]:
        """Get execution history for a prompt."""
        try:
            session = await self._get_session()
            async with session.get(f"{self.base_url}/history/{prompt_id}") as response:
                if response.status == 200:
                    data = await response.json()
                    return data.get(prompt_id)
        except Exception as e:
            logger.error(f"Failed to get history: {e}")
        return None
    
    async def get_queue(self) -> Optional[Dict[str, Any]]:
        """Get current queue status."""
        try:
            session = await self._get_session()
            async with session.get(f"{self.base_url}/queue") as response:
                if response.status == 200:
                    return await response.json()
        except Exception as e:
            logger.error(f"Failed to get queue: {e}")
        return None
    
    async def download_image(
        self,
        filename: str,
        subfolder: str = "",
        folder_type: str = "output",
    ) -> Optional[bytes]:
        """Download a generated image."""
        try:
            session = await self._get_session()
            params = {
                "filename": filename,
                "subfolder": subfolder,
                "type": folder_type,
            }
            async with session.get(f"{self.base_url}/view", params=params) as response:
                if response.status == 200:
                    return await response.read()
        except Exception as e:
            logger.error(f"Failed to download image: {e}")
        return None
    
    async def poll_for_completion(
        self,
        prompt_id: str,
        progress_callback: Optional[Callable[[int, int], None]] = None,
        max_retries: int = 3,
    ) -> Optional[Dict[str, Any]]:
        """
        Poll for workflow completion with exponential backoff.
        
        Args:
            prompt_id: The prompt ID to poll for
            progress_callback: Optional callback(current_step, total_steps)
            max_retries: Maximum retries on connection errors
            
        Returns:
            History data if completed, None if failed/timeout
        """
        start_time = asyncio.get_event_loop().time()
        retry_count = 0
        backoff = self.polling_interval
        
        while (asyncio.get_event_loop().time() - start_time) < self.timeout:
            try:
                history = await self.get_history(prompt_id)
                
                if history:
                    status = history.get("status", {})
                    
                    if status.get("status_str") == "error":
                        logger.error(f"Workflow execution error: {status}")
                        return None
                    
                    if history.get("outputs"):
                        return history
                    
                    # Report progress if available
                    if progress_callback:
                        progress = status.get("exec_info", {})
                        current = progress.get("current_step", 0)
                        total = progress.get("total_steps", 1)
                        progress_callback(current, total)
                
                # Reset retry count on successful poll
                retry_count = 0
                backoff = self.polling_interval
                
            except aiohttp.ClientError as e:
                retry_count += 1
                if retry_count >= max_retries:
                    logger.error(f"Max retries reached polling for {prompt_id}")
                    return None
                backoff = min(backoff * 2, 30)  # Exponential backoff, max 30s
                logger.warning(f"Retry {retry_count}/{max_retries} for {prompt_id}: {e}")
            
            await asyncio.sleep(backoff)
        
        logger.error(f"Timeout waiting for completion of {prompt_id}")
        return None
    
    async def connect_websocket(
        self,
        client_id: str,
        message_callback: Callable[[Dict[str, Any]], None],
    ) -> None:
        """
        Connect to ComfyUI WebSocket for real-time progress updates.
        
        Args:
            client_id: Unique client identifier
            message_callback: Callback for received messages
        """
        ws_url = self.base_url.replace("http", "ws") + f"/ws?clientId={client_id}"
        
        try:
            session = await self._get_session()
            ws = await session.ws_connect(ws_url)
            self._ws_connections[client_id] = ws
            
            async for msg in ws:
                if msg.type == aiohttp.WSMsgType.TEXT:
                    try:
                        data = json.loads(msg.data)
                        message_callback(data)
                    except json.JSONDecodeError:
                        logger.warning(f"Invalid WebSocket message: {msg.data}")
                elif msg.type == aiohttp.WSMsgType.ERROR:
                    logger.error(f"WebSocket error: {ws.exception()}")
                    break
                    
        except Exception as e:
            logger.error(f"WebSocket connection error: {e}")
        finally:
            self._ws_connections.pop(client_id, None)
    
    async def disconnect_websocket(self, client_id: str) -> None:
        """Disconnect a WebSocket connection."""
        ws = self._ws_connections.pop(client_id, None)
        if ws:
            await ws.close()
    
    # High-level generation methods
    
    async def generate_character(
        self,
        workflow: Dict[str, Any],
        character_id: str,
        progress_callback: Optional[Callable[[int, int, str], None]] = None,
    ) -> GenerationJob:
        """
        Execute full character generation workflow.
        
        Args:
            workflow: Prepared workflow dictionary
            character_id: Character ID for tracking
            progress_callback: Optional callback(layer, total_layers, status)
            
        Returns:
            GenerationJob with results
        """
        job_id = str(uuid.uuid4())
        job = GenerationJob(
            id=job_id,
            total_layers=7,
            status=GenerationStatus.PENDING,
        )
        await self.job_queue.add_job(job)
        
        try:
            # Submit workflow
            prompt_id = await self.submit_workflow(workflow)
            if not prompt_id:
                job.status = GenerationStatus.FAILED
                job.error_message = "Failed to submit workflow to ComfyUI"
                return job
            
            job.prompt_id = prompt_id
            job.status = GenerationStatus.PROCESSING
            await self.job_queue.update_job(job_id, prompt_id=prompt_id, status=GenerationStatus.PROCESSING)
            
            # Poll for completion
            def on_progress(current: int, total: int):
                layer = min(int((current / max(total, 1)) * 7) + 1, 7)
                if progress_callback:
                    progress_callback(layer, 7, "processing")
            
            result = await self.poll_for_completion(prompt_id, on_progress)
            
            if result:
                job.status = GenerationStatus.COMPLETED
                job.completed_at = datetime.utcnow()
                job.progress_percent = 100.0
                job.current_layer = 7
                
                # Extract output files
                outputs = result.get("outputs", {})
                for node_id, node_output in outputs.items():
                    if "images" in node_output:
                        for img in node_output["images"]:
                            layer_name = img.get("filename", "").split("_")[-1].replace(".png", "")
                            job.layer_outputs[layer_name] = img.get("filename")
            else:
                job.status = GenerationStatus.FAILED
                job.error_message = "Workflow execution failed or timed out"
            
        except Exception as e:
            logger.exception(f"Error generating character: {e}")
            job.status = GenerationStatus.FAILED
            job.error_message = str(e)
        
        await self.job_queue.update_job(
            job_id,
            status=job.status,
            layer_outputs=job.layer_outputs,
            error_message=job.error_message,
            completed_at=job.completed_at,
        )
        
        return job
    
    async def get_job_status(self, job_id: str) -> Optional[GenerationJob]:
        """Get the status of a generation job."""
        return await self.job_queue.get_job(job_id)
    
    async def cancel_job(self, job_id: str) -> bool:
        """
        Cancel a running job.
        
        Note: ComfyUI doesn't have a direct cancel API,
        so this marks the job as failed and removes from tracking.
        """
        job = await self.job_queue.get_job(job_id)
        if job and job.status == GenerationStatus.PROCESSING:
            # Attempt to interrupt via queue API
            try:
                session = await self._get_session()
                async with session.post(f"{self.base_url}/interrupt") as response:
                    if response.status == 200:
                        await self.job_queue.update_job(
                            job_id,
                            status=GenerationStatus.FAILED,
                            error_message="Job cancelled by user",
                        )
                        return True
            except Exception as e:
                logger.error(f"Failed to cancel job: {e}")
        return False


# Global client instance
_client: Optional[ComfyUIClient] = None


def get_comfyui_client() -> ComfyUIClient:
    """Get the global ComfyUI client instance."""
    global _client
    if _client is None:
        _client = ComfyUIClient()
    return _client


async def close_comfyui_client() -> None:
    """Close the global ComfyUI client."""
    global _client
    if _client:
        await _client.close()
        _client = None
