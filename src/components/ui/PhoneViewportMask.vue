<template>
  <div 
    class="phone-viewport-mask" 
    :class="{ 'phone-viewport-mask--animated': animated }"
    :style="{ 
      '--mask-width': `${width}px`,
      '--mask-height': `${height}px`,
      '--mask-opacity': opacity,
      '--mask-blur': `${blur}px`,
      '--mask-transition-duration': `${transitionDuration}ms`,
      '--mask-border-radius': `${borderRadius}px`,
      '--mask-notch-width': `${notchWidth}px`,
      '--mask-notch-height': `${notchHeight}px`
    }"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  width: {
    type: Number,
    default: 320
  },
  height: {
    type: Number,
    default: 650
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
  },
  borderRadius: {
    type: Number,
    default: 30
  },
  notchWidth: {
    type: Number,
    default: 80
  },
  notchHeight: {
    type: Number,
    default: 15
  }
});
</script>

<style lang="scss">
.phone-viewport-mask {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, var(--mask-opacity));
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3Cmask id='phoneMask'%3E%3Crect width='100%25' height='100%25' fill='white'/%3E%3Crect x='50%25' y='50%25' width='var(--mask-width)' height='var(--mask-height)' rx='var(--mask-border-radius)' ry='var(--mask-border-radius)' fill='black' transform='translate(-50%25, -50%25)'/%3E%3Crect x='50%25' y='calc(50%25 - var(--mask-height)/2 + var(--mask-notch-height)/2)' width='var(--mask-notch-width)' height='var(--mask-notch-height)' rx='calc(var(--mask-notch-height)/2)' ry='calc(var(--mask-notch-height)/2)' fill='white' transform='translate(-50%25, 0)'/%3E%3C/mask%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='black' mask='url(%23phoneMask)'/%3E%3C/svg%3E") center center no-repeat;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3Cmask id='phoneMask'%3E%3Crect width='100%25' height='100%25' fill='white'/%3E%3Crect x='50%25' y='50%25' width='var(--mask-width)' height='var(--mask-height)' rx='var(--mask-border-radius)' ry='var(--mask-border-radius)' fill='black' transform='translate(-50%25, -50%25)'/%3E%3Crect x='50%25' y='calc(50%25 - var(--mask-height)/2 + var(--mask-notch-height)/2)' width='var(--mask-notch-width)' height='var(--mask-notch-height)' rx='calc(var(--mask-notch-height)/2)' ry='calc(var(--mask-notch-height)/2)' fill='white' transform='translate(-50%25, 0)'/%3E%3C/mask%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='black' mask='url(%23phoneMask)'/%3E%3C/svg%3E") center center no-repeat;
    pointer-events: none;
    z-index: 10;
    
    @supports (backdrop-filter: blur(1px)) {
      backdrop-filter: blur(var(--mask-blur));
    }
  }
  
  &--animated::before {
    transition: all var(--mask-transition-duration) ease-in-out;
  }
}
</style>