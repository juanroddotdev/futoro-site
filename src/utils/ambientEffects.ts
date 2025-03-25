/**
 * Ambient screen effects for phone components
 * Provides pull-to-refresh style visual effects for ambient phone screens
 */

interface AmbientPullEffectOptions {
  baseColor?: string;
  endColor?: string;
  accentColor?: string;
  maxOffset?: number;
  pullWidthMultiplier?: number;
}

interface AmbientTransitionOptions extends AmbientPullEffectOptions {
  duration?: number;
  onComplete?: () => void;
}

/**
 * Applies a pull effect to an ambient screen element
 * @param ambientScreen - The ambient screen element to apply the effect to
 * @param progress - The pull progress (0-1)
 * @param options - Configuration options for the effect
 * @returns boolean - Whether max pull threshold has been reached
 */
export function applyAmbientPullEffect(
  ambientScreen: HTMLElement | null,
  progress: number,
  options: AmbientPullEffectOptions = {}
): boolean {
  if (!ambientScreen) return false;
  
  // Default options
  const {
    baseColor = '#1a1f2c',
    endColor = '#2E3440',
    accentColor = 'rgba(245, 245, 245, 0.3)',
    maxOffset = 30,
    pullWidthMultiplier = 1.33
  } = options;
  
  // Calculate pull metrics
  const pullHeight = maxOffset * progress;
  const pullWidth = maxOffset * pullWidthMultiplier * progress;
  
  // Check if we've reached max pull threshold (90%)
  const maxPullReached = progress > 0.9;
  
  // Create radial gradient that starts from top and enlarges with pull
  if (progress > 0.05) {
    // Increase opacity as we approach max pull
    const opacityFactor = maxPullReached ? 0.6 : progress * 0.3;
    const gradientColor = `rgba(245, 245, 245, ${opacityFactor})`;
    
    // Apply gradient from top (50% 0%)
    ambientScreen.style.background = `
      radial-gradient(
        ${100 + pullWidth}% ${100 + Math.abs(pullHeight)}% at 50% 0%, 
        ${gradientColor} 0%, 
        transparent ${progress * 50}%
      ),
      linear-gradient(135deg, ${baseColor} 0%, ${endColor} 100%)
    `;
    
    // Add subtle shadow effect
    ambientScreen.style.boxShadow = `
      inset 0 ${Math.abs(pullHeight) * 0.5}px ${Math.abs(pullHeight)}px 
      -${Math.abs(pullHeight) * 0.3}px rgba(0,0,0,${progress * 0.3})
    `;
    
    // Add a subtle scale effect when approaching max pull
    if (maxPullReached) {
      const scaleAmount = 0.98 + ((progress - 0.9) * 0.02); // Scale from 0.98 to 1.0
      ambientScreen.style.transform = `scale(${scaleAmount})`;
      ambientScreen.style.transition = 'transform 0.2s ease';
    } else {
      ambientScreen.style.transform = '';
    }
  } else {
    // Reset to default when pull is minimal
    resetAmbientScreen(ambientScreen, baseColor, endColor);
  }
  
  return maxPullReached;
}

/**
 * Resets an ambient screen to its default state
 * @param ambientScreen - The ambient screen element to reset
 * @param baseColor - The base color for the gradient
 * @param endColor - The end color for the gradient
 */
export function resetAmbientScreen(
  ambientScreen: HTMLElement | null,
  baseColor: string = '#1a1f2c',
  endColor: string = '#2E3440'
): void {
  if (!ambientScreen) return;
  
  ambientScreen.style.background = `linear-gradient(135deg, ${baseColor} 0%, ${endColor} 100%)`;
  ambientScreen.style.boxShadow = 'none';
  ambientScreen.style.transform = '';
}

/**
 * Performs a wave oscillation animation on the ambient screen
 * @param ambientScreen - The ambient screen element to animate
 * @param options - Configuration options for the animation
 */
export function performUnlockAnimation(
  ambientScreen: HTMLElement | null,
  chatScreen: HTMLElement | null,
  options: AmbientTransitionOptions = {}
): void {
  if (!ambientScreen || !chatScreen) return;
  
  const {
    baseColor = '#1a1f2c',
    endColor = '#2E3440',
    accentColor = 'rgba(245, 245, 245, 0.3)',
    duration = 1.5,
    onComplete = () => {}
  } = options;
  
  // Import GSAP dynamically to avoid SSR issues
  import('gsap').then(({ gsap }) => {
    // Hide chat screen initially
    chatScreen.style.opacity = '0';
    chatScreen.style.display = 'block';
    
    // Create timeline for wave oscillation animation
    const timeline = gsap.timeline({
      onComplete: () => {
        // Hide ambient screen and show chat screen
        ambientScreen.style.display = 'none';
        chatScreen.style.opacity = '1';
        onComplete();
      }
    });
    
    // First phase: Expand from top with bright flash
    timeline.to({}, {
      duration: duration * 0.2,
      onUpdate: function() {
        const progress = this.progress();
        const pullHeight = 50 * progress;
        const pullWidth = 80 * progress;
        
        // Top-down gradient with increasing brightness
        ambientScreen.style.background = `
          radial-gradient(
            ${100 + pullWidth}% ${100 + pullHeight}% at 50% 0%, 
            rgba(255, 255, 255, ${0.6 + progress * 0.4}) 0%, 
            transparent ${40 + progress * 20}%
          ),
          linear-gradient(135deg, ${baseColor} 0%, ${endColor} 100%)
        `;
        
        // Add subtle box-shadow
        ambientScreen.style.boxShadow = `
          inset 0 ${pullHeight * 0.5}px ${pullHeight}px 
          -${pullHeight * 0.3}px rgba(0,0,0,${0.3 + progress * 0.2})
        `;
        
        // Scale down slightly
        ambientScreen.style.transform = `scale(${1 - progress * 0.02})`;
      }
    });
    
    // Second phase: Wave from top to bottom
    timeline.to({}, {
      duration: duration * 0.3,
      onUpdate: function() {
        const progress = this.progress();
        const wavePosition = progress * 100; // 0% to 100% from top to bottom
        
        // Create wave effect moving down the screen
        ambientScreen.style.background = `
          linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.8) 0%,
            rgba(255, 255, 255, 0.9) ${wavePosition - 10}%,
            rgba(255, 255, 255, 0.7) ${wavePosition}%,
            rgba(255, 255, 255, 0.2) ${wavePosition + 10}%,
            rgba(255, 255, 255, 0) ${wavePosition + 20}%,
            linear-gradient(135deg, ${baseColor} 0%, ${endColor} 100%) 100%
          )
        `;
        
        // Reduce box shadow as wave moves down
        ambientScreen.style.boxShadow = `
          inset 0 ${(1 - progress) * 25}px ${(1 - progress) * 50}px 
          -${(1 - progress) * 15}px rgba(0,0,0,${0.5 - progress * 0.5})
        `;
        
        // Scale back up
        ambientScreen.style.transform = `scale(${0.98 + progress * 0.02})`;
      }
    });
    
    // Third phase: Fade out ambient screen, fade in chat screen
    timeline.to(ambientScreen, {
      opacity: 0,
      duration: duration * 0.2,
      ease: "power2.inOut"
    }, "-=0.1");
    
    timeline.to(chatScreen, {
      opacity: 1,
      duration: duration * 0.3,
      ease: "power2.inOut"
    }, "-=0.2");
    
    // Start the animation
    timeline.play();
  });
}

/**
 * Alternative unlock animation with ripple effect
 */
export function performRippleUnlockAnimation(
  ambientScreen: HTMLElement | null,
  chatScreen: HTMLElement | null,
  options: AmbientTransitionOptions = {}
): void {
  if (!ambientScreen || !chatScreen) return;
  
  const {
    baseColor = '#1a1f2c',
    endColor = '#2E3440',
    duration = 1.2,
    onComplete = () => {}
  } = options;
  
  // Import GSAP dynamically
  import('gsap').then(({ gsap }) => {
    // Hide chat screen initially
    chatScreen.style.opacity = '0';
    chatScreen.style.display = 'block';
    
    // Create a ripple element
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.top = '0';
    ripple.style.left = '50%';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.borderRadius = '50%';
    ripple.style.backgroundColor = 'white';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.zIndex = '10';
    
    // Add ripple to ambient screen
    ambientScreen.style.position = 'relative';
    ambientScreen.style.overflow = 'hidden';
    ambientScreen.appendChild(ripple);
    
    // Create timeline
    const timeline = gsap.timeline({
      onComplete: () => {
        // Clean up and transition
        ambientScreen.removeChild(ripple);
        ambientScreen.style.display = 'none';
        chatScreen.style.opacity = '1';
        onComplete();
      }
    });
    
    // Ripple animation
    timeline.to(ripple, {
      width: '300%',
      height: '300%',
      opacity: 0,
      duration: duration * 0.6,
      ease: "power2.out"
    });
    
    // Fade out ambient screen
    timeline.to(ambientScreen, {
      opacity: 0,
      duration: duration * 0.3,
      ease: "power2.inOut"
    }, "-=0.3");
    
    // Fade in chat screen
    timeline.to(chatScreen, {
      opacity: 1,
      duration: duration * 0.4,
      ease: "power2.inOut"
    }, "-=0.2");
    
    // Start the animation
    timeline.play();
  });
}
