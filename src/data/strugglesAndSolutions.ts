export interface Struggle {
  id: number;
  title: string;
  description: string;
  iconKey: string;
}

export interface Solution {
  id: number;
  title: string;
  description: string;
  iconKey: string;
}

export const struggles: Struggle[] = [
  {
    id: 0,
    title: "DIY Platforms: Easy, But Inefficient",
    description: "Platforms like Webflow, Squarespace, and Wix make website creation seem simple. However, without a deep understanding of design principles, user experience, and SEO, these sites often lack the polish and performance needed to truly succeed. You might get a site up quickly, but it may not effectively convert visitors or represent your brand professionally.",
    iconKey: "diyPlatforms"
  },
  {
    id: 1,
    title: "Poor User Experience (UX)",
    description: "Many websites have confusing navigation, slow loading times, and designs that don't translate well to mobile devices. This leads to frustrated visitors who quickly leave the site.",
    iconKey: "poorUX"
  },
  {
    id: 2,
    title: "Lack of Clear Calls to Action (CTAs)",
    description: "Websites often fail to guide visitors towards desired actions. This results in missed opportunities for lead generation, sales, or engagement.",
    iconKey: "unclearCTA"
  },
  {
    id: 3,
    title: "Search Engine Optimization (SEO) Issues",
    description: "Without proper SEO, websites struggle to rank in search results. This means potential customers can't find the business online.",
    iconKey: "seoIssues"
  },
  {
    id: 4,
    title: "Outdated Design and Technology",
    description: "Websites with outdated designs and technology can make a business look unprofessional and out of touch.",
    iconKey: "outdatedDesign"
  },
  {
    id: 5,
    title: "Lack of Maintenance and Security",
    description: "Websites that aren't regularly updated can become vulnerable to security threats and may not function properly.",
    iconKey: "lackMaintenance"
  },
  {
    id: 6,
    title: "Not Mobile-Friendly",
    description: "With the majority of web traffic coming from mobile devices. If your website isn't optimized for mobile, you're losing out on potential customers.",
    iconKey: "notMobileFriendly"
  }
];

export const solutions: Solution[] = [
  {
    id: 0,
    title: "Expert Guidance on Any Platform",
    description: "I leverage my extensive front-end development experience to optimize your website, regardless of the platform you choose. Whether it's Webflow, Squarespace, Wix, or a custom build, I ensure your site is not only visually appealing but also strategically designed for performance and conversions.",
    iconKey: "expertGuidance"
  },
  {
    id: 1,
    title: "User-Centered Design",
    description: "I create intuitive, responsive, and visually appealing websites that provide a seamless user experience across all devices.",
    iconKey: "userCenteredDesign"
  },
  {
    id: 2,
    title: "Strategic CTAs",
    description: "I implement clear and compelling CTAs that guide visitors towards desired actions, increasing conversions and engagement.",
    iconKey: "strategicCTAs"
  },
  {
    id: 3,
    title: "SEO Optimization",
    description: "I optimize websites for search engines, improving visibility and driving organic traffic.",
    iconKey: "seoOptimization"
  },
  {
    id: 4,
    title: "Modern Design and Technology",
    description: "I use the latest design trends and technologies to create websites that are both visually stunning and functionally robust.",
    iconKey: "modernDesign"
  },
  {
    id: 5,
    title: "Ongoing Maintenance and Support",
    description: "I provide regular website maintenance, updates, and security monitoring to ensure optimal performance.",
    iconKey: "ongoingMaintenance"
  },
  {
    id: 6,
    title: "Mobile-First Approach",
    description: "I prioritize mobile-friendliness in all my designs, ensuring a seamless experience for all users.",
    iconKey: "mobileFirst"
  }
];