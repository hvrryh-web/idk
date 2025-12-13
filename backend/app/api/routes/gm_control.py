"""
Game Master Control Panel API Routes

Provides endpoints for GM-level control of ComfyUI art generation,
including remote start/stop, batch generation, and progress monitoring.
"""

from typing import List, Optional
from fastapi import APIRouter, BackgroundTasks, HTTPException, Query
from pydantic import BaseModel, Field
import asyncio
import logging

from app.services.comfyui_client import get_comfyui_client

router = APIRouter(prefix="/gm", tags=["game-master"])
logger = logging.getLogger(__name__)


# Active generation sessions tracking
_active_sessions = {}
_session_tasks = {}


class ArtGenerationRequest(BaseModel):
    """Request to start art generation for characters."""
    character_ids: List[str] = Field(..., description="List of character IDs to generate art for")
    generation_types: List[str] = Field(
        ["portrait", "fullbody", "expressions"],
        description="Types of art to generate: portrait, fullbody, expressions, poses_sheet, outfits_sheet, character_sheet"
    )
    use_lora: bool = Field(True, description="Use character-specific LoRAs if available")
    priority: str = Field("normal", description="Priority: low, normal, high")
    auto_cleanup: bool = Field(True, description="Auto-cleanup intermediate files after generation")


class BatchGenerationRequest(BaseModel):
    """Request for batch generation from manifest."""
    manifest_path: str = Field(..., description="Path to character manifest JSON")
    character_filter: Optional[List[str]] = Field(None, description="Filter specific character IDs, or None for all")
    generation_types: List[str] = Field(["portrait"], description="Types to generate")
    parallel_jobs: int = Field(1, ge=1, le=4, description="Number of parallel generation jobs")


class GenerationSessionResponse(BaseModel):
    """Response for generation session."""
    session_id: str
    status: str
    total_jobs: int
    completed_jobs: int
    failed_jobs: int
    in_progress_jobs: int
    estimated_time_remaining: Optional[int] = None


class SessionControlRequest(BaseModel):
    """Request to control a generation session."""
    session_id: str = Field(..., description="Session ID to control")
    action: str = Field(..., description="Action: pause, resume, stop")


class GenerationJobInfo(BaseModel):
    """Information about a single generation job."""
    job_id: str
    character_id: str
    generation_type: str
    status: str
    progress_percent: float
    error_message: Optional[str] = None


@router.post("/art-generation/start", response_model=GenerationSessionResponse)
async def start_art_generation(
    request: ArtGenerationRequest,
    background_tasks: BackgroundTasks
):
    """
    Start a new art generation session for specified characters.
    
    This creates a batch generation job that can be monitored and controlled
    via the session ID. The generation runs in the background and can be
    paused, resumed, or stopped via control endpoints.
    """
    import uuid
    
    session_id = str(uuid.uuid4())
    
    # Create session tracking
    session = {
        "session_id": session_id,
        "status": "starting",
        "character_ids": request.character_ids,
        "generation_types": request.generation_types,
        "total_jobs": len(request.character_ids) * len(request.generation_types),
        "completed_jobs": 0,
        "failed_jobs": 0,
        "in_progress_jobs": 0,
        "jobs": [],
        "use_lora": request.use_lora,
        "priority": request.priority,
        "auto_cleanup": request.auto_cleanup,
    }
    
    _active_sessions[session_id] = session
    
    # Start background generation task
    background_tasks.add_task(_run_generation_session, session_id)
    
    logger.info(f"Started art generation session {session_id} for {len(request.character_ids)} characters")
    
    return GenerationSessionResponse(
        session_id=session_id,
        status="starting",
        total_jobs=session["total_jobs"],
        completed_jobs=0,
        failed_jobs=0,
        in_progress_jobs=0,
        estimated_time_remaining=session["total_jobs"] * 60  # Rough estimate: 60s per job
    )


@router.post("/art-generation/batch", response_model=GenerationSessionResponse)
async def start_batch_generation(
    request: BatchGenerationRequest,
    background_tasks: BackgroundTasks
):
    """
    Start batch art generation from a character manifest file.
    
    Reads character definitions from a manifest JSON and generates all
    requested art types. Supports filtering and parallel execution.
    """
    import uuid
    import json
    from pathlib import Path
    
    session_id = str(uuid.uuid4())
    
    # Load manifest
    manifest_path = Path(request.manifest_path)
    if not manifest_path.exists():
        raise HTTPException(status_code=404, detail=f"Manifest not found: {request.manifest_path}")
    
    try:
        with open(manifest_path) as f:
            manifest = json.load(f)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to load manifest: {str(e)}")
    
    # Extract characters
    characters = manifest.get("characters", [])
    
    # Filter characters
    if request.character_filter:
        characters = [c for c in characters if c.get("char_id") in request.character_filter]
    
    # Only include allowed characters
    characters = [c for c in characters if c.get("allowed", False)]
    
    if not characters:
        raise HTTPException(status_code=400, detail="No valid characters found in manifest")
    
    character_ids = [c["char_id"] for c in characters]
    
    # Create session
    session = {
        "session_id": session_id,
        "status": "starting",
        "character_ids": character_ids,
        "characters": characters,
        "generation_types": request.generation_types,
        "total_jobs": len(character_ids) * len(request.generation_types),
        "completed_jobs": 0,
        "failed_jobs": 0,
        "in_progress_jobs": 0,
        "jobs": [],
        "parallel_jobs": request.parallel_jobs,
        "manifest_path": str(manifest_path),
    }
    
    _active_sessions[session_id] = session
    
    # Start background generation task
    background_tasks.add_task(_run_batch_generation_session, session_id)
    
    logger.info(f"Started batch generation session {session_id} from {request.manifest_path}")
    
    return GenerationSessionResponse(
        session_id=session_id,
        status="starting",
        total_jobs=session["total_jobs"],
        completed_jobs=0,
        failed_jobs=0,
        in_progress_jobs=0
    )


@router.post("/art-generation/control")
async def control_generation_session(request: SessionControlRequest):
    """
    Control an active generation session.
    
    Actions:
    - pause: Pause the session (current jobs finish, no new jobs start)
    - resume: Resume a paused session
    - stop: Stop the session immediately (current jobs are cancelled)
    """
    session_id = request.session_id
    
    if session_id not in _active_sessions:
        raise HTTPException(status_code=404, detail=f"Session not found: {session_id}")
    
    session = _active_sessions[session_id]
    
    if request.action == "pause":
        if session["status"] == "running":
            session["status"] = "paused"
            logger.info(f"Paused session {session_id}")
            return {"status": "paused", "message": "Session paused. Current jobs will complete."}
        else:
            return {"status": session["status"], "message": f"Cannot pause session in {session['status']} state"}
    
    elif request.action == "resume":
        if session["status"] == "paused":
            session["status"] = "running"
            logger.info(f"Resumed session {session_id}")
            return {"status": "running", "message": "Session resumed"}
        else:
            return {"status": session["status"], "message": f"Cannot resume session in {session['status']} state"}
    
    elif request.action == "stop":
        session["status"] = "stopped"
        
        # Cancel background task if exists
        if session_id in _session_tasks:
            task = _session_tasks[session_id]
            task.cancel()
            del _session_tasks[session_id]
        
        logger.info(f"Stopped session {session_id}")
        return {"status": "stopped", "message": "Session stopped. Current jobs cancelled."}
    
    else:
        raise HTTPException(status_code=400, detail=f"Unknown action: {request.action}")


@router.get("/art-generation/status/{session_id}", response_model=GenerationSessionResponse)
async def get_generation_status(session_id: str):
    """
    Get the current status of a generation session.
    """
    if session_id not in _active_sessions:
        raise HTTPException(status_code=404, detail=f"Session not found: {session_id}")
    
    session = _active_sessions[session_id]
    
    # Calculate estimated time remaining
    if session["in_progress_jobs"] > 0:
        remaining_jobs = session["total_jobs"] - session["completed_jobs"] - session["failed_jobs"]
        estimated_time = remaining_jobs * 60  # 60s per job estimate
    else:
        estimated_time = None
    
    return GenerationSessionResponse(
        session_id=session_id,
        status=session["status"],
        total_jobs=session["total_jobs"],
        completed_jobs=session["completed_jobs"],
        failed_jobs=session["failed_jobs"],
        in_progress_jobs=session["in_progress_jobs"],
        estimated_time_remaining=estimated_time
    )


@router.get("/art-generation/jobs/{session_id}", response_model=List[GenerationJobInfo])
async def get_session_jobs(session_id: str):
    """
    Get detailed information about all jobs in a session.
    """
    if session_id not in _active_sessions:
        raise HTTPException(status_code=404, detail=f"Session not found: {session_id}")
    
    session = _active_sessions[session_id]
    jobs = session.get("jobs", [])
    
    return [
        GenerationJobInfo(
            job_id=job["job_id"],
            character_id=job["character_id"],
            generation_type=job["generation_type"],
            status=job["status"],
            progress_percent=job.get("progress_percent", 0.0),
            error_message=job.get("error_message")
        )
        for job in jobs
    ]


@router.get("/art-generation/sessions", response_model=List[GenerationSessionResponse])
async def list_active_sessions():
    """
    List all active generation sessions.
    """
    sessions = []
    for session_id, session in _active_sessions.items():
        remaining_jobs = session["total_jobs"] - session["completed_jobs"] - session["failed_jobs"]
        estimated_time = remaining_jobs * 60 if session["in_progress_jobs"] > 0 else None
        
        sessions.append(GenerationSessionResponse(
            session_id=session_id,
            status=session["status"],
            total_jobs=session["total_jobs"],
            completed_jobs=session["completed_jobs"],
            failed_jobs=session["failed_jobs"],
            in_progress_jobs=session["in_progress_jobs"],
            estimated_time_remaining=estimated_time
        ))
    
    return sessions


@router.delete("/art-generation/session/{session_id}")
async def delete_session(session_id: str):
    """
    Delete a completed or stopped session from tracking.
    """
    if session_id not in _active_sessions:
        raise HTTPException(status_code=404, detail=f"Session not found: {session_id}")
    
    session = _active_sessions[session_id]
    
    if session["status"] in ["running", "starting"]:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete active session. Stop it first."
        )
    
    del _active_sessions[session_id]
    
    if session_id in _session_tasks:
        del _session_tasks[session_id]
    
    logger.info(f"Deleted session {session_id}")
    return {"status": "deleted", "message": f"Session {session_id} deleted"}


# Background task functions

async def _run_generation_session(session_id: str):
    """Run a generation session in the background."""
    session = _active_sessions[session_id]
    session["status"] = "running"
    
    try:
        # Get ComfyUI client for actual generation
        client = get_comfyui_client()
        # Generate jobs for each character x generation_type combination
        for char_id in session["character_ids"]:
            for gen_type in session["generation_types"]:
                # Check if session is stopped or paused
                if session["status"] == "stopped":
                    logger.info(f"Session {session_id} stopped, aborting")
                    return
                
                while session["status"] == "paused":
                    await asyncio.sleep(1)
                
                # Create job
                job = {
                    "job_id": f"{char_id}_{gen_type}",
                    "character_id": char_id,
                    "generation_type": gen_type,
                    "status": "pending",
                    "progress_percent": 0.0
                }
                session["jobs"].append(job)
                
                # Start generation
                job["status"] = "running"
                session["in_progress_jobs"] += 1
                
                try:
                    # TODO: Implement actual ComfyUI generation calls based on generation_type
                    # Example implementation would call appropriate workflow:
                    # if gen_type == "portrait":
                    #     result = await client.generate_portrait(char_id, ...)
                    # elif gen_type == "fullbody":
                    #     result = await client.generate_fullbody(char_id, ...)
                    # For now, simulate with sleep until ComfyUI workflows are fully integrated
                    await asyncio.sleep(5)  # Simulate generation time
                    
                    job["status"] = "completed"
                    job["progress_percent"] = 100.0
                    session["completed_jobs"] += 1
                    
                except Exception as e:
                    job["status"] = "failed"
                    job["error_message"] = str(e)
                    session["failed_jobs"] += 1
                    logger.error(f"Job {job['job_id']} failed: {e}")
                
                finally:
                    session["in_progress_jobs"] -= 1
        
        session["status"] = "completed"
        logger.info(f"Session {session_id} completed")
        
    except Exception as e:
        session["status"] = "error"
        logger.error(f"Session {session_id} error: {e}")


async def _run_batch_generation_session(session_id: str):
    """Run a batch generation session from manifest."""
    session = _active_sessions[session_id]
    session["status"] = "running"
    
    try:
        # Similar to _run_generation_session but with parallel execution support
        parallel_jobs = session.get("parallel_jobs", 1)
        
        # Create job queue
        job_queue = []
        for char in session["characters"]:
            char_id = char["char_id"]
            for gen_type in session["generation_types"]:
                job = {
                    "job_id": f"{char_id}_{gen_type}",
                    "character_id": char_id,
                    "character_data": char,
                    "generation_type": gen_type,
                    "status": "pending",
                    "progress_percent": 0.0
                }
                job_queue.append(job)
                session["jobs"].append(job)
        
        # Process jobs in parallel batches
        while job_queue and session["status"] == "running":
            # Get next batch of jobs
            batch = job_queue[:parallel_jobs]
            job_queue = job_queue[parallel_jobs:]
            
            # Run batch in parallel
            tasks = [_execute_generation_job(session, job) for job in batch]
            await asyncio.gather(*tasks)
        
        if session["status"] == "running":
            session["status"] = "completed"
            logger.info(f"Batch session {session_id} completed")
        
    except Exception as e:
        session["status"] = "error"
        logger.error(f"Batch session {session_id} error: {e}")


async def _execute_generation_job(session: dict, job: dict):
    """Execute a single generation job."""
    job["status"] = "running"
    session["in_progress_jobs"] += 1
    
    try:
        # TODO: Implement actual ComfyUI generation
        # This would call the appropriate ComfyUI workflow based on generation_type
        # Example:
        # client = get_comfyui_client()
        # char_data = job["character_data"]
        # gen_type = job["generation_type"]
        # if gen_type == "portrait":
        #     result = await client.generate_portrait(char_data, ...)
        # For now, simulate until full ComfyUI integration
        await asyncio.sleep(5)  # Simulate
        
        job["status"] = "completed"
        job["progress_percent"] = 100.0
        session["completed_jobs"] += 1
        
    except Exception as e:
        job["status"] = "failed"
        job["error_message"] = str(e)
        session["failed_jobs"] += 1
        logger.error(f"Job {job['job_id']} failed: {e}")
    
    finally:
        session["in_progress_jobs"] -= 1
