<template>
  <!-- Container spanning full width, setting text color for intro -->
  <div class="py-12 px-4 text-foreground client-form-container">
    <!-- Center align the introductory text -->
    <div class="text-center max-w-3xl mx-auto mb-12 client-form-intro">
      <h1 class="text-3xl font-bold mb-4">Client Project Questionnaire</h1>
      <h4 class="mb-2 text-lg text-muted-foreground">Hey there! 👋 To make sure I create a website that really clicks with you and your business goals, I've put together a quick little "getting to know you" survey.</h4>
      <h4 class="mb-6 text-lg text-muted-foreground">It's just a friendly way for me to understand exactly what you're looking for, so we can build something awesome together!</h4>
    </div>

    <!-- Apply paper effect to the form - centered within the full-width container -->
    <form 
      @submit="onSubmit" 
      class="space-y-8 max-w-3xl mx-auto bg-card text-card-foreground p-8 rounded-lg shadow-lg"
    >
      <!-- Section 1: Business & Goals - Styled as Bento Box -->
      <section class="space-y-6 p-6 border rounded-lg bg-background/50">
        <h2 class="text-2xl font-semibold mb-0 col-span-full">Business & Goals</h2>

        <!-- Bento Compartment 1: Business Name -->
        <FormField v-slot="{ componentField }" name="businessName">
          <FormItem class="p-4 border rounded-md bg-card/50">
            <FormLabel for="businessName">What name do you primarily use for your creative work or business?</FormLabel>
            <FormControl>
              <Input id="businessName" type="text" placeholder="e.g., Acme Corporation" v-bind="componentField" class="mt-2"/>
            </FormControl>
            <FormDescription class="mt-2">
              The official name of your company or organization.
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Bento Compartment 2: Business Description -->
        <FormField name="businessDescription" v-slot="{ field, errors }">
          <FormItem class="p-4 border rounded-md bg-card/50">
            <FormLabel>Briefly describe your business, organization, or freelance practice.</FormLabel>
            <FormControl class="mt-2">
               <Multiselect
                 v-bind="field" 
                 mode="tags"
                 :options="fullBusinessDescOptions"
                 :searchable="true"
                 :create-tag="true"
                 placeholder="Type or select categories"
                 :close-on-select="false"
                 :class="{ 'multiselect-invalid': errors.length > 0 }"
               />
            </FormControl>
             <FormDescription class="mt-2">
              Select from suggestions or type your own and press Enter.
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Bento Compartment 3: Target Audience -->
        <FormField name="targetAudience" v-slot="{ field, errors }">
          <FormItem class="p-4 border rounded-md bg-card/50">
            <FormLabel>Who is your target audience (ideal customer/client)?</FormLabel>
            <FormControl class="mt-2">
               <Multiselect
                 v-bind="field"
                 mode="tags"
                 :options="fullTargetAudienceOptions"
                 :searchable="true"
                 :create-tag="true"
                 placeholder="Type or select audiences"
                 :close-on-select="false"
                 :class="{ 'multiselect-invalid': errors.length > 0 }"
               />
            </FormControl>
             <FormDescription class="mt-2">
              Select from suggestions or type your own and press Enter.
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Primary Goals Multiselect -->
        <FormField name="primaryGoals" v-slot="{ field, errors }">
          <FormItem class="p-4 border rounded-md bg-card/50">
            <FormLabel>What are the primary goals for your new website?</FormLabel>
            <FormControl class="mt-2">
               <Multiselect
                 v-bind="field" 
                 mode="tags"
                 :options="primaryGoalsOptions"
                 :searchable="true"
                 :create-tag="true"
                 placeholder="Select or type goals"
                 :close-on-select="false"
                 :class="{ 'multiselect-invalid': errors.length > 0 }"
               />
            </FormControl>
             <FormDescription class="mt-2">
              What should the website achieve for your business? Select all that apply or add your own.
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Existing Website Question (Combined) -->
        <FormItem class="p-4 border rounded-md bg-card/50">
          <!-- Part 1: Yes/No -->
          <FormField name="hasExistingWebsite" v-slot="{ field }">
             <FormLabel>Do you currently have a website?</FormLabel>
             <FormControl class="mt-2">
              <RadioGroup
                :model-value="field.value"
                @update:model-value="field.onChange"
                class="flex items-center space-x-4"
              >
                <FormItem class="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem id="hasWebsiteYes" value="yes" />
                  </FormControl>
                  <FormLabel for="hasWebsiteYes" class="font-normal">Yes</FormLabel>
                </FormItem>
                <FormItem class="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem id="hasWebsiteNo" value="no" />
                  </FormControl>
                  <FormLabel for="hasWebsiteNo" class="font-normal">No</FormLabel>
                </FormItem>
              </RadioGroup>
             </FormControl>
             <FormMessage />
          </FormField>

          <!-- Part 2: Conditional Fields (URL and Feedback) -->
          <div v-if="form.values.hasExistingWebsite === 'yes'" class="mt-6 space-y-6 border-t pt-6">
             <FormField name="existingWebsiteUrl" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel for="existingWebsiteUrl">If yes, what is the URL?</FormLabel>
                  <FormControl>
                    <Input id="existingWebsiteUrl" type="url" placeholder="https://example.com" v-bind="componentField" class="mt-1"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="existingWebsiteFeedback" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel for="existingWebsiteFeedback">What do you like and dislike about your current site?</FormLabel>
                  <FormControl>
                    <Textarea 
                      id="existingWebsiteFeedback"
                      placeholder="e.g., Like the design, dislike slow loading times..."
                      v-bind="componentField"
                      class="mt-1"
                    />
                  </FormControl>
                   <FormDescription class="mt-1">
                    Be specific! This helps understand your preferences.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              </FormField>
          </div>

          <!-- Part 3: Conditional Fields if NO -->
          <div v-if="form.values.hasExistingWebsite === 'no'" class="mt-6 space-y-4 border-t pt-6">
            <FormField name="domainNameStatus" v-slot="{ field }">
               <FormLabel class="text-base">Do you already have a domain name?</FormLabel>
               <FormControl class="mt-2">
                <RadioGroup
                  :model-value="field.value"
                  @update:model-value="field.onChange"
                  class="space-y-2" 
                >
                  <FormItem class="flex items-center space-x-2">
                    <FormControl><RadioGroupItem id="domainYes" value="yes" /></FormControl>
                    <FormLabel for="domainYes" class="font-normal">Yes, I have a domain name.</FormLabel>
                  </FormItem>
                  <!-- Nested Conditional Input for Domain Name if Status is 'yes' -->
                  <div v-if="form.values.domainNameStatus === 'yes'" class="pl-8 pt-2 pb-2">
                    <FormField name="domainName" v-slot="{ componentField }">
                      <FormItem>
                        <FormLabel for="domainName">What is your domain name?</FormLabel>
                        <FormControl>
                          <Input id="domainName" type="text" placeholder="yourdomain.com" v-bind="componentField" class="mt-1"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </div>

                  <FormItem class="flex items-center space-x-2">
                    <FormControl><RadioGroupItem id="domainNo" value="no" /></FormControl>
                    <FormLabel for="domainNo" class="font-normal">No, I don't have a domain name yet.</FormLabel>
                  </FormItem>
                   <!-- Removed Help option from here -->
                  
                  <!-- Nested Conditional Question if Status is 'no' -->
                  <div v-if="form.values.domainNameStatus === 'no'" class="pl-8 pt-4 space-y-3">
                     <p class="text-sm text-muted-foreground">
                      Got it! Let's get you set up with a web address. Which of the following best describes your situation with a domain name?
                    </p>
                     <FormField name="domainHelpNeededStatus" v-slot="{ field: helpField }">
                        <FormControl>
                          <RadioGroup
                            :model-value="helpField.value"
                            @update:model-value="helpField.onChange"
                            class="flex flex-col space-y-2"
                          >
                            <FormItem class="flex items-center space-x-2">
                              <FormControl><RadioGroupItem id="helpKnows" value="knows_want"></RadioGroupItem></FormControl>
                              <FormLabel for="helpKnows" class="font-normal">I haven't purchased one yet, but I know what I want.</FormLabel>
                            </FormItem>
                             <FormItem class="flex items-center space-x-2">
                              <FormControl><RadioGroupItem id="helpNeeds" value="needs_help"></RadioGroupItem></FormControl>
                              <FormLabel for="helpNeeds" class="font-normal">I haven't purchased one yet, and I'd like some help choosing one.</FormLabel>
                            </FormItem>
                             <FormItem class="flex items-center space-x-2">
                              <FormControl><RadioGroupItem id="helpUnsure" value="unsure"></RadioGroupItem></FormControl>
                              <FormLabel for="helpUnsure" class="font-normal">I'm not sure what a domain name is or where to start.</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                       <FormMessage /> 
                    </FormField>
                  </div>
                </RadioGroup>
               </FormControl>
               <FormMessage /> <!-- Message for domainNameStatus field itself -->
            </FormField>
          </div>
        </FormItem>

        <!-- More questions in this section will go here (as more compartments) -->
      </section>

      <!-- Section 2: Design Preferences & Inspiration -->
      <section class="space-y-6 p-6 border rounded-lg bg-background/50">
        <h2 class="text-2xl font-semibold mb-0 col-span-full">Design Preferences & Inspiration</h2>
        
        <!-- Visual Identity Question (Combined) -->
        <FormItem class="p-4 border rounded-md bg-card/50 space-y-6">
            <p class="font-medium text-foreground">Let's talk about your visual identity. Do you have anything like:</p>

            <!-- Logo -->
            <FormField name="hasLogo" v-slot="{ field }">
                <div class="space-y-2">
                    <FormLabel class="text-foreground">A specific logo you use?</FormLabel>
                    <FormControl class="mt-2">
                        <RadioGroup
                            :model-value="String(field.value)" 
                            @update:model-value="(value) => field.onChange(value === 'true')" 
                            class="flex items-center space-x-4"
                        >
                            <FormItem class="flex items-center space-x-2">
                                <FormControl><RadioGroupItem id="logoYes" value="true" /></FormControl>
                                <FormLabel for="logoYes" class="font-normal">Yes</FormLabel>
                            </FormItem>
                            <FormItem class="flex items-center space-x-2">
                                <FormControl><RadioGroupItem id="logoNo" value="false" /></FormControl>
                                <FormLabel for="logoNo" class="font-normal">No</FormLabel>
                            </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage /> 
                </div>
                 <!-- Message if YES -->
                 <FormDescription v-if="field.value === true" class="pl-2 text-xs">
                    Great! Please email your logo file(s) (preferably vector format like .svg or .ai, or high-res .png) separately.
                </FormDescription>
                <!-- Message if NO -->
                 <FormDescription v-if="field.value === false" class="pl-2 text-xs">
                    That's completely fine! Logo design is definitely something we can discuss. Start thinking about logos you like the look and feel of – it'll give us a great direction. You can also explore some interesting styles and ideas on <a href="https://logosystem.co/" target="_blank" rel="noopener noreferrer" class="underline hover:text-secondary">this site</a>.
                </FormDescription>
            </FormField>
            
            <!-- Brand Colors -->
            <FormField name="hasBrandColors" v-slot="{ field }">
                 <div class="space-y-2 border-t pt-4">
                    <FormLabel class="text-foreground">Certain colors you always use for your business?</FormLabel>
                    <FormControl class="mt-2">
                         <RadioGroup
                            :model-value="String(field.value)"
                            @update:model-value="(value) => field.onChange(value === 'true')"
                            class="flex items-center space-x-4"
                        >
                           <FormItem class="flex items-center space-x-2">
                                <FormControl><RadioGroupItem id="colorsYes" value="true" /></FormControl>
                                <FormLabel for="colorsYes" class="font-normal">Yes</FormLabel>
                            </FormItem>
                             <FormItem class="flex items-center space-x-2">
                                <FormControl><RadioGroupItem id="colorsNo" value="false" /></FormControl>
                                <FormLabel for="colorsNo" class="font-normal">No</FormLabel>
                            </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </div>
                <FormField v-if="field.value === true" name="brandColorsDescription" v-slot="{ componentField: descField }">
                     <FormItem class="mt-2 pl-2">
                        <FormLabel for="brandColorsDescription" class="sr-only">Brand Colors Description</FormLabel>                        
                        <FormControl>
                            <Textarea 
                            id="brandColorsDescription"
                            placeholder="Describe your colors (e.g., hex codes #RRGGBB, names, primary/secondary)"
                            v-bind="descField"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
            </FormField>

            <!-- Brand Fonts -->
            <FormField name="hasBrandFonts" v-slot="{ field }">
                 <div class="space-y-2 border-t pt-4">
                     <FormLabel class="text-foreground">Particular fonts you prefer for your name or materials?</FormLabel>
                    <FormControl class="mt-2">
                         <RadioGroup
                            :model-value="String(field.value)"
                            @update:model-value="(value) => field.onChange(value === 'true')"
                            class="flex items-center space-x-4"
                            >
                            <FormItem class="flex items-center space-x-2">
                                <FormControl><RadioGroupItem id="fontsYes" value="true" /></FormControl>
                                <FormLabel for="fontsYes" class="font-normal">Yes</FormLabel>
                            </FormItem>
                             <FormItem class="flex items-center space-x-2">
                                <FormControl><RadioGroupItem id="fontsNo" value="false" /></FormControl>
                                <FormLabel for="fontsNo" class="font-normal">No</FormLabel>
                            </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </div>
                <FormField v-if="field.value === true" name="brandFontsDescription" v-slot="{ componentField: descField }">
                     <FormItem class="mt-2 pl-2">
                        <FormLabel for="brandFontsDescription" class="sr-only">Brand Fonts Description</FormLabel>                        
                        <FormControl>
                            <Textarea 
                            id="brandFontsDescription"
                            placeholder="List font names (e.g., Montserrat for headings, Lato for body)"
                            v-bind="descField"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
            </FormField>

        </FormItem>

        <!-- More questions for this section will go here -->
      </section>

      <Button type="submit">
        Submit Questionnaire
      </Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { h, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import Multiselect from '@vueform/multiselect'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

// --- Kept full options arrays ---
const fullBusinessDescOptions = [
  { value: 'small-business-general', label: 'Small Business (General)' },
  { value: 'startup', label: 'Startup' },
  { value: 'ecommerce', label: 'E-commerce Store' },
  { value: 'local-retail', label: 'Local Retail Business' },
  { value: 'food-service', label: 'Restaurant/Cafe/Bar' },
  { value: 'service-based', label: 'Service-Based Business (e.g., consulting, marketing)' },
  { value: 'tech', label: 'Technology Company' },
  { value: 'non-profit', label: 'Non-Profit Organization' },
  { value: 'education', label: 'Educational Institution' },
  { value: 'real-estate', label: 'Real Estate Agency' },
  { value: 'health-wellness', label: 'Health & Wellness Practice' },
  { value: 'manufacturing', label: 'Manufacturing Company' },
  { value: 'freelance-writer', label: 'Freelance Writer/Editor' },
  { value: 'freelance-designer', label: 'Freelance Graphic Designer' },
  { value: 'freelance-developer', label: 'Freelance Web Developer' },
  { value: 'visual-artist', label: 'Visual Artist (e.g., painter, sculptor)' },
  { value: 'musician-performer', label: 'Musician/Performer' },
  { value: 'photo-video', label: 'Photographer/Videographer' },
  { value: 'illustrator-animator', label: 'Illustrator/Animator' },
  { value: 'craftsperson-maker', label: 'Craftsperson/Maker' },
  { value: 'agency', label: 'Agency (e.g., marketing, design, PR)' },
  { value: 'arts-culture', label: 'Arts & Culture Organization (e.g., gallery, museum, theater)' },
  { value: 'community-group', label: 'Community Group/Organization' },
  { value: 'consulting-firm', label: 'Consulting Firm' },
  { value: 'saas', label: 'Software as a Service (SaaS) Company' },
  { value: 'freelance-social', label: 'Freelance Social Media Manager' },
  { value: 'freelance-translator', label: 'Freelance Translator/Interpreter' },
  { value: 'fashion', label: 'Fashion Designer/Stylist' },
  { value: 'architect-interior', label: 'Architect/Interior Designer' },
  { value: 'coach-therapist', label: 'Life Coach/Therapist' },
  { value: 'other', label: 'Other (Type to add)' },
];

const fullTargetAudienceOptions = [
  { value: 'consumers-general', label: 'General Consumers' },
  { value: 'smb', label: 'Small to Medium-Sized Businesses (SMBs)' },
  { value: 'enterprise', label: 'Large Enterprises' },
  { value: 'local-community', label: 'Local Community Members' },
  { value: 'age-specific', label: 'Specific Age Groups (e.g., Millennials, Gen Z, Baby Boomers)' },
  { value: 'income-specific', label: 'Specific Income Levels' },
  { value: 'profession-industry', label: 'Specific Professions/Industries (e.g., Healthcare, Tech)' },
  { value: 'creative-pros', label: 'Creative Professionals (e.g., Artists, Designers)' },
  { value: 'students', label: 'Students' },
  { value: 'homeowners', label: 'Homeowners' },
  { value: 'pet-owners', label: 'Pet Owners' },
  { value: 'travelers', label: 'Travel Enthusiasts' },
  { value: 'foodies', label: 'Foodies/Culinary Enthusiasts' },
  { value: 'tech-savvy', label: 'Tech-Savvy Individuals' },
  { value: 'eco-conscious', label: 'Environmentally Conscious Consumers' },
  { value: 'health-wellness', label: 'Health & Wellness Seekers' },
  { value: 'luxury-consumers', label: 'Luxury Goods Consumers' },
  { value: 'budget-conscious', label: 'Budget-Conscious Consumers' },
  { value: 'other-local-biz', label: 'Other Local Businesses' },
  { value: 'non-profits', label: 'Non-Profit Organizations' },
  { value: 'educational', label: 'Educational Institutions' },
  { value: 'event-attendees', label: 'Event Attendees' },
  { value: 'group-members', label: 'Members of a Specific Group/Association' },
  { value: 'global-audience', label: 'Global Audience' },
  { value: 'niche-market', label: 'Niche Market (please specify in \'Other\')' },
  { value: 'freelancers-individual', label: 'Individual Freelancers' },
  { value: 'startups', label: 'Startups' },
  { value: 'creative-agencies', label: 'Small Creative Agencies' },
  { value: 'authors-writers', label: 'Authors/Writers' },
  { value: 'musicians', label: 'Musicians/Performers' },
  { value: 'other', label: 'Other (Type to add)' },
];

const primaryGoalsOptions = [
  { value: 'sales-revenue', label: 'Increase Sales/Revenue' },
  { value: 'leads-inquiries', label: 'Generate Leads/Inquiries' },
  { value: 'brand-awareness', label: 'Build Brand Awareness/Recognition' },
  { value: 'customer-engagement', label: 'Improve Customer Engagement' },
  { value: 'provide-info', label: 'Provide Information to Existing Customers' },
  { value: 'attract-customers', label: 'Attract New Customers' },
  { value: 'showcase-portfolio', label: 'Showcase Portfolio/Work' },
  { value: 'credibility-authority', label: 'Establish Online Credibility/Authority' },
  { value: 'customer-support', label: 'Improve Customer Support' },
  { value: 'build-community', label: 'Build a Community/Forum' },
  { value: 'ecommerce', label: 'Sell Products/Services Online (E-commerce)' },
  { value: 'promote-events', label: 'Promote Events/Workshops' },
  { value: 'blog-news', label: 'Share News/Updates (Blog)' },
  { value: 'collect-emails', label: 'Collect Email Addresses/Build a Mailing List' },
  { value: 'drive-traffic-physical', label: 'Drive Traffic to a Physical Location' },
  { value: 'seo-visibility', label: 'Increase Online Visibility (SEO)' },
  { value: 'online-bookings', label: 'Facilitate Online Bookings/Reservations' },
  { value: 'streamline-processes', label: 'Streamline Internal Processes' },
  { value: 'recruit-talent', label: 'Recruit New Talent' },
  { value: 'increase-donations', label: 'Increase Donations (for Non-Profits)' },
  { value: 'educate-audience', label: 'Educate the Audience' },
  { value: 'personal-branding', label: 'Personal Branding/Online Presence (for Individuals)' },
  { value: 'resource-hub', label: 'Create a Resource Hub' },
  { value: 'integrate-marketing', label: 'Integrate with Other Marketing Channels' },
  { value: 'other', label: 'Other (please specify)' },
];

// --- Updated Zod schema (simplified) ---
const formSchema = toTypedSchema(z.object({
  businessName: z.string().min(2).max(100),
  businessDescription: z.array(z.string()).optional().default([]),
  targetAudience: z.array(z.string()).optional().default([]),
  primaryGoals: z.array(z.string()).optional().default([]),
  // Fields for existing website question
  hasExistingWebsite: z.enum(['yes', 'no'], { 
    required_error: 'Please indicate if you have an existing website.',
  }),
  existingWebsiteUrl: z.string().optional(),
  existingWebsiteFeedback: z.string().optional(),
  // Changed enum, only Yes/No now
  domainNameStatus: z.enum(['yes', 'no']).optional(), 
  domainName: z.string().optional(), 
  // New field for help status when domainNameStatus is 'no'
  domainHelpNeededStatus: z.enum(['knows_want', 'needs_help', 'unsure']).optional(), 
  // Design Preferences fields
  hasLogo: z.boolean().optional().default(false),
  hasBrandColors: z.boolean().optional().default(false),
  brandColorsDescription: z.string().optional(),
  hasBrandFonts: z.boolean().optional().default(false),
  brandFontsDescription: z.string().optional(),
}).superRefine((data, ctx) => {
  // If they have a website, the URL is required and must be a valid URL
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
    // You could add a check here if feedback is required too
  }
  // Refinement for domainName (unchanged logic, but now depends on domainNameStatus === 'yes')
  if (data.hasExistingWebsite === 'no' && data.domainNameStatus === 'yes' && !data.domainName?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please enter your domain name.',
      path: ['domainName'],
    });
  }
  // Refinement for Brand Colors
  if (data.hasBrandColors && !data.brandColorsDescription?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please describe your brand colors or provide hex codes.',
        path: ['brandColorsDescription'],
      });
  }
  // Refinement for Brand Fonts
  if (data.hasBrandFonts && !data.brandFontsDescription?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please list your preferred font names.',
        path: ['brandFontsDescription'],
      });
  }
}));

// --- Form setup (simplified watches) ---
const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values)
})
</script>

<style>
/* Import Multiselect styles (scoped might interfere) */
/* @import "@vueform/multiselect/themes/default.css"; - MOVED TO main.scss */

/* Custom styling for Multiselect to better match Shadcn/Tailwind */
:deep(.multiselect-wrapper) {
  @apply relative w-full flex items-center justify-end box-border cursor-pointer border border-input bg-background rounded-md shadow-sm pl-3 pr-10 py-2 text-left 
         focus:outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring sm:text-sm;
}

:deep(.multiselect-tags) {
  @apply flex-grow flex-shrink flex flex-wrap items-center gap-1;
}

:deep(.multiselect-tag) {
  @apply inline-flex items-center text-sm font-medium whitespace-nowrap rounded-md 
         bg-secondary text-secondary-foreground 
         py-0.5 px-2 mr-1 mb-1;
}

:deep(.multiselect-tag-remove) {
  @apply inline-flex items-center justify-center w-4 h-4 ml-1.5;
}
:deep(.multiselect-tag-remove-icon) {
  @apply w-3 h-3;
}

:deep(.multiselect-placeholder) {
 @apply absolute left-3 right-10 top-1/2 transform -translate-y-1/2 text-muted-foreground;
}

:deep(.multiselect-search) {
  @apply w-full absolute inset-0 outline-none appearance-none box-border border-0 
         bg-transparent text-sm font-sans pl-3;
  /* Match input height potentially */
}

:deep(.multiselect-dropdown) {
  @apply absolute -left-px -right-px bottom-0 transform translate-y-full border border-input mt-1.5 
         max-h-60 w-[calc(100%+2px)] overflow-auto rounded-md bg-popover py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 
         focus:outline-none sm:text-sm z-10;
}

:deep(.multiselect-options) {
  @apply list-none p-0 m-0;
}

:deep(.multiselect-option) {
  @apply relative cursor-default select-none py-2 pl-3 pr-9 text-popover-foreground;
}
:deep(.multiselect-option.is-pointed) {
  @apply bg-accent text-accent-foreground;
}
:deep(.multiselect-option.is-selected) {
  @apply font-semibold;
}
:deep(.multiselect-option.is-disabled) {
  @apply text-muted-foreground cursor-not-allowed;
}

/* Add a style for invalid state */
:deep(.multiselect-invalid .multiselect-wrapper) {
   @apply border-destructive ring-destructive focus-visible:border-destructive focus-visible:ring-destructive;
}

/* Scoped styles from before */
.client-form-container {
  color: #f0f0f0;
  height: 100vh;
}
.client-form-intro {
  color: #f0f0f0;
  margin-top: 96px;
}

/* Custom Switch Styling */
:deep(button[role='switch']) {
  /* Ensure positioning context for the thumb */
  @apply relative;
}

:deep(button[role='switch'][data-state='unchecked']) {
  @apply bg-muted/50 border border-muted;
}

:deep(button[role='switch'][data-state='checked']) {
   /* Optional: Ensure checked state uses primary/accent color if needed */
   /* @apply bg-primary; */ 
}

/* Explicitly style the thumb's position and transition */
:deep(button[role='switch'] > span) { 
  @apply pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out; 
  /* Adjust h- / w- based on your switch size if needed */
}

:deep(button[role='switch'][data-state='unchecked'] > span) {
   @apply translate-x-0.5; /* Start position */
}

:deep(button[role='switch'][data-state='checked'] > span) {
   @apply translate-x-[1.125rem]; /* End position (adjust based on switch width) */
   /* Typically width of switch - width of thumb - padding */
}

</style> 