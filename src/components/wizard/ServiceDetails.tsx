import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { ServiceDetails as ServiceDetailsType } from '@/types/booking';

interface ServiceDetailsProps {
  service: string;
  serviceDetails: ServiceDetailsType;
  onUpdate: (details: ServiceDetailsType) => void;
  errors: Record<string, string>;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  service,
  serviceDetails,
  onUpdate,
  errors
}) => {
  const updateField = (field: string, value: string) => {
    onUpdate({ ...serviceDetails, [field]: value });
  };

  const renderWordPressFields = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">WordPress Details</h2>
      
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Project Type</Label>
          <RadioGroup
            value={serviceDetails.websiteType || ''}
            onValueChange={(value) => updateField('websiteType', value)}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="new" />
              <Label htmlFor="new">New Website</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="maintenance" id="maintenance" />
              <Label htmlFor="maintenance">Website Maintenance</Label>
            </div>
          </RadioGroup>
        </div>

        {serviceDetails.websiteType === 'new' && (
          <div>
            <Label htmlFor="websiteCategory" className="text-base font-medium">
              Website Type
            </Label>
            <Select value={serviceDetails.pageCount || ''} onValueChange={(value) => updateField('pageCount', value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select website type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="e-commerce">E-commerce</SelectItem>
                <SelectItem value="press">Press</SelectItem>
                <SelectItem value="hostel-booking">Hostel Booking</SelectItem>
                <SelectItem value="business-page">Business Page</SelectItem>
                <SelectItem value="one-page">One Page</SelectItem>
                <SelectItem value="portfolio">Portfolio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {serviceDetails.websiteType === 'maintenance' && (
          <div>
            <Label htmlFor="maintenanceService" className="text-base font-medium">
              Maintenance Service Needed
            </Label>
            <Select value={serviceDetails.pageCount || ''} onValueChange={(value) => updateField('pageCount', value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select maintenance service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="elementor">Elementor</SelectItem>
                <SelectItem value="errors">Errors</SelectItem>
                <SelectItem value="plugin-theme-installation">Plugin/Theme Installation Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label htmlFor="features" className="text-base font-medium">
            Special Features Needed
          </Label>
          <Textarea
            id="features"
            value={serviceDetails.features || ''}
            onChange={(e) => updateField('features', e.target.value)}
            placeholder="E.g., E-commerce, booking system, membership area..."
            className="mt-2"
          />
        </div>

        {serviceDetails.websiteType === 'maintenance' && (
          <div>
            <Label htmlFor="existingUrl" className="text-base font-medium">
              Existing Website URL
            </Label>
            <Input
              id="existingUrl"
              value={serviceDetails.existingUrl || ''}
              onChange={(e) => updateField('existingUrl', e.target.value)}
              placeholder="https://yourwebsite.com"
              className="mt-2"
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderGraphicDesignFields = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Graphic Design Details</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="designType" className="text-base font-medium">
            Type of Design
          </Label>
          <Select value={serviceDetails.designType || ''} onValueChange={(value) => updateField('designType', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select design type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="logo">Logo Design</SelectItem>
              <SelectItem value="banner">Banner/Header</SelectItem>
              <SelectItem value="social">Social Media Graphics</SelectItem>
              <SelectItem value="business-card">Business Card</SelectItem>
              <SelectItem value="flyer">Flyer/Poster</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="dimensions" className="text-base font-medium">
            Dimensions/Format Required
          </Label>
          <Input
            id="dimensions"
            value={serviceDetails.dimensions || ''}
            onChange={(e) => updateField('dimensions', e.target.value)}
            placeholder="E.g., 1920x1080px, Instagram post, A4 print..."
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="brandColors" className="text-base font-medium">
            Brand Colors/Preferences
          </Label>
          <Textarea
            id="brandColors"
            value={serviceDetails.brandColors || ''}
            onChange={(e) => updateField('brandColors', e.target.value)}
            placeholder="Describe your brand colors, style preferences, or attach brand guidelines..."
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="conceptCount" className="text-base font-medium">
            Number of Concepts Needed
          </Label>
          <Select value={serviceDetails.conceptCount || ''} onValueChange={(value) => updateField('conceptCount', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select concept count" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 concept</SelectItem>
              <SelectItem value="2">2 concepts</SelectItem>
              <SelectItem value="3">3 concepts</SelectItem>
              <SelectItem value="3+">3+ concepts</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderVideoEditingFields = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Video Editing Details</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="videoLength" className="text-base font-medium">
            Video Length
          </Label>
          <Select value={serviceDetails.videoLength || ''} onValueChange={(value) => updateField('videoLength', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select video length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30s">30 seconds</SelectItem>
              <SelectItem value="1min">1 minute</SelectItem>
              <SelectItem value="2-3min">2-3 minutes</SelectItem>
              <SelectItem value="5min">5 minutes</SelectItem>
              <SelectItem value="10min+">10+ minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="stylePreference" className="text-base font-medium">
            Style Preference
          </Label>
          <Select value={serviceDetails.stylePreference || ''} onValueChange={(value) => updateField('stylePreference', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="corporate">Corporate/Professional</SelectItem>
              <SelectItem value="creative">Creative/Artistic</SelectItem>
              <SelectItem value="social">Social Media Style</SelectItem>
              <SelectItem value="documentary">Documentary Style</SelectItem>
              <SelectItem value="promotional">Promotional/Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="rawFootage" className="text-base font-medium">
            Raw Footage Availability
          </Label>
          <RadioGroup
            value={serviceDetails.rawFootage || ''}
            onValueChange={(value) => updateField('rawFootage', value)}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="provided" id="provided" />
              <Label htmlFor="provided">I will provide raw footage</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="needed" id="needed" />
              <Label htmlFor="needed">Need stock footage/content creation</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="exportFormat" className="text-base font-medium">
            Export Format Needed
          </Label>
          <Select value={serviceDetails.exportFormat || ''} onValueChange={(value) => updateField('exportFormat', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mp4-hd">MP4 HD (1080p)</SelectItem>
              <SelectItem value="mp4-4k">MP4 4K</SelectItem>
              <SelectItem value="social-optimized">Social Media Optimized</SelectItem>
              <SelectItem value="web-optimized">Web Optimized</SelectItem>
              <SelectItem value="multiple">Multiple Formats</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderTshirtFields = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">T-shirt Printing Details</h2>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <p className="text-yellow-800 text-sm">
          <strong>Important:</strong> For t-shirt designs, please upload PNG files with transparent backgrounds only.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Printing Method</Label>
          <RadioGroup
            value={serviceDetails.printingMethod || ''}
            onValueChange={(value) => updateField('printingMethod', value)}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dtf" id="dtf" />
              <Label htmlFor="dtf">DTF (Direct to Film)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="embroidery" id="embroidery" />
              <Label htmlFor="embroidery">Embroidery</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="quantity" className="text-base font-medium">
            Quantity Needed
          </Label>
          <Select value={serviceDetails.quantity || ''} onValueChange={(value) => updateField('quantity', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select quantity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1-10 pieces</SelectItem>
              <SelectItem value="11-25">11-25 pieces</SelectItem>
              <SelectItem value="26-50">26-50 pieces</SelectItem>
              <SelectItem value="51-100">51-100 pieces</SelectItem>
              <SelectItem value="100+">100+ pieces</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="sizes" className="text-base font-medium">
            T-shirt Sizes Needed
          </Label>
          <Input
            id="sizes"
            value={serviceDetails.sizes || ''}
            onChange={(e) => updateField('sizes', e.target.value)}
            placeholder="E.g., S(2), M(5), L(8), XL(5)"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="colors" className="text-base font-medium">
            T-shirt Colors
          </Label>
          <Input
            id="colors"
            value={serviceDetails.colors || ''}
            onChange={(e) => updateField('colors', e.target.value)}
            placeholder="E.g., Black, White, Navy Blue"
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (service) {
      case 'wordpress':
        return renderWordPressFields();
      case 'graphic-design':
        return renderGraphicDesignFields();
      case 'video-editing':
        return renderVideoEditingFields();
      case 'tshirt-printing':
        return renderTshirtFields();
      default:
        return (
          <div className="text-center text-gray-500">
            Please select a service to continue
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {renderContent()}
    </div>
  );
};

export default ServiceDetails;
