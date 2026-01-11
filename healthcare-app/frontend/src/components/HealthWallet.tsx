import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Shield, Download, Calendar, CreditCard, CheckCircle } from 'lucide-react';
import { emiAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { EMIPayment } from './EMIPayment';

interface EMI {
  _id: string;
  amount: number;
  emiAmount: number;
  tenure: number;
  paidAmount: number;
  remainingAmount: number;
  status: string;
  nextPaymentDate: string;
  serviceId: {
    name: string;
    type: string;
  };
}

export const HealthWallet = () => {
  const { user } = useAuth();
  const [emis, setEmis] = useState<EMI[]>([]);
  const [loading, setLoading] = useState(true);
  const [creditLimit] = useState(50000);
  const [availableCredit, setAvailableCredit] = useState(50000);

  useEffect(() => {
    if (user?.id) {
      fetchEMIs();
    }
  }, [user]);

  const fetchEMIs = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const response = await emiAPI.getPatientEMIs(user.id);
      const fetchedEmis = response.data.emis || [];
      setEmis(fetchedEmis);
      
      // Calculate available credit
      const totalUsed = fetchedEmis
        .filter((emi: EMI) => emi.status === 'Active')
        .reduce((sum: number, emi: EMI) => sum + emi.remainingAmount, 0);
      setAvailableCredit(creditLimit - totalUsed);
    } catch (error) {
      console.error('Failed to fetch EMIs:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeEMIs = emis.filter(emi => emi.status === 'Active');
  const completedEMIs = emis.filter(emi => emi.status === 'Completed');

  return (
    <div className="space-y-6">
      {/* Credit Availability Card */}
      <Card className="border-0 shadow-soft bg-gradient-to-br from-primary/10 to-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary-light text-white">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Health Wallet</CardTitle>
                <p className="text-sm text-gray-600">Available credit for healthcare</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-300">
              <Shield className="w-3 h-3 mr-1" />
              Insured
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Available Credit</p>
                <p className="text-3xl font-bold text-primary">
                  ₹{availableCredit.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Credit Limit</p>
                <p className="text-3xl font-bold text-gray-900">
                  ₹{creditLimit.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Used Credit</p>
                <p className="text-3xl font-bold text-gray-700">
                  ₹{(creditLimit - availableCredit).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Progress 
                value={(creditLimit - availableCredit) / creditLimit * 100} 
                className="h-3"
              />
            </div>
          </CardContent>
        </Card>

      {/* Active EMI Plans */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Active EMI Plans</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {activeEMIs.length} active plan{activeEMIs.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20">
              {activeEMIs.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : activeEMIs.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-semibold mb-2">No active EMI plans</p>
              <p className="text-sm text-gray-500">Start by booking a service with EMI option</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeEMIs.map((emi, index) => (
                <motion.div
                  key={emi._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <EMIPayment emi={emi} onPaymentSuccess={fetchEMIs} />
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Treatment History */}
      {completedEMIs.length > 0 && (
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Treatment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedEMIs.slice(0, 5).map((emi) => (
                <div
                  key={emi._id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {emi.serviceId?.name || 'Healthcare Service'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Completed • ₹{emi.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Statement
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
