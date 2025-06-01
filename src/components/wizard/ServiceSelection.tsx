
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const services = [
  {
    id: 'wordpress',
    title: 'WordPress',
    description: 'Website development and maintenance services',
    icon: '🌐',
    features: ['Custom Development', 'Maintenance', 'SEO Optimization', 'Responsive Design'],
    popular: false
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    description: 'Logos, banners, and social media graphics',
    icon: '🎨',
    features: ['Logo Design', 'Social Media Graphics', 'Banners', 'Brand Identity'],
    popular: true
  },
  {
    id: 'video-editing',
    title: 'Video Editing',
    description: 'Promotional videos and social content',
    icon: '🎬',
    features: ['Promotional Videos', 'Social Content', 'Presentations', 'Motion Graphics'],
    popular: false
  },
  {
    id: 'tshirt-printing',
    title: 'T-shirt Printing',
    description: 'DTF & Embroidery custom apparel',
    icon: '👕',
    features: ['DTF Printing', 'Embroidery', 'Custom Designs', 'Bulk Orders'],
    popular: false
  }
];

interface ServiceSelectionProps {
  selectedService: string;
  onServiceSelect: (service: string) => void;
  error?: string;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  selectedService,
  onServiceSelect,
  error
}) => {
  console.log('ServiceSelection render - selectedService:', selectedService);

  const handleServiceChange = (value: string) => {
    console.log('Service selected:', value);
    onServiceSelect(value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Service</h2>
        <p className="text-gray-600">Select the service that best fits your needs</p>
      </div>

      <RadioGroup
        value={selectedService}
        onValueChange={handleServiceChange}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {services.map((service) => (
          <div key={service.id} className="relative">
            <RadioGroupItem
              value={service.id}
              id={service.id}
              className="peer sr-only"
            />
            <Label
              htmlFor={service.id}
              className="cursor-pointer block"
            >
              <Card className={`h-full transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                selectedService === service.id 
                  ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg scale-105' 
                  : 'hover:border-gray-300'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{service.icon}</div>
                    {service.popular && (
                      <Badge className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <div className="space-y-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-500">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>

      {error && (
        <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {selectedService && (
        <div className="text-center text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-200">
          ✓ {services.find(s => s.id === selectedService)?.title} selected
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;
