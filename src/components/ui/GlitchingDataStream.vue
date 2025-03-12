<template>
  <div class="data-stream">
    <div v-for="(line, index) in lines" 
         :key="index" 
         :ref="el => { if (el) streamLines[index] = el as HTMLElement }"
         class="stream-line" 
         :style="{ top: line.top + 'px', animationDelay: line.delay + 's' }">
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from "vue";
import gsap from "gsap";

interface StreamLine {
  top: number;
  delay: number;
}

const lines = ref<StreamLine[]>([]);
const streamLines = ref<HTMLElement[]>([]);

const generateLines = () => {
  lines.value = Array.from({ length: 10 }, () => ({
    top: Math.random() * 100,
    delay: Math.random() * 2,
  }));
};

const animateLines = () => {
  streamLines.value.forEach(line => {
    gsap.to(line, {
      x: "100vw",
      duration: 3,
      ease: "linear",
      repeat: -1,
    });
  });
};

const addGlitchEffect = () => {
  setInterval(() => {
    const randomIndex = Math.floor(Math.random() * streamLines.value.length);
    const glitchLine = streamLines.value[randomIndex];
    
    if (glitchLine) {
      gsap.to(glitchLine, {
        opacity: Math.random(),
        scaleX: 1 + Math.random() * 0.5,
        duration: 0.2,
        yoyo: true,
      });
    }
  }, 800);
};

onMounted(() => {
  generateLines();
  // Wait for next tick to ensure refs are populated
  nextTick(() => {
    animateLines();
    addGlitchEffect();
  });
});
</script>

<style scoped>
.data-stream {
  position: relative;
  width: 100%;
  height: 80px;
  overflow: hidden;
  /* background: linear-gradient(to right, rgba(0, 255, 255, 0.2), rgba(255, 0, 255, 0.2)); */
}

.stream-line {
  position: absolute;
  left: -100px;
  width: 60px;
  height: 2px;
  background: rgba(0, 255, 255, 0.7);
  opacity: 0.8;
  filter: blur(1px);
  transform: scaleX(1);
}
</style>
