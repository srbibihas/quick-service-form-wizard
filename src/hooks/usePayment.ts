
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FormData } from '@/types/booking';
import { supabase } from '@/integrations/supabase/client';

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createPayment = async (formData: FormData, amount: number) => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          service: formData.service,
          serviceDetails: formData.serviceDetails,
          contactInfo: formData.contactInfo,
          files: formData.files,
          amount,
          currency: 'MAD'
        }
      });

      if (error) {
        throw new Error(error.message || 'Payment creation failed');
      }

      const { payment_url } = data;
      
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

  const verifyPayment = async (bookingId: string) => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { booking_id: bookingId }
      });

      if (error) {
        throw new Error('Payment verification failed');
      }

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
