import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { motion } from 'framer-motion';
import { Search, Calendar, Clock, ArrowRight, Stethoscope, Activity, MapPin, Wallet } from 'lucide-react';
import { appointmentsAPI } from '../services/api';
import { useToast } from '../components/ui/use-toast';
import { useEffect, useState } from 'react';
import { HealthWallet } from '../components/HealthWallet';

interface Appointment {
  _id: string;
  patientId: string;
  doctorId: string;
  status: 'Pending' | 'Accepted';
  otp?: string;
  date?: string;
  time?: string;
  createdAt?: string;
  doctor?: {
    name: string;
    specialist: string;
  };
}

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect doctors to doctor dashboard
    if (user?.role === 'doctor') {
      navigate('/doctor/dashboard', { replace: true });
      return;
    }
    // Redirect labs to lab dashboard
    if (user?.role === 'lab') {
      navigate('/lab/dashboard', { replace: true });
      return;
    }
    if (user?.id) {
      fetchAppointments();
    }
  }, [user, navigate]);

  const fetchAppointments = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await appointmentsAPI.getAll(user.id, 'patient');
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const recentAppointments = appointments.slice(0, 3);
  const pendingCount = appointments.filter(a => a.status === 'Pending').length;
  const acceptedCount = appointments.filter(a => a.status === 'Accepted').length;

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
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                Welcome back, <span className="text-gradient">{user?.name}</span>! 👋
              </h1>
              <p className="text-xl text-gray-600">Here's your healthcare overview</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {[
            { label: 'Total Appointments', value: appointments.length, icon: Calendar, color: 'from-blue-500 to-cyan-500' },
            { label: 'Pending', value: pendingCount, icon: Clock, color: 'from-yellow-500 to-orange-500' },
            { label: 'Confirmed', value: acceptedCount, icon: Activity, color: 'from-green-500 to-emerald-500' },
          ].map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="card-hover border-0 shadow-soft overflow-hidden relative group">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-600">
                    {stat.label}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-10 w-20" />
                  ) : (
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
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
                    <CardTitle className="text-xl mb-2">Find Doctors</CardTitle>
                    <CardDescription className="text-base">
                      Search for specialists near you
                    </CardDescription>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-primary-light shadow-lg group-hover:scale-110 transition-transform">
                    <Search className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link to="/search">
                  <Button className="w-full btn-gradient h-12 text-base font-semibold group/btn">
                    <span>Search Doctors</span>
                    <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card className="card-hover border-0 shadow-soft group cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">Book Services</CardTitle>
                    <CardDescription className="text-base">
                      Book healthcare services with EMI options
                    </CardDescription>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500 to-primary shadow-lg group-hover:scale-110 transition-transform">
                    <Stethoscope className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link to="/services">
                  <Button variant="outline" className="w-full h-12 text-base font-semibold border-2 hover:bg-primary/10 hover:border-primary transition-colors">
                    View Services
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card className="card-hover border-0 shadow-soft group cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">My Appointments</CardTitle>
                    <CardDescription className="text-base">
                      View and manage your appointments
                    </CardDescription>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg group-hover:scale-110 transition-transform">
                    <Calendar className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link to="/appointments">
                  <Button variant="outline" className="w-full h-12 text-base font-semibold border-2 hover:bg-primary/10 hover:border-primary transition-colors">
                    View Appointments
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Health Wallet Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-10"
        >
          <HealthWallet />
        </motion.div>

        {/* Recent Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">Recent Appointments</CardTitle>
                  <CardDescription className="text-base">
                    Your latest booked appointments
                  </CardDescription>
                </div>
                <Link to="/appointments">
                  <Button variant="ghost" size="sm" className="font-semibold hover:text-primary">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : recentAppointments.length === 0 ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                    <Stethoscope className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-lg font-semibold text-gray-500 mb-2">No appointments yet</p>
                  <p className="text-gray-400 mb-6">Start by finding a doctor and booking your first appointment</p>
                  <Link to="/search">
                    <Button className="btn-gradient">
                      Book Your First Appointment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentAppointments.map((appointment, index) => (
                    <motion.div
                      key={appointment._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-xl border border-gray-200 hover:border-primary/50 hover:shadow-md transition-all bg-white group gap-4"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex-shrink-0">
                          <Stethoscope className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-gray-900 mb-1">
                            Dr. {appointment.doctor?.name || 'Doctor'}
                          </h3>
                          <p className="text-primary font-semibold mb-2">
                            {appointment.doctor?.specialist || 'Specialist'}
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
                            {!appointment.date && !appointment.time && (
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-gray-400" />
                                <span className="text-xs text-gray-500">Scheduled</span>
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
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
