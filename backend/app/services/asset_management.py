"""
Asset Management Service

Handles asset inventory, cleanup, monitoring, and rate limiting
to prevent memory bloat and disk exhaustion.
"""

import asyncio
import hashlib
import logging
import os
import shutil
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import settings

logger = logging.getLogger(__name__)


# Configuration constants
class AssetLimits:
    """Hard limits for asset management - non-negotiable safety limits."""
    MAX_CONCURRENT_GENERATIONS = 3
    MAX_QUEUED_JOBS_PER_USER = 10
    MAX_TOTAL_QUEUED_JOBS = 50
    MAX_DISK_USAGE_MB = 2048  # 2GB
    MAX_ASSETS_PER_CHARACTER = 100
    CACHE_TTL_HOURS = 168  # 7 days
    CLEANUP_ORPHAN_DAYS = 14
    MEMORY_WARNING_MB = 512
    MEMORY_HARD_LIMIT_MB = 1024
    
    # Rate limits
    RATE_LIMIT_PER_USER_PER_HOUR = 20
    RATE_LIMIT_PER_USER_PER_DAY = 100
    RATE_LIMIT_GLOBAL_PER_MINUTE = 10


@dataclass
class AssetStats:
    """Statistics about asset storage."""
    total_assets: int = 0
    total_size_bytes: int = 0
    by_type: Dict[str, Tuple[int, int]] = field(default_factory=dict)  # type -> (count, bytes)
    oldest_asset: Optional[datetime] = None
    newest_asset: Optional[datetime] = None
    expired_count: int = 0
    orphan_count: int = 0


@dataclass  
class CleanupResult:
    """Result of a cleanup operation."""
    items_deleted: int = 0
    bytes_reclaimed: int = 0
    errors: List[str] = field(default_factory=list)
    duration_seconds: float = 0.0


class RateLimiter:
    """Rate limiting for generation requests."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def check_rate_limit(
        self,
        user_id: str,
        action_type: str = "generation",
    ) -> Tuple[bool, str]:
        """
        Check if user is within rate limits.
        
        Returns:
            Tuple of (is_allowed, reason_if_denied)
        """
        now = datetime.utcnow()
        
        # Check hourly limit
        hour_start = now.replace(minute=0, second=0, microsecond=0)
        hourly_count = self._get_request_count(user_id, action_type, hour_start)
        
        if hourly_count >= AssetLimits.RATE_LIMIT_PER_USER_PER_HOUR:
            return False, f"Hourly rate limit exceeded ({AssetLimits.RATE_LIMIT_PER_USER_PER_HOUR}/hour)"
        
        # Check daily limit
        day_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        daily_count = self._get_request_count(user_id, action_type, day_start)
        
        if daily_count >= AssetLimits.RATE_LIMIT_PER_USER_PER_DAY:
            return False, f"Daily rate limit exceeded ({AssetLimits.RATE_LIMIT_PER_USER_PER_DAY}/day)"
        
        # Check global rate (last minute)
        minute_start = now - timedelta(minutes=1)
        global_count = self._get_global_request_count(action_type, minute_start)
        
        if global_count >= AssetLimits.RATE_LIMIT_GLOBAL_PER_MINUTE:
            return False, "System is busy. Please try again in a moment."
        
        return True, ""
    
    def record_request(self, user_id: str, action_type: str = "generation") -> None:
        """Record a request for rate limiting."""
        now = datetime.utcnow()
        window_start = now.replace(minute=0, second=0, microsecond=0)
        
        try:
            self.db.execute(
                text("""
                    INSERT INTO rate_limit_tracking (user_id, action_type, window_start, request_count)
                    VALUES (:user_id, :action_type, :window_start, 1)
                    ON CONFLICT (user_id, action_type, window_start) 
                    DO UPDATE SET request_count = rate_limit_tracking.request_count + 1
                """),
                {"user_id": user_id, "action_type": action_type, "window_start": window_start}
            )
            self.db.commit()
        except Exception as e:
            logger.error(f"Failed to record rate limit: {e}")
            self.db.rollback()
    
    def _get_request_count(self, user_id: str, action_type: str, since: datetime) -> int:
        """Get request count for user since given time."""
        try:
            result = self.db.execute(
                text("""
                    SELECT COALESCE(SUM(request_count), 0) as count
                    FROM rate_limit_tracking
                    WHERE user_id = :user_id 
                      AND action_type = :action_type
                      AND window_start >= :since
                """),
                {"user_id": user_id, "action_type": action_type, "since": since}
            )
            row = result.fetchone()
            return int(row[0]) if row else 0
        except Exception as e:
            logger.error(f"Failed to get rate limit count: {e}")
            return 0
    
    def _get_global_request_count(self, action_type: str, since: datetime) -> int:
        """Get global request count since given time."""
        try:
            result = self.db.execute(
                text("""
                    SELECT COALESCE(SUM(request_count), 0) as count
                    FROM rate_limit_tracking
                    WHERE action_type = :action_type
                      AND window_start >= :since
                """),
                {"action_type": action_type, "since": since}
            )
            row = result.fetchone()
            return int(row[0]) if row else 0
        except Exception as e:
            logger.error(f"Failed to get global rate limit count: {e}")
            return 0


class AssetInventoryService:
    """Service for managing the asset inventory."""
    
    def __init__(self, db: Session):
        self.db = db
        self.output_dir = Path(settings.GENERATION_OUTPUT_DIR)
    
    def register_asset(
        self,
        file_path: str,
        asset_type: str,
        category: Optional[str] = None,
        archetype_id: Optional[str] = None,
        variant_key: Optional[str] = None,
        generation_params: Optional[Dict[str, Any]] = None,
        generation_id: Optional[str] = None,
        is_base_asset: bool = False,
        is_customization_layer: bool = False,
        ttl_hours: Optional[int] = None,
    ) -> Optional[str]:
        """
        Register a generated asset in the inventory.
        
        Returns:
            Asset ID if successful, None if failed
        """
        try:
            full_path = Path(file_path)
            if not full_path.exists():
                logger.error(f"Asset file not found: {file_path}")
                return None
            
            # Get file info
            file_size = full_path.stat().st_size
            content_hash = self._calculate_hash(full_path)
            dimensions = self._get_image_dimensions(full_path)
            
            # Check for duplicate
            existing = self._find_by_hash(content_hash)
            if existing:
                logger.info(f"Asset already exists with hash {content_hash}: {existing}")
                return existing
            
            # Calculate expiration
            expires_at = None
            if ttl_hours is not None:
                expires_at = datetime.utcnow() + timedelta(hours=ttl_hours)
            elif not is_base_asset:
                expires_at = datetime.utcnow() + timedelta(hours=AssetLimits.CACHE_TTL_HOURS)
            
            result = self.db.execute(
                text("""
                    INSERT INTO asset_inventory (
                        asset_type, category, archetype_id, variant_key,
                        file_path, file_size_bytes, dimensions, content_hash,
                        generation_params, generation_id, is_base_asset,
                        is_customization_layer, expires_at
                    ) VALUES (
                        :asset_type, :category, :archetype_id, :variant_key,
                        :file_path, :file_size_bytes, :dimensions, :content_hash,
                        :generation_params, :generation_id, :is_base_asset,
                        :is_customization_layer, :expires_at
                    )
                    RETURNING id
                """),
                {
                    "asset_type": asset_type,
                    "category": category,
                    "archetype_id": archetype_id,
                    "variant_key": variant_key,
                    "file_path": str(file_path),
                    "file_size_bytes": file_size,
                    "dimensions": dimensions,
                    "content_hash": content_hash,
                    "generation_params": generation_params,
                    "generation_id": generation_id,
                    "is_base_asset": is_base_asset,
                    "is_customization_layer": is_customization_layer,
                    "expires_at": expires_at,
                }
            )
            
            row = result.fetchone()
            self.db.commit()
            
            asset_id = str(row[0]) if row else None
            logger.info(f"Registered asset {asset_id}: {asset_type}/{category}")
            return asset_id
            
        except Exception as e:
            logger.error(f"Failed to register asset: {e}")
            self.db.rollback()
            return None
    
    def get_asset(self, asset_id: str) -> Optional[Dict[str, Any]]:
        """Get asset by ID and update access tracking."""
        try:
            result = self.db.execute(
                text("""
                    UPDATE asset_inventory
                    SET access_count = access_count + 1, last_accessed_at = NOW()
                    WHERE id = :id AND deleted_at IS NULL
                    RETURNING id, asset_type, category, file_path, dimensions
                """),
                {"id": asset_id}
            )
            row = result.fetchone()
            self.db.commit()
            
            if row:
                return {
                    "id": str(row[0]),
                    "asset_type": row[1],
                    "category": row[2],
                    "file_path": row[3],
                    "dimensions": row[4],
                }
            return None
        except Exception as e:
            logger.error(f"Failed to get asset: {e}")
            return None
    
    def find_assets(
        self,
        asset_type: Optional[str] = None,
        category: Optional[str] = None,
        archetype_id: Optional[str] = None,
        limit: int = 100,
    ) -> List[Dict[str, Any]]:
        """Find assets matching criteria."""
        try:
            conditions = ["deleted_at IS NULL"]
            params: Dict[str, Any] = {"limit": limit}
            
            if asset_type:
                conditions.append("asset_type = :asset_type")
                params["asset_type"] = asset_type
            if category:
                conditions.append("category = :category")
                params["category"] = category
            if archetype_id:
                conditions.append("archetype_id = :archetype_id")
                params["archetype_id"] = archetype_id
            
            where_clause = " AND ".join(conditions)
            
            result = self.db.execute(
                text(f"""
                    SELECT id, asset_type, category, archetype_id, variant_key,
                           file_path, dimensions, created_at
                    FROM asset_inventory
                    WHERE {where_clause}
                    ORDER BY created_at DESC
                    LIMIT :limit
                """),
                params
            )
            
            return [
                {
                    "id": str(row[0]),
                    "asset_type": row[1],
                    "category": row[2],
                    "archetype_id": row[3],
                    "variant_key": row[4],
                    "file_path": row[5],
                    "dimensions": row[6],
                    "created_at": row[7].isoformat() if row[7] else None,
                }
                for row in result.fetchall()
            ]
        except Exception as e:
            logger.error(f"Failed to find assets: {e}")
            return []
    
    def get_stats(self) -> AssetStats:
        """Get asset inventory statistics."""
        stats = AssetStats()
        
        try:
            # Total counts
            result = self.db.execute(
                text("""
                    SELECT 
                        COUNT(*) as total,
                        COALESCE(SUM(file_size_bytes), 0) as total_size,
                        MIN(created_at) as oldest,
                        MAX(created_at) as newest
                    FROM asset_inventory
                    WHERE deleted_at IS NULL
                """)
            )
            row = result.fetchone()
            if row:
                stats.total_assets = row[0]
                stats.total_size_bytes = row[1]
                stats.oldest_asset = row[2]
                stats.newest_asset = row[3]
            
            # By type
            result = self.db.execute(
                text("""
                    SELECT asset_type, COUNT(*), COALESCE(SUM(file_size_bytes), 0)
                    FROM asset_inventory
                    WHERE deleted_at IS NULL
                    GROUP BY asset_type
                """)
            )
            for row in result.fetchall():
                stats.by_type[row[0]] = (row[1], row[2])
            
            # Expired count
            result = self.db.execute(
                text("""
                    SELECT COUNT(*) FROM asset_inventory
                    WHERE deleted_at IS NULL 
                      AND expires_at IS NOT NULL 
                      AND expires_at < NOW()
                """)
            )
            row = result.fetchone()
            stats.expired_count = row[0] if row else 0
            
        except Exception as e:
            logger.error(f"Failed to get asset stats: {e}")
        
        return stats
    
    def check_disk_usage(self) -> Tuple[int, bool, bool]:
        """
        Check current disk usage.
        
        Returns:
            Tuple of (usage_mb, is_warning, is_critical)
        """
        stats = self.get_stats()
        usage_mb = stats.total_size_bytes // (1024 * 1024)
        
        warning_threshold = int(AssetLimits.MAX_DISK_USAGE_MB * 0.8)
        critical_threshold = int(AssetLimits.MAX_DISK_USAGE_MB * 0.95)
        
        is_warning = usage_mb >= warning_threshold
        is_critical = usage_mb >= critical_threshold
        
        if is_critical:
            logger.critical(f"Disk usage critical: {usage_mb}MB / {AssetLimits.MAX_DISK_USAGE_MB}MB")
        elif is_warning:
            logger.warning(f"Disk usage warning: {usage_mb}MB / {AssetLimits.MAX_DISK_USAGE_MB}MB")
        
        return usage_mb, is_warning, is_critical
    
    def _calculate_hash(self, file_path: Path) -> str:
        """Calculate SHA-256 hash of file."""
        sha256 = hashlib.sha256()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(8192), b""):
                sha256.update(chunk)
        return sha256.hexdigest()
    
    def _get_image_dimensions(self, file_path: Path) -> Optional[str]:
        """Get image dimensions as 'WxH' string."""
        try:
            # Try to read PNG header for dimensions
            with open(file_path, "rb") as f:
                header = f.read(24)
                if header[:8] == b'\x89PNG\r\n\x1a\n':
                    width = int.from_bytes(header[16:20], 'big')
                    height = int.from_bytes(header[20:24], 'big')
                    return f"{width}x{height}"
        except Exception:
            pass
        return None
    
    def _find_by_hash(self, content_hash: str) -> Optional[str]:
        """Find existing asset by content hash."""
        try:
            result = self.db.execute(
                text("""
                    SELECT id FROM asset_inventory
                    WHERE content_hash = :hash AND deleted_at IS NULL
                """),
                {"hash": content_hash}
            )
            row = result.fetchone()
            return str(row[0]) if row else None
        except Exception:
            return None


class CleanupService:
    """Service for cleaning up expired and orphaned assets."""
    
    def __init__(self, db: Session):
        self.db = db
        self.output_dir = Path(settings.GENERATION_OUTPUT_DIR)
    
    async def run_cleanup(self, dry_run: bool = False) -> CleanupResult:
        """
        Run full cleanup cycle.
        
        Args:
            dry_run: If True, don't actually delete anything
        """
        start_time = datetime.utcnow()
        result = CleanupResult()
        
        # 1. Clean expired assets
        expired_result = await self._cleanup_expired_assets(dry_run)
        result.items_deleted += expired_result.items_deleted
        result.bytes_reclaimed += expired_result.bytes_reclaimed
        result.errors.extend(expired_result.errors)
        
        # 2. Clean orphan files
        orphan_result = await self._cleanup_orphan_files(dry_run)
        result.items_deleted += orphan_result.items_deleted
        result.bytes_reclaimed += orphan_result.bytes_reclaimed
        result.errors.extend(orphan_result.errors)
        
        # 3. Clean old rate limit records
        await self._cleanup_rate_limit_records(dry_run)
        
        # 4. Clean old resource logs
        await self._cleanup_old_logs(dry_run)
        
        result.duration_seconds = (datetime.utcnow() - start_time).total_seconds()
        
        # Log cleanup job
        if not dry_run:
            self._log_cleanup_job(result)
        
        logger.info(
            f"Cleanup complete: {result.items_deleted} items, "
            f"{result.bytes_reclaimed // 1024}KB reclaimed, "
            f"{result.duration_seconds:.2f}s"
        )
        
        return result
    
    async def _cleanup_expired_assets(self, dry_run: bool) -> CleanupResult:
        """Clean up assets past their expiration date."""
        result = CleanupResult()
        
        try:
            # Get expired assets
            expired = self.db.execute(
                text("""
                    SELECT id, file_path, file_size_bytes
                    FROM asset_inventory
                    WHERE expires_at IS NOT NULL 
                      AND expires_at < NOW()
                      AND deleted_at IS NULL
                      AND is_base_asset = false
                    LIMIT 100
                """)
            ).fetchall()
            
            for row in expired:
                asset_id, file_path, file_size = row
                
                if dry_run:
                    result.items_deleted += 1
                    result.bytes_reclaimed += file_size or 0
                    continue
                
                try:
                    # Delete file
                    path = Path(file_path)
                    if path.exists():
                        path.unlink()
                        result.bytes_reclaimed += file_size or 0
                    
                    # Mark as deleted in DB
                    self.db.execute(
                        text("UPDATE asset_inventory SET deleted_at = NOW() WHERE id = :id"),
                        {"id": asset_id}
                    )
                    result.items_deleted += 1
                    
                except Exception as e:
                    result.errors.append(f"Failed to delete {file_path}: {e}")
            
            if not dry_run:
                self.db.commit()
                
        except Exception as e:
            logger.error(f"Expired asset cleanup error: {e}")
            result.errors.append(str(e))
        
        return result
    
    async def _cleanup_orphan_files(self, dry_run: bool) -> CleanupResult:
        """Clean up files not tracked in the inventory."""
        result = CleanupResult()
        
        if not self.output_dir.exists():
            return result
        
        try:
            # Get all tracked file paths
            tracked = self.db.execute(
                text("SELECT file_path FROM asset_inventory WHERE deleted_at IS NULL")
            ).fetchall()
            tracked_paths = {row[0] for row in tracked}
            
            # Find orphan files
            cutoff = datetime.utcnow() - timedelta(days=AssetLimits.CLEANUP_ORPHAN_DAYS)
            
            for file_path in self.output_dir.rglob("*.png"):
                str_path = str(file_path)
                if str_path in tracked_paths:
                    continue
                
                # Check if file is old enough
                mtime = datetime.fromtimestamp(file_path.stat().st_mtime)
                if mtime > cutoff:
                    continue
                
                if dry_run:
                    result.items_deleted += 1
                    result.bytes_reclaimed += file_path.stat().st_size
                    continue
                
                try:
                    file_size = file_path.stat().st_size
                    file_path.unlink()
                    result.items_deleted += 1
                    result.bytes_reclaimed += file_size
                except Exception as e:
                    result.errors.append(f"Failed to delete orphan {file_path}: {e}")
                    
        except Exception as e:
            logger.error(f"Orphan cleanup error: {e}")
            result.errors.append(str(e))
        
        return result
    
    async def _cleanup_rate_limit_records(self, dry_run: bool) -> None:
        """Clean old rate limit tracking records."""
        if dry_run:
            return
        
        try:
            cutoff = datetime.utcnow() - timedelta(days=7)
            self.db.execute(
                text("DELETE FROM rate_limit_tracking WHERE window_start < :cutoff"),
                {"cutoff": cutoff}
            )
            self.db.commit()
        except Exception as e:
            logger.error(f"Rate limit cleanup error: {e}")
    
    async def _cleanup_old_logs(self, dry_run: bool) -> None:
        """Clean old resource usage logs."""
        if dry_run:
            return
        
        try:
            cutoff = datetime.utcnow() - timedelta(days=30)
            self.db.execute(
                text("DELETE FROM resource_usage_log WHERE timestamp < :cutoff AND is_alert = false"),
                {"cutoff": cutoff}
            )
            self.db.commit()
        except Exception as e:
            logger.error(f"Log cleanup error: {e}")
    
    def _log_cleanup_job(self, result: CleanupResult) -> None:
        """Log cleanup job to database."""
        try:
            self.db.execute(
                text("""
                    INSERT INTO cleanup_jobs (job_type, status, items_processed, bytes_reclaimed, completed_at)
                    VALUES ('full_cleanup', 'completed', :items, :bytes, NOW())
                """),
                {"items": result.items_deleted, "bytes": result.bytes_reclaimed}
            )
            self.db.commit()
        except Exception as e:
            logger.error(f"Failed to log cleanup job: {e}")


class ResourceMonitor:
    """Monitor system resources and log metrics."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def log_metrics(self) -> None:
        """Log current resource metrics."""
        try:
            # Get asset inventory service for stats
            inventory = AssetInventoryService(self.db)
            stats = inventory.get_stats()
            
            # Log disk usage
            self._log_metric(
                "disk_usage_bytes",
                stats.total_size_bytes,
                "bytes",
                warning=int(AssetLimits.MAX_DISK_USAGE_MB * 0.8 * 1024 * 1024),
                critical=int(AssetLimits.MAX_DISK_USAGE_MB * 0.95 * 1024 * 1024),
            )
            
            # Log asset count
            self._log_metric("asset_count", stats.total_assets, "count")
            
            # Log expired count
            if stats.expired_count > 0:
                self._log_metric(
                    "expired_assets",
                    stats.expired_count,
                    "count",
                    is_alert=stats.expired_count > 100
                )
            
            # Log queue depth
            queue_depth = self._get_queue_depth()
            self._log_metric(
                "queue_depth",
                queue_depth,
                "count",
                warning=int(AssetLimits.MAX_TOTAL_QUEUED_JOBS * 0.8),
                critical=AssetLimits.MAX_TOTAL_QUEUED_JOBS,
            )
            
        except Exception as e:
            logger.error(f"Failed to log metrics: {e}")
    
    def _log_metric(
        self,
        metric_type: str,
        value: int,
        unit: str,
        warning: Optional[int] = None,
        critical: Optional[int] = None,
        is_alert: bool = False,
    ) -> None:
        """Log a single metric."""
        if warning and value >= warning:
            is_alert = True
        if critical and value >= critical:
            is_alert = True
        
        try:
            self.db.execute(
                text("""
                    INSERT INTO resource_usage_log 
                    (metric_type, metric_value, metric_unit, threshold_warning, threshold_critical, is_alert)
                    VALUES (:type, :value, :unit, :warning, :critical, :alert)
                """),
                {
                    "type": metric_type,
                    "value": value,
                    "unit": unit,
                    "warning": warning,
                    "critical": critical,
                    "alert": is_alert,
                }
            )
            self.db.commit()
        except Exception as e:
            logger.error(f"Failed to log metric {metric_type}: {e}")
    
    def _get_queue_depth(self) -> int:
        """Get current queue depth."""
        try:
            result = self.db.execute(
                text("SELECT COUNT(*) FROM generation_queue WHERE status IN ('pending', 'locked')")
            )
            row = result.fetchone()
            return row[0] if row else 0
        except Exception:
            return 0
    
    def get_recent_alerts(self, limit: int = 20) -> List[Dict[str, Any]]:
        """Get recent alerts."""
        try:
            result = self.db.execute(
                text("""
                    SELECT timestamp, metric_type, metric_value, metric_unit, details
                    FROM resource_usage_log
                    WHERE is_alert = true
                    ORDER BY timestamp DESC
                    LIMIT :limit
                """),
                {"limit": limit}
            )
            return [
                {
                    "timestamp": row[0].isoformat() if row[0] else None,
                    "metric_type": row[1],
                    "metric_value": row[2],
                    "metric_unit": row[3],
                    "details": row[4],
                }
                for row in result.fetchall()
            ]
        except Exception as e:
            logger.error(f"Failed to get alerts: {e}")
            return []
