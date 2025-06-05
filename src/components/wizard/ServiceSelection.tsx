
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
    image: 'https://images.pexels.com/photos/326514/pexels-photo-326514.jpeg?auto=compress&cs=tinysrgb&w=600&fit=crop',
    features: ['Maintenance', 'SEO Optimization', 'Responsive Design'],
    popular: false
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    description: 'Logos, banners, and social media graphics',
    image: 'https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    features: ['Logo Design', 'Social Media Graphics', 'Banners', 'Brand Identity'],
    popular: true
  },
  {
    id: 'video-editing',
    title: 'Video Editing',
    description: 'Promotional videos and social content',
    image: 'https://images.pexels.com/photos/257904/pexels-photo-257904.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    features: ['Promotional Videos', 'Social Content', 'Presentations', 'Motion Graphics'],
    popular: false
  },
  {
    id: 'tshirt-printing',
    title: 'T-shirt Printing',
    description: 'DTF & Embroidery custom apparel',
    image: 'https://images.pexels.com/photos/5727002/pexels-photo-5727002.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
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
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
              <Card className={`h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                selectedService === service.id 
                  ? 'ring-2 ring-blue-500 border-blue-500 shadow-xl -translate-y-1 bg-blue-50' 
                  : 'hover:border-blue-200 bg-white'
              }`}>
                <CardContent className="p-0 overflow-hidden">
                  {/* Image section with fixed aspect ratio */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    {service.popular && (
                      <Badge className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow-lg border-0">
                        Popular
                      </Badge>
                    )}
                    {/* Selection indicator */}
                    {selectedService === service.id && (
                      <div className="absolute top-3 left-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Content section */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    
                    {/* Features list */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        What's Included:
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {service.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>

      {error && (
        <div className="text-red-600 text-sm text-center bg-red-50 p-4 rounded-lg border border-red-200 font-medium">
          {error}
        </div>
      )}

      {selectedService && (
        <div className="text-center text-green-700 text-sm bg-green-50 p-4 rounded-lg border border-green-200 font-medium">
          ✓ {services.find(s => s.id === selectedService)?.title} selected
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;
