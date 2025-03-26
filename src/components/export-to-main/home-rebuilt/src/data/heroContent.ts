export interface HeroContent {
  id: number;
  headline: string;
  subheadline: string;
  cta: string;
  description: string;
}

export const heroContents: HeroContent[] = [
  {
    id: 1,
    headline: "Build Your Dream Website",
    subheadline: "Professional, custom websites designed to grow your business.",
    cta: "Get a Free Consultation",
    description: "Direct and clear, focusing on building custom websites for business growth."
  },
  {
    id: 2,
    headline: "Websites That Convert",
    subheadline: "Expert front-end development for impactful online experiences.",
    cta: "Let's Build Your Site",
    description: "Focuses on the result of converting visitors, highlighting front-end expertise."
  },
  {
    id: 3,
    headline: "Expert Web Development Services",
    subheadline: "Custom websites and optimizations by a seasoned front-end developer.",
    cta: "Let's Talk",
    description: "Highlights expertise and customization, with a direct call to view services."
  },
  {
    id: 4,
    headline: "Custom Websites, Tailored to You",
    subheadline: "Professional website design and development for businesses and individuals.",
    cta: "Let's Talk",
    description: "Emphasizes personalization and professionalism, with a quote-focused CTA."
  },
  {
    id: 5,
    headline: "Building Modern Websites for Your Future",
    subheadline: "Professional Web development services by a Front-End expert.",
    cta: "Contact Me",
    description: "Combines clarity with a future-oriented message, highlighting front-end expertise."
  },
  {
    id: 6,
    headline: "Your Website, Supercharged",
    subheadline: "Expert front-end development for impactful online experiences.",
    cta: "Let's Build Your Site",
    description: "Catchy and fun, using an action verb and focusing on impactful experiences."
  },
  {
    id: 7,
    headline: "Websites That Wow",
    subheadline: "Professional, custom websites designed to grow your business.",
    cta: "Get a Free Consultation",
    description: "Catchy and benefit-oriented, emphasizing professional and growth-focused websites."
  },
  {
    id: 8,
    headline: "Ditch the DIY, Get a Pro",
    subheadline: "Custom websites and optimizations by a seasoned front-end developer.",
    cta: "Let's Talk",
    description: "Catchy and relatable, using a common term and highlighting professional service."
  },
  {
    id: 9,
    headline: "Level Up Your Online Presence",
    subheadline: "Expert Web Development Services.",
    cta: "Contact Me",
    description: "Catchy and action-oriented, focusing on improving the client's online presence."
  },
  {
    id: 10,
    headline: "From Code to Captivating",
    subheadline: "Building modern websites for your future.",
    cta: "Let's Talk",
    description: "Catchy and intriguing, highlighting the transformation from code to captivating websites."
  }
];

// Helper function to get a random hero content
export const getRandomHeroContent = (): HeroContent => {
  const randomIndex = Math.floor(Math.random() * heroContents.length);
  return heroContents[randomIndex];
};

// Helper function to get hero content by ID
export const getHeroContentById = (id: number): HeroContent | undefined => {
  return heroContents.find(content => content.id === id);
};