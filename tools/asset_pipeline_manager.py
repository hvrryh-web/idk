#!/usr/bin/env python3
"""
Asset Pipeline Manager

Manages the flow of visual assets through the storage and staging pipeline:
incoming → processed → pending → ready → deployed → frontend/ComfyUI

Usage:
    ./tools/asset_pipeline_manager.py process
    ./tools/asset_pipeline_manager.py stage --character diao-chan
    ./tools/asset_pipeline_manager.py approve --id asset123
    ./tools/asset_pipeline_manager.py deploy --target frontend
    ./tools/asset_pipeline_manager.py status
    ./tools/asset_pipeline_manager.py list --status pending
"""

import argparse
import json
import os
import shutil
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional
import hashlib


# Configuration
PROJECT_ROOT = Path(__file__).parent.parent
STORAGE_ROOT = PROJECT_ROOT / "storage" / "visual-assets"
STAGING_ROOT = PROJECT_ROOT / "staging" / "visual-assets"
FRONTEND_ASSETS = PROJECT_ROOT / "frontend" / "public" / "assets"
COMFYUI_REF = PROJECT_ROOT / "tools" / "comfyui" / "reference_images"
LORA_TRAINING = PROJECT_ROOT / "models" / "loras" / "training-data"

# Allowed file types
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".svg", ".webp", ".gif"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# Asset metadata database (JSON file)
METADATA_DB = STAGING_ROOT / "asset_metadata.json"


class AssetMetadata:
    """Represents metadata for a visual asset."""
    
    def __init__(self, filepath: Path):
        self.id = self._generate_id(filepath)
        self.filename = filepath.name
        self.type = self._detect_type(filepath.name)
        self.size = filepath.stat().st_size if filepath.exists() else 0
        self.checksum = self._calculate_checksum(filepath)
        self.status = "incoming"
        self.created_at = datetime.now().isoformat()
        self.updated_at = self.created_at
        self.deployed_to = []
        self.source_path = str(filepath)
    
    def _generate_id(self, filepath: Path) -> str:
        """Generate unique ID for asset."""
        name_hash = hashlib.md5(filepath.name.encode()).hexdigest()[:8]
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        return f"{name_hash}_{timestamp}"
    
    def _detect_type(self, filename: str) -> str:
        """Detect asset type from filename."""
        name_lower = filename.lower()
        if "character" in name_lower or "char" in name_lower:
            return "character"
        elif "ui-" in name_lower or "icon" in name_lower or "button" in name_lower:
            return "ui"
        elif "fate" in name_lower or "card" in name_lower:
            return "fate-card"
        elif "bg-" in name_lower or "background" in name_lower:
            return "background"
        else:
            return "unknown"
    
    def _calculate_checksum(self, filepath: Path) -> str:
        """Calculate SHA256 checksum of file."""
        if not filepath.exists():
            return ""
        sha256 = hashlib.sha256()
        with open(filepath, 'rb') as f:
            for chunk in iter(lambda: f.read(4096), b""):
                sha256.update(chunk)
        return sha256.hexdigest()
    
    def to_dict(self) -> Dict:
        """Convert to dictionary."""
        return {
            "id": self.id,
            "filename": self.filename,
            "type": self.type,
            "size": self.size,
            "checksum": self.checksum,
            "status": self.status,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "deployed_to": self.deployed_to,
            "source_path": self.source_path
        }


class AssetDatabase:
    """Manages asset metadata database."""
    
    def __init__(self, db_path: Path = METADATA_DB):
        self.db_path = db_path
        self.assets = self._load()
    
    def _load(self) -> Dict[str, Dict]:
        """Load database from JSON file."""
        if self.db_path.exists():
            with open(self.db_path) as f:
                return json.load(f)
        return {}
    
    def save(self):
        """Save database to JSON file."""
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.db_path, 'w') as f:
            json.dump(self.assets, f, indent=2)
    
    def add(self, metadata: AssetMetadata):
        """Add asset metadata."""
        self.assets[metadata.id] = metadata.to_dict()
        self.save()
    
    def get(self, asset_id: str) -> Optional[Dict]:
        """Get asset metadata by ID."""
        return self.assets.get(asset_id)
    
    def update_status(self, asset_id: str, status: str):
        """Update asset status."""
        if asset_id in self.assets:
            self.assets[asset_id]["status"] = status
            self.assets[asset_id]["updated_at"] = datetime.now().isoformat()
            self.save()
    
    def add_deployment(self, asset_id: str, target: str):
        """Add deployment target."""
        if asset_id in self.assets:
            if target not in self.assets[asset_id]["deployed_to"]:
                self.assets[asset_id]["deployed_to"].append(target)
                self.save()
    
    def list_by_status(self, status: str) -> List[Dict]:
        """List assets by status."""
        return [asset for asset in self.assets.values() if asset["status"] == status]
    
    def list_all(self) -> List[Dict]:
        """List all assets."""
        return list(self.assets.values())


def validate_asset(filepath: Path) -> tuple[bool, str]:
    """Validate asset file."""
    # Check file exists
    if not filepath.exists():
        return False, "File does not exist"
    
    # Check file extension
    if filepath.suffix.lower() not in ALLOWED_EXTENSIONS:
        return False, f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
    
    # Check file size
    if filepath.stat().st_size > MAX_FILE_SIZE:
        return False, f"File too large (max {MAX_FILE_SIZE / (1024*1024):.1f}MB)"
    
    # Check file is readable
    try:
        with open(filepath, 'rb') as f:
            f.read(1)
    except Exception as e:
        return False, f"File not readable: {e}"
    
    return True, "OK"


def process_incoming(db: AssetDatabase):
    """Process files in incoming directory."""
    incoming_dir = STORAGE_ROOT / "incoming"
    processed_dir = STORAGE_ROOT / "processed"
    
    print(f"🔍 Scanning incoming directory: {incoming_dir}")
    
    files = list(incoming_dir.glob("*"))
    image_files = [f for f in files if f.suffix.lower() in ALLOWED_EXTENSIONS]
    
    if not image_files:
        print("   No assets to process.")
        return
    
    print(f"   Found {len(image_files)} asset(s)")
    
    for filepath in image_files:
        print(f"\n📄 Processing: {filepath.name}")
        
        # Validate
        valid, message = validate_asset(filepath)
        if not valid:
            print(f"   ❌ Validation failed: {message}")
            continue
        
        # Create metadata
        metadata = AssetMetadata(filepath)
        
        # Move to processed
        dest = processed_dir / filepath.name
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(filepath), str(dest))
        
        # Update metadata
        metadata.source_path = str(dest)
        metadata.status = "processed"
        db.add(metadata)
        
        print(f"   ✅ Processed → {dest}")
        print(f"   ID: {metadata.id}")
        print(f"   Type: {metadata.type}")
        print(f"   Size: {metadata.size / 1024:.1f} KB")


def stage_assets(db: AssetDatabase, character: Optional[str] = None):
    """Move processed assets to staging."""
    processed_dir = STORAGE_ROOT / "processed"
    pending_dir = STAGING_ROOT / "pending"
    
    print(f"📦 Staging assets from processed...")
    
    # Get processed assets
    processed_assets = db.list_by_status("processed")
    
    if character:
        processed_assets = [a for a in processed_assets if character.lower() in a["filename"].lower()]
    
    if not processed_assets:
        print("   No processed assets to stage.")
        return
    
    print(f"   Found {len(processed_assets)} asset(s) to stage")
    
    for asset in processed_assets:
        source = Path(asset["source_path"])
        if not source.exists():
            print(f"   ⚠️  Source not found: {source}")
            continue
        
        dest = pending_dir / source.name
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(str(source), str(dest))
        
        db.update_status(asset["id"], "pending")
        
        print(f"   ✅ Staged: {source.name} → pending/")


def approve_asset(db: AssetDatabase, asset_id: str):
    """Approve a pending asset."""
    asset = db.get(asset_id)
    
    if not asset:
        print(f"❌ Asset not found: {asset_id}")
        return
    
    if asset["status"] != "pending":
        print(f"❌ Asset is not pending (status: {asset['status']})")
        return
    
    pending_dir = STAGING_ROOT / "pending"
    ready_dir = STAGING_ROOT / "ready"
    
    source = pending_dir / asset["filename"]
    if not source.exists():
        print(f"❌ Asset file not found: {source}")
        return
    
    dest = ready_dir / asset["filename"]
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.move(str(source), str(dest))
    
    db.update_status(asset_id, "ready")
    
    print(f"✅ Approved: {asset['filename']}")
    print(f"   Ready for deployment")


def deploy_assets(db: AssetDatabase, target: str = "all"):
    """Deploy ready assets to target locations."""
    ready_dir = STAGING_ROOT / "ready"
    deployed_dir = STAGING_ROOT / "deployed"
    
    print(f"🚀 Deploying assets to: {target}")
    
    ready_assets = db.list_by_status("ready")
    
    if not ready_assets:
        print("   No ready assets to deploy.")
        return
    
    print(f"   Found {len(ready_assets)} asset(s) to deploy")
    
    for asset in ready_assets:
        source = ready_dir / asset["filename"]
        if not source.exists():
            print(f"   ⚠️  Source not found: {source}")
            continue
        
        deployed_targets = []
        
        # Deploy to frontend
        if target in ["all", "frontend"]:
            frontend_dest = determine_frontend_path(asset)
            if frontend_dest:
                frontend_dest.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(str(source), str(frontend_dest))
                deployed_targets.append("frontend")
                print(f"   ✅ Deployed to frontend: {frontend_dest.relative_to(PROJECT_ROOT)}")
        
        # Deploy to ComfyUI
        if target in ["all", "comfyui"] and asset["type"] == "character":
            comfyui_dest = determine_comfyui_path(asset)
            if comfyui_dest:
                comfyui_dest.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(str(source), str(comfyui_dest))
                deployed_targets.append("comfyui")
                print(f"   ✅ Deployed to ComfyUI: {comfyui_dest.relative_to(PROJECT_ROOT)}")
        
        # Record deployment
        if deployed_targets:
            for t in deployed_targets:
                db.add_deployment(asset["id"], t)
            db.update_status(asset["id"], "deployed")
            
            # Move to deployed directory
            deployed_path = deployed_dir / asset["filename"]
            deployed_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(source), str(deployed_path))


def determine_frontend_path(asset: Dict) -> Optional[Path]:
    """Determine frontend deployment path based on asset type."""
    asset_type = asset["type"]
    filename = asset["filename"]
    
    if asset_type == "character":
        # Extract character name from filename
        if "portrait" in filename.lower():
            return FRONTEND_ASSETS / "characters" / "portraits" / filename
        elif "bust" in filename.lower():
            return FRONTEND_ASSETS / "characters" / "busts" / filename
        elif "thumb" in filename.lower():
            return FRONTEND_ASSETS / "characters" / "thumbnails" / filename
        else:
            return FRONTEND_ASSETS / "characters" / "reference" / filename
    
    elif asset_type == "ui":
        return FRONTEND_ASSETS / "ui" / filename
    
    elif asset_type == "fate-card":
        return FRONTEND_ASSETS / "fate-cards" / filename
    
    elif asset_type == "background":
        return FRONTEND_ASSETS / "backgrounds" / filename
    
    return None


def determine_comfyui_path(asset: Dict) -> Optional[Path]:
    """Determine ComfyUI deployment path."""
    filename = asset["filename"]
    
    # Extract character name from filename
    # Format: character-{name}-{variant}_{timestamp}.ext
    parts = filename.lower().split("-")
    if len(parts) >= 2:
        char_name = parts[1]
        return COMFYUI_REF / char_name / filename
    
    return COMFYUI_REF / filename


def show_status(db: AssetDatabase):
    """Show pipeline status."""
    print("📊 Asset Pipeline Status\n")
    
    statuses = ["incoming", "processed", "pending", "ready", "deployed"]
    
    for status in statuses:
        assets = db.list_by_status(status)
        count = len(assets)
        emoji = {
            "incoming": "📥",
            "processed": "✅",
            "pending": "⏳",
            "ready": "🎯",
            "deployed": "🚀"
        }.get(status, "📄")
        
        print(f"{emoji} {status.capitalize()}: {count} asset(s)")
        
        if count > 0 and count <= 5:
            for asset in assets:
                print(f"   - {asset['filename']} ({asset['type']})")


def list_assets(db: AssetDatabase, status: Optional[str] = None):
    """List assets."""
    if status:
        assets = db.list_by_status(status)
        print(f"\n📋 Assets with status: {status}\n")
    else:
        assets = db.list_all()
        print(f"\n📋 All Assets\n")
    
    if not assets:
        print("   No assets found.")
        return
    
    print(f"{'ID':<20} {'Filename':<40} {'Type':<15} {'Status':<12} {'Size (KB)':<10}")
    print("-" * 100)
    
    for asset in assets:
        size_kb = asset["size"] / 1024
        print(f"{asset['id']:<20} {asset['filename']:<40} {asset['type']:<15} {asset['status']:<12} {size_kb:>8.1f}")


def main():
    parser = argparse.ArgumentParser(
        description="Asset Pipeline Manager",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s process
  %(prog)s stage --character diao-chan
  %(prog)s approve --id abc123_20241213
  %(prog)s deploy --target frontend
  %(prog)s status
  %(prog)s list --status pending
        """
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Command to execute")
    
    # Process command
    subparsers.add_parser("process", help="Process incoming assets")
    
    # Stage command
    stage_parser = subparsers.add_parser("stage", help="Stage processed assets")
    stage_parser.add_argument("--character", help="Filter by character name")
    
    # Approve command
    approve_parser = subparsers.add_parser("approve", help="Approve pending asset")
    approve_parser.add_argument("--id", required=True, help="Asset ID to approve")
    
    # Deploy command
    deploy_parser = subparsers.add_parser("deploy", help="Deploy ready assets")
    deploy_parser.add_argument("--target", choices=["all", "frontend", "comfyui"], default="all")
    
    # Status command
    subparsers.add_parser("status", help="Show pipeline status")
    
    # List command
    list_parser = subparsers.add_parser("list", help="List assets")
    list_parser.add_argument("--status", help="Filter by status")
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        sys.exit(1)
    
    # Initialize database
    db = AssetDatabase()
    
    # Dispatch to command handler
    if args.command == "process":
        process_incoming(db)
    elif args.command == "stage":
        stage_assets(db, args.character)
    elif args.command == "approve":
        approve_asset(db, args.id)
    elif args.command == "deploy":
        deploy_assets(db, args.target)
    elif args.command == "status":
        show_status(db)
    elif args.command == "list":
        list_assets(db, args.status)


if __name__ == "__main__":
    main()
