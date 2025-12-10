#!/bin/bash

# stop-tests.sh - Stop automated tests and clean up test processes
# This script terminates any running test processes and cleans up temporary test files

echo "============================================"
echo "WuXuxian TTRPG - Stop Test Runner"
echo "============================================"
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Checking for running test processes...${NC}"

# Find and kill any pytest processes
PYTEST_PIDS=$(pgrep -f "pytest" || true)
if [ ! -z "$PYTEST_PIDS" ]; then
    echo -e "${YELLOW}Found pytest processes: $PYTEST_PIDS${NC}"
    echo "Stopping pytest processes..."
    kill $PYTEST_PIDS 2>/dev/null || true
    sleep 1
    # Force kill if still running
    kill -9 $PYTEST_PIDS 2>/dev/null || true
    echo -e "${GREEN}✓ Pytest processes stopped${NC}"
else
    echo "No pytest processes found"
fi

# Find and kill any vitest/node test processes
VITEST_PIDS=$(pgrep -f "vitest" || true)
if [ ! -z "$VITEST_PIDS" ]; then
    echo -e "${YELLOW}Found vitest processes: $VITEST_PIDS${NC}"
    echo "Stopping vitest processes..."
    kill $VITEST_PIDS 2>/dev/null || true
    sleep 1
    # Force kill if still running
    kill -9 $VITEST_PIDS 2>/dev/null || true
    echo -e "${GREEN}✓ Vitest processes stopped${NC}"
else
    echo "No vitest processes found"
fi

# Clean up temporary test files
echo ""
echo -e "${BLUE}Cleaning up temporary test files...${NC}"

# Clean up backend test database
if [ -f "backend/test.db" ]; then
    echo "Removing backend test database..."
    rm -f backend/test.db
    echo -e "${GREEN}✓ Backend test database removed${NC}"
fi

# Clean up Python cache
if [ -d "backend/tests/__pycache__" ]; then
    echo "Removing Python cache..."
    rm -rf backend/tests/__pycache__
    rm -rf backend/.pytest_cache
    echo -e "${GREEN}✓ Python cache removed${NC}"
fi

echo ""
echo -e "${GREEN}Test processes stopped and cleanup complete!${NC}"
echo ""
