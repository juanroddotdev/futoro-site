import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

export type HeadingAnimationType = 
  'split' | 'fade' | 'typewriter' | 'bounce' | 'rotate' | 
  'glitch' | 'shake' | 'scramble' | 'error' | 'squeeze' | 
  'fragment' | 'typingMistakes' | 'angryBounce' | 'crossedOut' | 'overheat';

export const headingAnimations = {
  // Create timeline with ScrollTrigger
  createTimeline: (trigger: HTMLElement) => {
    return gsap.timeline({
      scrollTrigger: {
        trigger,
        start: 'top 80%',
        end: 'top 40%',
        scrub: 0.5,
      }
    });
  },

  // Original animations
  split: (tl: gsap.core.Timeline, selectors: string[]) => {
    const [firstPart, secondPart, suffix] = selectors;
    
    gsap.set(firstPart, { x: -200, opacity: 0 });
    gsap.set(secondPart, { x: 200, opacity: 0 });
    gsap.set(suffix, { opacity: 0, y: 20 });
    
    tl.to(firstPart, { x: 0, opacity: 1, duration: 0.5 })
      .to(secondPart, { x: 0, opacity: 1, duration: 0.5 }, '<0.2')
      .to(suffix, { opacity: 1, y: 0, duration: 0.3 }, '<0.3');
    
    return tl;
  },
  
  fade: (tl: gsap.core.Timeline, selectors: string[]) => {
    gsap.set(selectors, { opacity: 0 });
    
    tl.to(selectors[0], { opacity: 1, duration: 0.5 })
      .to(selectors[1], { opacity: 1, duration: 0.5 }, '<0.2')
      .to(selectors[2], { opacity: 1, duration: 0.5 }, '<0.2');
    
    return tl;
  },
  
  typewriter: (tl: gsap.core.Timeline, selectors: string[], container: HTMLElement) => {
    selectors.forEach(selector => {
      const element = container.querySelector(selector) as HTMLElement;
      if (element) {
        const text = element.textContent || '';
        element.textContent = '';
        element.style.opacity = '1';
        
        tl.to(element, {
          duration: text.length * 0.05,
          text: text,
          ease: "none"
        }, '<0.3');
      }
    });
    
    return tl;
  },
  
  bounce: (tl: gsap.core.Timeline, selectors: string[]) => {
    gsap.set(selectors, { opacity: 0, y: 50 });
    
    tl.to(selectors[0], { opacity: 1, y: 0, duration: 0.7, ease: "bounce.out" })
      .to(selectors[1], { opacity: 1, y: 0, duration: 0.7, ease: "bounce.out" }, '<0.2')
      .to(selectors[2], { opacity: 1, y: 0, duration: 0.7, ease: "bounce.out" }, '<0.2');
    
    return tl;
  },
  
  rotate: (tl: gsap.core.Timeline, selectors: string[]) => {
    gsap.set(selectors, { 
      rotationX: 120, 
      opacity: 0,
      transformPerspective: 800,
      transformOrigin: "center bottom"
    });
    
    tl.to(selectors[0], { rotationX: 0, opacity: 1, duration: 0.9, ease: "back.out(1.7)" })
      .to(selectors[1], { rotationX: 0, opacity: 1, duration: 0.9, ease: "back.out(1.7)" }, '<0.2')
      .to(selectors[2], { rotationX: 0, opacity: 1, duration: 0.9, ease: "back.out(1.7)" }, '<0.2');
    
    return tl;
  },
  
  // New frustration-themed animations
  glitch: (tl: gsap.core.Timeline, selectors: string[]) => {
    const [firstPart, secondPart, suffix] = selectors;
    
    // Set initial state
    gsap.set([firstPart, secondPart, suffix], { opacity: 0 });
    
    // Create more dramatic glitch effect
    tl.to(firstPart, { opacity: 0.5, duration: 0.1 })
      .to(firstPart, { opacity: 0.9, x: 8, y: -5, skewX: 10, duration: 0.1 })
      .to(firstPart, { opacity: 0.3, x: -8, y: 3, skewX: -10, duration: 0.1 })
      .to(firstPart, { opacity: 1, x: 0, y: 0, skewX: 0, duration: 0.1 })
      .to(firstPart, { opacity: 0.7, x: 5, y: -3, skewX: 5, duration: 0.1 })
      .to(firstPart, { opacity: 1, x: 0, y: 0, skewX: 0, duration: 0.2 })
      // Normal animations for other parts
      .to(secondPart, { opacity: 1, duration: 0.4 }, '<0.2')
      .to(suffix, { opacity: 1, duration: 0.4 }, '<0.2');
    
    return tl;
  },
  
  shake: (tl: gsap.core.Timeline, selectors: string[]) => {
    const [firstPart, secondPart, suffix] = selectors;
    
    // Set initial state
    gsap.set([firstPart, secondPart, suffix], { opacity: 0 });
    
    // Create more pronounced shake effect
    tl.to(firstPart, { opacity: 1, duration: 0.3 })
      .to(firstPart, { 
        x: 5, 
        y: -5, 
        rotation: 2, 
        duration: 0.1, 
        repeat: 5, 
        yoyo: true,
        ease: "power1.inOut" 
      })
      .to(secondPart, { opacity: 1, duration: 0.3 }, '<0.2')
      .to(secondPart, { 
        x: -5, 
        y: 3, 
        rotation: -2, 
        duration: 0.1, 
        repeat: 3, 
        yoyo: true,
        ease: "power1.inOut" 
      }, '<0.1')
      .to(suffix, { opacity: 1, duration: 0.3 }, '<0.2');
    
    return tl;
  },
  
  scramble: (tl: gsap.core.Timeline, selectors: string[], container: HTMLElement) => {
    const [firstPart, secondPart, suffix] = selectors;
    const firstElement = container.querySelector(firstPart) as HTMLElement;
    
    if (firstElement) {
      const originalText = firstElement.textContent || '';
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      
      // Set initial scrambled text
      let scrambledText = "";
      for (let i = 0; i < originalText.length; i++) {
        scrambledText += originalText[i] === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)];
      }
      
      firstElement.textContent = scrambledText;
      gsap.set(firstElement, { opacity: 1 });
      
      // Unscramble text
      tl.to(firstElement, {
        duration: 1,
        text: originalText,
        ease: "none"
      })
      .to(secondPart, { opacity: 1, duration: 0.4 }, '<0.5')
      .to(suffix, { opacity: 1, duration: 0.4 }, '<0.2');
    }
    
    return tl;
  },
  
  error: (tl: gsap.core.Timeline, selectors: string[]) => {
    const [firstPart, secondPart, suffix] = selectors;
    
    // Set initial state
    gsap.set([firstPart, secondPart, suffix], { opacity: 0 });
    
    // Create error effect for first part (frustration)
    tl.to(firstPart, { opacity: 0.3, duration: 0.1 })
      .to(firstPart, { opacity: 1, color: "red", duration: 0.2 })
      .to(firstPart, { opacity: 0.5, duration: 0.1 })
      .to(firstPart, { opacity: 1, duration: 0.1 })
      .to(firstPart, { opacity: 0.7, duration: 0.1 })
      .to(firstPart, { opacity: 1, color: "currentColor", duration: 0.3 })
      // Normal animations for other parts
      .to(secondPart, { opacity: 1, duration: 0.4 }, '<0.2')
      .to(suffix, { opacity: 1, duration: 0.4 }, '<0.2');
    
    return tl;
  },
  
  squeeze: (tl: gsap.core.Timeline, selectors: string[]) => {
    const [firstPart, secondPart, suffix] = selectors;
    
    // Set initial state
    gsap.set(firstPart, { scaleX: 0.7, scaleY: 1.3, opacity: 0 });
    gsap.set([secondPart, suffix], { opacity: 0 });
    
    // Create squeeze effect for first part (frustration)
    tl.to(firstPart, { opacity: 1, duration: 0.3 })
      .to(firstPart, { scaleX: 1.2, scaleY: 0.8, duration: 0.4, ease: "power2.inOut" })
      .to(firstPart, { scaleX: 1, scaleY: 1, duration: 0.3, ease: "elastic.out(1, 0.3)" })
      // Normal animations for other parts
      .to(secondPart, { opacity: 1, duration: 0.4 }, '<0.2')
      .to(suffix, { opacity: 1, duration: 0.4 }, '<0.2');
    
    return tl;
  },
  
  typingMistakes: (tl: gsap.core.Timeline, selectors: string[], container: HTMLElement) => {
    const [firstPart, secondPart, suffix] = selectors;
    const firstElement = container.querySelector(firstPart) as HTMLElement;
    
    if (firstElement) {
      const finalText = firstElement.textContent || '';
      firstElement.textContent = '';
      gsap.set(firstElement, { opacity: 1 });
      
      // Type with mistakes
      tl.to(firstElement, { duration: 0.3, text: "Fron Frus", ease: "none" })
        .to(firstElement, { duration: 0.1, text: "Fron Frust", ease: "none" })
        .to(firstElement, { duration: 0.1, text: "Fron Frustr", ease: "none" })
        .to(firstElement, { duration: 0.1, text: "Fron Frustra", ease: "none" })
        .to(firstElement, { duration: 0.1, text: "Fron Frustrat", ease: "none" })
        .to(firstElement, { duration: 0.1, text: "Fron Frustratio", ease: "none" })
        .to(firstElement, { duration: 0.1, text: "Fron Frustratiom", ease: "none" })
        .to(firstElement, { duration: 0.2, text: "Fron Frustratio", ease: "none" })
        .to(firstElement, { duration: 0.2, text: "Fron Frustrati", ease: "none" })
        .to(firstElement, { duration: 0.2, text: "Fron Frustrat", ease: "none" })
        .to(firstElement, { duration: 0.2, text: "From Frustrat", ease: "none" })
        .to(firstElement, { duration: 0.1, text: "From Frustrati", ease: "none" })
        .to(firstElement, { duration: 0.1, text: "From Frustratio", ease: "none" })
        .to(firstElement, { duration: 0.1, text: "From Frustration", ease: "none" })
        .to(secondPart, { opacity: 1, duration: 0.4 }, '<0.2')
        .to(suffix, { opacity: 1, duration: 0.4 }, '<0.2');
    }
    
    return tl;
  },
  
  angryBounce: (tl: gsap.core.Timeline, selectors: string[]) => {
    const [firstPart, secondPart, suffix] = selectors;
    
    // Set initial state
    gsap.set([firstPart, secondPart, suffix], { opacity: 0, y: -100 });
    
    // Create angry bounce effect
    tl.to(firstPart, { 
      opacity: 1, 
      y: 0, 
      duration: 0.5, 
      ease: "bounce.out",
      onComplete: () => {
        // Create small shake after landing
        gsap.to(firstPart, {
          x: "random(-3, 3)",
          y: "random(-2, 2)",
          duration: 0.1,
          repeat: 3,
          ease: "none",
          onComplete: () => gsap.to(firstPart, { x: 0, y: 0, duration: 0.1 })
        });
      }
    })
    .to(secondPart, { opacity: 1, y: 0, duration: 0.5, ease: "bounce.out" }, '<0.3')
    .to(suffix, { opacity: 1, y: 0, duration: 0.5, ease: "bounce.out" }, '<0.2');
    
    return tl;
  },
  
  // Apply the selected animation
  applyAnimation: (
    element: HTMLElement, 
    animationType: HeadingAnimationType, 
    selectors: string[],
    timeline?: gsap.core.Timeline
  ) => {
    // Create a timeline if one wasn't provided
    const tl = timeline || headingAnimations.createTimeline(element);
    
    // Reset any existing animations
    gsap.set(`${selectors[0]}, ${selectors[1]}, ${selectors[2]}`, { clearProps: 'all' });
    
    // Apply the requested animation
    switch (animationType) {
      case 'split':
        return headingAnimations.split(tl, selectors);
      case 'fade':
        return headingAnimations.fade(tl, selectors);
      case 'typewriter':
        return headingAnimations.typewriter(tl, selectors);
      case 'bounce':
        return headingAnimations.bounce(tl, selectors);
      case 'rotate':
        return headingAnimations.rotate(tl, selectors);
      case 'glitch':
        return headingAnimations.glitch(tl, selectors);
      case 'shake':
        return headingAnimations.shake(tl, selectors);
      case 'scramble':
        return headingAnimations.scramble(tl, selectors);
      default:
        return headingAnimations.split(tl, selectors);
    }
  }
};