import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { motion } from 'framer-motion';
import { TestTube, Calendar, Users, FileText, TrendingUp, Clock } from 'lucide-react';
import { labAPI } from '../services/api';
import { LabResultUpload } from '../components/LabResultUpload';

export const LabDashboard = () => {
  const { user } = useAuth();
  const [labTests, setLabTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchLabTests();
    }
  }, [user]);

  const fetchLabTests = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const response = await labAPI.getLabTests(user.id);
      setLabTests(response.data.labTests || []);
    } catch (error) {
      console.error('Failed to fetch lab tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
      label: 'Total Tests', 
      value: labTests.length.toString(), 
      icon: TestTube, 
      color: 'from-blue-500 to-cyan-500' 
    },
    { 
      label: 'Pending Results', 
      value: labTests.filter(t => t.status === 'Pending' || t.status === 'In Progress').length.toString(), 
      icon: Clock, 
      color: 'from-yellow-500 to-orange-500' 
    },
    { 
      label: 'Completed', 
      value: labTests.filter(t => t.status === 'Completed').length.toString(), 
      icon: FileText, 
      color: 'from-green-500 to-emerald-500' 
    },
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
            Welcome, <span className="text-gradient">{user?.name}</span>! 👋
          </h1>
          <p className="text-xl text-gray-600">Lab Dashboard - Manage your test orders and results</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
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
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Test Orders */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">Recent Test Orders</CardTitle>
                  <p className="text-sm text-gray-600">Latest test requests and results</p>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : labTests.length === 0 ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                    <TestTube className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-lg font-semibold text-gray-500 mb-2">No test orders yet</p>
                  <p className="text-gray-400">Test orders will appear here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {labTests.map((test, index) => (
                    <motion.div
                      key={test._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <LabResultUpload labTest={test} onUploadSuccess={fetchLabTests} />
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
