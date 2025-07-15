
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const BookingWizard = () => {
  console.log('BookingWizard component rendering...');
  
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Book Your Digital Service</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Step {currentStep} of 3</h2>
              <p className="text-gray-600">Choose your service and get started</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer">
                <h3 className="font-semibold">WordPress Development</h3>
                <p className="text-sm text-gray-600">Custom WordPress websites and themes</p>
              </div>
              <div className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer">
                <h3 className="font-semibold">Graphic Design</h3>
                <p className="text-sm text-gray-600">Logos, branding, and visual identity</p>
              </div>
              <div className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer">
                <h3 className="font-semibold">Video Editing</h3>
                <p className="text-sm text-gray-600">Professional video editing services</p>
              </div>
              <div className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer">
                <h3 className="font-semibold">T-Shirt Printing</h3>
                <p className="text-sm text-gray-600">Custom apparel and merchandise</p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" disabled={currentStep === 1}>
                Previous
              </Button>
              <Button onClick={() => setCurrentStep(prev => Math.min(prev + 1, 3))}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingWizard;
