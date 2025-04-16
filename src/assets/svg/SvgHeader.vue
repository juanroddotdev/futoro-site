<template>
  <svg
    width="410"
    height="208"
    viewBox="0 0 410 208"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <mask id="headerMask">
        <rect width="100%" height="100%" fill="white" class="reveal-mask-rect" />
      </mask>
    </defs>

    <!-- Text -->
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="black" font-size="30" font-family="sans-serif">
      Main Headline
    </text>

    <!-- Background Rectangle -->
    <rect
      x="2"
      y="2"
      width="406"
      height="204"
      rx="14"
      fill="#D9D9D9"
      stroke="black"
      stroke-width="2"
      mask="url(#headerMask)"
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
