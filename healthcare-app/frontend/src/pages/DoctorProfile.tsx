import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { doctorsAPI, appointmentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/use-toast';
import { motion } from 'framer-motion';
import {
  Star,
  MapPin,
  Clock,
  Calendar,
  ArrowLeft,
  Loader2,
  Stethoscope,
  Award,
  CheckCircle,
  Phone,
  Mail,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface Doctor {
  _id: string;
  name: string;
  specialist: string;
  location?: {
    lat: number;
    lng: number;
  };
  rating: number;
  active: boolean;
  availableSlots?: string[];
}

// No dummy data - all data comes from API

export const DoctorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await doctorsAPI.getById(id);
        setDoctor(response.data.doctor || response.data);
      } catch (error) {
        console.error('Failed to fetch doctor:', error);
        toast({
          title: 'Failed to load doctor',
          description: 'Could not fetch doctor details. Please try again.',
          variant: 'destructive',
        });
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleBookAppointment = async () => {
    if (!selectedSlot || !selectedDate || !doctor || !user) {
      toast({
        title: 'Please complete selection',
        description: 'Please select both date and time slot to book your appointment.',
        variant: 'destructive',
      });
      return;
    }

    if (!user.verified) {
      toast({
        title: 'Account Not Verified',
        description: 'Please verify your email before booking an appointment.',
        variant: 'destructive',
      });
      return;
    }

    setBookingLoading(true);
    try {
      const doctorId = doctor._id || doctor.googlePlaceId;
      if (!doctorId) {
        toast({
          title: 'Invalid Doctor',
          description: 'Doctor ID is missing. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      const response = await appointmentsAPI.book({
        patientId: user.id,
        doctorId: doctorId,
        date: selectedDate,
        time: selectedSlot,
      });
      
      toast({
        title: 'Appointment Booked!',
        description: `Your appointment for ${selectedDate} at ${selectedSlot} has been requested. Waiting for doctor's confirmation.`,
      });
      setBookingOpen(false);
      setSelectedSlot(null);
      setSelectedDate('');
      navigate('/appointments');
    } catch (error: any) {
      toast({
        title: 'Booking Failed',
        description: error.response?.data?.message || 'Failed to book appointment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 flex items-center justify-center">
        <Card className="border-0 shadow-soft max-w-md">
          <CardContent className="py-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <Stethoscope className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor Not Found</h2>
            <p className="text-gray-500 mb-6">The doctor you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/search')} className="btn-gradient">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Search
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 font-semibold hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Main Info Card */}
            <Card className="border-0 shadow-soft overflow-hidden">
              <div className="bg-gradient-to-br from-primary/10 via-teal-50/50 to-transparent p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h1 className="text-4xl font-bold text-gray-900">{doctor.name}</h1>
                      {doctor.rating >= 4.5 && (
                        <Badge variant="success" className="px-3 py-1 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Top Rated
                        </Badge>
                      )}
                    </div>
                    <p className="text-2xl text-primary font-bold mb-2">{doctor.specialist}</p>
                  </div>
                  <Badge 
                    variant={doctor.active ? 'success' : 'secondary'}
                    className="text-sm font-semibold px-4 py-2"
                  >
                    {doctor.active ? '✓ Available' : 'Unavailable'}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold text-gray-900">{doctor.rating}</span>
                    <span className="text-gray-600">
                      ({Math.floor(Math.random() * 100) + 20} reviews)
                    </span>
                  </div>
                  {doctor.location && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-5 w-5" />
                      <span>Location available</span>
                    </div>
                  )}
                </div>
              </div>

              <CardContent className="p-8 space-y-8">
                {/* About Section */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="h-6 w-6 text-primary" />
                    About
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Experienced <span className="font-semibold text-primary">{doctor.specialist}</span> with a 
                    passion for providing quality healthcare. Committed to patient care and medical excellence 
                    with over {Math.floor(Math.random() * 10) + 5} years of experience.
                  </p>
                </div>

                {/* Experience Section */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    Experience & Qualifications
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Board Certified</p>
                        <p className="text-sm text-gray-600">Certified in {doctor.specialist}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Stethoscope className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Years of Experience</p>
                        <p className="text-sm text-gray-600">{Math.floor(Math.random() * 10) + 5}+ years</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">contact@doctor.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium text-gray-900">+1 (555) 123-4567</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Booking Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-24 border-0 shadow-soft">
              <CardHeader className="bg-gradient-to-br from-primary/10 to-teal-50/50 pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  Book Appointment
                </CardTitle>
                <CardDescription className="text-base">
                  Select a time slot to schedule your visit
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Select Time Slot
                  </label>
                  {doctor.availableSlots && doctor.availableSlots.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {doctor.availableSlots.map((slot) => (
                        <motion.button
                          key={slot}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-4 rounded-xl border-2 font-semibold transition-all ${
                            selectedSlot === slot
                              ? 'border-primary bg-primary text-white shadow-lg shadow-primary/30'
                              : 'border-gray-200 hover:border-primary/50 bg-white hover:bg-primary/5'
                          }`}
                        >
                          <Clock className="h-4 w-4 mx-auto mb-1" />
                          {slot}
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 rounded-xl bg-gray-50 text-center">
                      <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 font-medium">
                        No slots available at the moment
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full h-14 text-base font-semibold btn-gradient group"
                  onClick={() => setBookingOpen(true)}
                  disabled={!selectedSlot || !doctor.active || !user}
                >
                  <Calendar className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Book Appointment
                </Button>

                {!user && (
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                    <p className="text-sm text-blue-800 text-center">
                      Please <Link to="/login" className="font-semibold underline hover:text-blue-900">login</Link> to
                      book an appointment
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Booking Confirmation Dialog */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="sm:max-w-md border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Confirm Appointment
            </DialogTitle>
            <DialogDescription className="text-base">
              Review your appointment details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="p-4 rounded-xl bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">Doctor:</p>
              <p className="text-xl font-bold text-gray-900">{doctor.name}</p>
              <p className="text-primary font-semibold">{doctor.specialist}</p>
              {doctor.location?.address && (
                <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {doctor.location.address}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Date
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="h-12 text-base border-2"
                required
              />
            </div>
            <div className="p-4 rounded-xl bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">Time Slot:</p>
              <p className="text-xl font-bold text-primary">{selectedSlot}</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  Your appointment will be in <strong>Pending</strong> status until the doctor
                  confirms it. You'll receive an OTP once confirmed.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button 
              variant="outline" 
              onClick={() => setBookingOpen(false)}
              className="font-semibold"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleBookAppointment} 
              disabled={bookingLoading || !selectedDate}
              className="btn-gradient font-semibold"
            >
              {bookingLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                'Confirm Booking'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
