<template>
  <section class="texture-text">
    <div class="isolate">
      <div class="noise">{{ text }}</div>
      <div class="overlay"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: 'Texture'
  }
});
</script>

<style scoped>
.texture-text {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 400px;
  height: 310px;
  animation-duration: 2s;
  animation-name: cube-rotate;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-timing-function: ease-in-out;
}

.isolate {
  isolation: isolate;
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
}

@keyframes cube-rotate {
  from {
    transform: perspective(600px) rotate3d(0.6, 0.05, 0.2, 0deg);
  }

  to {
    transform: perspective(600px) rotate3d(0.6, 0.05, 0.2, 20deg);
  }
}

@keyframes shimmer {
  from {
    filter: contrast(190%) brightness(500%);
  }

  to {
    filter: contrast(190%) brightness(130%);
  }
}

.noise {
  width: 100%;
  height: 100%;
  padding: 8px;
  font-size: 5em;
  font-weight: 800;
  text-align: center;
  background: linear-gradient(24deg, rgba(50 0 255/10%), CornflowerBlue), url("data:image/svg+xml,%3Csvg viewBox='0 0 400 310' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  animation-duration: 2s;
  animation-name: shimmer;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

.overlay {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: antiquewhite;
  mix-blend-mode: multiply;
}

/* Special case Chrome. mix-blend-mode is treated differently. Works best in Safari! */
@media all and (-webkit-min-device-pixel-ratio:0) and (min-resolution: .001dpcm) {
  .overlay {
    opacity: 0.6;
  }
}
</style>