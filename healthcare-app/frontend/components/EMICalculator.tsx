import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Calculator, TrendingUp, Calendar, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export const EMICalculator = () => {
  const [amount, setAmount] = useState<string>('10000');
  const [tenure, setTenure] = useState<string>('3');
  const [calculated, setCalculated] = useState<any>(null);

  const calculateEMI = () => {
    const principal = parseFloat(amount) || 0;
    const months = parseInt(tenure) || 3;
    
    if (principal < 5000) {
      alert('Minimum amount is ₹5,000');
      return;
    }

    const emiAmount = principal / months;
    const totalAmount = principal; // 0% interest for first 3 months

    setCalculated({
      principal,
      tenure: months,
      emiAmount: Math.round(emiAmount),
      totalAmount,
      interestRate: 0,
      firstThreeMonths: months <= 3
    });
  };

  return (
    <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-primary to-primary-light text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <Calculator className="w-6 h-6" />
          <CardTitle className="text-xl font-bold">EMI Calculator</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Treatment Amount (₹)
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="h-12 text-lg"
              min="5000"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum: ₹5,000</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tenure (Months)
            </label>
            <Input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              placeholder="Enter months"
              className="h-12 text-lg"
              min="1"
              max="12"
            />
            <p className="text-xs text-gray-500 mt-1">0% interest for first 3 months</p>
          </div>

          <Button
            onClick={calculateEMI}
            className="w-full btn-gradient h-12 text-base font-semibold"
          >
            Calculate EMI
          </Button>
        </div>

        {calculated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-6 bg-gradient-to-br from-primary/5 to-teal-50 rounded-xl border-2 border-primary/20 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <span className="font-semibold text-gray-700">Monthly EMI</span>
              </div>
              <span className="text-2xl font-bold text-primary">
                ₹{calculated.emiAmount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-semibold text-gray-700">Total Amount</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                ₹{calculated.totalAmount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-700">Interest Rate</span>
              </div>
              <span className="text-xl font-bold text-green-600">
                {calculated.interestRate}%
              </span>
            </div>

            {calculated.firstThreeMonths && (
              <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                <p className="text-sm font-semibold text-green-800 text-center">
                  ✨ 0% Interest for First 3 Months!
                </p>
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
