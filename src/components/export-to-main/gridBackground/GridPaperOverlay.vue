<script setup lang="ts">
defineProps<{
  theme?: string,
  floating?: boolean,
  spotlight?: boolean,
  spotlightPosition?: string
}>();
</script>

<template>
  <div 
    class="grid-paper-overlay"
    :class="[
      theme ? `theme-${theme}` : '',
      { 
        'grid-paper-overlay--floating': floating,
        'grid-paper-overlay--spotlight': spotlight
      }
    ]"
  >
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
        rgba(0, 0, 0, 1) 0%,
        rgba(0, 0, 0, 0.8) 20%,
        rgba(0, 0, 0, 0) 50%
      );
      -webkit-mask-image: radial-gradient(
        circle at 20% 20%,
        rgba(0, 0, 0, 1) 0%,
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
          1px,
          20px
        );
        mix-blend-mode: multiply;
      } @else {
        background-color: map-get($theme-map, 'background');
        @include grid-paper-background(
          rgba(255, 255, 255, 1),
          1px,
          20px
        );
        opacity: 0.2;
      }
    }
  }
}
</style>