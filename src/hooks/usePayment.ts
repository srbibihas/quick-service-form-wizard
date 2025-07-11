
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FormData } from '@/types/booking';

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateWhatsAppMessage = (formData: FormData, paymentStatus: string) => {
    const serviceNames = {
      'wordpress': 'WordPress',
      'graphic-design': 'Graphic Design',
      'video-editing': 'Video Editing',
      'tshirt-printing': 'T-shirt Printing'
    };

    const serviceName = serviceNames[formData.service as keyof typeof serviceNames] || formData.service;
    
    let message = `🎯 NEW SERVICE REQUEST - PAID\n\n`;
    message += `📋 SERVICE: ${serviceName}\n`;
    message += `👤 CLIENT: ${formData.contactInfo.name}\n`;
    message += `📱 PHONE: ${formData.contactInfo.phone}\n`;
    message += `📧 EMAIL: ${formData.contactInfo.email}\n`;
    message += `💳 PAYMENT STATUS: ${paymentStatus.toUpperCase()}\n\n`;

    if (formData.files.length > 0) {
      message += `📎 FILES (${formData.files.length}):\n`;
      formData.files.forEach((file, index) => {
        message += `- ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)\n`;
      });
      message += `\n🔗 DOWNLOAD LINKS:\n`;
      formData.files.forEach((file, index) => {
        message += `File ${index + 1}: ${file.url}\n`;
      });
      message += `\n`;
    }

    message += `📋 SPECIFIC REQUIREMENTS:\n`;
    Object.entries(formData.serviceDetails).forEach(([key, value]) => {
      if (value) {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        const formattedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        message += `• ${formattedKey}: ${formattedValue}\n`;
      }
    });

    message += `\n⚡ SUBMIT DATE: ${new Date().toLocaleString()}\n`;
    message += `\n💼 Contact preference: ${formData.contactInfo.preferredContact}`;

    return encodeURIComponent(message);
  };

  const createPayment = async (formData: FormData, amount: number, currency: string = 'MAD') => {
    setIsLoading(true);
    
    try {
      console.log('Creating payment for:', formData.service, 'Amount:', amount, currency);
      
      // Remove authentication requirement - call function directly
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          service: formData.service,
          serviceDetails: formData.serviceDetails,
          contactInfo: formData.contactInfo,
          files: formData.files,
          amount: amount,
          currency: currency
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

      // Clear form data from localStorage before redirect
      localStorage.removeItem('bookingFormData');

      // Store payment success callback for when user returns
      localStorage.setItem('paymentFormData', JSON.stringify(formData));
      localStorage.setItem('paymentReturnUrl', window.location.href);

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
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { booking_id: bookingId }
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

  const sendWhatsAppAfterPayment = (formData: FormData, paymentStatus: string) => {
    const message = generateWhatsAppMessage(formData, paymentStatus);
    const phoneNumber = "+212634653205"; // Replace with your business WhatsApp number
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return {
    createPayment,
    verifyPayment,
    sendWhatsAppAfterPayment,
    isLoading
  };
};
