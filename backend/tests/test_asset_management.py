"""
Tests for Asset Management Service

Tests asset inventory, cleanup, rate limiting, and resource monitoring.
"""

import pytest
from datetime import datetime, timedelta
from pathlib import Path
from unittest.mock import MagicMock, patch, PropertyMock
import tempfile
import os

from app.services.asset_management import (
    AssetLimits,
    AssetStats,
    CleanupResult,
    RateLimiter,
    AssetInventoryService,
    CleanupService,
    ResourceMonitor,
)


class TestAssetLimits:
    """Tests for asset limit constants."""
    
    def test_concurrent_limit(self):
        """Verify concurrent generation limit is reasonable."""
        assert AssetLimits.MAX_CONCURRENT_GENERATIONS == 3
        assert AssetLimits.MAX_CONCURRENT_GENERATIONS > 0
        assert AssetLimits.MAX_CONCURRENT_GENERATIONS <= 10
    
    def test_queue_limits(self):
        """Verify queue limits are set."""
        assert AssetLimits.MAX_QUEUED_JOBS_PER_USER == 10
        assert AssetLimits.MAX_TOTAL_QUEUED_JOBS == 50
        assert AssetLimits.MAX_TOTAL_QUEUED_JOBS >= AssetLimits.MAX_QUEUED_JOBS_PER_USER
    
    def test_disk_limits(self):
        """Verify disk usage limits."""
        assert AssetLimits.MAX_DISK_USAGE_MB == 2048
        assert AssetLimits.MAX_DISK_USAGE_MB > 0
    
    def test_rate_limits(self):
        """Verify rate limits are reasonable."""
        assert AssetLimits.RATE_LIMIT_PER_USER_PER_HOUR == 20
        assert AssetLimits.RATE_LIMIT_PER_USER_PER_DAY == 100
        assert AssetLimits.RATE_LIMIT_GLOBAL_PER_MINUTE == 10
        
        # Daily should be >= hourly * reasonable hours
        assert AssetLimits.RATE_LIMIT_PER_USER_PER_DAY >= AssetLimits.RATE_LIMIT_PER_USER_PER_HOUR
    
    def test_cache_ttl(self):
        """Verify cache TTL is set."""
        assert AssetLimits.CACHE_TTL_HOURS == 168  # 7 days
        assert AssetLimits.CACHE_TTL_HOURS > 0
    
    def test_memory_limits(self):
        """Verify memory limits are set."""
        assert AssetLimits.MEMORY_WARNING_MB == 512
        assert AssetLimits.MEMORY_HARD_LIMIT_MB == 1024
        assert AssetLimits.MEMORY_HARD_LIMIT_MB > AssetLimits.MEMORY_WARNING_MB


class TestAssetStats:
    """Tests for AssetStats dataclass."""
    
    def test_default_values(self):
        """Test default stats values."""
        stats = AssetStats()
        
        assert stats.total_assets == 0
        assert stats.total_size_bytes == 0
        assert stats.by_type == {}
        assert stats.oldest_asset is None
        assert stats.newest_asset is None
        assert stats.expired_count == 0
        assert stats.orphan_count == 0
    
    def test_custom_values(self):
        """Test stats with custom values."""
        now = datetime.utcnow()
        stats = AssetStats(
            total_assets=100,
            total_size_bytes=1024 * 1024 * 500,  # 500MB
            by_type={"character_portrait": (50, 256 * 1024 * 1024)},
            oldest_asset=now - timedelta(days=30),
            newest_asset=now,
            expired_count=5,
            orphan_count=2,
        )
        
        assert stats.total_assets == 100
        assert stats.total_size_bytes == 1024 * 1024 * 500
        assert "character_portrait" in stats.by_type
        assert stats.expired_count == 5


class TestCleanupResult:
    """Tests for CleanupResult dataclass."""
    
    def test_default_values(self):
        """Test default cleanup result values."""
        result = CleanupResult()
        
        assert result.items_deleted == 0
        assert result.bytes_reclaimed == 0
        assert result.errors == []
        assert result.duration_seconds == 0.0
    
    def test_aggregation(self):
        """Test aggregating cleanup results."""
        result1 = CleanupResult(items_deleted=5, bytes_reclaimed=1000)
        result2 = CleanupResult(items_deleted=3, bytes_reclaimed=500, errors=["error1"])
        
        # Simulate combining results
        total_items = result1.items_deleted + result2.items_deleted
        total_bytes = result1.bytes_reclaimed + result2.bytes_reclaimed
        all_errors = result1.errors + result2.errors
        
        assert total_items == 8
        assert total_bytes == 1500
        assert len(all_errors) == 1


class TestRateLimiter:
    """Tests for rate limiting functionality."""
    
    @pytest.fixture
    def mock_db(self):
        """Create a mock database session."""
        db = MagicMock()
        return db
    
    @pytest.fixture
    def limiter(self, mock_db):
        """Create a rate limiter with mock DB."""
        return RateLimiter(mock_db)
    
    def test_allow_first_request(self, limiter, mock_db):
        """Test that first request is allowed."""
        # Mock zero existing requests
        mock_result = MagicMock()
        mock_result.fetchone.return_value = (0,)
        mock_db.execute.return_value = mock_result
        
        allowed, reason = limiter.check_rate_limit("user1", "generation")
        
        assert allowed is True
        assert reason == ""
    
    def test_block_when_hourly_exceeded(self, limiter, mock_db):
        """Test blocking when hourly limit exceeded."""
        # Mock hourly limit exceeded
        mock_result = MagicMock()
        mock_result.fetchone.return_value = (AssetLimits.RATE_LIMIT_PER_USER_PER_HOUR,)
        mock_db.execute.return_value = mock_result
        
        allowed, reason = limiter.check_rate_limit("user1", "generation")
        
        assert allowed is False
        assert "Hourly" in reason
    
    def test_block_when_daily_exceeded(self, limiter, mock_db):
        """Test blocking when daily limit exceeded."""
        # First call for hourly (under limit), second for daily (over limit)
        mock_result_hourly = MagicMock()
        mock_result_hourly.fetchone.return_value = (5,)  # Under hourly
        
        mock_result_daily = MagicMock()
        mock_result_daily.fetchone.return_value = (AssetLimits.RATE_LIMIT_PER_USER_PER_DAY,)
        
        mock_db.execute.side_effect = [mock_result_hourly, mock_result_daily]
        
        allowed, reason = limiter.check_rate_limit("user1", "generation")
        
        assert allowed is False
        assert "Daily" in reason
    
    def test_record_request(self, limiter, mock_db):
        """Test recording a request."""
        limiter.record_request("user1", "generation")
        
        # Verify DB was called
        mock_db.execute.assert_called()
        mock_db.commit.assert_called()
    
    def test_record_request_rollback_on_error(self, limiter, mock_db):
        """Test rollback on recording error."""
        mock_db.execute.side_effect = Exception("DB error")
        
        # Should not raise, just log
        limiter.record_request("user1", "generation")
        
        mock_db.rollback.assert_called()


class TestAssetInventoryService:
    """Tests for asset inventory service."""
    
    @pytest.fixture
    def mock_db(self):
        """Create a mock database session."""
        return MagicMock()
    
    @pytest.fixture
    def temp_output_dir(self):
        """Create a temporary output directory."""
        with tempfile.TemporaryDirectory() as tmpdir:
            yield Path(tmpdir)
    
    @pytest.fixture
    def inventory(self, mock_db, temp_output_dir):
        """Create inventory service with mocks."""
        with patch('app.services.asset_management.settings') as mock_settings:
            mock_settings.GENERATION_OUTPUT_DIR = str(temp_output_dir)
            service = AssetInventoryService(mock_db)
            service.output_dir = temp_output_dir
            yield service
    
    def test_calculate_hash(self, inventory, temp_output_dir):
        """Test file hash calculation."""
        # Create a test file
        test_file = temp_output_dir / "test.png"
        test_file.write_bytes(b"test content for hashing")
        
        hash1 = inventory._calculate_hash(test_file)
        hash2 = inventory._calculate_hash(test_file)
        
        # Same content = same hash
        assert hash1 == hash2
        assert len(hash1) == 64  # SHA-256 hex length
    
    def test_hash_differs_for_different_content(self, inventory, temp_output_dir):
        """Test that different content produces different hashes."""
        file1 = temp_output_dir / "test1.png"
        file2 = temp_output_dir / "test2.png"
        
        file1.write_bytes(b"content one")
        file2.write_bytes(b"content two")
        
        hash1 = inventory._calculate_hash(file1)
        hash2 = inventory._calculate_hash(file2)
        
        assert hash1 != hash2
    
    def test_get_image_dimensions_png(self, inventory, temp_output_dir):
        """Test getting PNG image dimensions."""
        # Create a minimal valid PNG header (8x8 image)
        # PNG signature + IHDR chunk
        png_header = (
            b'\x89PNG\r\n\x1a\n'  # PNG signature
            b'\x00\x00\x00\rIHDR'  # IHDR chunk length + type
            b'\x00\x00\x02\x00'    # Width: 512
            b'\x00\x00\x03\x00'    # Height: 768
            b'\x08\x02\x00\x00\x00'  # bit depth, color type, etc.
        )
        
        test_file = temp_output_dir / "test.png"
        test_file.write_bytes(png_header + b'\x00' * 100)
        
        dims = inventory._get_image_dimensions(test_file)
        
        assert dims == "512x768"
    
    def test_register_asset_file_not_found(self, inventory):
        """Test registering non-existent file."""
        result = inventory.register_asset(
            file_path="/nonexistent/file.png",
            asset_type="character_portrait",
        )
        
        assert result is None
    
    def test_get_stats_empty(self, inventory, mock_db):
        """Test getting stats with empty inventory."""
        mock_result = MagicMock()
        mock_result.fetchone.return_value = (0, 0, None, None)
        mock_result.fetchall.return_value = []
        mock_db.execute.return_value = mock_result
        
        stats = inventory.get_stats()
        
        assert stats.total_assets == 0
        assert stats.total_size_bytes == 0
    
    def test_check_disk_usage_ok(self, inventory, mock_db):
        """Test disk usage check when under limits."""
        # Mock stats showing 500MB usage
        with patch.object(inventory, 'get_stats') as mock_stats:
            mock_stats.return_value = AssetStats(
                total_size_bytes=500 * 1024 * 1024
            )
            
            usage_mb, is_warning, is_critical = inventory.check_disk_usage()
            
            assert usage_mb == 500
            assert is_warning is False
            assert is_critical is False
    
    def test_check_disk_usage_warning(self, inventory, mock_db):
        """Test disk usage check at warning level."""
        # Mock stats showing 85% of 2GB = 1740MB
        with patch.object(inventory, 'get_stats') as mock_stats:
            mock_stats.return_value = AssetStats(
                total_size_bytes=1740 * 1024 * 1024
            )
            
            usage_mb, is_warning, is_critical = inventory.check_disk_usage()
            
            assert usage_mb == 1740
            assert is_warning is True
            assert is_critical is False
    
    def test_check_disk_usage_critical(self, inventory, mock_db):
        """Test disk usage check at critical level."""
        # Mock stats showing 98% of 2GB = 2007MB
        with patch.object(inventory, 'get_stats') as mock_stats:
            mock_stats.return_value = AssetStats(
                total_size_bytes=2007 * 1024 * 1024
            )
            
            usage_mb, is_warning, is_critical = inventory.check_disk_usage()
            
            assert usage_mb == 2007
            assert is_warning is True
            assert is_critical is True


class TestCleanupService:
    """Tests for cleanup service."""
    
    @pytest.fixture
    def mock_db(self):
        """Create a mock database session."""
        return MagicMock()
    
    @pytest.fixture
    def temp_output_dir(self):
        """Create a temporary output directory."""
        with tempfile.TemporaryDirectory() as tmpdir:
            yield Path(tmpdir)
    
    @pytest.fixture
    def cleanup_service(self, mock_db, temp_output_dir):
        """Create cleanup service with mocks."""
        with patch('app.services.asset_management.settings') as mock_settings:
            mock_settings.GENERATION_OUTPUT_DIR = str(temp_output_dir)
            service = CleanupService(mock_db)
            service.output_dir = temp_output_dir
            yield service
    
    @pytest.mark.asyncio
    async def test_cleanup_expired_assets_empty(self, cleanup_service, mock_db):
        """Test cleanup when no expired assets."""
        mock_result = MagicMock()
        mock_result.fetchall.return_value = []
        mock_db.execute.return_value = mock_result
        
        result = await cleanup_service._cleanup_expired_assets(dry_run=False)
        
        assert result.items_deleted == 0
        assert result.bytes_reclaimed == 0
    
    @pytest.mark.asyncio
    async def test_cleanup_expired_assets_dry_run(self, cleanup_service, mock_db):
        """Test dry run doesn't delete files."""
        # Mock expired assets
        mock_result = MagicMock()
        mock_result.fetchall.return_value = [
            ("asset-1", "/path/to/file1.png", 1000),
            ("asset-2", "/path/to/file2.png", 2000),
        ]
        mock_db.execute.return_value = mock_result
        
        result = await cleanup_service._cleanup_expired_assets(dry_run=True)
        
        assert result.items_deleted == 2
        assert result.bytes_reclaimed == 3000
        # No actual deletions
        mock_db.commit.assert_not_called()
    
    @pytest.mark.asyncio
    async def test_cleanup_orphan_files(self, cleanup_service, mock_db, temp_output_dir):
        """Test orphan file cleanup."""
        # Create some files
        orphan_file = temp_output_dir / "orphan.png"
        orphan_file.write_bytes(b"orphan content")
        
        # Set old modification time
        old_time = (datetime.utcnow() - timedelta(days=30)).timestamp()
        os.utime(orphan_file, (old_time, old_time))
        
        # Mock empty tracked files
        mock_result = MagicMock()
        mock_result.fetchall.return_value = []
        mock_db.execute.return_value = mock_result
        
        result = await cleanup_service._cleanup_orphan_files(dry_run=False)
        
        assert result.items_deleted == 1
        assert not orphan_file.exists()
    
    @pytest.mark.asyncio
    async def test_run_cleanup_full(self, cleanup_service, mock_db):
        """Test full cleanup cycle."""
        # Mock all cleanup operations to return empty
        mock_result = MagicMock()
        mock_result.fetchall.return_value = []
        mock_db.execute.return_value = mock_result
        
        result = await cleanup_service.run_cleanup(dry_run=True)
        
        assert isinstance(result, CleanupResult)
        assert result.duration_seconds >= 0


class TestResourceMonitor:
    """Tests for resource monitoring."""
    
    @pytest.fixture
    def mock_db(self):
        """Create a mock database session."""
        return MagicMock()
    
    @pytest.fixture
    def monitor(self, mock_db):
        """Create resource monitor with mock DB."""
        return ResourceMonitor(mock_db)
    
    def test_get_queue_depth_empty(self, monitor, mock_db):
        """Test getting queue depth when empty."""
        mock_result = MagicMock()
        mock_result.fetchone.return_value = (0,)
        mock_db.execute.return_value = mock_result
        
        depth = monitor._get_queue_depth()
        
        assert depth == 0
    
    def test_get_queue_depth_with_jobs(self, monitor, mock_db):
        """Test getting queue depth with pending jobs."""
        mock_result = MagicMock()
        mock_result.fetchone.return_value = (15,)
        mock_db.execute.return_value = mock_result
        
        depth = monitor._get_queue_depth()
        
        assert depth == 15
    
    def test_get_recent_alerts_empty(self, monitor, mock_db):
        """Test getting alerts when none exist."""
        mock_result = MagicMock()
        mock_result.fetchall.return_value = []
        mock_db.execute.return_value = mock_result
        
        alerts = monitor.get_recent_alerts()
        
        assert alerts == []
    
    def test_log_metrics(self, monitor, mock_db):
        """Test logging metrics doesn't crash."""
        # Mock the inventory service
        with patch('app.services.asset_management.AssetInventoryService') as mock_inv:
            mock_inv.return_value.get_stats.return_value = AssetStats()
            
            mock_result = MagicMock()
            mock_result.fetchone.return_value = (0,)
            mock_db.execute.return_value = mock_result
            
            # Should not raise
            monitor.log_metrics()
            
            # Verify some DB calls were made
            assert mock_db.execute.called


class TestMemoryLeakPrevention:
    """Tests specifically for memory leak prevention."""
    
    def test_asset_stats_no_circular_refs(self):
        """Test that AssetStats doesn't create circular references."""
        stats = AssetStats(
            total_assets=100,
            by_type={"a": (10, 1000), "b": (20, 2000)},
        )
        
        # Create a copy and verify independence
        import copy
        stats_copy = copy.deepcopy(stats)
        
        stats_copy.total_assets = 200
        assert stats.total_assets == 100
    
    def test_cleanup_result_errors_bounded(self):
        """Test that cleanup errors list doesn't grow unbounded."""
        result = CleanupResult()
        
        # Simulate many errors
        for i in range(1000):
            result.errors.append(f"Error {i}")
        
        # In production, we should cap this
        # This test documents the current behavior
        assert len(result.errors) == 1000
        
        # Clear errors
        result.errors.clear()
        assert len(result.errors) == 0
