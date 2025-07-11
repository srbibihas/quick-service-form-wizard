import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import StepHeader from './wizard/StepHeader';
import ServiceSelection from './wizard/ServiceSelection';
import ServiceDetails from './wizard/ServiceDetails';
import FileUpload from './wizard/FileUpload';
import ContactInfo from './wizard/ContactInfo';
import ReviewSubmit from './wizard/ReviewSubmit';
import { FormData, FormErrors } from '@/types/booking';

const BASE_STEPS = [
  { id: 1, title: 'Service Selection', description: 'Choose your service' },
  { id: 2, title: 'Service Details', description: 'Specific requirements' },
  { id: 3, title: 'Contact Information', description: 'How to reach you' },
  { id: 4, title: 'Review & Submit', description: 'Confirm your order' }
];

const FILE_UPLOAD_STEP = { id: 3, title: 'File Upload', description: 'Upload your files' };

const BookingWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    service: '',
    serviceDetails: {},
    files: [],
    contactInfo: {
      name: '',
      phone: '',
      email: '',
      preferredContact: 'whatsapp'
    }
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Determine if file upload is needed for the selected service
  const needsFileUpload = formData.service === 'tshirt-printing' || formData.service === 'graphic-design';

  // Generate steps based on service selection
  const getSteps = () => {
    if (!needsFileUpload) {
      return BASE_STEPS;
    }
    
    // Insert file upload step before contact info
    return [
      BASE_STEPS[0], // Service Selection
      BASE_STEPS[1], // Service Details
      FILE_UPLOAD_STEP, // File Upload
      { ...BASE_STEPS[2], id: 4 }, // Contact Information (renumbered)
      { ...BASE_STEPS[3], id: 5 } // Review & Submit (renumbered)
    ];
  };

  const steps = getSteps();

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('bookingFormData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Ensure files is always an array
        if (parsed.files && !Array.isArray(parsed.files)) {
          parsed.files = Object.values(parsed.files);
        }
        setFormData(parsed);
        console.log('Loaded form data:', parsed);
      } catch (e) {
        console.error('Error loading saved form data:', e);
      }
    }
  }, []);

  // Save data to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem('bookingFormData', JSON.stringify(formData));
    console.log('Saved form data:', formData);
  }, [formData]);

  // Reset to step 1 when service changes and file upload availability changes
  useEffect(() => {
    if (formData.service) {
      const wasFileUploadNeeded = currentStep === 3 && steps.find(s => s.id === 3)?.title === 'File Upload';
      const isFileUploadNeeded = needsFileUpload;
      
      // If we're on a step that no longer exists due to service change, go back to step 2
      if (wasFileUploadNeeded !== isFileUploadNeeded && currentStep > 2) {
        setCurrentStep(2);
      }
    }
  }, [formData.service, needsFileUpload]);

  const updateFormData = (section: string, data: any) => {
    console.log('Updating form data:', section, data);
    if (section === 'service') {
      setFormData(prev => ({
        ...prev,
        service: data
      }));
    } else if (section === 'files') {
      // Ensure files is always an array
      const filesArray = Array.isArray(data) ? data : [];
      setFormData(prev => ({
        ...prev,
        files: filesArray
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], ...data }
      }));
    }
    
    // Clear errors for updated fields
    if (errors[section]) {
      setErrors(prev => ({ ...prev, [section]: {} }));
    }
  };

  const handleChangeService = () => {
    setCurrentStep(1);
    setFormData(prev => ({
      ...prev,
      service: '',
      serviceDetails: {}
    }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name: string): boolean => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name) && name.trim().length > 0;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+\d{10,15}$/;
    return phoneRegex.test(phone);
  };

  const validateServiceDetails = (service: string, details: any): Record<string, string> => {
    const errors: Record<string, string> = {};

    switch (service) {
      case 'wordpress':
        if (!details.websiteType) {
          errors.websiteType = 'Project type is required';
        }
        if (!details.pageCount) {
          if (details.websiteType === 'new') {
            errors.pageCount = 'Website type is required';
          } else if (details.websiteType === 'maintenance') {
            errors.pageCount = 'Maintenance service is required';
          }
        }
        if (details.websiteType === 'maintenance' && !details.existingUrl) {
          errors.existingUrl = 'Website URL is required for maintenance';
        }
        break;

      case 'graphic-design':
        if (!details.designType) {
          errors.designType = 'Design type is required';
        }
        if (!details.dimensions) {
          errors.dimensions = 'Dimensions/format is required';
        }
        if (!details.conceptCount) {
          errors.conceptCount = 'Number of concepts is required';
        }
        break;

      case 'video-editing':
        if (!details.videoLength) {
          errors.videoLength = 'Video length is required';
        }
        if (!details.stylePreference) {
          errors.stylePreference = 'Style preference is required';
        }
        if (!details.rawFootage) {
          errors.rawFootage = 'Raw footage availability is required';
        }
        if (!details.exportFormat) {
          errors.exportFormat = 'Export format is required';
        }
        if (details.exportFormat === 'social-optimized' && !details.socialMediaFormat) {
          errors.socialMediaFormat = 'Social media format is required';
        }
        break;

      case 'tshirt-printing':
        if (!details.printingMethod) {
          errors.printingMethod = 'Printing method is required';
        }
        if (!details.quantity) {
          errors.quantity = 'Quantity is required';
        }
        if (!details.sizes) {
          errors.sizes = 'T-shirt sizes are required';
        }
        if (details.printingMethod === 'embroidery') {
          if (!details.embroideryGarmentType) {
            errors.embroideryGarmentType = 'Garment type is required';
          }
          if (!details.embroideryType) {
            errors.embroideryType = 'Embroidery type is required';
          }
          if (!details.embroideryPlacement) {
            errors.embroideryPlacement = 'Design placement is required';
          }
        }
        break;
    }

    return errors;
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 1:
        if (!formData.service) {
          newErrors.service = 'Please select a service to continue';
        }
        break;
      case 2:
        const serviceErrors = validateServiceDetails(formData.service, formData.serviceDetails);
        if (Object.keys(serviceErrors).length > 0) {
          newErrors.serviceDetails = serviceErrors;
        }
        break;
      case 3:
        if (needsFileUpload) {
          // This is file upload step, no validation needed
          break;
        } else {
          // This is contact info step for services without file upload
          const contactErrors: Record<string, string> = {};
          
          if (!formData.contactInfo.name) {
            contactErrors.name = 'Name is required';
          } else if (!validateName(formData.contactInfo.name)) {
            contactErrors.name = 'Name must contain only letters and spaces';
          }
          
          if (!formData.contactInfo.phone) {
            contactErrors.phone = 'Phone number is required';
          } else if (!validatePhoneNumber(formData.contactInfo.phone)) {
            contactErrors.phone = 'Please enter a valid phone number with country code';
          }
          
          if (!formData.contactInfo.email) {
            contactErrors.email = 'Email is required';
          } else if (!validateEmail(formData.contactInfo.email)) {
            contactErrors.email = 'Please enter a valid email address';
          }

          if (Object.keys(contactErrors).length > 0) {
            newErrors.contactInfo = contactErrors;
          }
        }
        break;
      case 4:
        if (needsFileUpload) {
          // This is contact info step for services with file upload
          const contactErrors: Record<string, string> = {};
          
          if (!formData.contactInfo.name) {
            contactErrors.name = 'Name is required';
          } else if (!validateName(formData.contactInfo.name)) {
            contactErrors.name = 'Name must contain only letters and spaces';
          }
          
          if (!formData.contactInfo.phone) {
            contactErrors.phone = 'Phone number is required';
          } else if (!validatePhoneNumber(formData.contactInfo.phone)) {
            contactErrors.phone = 'Please enter a valid phone number with country code';
          }
          
          if (!formData.contactInfo.email) {
            contactErrors.email = 'Email is required';
          } else if (!validateEmail(formData.contactInfo.email)) {
            contactErrors.email = 'Please enter a valid email address';
          }

          if (Object.keys(contactErrors).length > 0) {
            newErrors.contactInfo = contactErrors;
          }
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    console.log('Next step clicked, current step:', currentStep, 'formData:', formData);
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    // Only allow going to a step if all previous steps are valid
    let canGoToStep = true;
    for (let i = 1; i < step; i++) {
      if (!validateStepSilently(i)) {
        canGoToStep = false;
        break;
      }
    }
    if (canGoToStep) {
      setCurrentStep(step);
    }
  };

  const validateStepSilently = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!formData.service;
      case 2:
        const serviceErrors = validateServiceDetails(formData.service, formData.serviceDetails);
        return Object.keys(serviceErrors).length === 0;
      case 3:
        if (needsFileUpload) {
          return true; // File upload step, no validation needed
        } else {
          // Contact info step for services without file upload
          return !!(formData.contactInfo.name && 
                   validateName(formData.contactInfo.name) &&
                   formData.contactInfo.phone && 
                   validatePhoneNumber(formData.contactInfo.phone) &&
                   formData.contactInfo.email &&
                   validateEmail(formData.contactInfo.email));
        }
      case 4:
        if (needsFileUpload) {
          // Contact info step for services with file upload
          return !!(formData.contactInfo.name && 
                   validateName(formData.contactInfo.name) &&
                   formData.contactInfo.phone && 
                   validatePhoneNumber(formData.contactInfo.phone) &&
                   formData.contactInfo.email &&
                   validateEmail(formData.contactInfo.email));
        }
        return true;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    // Determine what content to show based on current step and service
    if (currentStep === 1) {
      return (
        <ServiceSelection
          selectedService={formData.service}
          onServiceSelect={(service) => updateFormData('service', service)}
          error={errors.service}
        />
      );
    } else if (currentStep === 2) {
      return (
        <ServiceDetails
          service={formData.service}
          serviceDetails={formData.serviceDetails}
          onUpdate={(details) => updateFormData('serviceDetails', details)}
          onChangeService={handleChangeService}
          errors={errors.serviceDetails || {}}
        />
      );
    } else if (currentStep === 3) {
      if (needsFileUpload) {
        return (
          <FileUpload
            service={formData.service}
            files={formData.files}
            onUpdate={(files) => updateFormData('files', files)}
          />
        );
      } else {
        return (
          <ContactInfo
            contactInfo={formData.contactInfo}
            onUpdate={(info) => updateFormData('contactInfo', info)}
            errors={errors.contactInfo || {}}
          />
        );
      }
    } else if (currentStep === 4) {
      if (needsFileUpload) {
        return (
          <ContactInfo
            contactInfo={formData.contactInfo}
            onUpdate={(info) => updateFormData('contactInfo', info)}
            errors={errors.contactInfo || {}}
          />
        );
      } else {
        return (
          <ReviewSubmit
            formData={formData}
            onEdit={goToStep}
          />
        );
      }
    } else if (currentStep === 5) {
      return (
        <ReviewSubmit
          formData={formData}
          onEdit={goToStep}
        />
      );
    }
    return null;
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-4xl">
      <div className="text-center mb-4 sm:mb-8 px-2">
        <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Digital Services Booking
        </h1>
        <p className="text-sm sm:text-base text-gray-600">Professional services for your digital needs</p>
      </div>

      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-0">
          <StepHeader
            steps={steps}
            currentStep={currentStep}
            onStepClick={goToStep}
          />
          
          <div className="px-3 sm:px-6 py-2 sm:py-4">
            <Progress value={progress} className="h-2 mb-4 sm:mb-6" />
          </div>

          <div className="px-3 sm:px-6 pb-4 sm:pb-6">
            <div className="min-h-[400px]">
              {renderStepContent()}
            </div>

            <div className="flex flex-col sm:flex-row justify-between mt-6 sm:mt-8 gap-3 sm:gap-0">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center justify-center gap-2 w-full sm:w-auto order-2 sm:order-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button
                  onClick={nextStep}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto order-1 sm:order-2"
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
