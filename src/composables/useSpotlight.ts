import { ref, onMounted, onUnmounted, Ref } from 'vue';

export function useSpotlight() {
  // Spotlight position (default to center)
  const spotlightX = ref(50);
  const spotlightY = ref(50);
  const followMouse = ref(false);

  // Update spotlight position based on mouse movement
  const updateSpotlightPosition = (e: MouseEvent) => {
    if (followMouse.value) {
      spotlightX.value = (e.clientX / window.innerWidth) * 100;
      spotlightY.value = (e.clientY / window.innerHeight) * 100;
    }
  };

  // Calculate fill percentage for an element based on its distance from spotlight
  const calculateFillPercentage = (elementRef: Ref<HTMLElement | null>): number => {
    if (!elementRef.value) return 0;
    
    const elementRect = elementRef.value.getBoundingClientRect();
    const elementCenter = {
      x: elementRect.left + elementRect.width / 2,
      y: elementRect.top + elementRect.height / 2
    };
    
    // Convert spotlight position from percentage to viewport coordinates
    const spotlightPos = {
      x: (window.innerWidth * spotlightX.value) / 100,
      y: (window.innerHeight * spotlightY.value) / 100
    };
    
    // Calculate distance from element center to spotlight center
    const distance = Math.sqrt(
      Math.pow(elementCenter.x - spotlightPos.x, 2) + 
      Math.pow(elementCenter.y - spotlightPos.y, 2)
    );
    
    // Use a responsive approach for normalization
    const elementSize = Math.max(elementRect.width, elementRect.height);
    const viewportSize = Math.min(window.innerWidth, window.innerHeight);
    
    // Blend element size and viewport size for better responsiveness
    const referenceSize = (elementSize * 0.7) + (viewportSize * 0.3);
    const normalizedDistance = distance / referenceSize;
    
    // Apply a non-linear curve with responsive scaling
    const scaleFactor = Math.max(1, Math.min(2, window.innerWidth / 1000));
    let fillPercent = 100 * (1 - Math.pow(Math.min(normalizedDistance * scaleFactor, 1), 2));
    
    // Clamp between 0 and 100
    return Math.max(0, Math.min(100, fillPercent));
  };

  onMounted(() => {
    window.addEventListener('mousemove', updateSpotlightPosition);
  });

  onUnmounted(() => {
    window.removeEventListener('mousemove', updateSpotlightPosition);
  });

  return {
    spotlightX,
    spotlightY,
    followMouse,
    calculateFillPercentage
  };
}