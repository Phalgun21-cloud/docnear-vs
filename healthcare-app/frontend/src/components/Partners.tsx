import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Building2, TrendingUp, Shield, ArrowRight } from 'lucide-react';

const partners = [
  {
    icon: Building2,
    title: 'Clinics',
    count: '500+',
    description: 'Partner clinics across India providing quality healthcare services',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50'
  },
  {
    icon: TrendingUp,
    title: 'NBFCs',
    count: 'Top 10',
    description: 'Leading financial partners ensuring quick and easy loan approvals',
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-50 to-emerald-50'
  },
  {
    icon: Shield,
    title: 'Insurance',
    count: 'Leading',
    description: 'Top insurance companies providing comprehensive coverage options',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50'
  }
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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export const Partners = () => {
  return (
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
            Our <span className="text-gradient">Partners</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trusted network of healthcare providers and financial partners
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          {partners.map((partner, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="card-hover border-0 shadow-soft h-full overflow-hidden group text-center">
                <div className={`absolute inset-0 bg-gradient-to-br ${partner.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <CardContent className="p-8 relative z-10">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${partner.gradient} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 mx-auto`}>
                    <partner.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{partner.title}</h3>
                  <p className="text-3xl font-bold text-primary mb-4">{partner.count}</p>
                  <p className="text-gray-600 leading-relaxed">{partner.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Partnership CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Card className="border-0 shadow-soft bg-gradient-to-r from-primary/10 to-teal-50 inline-block">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Want to Partner With Us?
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Join our network and help make healthcare accessible to everyone
              </p>
              <Button className="btn-gradient h-12 px-8 text-base font-semibold group">
                <span>Become a Partner</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
