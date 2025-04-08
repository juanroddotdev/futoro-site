<template>
  <div class="spotlight-test">
    <div class="grid-container">
      <div class="spotlight" :style="{
        transform: `translate(${spotlightX}%, ${spotlightY}%)`
      }"></div>
      <div class="grid-lines horizontal">
        <div v-for="i in 20" :key="`h-${i}`" class="grid-line" :style="{ top: `${i * 5}%` }" />
      </div>
      <div class="grid-lines vertical">
        <div v-for="i in 20" :key="`v-${i}`" class="grid-line" :style="{ left: `${i * 5}%` }" />
      </div>
    </div>
    <div class="content-wrapper">
      <h1 class="headline">Random Headline</h1>
      <p class="subheadline">Random Subheadline</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSpotlightEffect } from '../components/simple-loader/utils/spotlightEffect';

const { spotlightX, spotlightY, updateSpotlightPosition } = useSpotlightEffect();

// Example: Move spotlight to a random position every 2 seconds
setInterval(() => {
  const randomX = Math.random() * 100;
  const randomY = Math.random() * 100;
  updateSpotlightPosition(randomX, randomY);
}, 2000);
</script>

<style scoped>
.spotlight-test {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #111;
  overflow: hidden;
}

.grid-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.spotlight {
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(255, 255, 255, 0.3) 20%,
    rgba(255, 255, 255, 0) 70%
  );
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: transform 0.5s ease-out;
  z-index: 1;
}

.grid-lines {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.grid-line {
  position: absolute;
  background: rgba(255, 255, 255, 0.2);
}

.horizontal .grid-line {
  width: 100%;
  height: 2px;
  transform-origin: left center;
}

.vertical .grid-line {
  width: 2px;
  height: 100%;
  transform-origin: top center;
}

.content-wrapper {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
}

.headline {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.subheadline {
  font-size: 1.5rem;
}
</style> 