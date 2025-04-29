import { ref } from 'vue';

// --- Text Configuration Interfaces ---
export interface OptionText {
  value: string | boolean; // Value the option represents
  label: string;
  description?: string; // Optional description for complex options like budget tiers
}

export interface DesiredFeatureCategoryTexts {
    definition: string;
    options: Record<string, string>; // Maps example.value to example.label text
}

interface FieldText {
  label?: string;
  description?: string;
  placeholder?: string;
  intro?: string;
  conditionalText?: {
    [conditionValue: string]: string;
  };
  options?: OptionText[];
  categories?: Record<string, DesiredFeatureCategoryTexts>; 
  otherOptionLabel?: string;
}

// Define the type for the entire object
export type AllFieldTexts = Record<string, FieldText>;

// --- Text Content ---
export const fieldTexts = ref<AllFieldTexts>({
  // --- Section 1: About Your Website ---
  businessName: {
    label: 'What name do you primarily use for your creative work or business?',
    description: 'The official name of your company or organization.',
    placeholder: 'e.g., BeyGOOD'
  },
  businessDescription: {
    label: 'Briefly describe your business, organization, or freelance practice.',
    description: 'Select from suggestions or type your own and press Enter.',
    placeholder: 'Type or select categories'
  },
  targetAudience: {
    label: 'Who is your target audience (ideal customer/client)?',
    description: 'Select from suggestions or type your own and press Enter.',
    placeholder: 'Type or select audiences'
  },
  primaryGoals: {
    label: 'What are the primary goals for your new website?',
    description: 'What should the website achieve for your business? Select all that apply or add your own.',
    placeholder: 'Select or type goals'
  },
  hasExistingWebsite: {
    label: 'Do you currently have a website?'
  },
  existingWebsiteUrl: {
    label: 'If yes, what is the URL?',
    placeholder: 'https://example.com'
  },
  existingWebsiteFeedback: {
    label: 'What do you like and dislike about your current site?',
    description: 'Be specific! This helps understand your preferences.',
    placeholder: 'e.g., Like the design, dislike slow loading times...'
  },
  domainNameStatus: {
     label: 'Do you already have a domain name?'
  },
  domainName: {
      label: 'What is your domain name?',
      placeholder: 'yourdomain.com'
  },
  domainHelpNeededStatus: {
      // Label handled by <p> tag
      // Option labels remain hardcoded below for now
  },

  // --- Section 2: Design Preferences & Inspiration ---
  visualIdentityGroup: { 
    intro: 'Let\'s talk about your visual identity. Do you have anything like:'
  },
  hasLogo: {
    label: 'A specific logo you use?',
    options: [ 
      { value: true, label: 'Yes' },
      { value: false, label: 'No' }
    ],
    conditionalText: { 
      'true': 'Great! Please email your logo file(s) (preferably vector format like .svg or .ai, or high-res .png) separately.',
      'false': 'That\'s completely fine! Logo design is definitely something we can discuss. Start thinking about logos you like the look and feel of – it\'ll give us a great direction. You can also explore some interesting styles and ideas on <a href="https://logosystem.co/" target="_blank" rel="noopener noreferrer" class="underline hover:text-secondary">this site</a>.'
    }
  },
  hasBrandColors: {
    label: 'Certain colors you always use for your business?',
    options: [ 
      { value: true, label: 'Yes' },
      { value: false, label: 'No' }
    ]
  },
  brandColorsDescription: {
    placeholder: 'Describe your colors (e.g., hex codes #RRGGBB, names, primary/secondary)'
  },
  hasBrandFonts: {
    label: 'Particular fonts you prefer for your name or materials?',
     options: [ 
      { value: true, label: 'Yes' },
      { value: false, label: 'No' }
    ]
  },
  brandFontsDescription: {
    placeholder: 'List font names (e.g., Montserrat for headings, Lato for body)'
  },
  inspirationalWebsitesGroup: { 
     intro: 'Got any favorite websites that you think look really cool?'
  },
  inspirationalWebsitesUrls: {
    label: 'Please share the URLs (web addresses)',
    placeholder: 'e.g., https://example.com, www.anothercoolsite.net (one per line is helpful)'
  },
  inspirationalWebsitesComments: {
    label: 'What catches your eye about them?',
    description: 'Visual inspiration is super helpful!',
    placeholder: 'e.g., I love the color scheme on the first site, the smooth animations on the second...'
  },
  aestheticStyle: {
    label: 'What is your preferred aesthetic style for your website?',
    description: 'Select multiple styles if applicable. Hover over a style for a brief description.'
    // Options from aestheticStyleOptions ref
  },

  // --- Section 3: Functionality & Content ---
  essentialPages: {
    label: 'What are the essential pages you envision for your website?',
    description: 'Select the pages you definitely need. Hover over a page name for a description.'
    // Options from essentialPagesOptions ref
  },
  desiredFeatures: {
    label: 'Thinking about what you want your website visitors to be able to do on your site, what key features or functionalities come to mind? Consider these common categories:',
    categories: {
        Communication: {
            definition: "Ways for you and your website visitors to talk to each other or stay in touch.",
            options: {
                "comm-contact-forms": "Contact forms",
                "comm-live-chat": "Live chat",
                "comm-newsletter": "Newsletter signup"
            }
        },
        'E-commerce': { 
            definition: "If you plan to sell things online, these are the tools to make that happen.",
             options: {
                "ecom-cart": "Shopping cart",
                "ecom-payment": "Payment processing",
                "ecom-filtering": "Product filtering/sorting",
                "ecom-order-mgmt": "Order management"
            }
        },
        'User Interaction': {
             definition: "Features that allow visitors to engage with your website and each other.",
              options: {
                "user-accounts": "Account creation/login",
                "user-profiles": "User profiles",
                "user-comments": "Commenting systems",
                "user-forums": "Forums",
                "user-surveys": "Surveys/Polls"
            }
        },
        'Content Display': {
            definition: "How information and media are shown on your website.",
            options: {
                "content-galleries": "Image galleries",
                "content-video": "Video embedding",
                "content-search": "Search functionality",
                "content-blog": "Blog/Article sections",
                "content-maps": "Interactive maps"
            }
        },
        'Community Features': {
            definition: "Tools for building a group of people around your website.",
            options: {
                "commty-discussions": "Discussion areas",
                "commty-profiles": "Personal profiles for members",
                "commty-messaging": "Ways for members to send private messages"
            }
        }
        // Add other categories from functionalityOptions here...
    },
    otherOptionLabel: 'Other (please specify)'
  },
  desiredFeaturesOther: {
    placeholder: 'Describe any other features you need...'
  },

  // --- Section 4: Technical & Logistical Aspects ---
  projectBudgetTier: {
    label: 'What is your desired budget range for this project?',
    description: '(This helps gauge the scope and features feasible. We can adjust based on detailed needs.) Just a heads-up, the quicker you need it, the more focused the project might have to be or the more it could cost, while a more relaxed timeline gives us more room to explore and potentially keep the budget a bit easier.'
    // Options from budgetTierOptions ref
  },
  pointOfContactGroup: {
    intro: 'Who will be the primary point of contact for this project?'
  },
  contactName: {
    label: 'Name',
    placeholder: 'Full Name'
  },
  contactEmail: {
    label: 'Email',
    placeholder: 'email@example.com'
  },
  contactPhone: {
    label: 'Phone Number (Optional)',
    placeholder: '(555) 123-4567'
  },
  feedbackPreference: {
    label: 'How would you prefer to provide feedback during the design process?',
     options: [
        { value: 'written', label: 'Primarily through written comments and emails.' },
        { value: 'video', label: "I'd prefer regular video calls to discuss visuals." },
        { value: 'mix', label: "I'm happy with a mix of both." },
        { value: 'milestones', label: 'I trust your expertise and will mostly provide feedback at key milestones.' },
    ]
  },

  // Project Timeline
  projectTimeline: {
    label: 'When would you like to start your project?',
    description: 'This helps us plan resources and set realistic expectations.',
    options: [
      { value: 'asap', label: 'As soon as possible' },
      { value: 'within_month', label: 'Within a month' },
      { value: 'within_quarter', label: 'Within 3 months' },
      { value: 'within_6months', label: 'Within 6 months' },
      { value: 'flexible', label: 'Flexible / No specific timeline' }
    ]
  },

  // Budget Range
  budgetRange: {
    label: 'What is your budget range for this project?',
    description: 'This helps us recommend the most suitable solutions within your budget.'
  }
}); 