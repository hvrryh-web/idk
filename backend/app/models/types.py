"""Custom column types for database compatibility."""
from sqlalchemy import JSON, String, TypeDecorator
from sqlalchemy.dialects.postgresql import JSONB as PostgresJSONB
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID


class JSONType(TypeDecorator):
    """Platform-independent JSON type.

    Uses JSONB on PostgreSQL, JSON elsewhere.
    """
    impl = JSON
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(PostgresJSONB())
        else:
            return dialect.type_descriptor(JSON())


class UUIDType(TypeDecorator):
    """Platform-independent UUID type.

    Uses UUID on PostgreSQL, String(36) elsewhere.
    """
    impl = String(36)
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(PostgresUUID(as_uuid=True))
        else:
            return dialect.type_descriptor(String(36))

    def process_bind_param(self, value, dialect):
        """Convert UUID to string for non-PostgreSQL databases."""
        if value is None:
            return value
        if dialect.name == 'postgresql':
            return value
        return str(value)

    def process_result_value(self, value, dialect):
        """Convert string back to UUID for non-PostgreSQL databases."""
        if value is None:
            return value
        if dialect.name == 'postgresql':
            return value
        import uuid
        return uuid.UUID(value) if isinstance(value, str) else value
