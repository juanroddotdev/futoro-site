export interface FormData {
  // About section
  businessName: string;
  businessDescription: string[];
  targetAudience: string[];
  primaryGoals: string[];
  
  // Design section
  hasLogo: boolean;
  hasBrandColors: boolean;
  hasBrandFonts: boolean;
  brandColorsDescription?: string;
  brandFontsDescription?: string;
  aestheticStyle: string[];
  
  // Functionality section
  essentialPages: string[];
  desiredFeatures: string[];
  desiredFeaturesOther?: string;
  
  // Logistics section
  timeline: string;
  budgetTier: string;
}

export type FormStep = 'about' | 'design' | 'functionality' | 'logistics';

export interface ValidationError {
  field: keyof FormData;
  message: string;
} 