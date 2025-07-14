import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, Home, CreditCard } from 'lucide-react';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="text-2xl font-semibold text-red-500">Payment Cancelled</h2>
            <p>Your payment was cancelled. You can try again or return to the home page.</p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => window.history.back()} className="mt-4">
                <CreditCard className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={() => navigate('/')} variant="outline" className="mt-2">
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancel;
