import { Globe2, Paintbrush2, Puzzle, Calendar } from 'lucide-vue-next';

export const steps = [
  { 
    id: 'about', 
    number: 1, 
    title: 'Your Website',
    description: 'Tell us about your website needs',
    icon: Globe2
  },
  { 
    id: 'design', 
    number: 2, 
    title: 'Design Style',
    description: 'Choose your visual preferences',
    icon: Paintbrush2
  },
  { 
    id: 'functionality', 
    number: 3, 
    title: 'Features & Content',
    description: 'Select your website features',
    icon: Puzzle
  },
  { 
    id: 'logistics', 
    number: 4, 
    title: 'Project Details',
    description: 'Timeline and budget',
    icon: Calendar
  }
];

export const questions = [
  // About Step
  {
    id: 'businessName',
    step: 'about',
    question: 'What name do you primarily use for your creative work or business?',
    type: 'text',
    placeholder: 'e.g., BeyGOOD',
    helpText: 'The official name of your company or organization.',
    required: true
  },
  {
    id: 'businessDescription',
    step: 'about',
    question: 'Briefly describe your business, organization, or freelance practice.',
    type: 'multiselect',
    options: [
      { value: 'small_business', label: 'Small Business (General)' },
      { value: 'startup', label: 'Startup' },
      { value: 'ecommerce', label: 'E-commerce Store' },
      { value: 'local_retail', label: 'Local Retail Business' },
      { value: 'restaurant', label: 'Restaurant/Cafe/Bar' },
      { value: 'service_based', label: 'Service-Based Business' },
      { value: 'technology', label: 'Technology' },
      { value: 'non_profit', label: 'Non-Profit' },
      { value: 'education', label: 'Educational Institution' }
    ],
    allowCustom: true,
    required: true
  },
  {
    id: 'targetAudience',
    step: 'about',
    question: 'Who is your target audience?',
    type: 'multiselect',
    options: [
      { value: 'general_public', label: 'General Public' },
      { value: 'local_community', label: 'Local Community' },
      { value: 'businesses', label: 'Other Businesses (B2B)' },
      { value: 'young_professionals', label: 'Young Professionals' },
      { value: 'families', label: 'Families' },
      { value: 'students', label: 'Students' },
      { value: 'luxury', label: 'Luxury/High-End Customers' }
    ],
    allowCustom: true,
    required: true
  },
  {
    id: 'primaryGoals',
    step: 'about',
    question: 'What are your primary goals for the website?',
    type: 'multiselect',
    options: [
      { value: 'showcase_work', label: 'Showcase Work/Portfolio' },
      { value: 'sell_products', label: 'Sell Products Online' },
      { value: 'generate_leads', label: 'Generate Leads/Inquiries' },
      { value: 'provide_info', label: 'Provide Information' },
      { value: 'collect_emails', label: 'Collect Email Subscribers' },
      { value: 'book_appointments', label: 'Book Appointments' }
    ],
    allowCustom: true,
    required: true
  },

  // Design Step
  {
    id: 'hasLogo',
    step: 'design',
    question: 'Do you have a logo?',
    type: 'boolean',
    options: [
      { value: true, label: 'Yes', description: 'I have a logo ready to use' },
      { value: false, label: 'No', description: 'I need help with branding' }
    ],
    required: true
  },
  {
    id: 'hasBrandColors',
    step: 'design',
    question: 'Do you have brand colors?',
    type: 'boolean',
    options: [
      { value: true, label: 'Yes', description: 'I have specific colors to use' },
      { value: false, label: 'No', description: 'I need help choosing colors' }
    ],
    conditionalField: {
      showIf: true,
      field: {
        id: 'brandColorsDescription',
        type: 'textarea',
        placeholder: 'Please describe your brand colors or paste color codes...'
      }
    },
    required: true
  },
  {
    id: 'hasBrandFonts',
    step: 'design',
    question: 'Do you have brand fonts?',
    type: 'boolean',
    options: [
      { value: true, label: 'Yes', description: 'I have specific fonts to use' },
      { value: false, label: 'No', description: 'I need help choosing fonts' }
    ],
    conditionalField: {
      showIf: true,
      field: {
        id: 'brandFontsDescription',
        type: 'textarea',
        placeholder: 'Please list your brand fonts...'
      }
    },
    required: true
  },
  {
    id: 'aestheticStyle',
    step: 'design',
    question: 'What aesthetic style appeals to you?',
    type: 'multiselect',
    options: [
      { 
        value: 'minimal',
        label: 'Minimal',
        definition: 'Clean, simple, lots of white space',
        style: 'minimal'
      },
      {
        value: 'modern',
        label: 'Modern',
        definition: 'Contemporary, bold, innovative',
        style: 'modern'
      },
      {
        value: 'professional',
        label: 'Professional',
        definition: 'Traditional, trustworthy, established',
        style: 'professional'
      },
      {
        value: 'playful',
        label: 'Playful',
        definition: 'Fun, energetic, colorful',
        style: 'playful'
      },
      {
        value: 'luxury',
        label: 'Luxury',
        definition: 'Elegant, high-end, sophisticated',
        style: 'luxury'
      }
    ],
    allowCustom: true,
    required: true
  },

  // Functionality Step
  {
    id: 'essentialPages',
    step: 'functionality',
    question: 'Which pages are essential for your website?',
    type: 'multiselect',
    options: [
      { 
        value: 'home', 
        label: 'Home', 
        definition: 'Main landing page',
        required: true 
      },
      { 
        value: 'about', 
        label: 'About',
        definition: 'Information about your business'
      },
      { 
        value: 'services', 
        label: 'Services/Products',
        definition: 'What you offer'
      },
      { 
        value: 'portfolio', 
        label: 'Portfolio/Gallery',
        definition: 'Showcase of your work'
      },
      { 
        value: 'contact', 
        label: 'Contact',
        definition: 'How to reach you'
      },
      { 
        value: 'blog', 
        label: 'Blog',
        definition: 'Regular content updates'
      },
      { 
        value: 'testimonials', 
        label: 'Testimonials',
        definition: 'Customer reviews and feedback'
      }
    ],
    allowCustom: true,
    required: true
  },
  {
    id: 'desiredFeatures',
    step: 'functionality',
    question: 'What features would you like to include?',
    type: 'multiselect',
    options: [
      { 
        value: 'contact_form', 
        label: 'Contact Form',
        category: 'Communication',
        definition: 'Allow visitors to send you messages'
      },
      { 
        value: 'newsletter', 
        label: 'Newsletter Signup',
        category: 'Marketing',
        definition: 'Collect email addresses for marketing'
      },
      { 
        value: 'social_media', 
        label: 'Social Media Integration',
        category: 'Marketing',
        definition: 'Connect with your social profiles'
      },
      { 
        value: 'booking_system', 
        label: 'Booking/Appointment System',
        category: 'Business',
        definition: 'Let clients schedule appointments'
      },
      { 
        value: 'ecommerce', 
        label: 'E-commerce/Shop',
        category: 'Business',
        definition: 'Sell products online'
      },
      { 
        value: 'blog', 
        label: 'Blog/News Section',
        category: 'Content',
        definition: 'Share updates and articles'
      },
      { 
        value: 'search', 
        label: 'Search Functionality',
        category: 'Navigation',
        definition: 'Help users find content'
      },
      { 
        value: 'members_area', 
        label: 'Members Area',
        category: 'Access',
        definition: 'Protected content for members'
      }
    ],
    allowCustom: true,
    required: false
  },

  // Logistics Step
  {
    id: 'timeline',
    step: 'logistics',
    question: 'What is your desired timeline?',
    type: 'select',
    options: [
      { value: 'asap', label: 'As soon as possible' },
      { value: '1_month', label: 'Within 1 month' },
      { value: '2_3_months', label: '2-3 months' },
      { value: '3_6_months', label: '3-6 months' },
      { value: 'flexible', label: 'Flexible' }
    ],
    required: true
  },
  {
    id: 'budgetTier',
    step: 'logistics',
    question: 'What is your budget range?',
    type: 'select',
    options: [
      { 
        value: 'starter',
        label: 'Starter',
        price: '$2,500 - $5,000',
        definition: 'Basic website with essential features'
      },
      {
        value: 'professional',
        label: 'Professional',
        price: '$5,000 - $10,000',
        definition: 'Full-featured website with custom design'
      },
      {
        value: 'premium',
        label: 'Premium',
        price: '$10,000+',
        definition: 'Advanced website with complex functionality'
      }
    ],
    required: true
  }
];

// Helper functions for accessing questions
export const getQuestionsByStep = (stepId: string) => {
  return questions.filter(q => q.step === stepId);
};

export const getQuestionById = (questionId: string) => {
  return questions.find(q => q.id === questionId);
};

export const getStepById = (stepId: string) => {
  return steps.find(s => s.id === stepId);
};

// Types
export type Question = typeof questions[number];
export type Step = typeof steps[number];
export type Option = {
  value: string | boolean;
  label: string;
  description?: string;
  definition?: string;
  price?: string;
  style?: string;
  category?: string;
  required?: boolean;
};

export type ConditionalField = {
  showIf: boolean;
  field: {
    id: string;
    type: string;
    placeholder: string;
  };
};

// Form validation schemas can be generated from these configurations
export const generateValidationSchema = () => {
  // Implementation for generating validation schema based on questions
}; 