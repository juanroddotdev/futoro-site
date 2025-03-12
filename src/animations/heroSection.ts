import gsap from 'gsap';

export const heroSectionAnimations = {
  contentFadeIn: () => {
    return gsap.from('.hero-content > *', {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.out'
    });
  }
};