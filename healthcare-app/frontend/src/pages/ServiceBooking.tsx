import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { useToast } from '../components/ui/use-toast';
import { motion } from 'framer-motion';
import { CreditCard, Wallet, Calendar, Clock, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { servicesAPI, paymentsAPI, appointmentsAPI } from '../services/api';
import { EMICalculator } from '../components/EMICalculator';

interface Service {
  _id: string;
  name: string;
  type: string;
  description: string;
  basePrice: number;
  emiAvailable: boolean;
  minEmiAmount: number;
}

export const ServiceBooking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [useEMI, setUseEMI] = useState(false);
  const [tenure, setTenure] = useState('3');
  const [processing, setProcessing] = useState(false);
  const [emiCalculation, setEmiCalculation] = useState<any>(null);

  useEffect(() => {
    fetchServices();
    const serviceId = searchParams.get('serviceId');
    if (serviceId) {
      // Pre-select service if provided in URL
      setTimeout(() => {
        const service = services.find(s => s._id === serviceId);
        if (service) {
          setSelectedService(service);
          setBookingOpen(true);
        }
      }, 500);
    }
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getAll();
      setServices(response.data.services || []);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      toast({
        title: 'Error',
        description: 'Failed to load services. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateEMI = async () => {
    if (!selectedService) return;
    
    try {
      const response = await paymentsAPI.processPayment({
        patientId: user?.id || '',
        amount: selectedService.basePrice,
        paymentMethod: 'EMI',
        useEMI: true,
        tenure: parseInt(tenure)
      });
      
      // Calculate EMI locally for display
      const emiAmount = selectedService.basePrice / parseInt(tenure);
      setEmiCalculation({
        principal: selectedService.basePrice,
        tenure: parseInt(tenure),
        emiAmount: Math.round(emiAmount),
        totalAmount: selectedService.basePrice,
        interestRate: 0
      });
    } catch (error) {
      console.error('EMI calculation error:', error);
    }
  };

  const handleBookService = () => {
    if (!selectedService) return;
    
    if (selectedService.basePrice >= 5000 && !useEMI) {
      setPaymentOpen(true);
    } else if (useEMI) {
      calculateEMI();
      setPaymentOpen(true);
    } else {
      // Direct booking for services < ₹5000
      processBooking('Paid', null);
    }
  };

  const processPayment = async () => {
    if (!selectedService || !user) return;

    setProcessing(true);
    try {
      const paymentData = {
        patientId: user.id,
        amount: selectedService.basePrice,
        paymentMethod: paymentMethod,
        useEMI: useEMI && selectedService.basePrice >= 5000,
        tenure: useEMI ? parseInt(tenure) : undefined
      };

      const paymentResponse = await paymentsAPI.processPayment(paymentData);
      
      if (paymentResponse.data.success) {
        const paymentStatus = useEMI ? 'EMI' : 'Paid';
        await processBooking(paymentStatus, paymentResponse.data.emiId || null);
      }
    } catch (error: any) {
      toast({
        title: 'Payment Failed',
        description: error.response?.data?.message || 'Payment processing failed. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const processBooking = async (paymentStatus: string, emiId: string | null) => {
    if (!selectedService || !user) return;

    try {
      // Create appointment/service booking
      const appointmentData = {
        patientId: user.id,
        doctorId: null, // Service booking may not require doctor
        serviceId: selectedService._id,
        date: selectedDate || new Date().toISOString().split('T')[0],
        time: selectedTime || new Date().toTimeString().split(' ')[0],
        amount: selectedService.basePrice,
        paymentStatus: paymentStatus,
        emiId: emiId
      };

      await appointmentsAPI.book(appointmentData);

      toast({
        title: 'Booking Successful!',
        description: `Your ${selectedService.name} has been booked successfully.`,
      });

      setPaymentOpen(false);
      setBookingOpen(false);
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Booking Failed',
        description: error.response?.data?.message || 'Failed to complete booking. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Book a <span className="text-gradient">Service</span>
          </h1>
          <p className="text-xl text-gray-600">Choose from our healthcare services with flexible payment options</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
              onClick={() => {
                setSelectedService(service);
                setBookingOpen(true);
              }}
            >
              <Card className="card-hover border-0 shadow-soft h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                    {service.emiAvailable && (
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        EMI Available
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{service.type}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{service.description || 'Quality healthcare service'}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Starting from</p>
                      <p className="text-2xl font-bold text-primary">₹{service.basePrice.toLocaleString()}</p>
                    </div>
                  </div>
                  <Button className="w-full btn-gradient">
                    Book Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Booking Dialog */}
        <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Book {selectedService?.name}</DialogTitle>
            </DialogHeader>
            {selectedService && (
              <div className="space-y-6 py-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Service Price</span>
                    <span className="text-2xl font-bold text-primary">
                      ₹{selectedService.basePrice.toLocaleString()}
                    </span>
                  </div>
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
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Time
                  </label>
                  <Input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="h-12"
                  />
                </div>

                {selectedService.basePrice >= 5000 && (
                  <div className="p-4 border-2 border-primary/20 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={useEMI}
                          onChange={(e) => setUseEMI(e.target.checked)}
                          className="w-5 h-5 text-primary"
                        />
                        <span className="font-semibold">Use EMI Payment</span>
                      </label>
                      <Badge className="bg-green-100 text-green-800">
                        <Sparkles className="w-3 h-3 mr-1" />
                        0% Interest
                      </Badge>
                    </div>
                    {useEMI && (
                      <div className="mt-4 space-y-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tenure (Months)
                          </label>
                          <select
                            value={tenure}
                            onChange={(e) => setTenure(e.target.value)}
                            className="w-full h-12 px-4 border-2 border-gray-300 rounded-lg focus:border-primary"
                          >
                            <option value="3">3 Months</option>
                            <option value="6">6 Months</option>
                            <option value="9">9 Months</option>
                            <option value="12">12 Months</option>
                          </select>
                        </div>
                        {emiCalculation && (
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Monthly EMI</p>
                            <p className="text-xl font-bold text-primary">
                              ₹{emiCalculation.emiAmount.toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setBookingOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleBookService}
                    className="flex-1 btn-gradient"
                  >
                    {selectedService.basePrice >= 5000 && !useEMI ? 'Proceed to Payment' : 'Book Service'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Complete Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Amount</span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{selectedService?.basePrice.toLocaleString()}
                  </span>
                </div>
                {useEMI && emiCalculation && (
                  <div className="mt-2 pt-2 border-t border-primary/20">
                    <div className="flex items-center justify-between text-sm">
                      <span>Monthly EMI</span>
                      <span className="font-semibold">₹{emiCalculation.emiAmount.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full h-12 px-4 border-2 border-gray-300 rounded-lg focus:border-primary"
                >
                  <option value="UPI">UPI</option>
                  <option value="Card">Credit/Debit Card</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Wallet">Wallet</option>
                </select>
              </div>

              <Button
                onClick={processPayment}
                disabled={processing}
                className="w-full btn-gradient h-12"
              >
                {processing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <>
                    <CreditCard className="mr-2 w-5 h-5" />
                    Pay Now
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
