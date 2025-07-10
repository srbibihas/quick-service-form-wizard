
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
      'e-commerce': { price: 4500, currency: 'DHS', description: 'E-commerce Website' },
      'hostel-booking': { price: 4000, currency: 'DHS', description: 'Hostel Booking Website' },
      'business-page': { price: 3200, currency: 'DHS', description: 'Business Page' },
      'one-page': { price: 3200, currency: 'DHS', description: 'One Page Website' },
      'portfolio': { price: 3200, currency: 'DHS', description: 'Portfolio Website' },
      'press': { price: 3200, currency: 'DHS', description: 'Press Website' }
    },
    maintenance: {
      'elementor': { price: 750, currency: 'DHS', description: 'Elementor Issues' },
      'errors': { price: 500, currency: 'DHS', description: 'Error Fixes' },
      'plugin-theme-installation': { price: 800, currency: 'DHS', description: 'Plugin/Theme Installation' }
    }
  },
  'graphic-design': {
    'logo': { price: 350, currency: 'DHS', description: 'Logo Design' },
    'banner': { price: 150, currency: 'DHS', description: 'Banner/Header Design' },
    'social': { price: 80, currency: 'DHS', description: 'Social Media Graphics' },
    'business-card': { price: 50, currency: 'DHS', description: 'Business Card Design' },
    'flyer': { price: 90, currency: 'DHS', description: 'Flyer/Poster Design' },
    'brand-identity': { price: 1200, currency: 'DHS', description: 'Brand Identity Package' }
  },
  'video-editing': {
    'short': { price: 750, currency: 'DHS', description: 'Less than 10 seconds' },
    'medium': { price: 1000, currency: 'DHS', description: '10 to 30 seconds' },
    'long': { price: 1400, currency: 'DHS', description: 'Up to 30 seconds' }
  },
  'tshirt-printing': {
    'dtf': { price: 120, currency: 'DHS', description: 'DTF Printing' },
    'embroidery-tshirt': { price: 150, currency: 'DHS', description: 'Embroidery on T-shirt' },
    'embroidery-hoodie': { price: 300, currency: 'DHS', description: 'Embroidery on Hoodie' }
  }
} as const;
