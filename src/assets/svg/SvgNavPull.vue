<template>
  <svg
    width="96"
    height="107"
    viewBox="0 0 96 107"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_di_506_200156)">
      <mask id="path-1-inside-1_506_200156" fill="white">
        <path
          d="M4 16C4 7.16344 11.1634 0 20 0H76C84.8366 0 92 7.16344 92 16V83C92 91.8366 84.8366 99 76 99H20C11.1634 99 4 91.8366 4 83V16Z"
        />
      </mask>
      <path
        d="M4 16C4 7.16344 11.1634 0 20 0H76C84.8366 0 92 7.16344 92 16V83C92 91.8366 84.8366 99 76 99H20C11.1634 99 4 91.8366 4 83V16Z"
        fill="#D9D9D9"
      />
      <path
        d="M4 16C4 4.95431 12.9543 -4 24 -4H76C87.0457 -4 96 4.95431 96 16H88C88 9.37258 82.6274 4 76 4H20C11.1634 4 4 9.37258 4 16ZM96 83C96 94.0457 87.0457 103 76 103H24C12.9543 103 4 94.0457 4 83C4 89.6274 11.1634 95 20 95H76C82.6274 95 88 89.6274 88 83H96ZM4 99V0V99ZM76 -4C87.0457 -4 96 4.95431 96 16V83C96 94.0457 87.0457 103 76 103V95C82.6274 95 88 89.6274 88 83V16C88 9.37258 82.6274 4 76 4V-4Z"
        fill="black"
        mask="url(#path-1-inside-1_506_200156)"
      />
    </g>
    <defs>
      <filter
        id="filter0_di_506_200156"
        x="0"
        y="0"
        width="96"
        height="107"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_506_200156"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_506_200156"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology
          radius="2"
          operator="erode"
          in="SourceAlpha"
          result="effect2_innerShadow_506_200156"
        />
        <feOffset dx="3" />
        <feGaussianBlur stdDeviation="6" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="shape"
          result="effect2_innerShadow_506_200156"
        />
      </filter>
    </defs>
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
