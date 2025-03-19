import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const card3DAnimations = {
  // Animate a single card
  animateCard: (card: Element) => {
    // Set initial state
    gsap.set(card, {
      opacity: 0,
      y: 30,
      rotateX: 5,
      rotateY: -5
    });
    
    // Animate to final state
    return gsap.to(card, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: 'power2.out'
    });
  },
  
  // Animate a group of cards with staggered timing
  animateCardGroup: (container: Element) => {
    const cards = container.querySelectorAll('.card-3d');
    
    if (cards.length === 0) return;
    
    // Create scroll trigger for the animation
    ScrollTrigger.create({
      trigger: container,
      start: 'top bottom-=100px',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          onStart: () => {
            // Set initial state
            gsap.set(cards, {
              opacity: 0,
              y: 30,
              rotateX: 5,
              rotateY: -5
            });
          }
        });
      }
    });
  },
  
  // Special hover effect animation
  enhanceHoverEffect: (card: Element) => {
    const image = card.querySelector('.card-3d__image');
    const info = card.querySelector('.card-3d__info');
    
    // Create hover animation
    const hoverTl = gsap.timeline({ paused: true });
    
    hoverTl
      .to(image, {
        scale: 1.05,
        duration: 0.4,
        ease: 'power2.out'
      })
      .to(info, {
        y: -10,
        duration: 0.3,
        ease: 'power1.out'
      }, '<');
    
    // Add event listeners
    card.addEventListener('mouseenter', () => hoverTl.play());
    card.addEventListener('mouseleave', () => hoverTl.reverse());
    
    return hoverTl;
  }
};