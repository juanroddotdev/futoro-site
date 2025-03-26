import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const timelineAnimations = {
  initMainTimeline: () => {
    // Set initial state
    gsap.set('.timeline-line', {
      scaleY: 0,
      transformOrigin: 'top center'
    });

    // Create master timeline
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.timeline-container',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: true,
      }
    });

    // Add main stem animation
    return masterTl.to('.timeline-line', {
      scaleY: 1,
      ease: 'none',
    });
  },

  animateTimelineItems: (item: Element, index: number) => {
    const stem = item.querySelector('.timeline-stem');
    const title = item.querySelector('.timeline-title');
    const bullets = item.querySelectorAll('.timeline-bullet');
    const isLeft = index % 2 === 0;
    
    gsap.set(item, {
      opacity: 0,
      x: isLeft ? -50 : 50
    });

    return gsap.to(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
      },
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power2.out'
    });
  }
};