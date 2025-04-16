<template>
  <svg
    width="601"
    height="592"
    viewBox="0 0 601 592"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <mask id="rightSideMask">
        <rect width="100%" height="100%" fill="white" class="reveal-mask-rect" />
      </mask>
    </defs>

    <!-- Text -->
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="black" font-size="40" font-family="sans-serif">
      Image Area
    </text>

    <!-- Background Rectangle -->
    <rect
      x="2"
      y="2"
      width="597"
      height="588"
      rx="14"
      fill="#D9D9D9"
      stroke="black"
      stroke-width="4"
      mask="url(#rightSideMask)"
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
