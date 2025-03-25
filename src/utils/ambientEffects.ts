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

/**
 * Applies a pull effect to an ambient screen element
 * @param ambientScreen - The ambient screen element to apply the effect to
 * @param progress - The pull progress (0-1)
 * @param options - Configuration options for the effect
 */
export function applyAmbientPullEffect(
  ambientScreen: HTMLElement | null,
  progress: number,
  options: AmbientPullEffectOptions = {}
): void {
  if (!ambientScreen) return;
  
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
  
  // Create radial gradient that starts from top and enlarges with pull
  if (progress > 0.05) {
    const gradientColor = `rgba(245, 245, 245, ${progress * 0.3})`;
    
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
  } else {
    // Reset to default when pull is minimal
    resetAmbientScreen(ambientScreen, baseColor, endColor);
  }
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
}