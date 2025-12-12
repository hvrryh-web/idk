# Alpha Test Guide

## Overview

This guide explains how to launch and use the WuXuxian TTRPG alpha test environment.

## Prerequisites

Before starting the alpha test, ensure you have the following installed:

- **Docker** - For running PostgreSQL
  - Installation: https://docs.docker.com/get-docker/
  - Verify: `docker --version`

- **Python 3.8+** - For the backend
  - Verify: `python3 --version`

- **Node.js 16+** - For the frontend
  - Installation: https://nodejs.org/
  - Verify: `node --version` and `npm --version`

## Quick Start

### Starting the Alpha Test

```bash
# From the repository root
./start-alpha.sh
```

This script will:
1. ✅ Check for required dependencies
2. ✅ Start PostgreSQL in a Docker container
3. ✅ Apply the database schema
4. ✅ Set up Python virtual environment (if needed)
5. ✅ Install backend dependencies
6. ✅ Start the FastAPI backend server on port 8000
7. ✅ Install frontend dependencies (if needed)
8. ✅ Start the Vite dev server on port 5173

**Expected output:**
```
============================================
🎮 Alpha Test Ready!
============================================

Access the application:
  Frontend:  http://localhost:5173
  Backend:   http://localhost:8000
  API Docs:  http://localhost:8000/docs

Logs:
  Backend:   logs/backend.log
  Frontend:  logs/frontend.log
```

### Accessing the Application

Once the services are running, you can access:

- **Game Frontend**: http://localhost:5173
  - Multi-page visual novel UI
  - Character sheets, wiki, SRD book
  - Character management and combat simulations

- **API Documentation**: http://localhost:8000/docs
  - Interactive Swagger UI for testing API endpoints
  - Full OpenAPI specification

- **Alternative API Docs**: http://localhost:8000/redoc
  - ReDoc-based documentation

- **Landing Page**: Open `alpha-landing.html` in your browser
  - Static HTML landing page with instructions and links

### Stopping the Alpha Test

```bash
# From the repository root
./stop-alpha.sh
```

This script will:
1. ✅ Stop the frontend dev server
2. ✅ Stop the backend server
3. ✅ Stop PostgreSQL container
4. ✅ Clean up PID files

## Troubleshooting

### Port Already in Use

If you see warnings about ports already in use:
```
⚠ Port 5432 is already in use (Postgres)
⚠ Port 8000 is already in use (Backend)
⚠ Port 5173 is already in use (Frontend)
```

**Solution:** Run `./stop-alpha.sh` first to stop existing services, then run `./start-alpha.sh` again.

### PostgreSQL Not Starting

If PostgreSQL fails to start:
```bash
# Check Docker status
docker ps

# Check Docker logs
cd infra
docker compose logs

# Restart Docker if needed
docker compose down
docker compose up -d
```

### Backend Not Starting

If the backend fails to start:
```bash
# Check the backend log
cat logs/backend.log

# Manual start for debugging
cd backend
source .venv/bin/activate
python -m uvicorn app.main:app --reload --port 8000
```

### Frontend Not Starting

If the frontend fails to start:
```bash
# Check the frontend log
cat logs/frontend.log

# Manual start for debugging
cd frontend
npm run dev
```

### Database Schema Issues

If you need to reset the database:
```bash
# Stop services
./stop-alpha.sh

# Remove database volume
cd infra
docker compose down -v

# Start services (schema will be reapplied)
cd ..
./start-alpha.sh
```

## Log Files

All services write logs to the `logs/` directory:

- **Backend**: `logs/backend.log` - FastAPI server logs
- **Frontend**: `logs/frontend.log` - Vite dev server logs

To view logs in real-time:
```bash
# Backend logs
tail -f logs/backend.log

# Frontend logs
tail -f logs/frontend.log
```

## Manual Setup (Alternative)

If you prefer to start services manually:

### 1. Start PostgreSQL
```bash
cd infra
docker compose up -d
cd ..
```

### 2. Apply Database Schema
```bash
PGPASSWORD=postgres psql -h localhost -U postgres -d wuxuxian -f backend/schema.sql
```

### 3. Start Backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

### 4. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features Available in Alpha

### ✅ Multi-Page UI
- Game Room (landing page)
- Character sheets (Profile, Cultivation, Soul Core, Domain Source)
- Wiki with searchable articles
- Help page
- SRD book viewer
- Character manager
- Combat simulation interface

### ✅ Backend API
- Character CRUD operations
- Boss template management
- Combat simulation engine
- 1-beat and 3-stage combat modes
- Monte Carlo trial system

### ✅ Database
- PostgreSQL with full schema
- Character storage
- Simulation configuration and results
- Boss templates

### ✅ Development Tools
- Hot reload for backend (FastAPI)
- Hot reload for frontend (Vite)
- Interactive API documentation
- Automated testing (run with `./start-tests.sh`)

## Known Limitations

- **Alpha Status**: This is an early alpha test. Expect bugs and incomplete features.
- **Local Only**: The alpha test runs entirely on localhost.
- **No Authentication**: No user authentication system yet.
- **No Persistence**: Database data is stored in Docker volume, removed with `docker compose down -v`.

## Getting Help

- **Troubleshooting Guide**: See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md)
- **Security**: See [SECURITY.md](SECURITY.md)

## Next Steps

After trying the alpha test:
1. Explore the character creation system
2. Try running combat simulations
3. Browse the wiki and SRD content
4. Test the ASCII art generator (if running ASCII server)
5. Check the API documentation to understand available endpoints

## Feedback

Found a bug or have suggestions? Please:
1. Check existing issues on GitHub
2. Create a new issue with details
3. Include relevant log snippets from `logs/` directory
