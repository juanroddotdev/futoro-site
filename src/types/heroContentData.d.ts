declare module '@/data/heroContentData' {
  export interface HeroContent {
    headline: string;
    subheadline: string;
    cta: string;
    id?: string;
  }

  /**
   * Returns a random hero content object
   */
  export function getRandomHeroContent(): HeroContent;
}