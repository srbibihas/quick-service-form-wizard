
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import StepHeader from './wizard/StepHeader';
import ServiceSelection from './wizard/ServiceSelection';
import ServiceDetails from './wizard/ServiceDetails';
import ProjectDetails from './wizard/ProjectDetails';
import FileUpload from './wizard/FileUpload';
import ContactInfo from './wizard/ContactInfo';
import ReviewSubmit from './wizard/ReviewSubmit';
import { FormData, FormErrors } from '@/types/booking';

const STEPS = [
  { id: 1, title: 'Service Selection', description: 'Choose your service' },
  { id: 2, title: 'Service Details', description: 'Specific requirements' },
  { id: 3, title: 'Project Information', description: 'Tell us about your project' },
  { id: 4, title: 'File Upload', description: 'Upload your files' },
  { id: 5, title: 'Contact Information', description: 'How to reach you' },
  { id: 6, title: 'Review & Submit', description: 'Confirm your order' }
];

const BookingWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    service: '',
    serviceDetails: {},
    projectDetails: {
      description: '',
      timeline: '',
      budget: '',
      instructions: ''
    },
    files: [],
    contactInfo: {
      name: '',
      phone: '',
      email: '',
      preferredContact: 'whatsapp'
    }
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('bookingFormData');
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (e) {
        console.error('Error loading saved form data:', e);
      }
    }
  }, []);

  // Save data to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem('bookingFormData', JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (section: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
    // Clear errors for updated fields
    if (errors[section]) {
      setErrors(prev => ({ ...prev, [section]: {} }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 1:
        if (!formData.service) {
          newErrors.service = 'Please select a service';
        }
        break;
      case 2:
        // Service-specific validation will be handled in ServiceDetails component
        break;
      case 3:
        if (!formData.projectDetails.description) {
          newErrors.projectDetails = { description: 'Project description is required' };
        }
        if (!formData.projectDetails.timeline) {
          newErrors.projectDetails = { ...newErrors.projectDetails, timeline: 'Timeline is required' };
        }
        if (!formData.projectDetails.budget) {
          newErrors.projectDetails = { ...newErrors.projectDetails, budget: 'Budget range is required' };
        }
        break;
      case 5:
        if (!formData.contactInfo.name) {
          newErrors.contactInfo = { name: 'Name is required' };
        }
        if (!formData.contactInfo.phone) {
          newErrors.contactInfo = { ...newErrors.contactInfo, phone: 'Phone number is required' };
        }
        if (!formData.contactInfo.email) {
          newErrors.contactInfo = { ...newErrors.contactInfo, email: 'Email is required' };
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    if (step <= currentStep || validateStep(currentStep)) {
      setCurrentStep(step);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceSelection
            selectedService={formData.service}
            onServiceSelect={(service) => updateFormData('service', service)}
            error={errors.service}
          />
        );
      case 2:
        return (
          <ServiceDetails
            service={formData.service}
            serviceDetails={formData.serviceDetails}
            onUpdate={(details) => updateFormData('serviceDetails', details)}
            errors={errors.serviceDetails || {}}
          />
        );
      case 3:
        return (
          <ProjectDetails
            projectDetails={formData.projectDetails}
            onUpdate={(details) => updateFormData('projectDetails', details)}
            errors={errors.projectDetails || {}}
          />
        );
      case 4:
        return (
          <FileUpload
            service={formData.service}
            files={formData.files}
            onUpdate={(files) => updateFormData('files', files)}
          />
        );
      case 5:
        return (
          <ContactInfo
            contactInfo={formData.contactInfo}
            onUpdate={(info) => updateFormData('contactInfo', info)}
            errors={errors.contactInfo || {}}
          />
        );
      case 6:
        return (
          <ReviewSubmit
            formData={formData}
            onEdit={goToStep}
          />
        );
      default:
        return null;
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Digital Services Booking
        </h1>
        <p className="text-gray-600">Professional services for your digital needs</p>
      </div>

      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-0">
          <StepHeader
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={goToStep}
          />
          
          <div className="px-6 py-4">
            <Progress value={progress} className="h-2 mb-6" />
          </div>

          <div className="px-6 pb-6">
            <div className="min-h-[400px]">
              {renderStepContent()}
            </div>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentStep < STEPS.length ? (
                <Button
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingWizard;
