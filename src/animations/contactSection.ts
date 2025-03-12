import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const contactSectionAnimations = {
  animateCard: () => {
    return gsap.from('.contact-card', {
      y: 30,
      scale: 0.95,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    });
  },

  animateCardBorder: () => {
    return gsap.from('.contact-card-border', {
      strokeDashoffset: 1000,
      duration: 1.2,
      ease: 'power2.out'
    });
  },

  animateHeading: () => {
    return gsap.from('.contact-content h2', {
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out'
    });
  },

  animateBodyText: () => {
    // First, ensure initial state
    gsap.set('.contact-content p.body-text', {
      opacity: 0,
      y: 20
    });

    // Then animate to final state
    return gsap.to('.contact-content p.body-text', {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    });
  },

  animateContactInfo: () => {
    return gsap.from('.contact-content .contact-info', {
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out'
    });
  },

  animateCtaButton: () => {
    // First, ensure initial state
    gsap.set('.contact-content .cta-button', {
      opacity: 0,
      y: 20
    });

    // Then animate to final state
    return gsap.to('.contact-content .cta-button', {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    });
  },

  initializeAnimations: () => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.contact-section',
        start: 'top 60%',
        toggleActions: 'play none none none'
      }
    });

    timeline
      .add(contactSectionAnimations.animateCard())
      .add(contactSectionAnimations.animateCardBorder(), '-=0.3')
      .add(contactSectionAnimations.animateHeading(), '-=0.8')
      .add(contactSectionAnimations.animateBodyText(), '-=0.3')
      .add(contactSectionAnimations.animateContactInfo(), '-=0.2')
      .add(contactSectionAnimations.animateCtaButton(), '-=0.1');

    return timeline;
  }
};