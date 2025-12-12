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

    # ComfyUI Configuration
    COMFYUI_ENABLED: bool = Field(False, env="COMFYUI_ENABLED")
    COMFYUI_URL: str = Field("http://127.0.0.1:8188", env="COMFYUI_URL")
    COMFYUI_TIMEOUT: int = Field(300, env="COMFYUI_TIMEOUT")
    COMFYUI_OUTPUT_DIR: str = Field("outputs/comfyui", env="COMFYUI_OUTPUT_DIR")

    # Asset Generation Limits
    ASSET_MAX_VARIANTS: int = Field(10, env="ASSET_MAX_VARIANTS")
    ASSET_MAX_NAME_LENGTH: int = Field(100, env="ASSET_MAX_NAME_LENGTH")
    ASSET_MAX_DESCRIPTION_LENGTH: int = Field(1000, env="ASSET_MAX_DESCRIPTION_LENGTH")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
