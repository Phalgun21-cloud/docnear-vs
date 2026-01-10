# DocNear - Deployment Guide

Complete guide to deploy the DocNear healthcare appointment booking application.

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud)
- Email account for OTP (Gmail recommended)
- Google AI API key (optional, for doctor recommendations)

## 🚀 Backend Deployment

### 1. Setup Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGO_URI=mongodb://localhost:27017/docnear
# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/docnear

# JWT Secret (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# Email Configuration (for OTP)
EMAIL=your-email@gmail.com
EMAIL_PASS=your-app-password
# For Gmail, generate App Password: https://myaccount.google.com/apppasswords

# Google AI Configuration (optional)
GOOGLE_AI_KEY=your-google-ai-api-key

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.com
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Start Backend Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

**With PM2 (recommended for production):**
```bash
npm install -g pm2
pm2 start server.js --name docnear-backend
pm2 save
pm2 startup
```

The backend will run on `http://localhost:5000` (or your configured PORT).

## 🎨 Frontend Deployment

### 1. Setup Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
# For production:
# VITE_API_URL=https://api.yourdomain.com/api
```

### 2. Install Dependencies

```bash
cd frontend
npm install
```

### 3. Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist` directory.

### 4. Preview Production Build (Optional)

```bash
npm run preview
```

### 5. Deploy Frontend

#### Option A: Static Hosting (Netlify, Vercel, etc.)

1. **Netlify:**
   - Drag and drop the `dist` folder to Netlify
   - Or connect your Git repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Vercel:**
   - Install Vercel CLI: `npm i -g vercel`
   - Run: `vercel --prod` in the frontend directory
   - Or connect via GitHub

#### Option B: Serve with Node.js

```bash
# Install serve
npm install -g serve

# Serve the build
serve -s dist -l 3000
```

#### Option C: Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🗄️ Database Setup

### MongoDB Local Installation

```bash
# macOS
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

## 📧 Email Configuration (Gmail)

1. Enable 2-Step Verification in Google Account
2. Generate App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "DocNear"
   - Copy the generated password
   - Use this password in `EMAIL_PASS`

## 🔐 Security Checklist

- [ ] Change `JWT_SECRET` to a strong random string (32+ characters)
- [ ] Set `NODE_ENV=production` in production
- [ ] Use HTTPS in production
- [ ] Configure CORS to only allow your frontend domain
- [ ] Use environment variables (never commit `.env`)
- [ ] Enable MongoDB authentication
- [ ] Use rate limiting (consider adding `express-rate-limit`)
- [ ] Validate all inputs server-side
- [ ] Use Helmet.js for security headers (optional)

## 🧪 Testing the Deployment

### Backend Health Check

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-10T..."
}
```

### Test API Endpoints

1. **Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test@123",
    "role": "patient"
  }'
```

2. **Verify OTP:**
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456"
  }'
```

3. **Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

## 📝 API Endpoints Summary

### Authentication
- `POST /api/auth/signup` - User/Doctor signup
- `POST /api/auth/verify-otp` - Verify email OTP
- `POST /api/auth/login` - Login

### Doctors
- `GET /api/doctors/search?specialist=Cardiologist` - Search doctors
- `GET /api/doctors/:id` - Get doctor by ID

### Appointments
- `GET /api/appointments?userId=xxx&role=patient` - Get appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments/book` - Book appointment
- `POST /api/appointments/accept/:id` - Accept appointment (doctor)

## 🐛 Troubleshooting

### Backend Issues

1. **MongoDB Connection Failed:**
   - Check MongoDB is running
   - Verify `MONGO_URI` in `.env`
   - Check network/firewall settings

2. **Port Already in Use:**
   - Change `PORT` in `.env`
   - Or kill process: `lsof -ti:5000 | xargs kill`

3. **Email Not Sending:**
   - Verify `EMAIL` and `EMAIL_PASS` in `.env`
   - Check Gmail App Password is correct
   - Ensure 2-Step Verification is enabled

### Frontend Issues

1. **API Connection Failed:**
   - Verify `VITE_API_URL` in `.env`
   - Check CORS settings in backend
   - Ensure backend is running

2. **Build Errors:**
   - Clear `node_modules` and reinstall
   - Check Node.js version (18+)
   - Verify all dependencies are installed

## 🚀 Quick Start

```bash
# Terminal 1 - Backend
cd backend
npm install
cp .env.example .env  # Edit .env with your values
npm start

# Terminal 2 - Frontend
cd frontend
npm install
cp .env.example .env  # Edit .env with API URL
npm run dev
```

Visit `http://localhost:3000` in your browser!

## 📦 Production Deployment

For production, consider:
- Use PM2 or systemd for process management
- Set up reverse proxy (Nginx/Apache)
- Enable SSL/TLS certificates (Let's Encrypt)
- Set up monitoring (PM2 Plus, Sentry, etc.)
- Configure backups for MongoDB
- Set up CI/CD pipeline

## 📄 License

ISC
