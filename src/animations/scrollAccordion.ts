import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export const scrollAccordionAnimations = {
  initialize: (wrapper: Element, content: Element) => {
    // Initialize ScrollSmoother
    const scrollerSmoother = ScrollSmoother.create({
      content: content,
      wrapper: wrapper,
      smooth: true,
      effects: false,
      normalizeScroll: true
    });

    // Create the timeline animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.accordions',
        pin: true,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        ease: 'linear',
      }
    });

    // Animate accordion text closing
    tl.to('.accordion .text', {
      height: 0,
      paddingBottom: 0,
      opacity: 0,
      stagger: 0.5,
    });
    
    // Animate accordion margin reduction
    tl.to('.accordion', {
      marginBottom: -15,
      stagger: 0.5,
    }, '<');

    return { scrollerSmoother, timeline: tl };
  }
};