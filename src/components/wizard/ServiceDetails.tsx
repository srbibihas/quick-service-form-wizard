import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ServiceDetails as ServiceDetailsType } from '@/types/booking';

interface ServiceDetailsProps {
  service: string;
  serviceDetails: ServiceDetailsType;
  onUpdate: (details: ServiceDetailsType) => void;
  onChangeService: () => void;
  errors: Record<string, string>;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  service,
  serviceDetails,
  onUpdate,
  onChangeService,
  errors
}) => {
  const updateField = (field: string, value: string) => {
    onUpdate({ ...serviceDetails, [field]: value });
  };

  const serviceNames = {
    'wordpress': 'WordPress Development',
    'graphic-design': 'Graphic Design',
    'video-editing': 'Video Editing',
    'tshirt-printing': 'T-shirt Printing'
  };

  const renderServiceHeader = (serviceName: string) => (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-900">{serviceName} Details</h2>
      <Button
        variant="outline"
        size="sm"
        onClick={onChangeService}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Change Service
      </Button>
    </div>
  );

  const renderWordPressFields = () => (
    <div className="space-y-6">
      {renderServiceHeader('WordPress')}
      
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
      {renderServiceHeader('Graphic Design')}
      
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
      {renderServiceHeader('Video Editing')}
      
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Video Length</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={serviceDetails.videoLength || ''}
              onChange={(e) => {
                const value = e.target.value;
                // Allow only numbers (and empty string)
                if (value === '' || /^\d{1,2}$/.test(value)) {
                  updateField('videoLength', value);
                }
              }}
              placeholder="Enter duration"
              className="flex-1"
              maxLength={2}
            />
            <Select 
              value={serviceDetails.videoLengthUnit || 'minutes'} 
              onValueChange={(value) => updateField('videoLengthUnit', value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seconds">Seconds</SelectItem>
                <SelectItem value="minutes">Minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
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

        {serviceDetails.exportFormat === 'social-optimized' && (
          <div>
            <Label htmlFor="socialMediaFormat" className="text-base font-medium">
              Social Media Format
            </Label>
            <Select value={serviceDetails.socialMediaFormat || ''} onValueChange={(value) => updateField('socialMediaFormat', value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select social media format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="facebook-feed">Facebook Feed</SelectItem>
                <SelectItem value="facebook-story">Facebook Story</SelectItem>
                <SelectItem value="instagram-feed">Instagram Feed</SelectItem>
                <SelectItem value="instagram-reels">Instagram Reels</SelectItem>
                <SelectItem value="instagram-story">Instagram Story</SelectItem>
                <SelectItem value="tiktok-feed">TikTok Feed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );

  const renderTshirtFields = () => (
    <div className="space-y-6">
      {renderServiceHeader('T-shirt Printing')}
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

        {serviceDetails.printingMethod === 'embroidery' && (
          <>
            <div>
              <Label htmlFor="embroideryType" className="text-base font-medium">
                Embroidery Type
              </Label>
              <Select value={serviceDetails.embroideryType || ''} onValueChange={(value) => updateField('embroideryType', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select embroidery type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="icon">Icon</SelectItem>
                  <SelectItem value="logo">Logo</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="embroideryPlacement" className="text-base font-medium">
                Design Placement
              </Label>
              <Select value={serviceDetails.embroideryPlacement || ''} onValueChange={(value) => updateField('embroideryPlacement', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select placement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="front">Front</SelectItem>
                  <SelectItem value="back">Back</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div>
          <Label htmlFor="quantity" className="text-base font-medium">
            Quantity Needed
          </Label>
          <Input
            id="quantity"
            type="number"
            value={serviceDetails.quantity || ''}
            onChange={(e) => updateField('quantity', e.target.value)}
            placeholder="Enter quantity"
            className="mt-2"
            min="1"
          />
        </div>

        <div>
          <Label htmlFor="sizes" className="text-base font-medium">
            T-shirt Sizes Needed
          </Label>
          <Select value={serviceDetails.sizes || ''} onValueChange={(value) => updateField('sizes', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select sizes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xs">XS</SelectItem>
              <SelectItem value="s">S</SelectItem>
              <SelectItem value="m">M</SelectItem>
              <SelectItem value="l">L</SelectItem>
              <SelectItem value="xl">XL</SelectItem>
              <SelectItem value="xxl">XXL</SelectItem>
              <SelectItem value="multiple">Multiple Sizes</SelectItem>
            </SelectContent>
          </Select>
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
