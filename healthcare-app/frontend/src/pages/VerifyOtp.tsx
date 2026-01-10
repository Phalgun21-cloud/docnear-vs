import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../components/ui/use-toast';
import { motion } from 'framer-motion';
import { Mail, Clock, ArrowRight, CheckCircle, Stethoscope } from 'lucide-react';

export const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOtp } = useAuth();
  const { toast } = useToast();
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor' | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    // Get email and role from location state
    const emailFromState = location.state?.email;
    const roleFromState = location.state?.role;
    if (emailFromState) {
      setEmail(emailFromState);
      setRole(roleFromState || 'patient');
    } else {
      // If no email in state, redirect to signup
      navigate('/signup');
    }
  }, [location, navigate]);

  useEffect(() => {
    // Resend OTP timer
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter a 6-digit OTP',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const result = await verifyOtp(email, otp, role || undefined);
      toast({
        title: 'Verified Successfully!',
        description: 'Your account has been verified. Redirecting to dashboard...',
      });
      
      // Redirect based on role
      const userRole = result.role || role || 'patient';
      setTimeout(() => {
        if (userRole === 'doctor') {
          navigate('/doctor/dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 1000);
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.message || 'Invalid OTP. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    
    setResendTimer(60);
    toast({
      title: 'OTP Resent',
      description: 'Please check your email for the new OTP.',
    });
    // Here you would typically call the backend to resend OTP
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-teal-50/50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-300/10 rounded-full blur-3xl" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass-effect shadow-2xl border-0">
          <CardHeader className="space-y-3 pb-4">
            <div className="flex justify-center mb-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="p-4 rounded-2xl bg-gradient-to-br from-primary to-primary-light shadow-lg"
              >
                <Mail className="h-8 w-8 text-white" />
              </motion.div>
            </div>
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-center text-base">
              We've sent a 6-digit OTP to
            </CardDescription>
            <div className="text-center">
              <p className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-lg inline-block">
                {email || 'your email'}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                  Enter 6-Digit OTP
                </label>
                <Input
                  id="otp"
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="text-center text-4xl tracking-[0.5em] font-bold h-16 text-3xl border-2 focus:border-primary transition-colors"
                  autoFocus
                />
                <p className="text-xs text-center text-gray-500 mt-2">
                  Enter the code sent to your email
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold btn-gradient group"
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <>
                      <span>Verify OTP</span>
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            <div className="space-y-4 pt-4 border-t">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendTimer > 0}
                className="w-full text-sm font-semibold text-primary hover:text-primary-dark disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                <Clock className="h-4 w-4" />
                <span>
                  {resendTimer > 0
                    ? `Resend OTP in ${resendTimer}s`
                    : 'Resend OTP'}
                </span>
              </button>

              <div className="text-center text-sm">
                <span className="text-gray-600">Didn't receive OTP? </span>
                <Link to="/signup" className="text-primary hover:underline font-semibold transition-colors">
                  Sign up again
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
