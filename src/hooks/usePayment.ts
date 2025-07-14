import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FormData } from '@/types/booking';

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createPayment = async (formData: FormData, amount: number) => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          description: `${formData.service} service booking`,
          customerEmail: formData.contactInfo.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment creation failed');
      }

      const { url } = await response.json();
      
      // Redirect to Stripe checkout page
      window.location.href = url;

    } catch (error) {
      console.error('Payment creation error:', error);
      toast({
        title: 'Payment Error',
        description: 'There was an error creating your payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (sessionId: string) => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/verify-payment?session_id=${sessionId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPayment,
    verifyPayment,
    isLoading,
  };
};
