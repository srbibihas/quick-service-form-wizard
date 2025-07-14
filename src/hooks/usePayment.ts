
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
          service: formData.service,
          serviceDetails: formData.serviceDetails,
          contactInfo: formData.contactInfo,
          files: formData.files,
          amount,
          currency: 'MAD'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment creation failed');
      }

      const { payment_url } = await response.json();
      
      // Redirect to DODO checkout page
      window.location.href = payment_url;

    } catch (error) {
      console.error('Payment creation error:', error);
      toast({
        title: 'Payment Error',
        description: error instanceof Error ? error.message : 'There was an error creating your payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (paymentId: string) => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/verify-payment?payment_id=${paymentId}`, {
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
