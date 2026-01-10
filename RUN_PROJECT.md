# 🚀 Run DocNear Project

## Quick Start (Easiest Way)

### Option 1: Use Startup Script
```bash
cd /Users/rehansanadi/docnear-vs
./start.sh
```

### Option 2: Manual Start

#### Terminal 1 - Backend
```bash
cd healthcare-app/backend
PORT=5001 npm start
```

#### Terminal 2 - Frontend
```bash
cd healthcare-app/frontend
npm run dev
```

---

## ✅ Current Status

- **Backend**: ✅ Running on http://localhost:5001
- **Frontend**: ✅ Running on http://localhost:3000
- **MongoDB**: ⚠️ Needs MONGO_URI in .env

---

## 🔧 Setup MongoDB (Required)

### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Add to `healthcare-app/backend/.env`:
   ```env
   MONGO_URI=mongodb://localhost:27017/docnear
   ```

### Option 2: MongoDB Atlas (Cloud)
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Add to `healthcare-app/backend/.env`:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/docnear
   ```

---

## 📋 Complete .env File

Your `healthcare-app/backend/.env` should have:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/docnear
JWT_SECRET=your-secret-key-change-in-production
EMAIL=rehansanadi007@gmail.com
EMAIL_PASS=fxnnsibogaztdham
GOOGLE_AI_KEY=AIzaSyCLnY_Cv0AE3i_kqQwzgmtw_ZPSuZnb5bM
NODE_ENV=development
```

---

## 🌐 Access Points

- **Frontend App**: http://localhost:3000
- **Backend API**: http://localhost:5001/api
- **Health Check**: http://localhost:5001/health

---

## 📊 Monitor Logs

```bash
# Backend logs
tail -f /tmp/backend.log

# Frontend logs
tail -f /tmp/frontend.log

# Both logs
tail -f /tmp/backend.log /tmp/frontend.log
```

---

## 🛑 Stop Servers

```bash
# Stop backend
pkill -f "node.*server.js"

# Stop frontend
pkill -f vite

# Stop both
pkill -f "node.*server.js" && pkill -f vite
```

---

## 🔄 Restart Everything

```bash
# Stop all
pkill -f "node.*server.js" && pkill -f vite

# Clear logs
rm -f /tmp/backend.log /tmp/frontend.log

# Start again
./start.sh
```

---

## ✅ Verify Everything Works

1. **Backend Health**: http://localhost:5001/health
   - Should return: `{"status":"ok","timestamp":"..."}`

2. **Frontend**: http://localhost:3000
   - Should show landing page

3. **API Test**: http://localhost:5001/api/doctors/search?specialist=Cardiologist
   - Should return: `{"success":true,"count":0,"doctors":[]}`

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process
lsof -ti:5001  # Backend
lsof -ti:3000  # Frontend

# Kill process
kill -9 <PID>
```

### MongoDB Connection Error
- Check if MongoDB is running
- Verify MONGO_URI in .env
- Check MongoDB logs

### Frontend Not Loading
- Check backend is running
- Check browser console for errors
- Verify Vite proxy configuration

---

**Last Updated**: $(date)
**Status**: 🟢 Ready to Run
