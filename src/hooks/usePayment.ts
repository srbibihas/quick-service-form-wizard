
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FormData } from '@/types/booking';

declare global {
  interface Window {
    paypal: any;
  }
}

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createPayPalPayment = (formData: FormData, amount: number, onSuccess: () => void) => {
    return {
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: amount.toString(),
              currency_code: 'USD'
            },
            description: `${formData.service} service`
          }]
        });
      },
      onApprove: async (data: any, actions: any) => {
        try {
          setIsLoading(true);
          const details = await actions.order.capture();
          
          // Store booking data
          const bookingData = {
            service: formData.service,
            serviceDetails: formData.serviceDetails,
            contactInfo: formData.contactInfo,
            files: formData.files,
            amount,
            currency: 'USD',
            paypalOrderId: details.id,
            status: 'paid'
          };
          
          localStorage.setItem('completedBooking', JSON.stringify(bookingData));
          
          toast({
            title: 'Payment Successful',
            description: 'Your payment has been processed successfully!',
          });
          
          onSuccess();
        } catch (error) {
          console.error('Payment capture error:', error);
          toast({
            title: 'Payment Error',
            description: 'There was an error processing your payment.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
        toast({
          title: 'Payment Error',
          description: 'There was an error with PayPal. Please try again.',
          variant: 'destructive',
        });
      }
    };
  };

  return {
    createPayPalPayment,
    isLoading,
  };
};
