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
  
  console.log(`[AmbientEffects] 🔄 Applying Pull Effect - Progress: ${progress.toFixed(2)}`);
  
  // Default options
  const {
    baseColor = '#1a1f2c',
    endColor = '#2E3440',
    accentColor = 'rgba(245, 245, 245, 0.3)',
    maxOffset = 30,
    pullWidthMultiplier = 1.33
  } = options;
  
  // Calculate if we've reached max pull threshold (90%)
  const maxPullReached = progress > 0.9;
  
  if (maxPullReached) {
    console.log(`[AmbientEffects] 🔔 Max Pull Threshold Reached - Progress: ${progress.toFixed(2)}`);
  }
  
  // Calculate pull width and height based on progress
  const pullWidth = progress * 50 * pullWidthMultiplier; // Wider at the top
  const pullHeight = progress * maxOffset; // Deeper pull at higher progress
  
  console.log(`[AmbientEffects] 🔄 Pull Dimensions - Width: ${pullWidth.toFixed(2)}, Height: ${pullHeight.toFixed(2)}`);
  
  // Create radial gradient that starts from top and enlarges with pull
  if (progress > 0.05) {
    // Increase opacity as we approach max pull
    const opacityFactor = maxPullReached ? 0.6 : progress * 0.3;
    const gradientColor = `rgba(245, 245, 245, ${opacityFactor})`;
    
    console.log(`[AmbientEffects] 🎨 Gradient - Opacity: ${opacityFactor.toFixed(2)}`);
    
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
      console.log(`[AmbientEffects] 🔄 Scale Effect - Amount: ${scaleAmount.toFixed(4)}`);
    } else {
      ambientScreen.style.transform = '';
    }
  } else {
    // Reset to default when pull is minimal
    console.log(`[AmbientEffects] 🔄 Resetting Ambient Screen - Progress too low: ${progress.toFixed(2)}`);
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
 * Performs an unlock animation on the ambient screen
 * @param ambientScreen - The ambient screen element
 * @param onComplete - Callback function to execute when animation completes
 */
export function performUnlockAnimation(
  ambientScreen: HTMLElement,
  onComplete: () => void
) {
  if (!ambientScreen) {
    console.error('[AmbientEffects] ❌ Cannot perform unlock animation: ambientScreen is null');
    // Still call onComplete to ensure the app continues to function
    onComplete();
    return;
  }

  console.log('[AmbientEffects] 🎬 Starting unlock animation');
  
  // Create a timeline for the animation
  const timeline = gsap.timeline({
    onComplete: () => {
      console.log('[AmbientEffects] ✅ Unlock animation complete');
      onComplete();
    }
  });
  
  // Add animation steps
  timeline
    .to(ambientScreen, {
      y: -20,
      opacity: 0.8,
      duration: 0.2,
      ease: 'power1.in'
    })
    .to(ambientScreen, {
      y: -window.innerHeight,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in'
    });
}

/**
 * Performs a ripple unlock animation
 * @param ambientScreen - The ambient screen element
 * @param container - The container element
 * @param onComplete - Callback function to execute when animation completes
 */
export function performRippleUnlockAnimation(
  ambientScreen: HTMLElement,
  container: HTMLElement | null,
  onComplete: () => void
) {
  if (!ambientScreen || !container) {
    console.error('[AmbientEffects] ❌ Cannot perform ripple unlock animation: missing elements');
    // Still call onComplete to ensure the app continues to function
    onComplete();
    return;
  }

  console.log('[AmbientEffects] 🎬 Starting ripple unlock animation');
  
  // Create ripple element
  const ripple = document.createElement('div');
  ripple.className = 'unlock-ripple';
  container.appendChild(ripple);
  
  // Position ripple at the bottom center of the screen
  const rect = ambientScreen.getBoundingClientRect();
  ripple.style.position = 'absolute';
  ripple.style.left = `${rect.width / 2}px`;
  ripple.style.top = `${rect.height - 50}px`;
  ripple.style.width = '10px';
  ripple.style.height = '10px';
  ripple.style.borderRadius = '50%';
  ripple.style.backgroundColor = '#f5f5f5';
  ripple.style.transform = 'translate(-50%, -50%)';
  ripple.style.zIndex = '10';
  
  // Animate the ripple
  gsap.to(ripple, {
    width: rect.width * 3,
    height: rect.width * 3,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    onComplete: () => {
      // Remove the ripple element
      container.removeChild(ripple);
      
      // Fade out the ambient screen
      gsap.to(ambientScreen, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          console.log('[AmbientEffects] ✅ Ripple unlock animation complete');
          onComplete();
        }
      });
    }
  });
}
