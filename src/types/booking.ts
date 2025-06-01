
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
  stylePreference?: string;
  rawFootage?: string;
  exportFormat?: string;

  // T-shirt Printing
  printingMethod?: string;
  quantity?: string;
  sizes?: string;
  colors?: string;
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
  projectDetails: ProjectDetails;
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
