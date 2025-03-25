// Add U-shaped pull-down effect for dots based on scroll progress
if (self.progress > 0.5 && props.ambientMode) {
  // Add U-shaped pull-down effect for dots based on scroll progress
  if (notificationDotsRef.value && notificationDotsRef.value.$el) {
    const maxOffset = 40; // Increased from 20 to 40 for more downward movement
    const maxScale = 1.5; // Maximum scale factor for middle dot
    const progress = Math.min(1, Math.max(0, (self.progress - 0.5) * 2)); // Normalize to 0-1
    
    // Get all dots in the container
    const dotsContainer = notificationDotsRef.value.$el;
    const dots = dotsContainer.querySelectorAll('.loading-dot');
    
    if (dots && dots.length > 0) {
      // Calculate center position
      const centerIndex = Math.floor((dots.length - 1) / 2);
      
      // Move the entire dots container down slightly to enhance the pulling effect
      dotsContainer.style.transform = `translateY(${progress * 15}px)`;
      
      // Change background to red when reaching max pull-down (progress > 0.9)
      if (progress > 0.9) {
        // Find the ambient-screen element and change its background
        const ambientScreen = containerRef.value?.querySelector('.ambient-screen');
        if (ambientScreen) {
          // Intensity factor based on how far past 0.9 we are (0-1 range)
          const intensityFactor = (progress - 0.9) * 10;
          
          // Apply red background with intensity based on pull progress
          ambientScreen.style.backgroundColor = `rgba(255, 0, 0, ${intensityFactor})`;
          ambientScreen.style.transition = 'background-color 0.3s ease';
        }
      } else {
        // Reset background when not at max pull-down
        const ambientScreen = containerRef.value?.querySelector('.ambient-screen');
        if (ambientScreen) {
          ambientScreen.style.backgroundColor = '';
          ambientScreen.style.transition = '';
        }
      }
      
      // Apply different offsets and scales to each dot
      dots.forEach((dot, index) => {
        // Calculate U-shaped offset (middle dot gets pulled down most)
        const dotPosition = index / (dots.length - 1); // 0 to 1
        const uShapeOffset = Math.sin(dotPosition * Math.PI) * maxOffset * progress;
        
        // Calculate scale based on distance from center
        const distanceFromCenter = Math.abs(index - centerIndex);
        const maxDistance = Math.max(centerIndex, dots.length - 1 - centerIndex);
        const scaleFactor = 1 - (distanceFromCenter / maxDistance) * 0.5 * progress;
        
        // Add slight rotation to enhance the pulling effect
        const rotationAngle = (index - centerIndex) * -2 * progress; // negative angle for outer dots
        
        // Apply transform - more vertical offset, variable scale, and slight rotation
        dot.style.transform = `translateY(${uShapeOffset}px) scale(${scaleFactor}) rotate(${rotationAngle}deg)`;
        
        // Add subtle shadow to enhance 3D effect
        dot.style.boxShadow = progress > 0.3 ? `0 ${uShapeOffset * 0.1}px ${uShapeOffset * 0.2}px rgba(0,0,0,${progress * 0.2})` : 'none';
      });
    }
  }
} else if (self.progress <= 0.5) {
  shouldAnimateNotifications.value = false;
  
  // Reset dots position when scrolling back up
  if (notificationDotsRef.value && notificationDotsRef.value.$el) {
    const dotsContainer = notificationDotsRef.value.$el;
    dotsContainer.style.transform = 'translateY(0)';
    
    // Reset ambient screen background
    const ambientScreen = containerRef.value?.querySelector('.ambient-screen');
    if (ambientScreen) {
      ambientScreen.style.backgroundColor = '';
      ambientScreen.style.transition = '';
    }
    
    const dots = dotsContainer.querySelectorAll('.loading-dot');
    if (dots && dots.length > 0) {
      dots.forEach(dot => {
        dot.style.transform = 'translateY(0) scale(1) rotate(0deg)';
        dot.style.boxShadow = 'none';
      });
    }
  }
}