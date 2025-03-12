export interface Highlight {
  number: string;
  label: string;
}

export interface ExpertiseItem {
  title: string;
  description: string;
  icon: string;
}

export interface JourneyItem {
  title: string;
  content: string;
}

export const highlights: Highlight[] = [
  { number: "10+", label: "Years Experience" },
  { number: "150+", label: "Projects Completed" },
  { number: "98%", label: "Client Satisfaction" },
  { number: "24/7", label: "Support" }
];

export const expertise: ExpertiseItem[] = [
  {
    title: "Front-End Development",
    description: "Specializing in creating responsive, user-friendly websites using modern frameworks and best practices.",
    icon: "💻"
  },
  {
    title: "Platform Expertise",
    description: "Proficient in Squarespace, Wix, Webflow, and custom development solutions.",
    icon: "🛠"
  },
  {
    title: "Performance Optimization",
    description: "Ensuring your website loads fast and performs smoothly across all devices.",
    icon: "⚡"
  }
];

export const journey: JourneyItem[] = [
  {
    title: "Who We Are",
    content: "Hi, I'm Juan! A front-end developer passionate about building beautiful and functional websites."
  },
  {
    title: "Our Experience",
    content: "With a decade of experience working with diverse clients, I understand the importance of personalized solutions."
  },
  {
    title: "The Mission",
    content: "Now, I'm transitioning to freelance, dedicating my skills to helping individuals and small businesses thrive online."
  },
  {
    title: "The Vision",
    content: "At Futoro, we empower businesses with exceptional custom online experiences. From implementing clear calls-to-action to enhance user retention to optimizing metadata and SEO for improved visibility, we provide all the tools and expertise your business needs to thrive online."
  }
];