"""
ComfyUI API Routes

Endpoints for character generation, face transposition, and image retrieval.
"""

import json
import os
import uuid
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, BackgroundTasks, Depends, File, HTTPException, UploadFile, WebSocket, WebSocketDisconnect, status
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.config import settings
from app.services.comfyui_client import (
    ComfyUIClient,
    GenerationJob,
    GenerationStatus,
    get_comfyui_client,
)

router = APIRouter(prefix="/comfyui", tags=["comfyui"])


# Request/Response Models

class CharacterGenerationRequest(BaseModel):
    """Request for full 7-layer character generation."""
    character_id: str = Field(..., description="Character UUID")
    base_prompt: str = Field(..., description="Base character description")
    pillar_emphasis: Optional[str] = Field(None, description="violence, influence, or revelation")
    scl_level: int = Field(1, ge=1, le=10, description="Soul Cultivation Level")
    face_reference: Optional[str] = Field(None, description="Face embedding ID to apply")
    skin_tone: Optional[str] = Field("fair", description="Character skin tone")
    hair_color: Optional[str] = Field("black", description="Character hair color")
    clothing_colors: Optional[str] = Field("white and blue", description="Clothing color scheme")


class PosesSheetRequest(BaseModel):
    """Request for character poses sheet generation."""
    character_id: str = Field(..., description="Character UUID")
    face_embedding_id: Optional[str] = Field(None, description="Face embedding to apply")
    base_prompt: str = Field(..., description="Base character description")


class OutfitsSheetRequest(BaseModel):
    """Request for character outfits sheet generation."""
    character_id: str = Field(..., description="Character UUID")
    face_embedding_id: Optional[str] = Field(None, description="Face embedding to apply")
    base_prompt: str = Field(..., description="Base character description")
    scl_level: int = Field(1, ge=1, le=10, description="Soul Cultivation Level for outfit styling")


class CharacterSheetRequest(BaseModel):
    """Request for full composite character sheet."""
    character_id: str = Field(..., description="Character UUID")
    include_stats: bool = Field(True, description="Include stats overlay zone")


class FaceApplyRequest(BaseModel):
    """Request to apply face to existing generation."""
    generation_id: str = Field(..., description="Generation job ID")
    embedding_id: str = Field(..., description="Face embedding ID")


class GenerationResponse(BaseModel):
    """Response for generation requests."""
    job_id: str
    estimated_time: Optional[int] = Field(None, description="Estimated time in seconds")


class FaceExtractionResponse(BaseModel):
    """Response for face extraction."""
    embedding_id: str
    preview_url: str


class JobStatusResponse(BaseModel):
    """Response for job status check."""
    job_id: str
    status: str
    current_layer: Optional[int] = None
    total_layers: Optional[int] = None
    progress_percent: float = 0.0
    eta: Optional[int] = None
    error_message: Optional[str] = None


class HealthCheckResponse(BaseModel):
    """Response for ComfyUI health check."""
    status: str
    comfyui_available: bool
    message: Optional[str] = None


# Helper functions

def get_pillar_effects(pillar: str, scl: int) -> str:
    """Get pillar effect prompt addition based on pillar and SCL."""
    pillar_prompts = {
        "violence": "red flame aura, fiery energy, combat qi, martial power",
        "influence": "blue ethereal glow, commanding presence, social qi",
        "revelation": "green mystical symbols, enlightened aura, insight qi",
    }
    
    intensity = "subtle" if scl <= 3 else "moderate" if scl <= 6 else "powerful" if scl <= 9 else "overwhelming"
    base_effect = pillar_prompts.get(pillar, "")
    
    if base_effect:
        return f"{intensity} {base_effect}"
    return ""


def get_scl_modifier(scl: int) -> str:
    """Get SCL-based quality modifier for outfits."""
    if scl <= 3:
        return "simple, plain, humble, basic quality"
    elif scl <= 6:
        return "quality, well-made, respectable"
    elif scl <= 9:
        return "elaborate, ornate, prestigious, fine materials"
    else:
        return "legendary, divine, transcendent, celestial"


def build_7layer_workflow(request: CharacterGenerationRequest) -> dict:
    """Build the 7-layer workflow with request parameters."""
    # Load workflow template
    workflow_path = Path(__file__).parent.parent.parent.parent.parent / "tools" / "comfyui" / "workflows" / "character_7layer_pipeline.json"
    
    try:
        with open(workflow_path, "r") as f:
            workflow_template = json.load(f)
    except FileNotFoundError:
        # Return a simple workflow structure if template not found
        workflow_template = {"layers": {}}
    
    # Build positive prompt
    pillar_effects = get_pillar_effects(request.pillar_emphasis or "", request.scl_level)
    
    prompt = f"{request.base_prompt}, {request.skin_tone} skin, {request.hair_color} hair, {request.clothing_colors} clothing"
    if pillar_effects:
        prompt += f", {pillar_effects}"
    
    # Simplified workflow for ComfyUI API
    # In production, this would be a proper ComfyUI workflow_api format
    workflow = {
        "1": {
            "class_type": "CheckpointLoaderSimple",
            "inputs": {
                "ckpt_name": os.getenv("COMFYUI_CHECKPOINT", "anythingV5.safetensors")
            }
        },
        "2": {
            "class_type": "CLIPTextEncode",
            "inputs": {
                "text": f"{prompt}, masterpiece, best quality, wuxia manhwa style",
                "clip": ["1", 1]
            }
        },
        "3": {
            "class_type": "CLIPTextEncode",
            "inputs": {
                "text": "lowres, bad anatomy, bad hands, missing fingers, worst quality, low quality, blurry",
                "clip": ["1", 1]
            }
        },
        "4": {
            "class_type": "EmptyLatentImage",
            "inputs": {
                "width": 512,
                "height": 768,
                "batch_size": 1
            }
        },
        "5": {
            "class_type": "KSampler",
            "inputs": {
                "seed": hash(request.character_id) % 2147483647,
                "steps": 28,
                "cfg": 7.5,
                "sampler_name": "dpmpp_2m",
                "scheduler": "karras",
                "denoise": 1.0,
                "model": ["1", 0],
                "positive": ["2", 0],
                "negative": ["3", 0],
                "latent_image": ["4", 0]
            }
        },
        "6": {
            "class_type": "VAEDecode",
            "inputs": {
                "samples": ["5", 0],
                "vae": ["1", 2]
            }
        },
        "7": {
            "class_type": "SaveImage",
            "inputs": {
                "filename_prefix": f"character_{request.character_id}",
                "images": ["6", 0]
            }
        }
    }
    
    return workflow


# Endpoints

@router.get("/health", response_model=HealthCheckResponse)
async def check_comfyui_health():
    """Check if ComfyUI server is available and responding."""
    client = get_comfyui_client()
    is_available = await client.check_health()
    
    return HealthCheckResponse(
        status="ok" if is_available else "unavailable",
        comfyui_available=is_available,
        message=None if is_available else "ComfyUI server is not responding"
    )


@router.post("/generate/character", response_model=GenerationResponse)
async def generate_character(
    request: CharacterGenerationRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """
    Start full 7-layer character generation.
    
    Returns a job ID that can be used to track progress.
    """
    client = get_comfyui_client()
    
    # Check ComfyUI availability
    if not await client.check_health():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ComfyUI service is not available"
        )
    
    # Build workflow
    workflow = build_7layer_workflow(request)
    
    # Create job
    job_id = str(uuid.uuid4())
    
    # Start generation in background
    async def run_generation():
        await client.generate_character(
            workflow=workflow,
            character_id=request.character_id,
        )
    
    background_tasks.add_task(run_generation)
    
    # Estimate time based on SCL (higher SCL = more effects = longer time)
    base_time = 120  # 2 minutes base
    scl_factor = request.scl_level * 10
    estimated_time = base_time + scl_factor
    
    return GenerationResponse(
        job_id=job_id,
        estimated_time=estimated_time
    )


@router.post("/generate/poses-sheet", response_model=GenerationResponse)
async def generate_poses_sheet(
    request: PosesSheetRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Generate a 3x3 poses sheet for a character."""
    client = get_comfyui_client()
    
    if not await client.check_health():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ComfyUI service is not available"
        )
    
    job_id = str(uuid.uuid4())
    
    # In a full implementation, this would:
    # 1. Generate 9 individual poses
    # 2. Composite them into a grid
    # 3. Optionally apply face embedding
    
    return GenerationResponse(
        job_id=job_id,
        estimated_time=300  # ~5 minutes for 9 poses
    )


@router.post("/generate/outfits-sheet", response_model=GenerationResponse)
async def generate_outfits_sheet(
    request: OutfitsSheetRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Generate a 2x3 outfits sheet for a character."""
    client = get_comfyui_client()
    
    if not await client.check_health():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ComfyUI service is not available"
        )
    
    job_id = str(uuid.uuid4())
    
    scl_modifier = get_scl_modifier(request.scl_level)
    
    return GenerationResponse(
        job_id=job_id,
        estimated_time=240  # ~4 minutes for 6 outfits
    )


@router.post("/generate/character-sheet", response_model=GenerationResponse)
async def generate_character_sheet(
    request: CharacterSheetRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Generate a full composite character sheet."""
    client = get_comfyui_client()
    
    if not await client.check_health():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ComfyUI service is not available"
        )
    
    job_id = str(uuid.uuid4())
    
    return GenerationResponse(
        job_id=job_id,
        estimated_time=600  # ~10 minutes for full sheet
    )


@router.post("/face/extract", response_model=FaceExtractionResponse)
async def extract_face(
    image: UploadFile = File(..., description="Reference image for face extraction"),
    character_id: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    Extract face embedding from an uploaded image.
    
    The embedding can be reused to maintain face consistency across generations.
    """
    client = get_comfyui_client()
    
    if not await client.check_health():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ComfyUI service is not available"
        )
    
    # Validate file type
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image"
        )
    
    # Save uploaded file
    embedding_id = str(uuid.uuid4())
    upload_dir = Path(settings.GENERATION_OUTPUT_DIR) / "face_references"
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    file_path = upload_dir / f"{embedding_id}.png"
    content = await image.read()
    
    with open(file_path, "wb") as f:
        f.write(content)
    
    # In a full implementation:
    # 1. Run InsightFace extraction workflow
    # 2. Save embedding to database
    # 3. Return preview URL
    
    preview_url = f"/api/v1/comfyui/face/preview/{embedding_id}"
    
    return FaceExtractionResponse(
        embedding_id=embedding_id,
        preview_url=preview_url
    )


@router.post("/face/apply", response_model=GenerationResponse)
async def apply_face(
    request: FaceApplyRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Apply a saved face embedding to an existing generation."""
    client = get_comfyui_client()
    
    if not await client.check_health():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ComfyUI service is not available"
        )
    
    job_id = str(uuid.uuid4())
    
    return GenerationResponse(
        job_id=job_id,
        estimated_time=60  # ~1 minute for face swap
    )


@router.get("/face/preview/{embedding_id}")
async def get_face_preview(embedding_id: str):
    """Get preview image for a face embedding."""
    file_path = Path(settings.GENERATION_OUTPUT_DIR) / "face_references" / f"{embedding_id}.png"
    
    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Face embedding not found"
        )
    
    return FileResponse(file_path, media_type="image/png")


@router.get("/status/{job_id}", response_model=JobStatusResponse)
async def get_job_status(job_id: str):
    """Check the status of a generation job."""
    client = get_comfyui_client()
    job = await client.get_job_status(job_id)
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Calculate ETA based on progress
    eta = None
    if job.status == GenerationStatus.PROCESSING and job.progress_percent < 100:
        remaining_percent = 100 - job.progress_percent
        eta = int(remaining_percent * 2)  # Rough estimate: 2 seconds per percent
    
    return JobStatusResponse(
        job_id=job.id,
        status=job.status.value,
        current_layer=job.current_layer,
        total_layers=job.total_layers,
        progress_percent=job.progress_percent,
        eta=eta,
        error_message=job.error_message
    )


@router.delete("/job/{job_id}")
async def cancel_job(job_id: str):
    """Cancel a running generation job."""
    client = get_comfyui_client()
    success = await client.cancel_job(job_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not cancel job. It may have already completed or not exist."
        )
    
    return {"status": "cancelled", "job_id": job_id}


@router.get("/download/{job_id}")
async def download_generation(
    job_id: str,
    layer: Optional[str] = None,
):
    """
    Download generated images from a completed job.
    
    If layer is specified, returns that specific layer.
    Otherwise, returns the final output.
    """
    client = get_comfyui_client()
    job = await client.get_job_status(job_id)
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    if job.status != GenerationStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Job is not completed. Current status: {job.status.value}"
        )
    
    # Get the requested layer or final output
    if layer:
        filename = job.layer_outputs.get(layer)
        if not filename:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Layer '{layer}' not found in outputs"
            )
    else:
        # Get the final layer output
        filename = job.layer_outputs.get("final") or job.layer_outputs.get("layer7_final")
        if not filename:
            # Fallback to any available output
            outputs = list(job.layer_outputs.values())
            if not outputs:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No outputs available"
                )
            filename = outputs[-1]
    
    # Download from ComfyUI
    image_data = await client.download_image(filename)
    
    if not image_data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to download image from ComfyUI"
        )
    
    return StreamingResponse(
        iter([image_data]),
        media_type="image/png",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.websocket("/progress/{job_id}")
async def websocket_progress(websocket: WebSocket, job_id: str):
    """
    WebSocket endpoint for real-time progress updates.
    
    Sends progress messages in the format:
    {
        "type": "progress",
        "job_id": "...",
        "current_layer": 3,
        "total_layers": 7,
        "progress_percent": 42.8,
        "status": "processing"
    }
    """
    await websocket.accept()
    client = get_comfyui_client()
    
    try:
        while True:
            job = await client.get_job_status(job_id)
            
            if not job:
                await websocket.send_json({
                    "type": "error",
                    "message": "Job not found"
                })
                break
            
            await websocket.send_json({
                "type": "progress",
                "job_id": job.id,
                "current_layer": job.current_layer,
                "total_layers": job.total_layers,
                "progress_percent": job.progress_percent,
                "status": job.status.value,
                "error_message": job.error_message
            })
            
            if job.status in (GenerationStatus.COMPLETED, GenerationStatus.FAILED):
                await websocket.send_json({
                    "type": "complete" if job.status == GenerationStatus.COMPLETED else "error",
                    "job_id": job.id,
                    "layer_outputs": job.layer_outputs if job.status == GenerationStatus.COMPLETED else None,
                    "error_message": job.error_message
                })
                break
            
            # Wait before next update
            await asyncio.sleep(2)
            
    except WebSocketDisconnect:
        pass
    except Exception as e:
        try:
            await websocket.send_json({
                "type": "error",
                "message": str(e)
            })
        except:
            pass
    finally:
        try:
            await websocket.close()
        except:
            pass


# Need to import asyncio for the websocket
import asyncio
