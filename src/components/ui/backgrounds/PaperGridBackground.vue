<script setup lang="ts">
defineProps<{
  theme?: string,
  floating?: boolean,
  spotlight?: boolean,
  spotlightPosition?: string,
  fixed?: boolean
}>();

// Calculate the SVG path for the visibility boundary
const calculateRadialGradientBoundary = () => {
  // The radial gradient is defined as:
  // circle at 20% 20%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.8) 20%, rgba(0, 0, 0, 0) 50%
  
  // Center point of the gradient (20%, 20%)
  const centerX = 20;
  const centerY = 20;
  
  // Radius where opacity reaches 0 (50% of the gradient size)
  const radius = 50;
  
  // Generate points along the circle
  let path = '';
  const points = 36; // Number of points to generate (more = smoother)
  
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    if (i === 0) {
      path += `M ${x},${y}`;
    } else {
      path += ` L ${x},${y}`;
    }
  }
  
  path += ' Z'; // Close the path
  return path;
}
</script>

<template>
  <div 
    class="grid-paper-overlay"
    :class="[
      theme ? `theme-${theme}` : '',
      { 
        'grid-paper-overlay--floating': floating,
        'grid-paper-overlay--spotlight': spotlight,
        'grid-paper-overlay--fixed': fixed
      }
    ]"
  >
    <!-- Curved visibility indicator that follows the radial gradient -->
    <svg v-if="spotlight" class="grid-visibility-indicator" viewBox="0 0 100 100" preserveAspectRatio="none">
      <!-- This path represents the 50% opacity boundary of the radial gradient -->
      <circle cx="20" cy="20" r="50" fill="none" stroke="red" stroke-width="0.5" stroke-dasharray="2,2" />
    </svg>
    <slot></slot>
  </div>
</template>

<style lang="scss">
@import '@/scss/abstracts/variables';
@import '@/scss/abstracts/mixins';

// Add the floating animation
@keyframes grid-float {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 20px 20px; // Matches our grid size for smooth loop
  }
}

.grid-paper-overlay {
  position: relative;
  isolation: isolate;
  height: 100%; /* Ensure it fills its container */

  /* Curved visibility indicator */
  .grid-visibility-indicator {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    pointer-events: none;
    opacity: 0.7;
  }

  /* When used as a fixed background */
  &--fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    opacity: 1;
  }

  > * {
    position: relative;
    z-index: 2;
  }

  // Add floating modifier
  &--floating {
    &::before {
      animation: grid-float 3s linear infinite;
    }
  }

  // Add spotlight modifier
  &--spotlight {
    &::before {
      mask-image: radial-gradient(
        circle at 20% 20%, // Position the spotlight in the top-left area
        #1a1b26 0%,
        rgba(0, 0, 0, 0.8) 20%,
        rgba(0, 0, 0, 0) 50%
      );
      -webkit-mask-image: radial-gradient(
        circle at 20% 20%,
        #1a1b26 0%,
        rgba(0, 0, 0, 0.8) 20%,
        rgba(0, 0, 0, 0) 50%
      );
    }
  }

  // Theme-specific grid styles using theme map
  @each $theme-name, $theme-map in $themes {
    .theme-#{$theme-name} &::before {
      @if $theme-name == 'pastel-future' {
        @include grid-paper-background(
          rgba(0, 0, 0, 0.1),
          2px,
          40px
        );
        mix-blend-mode: multiply;
      } @else {
        background-color: map-get($theme-map, 'background');
        @include grid-paper-background(
          rgba(255, 255, 255, 1),
          2px,
          40px
        );
        opacity: 0.2;
      }
    }
  }

}
</style>
