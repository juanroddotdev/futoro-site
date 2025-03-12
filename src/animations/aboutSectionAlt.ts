import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const aboutSectionAnimations = {
  highlightCounter: (obj: { val: number }, endNumber: number) => {
    return gsap.to(obj, {
      scrollTrigger: {
        trigger: '.highlights',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      val: endNumber,
      duration: 2,
      ease: 'power1.out'
    });
  },

  expertiseCards: () => {
    // Set initial state
    gsap.set('.expertise-grid__card', {
      opacity: 0,
      y: 50
    });

    // Animate to final state
    return gsap.to('.expertise-grid__card', {  // Changed from gsap.from to gsap.to
      scrollTrigger: {
        trigger: '.expertise-grid',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out'
    });
  },

  journeyCards: () => {
    return gsap.from('.journey-section__card', {
      scrollTrigger: {
        trigger: '.journey-section',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2
    });
  }
};