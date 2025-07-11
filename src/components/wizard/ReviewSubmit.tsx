
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, File, Send } from 'lucide-react';
import { FormData } from '@/types/booking';
import PricingDisplay from './PricingDisplay';
import PaymentButton from './PaymentButton';

interface ReviewSubmitProps {
  formData: FormData;
  onEdit: (step: number) => void;
}

const ReviewSubmit: React.FC<ReviewSubmitProps> = ({ formData, onEdit }) => {
  const generateWhatsAppMessage = (paymentStatus?: string) => {
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

    // Add payment status if provided
    if (paymentStatus) {
      message += `💳 PAYMENT STATUS: ${paymentStatus.toUpperCase()}\n\n`;
    }

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

  const handleWhatsAppSubmit = (paymentStatus = 'not-paid') => {
    const message = generateWhatsAppMessage(paymentStatus);
    const phoneNumber = "+212634653205"; // Replace with your business WhatsApp number
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // Clear form data from localStorage after successful submission
    localStorage.removeItem('bookingFormData');
    
    window.open(whatsappUrl, '_blank');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatValue = (value: any): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const serviceNames = {
    'wordpress': 'WordPress Development',
    'graphic-design': 'Graphic Design',
    'video-editing': 'Video Editing',
    'tshirt-printing': 'T-shirt Printing'
  };

  // Services that should hide the uploaded files section
  const servicesWithoutFiles = ['wordpress', 'video-editing'];
  const shouldShowFiles = !servicesWithoutFiles.includes(formData.service);

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Order</h2>
        <p className="text-gray-600">Please review all details before submitting</p>
      </div>

      <div className="space-y-4">
        {/* Pricing Display */}
        <PricingDisplay formData={formData} />

        {/* Service Selection */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-lg">Service Selection</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEdit(1)} className="h-8 w-8 p-0">
              <Edit className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              {serviceNames[formData.service as keyof typeof serviceNames] || formData.service}
            </Badge>
          </CardContent>
        </Card>

        {/* Service Details */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-lg">Service Details</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEdit(2)} className="h-8 w-8 p-0">
              <Edit className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {Object.entries(formData.serviceDetails).map(([key, value]) => {
                if (!value) return null;
                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                return (
                  <div key={key} className="grid grid-cols-1 gap-1">
                    <span className="text-sm text-gray-600 font-medium">{formattedKey}:</span>
                    <span className="text-sm font-medium text-gray-900 break-words">{formatValue(value)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Files - Only show for services that require files */}
        {shouldShowFiles && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg">Uploaded Files ({formData.files.length})</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onEdit(3)} className="h-8 w-8 p-0">
                <Edit className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              {formData.files.length > 0 ? (
                <div className="space-y-3">
                  {formData.files.map((file) => (
                    <div key={file.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <File className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{file.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</p>
                          {formData.service === 'tshirt-printing' && file.type.startsWith('image/') && (
                            <Badge 
                              variant={file.isTransparent ? 'default' : 'destructive'} 
                              className="text-xs mt-2"
                            >
                              {file.isTransparent ? 'Transparent' : 'No transparency'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No files uploaded</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Contact Info */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-lg">Contact Information</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEdit(4)} className="h-8 w-8 p-0">
              <Edit className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-1">
                <span className="text-sm text-gray-600 font-medium">Name:</span>
                <span className="text-sm font-medium text-gray-900 break-words">{formData.contactInfo.name}</span>
              </div>
              <div className="grid grid-cols-1 gap-1">
                <span className="text-sm text-gray-600 font-medium">Phone:</span>
                <span className="text-sm font-medium text-gray-900 break-words">{formData.contactInfo.phone}</span>
              </div>
              <div className="grid grid-cols-1 gap-1">
                <span className="text-sm text-gray-600 font-medium">Email:</span>
                <span className="text-sm font-medium text-gray-900 break-words">{formData.contactInfo.email}</span>
              </div>
              <div className="grid grid-cols-1 gap-1">
                <span className="text-sm text-gray-600 font-medium">Preferred Contact:</span>
                <span className="text-sm font-medium text-gray-900 capitalize">{formData.contactInfo.preferredContact}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Section */}
      <div className="border-t pt-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Options</h3>
          <p className="text-gray-600 text-sm">Choose your preferred payment method</p>
        </div>
        
        {/* Payment Button */}
        <PaymentButton formData={formData} />
        
        {/* OR Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-300" />
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>
        
        {/* WhatsApp Submit Button */}
        <div className="text-center">
          <Button
            onClick={() => handleWhatsAppSubmit('not-paid')}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 w-full"
          >
            <Send className="w-5 h-5 mr-2" />
            Send Order via WhatsApp (Pay Later)
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            Send order details to WhatsApp and arrange payment later
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmit;
