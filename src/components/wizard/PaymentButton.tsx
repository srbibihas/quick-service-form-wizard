
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { FormData, PRICING } from '@/types/booking';

interface PaymentButtonProps {
  formData: FormData;
  disabled?: boolean;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ formData, disabled }) => {
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

  const generateWhatsAppMessage = () => {
    const serviceNames = {
      'wordpress': 'WordPress',
      'graphic-design': 'Graphic Design',
      'video-editing': 'Video Editing',
      'tshirt-printing': 'T-shirt Printing'
    };

    const serviceName = serviceNames[formData.service as keyof typeof serviceNames] || formData.service;
    
    let message = `🎯 NEW SERVICE REQUEST\n\n`;
    message += `📋 SERVICE: ${serviceName}\n`;
    message += `👤 CLIENT: ${formData.contactInfo.name}\n`;
    message += `📱 PHONE: ${formData.contactInfo.phone}\n`;
    message += `📧 EMAIL: ${formData.contactInfo.email}\n\n`;

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

  const handleWhatsAppSubmit = () => {
    const message = generateWhatsAppMessage();
    const phoneNumber = "+212634653205";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // Clear form data from localStorage after successful submission
    localStorage.removeItem('bookingFormData');
    
    window.open(whatsappUrl, '_blank');
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
          Send order via WhatsApp
        </p>
      </div>
      
      <Button
        onClick={handleWhatsAppSubmit}
        disabled={disabled}
        size="lg"
        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 w-full"
      >
        <Send className="w-5 h-5 mr-2" />
        Pay {price} DHS (Pay Later)
      </Button>
      
      <p className="text-xs text-gray-500 mt-2">
        Send order details to WhatsApp and arrange payment later
      </p>
    </div>
  );
};

export default PaymentButton;
