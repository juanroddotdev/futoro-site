// export const steps = [
//     {
//       id: 1,
//       title: "Discovery & Planning",
//       description: "We start with a detailed consultation to understand your goals, target audience, and unique requirements. This helps us create a tailored strategy for your project.",
//       icon: "📋"
//     },
//     {
//       id: 2,
//       title: "Design & Development",
//       description: "Using modern design principles and cutting-edge technology, we create a custom website that perfectly aligns with your brand and objectives.",
//       icon: "💻"
//     },
//     {
//       id: 3,
//       title: "Testing & Refinement",
//       description: "We thoroughly test your website across all devices and browsers, making necessary adjustments to ensure optimal performance and user experience.",
//       icon: "🔍"
//     },
//     {
//       id: 4,
//       title: "Launch & Support",
//       description: "After final approval, we launch your website and provide ongoing support and maintenance to keep your site running smoothly.",
//       icon: "🚀"
//     }
// ];

export const alternativeSteps = [
    {
      id: 1,
      title: "Initial Consultation",
      description: "A deep-dive session where we explore your vision, analyze market opportunities, and define clear project objectives.",
      icon: "🎯"
    },
    {
      id: 2,
      title: "Strategic Planning",
      description: "We create a comprehensive roadmap, including wireframes, technical specifications, and timeline milestones.",
      icon: "📊"
    },
    {
      id: 3,
      title: "Creative Development",
      description: "Our team brings your vision to life through innovative design and robust development, with regular feedback loops.",
      icon: "🎨"
    },
    {
      id: 4,
      title: "Quality Assurance",
      description: "Rigorous testing across devices and platforms to ensure a flawless user experience and optimal performance.",
      icon: "✨"
    },
    {
      id: 5,
      title: "Deployment",
      description: "Smooth launch with careful attention to security, performance, and SEO best practices.",
      icon: "🚀"
    },
    {
      id: 6,
      title: "Ongoing Support",
      description: "Continuous monitoring, updates, and optimization to keep your digital presence ahead of the curve.",
      icon: "🛠️"
    }
];
export const steps = [
  {
    id: 1,
    step: "Let's Talk About Your Goals",
    icon: "🎯",
    description: [
      "We'll have a free chat to understand your project and business needs.",
      "I'll ask about your target audience, design preferences, and technical requirements.",
      "We'll explore how I can use technologies like HTML, CSS, JavaScript, and modern frameworks to achieve your goals."
    ]
  },
  {
    id: 2,
    step: "Planning Your Website",
    icon: "📋",
    description: [
      "I'll create a detailed proposal outlining the scope of work, technologies to be used (e.g., React, Vue.js), timeline, and cost.",
      "We'll review the proposal together and make any necessary adjustments.",
      "Once we agree, we'll start building your website using the agreed-upon technologies."
    ]
  },
  {
    id: 3,
    step: "Design & Development",
    icon: "💻",
    description: [
      "I'll design how your website will look and feel, focusing on UX/UI principles and responsiveness.",
      "You'll get to see the designs and provide feedback throughout the process.",
      "Then, I'll build your website using modern front-end technologies and best practices."
    ]
  },
  {
    id: 4,
    step: "Testing & Refinement",
    icon: "🔍",
    description: [
      "I'll conduct thorough testing for functionality, performance, and cross-browser compatibility.",
      "We'll review the website together and make any final adjustments, including SEO optimization and performance tweaks."
    ]
  },
  {
    id: 5,
    step: "Launching Your Website",
    icon: "🚀",
    description: [
      "We'll deploy your website to a live server, ensuring a smooth transition.",
      "I'll provide training on how to manage and update your website, including content management systems (CMS) if applicable."
    ]
  },
  {
    id: 6,
    step: "Keeping Your Website Running",
    icon: "⚙️",
    description: [
      "I can provide ongoing maintenance, updates, and security monitoring.",
      "I'll ensure your website remains secure, up-to-date, and optimized for performance."
    ]
  }
]

// Create a unified interface that works for both data structures
export interface ProcessStep {
    id: number;
    step?: string;  // Optional for alternativeSteps
    title?: string; // Optional for defaultSteps
    icon: string;
    description: string[] | string;
}

// Export the type of steps array for type safety
export type ProcessSteps = ProcessStep[];
