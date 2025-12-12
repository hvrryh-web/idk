from functools import lru_cache
import os

try:
    from pydantic_settings import BaseSettings
    from pydantic import Field
except ImportError:
    from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    APP_NAME: str = Field("WuXuxian TTRPG", env="APP_NAME")
    API_PREFIX: str = Field("/api/v1", env="API_PREFIX")
    ENV: str = Field("dev", env="ENV")
    DATABASE_URL: str = Field(
        "postgresql+psycopg2://postgres:postgres@localhost:5432/wuxuxian",
        env="DATABASE_URL",
    )
    
    # ComfyUI settings
    COMFYUI_URL: str = Field(
        os.getenv("COMFYUI_URL", "http://localhost:8188"),
        env="COMFYUI_URL",
    )
    COMFYUI_TIMEOUT: int = Field(
        int(os.getenv("COMFYUI_TIMEOUT", "600")),
        env="COMFYUI_TIMEOUT",
    )
    COMFYUI_POLLING_INTERVAL: int = Field(
        int(os.getenv("COMFYUI_POLLING_INTERVAL", "2")),
        env="COMFYUI_POLLING_INTERVAL",
    )
    GENERATION_OUTPUT_DIR: str = Field(
        os.getenv("GENERATION_OUTPUT_DIR", "/app/generated"),
        env="GENERATION_OUTPUT_DIR",
    )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
