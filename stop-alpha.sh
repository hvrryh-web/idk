#!/bin/bash

# stop-alpha.sh - Stop WuXuxian TTRPG Alpha Test
# This script stops all services running for the alpha test

echo "============================================"
echo "🛑 WuXuxian TTRPG - Stop Alpha Test"
echo "============================================"
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Stopping Alpha Test services...${NC}"
echo ""

# Stop Frontend
if [ -f "logs/frontend.pid" ]; then
    FRONTEND_PID=$(cat logs/frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo -e "${BLUE}Stopping Frontend (PID: $FRONTEND_PID)...${NC}"
        kill $FRONTEND_PID 2>/dev/null || true
        sleep 2
        # Force kill if still running
        if ps -p $FRONTEND_PID > /dev/null 2>&1; then
            kill -9 $FRONTEND_PID 2>/dev/null || true
        fi
        echo -e "${GREEN}✓ Frontend stopped${NC}"
    else
        echo -e "${YELLOW}Frontend not running${NC}"
    fi
    rm -f logs/frontend.pid
else
    echo -e "${YELLOW}Frontend PID file not found${NC}"
fi

# Also kill any remaining vite processes
VITE_PIDS=$(pgrep -f "vite" || true)
if [ ! -z "$VITE_PIDS" ]; then
    echo -e "${BLUE}Stopping remaining Vite processes...${NC}"
    kill $VITE_PIDS 2>/dev/null || true
    sleep 1
    kill -9 $VITE_PIDS 2>/dev/null || true
    echo -e "${GREEN}✓ Vite processes stopped${NC}"
fi

echo ""

# Stop Backend
if [ -f "logs/backend.pid" ]; then
    BACKEND_PID=$(cat logs/backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo -e "${BLUE}Stopping Backend (PID: $BACKEND_PID)...${NC}"
        kill $BACKEND_PID 2>/dev/null || true
        sleep 2
        # Force kill if still running
        if ps -p $BACKEND_PID > /dev/null 2>&1; then
            kill -9 $BACKEND_PID 2>/dev/null || true
        fi
        echo -e "${GREEN}✓ Backend stopped${NC}"
    else
        echo -e "${YELLOW}Backend not running${NC}"
    fi
    rm -f logs/backend.pid
else
    echo -e "${YELLOW}Backend PID file not found${NC}"
fi

# Also kill any remaining uvicorn processes
UVICORN_PIDS=$(pgrep -f "uvicorn" || true)
if [ ! -z "$UVICORN_PIDS" ]; then
    echo -e "${BLUE}Stopping remaining Uvicorn processes...${NC}"
    kill $UVICORN_PIDS 2>/dev/null || true
    sleep 1
    kill -9 $UVICORN_PIDS 2>/dev/null || true
    echo -e "${GREEN}✓ Uvicorn processes stopped${NC}"
fi

echo ""

# Stop PostgreSQL
echo -e "${BLUE}Stopping PostgreSQL...${NC}"

if [ ! -d "infra" ]; then
    echo -e "${YELLOW}⚠ infra directory not found${NC}"
else
    pushd infra > /dev/null
    docker compose down
    popd > /dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ PostgreSQL stopped${NC}"
    else
        echo -e "${YELLOW}⚠ Failed to stop PostgreSQL or it wasn't running${NC}"
    fi
fi

echo ""
echo "============================================"
echo -e "${GREEN}✓ All services stopped${NC}"
echo "============================================"
echo ""
echo -e "${BLUE}To start the alpha test again, run: ${NC}./start-alpha.sh"
echo ""
