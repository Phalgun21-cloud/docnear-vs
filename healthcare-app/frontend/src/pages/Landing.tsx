import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { motion } from 'framer-motion';
import { Search, CheckCircle, Sparkles, Clock, Heart, ArrowRight, Stethoscope, Users, Star, Calendar } from 'lucide-react';
import { useState } from 'react';

const specialties = [
  { name: 'Cardiologist', icon: '❤️', color: 'bg-gradient-to-br from-red-50 to-red-100', iconBg: 'bg-red-100', textColor: 'text-red-600' },
  { name: 'Dermatologist', icon: '✨', color: 'bg-gradient-to-br from-purple-50 to-purple-100', iconBg: 'bg-purple-100', textColor: 'text-purple-600' },
  { name: 'Orthopedist', icon: '🦴', color: 'bg-gradient-to-br from-blue-50 to-blue-100', iconBg: 'bg-blue-100', textColor: 'text-blue-600' },
  { name: 'Neurologist', icon: '🧠', color: 'bg-gradient-to-br from-yellow-50 to-yellow-100', iconBg: 'bg-yellow-100', textColor: 'text-yellow-600' },
  { name: 'Pediatrician', icon: '👶', color: 'bg-gradient-to-br from-pink-50 to-pink-100', iconBg: 'bg-pink-100', textColor: 'text-pink-600' },
  { name: 'Gynecologist', icon: '🌸', color: 'bg-gradient-to-br from-green-50 to-green-100', iconBg: 'bg-green-100', textColor: 'text-green-600' },
];

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

export const Landing = () => {
  const [specialty, setSpecialty] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-teal-100/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 text-primary font-semibold text-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Doctor Recommendations</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
            >
              <span className="text-gradient">Find Trusted</span>
              <br />
              <span className="text-gray-900">Doctors Near You</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Connect with verified healthcare professionals instantly. 
              Book appointments, get quality care, and manage your health effortlessly.
            </motion.p>

            {/* Enhanced Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Card className="glass-effect p-2 shadow-2xl border-0">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        placeholder="Search by specialty (e.g., Cardiologist)"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="h-14 pl-12 text-lg border-0 bg-white/50 focus:bg-white transition-all"
                      />
                    </div>
                    <Link to={`/search?specialist=${specialty}`} className="w-full md:w-auto">
                      <Button size="lg" className="btn-gradient h-14 px-8 text-lg font-semibold w-full md:w-auto group">
                        <span>Find Doctors</span>
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-8 mt-12"
            >
              {[
                { label: 'Verified Doctors', value: '10,000+', icon: Stethoscope },
                { label: 'Happy Patients', value: '500K+', icon: Users },
                { label: 'Avg Rating', value: '4.8', icon: Star },
              ].map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: CheckCircle,
                title: 'Verified Doctors',
                description: 'All doctors are verified, licensed, and background-checked',
                color: 'text-green-600',
                bgColor: 'bg-green-100',
              },
              {
                icon: Sparkles,
                title: 'AI Recommendations',
                description: 'Get personalized doctor recommendations powered by AI',
                color: 'text-primary',
                bgColor: 'bg-primary/10',
              },
              {
                icon: Clock,
                title: 'Instant Booking',
                description: 'Book appointments in minutes, available 24/7',
                color: 'text-blue-600',
                bgColor: 'bg-blue-100',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center group"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${item.bgColor} ${item.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Top Specialties */}
      <section className="py-20 bg-gradient-to-b from-transparent to-gray-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Browse by <span className="text-gradient">Specialty</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the right specialist for your health needs
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {specialties.map((spec) => (
              <motion.div
                key={spec.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to={`/search?specialist=${spec.name}`}>
                  <Card className="card-hover h-full text-center border-0 shadow-soft cursor-pointer overflow-hidden relative group">
                    <div className={`absolute inset-0 ${spec.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <CardContent className="p-6 relative z-10">
                      <div className={`text-5xl mb-4 ${spec.iconBg} w-16 h-16 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        {spec.icon}
                      </div>
                      <h3 className={`font-semibold text-gray-900 group-hover:${spec.textColor} transition-colors`}>
                        {spec.name}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to get the care you need
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                title: 'Search Doctors',
                description: 'Find doctors by specialty or location using our intelligent search',
                icon: Search,
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                step: '2',
                title: 'Book Appointment',
                description: 'Select a time slot and book instantly with one click',
                icon: Calendar,
                gradient: 'from-primary to-teal-500',
              },
              {
                step: '3',
                title: 'Get Treatment',
                description: 'Visit the doctor and receive quality healthcare services',
                icon: Heart,
                gradient: 'from-pink-500 to-rose-500',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="relative text-center group"
              >
                {/* Connection Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent transform translate-x-4" />
                )}
                
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${item.gradient} text-white text-3xl font-bold mb-6 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                    {item.step}
                  </div>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${item.gradient} text-white mb-4 shadow-md`}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-light to-teal-400" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns=' http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join thousands of happy patients who trust DocNear for their healthcare needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-semibold shadow-2xl hover:shadow-glow-primary transition-all">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/search">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                  Browse Doctors
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
