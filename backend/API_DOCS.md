# Backend API Documentation

## Swagger/OpenAPI
- FastAPI auto-generates Swagger UI at `/docs` and ReDoc at `/redoc`.
- The OpenAPI spec is defined in `backend/openapi.yaml`.

## Example Requests/Responses
Add example payloads to `openapi.yaml` for each endpoint:

```yaml
paths:
  /characters:
    post:
      requestBody:
        content:
          application/json:
            example:
              name: "Li Mu"
              scl: 3
              stats: { str: 8, dex: 7, ... }
      responses:
        '201':
          description: Character created
          content:
            application/json:
              example:
                id: 1
                name: "Li Mu"
                scl: 3
                stats: { str: 8, dex: 7, ... }
```

## Error Schemas
Standardize error responses using Pydantic models:

```python
class APIError(BaseModel):
    detail: str
    code: int
```

Document error formats in `backend/README.md` and ensure endpoints return structured errors.
