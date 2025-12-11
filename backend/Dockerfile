FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
# Uninstall any pre-installed pydantic (from base image or cache)
RUN pip uninstall -y pydantic || true
# Install all requirements (may re-install pydantic v2)
RUN pip install --no-cache-dir -r requirements.txt
# Force install pydantic v1.10.14
RUN pip install --no-cache-dir pydantic==1.10.14
# Verify installed pydantic version
RUN pip list | grep pydantic

COPY ./app ./app
COPY openapi.yaml schema.sql ./

ENV PORT=8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
