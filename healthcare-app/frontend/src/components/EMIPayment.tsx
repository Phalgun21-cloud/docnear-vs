import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';
import { CreditCard, CheckCircle, Calendar } from 'lucide-react';
import { paymentsAPI } from '../services/api';

interface EMI {
  _id: string;
  amount: number;
  emiAmount: number;
  tenure: number;
  paidAmount: number;
  remainingAmount: number;
  status: string;
  nextPaymentDate: string;
  serviceId?: {
    name: string;
    type: string;
  };
}

interface EMIPaymentProps {
  emi: EMI;
  onPaymentSuccess: () => void;
}

export const EMIPayment = ({ emi, onPaymentSuccess }: EMIPaymentProps) => {
  const { toast } = useToast();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const response = await paymentsAPI.processEMIPayment({
        emiId: emi._id,
        amount: emi.emiAmount
      });

      if (response.data.success) {
        toast({
          title: 'Payment Successful!',
          description: `₹${emi.emiAmount.toLocaleString()} paid successfully.`,
        });
        setPaymentOpen(false);
        onPaymentSuccess();
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

  const isPaymentDue = new Date(emi.nextPaymentDate) <= new Date();
  const progress = (emi.paidAmount / emi.amount) * 100;

  return (
    <>
      <Card className="border border-gray-200 hover:border-primary/50 transition-colors">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg mb-1">
                {emi.serviceId?.name || 'Healthcare Service'}
              </CardTitle>
              <p className="text-sm text-gray-600">{emi.serviceId?.type || 'Service'}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              emi.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {emi.status}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Monthly EMI</p>
              <p className="text-lg font-bold text-primary">
                ₹{emi.emiAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Remaining</p>
              <p className="text-lg font-bold text-gray-900">
                ₹{emi.remainingAmount.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">Payment Progress</span>
              <span className="text-xs font-semibold text-gray-900">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Next: {new Date(emi.nextPaymentDate).toLocaleDateString()}</span>
            </div>
            <Button
              onClick={() => setPaymentOpen(true)}
              variant={isPaymentDue ? "default" : "outline"}
              size="sm"
              className={isPaymentDue ? "btn-gradient" : ""}
            >
              {isPaymentDue ? 'Pay Now' : 'Pay Early'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pay EMI</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">EMI Amount</span>
                <span className="text-2xl font-bold text-primary">
                  ₹{emi.emiAmount.toLocaleString()}
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-primary/20 text-sm text-gray-600">
                Remaining: ₹{emi.remainingAmount.toLocaleString()}
              </div>
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
              onClick={handlePayment}
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
                  Pay ₹{emi.emiAmount.toLocaleString()}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
