"""
Stock Image API Routes

Provides endpoints for fetching, managing, and generating stock images
for the WuXuxian TTRPG. Includes placeholder assets and ComfyUI integration.
"""

import os
import json
import random
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field

router = APIRouter(prefix="/stock-images", tags=["stock-images"])

# Configuration
STOCK_IMAGES_DIR = os.environ.get(
    'STOCK_IMAGES_DIR',
    os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', 'tools', 'comfyui', 'stock-images')
)
MANIFEST_PATH = os.path.join(STOCK_IMAGES_DIR, 'manifest.json')


# ============================================
# Pydantic Models
# ============================================

class AssetInfo(BaseModel):
    id: str
    name: str
    filename: str
    tags: List[str]
    style: str
    dimensions: Dict[str, int]
    placeholder: bool = False
    description: Optional[str] = None


class CategoryInfo(BaseModel):
    name: str
    description: str
    subcategories: List[str]
    asset_count: int


class SubcategoryInfo(BaseModel):
    name: str
    description: str
    assets: List[AssetInfo]


class GenerateRequest(BaseModel):
    category: str
    subcategory: str
    prompt: str
    style: str = "xianxia"
    seed: Optional[int] = None
    width: Optional[int] = None
    height: Optional[int] = None


class GenerateResponse(BaseModel):
    success: bool
    job_id: Optional[str] = None
    message: str
    estimated_time: Optional[int] = None


class PlaceholderRequest(BaseModel):
    type: str  # "character", "background", "item", "effect", "ui"
    width: int = 512
    height: int = 768
    label: Optional[str] = None
    style: str = "xianxia"
    color_scheme: str = "default"  # "default", "violence", "influence", "revelation"


# ============================================
# Utility Functions
# ============================================

def load_manifest() -> Dict[str, Any]:
    """Load the stock images manifest."""
    if not os.path.exists(MANIFEST_PATH):
        return {"version": "1.0.0", "categories": {}}
    
    with open(MANIFEST_PATH, 'r') as f:
        return json.load(f)


def get_asset_path(category: str, subcategory: str, filename: str) -> Path:
    """Get the full path to an asset file."""
    return Path(STOCK_IMAGES_DIR) / 'categories' / category / subcategory / filename


def generate_placeholder_svg(
    asset_type: str,
    width: int,
    height: int,
    label: str,
    color_scheme: str = "default"
) -> str:
    """Generate a placeholder SVG for a given asset type."""
    
    # Color schemes based on Three Pillars
    schemes = {
        "default": {"bg": "#1a2744", "accent": "#d4af37", "text": "#fdf6e3"},
        "violence": {"bg": "#2d1a1a", "accent": "#c41e3a", "text": "#fdf6e3"},
        "influence": {"bg": "#1a2744", "accent": "#4169e1", "text": "#fdf6e3"},
        "revelation": {"bg": "#2d2a1a", "accent": "#d4af37", "text": "#fdf6e3"},
    }
    colors = schemes.get(color_scheme, schemes["default"])
    
    # Icon based on type
    icons = {
        "character": "👤",
        "background": "🏔️",
        "item": "⚔️",
        "effect": "✨",
        "ui": "📜",
    }
    icon = icons.get(asset_type, "📷")
    
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:{colors['bg']};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0a0a15;stop-opacity:1" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="{colors['accent']}" stroke-width="0.5" opacity="0.2"/>
    </pattern>
  </defs>
  
  <rect width="{width}" height="{height}" fill="url(#bg)"/>
  <rect width="{width}" height="{height}" fill="url(#grid)"/>
  
  <rect x="10" y="10" width="{width-20}" height="{height-20}" fill="none" stroke="{colors['accent']}" stroke-width="2" rx="10" opacity="0.5"/>
  
  <text x="{width//2}" y="{height//2 - 20}" text-anchor="middle" font-size="{min(width, height)//4}" fill="{colors['accent']}">{icon}</text>
  <text x="{width//2}" y="{height//2 + 40}" text-anchor="middle" font-family="serif" font-size="{min(width, height)//15}" fill="{colors['text']}">{label or asset_type.upper()}</text>
  <text x="{width//2}" y="{height//2 + 70}" text-anchor="middle" font-family="sans-serif" font-size="{min(width, height)//25}" fill="{colors['accent']}" opacity="0.7">PLACEHOLDER</text>
  
  <text x="{width//2}" y="{height - 30}" text-anchor="middle" font-family="sans-serif" font-size="12" fill="{colors['accent']}" opacity="0.5">{width}x{height} • {color_scheme}</text>
</svg>'''
    return svg


# ============================================
# API Endpoints
# ============================================

@router.get("/categories")
async def list_categories() -> Dict[str, Any]:
    """List all available stock image categories."""
    manifest = load_manifest()
    
    categories = []
    for cat_id, cat_data in manifest.get("categories", {}).items():
        subcats = list(cat_data.get("subcategories", {}).keys())
        asset_count = sum(
            len(subcat.get("assets", []))
            for subcat in cat_data.get("subcategories", {}).values()
        )
        categories.append({
            "id": cat_id,
            "description": cat_data.get("description", ""),
            "subcategories": subcats,
            "asset_count": asset_count
        })
    
    return {"categories": categories}


@router.get("/list/{category}/{subcategory}")
async def list_assets(category: str, subcategory: str) -> Dict[str, Any]:
    """List all assets in a category/subcategory."""
    manifest = load_manifest()
    
    cat_data = manifest.get("categories", {}).get(category)
    if not cat_data:
        raise HTTPException(status_code=404, detail=f"Category '{category}' not found")
    
    subcat_data = cat_data.get("subcategories", {}).get(subcategory)
    if not subcat_data:
        raise HTTPException(status_code=404, detail=f"Subcategory '{subcategory}' not found")
    
    return {
        "category": category,
        "subcategory": subcategory,
        "description": subcat_data.get("description", ""),
        "assets": subcat_data.get("assets", [])
    }


@router.get("/info/{asset_id}")
async def get_asset_info(asset_id: str) -> Dict[str, Any]:
    """Get detailed information about a specific asset."""
    manifest = load_manifest()
    
    for cat_id, cat_data in manifest.get("categories", {}).items():
        for subcat_id, subcat_data in cat_data.get("subcategories", {}).items():
            for asset in subcat_data.get("assets", []):
                if asset.get("id") == asset_id:
                    return {
                        "asset": asset,
                        "category": cat_id,
                        "subcategory": subcat_id,
                        "url": f"/api/v1/stock-images/file/{cat_id}/{subcat_id}/{asset['filename']}"
                    }
    
    raise HTTPException(status_code=404, detail=f"Asset '{asset_id}' not found")


@router.get("/random/{category}/{subcategory}")
async def get_random_asset(
    category: str,
    subcategory: str,
    tags: Optional[str] = Query(None, description="Comma-separated tags to filter by")
) -> Dict[str, Any]:
    """Get a random asset from a category/subcategory."""
    manifest = load_manifest()
    
    cat_data = manifest.get("categories", {}).get(category)
    if not cat_data:
        raise HTTPException(status_code=404, detail=f"Category '{category}' not found")
    
    subcat_data = cat_data.get("subcategories", {}).get(subcategory)
    if not subcat_data:
        raise HTTPException(status_code=404, detail=f"Subcategory '{subcategory}' not found")
    
    assets = subcat_data.get("assets", [])
    
    # Filter by tags if provided
    if tags:
        tag_list = [t.strip().lower() for t in tags.split(",")]
        assets = [
            a for a in assets
            if any(t in [tag.lower() for tag in a.get("tags", [])] for t in tag_list)
        ]
    
    if not assets:
        raise HTTPException(status_code=404, detail="No matching assets found")
    
    asset = random.choice(assets)
    return {
        "asset": asset,
        "category": category,
        "subcategory": subcategory,
        "url": f"/api/v1/stock-images/file/{category}/{subcategory}/{asset['filename']}"
    }


@router.get("/file/{category}/{subcategory}/{filename}")
async def get_asset_file(category: str, subcategory: str, filename: str):
    """Get the actual asset file."""
    # Validate filename to prevent path traversal
    if ".." in filename or "/" in filename or "\\" in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")
    
    file_path = get_asset_path(category, subcategory, filename)
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Asset file not found")
    
    # Determine media type
    suffix = file_path.suffix.lower()
    media_types = {
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
    }
    media_type = media_types.get(suffix, "application/octet-stream")
    
    return FileResponse(file_path, media_type=media_type)


@router.post("/generate-placeholder")
async def generate_placeholder(request: PlaceholderRequest) -> Dict[str, Any]:
    """Generate a placeholder SVG asset on-the-fly."""
    svg_content = generate_placeholder_svg(
        asset_type=request.type,
        width=request.width,
        height=request.height,
        label=request.label or request.type,
        color_scheme=request.color_scheme
    )
    
    return {
        "success": True,
        "svg": svg_content,
        "dimensions": {"width": request.width, "height": request.height},
        "type": request.type
    }


@router.post("/generate")
async def generate_stock_image(request: GenerateRequest) -> GenerateResponse:
    """
    Queue a new stock image generation via ComfyUI.
    
    This endpoint initiates an async generation job. Use the job_id
    to check status and retrieve the result.
    """
    manifest = load_manifest()
    
    # Validate category/subcategory
    cat_data = manifest.get("categories", {}).get(request.category)
    if not cat_data:
        raise HTTPException(status_code=404, detail=f"Category '{request.category}' not found")
    
    if request.subcategory not in cat_data.get("subcategories", {}):
        raise HTTPException(status_code=404, detail=f"Subcategory '{request.subcategory}' not found")
    
    # Get ComfyUI template for this category
    templates = manifest.get("comfyui_templates", {})
    template_key = request.category.rstrip("s")  # "characters" -> "character"
    template = templates.get(f"{template_key}_portrait") or templates.get(template_key)
    
    if not template:
        return GenerateResponse(
            success=False,
            message=f"No ComfyUI template configured for category '{request.category}'"
        )
    
    # Generate job ID
    import uuid
    job_id = f"stock-{uuid.uuid4().hex[:8]}"
    
    # In production, this would:
    # 1. Queue the job in a task queue (Celery, etc.)
    # 2. Call ComfyUI API with the appropriate workflow
    # 3. Store the result when complete
    
    # For now, return a placeholder response
    return GenerateResponse(
        success=True,
        job_id=job_id,
        message="Generation job queued. Use job_id to check status.",
        estimated_time=60  # Estimated seconds
    )


@router.get("/search")
async def search_assets(
    q: str = Query(..., description="Search query"),
    category: Optional[str] = None,
    limit: int = Query(20, ge=1, le=100)
) -> Dict[str, Any]:
    """Search for assets by name, tags, or description."""
    manifest = load_manifest()
    query_lower = q.lower()
    results = []
    
    for cat_id, cat_data in manifest.get("categories", {}).items():
        if category and cat_id != category:
            continue
        
        for subcat_id, subcat_data in cat_data.get("subcategories", {}).items():
            for asset in subcat_data.get("assets", []):
                # Search in name, tags, and description
                name_match = query_lower in asset.get("name", "").lower()
                tag_match = any(query_lower in tag.lower() for tag in asset.get("tags", []))
                desc_match = query_lower in asset.get("description", "").lower()
                
                if name_match or tag_match or desc_match:
                    results.append({
                        "asset": asset,
                        "category": cat_id,
                        "subcategory": subcat_id,
                        "url": f"/api/v1/stock-images/file/{cat_id}/{subcat_id}/{asset['filename']}"
                    })
                
                if len(results) >= limit:
                    break
    
    return {"query": q, "count": len(results), "results": results}


@router.get("/tags")
async def list_all_tags() -> Dict[str, Any]:
    """Get all unique tags used across assets."""
    manifest = load_manifest()
    tags_count: Dict[str, int] = {}
    
    for cat_data in manifest.get("categories", {}).values():
        for subcat_data in cat_data.get("subcategories", {}).values():
            for asset in subcat_data.get("assets", []):
                for tag in asset.get("tags", []):
                    tags_count[tag] = tags_count.get(tag, 0) + 1
    
    # Sort by count
    sorted_tags = sorted(tags_count.items(), key=lambda x: -x[1])
    
    return {
        "total_unique_tags": len(tags_count),
        "tags": [{"tag": t, "count": c} for t, c in sorted_tags]
    }


@router.get("/stats")
async def get_stats() -> Dict[str, Any]:
    """Get statistics about the stock image library."""
    manifest = load_manifest()
    
    total_assets = 0
    placeholder_count = 0
    generated_count = 0
    category_stats = {}
    
    for cat_id, cat_data in manifest.get("categories", {}).items():
        cat_total = 0
        for subcat_data in cat_data.get("subcategories", {}).values():
            for asset in subcat_data.get("assets", []):
                total_assets += 1
                cat_total += 1
                if asset.get("placeholder"):
                    placeholder_count += 1
                else:
                    generated_count += 1
        
        category_stats[cat_id] = {
            "total": cat_total,
            "subcategories": len(cat_data.get("subcategories", {}))
        }
    
    return {
        "version": manifest.get("version", "unknown"),
        "last_updated": manifest.get("last_updated", "unknown"),
        "total_assets": total_assets,
        "placeholder_count": placeholder_count,
        "generated_count": generated_count,
        "categories": category_stats
    }
