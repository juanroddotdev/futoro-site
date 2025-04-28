import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

// Base schema with common fields
const baseSchema = z.object({
  businessName: z.string().optional(),
  businessDescription: z.array(z.string()).optional(),
  targetAudience: z.array(z.string()).optional(),
  primaryGoals: z.array(z.string()).optional(),
  hasLogo: z.boolean().optional(),
  hasBrandColors: z.boolean().optional(),
  hasBrandFonts: z.boolean().optional(),
  aestheticStyle: z.array(z.string()).optional(),
  brandColorsDescription: z.string().optional(),
  brandFontsDescription: z.string().optional(),
  essentialPages: z.array(z.string()).optional(),
  desiredFeatures: z.array(z.string()).optional(),
  desiredFeaturesOther: z.string().optional(),
  budgetTier: z.string().optional(),
  timeline: z.string().optional(),
  communicationPreference: z.string().optional(),
  additionalNotes: z.string().optional(),
}).partial();

// About step schema
export const aboutStepSchema = toTypedSchema(
  z.object({
    businessName: z.string().optional(),
    businessDescription: z.array(z.string()).optional(),
    targetAudience: z.array(z.string()).optional(),
    primaryGoals: z.array(z.string()).optional(),
  }).partial()
);

// Design step schema
export const designStepSchema = toTypedSchema(
  z.object({
    hasLogo: z.boolean().optional(),
    hasBrandColors: z.boolean().optional(),
    hasBrandFonts: z.boolean().optional(),
    aestheticStyle: z.array(z.string()).optional(),
    brandColorsDescription: z.string().optional(),
    brandFontsDescription: z.string().optional(),
  }).partial()
);

// Functionality step schema
export const functionalityStepSchema = toTypedSchema(
  z.object({
    essentialPages: z.array(z.string()).optional(),
    desiredFeatures: z.array(z.string()).optional(),
    desiredFeaturesOther: z.string().optional(),
  }).partial()
);

// Logistics step schema
export const logisticsStepSchema = toTypedSchema(
  z.object({
    budgetTier: z.string().optional(),
    timeline: z.string().optional(),
    communicationPreference: z.string().optional(),
    additionalNotes: z.string().optional(),
  }).partial()
);

// Full form schema
export const formSchema = toTypedSchema(baseSchema); 