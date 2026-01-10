#!/bin/bash

# DocNear - Full Project Startup Script

echo "🚀 Starting DocNear Project..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

# Stop existing processes
echo "🛑 Stopping existing processes..."
pkill -f "node.*server.js" 2>/dev/null
pkill -f "vite" 2>/dev/null
sleep 2

# Clear logs
echo "🧹 Clearing logs..."
rm -f /tmp/backend.log /tmp/frontend.log

# Check MongoDB URI
if [ -z "$MONGO_URI" ]; then
    if [ -f "healthcare-app/backend/.env" ]; then
        if ! grep -q "MONGO_URI" healthcare-app/backend/.env; then
            echo -e "${YELLOW}⚠️  MONGO_URI not found in .env file${NC}"
            echo "   Add this to healthcare-app/backend/.env:"
            echo "   MONGO_URI=mongodb://localhost:27017/docnear"
            echo ""
        fi
    fi
fi

# Start Backend
echo "🔧 Starting Backend Server..."
cd healthcare-app/backend
if check_port 5001; then
    echo -e "${RED}❌ Port 5001 is already in use${NC}"
else
    PORT=5001 npm start > /tmp/backend.log 2>&1 &
    BACKEND_PID=$!
    echo "   Backend PID: $BACKEND_PID"
    sleep 3
    
    # Check if backend started
    if curl -s http://localhost:5001/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend running on http://localhost:5001${NC}"
    else
        echo -e "${RED}❌ Backend failed to start. Check /tmp/backend.log${NC}"
    fi
fi

# Start Frontend
echo ""
echo "🎨 Starting Frontend Server..."
cd ../frontend
if check_port 3000; then
    echo -e "${RED}❌ Port 3000 is already in use${NC}"
else
    npm run dev > /tmp/frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo "   Frontend PID: $FRONTEND_PID"
    sleep 5
    
    # Check if frontend started
    if check_port 3000; then
        echo -e "${GREEN}✅ Frontend running on http://localhost:3000${NC}"
    else
        echo -e "${RED}❌ Frontend failed to start. Check /tmp/frontend.log${NC}"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Project Started!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 Access your app:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5001"
echo ""
echo "📋 View logs:"
echo "   Backend:  tail -f /tmp/backend.log"
echo "   Frontend: tail -f /tmp/frontend.log"
echo ""
echo "🛑 Stop servers:"
echo "   pkill -f 'node.*server.js'  # Backend"
echo "   pkill -f vite               # Frontend"
echo ""
