import os
import json
from datetime import datetime, timedelta
# Directory for error logs
ERROR_LOG_DIR = "error_logs"
os.makedirs(ERROR_LOG_DIR, exist_ok=True)

def cleanup_old_error_logs():
    now = datetime.utcnow()
    for fname in os.listdir(ERROR_LOG_DIR):
        fpath = os.path.join(ERROR_LOG_DIR, fname)
        try:
            mtime = datetime.utcfromtimestamp(os.path.getmtime(fpath))
            if now - mtime > timedelta(hours=48):
                os.remove(fpath)
        except Exception:
            pass

# API endpoint for error reporting
@app.post("/report-error")
async def report_error(payload: dict):
    cleanup_old_error_logs()
    ts = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
    fname = f"error_{ts}.json"
    fpath = os.path.join(ERROR_LOG_DIR, fname)
    with open(fpath, "w") as f:
        json.dump(payload, f, indent=2)
    return {"status": "logged", "file": fname}
from fastapi import Response
from starlette.middleware.base import BaseHTTPMiddleware
import threading

# Rolling error log (thread-safe)
recent_errors = []
recent_errors_lock = threading.Lock()

def log_error(error):
    with recent_errors_lock:
        recent_errors.append(error)
        if len(recent_errors) > 20:
            recent_errors.pop(0)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    tb = traceback.format_exc()
    logging.error(f"Exception: {exc}\nTraceback: {tb}")
    log_error({"url": str(request.url), "error": str(exc), "traceback": tb})
    return JSONResponse(status_code=500, content={"detail": str(exc), "traceback": tb})

# Request/response logging middleware
class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        logging.info(f"Request: {request.method} {request.url}")
        response: Response = await call_next(request)
        logging.info(f"Response: {response.status_code} {request.url}")
        return response

app.add_middleware(LoggingMiddleware)

# Endpoint to get recent errors
@app.get("/recent-errors")
def recent_errors_endpoint():
    with recent_errors_lock:
        return {"recent_errors": recent_errors[-20:]}
from sqlalchemy import text
from app.db.session import SessionLocal
# Endpoint to check database connectivity
@app.get("/db-status")
def db_status():
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        return {"db_status": "ok"}
    except Exception as e:
        return {"db_status": "error", "detail": str(e)}

# Endpoint to list all registered routes
@app.get("/routes")
def list_routes():
    return {"routes": [route.path for route in app.routes]}
# Add global exception handler for logging
from fastapi import Request
from fastapi.responses import JSONResponse
import traceback

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    tb = traceback.format_exc()
    logging.error(f"Exception: {exc}\nTraceback: {tb}")
    return JSONResponse(status_code=500, content={"detail": str(exc), "traceback": tb})

# Debug endpoint for server status and recent errors
@app.get("/debug")
def debug():
    return {
        "status": "WuXuxian backend running",
        "api_prefix": settings.API_PREFIX,
        "env": settings.ENV,
        "database_url": settings.DATABASE_URL
    }
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.ascii_art import router as ascii_art_router
from app.api.routes.boss_templates import router as boss_templates_router
from app.api.routes.characters import router as characters_router
from app.api.routes.combat import router as combat_router
from app.api.routes.ascii_render import router as ascii_router
from app.api.routes.simulations import router as simulations_router
from app.api.routes.techniques import router as techniques_router
from app.core.config import settings

logging.basicConfig(level=logging.INFO)

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ascii_router, prefix=f"{settings.API_PREFIX}")
app.include_router(characters_router, prefix=settings.API_PREFIX)
app.include_router(boss_templates_router, prefix=settings.API_PREFIX)
app.include_router(combat_router, prefix=f"{settings.API_PREFIX}/combat", tags=["combat"])
app.include_router(simulations_router, prefix=settings.API_PREFIX)
app.include_router(techniques_router, prefix=settings.API_PREFIX)
app.include_router(ascii_art_router, prefix=settings.API_PREFIX)



# Root endpoint for easier server status checking
@app.get("/")
def root():
    return {"status": "WuXuxian backend running", "api_prefix": settings.API_PREFIX}

@app.get("/health")
def health():
    return {"status": "ok"}
