#!/bin/bash

# start-tests.sh - Start automated tests for WuXuxian TTRPG webapp
# This script runs tests for both backend and frontend components

echo "============================================"
echo "WuXuxian TTRPG - Automated Test Runner"
echo "============================================"
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required dependencies
echo -e "${BLUE}Checking dependencies...${NC}"

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

# Backend Tests
echo -e "${BLUE}=== Running Backend Tests ===${NC}"
echo ""

cd backend

# Check if virtual environment exists, create if not
if [ ! -d ".venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Install/update dependencies
echo "Installing backend dependencies..."
pip install -q -r requirements.txt

# Run pytest
echo ""
echo "Running backend tests..."
python -m pytest tests/ -v

BACKEND_EXIT_CODE=$?

# Deactivate virtual environment
deactivate

cd ..

echo ""

# Frontend Tests
echo -e "${BLUE}=== Running Frontend Tests ===${NC}"
echo ""

cd frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "Frontend dependencies already installed"
fi

# Run vitest
echo ""
echo "Running frontend tests..."
npm test

FRONTEND_EXIT_CODE=$?

cd ..

# Summary
echo ""
echo "============================================"
echo -e "${BLUE}Test Summary${NC}"
echo "============================================"

if [ $BACKEND_EXIT_CODE -eq 0 ]; then
    echo -e "Backend Tests:  ${GREEN}PASSED${NC}"
else
    echo -e "Backend Tests:  ${RED}FAILED${NC}"
fi

if [ $FRONTEND_EXIT_CODE -eq 0 ]; then
    echo -e "Frontend Tests: ${GREEN}PASSED${NC}"
else
    echo -e "Frontend Tests: ${RED}FAILED${NC}"
fi

echo ""

# Exit with error if any tests failed
if [ $BACKEND_EXIT_CODE -ne 0 ] || [ $FRONTEND_EXIT_CODE -ne 0 ]; then
    echo -e "${RED}Some tests failed!${NC}"
    exit 1
else
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
fi
