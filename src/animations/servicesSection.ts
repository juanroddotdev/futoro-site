import gsap from 'gsap';

export const servicesSectionAnimations = {
  cardsFadeIn: () => {
    return gsap.from('.service-card', {
      scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 80%',
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out'
    });
  }
};