# Troubleshooting Guide

Common issues and their solutions for the WuXuxian TTRPG webapp.

## Table of Contents
- [Database Issues](#database-issues)
- [Backend Issues](#backend-issues)
- [Frontend Issues](#frontend-issues)
- [Docker Issues](#docker-issues)
- [Testing Issues](#testing-issues)

## Database Issues

### Cannot connect to PostgreSQL

**Symptoms:**
```
sqlalchemy.exc.OperationalError: could not connect to server
```

**Solutions:**

1. **Check if PostgreSQL is running:**
   ```bash
   cd infra
   docker-compose ps
   ```

2. **Verify the container is healthy:**
   ```bash
   docker-compose logs db
   ```

3. **Ensure correct connection string:**
   ```bash
   # In backend/.env
   DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/wuxuxian
   ```

4. **Check port availability:**
   ```bash
   lsof -i :5432  # Unix/Mac
   netstat -an | findstr 5432  # Windows
   ```

5. **Restart the database:**
   ```bash
   cd infra
   docker-compose down
   docker-compose up -d
   ```

### Schema not applied

**Symptoms:**
```
sqlalchemy.exc.ProgrammingError: relation "characters" does not exist
```

**Solution:**
```bash
# Apply the schema
psql postgresql://postgres:postgres@localhost:5432/wuxuxian -f backend/schema.sql

# Or recreate the database completely
cd infra
docker-compose down -v  # -v removes volumes
docker-compose up -d
psql postgresql://postgres:postgres@localhost:5432/wuxuxian -f ../backend/schema.sql
```

### Permission denied for database

**Symptoms:**
```
FATAL: role "user" does not exist
```

**Solution:**
Ensure you're using the correct credentials from `infra/docker-compose.yml`:
- Username: `postgres`
- Password: `postgres`
- Database: `wuxuxian`

## Backend Issues

### Module not found errors

**Symptoms:**
```
ModuleNotFoundError: No module named 'fastapi'
```

**Solutions:**

1. **Activate virtual environment:**
   ```bash
   cd backend
   source .venv/bin/activate  # Unix/Mac
   .venv\Scripts\activate  # Windows
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Recreate virtual environment if corrupted:**
   ```bash
   rm -rf .venv
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

### Import errors within app

**Symptoms:**
```
ImportError: attempted relative import with no known parent package
```

**Solution:**
Always run uvicorn from the `backend` directory:
```bash
cd backend
uvicorn app.main:app --reload
```

### CORS errors

**Symptoms:**
```
Access to fetch at 'http://localhost:8000/api/v1/characters' from origin 
'http://localhost:5173' has been blocked by CORS policy
```

**Solution:**
1. Ensure the frontend URL is in the CORS origins list in `backend/app/main.py`
2. The default allows `http://localhost:5173`
3. If using a different port, update the CORS middleware configuration

### Port already in use

**Symptoms:**
```
ERROR: [Errno 48] Address already in use
```

**Solution:**
```bash
# Find and kill the process using port 8000
lsof -ti:8000 | xargs kill  # Unix/Mac
netstat -ano | findstr :8000  # Windows (note the PID, then taskkill /PID <pid>)

# Or use a different port
uvicorn app.main:app --reload --port 8001
```

## Frontend Issues

### Node modules not found

**Symptoms:**
```
Error: Cannot find module 'react'
```

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Vite build fails

**Symptoms:**
```
error during build
```

**Solutions:**

1. **Clear cache:**
   ```bash
   cd frontend
   rm -rf node_modules/.vite
   npm run build
   ```

2. **Check TypeScript errors:**
   ```bash
   npx tsc --noEmit
   ```

3. **Update dependencies:**
   ```bash
   npm update
   ```

### Cannot connect to backend API

**Symptoms:**
- Network errors in browser console
- Failed fetch requests

**Solutions:**

1. **Verify backend is running:**
   ```bash
   curl http://localhost:8000/health
   # Should return: {"status":"ok"}
   ```

2. **Check API URL in frontend:**
   - Default is `http://localhost:8000`
   - Update in `frontend/src/App.tsx` if needed

3. **Disable browser extensions:**
   - Ad blockers or privacy extensions may interfere
   - Try in incognito/private mode

### Hot reload not working

**Symptoms:**
- Changes not reflected automatically
- Need to refresh manually

**Solution:**
```bash
# Stop dev server and restart
cd frontend
npm run dev
```

If issue persists:
```bash
rm -rf node_modules/.vite
npm run dev
```

## Docker Issues

### Docker daemon not running

**Symptoms:**
```
Cannot connect to the Docker daemon
```

**Solution:**
Start Docker Desktop or the Docker service:
```bash
# Linux
sudo systemctl start docker

# macOS/Windows
# Start Docker Desktop application
```

### Container build fails

**Symptoms:**
```
ERROR [internal] load metadata for...
```

**Solutions:**

1. **Clear Docker build cache:**
   ```bash
   docker builder prune
   ```

2. **Rebuild without cache:**
   ```bash
   docker-compose build --no-cache
   ```

3. **Check Dockerfile syntax:**
   - Ensure all COPY paths are correct
   - Verify base images are available

### Container exits immediately

**Symptoms:**
```
Exited (1) X seconds ago
```

**Solution:**
Check container logs:
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

### Port conflicts

**Symptoms:**
```
Bind for 0.0.0.0:5432 failed: port is already allocated
```

**Solution:**
```bash
# Option 1: Stop conflicting service
docker ps  # Find container using the port
docker stop <container_id>

# Option 2: Change port in docker-compose.yml
# Change "5432:5432" to "5433:5432" for database
```

## Testing Issues

### Tests fail with database errors

**Symptoms:**
```
pytest tests fail with connection errors
```

**Solution:**
Backend tests use SQLite by default (test.db). If seeing PostgreSQL errors:

1. Check `tests/conftest.py` for database setup
2. Ensure test database URL is set correctly
3. Tests should not require PostgreSQL running

### Frontend tests have warnings

**Symptoms:**
```
Warning: An update to App inside a test was not wrapped in act(...)
```

**Solution:**
These are warnings, not errors. Tests still pass. To fix:
```typescript
import { act } from '@testing-library/react';

await act(async () => {
  // Code that updates state
});
```

### Import errors in tests

**Symptoms:**
```
ModuleNotFoundError in tests
```

**Solution:**
```bash
# Backend
cd backend
source .venv/bin/activate
pip install pytest pytest-asyncio httpx

# Frontend
cd frontend
npm install
```

### Tests hang indefinitely

**Symptoms:**
- Test runner doesn't complete
- No output for extended time

**Solution:**
```bash
# Kill hanging processes
./stop-tests.sh

# Run tests again
./start-tests.sh
```

## Performance Issues

### Backend slow to respond

**Possible causes:**
1. Database not indexed properly
2. Too many records without pagination
3. N+1 query problems

**Solutions:**
1. Check `schema.sql` for indexes
2. Add pagination to list endpoints
3. Use `joinedload()` in SQLAlchemy queries

### Frontend slow to load

**Possible causes:**
1. Large bundle size
2. Unnecessary re-renders
3. Unoptimized images

**Solutions:**
1. Use code splitting
2. Memoize components with `React.memo()`
3. Optimize assets and enable lazy loading

## Development Environment Issues

### Python version mismatch

**Symptoms:**
```
This package requires Python >=3.12
```

**Solution:**
```bash
# Check Python version
python --version

# Install Python 3.12 from python.org or use pyenv
pyenv install 3.12
pyenv local 3.12
```

### Node version mismatch

**Symptoms:**
```
Error: The engine "node" is incompatible
```

**Solution:**
```bash
# Check Node version
node --version

# Install Node 18 from nodejs.org or use nvm
nvm install 18
nvm use 18
```

## Still Having Issues?

If your issue isn't covered here:

1. **Check logs:**
   ```bash
   # Backend
   cd backend
   uvicorn app.main:app --reload --log-level debug
   
   # Docker
   docker-compose logs -f
   ```

2. **Search existing issues:**
   - Check the GitHub issues page
   - Search for error messages

3. **Ask for help:**
   - Open a new issue with:
     - Clear description of the problem
     - Steps to reproduce
     - Error messages
     - System information (OS, Python/Node version)
     - What you've already tried

4. **Review documentation:**
   - [README.md](README.md) - Setup and usage
   - [CONTRIBUTING.md](CONTRIBUTING.md) - Development workflow
   - [ARCHITECTURE.md](ARCHITECTURE.md) - System design
   - [SECURITY.md](SECURITY.md) - Security guidelines
