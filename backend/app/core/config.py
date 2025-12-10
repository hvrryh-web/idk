from functools import lru_cache

from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    APP_NAME: str = Field("WuXuxian TTRPG", env="APP_NAME")
    API_PREFIX: str = Field("/api/v1", env="API_PREFIX")
    ENV: str = Field("dev", env="ENV")
    DATABASE_URL: str = Field(
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
