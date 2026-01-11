import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './routes/PrivateRoute';
import { Toaster } from './components/ui/toaster';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Landing } from './pages/Landing';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { Dashboard } from './pages/Dashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { LabDashboard } from './pages/LabDashboard';
import { SearchDoctors } from './pages/SearchDoctors';
import { DoctorProfile } from './pages/DoctorProfile';
import { Appointments } from './pages/Appointments';
import { ServiceBooking } from './pages/ServiceBooking';
import { useSyncUser } from './hooks/useSyncUser';

// Component to handle user syncing
const AppContent = () => {
  useSyncUser(); // Sync user on mount if needed
  
  return (
    <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/search" element={<SearchDoctors />} />
              <Route path="/services" element={<ServiceBooking />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/doctor/dashboard"
                element={
                  <PrivateRoute>
                    <DoctorDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/lab/dashboard"
                element={
                  <PrivateRoute>
                    <LabDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <PrivateRoute>
                    <Appointments />
                  </PrivateRoute>
                }
              />
              <Route path="/doctors/:id" element={<DoctorProfile />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;