from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.boss_templates import router as boss_templates_router
from app.api.routes.characters import router as characters_router
from app.api.routes.effect_modules import router as effect_modules_router
from app.api.routes.fate_cards import (
    body_cards_router,
    death_cards_router,
    seed_cards_router,
)
from app.api.routes.simulations import router as simulations_router
from app.api.routes.techniques import router as techniques_router
from app.core.config import settings

app = FastAPI(title=settings.APP_NAME, version="0.3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(characters_router, prefix=settings.API_PREFIX)
app.include_router(techniques_router, prefix=settings.API_PREFIX)
app.include_router(death_cards_router, prefix=settings.API_PREFIX)
app.include_router(body_cards_router, prefix=settings.API_PREFIX)
app.include_router(seed_cards_router, prefix=settings.API_PREFIX)
app.include_router(effect_modules_router, prefix=settings.API_PREFIX)
app.include_router(boss_templates_router, prefix=settings.API_PREFIX)
app.include_router(simulations_router, prefix=settings.API_PREFIX)


@app.get("/health")
def health():
    return {"status": "ok"}
