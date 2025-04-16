<template>
  <svg
    width="1257"
    height="87"
    viewBox="0 0 1257 87"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <mask id="navMask">
        <!-- White rectangle makes masked content visible -->
        <rect width="100%" height="100%" fill="white" class="reveal-mask-rect" />
      </mask>
    </defs>

    <!-- Text, placed UNDERNEATH the rect -->
    <text
      x="50%" 
      y="50%" 
      dominant-baseline="middle" 
      text-anchor="middle" 
      fill="black"
      font-size="40" 
      font-family="sans-serif"
    >
      Navigation
    </text>

    <!-- Background Rectangle, now masked -->
    <rect
      x="2"
      y="2"
      width="1253"
      height="83"
      rx="14"
      fill="#D9D9D9" 
      stroke="black"
      stroke-width="4"
      mask="url(#navMask)"
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
