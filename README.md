# WuXuxian stack

Backend and frontend playground for the WuXuxian TTRPG tools.

## Running with Docker Compose

```bash
docker-compose up --build
```

The stack exposes the FastAPI backend at http://localhost:8000 and Postgres on port 5432. The frontend dev server can be run separately (see below) and proxies API calls to the backend.

## Frontend (Vite + React)

```bash
cd frontend
npm install
npm run dev
```

This starts a small control panel for browsing characters, techniques, and firing off simulation runs against the API.

## Backend

See `backend/README.md` for Python/Postgres setup and API documentation.
