export interface Service {
  id: number;
  title: string;
  titleSimplified: string;
  description: string;
  descriptionSimplified: string;
}

export const services: Service[] = [
  {
    id: 1,
    title: "Custom Website Design & Development",
    titleSimplified: "Custom Websites",
    description: "Building unique websites tailored to clients' specific needs and brand identities.",
    descriptionSimplified: "Unique, tailored websites"
  },
  {
    id: 2,
    title: "Website Redesign & Optimization",
    titleSimplified: "Website Upgrades",
    description: "Revamping existing websites for improved performance, user experience, and aesthetics.",
    descriptionSimplified: "Improving existing sites."
  },
  {
    id: 3,
    title: "E-commerce Solutions",
    titleSimplified: "Online Stores",
    description: "Developing online stores with secure payment gateways and user-friendly interfaces.",
    descriptionSimplified: "E-commerce solutions."
  },
  {
    id: 4,
    title: "SEO & Digital Marketing Integration",
    titleSimplified: "Get Seen Online",
    description: "Implementing SEO best practices and integrating digital marketing tools for enhanced online visibility.",
    descriptionSimplified: "SEO and marketing help."
  },
  {
    id: 5,
    title: "Website Maintenance & Support",
    titleSimplified: "Keep it Running",
    description: "Providing ongoing maintenance, updates, and technical support to ensure websites remain secure and up-to-date.",
    descriptionSimplified: "Website maintenance."
  },
  {
    id: 6,
    title: "Consultation & Strategy",
    titleSimplified: "Advice",
    description: "Offering expert advice and strategic planning to help clients achieve their online business goals.",
    descriptionSimplified: "Expert web strategy."
  },
];