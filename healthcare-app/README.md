# DocNear - Healthcare Appointment Booking System

A modern, production-ready healthcare appointment booking web application built with React, TypeScript, Node.js, and MongoDB.

## 🎯 Features

- **Dual User System**: Separate dashboards for Patients and Doctors
- **Authentication**: Secure signup, OTP verification, and login with JWT
- **Doctor Search**: Find doctors by specialty with AI-powered recommendations
- **Appointment Booking**: Easy appointment booking with status tracking
- **OTP System**: Email-based OTP for appointment verification
- **Real-time Updates**: Dynamic appointment status updates
- **Responsive Design**: Mobile-first, fully responsive UI
- **Modern UI/UX**: Clean, professional medical theme with animations

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Context API
- Framer Motion
- Radix UI

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Nodemailer for email
- Google Generative AI (optional)

## 📁 Project Structure

```
healthcare-app/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React Context (Auth)
│   │   ├── services/     # API services
│   │   └── routes/       # Route utilities
│   └── package.json
├── backend/           # Node.js backend API
│   ├── config/        # Database & external configs
│   ├── controllers/   # Route controllers
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   ├── utils/         # Utility functions
│   └── server.js      # Entry point
└── DEPLOYMENT.md      # Deployment guide
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Gmail account for OTP emails

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/docnear
   JWT_SECRET=your-secret-key-change-in-production
   EMAIL=your-email@gmail.com
   EMAIL_PASS=your-app-password
   GOOGLE_AI_KEY=your-google-ai-key
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start backend server:**
   ```bash
   npm start
   ```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

Frontend runs on `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Sign up (Patient/Doctor)
- `POST /api/auth/verify-otp` - Verify email OTP
- `POST /api/auth/login` - Login

### Doctors
- `GET /api/doctors/search?specialist=Cardiologist` - Search doctors
- `GET /api/doctors/:id` - Get doctor details

### Appointments
- `GET /api/appointments?userId=xxx&role=patient` - Get appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments/book` - Book appointment
- `POST /api/appointments/accept/:id` - Accept appointment (Doctor)

## 👥 User Roles

### Patient
- Sign up and verify email
- Search for doctors by specialty
- Book appointments
- View appointment status and OTP

### Doctor
- Sign up and verify email
- Manage appointment requests
- Accept appointments (generates OTP)
- View appointment statistics

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Email verification via OTP
- CORS protection
- Input validation
- Error handling

## 📱 Screenshots

*Add screenshots here when available*

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

**Backend:**
```bash
cd backend
npm install
# Configure .env
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run build
# Deploy dist/ folder to hosting service
```

## 🧪 Testing

### Test Signup Flow

1. Go to `/signup`
2. Select role (Patient/Doctor)
3. Fill in details
4. Verify OTP sent to email
5. Complete verification

### Test Login

1. Go to `/login`
2. Enter verified email and password
3. Redirects to appropriate dashboard

### Test Appointment Booking

1. Login as Patient
2. Search for doctors
3. Select doctor and time slot
4. Book appointment
5. Doctor accepts → OTP generated

## 🐛 Troubleshooting

**Backend won't start:**
- Check MongoDB is running
- Verify `.env` variables are correct
- Check port 5000 is available

**Frontend API errors:**
- Ensure backend is running
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS settings

**Email not sending:**
- Verify Gmail App Password
- Check 2-Step Verification is enabled
- Ensure `EMAIL` and `EMAIL_PASS` are correct

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/docnear
JWT_SECRET=your-secret-key
EMAIL=your-email@gmail.com
EMAIL_PASS=your-app-password
GOOGLE_AI_KEY=your-google-ai-key
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

Contributions welcome! Please follow standard Git workflow:

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

ISC

## 👨‍💻 Author

Built with ❤️ for healthcare

---

**Need help?** Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions.
