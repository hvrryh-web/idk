#!/bin/bash
# Test Me - Quick test script for WuXuxian TTRPG Backend
# This script starts the FastAPI backend for testing

set -e

echo "🚀 Starting WuXuxian TTRPG Backend Test Server..."
echo "================================================"
echo ""

# Check if we're in the backend directory
if [ ! -f "app/main.py" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source .venv/bin/activate

# Install dependencies if needed
if ! python -c "import fastapi" 2>/dev/null; then
    echo "📥 Installing dependencies..."
    pip install -q -r requirements.txt
fi

# Set database URL (using SQLite for quick testing if no PostgreSQL)
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  No DATABASE_URL set, using SQLite for testing..."
    export DATABASE_URL="sqlite:///./test.db"
fi

echo ""
echo "✅ Environment ready!"
echo ""
echo "📡 Starting FastAPI server..."
echo "   - API Documentation: http://localhost:8000/docs"
echo "   - Health Check: http://localhost:8000/health"
echo "   - Characters API: http://localhost:8000/api/v1/characters"
echo ""
echo "Press Ctrl+C to stop the server"
echo "================================================"
echo ""

# Start the server
uvicorn app.main:app --reload --port 8000
