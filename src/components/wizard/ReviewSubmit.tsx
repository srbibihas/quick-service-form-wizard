
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
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="text-center px-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Review Your Order</h2>
        <p className="text-sm sm:text-base text-gray-600">Please review all details before submitting</p>
      </div>

      <div className="grid gap-3 sm:gap-6">
        {/* Service Selection */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-base sm:text-lg">Service Selection</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEdit(1)} className="h-8 w-8 p-0 sm:h-auto sm:w-auto sm:p-2">
              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs sm:text-sm">
              {serviceNames[formData.service as keyof typeof serviceNames] || formData.service}
            </Badge>
          </CardContent>
        </Card>

        {/* Service Details */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-base sm:text-lg">Service Details</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEdit(2)} className="h-8 w-8 p-0 sm:h-auto sm:w-auto sm:p-2">
              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="space-y-2">
              {Object.entries(formData.serviceDetails).map(([key, value]) => {
                if (!value) return null;
                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                return (
                  <div key={key} className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm text-gray-600 font-medium">{formattedKey}:</span>
                    <span className="text-xs sm:text-sm font-medium break-words">{value}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Files */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-base sm:text-lg">Uploaded Files ({formData.files.length})</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEdit(3)} className="h-8 w-8 p-0 sm:h-auto sm:w-auto sm:p-2">
              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            {formData.files.length > 0 ? (
              <div className="space-y-2">
                {formData.files.map((file) => (
                  <div key={file.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 p-2 sm:p-3 rounded-lg gap-2 sm:gap-3">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <File className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-xs sm:text-sm truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    {formData.service === 'tshirt-printing' && file.type.startsWith('image/') && (
                      <Badge variant={file.isTransparent ? 'default' : 'destructive'} className="text-xs flex-shrink-0">
                        {file.isTransparent ? 'Transparent' : 'No transparency'}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-xs sm:text-sm">No files uploaded</p>
            )}
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-base sm:text-lg">Contact Information</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEdit(4)} className="h-8 w-8 p-0 sm:h-auto sm:w-auto sm:p-2">
              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm text-gray-600 font-medium">Name:</span>
                <span className="text-xs sm:text-sm font-medium break-words">{formData.contactInfo.name}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm text-gray-600 font-medium">Phone:</span>
                <span className="text-xs sm:text-sm font-medium break-words">{formData.contactInfo.phone}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm text-gray-600 font-medium">Email:</span>
                <span className="text-xs sm:text-sm font-medium break-words">{formData.contactInfo.email}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm text-gray-600 font-medium">Preferred Contact:</span>
                <span className="text-xs sm:text-sm font-medium capitalize">{formData.contactInfo.preferredContact}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Button */}
      <div className="text-center px-4 pt-2 sm:pt-4">
        <Button
          onClick={handleWhatsAppSubmit}
          size="lg"
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 sm:px-8 py-3 w-full sm:w-auto text-sm sm:text-base"
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Send via WhatsApp
        </Button>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">
          This will open WhatsApp with your order details pre-filled
        </p>
      </div>
    </div>
  );
};

export default ReviewSubmit;
