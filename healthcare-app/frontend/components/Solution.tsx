import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Zap, FileText, Shield, Building2, Sparkles, CheckCircle } from 'lucide-react';

const solutions = [
  {
    icon: Zap,
    title: 'Instant Fund Disbursal',
    description: 'Get immediate approval and access to funds within 2 minutes of application.',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50'
  },
  {
    icon: FileText,
    title: 'Paperless Onboarding',
    description: 'Complete your application entirely online with minimal documentation required.',
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-50 to-emerald-50'
  },
  {
    icon: Shield,
    title: 'No Collateral Required',
    description: 'Get healthcare financing without pledging any assets or collateral.',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50'
  },
  {
    icon: Building2,
    title: 'Care + Credit at Clinics',
    description: 'Access treatment and financing at the same time, right at partner clinics.',
    gradient: 'from-orange-500 to-red-500',
    bgGradient: 'from-orange-50 to-red-50'
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Affordable EMIs',
    description: 'Smart algorithms suggest the most affordable EMI plans tailored to your needs.',
    gradient: 'from-teal-500 to-primary',
    bgGradient: 'from-teal-50 to-primary/10'
  }
];

const metrics = [
  { label: '0% Interest', value: 'First 3 Months', icon: CheckCircle, color: 'text-green-600' },
  { label: '₹5K+ Minimum', value: 'Treatment Amount', icon: CheckCircle, color: 'text-blue-600' },
  { label: '24/7 Support', value: 'Always Available', icon: CheckCircle, color: 'text-primary' }
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

export const Solution = () => {
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
            Our <span className="text-gradient">Solution</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Instant, affordable healthcare financing that puts your health first
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {solutions.map((solution, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="card-hover border-0 shadow-soft h-full overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-br ${solution.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <CardContent className="p-6 relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${solution.gradient} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <solution.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{solution.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{solution.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-soft text-center bg-gradient-to-br from-primary/5 to-white">
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 ${metric.color} mb-4`}>
                    <metric.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.label}</h3>
                  <p className="text-gray-600">{metric.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
