import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugins
gsap.registerPlugin(TextPlugin);

export type TextAnimationType = 
  | 'split' 
  | 'fade' 
  | 'typewriter' 
  | 'bounce' 
  | 'rotate' 
  | 'glitch' 
  | 'shake' 
  | 'scramble' 
  | 'fadeUp'
  | 'slideInLeft'
  | 'slideInRight';

export interface TextAnimationOptions {
  duration?: number;
  stagger?: number;
  ease?: string;
  delay?: number;
}

export const textAnimations = {
  // Split animation
  split: (tl: gsap.core.Timeline, elements: HTMLElement[], options?: TextAnimationOptions) => {
    const [firstPart, secondPart, suffix] = elements;
    
    gsap.set(firstPart, { x: -200, opacity: 0 });
    if (secondPart) gsap.set(secondPart, { x: 200, opacity: 0 });
    if (suffix) gsap.set(suffix, { opacity: 0, y: 20 });
    
    tl.to(firstPart, { x: 0, opacity: 1, duration: options?.duration || 0.5 });
    
    if (secondPart) {
      tl.to(secondPart, { x: 0, opacity: 1, duration: options?.duration || 0.5 }, '<0.2');
    }
    
    if (suffix) {
      tl.to(suffix, { opacity: 1, y: 0, duration: options?.duration || 0.3 }, '<0.3');
    }
    
    return tl;
  },
  
  // Fade animation
  fade: (tl: gsap.core.Timeline, elements: HTMLElement[], options?: TextAnimationOptions) => {
    elements.forEach(el => gsap.set(el, { opacity: 0 }));
    
    // Apply the delay to the timeline, not individual animations
    const delay = options?.delay || 0;
    if (delay > 0) {
      tl.delay(delay);
    }
    
    elements.forEach((el, index) => {
      tl.to(el, { 
        opacity: 1, 
        duration: options?.duration || 0.5 
      }, index > 0 ? '<0.2' : undefined);
    });
    
    return tl;
  },
  
  // Typewriter animation
  typewriter: (tl: gsap.core.Timeline, elements: HTMLElement[], options?: TextAnimationOptions) => {
    // Kill any existing animations on these elements
    elements.forEach(el => gsap.killTweensOf(el));
    
    // Set all elements to visible but with empty text
    elements.forEach(element => {
      if (element) {
        const originalText = element.getAttribute('data-original-text') || element.textContent || '';
        element.setAttribute('data-original-text', originalText);
        element.textContent = '';
        gsap.set(element, { opacity: 1 });
      }
    });
    
    // Animate each element sequentially
    let position = 0;
    elements.forEach((element, index) => {
      if (element) {
        const originalText = element.getAttribute('data-original-text') || '';
        const duration = originalText.length * 0.05;
        
        tl.to(element, {
          duration: duration,
          text: originalText,
          ease: "none"
        }, position);
        
        // Add a small delay between elements
        position += duration + 0.2;
      }
    });
    
    return tl;
  },
  
  // Bounce animation
  bounce: (tl: gsap.core.Timeline, elements: HTMLElement[], options?: TextAnimationOptions) => {
    elements.forEach(el => gsap.set(el, { y: 100, opacity: 0 }));
    
    elements.forEach((el, index) => {
      tl.to(el, { 
        y: 0, 
        opacity: 1, 
        duration: options?.duration || 1, 
        ease: options?.ease || "elastic.out(1, 0.3)" 
      }, index > 0 ? '-=0.6' : undefined);
    });
    
    return tl;
  },
  
  // 3D Rotation animation
  rotate: (tl: gsap.core.Timeline, elements: HTMLElement[], options?: TextAnimationOptions) => {
    elements.forEach(el => gsap.set(el, { 
      rotationX: 180, 
      opacity: 0,
      transformPerspective: 800,
      transformOrigin: "center bottom"
    }));
    
    elements.forEach((el, index) => {
      tl.to(el, { 
        rotationX: 0, 
        opacity: 1, 
        duration: options?.duration || 1.2, 
        ease: options?.ease || "back.out(2)" 
      }, index > 0 ? '-=0.8' : undefined);
    });
    
    return tl;
  },
  
  // Glitch animation
  glitch: (tl: gsap.core.Timeline, elements: HTMLElement[], options?: TextAnimationOptions) => {
    elements.forEach(el => gsap.set(el, { opacity: 0 }));
    
    // Animate each element with a slight delay
    elements.forEach((el, index) => {
      const startTime = index * 0.3;
      
      tl.to(el, { opacity: 0.7, duration: 0.1 }, startTime)
        .to(el, { opacity: 1, x: 15, y: -10, skewX: 20, scale: 1.2, duration: 0.1 }, `>`)
        .to(el, { opacity: 0.5, x: -15, y: 8, skewX: -20, scale: 0.8, duration: 0.1 }, `>`)
        .to(el, { opacity: 1, x: 8, y: -5, skewX: 10, scale: 1.1, duration: 0.1 }, `>`)
        .to(el, { opacity: 0.8, x: -8, y: 3, skewX: -10, scale: 0.9, duration: 0.1 }, `>`)
        .to(el, { opacity: 1, x: 0, y: 0, skewX: 0, scale: 1, duration: 0.2 }, `>`);
    });
    
    return tl;
  },
  
  // Progressive shake animation
  shake: (tl: gsap.core.Timeline, elements: HTMLElement[], options?: TextAnimationOptions) => {
    elements.forEach(el => gsap.set(el, { opacity: 0 }));
    
    // Animate each element with a slight delay
    elements.forEach((el, index) => {
      const startTime = index * 0.3;
      
      // First appear
      tl.to(el, { opacity: 1, duration: 0.3 }, startTime)
        // Small shivers
        .to(el, { 
          x: "+=3", 
          duration: 0.05, 
          repeat: 4, 
          yoyo: true,
          ease: "none" 
        }, `>`)
        // Medium shakes
        .to(el, { 
          x: "+=8", 
          duration: 0.06, 
          repeat: 3, 
          yoyo: true,
          ease: "none" 
        }, `>`)
        // Large shakes
        .to(el, { 
          x: "+=15", 
          duration: 0.08, 
          repeat: 4, 
          yoyo: true,
          ease: "power1.inOut" 
        }, `>`)
        // Return to center with slight bounce
        .to(el, { x: 0, duration: 0.3, ease: "back.out(2)" }, `>`);
    });
    
    return tl;
  },
  
  // Scramble animation
  scramble: (tl: gsap.core.Timeline, elements: HTMLElement[], options?: TextAnimationOptions) => {
    // Animate each element with a slight delay
    elements.forEach((el, index) => {
      if (el) {
        const originalText = el.getAttribute('data-original-text') || el.textContent || '';
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        
        // Set initial scrambled text
        let scrambledText = "";
        for (let i = 0; i < originalText.length; i++) {
          scrambledText += originalText[i] === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)];
        }
        
        el.textContent = scrambledText;
        gsap.set(el, { opacity: 1 });
        
        // Unscramble text with a delay based on index
        tl.to(el, {
          duration: options?.duration || 1,
          text: originalText,
          ease: "none"
        }, index * 0.3);
      }
    });
    
    return tl;
  },

  // Fade up animation
  fadeUp: (tl: gsap.core.Timeline, elements: HTMLElement[], options?: TextAnimationOptions) => {
    elements.forEach(el => gsap.set(el, { y: 30, opacity: 0 }));
    
    elements.forEach((el, index) => {
      tl.to(el, { 
        y: 0, 
        opacity: 1, 
        duration: options?.duration || 0.7,
        ease: options?.ease || "power2.out"
      }, index > 0 ? '<0.15' : undefined);
    });
    
    return tl;
  },

  // Slide in from left animation
  slideInLeft: (tl: gsap.core.Timeline, elements: HTMLElement[], options?: TextAnimationOptions) => {
    elements.forEach(el => gsap.set(el, { x: -100, opacity: 0 }));
    
    elements.forEach((el, index) => {
      tl.to(el, { 
        x: 0, 
        opacity: 1, 
        duration: options?.duration || 0.7,
        ease: options?.ease || "power2.out"
      }, index > 0 ? '<0.15' : undefined);
    });
    
    return tl;
  },

  // Slide in from right animation
  slideInRight: (tl: gsap.core.Timeline, elements: HTMLElement[], options?: TextAnimationOptions) => {
    elements.forEach(el => gsap.set(el, { x: 100, opacity: 0 }));
    
    elements.forEach((el, index) => {
      tl.to(el, { 
        x: 0, 
        opacity: 1, 
        duration: options?.duration || 0.7,
        ease: options?.ease || "power2.out"
      }, index > 0 ? '<0.15' : undefined);
    });
    
    return tl;
  },
  
  // Apply animation based on type
  applyAnimation: (
    animationType: TextAnimationType, 
    elements: HTMLElement[], 
    options?: TextAnimationOptions
  ) => {
    const tl = gsap.timeline();
    
    // Apply the requested animation
    switch (animationType) {
      case 'split':
        return textAnimations.split(tl, elements, options);
      case 'fade':
        return textAnimations.fade(tl, elements, options);
      case 'typewriter':
        return textAnimations.typewriter(tl, elements, options);
      case 'bounce':
        return textAnimations.bounce(tl, elements, options);
      case 'rotate':
        return textAnimations.rotate(tl, elements, options);
      case 'glitch':
        return textAnimations.glitch(tl, elements, options);
      case 'shake':
        return textAnimations.shake(tl, elements, options);
      case 'scramble':
        return textAnimations.scramble(tl, elements, options);
      case 'fadeUp':
        return textAnimations.fadeUp(tl, elements, options);
      case 'slideInLeft':
        return textAnimations.slideInLeft(tl, elements, options);
      case 'slideInRight':
        return textAnimations.slideInRight(tl, elements, options);
      default:
        return textAnimations.fade(tl, elements, options);
    }
  }
};
