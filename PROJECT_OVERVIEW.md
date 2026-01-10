# DocNear - Complete Project Overview

## 🏥 Project Summary

**DocNear** is a full-stack healthcare appointment booking platform with AI-powered doctor recommendations, location-based search, and role-based dashboards for patients and doctors.

---

## 📁 Project Structure

```
healthcare-app/
├── backend/                 # Node.js/Express Backend
│   ├── config/             # Configuration files
│   │   ├── db.js          # MongoDB connection
│   │   └── googleai.js    # Google AI setup
│   ├── controllers/       # Business logic
│   │   ├── authcontroller.js
│   │   ├── doctorcontroller.js
│   │   └── appointmentcontroller.js
│   ├── middleware/         # Express middleware
│   │   └── auth.js        # JWT authentication
│   ├── models/            # Mongoose schemas
│   │   ├── patient.js
│   │   ├── doctor.js
│   │   └── appointment.js
│   ├── routes/            # API routes
│   │   ├── authroutes.js
│   │   ├── doctorroutes.js
│   │   └── appointmentroutes.js
│   ├── utils/             # Utility functions
│   │   ├── mailer.js     # Email sending (Nodemailer)
│   │   └── otp.js        # OTP generation
│   ├── server.js          # Main server file
│   └── package.json
│
└── frontend/              # React/TypeScript Frontend
    ├── src/
    │   ├── components/    # Reusable components
    │   │   ├── Navbar.tsx
    │   │   ├── Footer.tsx
    │   │   ├── DoctorCard.tsx
    │   │   └── ui/        # Shadcn/UI components
    │   ├── pages/         # Page components
    │   │   ├── Landing.tsx
    │   │   ├── Login.tsx
    │   │   ├── Signup.tsx
    │   │   ├── VerifyOtp.tsx
    │   │   ├── Dashboard.tsx (Patient)
    │   │   ├── DoctorDashboard.tsx
    │   │   ├── SearchDoctors.tsx
    │   │   ├── DoctorProfile.tsx
    │   │   └── Appointments.tsx
    │   ├── context/       # React Context
    │   │   └── AuthContext.tsx
    │   ├── routes/        # Route protection
    │   │   └── PrivateRoute.tsx
    │   ├── services/      # API services
    │   │   └── api.ts
    │   ├── lib/           # Utilities
    │   │   └── utils.ts
    │   ├── App.tsx        # Main app component
    │   ├── main.tsx       # Entry point
    │   └── index.css      # Global styles
    ├── tailwind.config.js
    ├── vite.config.ts
    └── package.json
```

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB (Mongoose 9.1.2)
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Password Hashing**: bcryptjs 3.0.3
- **Email**: Nodemailer 7.0.12
- **AI**: Google Generative AI (@google/generative-ai 0.24.1)
- **CORS**: cors 2.8.5
- **Environment**: dotenv 17.2.3

### Frontend
- **Framework**: React 18.2.0
- **Language**: TypeScript 5.2.2
- **Build Tool**: Vite 7.3.1
- **Routing**: React Router DOM 6.20.1
- **Styling**: Tailwind CSS 3.3.6
- **UI Components**: Radix UI + Shadcn/UI
- **Animations**: Framer Motion 10.16.16
- **Icons**: Lucide React 0.303.0
- **HTTP Client**: Axios 1.6.2
- **Forms**: React Hook Form 7.49.2
- **Utilities**: clsx, tailwind-merge, class-variance-authority

---

## 🎯 Core Features

### 1. Authentication System
- ✅ Role-based signup (Patient/Doctor)
- ✅ Email verification with OTP
- ✅ JWT-based authentication
- ✅ Protected routes with role checking
- ✅ Auto-redirect based on user role

### 2. Doctor Search & Discovery
- ✅ Search by specialty
- ✅ Location-based search (Geolocation API)
- ✅ Distance calculation (Haversine formula)
- ✅ AI-powered recommendations (Google Gemini)
- ✅ Filter by active doctors
- ✅ Sort by rating/distance
- ✅ AI "Top Picks" badge

### 3. Appointment Management
- ✅ Book appointments with date & time
- ✅ Doctor accepts/rejects appointments
- ✅ OTP generation for accepted appointments
- ✅ Status tracking (Pending/Accepted)
- ✅ View appointments by role
- ✅ Appointment history

### 4. Dashboards

#### Patient Dashboard
- Stats cards (Total, Pending, Confirmed)
- Recent appointments
- Quick actions (Find Doctors, View Appointments)
- Appointment details with date/time
- OTP display for accepted appointments

#### Doctor Dashboard
- Stats cards (Total, Pending, Accepted)
- Appointment requests list
- Accept appointment functionality
- OTP generation and display
- Quick actions (Update Profile, Set Availability)

### 5. UI/UX Features
- ✅ Responsive design (mobile-first)
- ✅ Smooth animations (Framer Motion)
- ✅ Loading states (skeleton loaders)
- ✅ Toast notifications
- ✅ Empty states
- ✅ Error handling
- ✅ Glass morphism effects
- ✅ Gradient themes (Teal/Green)
- ✅ Custom scrollbar
- ✅ Dark mode ready

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/signup` - Register user/doctor
- `POST /api/auth/verify-otp` - Verify email OTP
- `POST /api/auth/login` - User login

### Doctors (`/api/doctors`)
- `GET /api/doctors/search?specialist=...` - Search doctors
- `GET /api/doctors/search?specialist=...&userLat=...&userLng=...` - Location-based search
- `GET /api/doctors/:id` - Get doctor by ID

### Appointments (`/api/appointments`)
- `POST /api/appointments/book` - Book appointment
- `POST /api/appointments/accept/:id` - Accept appointment (doctor)
- `GET /api/appointments?userId=...&role=...` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID

---

## 🗄️ Database Models

### Patient Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  otp: String,
  verified: Boolean (default: false)
}
```

### Doctor Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  otp: String,
  verified: Boolean (default: false),
  specialist: String,
  location: {
    lat: Number,
    lng: Number
  },
  rating: Number (default: 0),
  active: Boolean (default: true),
  availableSlots: [String]
}
```

### Appointment Model
```javascript
{
  patientId: ObjectId (ref: Patient),
  doctorId: ObjectId (ref: Doctor),
  date: String,
  time: String,
  status: String (default: "Pending"),
  otp: String,
  createdAt: Date
}
```

---

## 🎨 Frontend Pages

### Public Pages
1. **Landing Page** (`/`)
   - Hero section with search
   - Trust indicators
   - Top specialties
   - How it works
   - CTA section

2. **Search Doctors** (`/search`)
   - Specialty filter
   - Location permission
   - AI recommendations
   - Doctor cards with distance
   - Sort and filter options

3. **Login** (`/login`)
   - Email/password form
   - Role-based redirect

4. **Signup** (`/signup`)
   - Role selection (Patient/Doctor)
   - Password strength indicator
   - Form validation

5. **Verify OTP** (`/verify-otp`)
   - 6-digit OTP input
   - Resend functionality
   - Development mode OTP display

### Protected Pages (Patient)
6. **Patient Dashboard** (`/dashboard`)
   - Welcome message
   - Stats overview
   - Recent appointments
   - Quick actions

7. **Doctor Profile** (`/doctors/:id`)
   - Doctor information
   - Available slots
   - Book appointment modal
   - Date picker

8. **Appointments** (`/appointments`)
   - All appointments list
   - Status filters
   - OTP display
   - Appointment details

### Protected Pages (Doctor)
9. **Doctor Dashboard** (`/doctor/dashboard`)
   - Practice overview
   - Appointment requests
   - Accept functionality
   - Stats cards

---

## 🔐 Security Features

- ✅ Password hashing (bcrypt)
- ✅ JWT token authentication
- ✅ Protected API routes
- ✅ Role-based access control
- ✅ Email verification
- ✅ CORS configuration
- ✅ Environment variables for secrets

---

## 🚀 Key Functionalities

### Location-Based Features
- Browser geolocation API
- Distance calculation (Haversine)
- Location-based doctor sorting
- AI recommendations with proximity

### AI Integration
- Google Gemini Pro for recommendations
- Analyzes location + rating
- Returns top 3 doctors
- Fallback to rating-based sorting

### Email System
- OTP email sending
- HTML email templates
- Development fallback (console logging)
- Gmail SMTP configuration

---

## 📊 Project Statistics

- **Total Lines of Code**: ~174,574 (including node_modules)
- **Backend Files**: 15+ JavaScript files
- **Frontend Files**: 30+ TypeScript/TSX files
- **Components**: 20+ React components
- **Pages**: 9 main pages
- **API Routes**: 10+ endpoints

---

## 🔧 Configuration Files

### Backend
- `server.js` - Main server configuration
- `.env` - Environment variables (PORT, MONGO_URI, JWT_SECRET, EMAIL, EMAIL_PASS, GOOGLE_AI_KEY)
- `package.json` - Dependencies and scripts

### Frontend
- `vite.config.ts` - Vite configuration with proxy
- `tailwind.config.js` - Tailwind CSS customization
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies and scripts

---

## 🎯 Current Status

### ✅ Working Features
- All authentication flows
- Doctor search with location
- Appointment booking
- Role-based dashboards
- AI recommendations
- Email OTP (with fallback)
- Responsive UI
- Error handling

### 📝 Documentation
- `EMAIL_SETUP_GUIDE.md` - Email configuration
- `GOOGLE_CLOUD_SETUP.md` - Google AI setup
- `LOCATION_FEATURE.md` - Location features
- `SYSTEM_STATUS.md` - System status
- `DEPLOYMENT.md` - Deployment guide

---

## 🚦 Running the Project

### Backend
```bash
cd healthcare-app/backend
npm install
# Set up .env file
npm start
# Runs on http://localhost:5001
```

### Frontend
```bash
cd healthcare-app/frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

---

## 📦 Environment Variables

### Backend (.env)
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/docnear
JWT_SECRET=your-secret-key
EMAIL=your-email@gmail.com
EMAIL_PASS=your-app-password
GOOGLE_AI_KEY=your-google-ai-key
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5001/api
```

---

## 🎨 Design System

### Colors
- **Primary**: Teal/Green (`hsl(180, 66%, 40%)`)
- **Primary Dark**: `hsl(180, 66%, 30%)`
- **Primary Light**: `hsl(180, 66%, 50%)`
- **Background**: White with gradient overlays
- **Text**: Gray scale

### Typography
- **Headings**: Bold, large sizes
- **Body**: Medium weight, readable sizes
- **Gradient Text**: Primary color gradients

### Components
- Glass morphism cards
- Gradient buttons
- Animated transitions
- Hover effects
- Shadow variations

---

## 🔄 Data Flow

1. **User Signup** → Backend creates user → Sends OTP email → User verifies → JWT token generated
2. **Doctor Search** → User location → Backend calculates distances → AI recommends → Frontend displays
3. **Appointment Booking** → Patient selects slot → Backend creates appointment → Doctor accepts → OTP generated
4. **Dashboard** → Fetches appointments → Displays stats → Shows recent activity

---

## 🎯 Future Enhancements

- [ ] Email notifications for appointments
- [ ] Doctor profile editing
- [ ] Availability management
- [ ] Appointment cancellation
- [ ] Reviews and ratings
- [ ] Payment integration
- [ ] Video consultation
- [ ] Prescription management
- [ ] Medical records
- [ ] Chat functionality

---

**Last Updated**: January 2024
**Status**: 🟢 Production Ready
