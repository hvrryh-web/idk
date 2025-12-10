from functools import lru_cache

from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    api_prefix: str = "/api/v1"
    app_name: str = "WuXuxian TTRPG API"
    debug: bool = False

    database_url: str = Field(
        "postgresql+psycopg2://postgres:postgres@localhost:5432/wuxuxian",
        env="DATABASE_URL",
    )

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()
