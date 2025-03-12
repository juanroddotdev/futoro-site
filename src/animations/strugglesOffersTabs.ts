import gsap from 'gsap';

export const strugglesOffersAnimations = {
  switchTabs: (show: 'struggles' | 'solutions') => {
    const cards = show === 'struggles' ? '.struggle-card' : '.solution-card';
    const otherCards = show === 'struggles' ? '.solution-card' : '.struggle-card';

    const tl = gsap.timeline();

    // Fade out current cards
    tl.to(otherCards, {
      opacity: 0,
      duration: 0.3,
      stagger: 0.02
    });

    // Fade in new cards
    tl.to(cards, {
      opacity: 1,
      duration: 0.3,
      stagger: 0.02,
      ease: 'power2.out'
    }, "<0.2");

    return tl;
  },

  initializeCards: () => {
    // Set initial state for solutions cards
    gsap.set('.solution-card', { opacity: 0 });
    
    // Fade in struggle cards
    return gsap.fromTo('.struggle-card', 
      { opacity: 0 },
      { opacity: 1, duration: 0.3, stagger: 0.02, ease: 'power2.out' }
    );
  }
};