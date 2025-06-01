
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, File, Send } from 'lucide-react';
import { FormData } from '@/types/booking';

interface ReviewSubmitProps {
  formData: FormData;
  onEdit: (step: number) => void;
}

const ReviewSubmit: React.FC<ReviewSubmitProps> = ({ formData, onEdit }) => {
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
        message += `• ${formattedKey}: ${value}\n`;
      }
    });

    message += `\n⚡ SUBMIT DATE: ${new Date().toLocaleString()}\n`;
    message += `\n💼 Contact preference: ${formData.contactInfo.preferredContact}`;

    return encodeURIComponent(message);
  };

  const handleWhatsAppSubmit = () => {
    const message = generateWhatsAppMessage();
    const phoneNumber = formData.contactInfo.phone.replace(/[^\d+]/g, '');
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

  const serviceNames = {
    'wordpress': 'WordPress Development',
    'graphic-design': 'Graphic Design',
    'video-editing': 'Video Editing',
    'tshirt-printing': 'T-shirt Printing'
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Order</h2>
        <p className="text-gray-600">Please review all details before submitting</p>
      </div>

      <div className="grid gap-6">
        {/* Service Selection */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-lg">Service Selection</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEdit(1)}>
              <Edit className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              {serviceNames[formData.service as keyof typeof serviceNames] || formData.service}
            </Badge>
          </CardContent>
        </Card>

        {/* Service Details */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-lg">Service Details</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEdit(2)}>
              <Edit className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(formData.serviceDetails).map(([key, value]) => {
                if (!value) return null;
                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                return (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{formattedKey}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Files */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-lg">Uploaded Files ({formData.files.length})</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEdit(3)}>
              <Edit className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {formData.files.length > 0 ? (
              <div className="space-y-2">
                {formData.files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <File className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    {formData.service === 'tshirt-printing' && file.type.startsWith('image/') && (
                      <Badge variant={file.isTransparent ? 'default' : 'destructive'}>
                        {file.isTransparent ? 'Transparent' : 'No transparency'}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No files uploaded</p>
            )}
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-lg">Contact Information</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEdit(4)}>
              <Edit className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{formData.contactInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{formData.contactInfo.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{formData.contactInfo.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Preferred Contact:</span>
                <span className="font-medium capitalize">{formData.contactInfo.preferredContact}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <Button
          onClick={handleWhatsAppSubmit}
          size="lg"
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3"
        >
          <Send className="w-5 h-5 mr-2" />
          Send via WhatsApp
        </Button>
        <p className="text-sm text-gray-500 mt-2">
          This will open WhatsApp with your order details pre-filled
        </p>
      </div>
    </div>
  );
};

export default ReviewSubmit;
