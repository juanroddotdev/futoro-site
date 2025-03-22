<template>
  <div 
    class="viewport-mask" 
    :class="{ 'viewport-mask--animated': animated }"
    :style="{ 
      '--mask-padding-top': `${paddingTop}px`,
      '--mask-padding-right': `${paddingRight}px`,
      '--mask-padding-bottom': `${paddingBottom}px`,
      '--mask-padding-left': `${paddingLeft}px`,
      '--mask-opacity': opacity,
      '--mask-blur': `${blur}px`,
      '--mask-transition-duration': `${transitionDuration}ms`
    }"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  paddingTop: {
    type: Number,
    default: 40
  },
  paddingRight: {
    type: Number,
    default: 40
  },
  paddingBottom: {
    type: Number,
    default: 40
  },
  paddingLeft: {
    type: Number,
    default: 40
  },
  opacity: {
    type: Number,
    default: 0.8
  },
  blur: {
    type: Number,
    default: 0
  },
  animated: {
    type: Boolean,
    default: false
  },
  transitionDuration: {
    type: Number,
    default: 500
  }
});
</script>

<style lang="scss">
.viewport-mask {
  position: relative;
  width: 100%;
  height: 100%;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, var(--mask-opacity));
    -webkit-mask: linear-gradient(#000 0 0) content-box,
                  linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: var(--mask-padding-top) var(--mask-padding-right) var(--mask-padding-bottom) var(--mask-padding-left);
    pointer-events: none;
    z-index: 10;
    
    @supports (backdrop-filter: blur(1px)) {
      backdrop-filter: blur(var(--mask-blur));
    }
  }
  
  &--animated::before {
    transition: padding var(--mask-transition-duration) ease-in-out,
                background-color var(--mask-transition-duration) ease-in-out;
  }
}
</style>