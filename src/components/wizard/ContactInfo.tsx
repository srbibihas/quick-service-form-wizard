
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ContactInfo as ContactInfoType } from '@/types/booking';

interface ContactInfoProps {
  contactInfo: ContactInfoType;
  onUpdate: (info: ContactInfoType) => void;
  errors: Record<string, string>;
}

const ContactInfo: React.FC<ContactInfoProps> = ({
  contactInfo,
  onUpdate,
  errors
}) => {
  const updateField = (field: keyof ContactInfoType, value: string) => {
    onUpdate({ ...contactInfo, [field]: value });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
        <p className="text-gray-600">How can we reach you about your project?</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="name" className="text-base font-medium">
            Full Name *
          </Label>
          <Input
            id="name"
            value={contactInfo.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Enter your full name"
            className={`mt-2 ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone" className="text-base font-medium">
            Phone Number (WhatsApp) *
          </Label>
          <Input
            id="phone"
            value={contactInfo.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
            className={`mt-2 ${errors.phone ? 'border-red-500' : ''}`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Include country code for international numbers
          </p>
        </div>

        <div>
          <Label htmlFor="email" className="text-base font-medium">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={contactInfo.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="your.email@example.com"
            className={`mt-2 ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <Label className="text-base font-medium">
            Preferred Contact Method
          </Label>
          <RadioGroup
            value={contactInfo.preferredContact}
            onValueChange={(value) => updateField('preferredContact', value as 'whatsapp' | 'email' | 'phone')}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="whatsapp" id="whatsapp" />
              <Label htmlFor="whatsapp" className="flex items-center">
                📱 WhatsApp
                <span className="ml-2 text-sm text-green-600">(Recommended)</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" id="email-contact" />
              <Label htmlFor="email-contact">📧 Email</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="phone" id="phone-contact" />
              <Label htmlFor="phone-contact">📞 Phone Call</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-medium text-green-900 mb-2">🚀 Next Steps</h3>
        <ul className="text-green-800 text-sm space-y-1">
          <li>• We'll contact you within 24 hours</li>
          <li>• Discuss project details and timeline</li>
          <li>• Provide detailed quote and contract</li>
          <li>• Begin work after approval</li>
        </ul>
      </div>
    </div>
  );
};

export default ContactInfo;
