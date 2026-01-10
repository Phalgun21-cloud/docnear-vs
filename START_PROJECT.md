# 🚀 How to Start DocNear Project

## Quick Start Commands

### 1. Start Backend Server
```bash
cd healthcare-app/backend
npm start
```
**Runs on:** http://localhost:5001

### 2. Start Frontend Server (in a new terminal)
```bash
cd healthcare-app/frontend
npm run dev
```
**Runs on:** http://localhost:3000

---

## Complete Restart (Clean Start)

### Step 1: Stop All Running Processes
```bash
# Kill backend
pkill -f "node.*server.js"

# Kill frontend
pkill -f "vite"

# Or manually:
# Find process: lsof -ti:5001 or lsof -ti:3000
# Kill: kill -9 <PID>
```

### Step 2: Clear Logs (Optional)
```bash
rm -f /tmp/backend.log /tmp/frontend.log
```

### Step 3: Start Backend
```bash
cd healthcare-app/backend
PORT=5001 npm start
```

### Step 4: Start Frontend (New Terminal)
```bash
cd healthcare-app/frontend
npm run dev
```

---

## Verify Everything is Working

### Check Backend
```bash
curl http://localhost:5001/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Check Frontend
- Open browser: http://localhost:3000
- Should see the landing page

### Check Logs
```bash
# Backend logs
tail -f /tmp/backend.log

# Frontend logs  
tail -f /tmp/frontend.log
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find what's using the port
lsof -ti:5001  # Backend
lsof -ti:3000  # Frontend

# Kill the process
kill -9 <PID>
```

### MongoDB Connection Error
- Make sure MongoDB is running
- Check MONGO_URI in `.env` file
- Default: `mongodb://localhost:27017/docnear`

### Frontend Not Loading
- Check if backend is running
- Verify API proxy in `vite.config.ts`
- Check browser console for errors

---

## Environment Setup

### Backend `.env` Required Variables
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/docnear
JWT_SECRET=your-secret-key
EMAIL=rehansanadi007@gmail.com
EMAIL_PASS=fxnnsibogaztdham
GOOGLE_AI_KEY=your-google-ai-key
```

### Frontend `.env` (Optional)
```env
VITE_API_URL=http://localhost:5001/api
```

---

## Current Status

✅ **Backend**: Running on port 5001
✅ **Frontend**: Running on port 3000
✅ **Health Check**: http://localhost:5001/health
✅ **App URL**: http://localhost:3000

---

**Note**: Make sure MongoDB is running before starting the backend!
