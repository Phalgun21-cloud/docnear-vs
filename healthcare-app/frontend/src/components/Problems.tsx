import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { AlertCircle, DollarSign, Handshake, CreditCard, Clock } from 'lucide-react';

const problems = [
  {
    icon: AlertCircle,
    title: 'No Savings for Emergencies',
    description: 'Unexpected medical expenses can drain your savings, leaving you financially vulnerable.',
    gradient: 'from-red-500 to-rose-500',
    bgGradient: 'from-red-50 to-rose-50'
  },
  {
    icon: DollarSign,
    title: 'High EMI Burden',
    description: 'Existing loans make it difficult to afford quality healthcare when you need it most.',
    gradient: 'from-orange-500 to-amber-500',
    bgGradient: 'from-orange-50 to-amber-50'
  },
  {
    icon: Handshake,
    title: 'Informal Borrowing Risks',
    description: 'Borrowing from friends or family can strain relationships and create social pressure.',
    gradient: 'from-yellow-500 to-orange-500',
    bgGradient: 'from-yellow-50 to-orange-50'
  },
  {
    icon: CreditCard,
    title: 'Private Loan Traps',
    description: 'High-interest private loans can trap you in a cycle of debt and financial stress.',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50'
  },
  {
    icon: Clock,
    title: 'Delayed or Skipped Care',
    description: 'Financial constraints force many to delay or skip essential medical treatments.',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50'
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

export const Problems = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Healthcare Financing <span className="text-gradient">Problems</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Many people face financial challenges when accessing quality healthcare
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {problems.map((problem, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="card-hover border-0 shadow-soft h-full overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-br ${problem.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <CardContent className="p-6 relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${problem.gradient} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <problem.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{problem.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{problem.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
