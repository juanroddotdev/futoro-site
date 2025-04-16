<template>
  <svg
    width="195"
    height="51"
    viewBox="0 0 195 51"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <mask id="buttonMask">
        <rect width="100%" height="100%" fill="white" class="reveal-mask-rect" />
      </mask>
    </defs>

    <!-- Text -->
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="black" font-size="20" font-family="sans-serif">
      CTA Button
    </text>

    <!-- Background Rectangle -->
    <rect 
      x="2" 
      y="2" 
      width="191" 
      height="47" 
      rx="23.5" 
      fill="#D9D9D9" 
      stroke="black"
      stroke-width="2"
      mask="url(#buttonMask)"
    />
  </svg>
</template>

<script setup lang="ts">
// Script setup if needed
</script>

<style scoped>
/* Scoped styles if needed */
svg {
  width: 100%;
  height: auto;
}
</style>
