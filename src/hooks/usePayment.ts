
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FormData } from '@/types/booking';

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createPayment = async (formData: FormData, amount: number, currency: string = 'MAD') => {
    setIsLoading(true);
    
    try {
      console.log('Creating payment for:', formData.service, 'Amount:', amount, currency);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to complete your order",
          variant: "destructive"
        });
        return null;
      }

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          service: formData.service,
          serviceDetails: formData.serviceDetails,
          contactInfo: formData.contactInfo,
          files: formData.files,
          amount: amount,
          currency: currency
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) {
        console.error('Payment creation error:', error);
        toast({
          title: "Payment Error",
          description: "Failed to create payment. Please try again.",
          variant: "destructive"
        });
        return null;
      }

      console.log('Payment created successfully:', data);
      
      toast({
        title: "Payment Created",
        description: "Redirecting to payment gateway...",
      });

      // Redirect to DODO payment page
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }

      return data;

    } catch (error) {
      console.error('Payment creation failed:', error);
      toast({
        title: "Payment Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (bookingId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Authentication required');
      }

      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { booking_id: bookingId },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Payment verification failed:', error);
      throw error;
    }
  };

  return {
    createPayment,
    verifyPayment,
    isLoading
  };
};
