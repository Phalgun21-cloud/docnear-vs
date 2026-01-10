# DocNear Frontend

A modern, production-ready healthcare appointment booking web application built with React, TypeScript, and Tailwind CSS.

## Tech Stack

- **React 18** + **TypeScript** - Modern React with type safety
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Context API** - State management for authentication
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible component primitives

## Features

- ✅ Patient authentication (Signup, Login, OTP Verification)
- ✅ Doctor search by specialty
- ✅ AI-powered doctor recommendations
- ✅ Appointment booking
- ✅ Appointment management
- ✅ Responsive design (Mobile-first)
- ✅ Beautiful UI/UX with animations
- ✅ Toast notifications
- ✅ Protected routes
- ✅ Loading states and error handling

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # Base UI components (Button, Input, Card, etc.)
│   ├── Navbar.tsx      # Navigation bar
│   ├── Footer.tsx      # Footer component
│   └── DoctorCard.tsx  # Doctor card component
├── pages/              # Page components
│   ├── Landing.tsx     # Home page
│   ├── Login.tsx       # Login page
│   ├── Signup.tsx      # Signup page
│   ├── VerifyOtp.tsx   # OTP verification
│   ├── Dashboard.tsx   # Patient dashboard
│   ├── SearchDoctors.tsx # Doctor search page
│   ├── DoctorProfile.tsx # Doctor profile page
│   └── Appointments.tsx # Appointments list
├── context/            # React Context
│   └── AuthContext.tsx # Authentication context
├── services/           # API services
│   └── api.ts          # Axios instance and API functions
├── routes/             # Route utilities
│   └── PrivateRoute.tsx # Protected route wrapper
├── lib/                # Utilities
│   └── utils.ts        # Helper functions
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## API Integration

The frontend is configured to work with the backend API running on `http://localhost:5000`. Update the `VITE_API_URL` in your `.env` file if your backend runs on a different port.

### API Endpoints Used

- `POST /api/auth/signup` - Patient signup
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/login` - Patient login (needs backend implementation)
- `GET /api/doctors/search` - Search doctors by specialty
- `GET /api/doctors/:id` - Get doctor details
- `POST /api/appointments/book` - Book appointment
- `POST /api/appointments/accept/:id` - Accept appointment
- `GET /api/appointments` - Get all appointments (needs backend implementation)

## Notes

- Some backend endpoints may need to be implemented (noted in comments)
- The app uses dummy data as fallback when API calls fail
- JWT tokens are stored in localStorage (consider HttpOnly cookies for production)
- Password strength indicator shows real-time feedback

## Design

- Color scheme: White + Teal/Green accent (primary: `hsl(180, 66%, 40%)`)
- Professional, medical, clean UI
- Smooth animations with Framer Motion
- Fully responsive and accessible

## License

ISC