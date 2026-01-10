import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { appointmentsAPI } from '../services/api';
import { useToast } from '../components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  Stethoscope,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  User,
  Loader2,
  TrendingUp,
  Activity,
} from 'lucide-react';

interface Appointment {
  _id: string;
  patientId: string;
  doctorId: string;
  status: 'Pending' | 'Accepted';
  otp?: string;
  date?: string;
  time?: string;
  createdAt?: string;
  patient?: {
    name: string;
    email: string;
  };
}

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
  });

  useEffect(() => {
    // Redirect patients to patient dashboard
    if (user?.role === 'patient') {
      navigate('/dashboard', { replace: true });
      return;
    }
    if (user?.id) {
      fetchAppointments();
    }
  }, [user, navigate]);

  useEffect(() => {
    // Calculate stats
    const total = appointments.length;
    const pending = appointments.filter((apt) => apt.status === 'Pending').length;
    const accepted = appointments.filter((apt) => apt.status === 'Accepted').length;
    setStats({ total, pending, accepted });
  }, [appointments]);

  const fetchAppointments = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await appointmentsAPI.getAll(user.id, 'doctor');
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAppointment = async (appointmentId: string) => {
    try {
      const response = await appointmentsAPI.accept(appointmentId);
      const { otp, appointment } = response.data;
      
      // Update local state with the updated appointment
      setAppointments(prev => 
        prev.map(apt => apt._id === appointmentId ? appointment : apt)
      );
      
      toast({
        title: 'Appointment Accepted!',
        description: `OTP ${otp} has been generated for this appointment.`,
      });
    } catch (error: any) {
      toast({
        title: 'Failed to Accept',
        description: error.response?.data?.message || 'Could not accept appointment. Please try again.',
        variant: 'destructive',
      });
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Welcome, <span className="text-gradient">Dr. {user?.name}</span>! 👋
          </h1>
          <p className="text-xl text-gray-600">Here's your practice overview</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {[
            { 
              label: 'Total Appointments', 
              value: stats.total, 
              icon: Calendar, 
              color: 'from-blue-500 to-cyan-500',
              subtitle: 'All time appointments'
            },
            { 
              label: 'Pending', 
              value: stats.pending, 
              icon: AlertCircle, 
              color: 'from-yellow-500 to-orange-500',
              subtitle: 'Awaiting response'
            },
            { 
              label: 'Accepted', 
              value: stats.accepted, 
              icon: CheckCircle, 
              color: 'from-green-500 to-emerald-500',
              subtitle: 'Confirmed appointments'
            },
          ].map((stat, index) => (
            <motion.div key={index} variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <Card className="card-hover border-0 shadow-soft overflow-hidden relative group cursor-pointer h-full">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-600">
                    {stat.label}
                  </CardTitle>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-10 w-20" />
                  ) : (
                    <>
                      <div className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
                      <p className="text-xs text-gray-500">{stat.subtitle}</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
        >
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card className="card-hover border-0 shadow-soft group cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">Update Profile</CardTitle>
                    <CardDescription className="text-base">
                      Manage your professional information
                    </CardDescription>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-primary-light shadow-lg group-hover:scale-110 transition-transform">
                    <User className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full h-12 text-base font-semibold border-2 hover:bg-primary/10 hover:border-primary transition-colors">
                  Edit Profile
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card className="card-hover border-0 shadow-soft group cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">Manage Availability</CardTitle>
                    <CardDescription className="text-base">
                      Set your available time slots
                    </CardDescription>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg group-hover:scale-110 transition-transform">
                    <Clock className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full h-12 text-base font-semibold border-2 hover:bg-blue-50 hover:border-blue-500 transition-colors">
                  Set Availability
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Appointments List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">Appointment Requests</CardTitle>
                  <CardDescription className="text-base">
                    Manage patient appointments
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                    <Calendar className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-lg font-semibold text-gray-500 mb-2">No appointments yet</p>
                  <p className="text-gray-400">
                    Patients will be able to book appointments once you're listed.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {appointments.map((appointment, index) => (
                      <motion.div
                        key={appointment._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-xl border border-gray-200 hover:border-primary/50 hover:shadow-md transition-all bg-white group gap-4"
                      >
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex-shrink-0">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-gray-900 mb-1">
                              {appointment.patient?.name || 'Patient'}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2">
                              {appointment.patient?.email || 'patient@example.com'}
                            </p>
                            <div className="flex flex-wrap items-center gap-3">
                              {appointment.date && (
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50">
                                  <Calendar className="h-3.5 w-3.5 text-blue-600" />
                                  <span className="text-xs text-blue-700 font-medium">{appointment.date}</span>
                                </div>
                              )}
                              {appointment.time && (
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-50">
                                  <Clock className="h-3.5 w-3.5 text-green-600" />
                                  <span className="text-xs text-green-700 font-medium">{appointment.time}</span>
                                </div>
                              )}
                              {appointment.createdAt && (
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50">
                                  <Clock className="h-3.5 w-3.5 text-gray-400" />
                                  <span className="text-xs text-gray-600">
                                    Requested {new Date(appointment.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <Badge
                            variant={
                              appointment.status === 'Accepted'
                                ? 'success'
                                : appointment.status === 'Pending'
                                ? 'warning'
                                : 'secondary'
                            }
                            className="text-sm font-semibold px-3 py-1.5"
                          >
                            {appointment.status}
                          </Badge>
                          {appointment.status === 'Pending' && (
                            <Button
                              onClick={() => handleAcceptAppointment(appointment._id)}
                              size="sm"
                              className="btn-gradient font-semibold px-6"
                            >
                              Accept
                            </Button>
                          )}
                          {appointment.status === 'Accepted' && appointment.otp && (
                            <div className="text-right px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
                              <p className="text-xs text-gray-500 mb-1 font-medium">Verification OTP</p>
                              <p className="text-xl font-mono font-bold text-primary">
                                {appointment.otp}
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
