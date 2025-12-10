from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import boss_templates, characters, effect_modules, fate_cards, power_builder, simulations, techniques
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(title=settings.app_name, debug=settings.debug, openapi_url=f"{settings.api_prefix}/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(characters.router, prefix=settings.api_prefix)
app.include_router(techniques.router, prefix=settings.api_prefix)
app.include_router(fate_cards.router, prefix=settings.api_prefix)
app.include_router(effect_modules.router, prefix=settings.api_prefix)
app.include_router(boss_templates.router, prefix=settings.api_prefix)
app.include_router(simulations.router, prefix=settings.api_prefix)
app.include_router(power_builder.router, prefix=settings.api_prefix)


@app.get("/")
def healthcheck():
    return {"status": "ok"}
