
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const services = [
  {
    id: 'wordpress',
    title: 'WordPress',
    description: 'Professional website development and ongoing maintenance services',
    image: 'https://images.pexels.com/photos/326514/pexels-photo-326514.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    features: ['Custom Design', 'SEO Optimization', 'Responsive Layout', 'Maintenance Support'],
    popular: false,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    description: 'Creative design solutions for branding and marketing materials',
    image: 'https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    features: ['Logo Design', 'Brand Identity', 'Social Media Graphics', 'Print Materials'],
    popular: true,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'video-editing',
    title: 'Video Editing',
    description: 'Professional video production and post-production services',
    image: 'https://images.pexels.com/photos/257904/pexels-photo-257904.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    features: ['Promotional Videos', 'Social Content', 'Motion Graphics', 'Color Grading'],
    popular: false,
    color: 'from-green-500 to-teal-500'
  },
  {
    id: 'tshirt-printing',
    title: 'T-shirt Printing',
    description: 'High-quality custom apparel with DTF and embroidery options',
    image: 'https://images.pexels.com/photos/5727002/pexels-photo-5727002.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    features: ['DTF Printing', 'Embroidery', 'Custom Designs', 'Bulk Orders'],
    popular: false,
    color: 'from-orange-500 to-red-500'
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
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Choose Your Service
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Select the service that best fits your needs and let's bring your vision to life
        </p>
      </div>

      <RadioGroup
        value={selectedService}
        onValueChange={handleServiceChange}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {services.map((service) => (
          <div key={service.id} className="group relative">
            <RadioGroupItem
              value={service.id}
              id={service.id}
              className="peer sr-only"
            />
            <Label
              htmlFor={service.id}
              className="cursor-pointer block h-full"
            >
              <Card className={`h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group-hover:scale-[1.02] ${
                selectedService === service.id 
                  ? 'ring-2 ring-primary shadow-2xl -translate-y-2 scale-[1.02] bg-gradient-to-br from-background to-primary/5' 
                  : 'hover:border-primary/30 shadow-lg'
              }`}>
                <CardContent className="p-0 h-full flex flex-col">
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-20`}></div>
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      {service.popular && (
                        <Badge className={`bg-gradient-to-r ${service.color} text-white font-semibold shadow-lg border-0 animate-pulse`}>
                          ⭐ Popular
                        </Badge>
                      )}
                      {selectedService === service.id && (
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-50">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Service Title Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {service.description}
                      </p>
                    </div>
                    
                    {/* Features Grid */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider border-b border-border pb-2">
                        What's Included
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {service.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.color} flex-shrink-0`}></div>
                            <span className="text-muted-foreground font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {selectedService === service.id && (
                      <div className={`mt-4 p-3 rounded-lg bg-gradient-to-r ${service.color} bg-opacity-10 border border-primary/20`}>
                        <div className="flex items-center justify-center text-primary font-semibold text-sm">
                          <Check className="w-4 h-4 mr-2" />
                          Selected Service
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="text-destructive text-sm text-center font-medium">
            {error}
          </div>
        </div>
      )}

      {selectedService && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-6 py-3 rounded-full border border-green-200 font-medium">
            <Check className="w-4 h-4" />
            <span>{services.find(s => s.id === selectedService)?.title} selected</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;
