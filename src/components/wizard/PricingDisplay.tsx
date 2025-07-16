
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign } from 'lucide-react';
import { FormData, PRICING, PricingInfo } from '@/types/booking';

interface PricingDisplayProps {
  formData: FormData;
}

const PricingDisplay: React.FC<PricingDisplayProps> = ({ formData }) => {
  const getPricing = (): PricingInfo | null => {
    const { service, serviceDetails } = formData;

    switch (service) {
      case 'wordpress':
        if (serviceDetails.websiteType === 'new' && serviceDetails.pageCount) {
          return PRICING.wordpress.new[serviceDetails.pageCount as keyof typeof PRICING.wordpress.new] || null;
        }
        if (serviceDetails.websiteType === 'maintenance' && serviceDetails.pageCount) {
          return PRICING.wordpress.maintenance[serviceDetails.pageCount as keyof typeof PRICING.wordpress.maintenance] || null;
        }
        break;

      case 'graphic-design':
        if (serviceDetails.designType) {
          return PRICING['graphic-design'][serviceDetails.designType as keyof typeof PRICING['graphic-design']] || null;
        }
        break;

      case 'video-editing':
        if (serviceDetails.videoLength && serviceDetails.videoLengthUnit) {
          const length = parseInt(serviceDetails.videoLength);
          const unit = serviceDetails.videoLengthUnit;
          
          if (unit === 'seconds') {
            if (length < 10) return PRICING['video-editing'].short;
            if (length <= 30) return PRICING['video-editing'].medium;
            return PRICING['video-editing'].long;
          } else if (unit === 'minutes') {
            if (length <= 0.5) return PRICING['video-editing'].long;
            return PRICING['video-editing'].long;
          }
        }
        break;

      case 'tshirt-printing':
        if (serviceDetails.printingMethod === 'dtf' && serviceDetails.quantity) {
          const quantity = parseInt(serviceDetails.quantity);
          if (quantity < 5) return PRICING['tshirt-printing'].dtf['less-than-5'];
          if (quantity <= 10) return PRICING['tshirt-printing'].dtf['5-to-10'];
          return PRICING['tshirt-printing'].dtf['more-than-10'];
        }
        
        if (serviceDetails.printingMethod === 'embroidery' && 
            serviceDetails.embroideryGarmentType && 
            serviceDetails.embroideryType && 
            serviceDetails.quantity) {
          const quantity = parseInt(serviceDetails.quantity);
          const garmentType = serviceDetails.embroideryGarmentType as 'hoodie' | 'tshirt';
          const embroideryType = serviceDetails.embroideryType as 'design' | 'logo';
          
          let quantityKey: 'less-than-5' | '5-to-10' | 'more-than-10';
          if (quantity < 5) quantityKey = 'less-than-5';
          else if (quantity <= 10) quantityKey = '5-to-10';
          else quantityKey = 'more-than-10';
          
          return PRICING['tshirt-printing'].embroidery[garmentType][embroideryType][quantityKey] || null;
        }
        break;
    }

    return null;
  };

  const pricing = getPricing();

  if (!pricing) return null;

  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">Estimated Price</span>
          </div>
          <Badge className="bg-green-600 text-white text-lg px-3 py-1">
            ${pricing.price}
          </Badge>
        </div>
        {pricing.description && (
          <p className="text-sm text-green-700 mt-2">{pricing.description}</p>
        )}
        <p className="text-xs text-green-600 mt-2">
          * Final price may vary based on specific requirements
        </p>
      </CardContent>
    </Card>
  );
};

export default PricingDisplay;
