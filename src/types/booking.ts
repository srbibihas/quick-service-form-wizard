
export interface ServiceDetails {
  // WordPress
  websiteType?: 'new' | 'maintenance';
  pageCount?: string;
  features?: string;
  existingUrl?: string;

  // Graphic Design
  designType?: string;
  dimensions?: string;
  brandColors?: string;
  conceptCount?: string;

  // Video Editing
  videoLength?: string;
  videoLengthUnit?: 'seconds' | 'minutes';
  stylePreference?: string;
  rawFootage?: string;
  exportFormat?: string;
  socialMediaFormat?: string;

  // T-shirt Printing
  printingMethod?: string;
  quantity?: string;
  sizes?: string;
  colors?: string;
  embroideryType?: string;
  embroideryPlacement?: string;
  embroideryGarmentType?: string; // New field for hoodies vs t-shirts
}

export interface ProjectDetails {
  description: string;
  timeline: string;
  budget: string;
  instructions: string;
}

export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
  preferredContact: 'whatsapp' | 'email' | 'phone';
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  isTransparent?: boolean;
}

export interface FormData {
  service: string;
  serviceDetails: ServiceDetails;
  projectDetails?: ProjectDetails; // Made optional since we removed this step
  files: UploadedFile[];
  contactInfo: ContactInfo;
}

export interface FormErrors {
  service?: string;
  serviceDetails?: Record<string, string>;
  projectDetails?: Record<string, string>;
  contactInfo?: Record<string, string>;
  files?: string;
  [key: string]: any;
}

// Pricing structure
export interface PricingInfo {
  price: number;
  currency: string;
  description?: string;
}

export const PRICING = {
  wordpress: {
    new: {
      'e-commerce': { price: 450, currency: 'USD', description: 'E-commerce Website' },
      'hostel-booking': { price: 400, currency: 'USD', description: 'Hostel Booking Website' },
      'business-page': { price: 320, currency: 'USD', description: 'Business Page' },
      'one-page': { price: 320, currency: 'USD', description: 'One Page Website' },
      'portfolio': { price: 320, currency: 'USD', description: 'Portfolio Website' },
      'press': { price: 320, currency: 'USD', description: 'Press Website' }
    },
    maintenance: {
      'elementor': { price: 75, currency: 'USD', description: 'Elementor Issues' },
      'errors': { price: 50, currency: 'USD', description: 'Error Fixes' },
      'plugin-theme-installation': { price: 80, currency: 'USD', description: 'Plugin/Theme Installation' }
    }
  },
  'graphic-design': {
    'logo': { price: 35, currency: 'USD', description: 'Logo Design' },
    'banner': { price: 15, currency: 'USD', description: 'Banner/Header Design' },
    'social': { price: 8, currency: 'USD', description: 'Social Media Graphics' },
    'business-card': { price: 5, currency: 'USD', description: 'Business Card Design' },
    'flyer': { price: 9, currency: 'USD', description: 'Flyer/Poster Design' },
    'brand-identity': { price: 120, currency: 'USD', description: 'Brand Identity Package' }
  },
  'video-editing': {
    'short': { price: 75, currency: 'USD', description: 'Less than 10 seconds' },
    'medium': { price: 100, currency: 'USD', description: '10 to 30 seconds' },
    'long': { price: 140, currency: 'USD', description: 'Up to 30 seconds' }
  },
  'tshirt-printing': {
    dtf: {
      'less-than-5': { price: 12, currency: 'USD', description: 'DTF Printing (Less than 5 pieces)' },
      '5-to-10': { price: 7, currency: 'USD', description: 'DTF Printing (5 to 10 pieces)' },
      'more-than-10': { price: 5, currency: 'USD', description: 'DTF Printing (More than 10 pieces)' }
    },
    embroidery: {
      hoodie: {
        design: {
          'less-than-5': { price: 30, currency: 'USD', description: 'Hoodie Embroidery Design (Less than 5 pieces)' },
          '5-to-10': { price: 15, currency: 'USD', description: 'Hoodie Embroidery Design (5 to 10 pieces)' },
          'more-than-10': { price: 10, currency: 'USD', description: 'Hoodie Embroidery Design (More than 10 pieces)' }
        },
        logo: {
          'less-than-5': { price: 20, currency: 'USD', description: 'Hoodie Embroidery Logo (Less than 5 pieces)' },
          '5-to-10': { price: 12, currency: 'USD', description: 'Hoodie Embroidery Logo (5 to 10 pieces)' },
          'more-than-10': { price: 8, currency: 'USD', description: 'Hoodie Embroidery Logo (More than 10 pieces)' }
        }
      },
      tshirt: {
        design: {
          'less-than-5': { price: 15, currency: 'USD', description: 'T-shirt Embroidery Design (Less than 5 pieces)' },
          '5-to-10': { price: 9.5, currency: 'USD', description: 'T-shirt Embroidery Design (5 to 10 pieces)' },
          'more-than-10': { price: 8, currency: 'USD', description: 'T-shirt Embroidery Design (More than 10 pieces)' }
        },
        logo: {
          'less-than-5': { price: 9.5, currency: 'USD', description: 'T-shirt Embroidery Logo (Less than 5 pieces)' },
          '5-to-10': { price: 7, currency: 'USD', description: 'T-shirt Embroidery Logo (5 to 10 pieces)' },
          'more-than-10': { price: 5.5, currency: 'USD', description: 'T-shirt Embroidery Logo (More than 10 pieces)' }
        }
      }
    }
  }
} as const;
