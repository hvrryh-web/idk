from functools import lru_cache

from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    app_name: str = Field("WuXuxian TTRPG", env="APP_NAME")
    api_prefix: str = Field("/api/v1", env="API_PREFIX")
    env: str = Field("dev", env="ENV")
    database_url: str = Field(
        "postgresql+psycopg2://postgres:postgres@localhost:5432/wuxuxian",
        env="DATABASE_URL",
    )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
