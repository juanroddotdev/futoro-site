import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

export const formSchema = toTypedSchema(z.object({
  businessName: z.string().min(2).max(100),
  businessDescription: z.array(z.string()).optional().default([]),
  targetAudience: z.array(z.string()).optional().default([]),
  primaryGoals: z.array(z.string()).optional().default([]),
  hasExistingWebsite: z.enum(['yes', 'no'], { 
    required_error: 'Please indicate if you have an existing website.',
  }),
  existingWebsiteUrl: z.string().optional(),
  existingWebsiteFeedback: z.string().optional(),
  domainNameStatus: z.enum(['yes', 'no']).optional(), 
  domainName: z.string().optional(), 
  domainHelpNeededStatus: z.enum(['knows_want', 'needs_help', 'unsure']).optional(), 
  hasLogo: z.boolean().optional().default(false),
  hasBrandColors: z.boolean().optional().default(false),
  brandColorsDescription: z.string().optional(),
  hasBrandFonts: z.boolean().optional().default(false),
  brandFontsDescription: z.string().optional(),
  inspirationalWebsitesUrls: z.string().optional(),
  inspirationalWebsitesComments: z.string().optional(),
  aestheticStyle: z.array(z.string()).optional().default([]),
  essentialPages: z.array(z.string()).optional().default([]),
  desiredFeatures: z.array(z.string()).optional().default([]),
  desiredFeaturesOther: z.string().optional(),
  projectBudgetTier: z.string({ 
    required_error: 'Please select a budget range or indicate if unsure.' 
  }).optional(),
  contactName: z.string().min(1, { message: 'Name is required.'}),
  contactEmail: z.string().min(1, { message: 'Email is required.'}).email({ message: 'Please enter a valid email address.'}),
  contactPhone: z.string().optional(),
  feedbackPreference: z.array(z.string()).optional().default([]),
}).superRefine((data, ctx) => {
  // Refinements remain the same
  if (data.hasExistingWebsite === 'yes') {
    if (!data.existingWebsiteUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Website URL is required.',
        path: ['existingWebsiteUrl'],
      });
    } else {
      const urlResult = z.string().url({ message: "Please enter a valid URL (e.g., https://example.com)" }).safeParse(data.existingWebsiteUrl);
      if (!urlResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: urlResult.error.issues[0].message,
          path: ['existingWebsiteUrl'],
        });
      }
    }
  }
  if (data.hasExistingWebsite === 'no' && data.domainNameStatus === 'yes' && !data.domainName?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please enter your domain name.',
      path: ['domainName'],
    });
  }
  if (data.hasBrandColors && !data.brandColorsDescription?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please describe your brand colors or provide hex codes.',
        path: ['brandColorsDescription'],
      });
  }
  if (data.hasBrandFonts && !data.brandFontsDescription?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please list your preferred font names.',
        path: ['brandFontsDescription'],
      });
  }
  if (data.desiredFeatures?.includes('other_features') && !data.desiredFeaturesOther?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please specify the other desired features.',
      path: ['desiredFeaturesOther'],
    });
  }
})); 