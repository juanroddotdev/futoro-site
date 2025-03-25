/**
 * phoneAnimations.ts
 * 
 * This utility module provides animation functions for phone UI elements.
 * It uses GSAP to create smooth animations for various phone interactions
 * such as unlock effects, message animations, and ambient screen effects.
 */

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

/**
 * animateDotsWaveEffect - Creates a wave-like animation for dots
 * 
 * This function animates a set of dots in a wave-like pattern by:
 * 1. Applying a sine wave pattern to the vertical position
 * 2. Staggering the animation across all dots
 * 3. Repeating the animation with a yoyo effect
 * 
 * @param dots - NodeList of dot elements to animate
 */
export function animateDotsWaveEffect(dots: NodeListOf<Element>) {
  if (!dots || dots.length === 0) return;
  
  gsap.to(dots, {
    y: (i) => -10 * Math.sin(i * 0.5),  // Sine wave pattern
    opacity: 1,
    duration: 0.4,
    stagger: {
      each: 0.05,  // Time between each dot's animation
      repeat: 2,   // Repeat the animation twice
      yoyo: true   // Reverse the animation on repeat
    },
    ease: "sine.inOut"  // Smooth sine easing
  });
}

/**
 * triggerReboundAnimation - Triggers a rebound animation for the ambient screen
 * 
 * This function animates the ambient screen with an elastic rebound effect by:
 * 1. Resetting the background gradient
 * 2. Removing any box shadows
 * 3. Scaling back to normal size with an elastic easing
 * 
 * @param ambientScreen - The ambient screen element
 * @param progress - Current progress value (0-1)
 */
export function triggerReboundAnimation(
  ambientScreen: HTMLElement | null,
  progress: number
) {
  if (!ambientScreen) return;
  
  gsap.to(ambientScreen, {
    background: `linear-gradient(135deg, #1a1f2c 0%, #2E3440 100%)`,
    boxShadow: 'none',
    transform: 'scale(1)',
    duration: 0.5,
    ease: "elastic.out(1, 0.5)"  // Elastic easing for rebound effect
  });
}

/**
 * setupScrollAnimation - Sets up scroll animation for phone messages
 * 
 * This function creates a ScrollTrigger instance that:
 * 1. Tracks scroll position relative to the container
 * 2. Animates message visibility based on scroll progress
 * 3. Shows/hides typing indicators at appropriate times
 * 4. Calls an optional update callback with the current progress
 * 
 * @param container - Container element
 * @param messages - Message elements
 * @param typingIndicators - Typing indicator elements
 * @param options - Configuration options
 * @returns ScrollTrigger instance
 */
export function setupScrollAnimation(
  container: HTMLElement,
  messages: NodeListOf<Element>,
  typingIndicators: NodeListOf<Element>,
  options: {
    showTypingFor: number[],
    pinSettings: {
      enabled: boolean,
      start: string,
      end: string,
      pinSpacing: boolean,
      anticipatePin: number
    },
    onUpdate?: (progress: number) => void
  }
) {
  return ScrollTrigger.create({
    trigger: container,
    start: options.pinSettings.start || 'top top',
    end: options.pinSettings.end || 'bottom bottom',
    pin: options.pinSettings.enabled ? container : false,
    pinSpacing: options.pinSettings.pinSpacing,
    anticipatePin: options.pinSettings.anticipatePin,
    onUpdate: (self) => {
      const progress = self.progress;
      const totalMessages = messages.length;
      
      messages.forEach((message, index) => {
        const messageEl = message as HTMLElement;
        const typingEl = typingIndicators[index] as HTMLElement;
        
        // Calculate when this message should appear
        const messageStart = (index / totalMessages);
        const messageEnd = ((index + 1) / totalMessages);
        const normalizedProgress = (progress - messageStart) / (messageEnd - messageStart);
        
        // Animate message visibility
        if (progress >= messageStart && progress <= messageEnd) {
          gsap.to(messageEl, {
            opacity: normalizedProgress,
            y: 20 - (normalizedProgress * 20),
            duration: 0.2
          });
          
          // Show typing indicator before message
          if (typingEl && options.showTypingFor.includes(index)) {
            gsap.to(typingEl, {
              opacity: 1 - normalizedProgress,
              duration: 0.2
            });
          }
        } else if (progress > messageEnd) {
          gsap.set(messageEl, { opacity: 1, y: 0 });
          if (typingEl) gsap.set(typingEl, { opacity: 0 });
        } else {
          gsap.set(messageEl, { opacity: 0, y: 20 });
          if (typingEl) gsap.set(typingEl, { opacity: 0 });
        }
      });
      
      // Call onUpdate callback if provided
      if (options.onUpdate) {
        options.onUpdate(progress);
      }
    }
  });
}

/**
 * performUnlockAnimation - Performs a wave-like unlock animation on the ambient screen
 * 
 * This function:
 * 1. Animates dots in a wave pattern if they exist
 * 2. Animates the ambient screen with an elastic rebound effect
 * 3. Calls an optional callback function when the animation completes
 * 
 * @param ambientScreen - The ambient screen element
 * @param callback - Optional callback function to execute after animation completes
 */
export function performUnlockAnimation(
  ambientScreen: HTMLElement,
  callback?: () => void
) {
  if (!ambientScreen) return;
  
  // Find dots container if it exists
  const dotsContainer = ambientScreen.querySelector('.ambient-notifications');
  if (dotsContainer) {
    const dots = dotsContainer.querySelectorAll('.loading-dot');
    if (dots && dots.length > 0) {
      // Use the existing wave animation
      animateDotsWaveEffect(dots);
    }
  }
  
  // Animate the ambient screen
  gsap.to(ambientScreen, {
    background: 'linear-gradient(135deg, #1a1f2c 0%, #2E3440 100%)',
    boxShadow: 'none',
    transform: 'scale(1)',
    duration: 0.5,
    ease: "elastic.out(1, 0.5)",
    onComplete: () => {
      if (callback) callback();
    }
  });
}

/**
 * performRippleUnlockAnimation - Performs a ripple unlock animation on the ambient screen
 * 
 * This function:
 * 1. Creates a ripple element at the center of the ambient screen
 * 2. Animates the ripple to expand and fade out
 * 3. Removes the ripple element after the animation completes
 * 4. Calls an optional callback function when the animation is finished
 * 
 * @param ambientScreen - The ambient screen element
 * @param container - The container element
 * @param callback - Optional callback function to execute after animation completes
 */
export function performRippleUnlockAnimation(
  ambientScreen: HTMLElement,
  container: HTMLElement | null,
  callback?: () => void
) {
  if (!ambientScreen || !container) return;
  
  // Create ripple element
  const ripple = document.createElement('div');
  ripple.className = 'unlock-ripple';
  ripple.style.position = 'absolute';
  ripple.style.top = '50%';
  ripple.style.left = '50%';
  ripple.style.width = '10px';
  ripple.style.height = '10px';
  ripple.style.borderRadius = '50%';
  ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
  ripple.style.transform = 'translate(-50%, -50%)';
  ripple.style.zIndex = '10';
  
  // Add to container
  ambientScreen.appendChild(ripple);
  
  // Animate ripple
  gsap.to(ripple, {
    width: '300%',
    height: '300%',
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    onComplete: () => {
      // Remove ripple element
      ambientScreen.removeChild(ripple);
      if (callback) callback();
    }
  });
}
