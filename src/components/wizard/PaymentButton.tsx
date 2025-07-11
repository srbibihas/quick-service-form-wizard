
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { usePayment } from '@/hooks/usePayment';
import { FormData, PRICING } from '@/types/booking';

interface PaymentButtonProps {
  formData: FormData;
  disabled?: boolean;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ formData, disabled }) => {
  const { createPayment, isLoading } = usePayment();

  const calculatePrice = (): number => {
    const service = formData.service;
    const details = formData.serviceDetails;

    if (service === 'wordpress') {
      if (details.websiteType === 'new' && details.pageCount) {
        return PRICING.wordpress.new[details.pageCount as keyof typeof PRICING.wordpress.new]?.price || 0;
      } else if (details.websiteType === 'maintenance' && details.pageCount) {
        return PRICING.wordpress.maintenance[details.pageCount as keyof typeof PRICING.wordpress.maintenance]?.price || 0;
      }
    } else if (service === 'graphic-design' && details.designType) {
      return PRICING['graphic-design'][details.designType as keyof typeof PRICING['graphic-design']]?.price || 0;
    } else if (service === 'video-editing') {
      const length = details.videoLength;
      const unit = details.videoLengthUnit || 'seconds';
      
      if (unit === 'seconds' && length) {
        const seconds = parseInt(length);
        if (seconds < 10) return PRICING['video-editing'].short.price;
        if (seconds <= 30) return PRICING['video-editing'].medium.price;
        return PRICING['video-editing'].long.price;
      } else if (unit === 'minutes' && length) {
        const minutes = parseInt(length);
        if (minutes < 1) return PRICING['video-editing'].short.price;
        if (minutes <= 2) return PRICING['video-editing'].medium.price;
        return PRICING['video-editing'].long.price;
      }
    } else if (service === 'tshirt-printing') {
      const method = details.printingMethod;
      const quantity = details.quantity;
      
      if (method === 'dtf' && quantity) {
        const qty = parseInt(quantity);
        if (qty < 5) return PRICING['tshirt-printing'].dtf['less-than-5'].price;
        if (qty <= 10) return PRICING['tshirt-printing'].dtf['5-to-10'].price;
        return PRICING['tshirt-printing'].dtf['more-than-10'].price;
      } else if (method === 'embroidery' && quantity) {
        const garmentType = details.embroideryGarmentType || 'tshirt';
        const embType = details.embroideryType || 'logo';
        const qty = parseInt(quantity);
        
        const pricingPath = PRICING['tshirt-printing'].embroidery[garmentType as 'hoodie' | 'tshirt']?.[embType as 'design' | 'logo'];
        
        if (pricingPath) {
          if (qty < 5) return pricingPath['less-than-5'].price;
          if (qty <= 10) return pricingPath['5-to-10'].price;
          return pricingPath['more-than-10'].price;
        }
      }
    }

    return 0;
  };

  const handlePayment = async () => {
    const amount = calculatePrice();
    
    if (amount <= 0) {
      console.error('Invalid amount calculated:', amount);
      return;
    }

    await createPayment(formData, amount, 'MAD');
  };

  const price = calculatePrice();

  if (price <= 0) {
    return null;
  }

  return (
    <div className="text-center pt-4">
      <div className="mb-4">
        <p className="text-2xl font-bold text-gray-900">
          {price} DHS
        </p>
        <p className="text-sm text-gray-600">
          Secure payment via DODO
        </p>
      </div>
      
      <Button
        onClick={handlePayment}
        disabled={disabled || isLoading}
        size="lg"
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            Pay {price} DHS
          </>
        )}
      </Button>
      
      <p className="text-xs text-gray-500 mt-2">
        You will be redirected to DODO's secure payment page
      </p>
    </div>
  );
};

export default PaymentButton;
