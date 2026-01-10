import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, MapPin, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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

interface DoctorCardProps {
  doctor: Doctor;
  isAIPick?: boolean;
  index?: number;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, isAIPick = false, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card className={cn(
        'card-hover h-full border-0 shadow-soft overflow-hidden group relative',
        isAIPick && 'ring-2 ring-primary/50 shadow-glow-primary'
      )}>
        {/* AI Badge */}
        {isAIPick && (
          <div className="absolute -top-3 -right-3 z-10 bg-gradient-to-r from-primary via-primary-light to-teal-400 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg animate-pulse-slow">
            <Sparkles className="h-3.5 w-3.5 fill-current" />
            <span>AI Pick</span>
          </div>
        )}

        <CardContent className="p-6 relative">
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0" />
          
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                  {doctor.name}
                </h3>
                <p className="text-primary font-semibold text-sm mb-2">{doctor.specialist}</p>
              </div>
              {doctor.location && (
                <div className="flex-shrink-0 p-2 rounded-lg bg-gray-100 group-hover:bg-primary/10 transition-colors">
                  <MapPin className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-bold text-gray-900">{doctor.rating}</span>
              </div>
              <span className="text-sm text-gray-500">
                ({Math.floor(Math.random() * 100) + 20} reviews)
              </span>
            </div>

            {/* Available Slots */}
            {doctor.availableSlots && doctor.availableSlots.length > 0 && (
              <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-blue-50/50">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  {doctor.availableSlots.length} slots available today
                </span>
              </div>
            )}

            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <Badge 
                variant={doctor.active ? 'success' : 'secondary'}
                className="text-xs font-semibold px-3 py-1"
              >
                {doctor.active ? '✓ Available' : 'Unavailable'}
              </Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0 px-6 pb-6 relative z-10">
          <Link to={`/doctors/${doctor._id}`} className="w-full">
            <Button className="w-full btn-gradient group/btn">
              <span>View Profile</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
