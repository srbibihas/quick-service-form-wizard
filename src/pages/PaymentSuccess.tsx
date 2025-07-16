
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePayment } from '@/hooks/usePayment';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { verifyPayment } = usePayment();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      if (!bookingId) {
        toast({
          title: "Error",
          description: "No booking ID found",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      try {
        const result = await verifyPayment(bookingId);
        setPaymentStatus(result.payment_status);
      } catch (error) {
        console.error('Error verifying payment:', error);
        toast({
          title: "Payment Verification Failed",
          description: "There was an error verifying your payment. Please contact support.",
          variant: "destructive",
        });
        setPaymentStatus('failed');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPaymentStatus();
  }, [bookingId, navigate, toast, verifyPayment]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Payment Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isVerifying ? (
            <div className="text-center">
              <p>Verifying payment...</p>
            </div>
          ) : paymentStatus === 'succeeded' || paymentStatus === 'paid' ? (
            <div className="text-center space-y-4">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <h2 className="text-2xl font-semibold text-green-500">Payment Successful!</h2>
              <p>Thank you for your payment. We will process your order shortly.</p>
              <Button onClick={() => navigate('/')} className="mt-4">
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
              <h2 className="text-2xl font-semibold text-red-500">Payment Failed</h2>
              <p>There was a problem with your payment. Please try again or contact support.</p>
              <Button onClick={() => navigate('/')} className="mt-4">
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
