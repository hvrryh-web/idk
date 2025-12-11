"""Database models for ASCII art artifacts."""

from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, DateTime, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID

from app.models.base import Base


class ASCIIArtifact(Base):
    """Stores generated ASCII art with metadata."""

    __tablename__ = "ascii_artifacts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    content_hash = Column(String(16), unique=True, nullable=False, index=True)
    ascii_art = Column(Text, nullable=False)
    width = Column(Integer, nullable=False)
    height = Column(Integer, nullable=False)
    style = Column(String(50), nullable=False)
    preset_name = Column(String(100), nullable=False)
    use_color = Column(String(10), default="false")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<ASCIIArtifact(id={self.id}, style={self.style}, dimensions={self.width}x{self.height})>"
