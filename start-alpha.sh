#!/bin/bash

# start-alpha.sh - Launch WuXuxian TTRPG Alpha Test
# This script starts all services needed for the alpha test

echo "============================================"
echo "🚀 WuXuxian TTRPG - Alpha Test Launcher"
echo "============================================"
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if port is in use
port_in_use() {
    lsof -i ":$1" >/dev/null 2>&1
}

# Check for required dependencies
echo -e "${BLUE}Checking dependencies...${NC}"

if ! command_exists docker; then
    echo -e "${RED}Error: docker is not installed${NC}"
    echo "Please install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command_exists python3; then
    echo -e "${RED}Error: python3 is not installed${NC}"
    exit 1
fi

if ! command_exists node; then
    echo -e "${RED}Error: node is not installed${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ All dependencies found${NC}"
echo ""

# Check if services are already running
echo -e "${BLUE}Checking for existing services...${NC}"

if port_in_use 5432; then
    echo -e "${YELLOW}⚠ Port 5432 is already in use (Postgres)${NC}"
    echo "If you want to restart, run ./stop-alpha.sh first"
fi

if port_in_use 8000; then
    echo -e "${YELLOW}⚠ Port 8000 is already in use (Backend)${NC}"
    echo "If you want to restart, run ./stop-alpha.sh first"
fi

if port_in_use 5173; then
    echo -e "${YELLOW}⚠ Port 5173 is already in use (Frontend)${NC}"
    echo "If you want to restart, run ./stop-alpha.sh first"
fi

echo ""

# Start PostgreSQL
echo -e "${BLUE}=== Starting PostgreSQL ===${NC}"
echo ""

cd infra
docker compose up -d
cd ..

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ PostgreSQL started${NC}"
else
    echo -e "${RED}✗ Failed to start PostgreSQL${NC}"
    exit 1
fi

# Wait for PostgreSQL to be ready
echo ""
echo -e "${BLUE}Waiting for PostgreSQL to be ready...${NC}"
for i in {1..30}; do
    if docker exec wuxuxian-db pg_isready -U postgres >/dev/null 2>&1; then
        echo -e "${GREEN}✓ PostgreSQL is ready${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}✗ PostgreSQL failed to start${NC}"
        exit 1
    fi
    echo -n "."
    sleep 1
done

echo ""

# Apply database schema
echo -e "${BLUE}=== Applying Database Schema ===${NC}"
echo ""

if [ -f "backend/schema.sql" ]; then
    PGPASSWORD=postgres psql -h localhost -U postgres -d wuxuxian -f backend/schema.sql >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Database schema applied${NC}"
    else
        echo -e "${YELLOW}⚠ Schema may already exist or psql not available${NC}"
    fi
else
    echo -e "${YELLOW}⚠ backend/schema.sql not found${NC}"
fi

echo ""

# Start Backend
echo -e "${BLUE}=== Starting Backend Server ===${NC}"
echo ""

cd backend

# Check if virtual environment exists, create if not
if [ ! -d ".venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
. .venv/bin/activate

# Install/update dependencies
echo "Installing backend dependencies..."
pip install -q -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/wuxuxian
ENV=development
EOF
fi

# Start backend in background
echo "Starting backend server on port 8000..."
nohup python -m uvicorn app.main:app --reload --port 8000 > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../logs/backend.pid

cd ..

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend server started (PID: $BACKEND_PID)${NC}"
    echo -e "  Log: logs/backend.log"
else
    echo -e "${RED}✗ Failed to start backend${NC}"
    exit 1
fi

echo ""

# Start Frontend
echo -e "${BLUE}=== Starting Frontend Dev Server ===${NC}"
echo ""

cd frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "Frontend dependencies already installed"
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
VITE_API_URL=http://localhost:8000
EOF
fi

# Start frontend in background
echo "Starting frontend dev server on port 5173..."
nohup npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../logs/frontend.pid

cd ..

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend dev server started (PID: $FRONTEND_PID)${NC}"
    echo -e "  Log: logs/frontend.log"
else
    echo -e "${RED}✗ Failed to start frontend${NC}"
    exit 1
fi

echo ""

# Wait for services to be ready
echo -e "${BLUE}Waiting for services to be ready...${NC}"
sleep 5

echo ""
echo "============================================"
echo -e "${GREEN}🎮 Alpha Test Ready!${NC}"
echo "============================================"
echo ""
echo -e "${BLUE}Access the application:${NC}"
echo -e "  Frontend:  ${GREEN}http://localhost:5173${NC}"
echo -e "  Backend:   ${GREEN}http://localhost:8000${NC}"
echo -e "  API Docs:  ${GREEN}http://localhost:8000/docs${NC}"
echo ""
echo -e "${BLUE}Logs:${NC}"
echo -e "  Backend:   logs/backend.log"
echo -e "  Frontend:  logs/frontend.log"
echo ""
echo -e "${YELLOW}To stop all services, run: ${NC}./stop-alpha.sh"
echo ""
