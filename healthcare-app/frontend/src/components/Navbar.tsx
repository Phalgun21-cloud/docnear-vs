import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Button } from './ui/button';
import { Stethoscope, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const { user: clerkUser } = useUser();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Get role from Clerk metadata or fallback to context
  const userRole = clerkUser?.publicMetadata?.role || user?.role || 'patient';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 shadow-sm"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-primary-light group-hover:scale-110 transition-transform">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              DocNear
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                {userRole === 'doctor' ? (
                  <>
                    <Link href="/doctor/dashboard">
                      <Button variant="ghost" className="font-medium hover:bg-primary/10 hover:text-primary transition-colors">
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/appointments">
                      <Button variant="ghost" className="font-medium hover:bg-primary/10 hover:text-primary transition-colors">
                        Appointments
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/dashboard">
                      <Button variant="ghost" className="font-medium hover:bg-primary/10 hover:text-primary transition-colors">
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/search">
                      <Button variant="ghost" className="font-medium hover:bg-primary/10 hover:text-primary transition-colors">
                        Find Doctors
                      </Button>
                    </Link>
                    <Link href="/appointments">
                      <Button variant="ghost" className="font-medium hover:bg-primary/10 hover:text-primary transition-colors">
                        Appointments
                      </Button>
                    </Link>
                  </>
                )}
                <div className="mx-2 h-6 w-px bg-gray-300" />
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10"
                    }
                  }}
                />
              </>
            ) : (
              <>
                <Link href="/search">
                  <Button variant="ghost" className="font-medium hover:bg-primary/10 hover:text-primary transition-colors">
                    Find Doctors
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button variant="ghost" className="font-medium hover:bg-primary/10 hover:text-primary transition-colors">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="btn-gradient font-semibold">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden py-4 space-y-2 border-t"
            >
              {isAuthenticated ? (
                <>
                  {userRole === 'doctor' ? (
                    <>
                      <Link href="/doctor/dashboard" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          Dashboard
                        </Button>
                      </Link>
                      <Link href="/appointments" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          Appointments
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          Dashboard
                        </Button>
                      </Link>
                      <Link href="/search" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          Find Doctors
                        </Button>
                      </Link>
                      <Link href="/appointments" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          Appointments
                        </Button>
                      </Link>
                    </>
                  )}
                  <div className="px-3 py-2 flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {userRole === 'doctor' ? 'Dr.' : ''} {user?.name}
                    </span>
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8"
                        }
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <Link href="/search" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Find Doctors
                    </Button>
                  </Link>
                  <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full btn-gradient">Sign Up</Button>
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
