import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { appointmentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Stethoscope, Copy, CheckCircle, AlertCircle, Loader2, Search } from 'lucide-react';

interface Appointment {
  _id: string;
  patientId: string;
  doctorId: string;
  status: 'Pending' | 'Accepted' | 'Cancelled';
  otp?: string;
  createdAt?: string;
  doctor?: {
    _id: string;
    name: string;
    specialist: string;
  };
}

export const Appointments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Accepted' | 'Cancelled'>('All');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    if (!user?.id || !user?.role) return;
    
    setLoading(true);
    try {
      const response = await appointmentsAPI.getAll(user.id, user.role as 'patient' | 'doctor');
      setAppointments(response.data.appointments || []);
    } catch (error: any) {
      console.error('Failed to fetch appointments:', error);
      toast({
        title: 'Failed to load appointments',
        description: error.response?.data?.message || 'Could not fetch your appointments. Please try again later.',
        variant: 'destructive',
      });
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const copyOTP = (otp: string) => {
    navigator.clipboard.writeText(otp);
    toast({
      title: 'OTP Copied!',
      description: 'The OTP has been copied to your clipboard.',
    });
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'All') return true;
    return apt.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            My <span className="text-gradient">Appointments</span>
          </h1>
          <p className="text-xl text-gray-600">View and manage your appointments</p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {(['All', 'Pending', 'Accepted', 'Cancelled'] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              onClick={() => setFilter(status)}
              size="sm"
              className={`font-semibold transition-all ${
                filter === status ? 'btn-gradient shadow-lg' : 'hover:bg-gray-50'
              }`}
            >
              {status}
            </Button>
          ))}
        </motion.div>

        {/* Appointments List */}
        {loading ? (
          <Card className="border-0 shadow-soft">
            <CardContent className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : filteredAppointments.length === 0 ? (
          <Card className="border-0 shadow-soft">
            <CardContent className="py-20 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                <Calendar className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-xl font-semibold text-gray-500 mb-2">No appointments found</p>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {filter === 'All'
                  ? "You haven't booked any appointments yet."
                  : `No ${filter.toLowerCase()} appointments.`}
              </p>
              <Link to="/search">
                <Button className="btn-gradient">
                  <Search className="mr-2 h-4 w-4" />
                  Find Doctors
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <AnimatePresence>
              {filteredAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: index * 0.05,
                        duration: 0.3
                      }
                    }
                  }}
                  exit={{ opacity: 0, x: -20 }}
                  layout
                >
                  <Card className="border-0 shadow-soft hover:shadow-xl transition-all group overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-white to-gray-50/50 pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary-light shadow-lg group-hover:scale-110 transition-transform">
                            <Stethoscope className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-bold text-gray-900 mb-1">
                              {appointment.doctor?.name || 'Doctor'}
                            </CardTitle>
                            <p className="text-primary font-semibold mb-2">
                              {appointment.doctor?.specialist || 'Specialist'}
                            </p>
                            {appointment.createdAt && (
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                <span>Booked on {new Date(appointment.createdAt).toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusIcon(appointment.status)}
                          <Badge
                            variant={
                              appointment.status === 'Accepted'
                                ? 'success'
                                : appointment.status === 'Pending'
                                ? 'warning'
                                : 'secondary'
                            }
                            className="text-sm font-semibold px-4 py-1.5"
                          >
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {appointment.status === 'Pending' && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                            <p className="font-semibold text-yellow-800">Waiting for Confirmation</p>
                          </div>
                          <p className="text-sm text-yellow-700">
                            Your appointment request is pending. The doctor will confirm soon and you'll
                            receive an OTP.
                          </p>
                        </div>
                      )}

                      {appointment.status === 'Accepted' && appointment.otp && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5 mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-6 w-6 text-green-600" />
                              <p className="font-bold text-green-800 text-lg">Appointment Confirmed!</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyOTP(appointment.otp!)}
                              className="border-green-300 text-green-700 hover:bg-green-100 font-semibold"
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy OTP
                            </Button>
                          </div>
                          <div className="bg-white rounded-lg p-4 mb-3 border-2 border-green-200">
                            <p className="text-xs text-gray-600 mb-2 font-semibold uppercase tracking-wide">
                              Your Appointment OTP:
                            </p>
                            <p className="text-3xl font-mono font-bold text-green-600 tracking-wider">
                              {appointment.otp}
                            </p>
                          </div>
                          <p className="text-sm text-green-700 font-medium">
                            📍 Please show this OTP to the doctor when you visit. Keep it safe!
                          </p>
                        </div>
                      )}

                      {appointment.status === 'Accepted' && (
                        <div className="flex items-center gap-4">
                          <Link to={`/doctors/${appointment.doctorId || appointment.doctor?._id}`}>
                            <Button variant="outline" className="font-semibold border-2 hover:bg-primary/10 hover:border-primary transition-colors">
                              <Stethoscope className="mr-2 h-4 w-4" />
                              View Doctor Profile
                            </Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};
