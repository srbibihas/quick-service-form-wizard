
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    // Get completed booking data from localStorage
    const completedBooking = localStorage.getItem('completedBooking');
    if (completedBooking) {
      setBookingData(JSON.parse(completedBooking));
      // Clear the data after displaying
      localStorage.removeItem('completedBooking');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="text-2xl font-semibold text-green-500">Thank you for your payment!</h2>
            <p>Your order has been received and will be processed shortly.</p>
            
            {bookingData && (
              <div className="text-left space-y-2 border rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold">Order Details:</h3>
                <p><span className="font-medium">Service:</span> {bookingData.service}</p>
                <p><span className="font-medium">Amount:</span> ${bookingData.amount}</p>
                <p><span className="font-medium">PayPal Order ID:</span> {bookingData.paypalOrderId}</p>
              </div>
            )}
            
            <Button onClick={() => navigate('/')} className="mt-4">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
