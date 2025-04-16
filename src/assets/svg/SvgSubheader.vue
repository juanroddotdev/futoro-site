<template>
  <svg
    width="378"
    height="81"
    viewBox="0 0 378 81"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <mask id="subheaderMask">
        <rect width="100%" height="100%" fill="white" class="reveal-mask-rect" />
      </mask>
    </defs>

    <!-- Text -->
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="black" font-size="20" font-family="sans-serif">
      Sub-Headline
    </text>

    <!-- Background Rectangle -->
    <rect
      x="2"
      y="2"
      width="374"
      height="77"
      rx="14"
      fill="#D9D9D9"
      stroke="black"
      stroke-width="2"
      mask="url(#subheaderMask)"
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
