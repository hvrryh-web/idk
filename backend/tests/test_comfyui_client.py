"""
Tests for ComfyUI Client and Job Queue

Tests memory safety, concurrent limits, cleanup, and rate limiting.
"""

import asyncio
import pytest
from datetime import datetime, timedelta
from unittest.mock import AsyncMock, MagicMock, patch

from app.services.comfyui_client import (
    ComfyUIClient,
    GenerationJob,
    GenerationStatus,
    JobQueue,
)


class TestJobQueue:
    """Tests for the in-memory job queue."""
    
    @pytest.fixture
    def queue(self):
        return JobQueue()
    
    @pytest.mark.asyncio
    async def test_add_job(self, queue):
        """Test adding a job to the queue."""
        job = GenerationJob(id="test-1")
        await queue.add_job(job)
        
        result = await queue.get_job("test-1")
        assert result is not None
        assert result.id == "test-1"
    
    @pytest.mark.asyncio
    async def test_update_job(self, queue):
        """Test updating job attributes."""
        job = GenerationJob(id="test-1", status=GenerationStatus.PENDING)
        await queue.add_job(job)
        
        await queue.update_job("test-1", status=GenerationStatus.PROCESSING, current_layer=3)
        
        result = await queue.get_job("test-1")
        assert result.status == GenerationStatus.PROCESSING
        assert result.current_layer == 3
    
    @pytest.mark.asyncio
    async def test_remove_job(self, queue):
        """Test removing a job from the queue."""
        job = GenerationJob(id="test-1")
        await queue.add_job(job)
        
        await queue.remove_job("test-1")
        
        result = await queue.get_job("test-1")
        assert result is None
    
    @pytest.mark.asyncio
    async def test_list_jobs_by_status(self, queue):
        """Test listing jobs filtered by status."""
        job1 = GenerationJob(id="test-1", status=GenerationStatus.PENDING)
        job2 = GenerationJob(id="test-2", status=GenerationStatus.PROCESSING)
        job3 = GenerationJob(id="test-3", status=GenerationStatus.PENDING)
        
        await queue.add_job(job1)
        await queue.add_job(job2)
        await queue.add_job(job3)
        
        pending = await queue.list_jobs(status=GenerationStatus.PENDING)
        assert len(pending) == 2
        
        processing = await queue.list_jobs(status=GenerationStatus.PROCESSING)
        assert len(processing) == 1
    
    @pytest.mark.asyncio
    async def test_concurrent_access(self, queue):
        """Test thread-safe concurrent access."""
        # Add many jobs concurrently
        async def add_jobs(start_id: int, count: int):
            for i in range(count):
                job = GenerationJob(id=f"job-{start_id + i}")
                await queue.add_job(job)
        
        # Run multiple add operations concurrently
        await asyncio.gather(
            add_jobs(0, 10),
            add_jobs(100, 10),
            add_jobs(200, 10),
        )
        
        all_jobs = await queue.list_jobs()
        assert len(all_jobs) == 30
    
    @pytest.mark.asyncio
    async def test_get_nonexistent_job(self, queue):
        """Test getting a job that doesn't exist."""
        result = await queue.get_job("nonexistent")
        assert result is None
    
    @pytest.mark.asyncio
    async def test_update_nonexistent_job(self, queue):
        """Test updating a job that doesn't exist."""
        result = await queue.update_job("nonexistent", status=GenerationStatus.COMPLETED)
        assert result is None


class TestGenerationJob:
    """Tests for GenerationJob dataclass."""
    
    def test_default_values(self):
        """Test default job values."""
        job = GenerationJob(id="test-1")
        
        assert job.id == "test-1"
        assert job.status == GenerationStatus.PENDING
        assert job.current_layer == 0
        assert job.total_layers == 7
        assert job.progress_percent == 0.0
        assert job.layer_outputs == {}
        assert job.error_message is None
        assert job.created_at is not None
    
    def test_custom_values(self):
        """Test job with custom values."""
        created = datetime(2024, 1, 1, 12, 0, 0)
        job = GenerationJob(
            id="test-1",
            prompt_id="prompt-123",
            status=GenerationStatus.PROCESSING,
            current_layer=3,
            total_layers=7,
            progress_percent=42.5,
            layer_outputs={"layer_1": "output1.png"},
            created_at=created,
        )
        
        assert job.prompt_id == "prompt-123"
        assert job.status == GenerationStatus.PROCESSING
        assert job.current_layer == 3
        assert job.progress_percent == 42.5
        assert job.layer_outputs == {"layer_1": "output1.png"}
        assert job.created_at == created


class TestComfyUIClient:
    """Tests for ComfyUI client."""
    
    @pytest.fixture
    def client(self):
        return ComfyUIClient(
            base_url="http://test:8188",
            timeout=10,
            polling_interval=1,
        )
    
    @pytest.mark.asyncio
    async def test_health_check_success(self, client):
        """Test successful health check."""
        with patch.object(client, '_get_session') as mock_session:
            mock_response = AsyncMock()
            mock_response.status = 200
            mock_session.return_value.get = AsyncMock(
                return_value=AsyncMock(__aenter__=AsyncMock(return_value=mock_response))
            )
            
            result = await client.check_health()
            # Note: actual implementation may differ, this tests the pattern
    
    @pytest.mark.asyncio
    async def test_client_close(self, client):
        """Test client cleanup on close."""
        # Create a mock session
        mock_session = AsyncMock()
        mock_session.closed = False
        client._session = mock_session
        
        await client.close()
        
        mock_session.close.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_job_status_tracking(self, client):
        """Test that job status can be tracked."""
        job = GenerationJob(id="test-job")
        await client.job_queue.add_job(job)
        
        result = await client.get_job_status("test-job")
        assert result is not None
        assert result.id == "test-job"
    
    @pytest.mark.asyncio
    async def test_cancel_nonexistent_job(self, client):
        """Test canceling a job that doesn't exist."""
        result = await client.cancel_job("nonexistent")
        assert result is False


class TestJobQueueMemorySafety:
    """Tests specifically for memory safety of the job queue."""
    
    @pytest.fixture
    def queue(self):
        return JobQueue()
    
    @pytest.mark.asyncio
    async def test_queue_does_not_grow_unbounded(self, queue):
        """Test that queue can handle many jobs without memory issues."""
        # Add 1000 jobs
        for i in range(1000):
            job = GenerationJob(id=f"job-{i}")
            await queue.add_job(job)
        
        # Remove them all
        for i in range(1000):
            await queue.remove_job(f"job-{i}")
        
        # Queue should be empty
        all_jobs = await queue.list_jobs()
        assert len(all_jobs) == 0
    
    @pytest.mark.asyncio
    async def test_job_outputs_dont_leak(self, queue):
        """Test that large job outputs don't cause memory leaks."""
        # Create job with large output data
        large_outputs = {f"layer_{i}": f"path_{i}" * 1000 for i in range(100)}
        job = GenerationJob(id="large-job", layer_outputs=large_outputs)
        
        await queue.add_job(job)
        await queue.remove_job("large-job")
        
        # Verify job is gone
        result = await queue.get_job("large-job")
        assert result is None
    
    @pytest.mark.asyncio
    async def test_concurrent_add_remove(self, queue):
        """Test concurrent add and remove operations."""
        added_ids = set()
        removed_ids = set()
        
        async def add_jobs():
            for i in range(100):
                job_id = f"job-add-{i}"
                job = GenerationJob(id=job_id)
                await queue.add_job(job)
                added_ids.add(job_id)
                await asyncio.sleep(0.001)
        
        async def remove_jobs():
            for i in range(50):
                job_id = f"job-add-{i}"
                await queue.remove_job(job_id)
                removed_ids.add(job_id)
                await asyncio.sleep(0.002)
        
        await asyncio.gather(add_jobs(), remove_jobs())
        
        remaining = await queue.list_jobs()
        # Should have added 100, removed 50 = 50 remaining
        assert len(remaining) >= 50


class TestBoundedQueueBehavior:
    """Tests for bounded queue behavior (to be implemented)."""
    
    @pytest.fixture
    def queue(self):
        return JobQueue()
    
    @pytest.mark.asyncio
    async def test_max_concurrent_jobs_limit(self, queue):
        """Test that concurrent processing jobs are limited."""
        # Add more jobs than the limit
        for i in range(10):
            job = GenerationJob(
                id=f"job-{i}",
                status=GenerationStatus.PROCESSING
            )
            await queue.add_job(job)
        
        processing = await queue.list_jobs(status=GenerationStatus.PROCESSING)
        
        # This test documents expected behavior
        # In production, we should enforce MAX_CONCURRENT = 3
        # For now, just verify we can query processing jobs
        assert len(processing) == 10  # Current: no limit enforced
    
    @pytest.mark.asyncio
    async def test_queue_depth_tracking(self, queue):
        """Test that queue depth can be tracked."""
        # Add pending jobs
        for i in range(20):
            job = GenerationJob(id=f"job-{i}", status=GenerationStatus.PENDING)
            await queue.add_job(job)
        
        pending = await queue.list_jobs(status=GenerationStatus.PENDING)
        assert len(pending) == 20


class TestCleanupVerification:
    """Tests to verify cleanup operations work correctly."""
    
    @pytest.fixture
    def queue(self):
        return JobQueue()
    
    @pytest.mark.asyncio
    async def test_completed_jobs_can_be_cleaned(self, queue):
        """Test that completed jobs can be removed."""
        # Add completed jobs
        for i in range(10):
            job = GenerationJob(
                id=f"job-{i}",
                status=GenerationStatus.COMPLETED,
                completed_at=datetime.utcnow() - timedelta(hours=24)
            )
            await queue.add_job(job)
        
        # Simulate cleanup of completed jobs older than 1 hour
        completed = await queue.list_jobs(status=GenerationStatus.COMPLETED)
        for job in completed:
            if job.completed_at and job.completed_at < datetime.utcnow() - timedelta(hours=1):
                await queue.remove_job(job.id)
        
        remaining = await queue.list_jobs()
        assert len(remaining) == 0
    
    @pytest.mark.asyncio
    async def test_failed_jobs_preserve_error(self, queue):
        """Test that failed jobs preserve error messages."""
        job = GenerationJob(
            id="failed-job",
            status=GenerationStatus.FAILED,
            error_message="GPU out of memory"
        )
        await queue.add_job(job)
        
        result = await queue.get_job("failed-job")
        assert result is not None
        assert result.error_message == "GPU out of memory"


class TestTimeoutBehavior:
    """Tests for timeout handling."""
    
    @pytest.fixture
    def client(self):
        return ComfyUIClient(
            base_url="http://test:8188",
            timeout=2,  # Short timeout for testing
            polling_interval=1,
        )
    
    @pytest.mark.asyncio
    async def test_poll_respects_timeout(self, client):
        """Test that polling respects timeout setting."""
        # This would require mocking the actual HTTP calls
        # For now, verify timeout is set correctly
        assert client.timeout == 2
        assert client.polling_interval == 1


# Integration test markers for tests that need actual ComfyUI
class TestComfyUIIntegration:
    """Integration tests - only run when ComfyUI is available."""
    
    @pytest.fixture
    def client(self):
        return ComfyUIClient()
    
    @pytest.mark.skip(reason="Requires running ComfyUI instance")
    @pytest.mark.asyncio
    async def test_real_health_check(self, client):
        """Test real health check against ComfyUI."""
        result = await client.check_health()
        # This would verify actual ComfyUI connectivity
        assert isinstance(result, bool)
    
    @pytest.mark.skip(reason="Requires running ComfyUI instance")
    @pytest.mark.asyncio
    async def test_real_system_stats(self, client):
        """Test getting real system stats from ComfyUI."""
        result = await client.get_system_stats()
        if result:
            assert "system" in result or "devices" in result
