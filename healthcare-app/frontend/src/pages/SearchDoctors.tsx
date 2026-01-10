import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DoctorCard } from '../components/DoctorCard';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { doctorsAPI } from '../services/api';
import { useToast } from '../components/ui/use-toast';
import { motion } from 'framer-motion';
import { Search, Filter, Sparkles, Loader2, SlidersHorizontal } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

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

// Dummy data for fallback
const dummyDoctors: Doctor[] = [
  {
    _id: '1',
    name: 'Dr. Sarah Johnson',
    specialist: 'Cardiologist',
    rating: 4.8,
    active: true,
    availableSlots: ['9:00 AM', '10:00 AM', '2:00 PM'],
  },
  {
    _id: '2',
    name: 'Dr. Michael Chen',
    specialist: 'Dermatologist',
    rating: 4.9,
    active: true,
    availableSlots: ['11:00 AM', '3:00 PM', '4:00 PM'],
  },
  {
    _id: '3',
    name: 'Dr. Emily Rodriguez',
    specialist: 'Pediatrician',
    rating: 4.7,
    active: true,
    availableSlots: ['9:00 AM', '10:30 AM', '1:00 PM'],
  },
];

const specialties = [
  'Cardiologist',
  'Dermatologist',
  'Orthopedist',
  'Neurologist',
  'Pediatrician',
  'Gynecologist',
  'General Physician',
];

export const SearchDoctors = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const specialistParam = searchParams.get('specialist') || '';
  
  const [specialty, setSpecialty] = useState(specialistParam);
  const [location, setLocation] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeOnly, setActiveOnly] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (specialistParam) {
      handleSearch();
    }
  }, []);

  const handleSearch = async () => {
    if (!specialty.trim()) {
      toast({
        title: 'Please select a specialty',
        description: 'Choose a specialty to search for doctors.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await doctorsAPI.search({ specialist: specialty });
      const fetchedDoctors = response.data.doctors || response.data || [];
      
      // Filter active doctors if needed
      const filteredDoctors = activeOnly
        ? fetchedDoctors.filter((d: Doctor) => d.active)
        : fetchedDoctors;

      // Sort by rating
      const sortedDoctors = filteredDoctors.sort(
        (a: Doctor, b: Doctor) => b.rating - a.rating
      );

      setDoctors(sortedDoctors.length > 0 ? sortedDoctors : dummyDoctors);

      // Set top 3 as AI recommendations (simulated)
      setAiRecommendations(sortedDoctors.slice(0, 3));

      setSearchParams({ specialist: specialty });
    } catch (error: any) {
      console.error('Search failed:', error);
      // Fallback to dummy data
      setDoctors(dummyDoctors);
      setAiRecommendations(dummyDoctors.slice(0, 3));
      toast({
        title: 'Using demo data',
        description: 'Could not fetch doctors. Showing sample data.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Enhanced Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Find Your <span className="text-gradient">Doctor</span>
            </h1>
            <p className="text-xl text-gray-600">
              Search for verified specialists in your area
            </p>
          </div>
          
          <Card className="glass-effect shadow-2xl border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Search Filters</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Select value={specialty} onValueChange={setSpecialty}>
                    <SelectTrigger className="h-12 text-base border-2">
                      <SelectValue placeholder="Select Specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Input
                    placeholder="Location (optional)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-12 text-base border-2"
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  disabled={loading} 
                  className="w-full h-12 text-base font-semibold btn-gradient"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </>
                  )}
                </Button>
              </div>
              <div className="mt-4 flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                <input
                  type="checkbox"
                  id="activeOnly"
                  checked={activeOnly}
                  onChange={(e) => setActiveOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <label htmlFor="activeOnly" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Show only available doctors
                </label>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Recommendations */}
        {aiRecommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary-light">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">AI Recommended Doctors</h2>
                <p className="text-gray-600 mt-1">Top picks based on your preferences</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {aiRecommendations.map((doctor, index) => (
                <div key={doctor._id} className="relative">
                  <DoctorCard doctor={doctor} isAIPick={true} index={index} />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Doctors */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                {specialty ? `${specialty}s` : 'All Doctors'}
              </h2>
              <p className="text-gray-600">{doctors.length} {doctors.length === 1 ? 'doctor' : 'doctors'} found</p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="border-0 shadow-soft">
                  <CardContent className="p-6">
                    <Skeleton className="h-8 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : doctors.length === 0 ? (
            <Card className="border-0 shadow-soft">
              <CardContent className="py-16 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-xl font-semibold text-gray-500 mb-2">No doctors found</p>
                <p className="text-gray-400 mb-6">
                  Try searching with a different specialty or location
                </p>
                <Button onClick={handleSearch} variant="outline">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor, index) => (
                <DoctorCard
                  key={doctor._id}
                  doctor={doctor}
                  isAIPick={aiRecommendations.some((r) => r._id === doctor._id)}
                  index={index}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};