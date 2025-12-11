import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.ascii import router as ascii_router
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
app.include_router(ascii_router, prefix=settings.API_PREFIX, tags=["render"])


@app.get("/health")
def health():
    return {"status": "ok"}
