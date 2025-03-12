<template>
  <div 
    class="data-particles" 
    ref="containerRef"
    :class="currentTheme"
  >
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from "vue";

const props = defineProps<{
  currentTheme: string;
}>();

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  colorIndex: number;
  alpha: number;
  glitching: boolean;
}

const containerRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let animationFrame: number;
let particles: Particle[] = [];

const getThemeColors = (element: HTMLElement): string[] => {
  const styles = getComputedStyle(element);
  return [
    styles.getPropertyValue('--particle-color-1').trim(),
    styles.getPropertyValue('--particle-color-2').trim(),
    styles.getPropertyValue('--particle-color-3').trim(),
  ];
};

const createParticle = (): Particle => ({
  x: -10,
  y: Math.random() * window.innerHeight,
  size: Math.random() * 4 + 1,
  speed: Math.random() * 3 + 1,
  colorIndex: Math.floor(Math.random() * 3),
  alpha: Math.random() * 0.7 + 0.3,
  glitching: false,
});

const initParticles = () => {
  particles = Array.from({ length: 100 }, () => createParticle());
};

const triggerGlitch = () => {
  const glitchCount = Math.floor(Math.random() * 15) + 8;
  for (let i = 0; i < glitchCount; i++) {
    const particle = particles[Math.floor(Math.random() * particles.length)];
    if (particle) {
      particle.glitching = true;
      setTimeout(() => {
        particle.glitching = false;
      }, Math.random() * 300 + 100);
    }
  }
};

const animate = () => {
  if (!ctx || !canvasRef.value || !containerRef.value) return;
  
  const themeColors = getThemeColors(containerRef.value);
  
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);

  particles.forEach(particle => {
    particle.x += particle.speed;

    if (particle.x > canvasRef.value!.width) {
      particle.x = -10;
      particle.y = Math.random() * canvasRef.value!.height;
      particle.colorIndex = Math.floor(Math.random() * 3);
    }

    ctx!.beginPath();
    
    if (particle.glitching) {
      const glitchOffset = Math.random() * 4 - 2;
      ctx!.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
      ctx!.shadowColor = themeColors[particle.colorIndex];
      ctx!.shadowBlur = 15;
      particle.size = Math.random() * 5 + 2;
      ctx!.fillRect(
        particle.x + glitchOffset, 
        particle.y + glitchOffset, 
        particle.size, 
        particle.size
      );
    } else {
      ctx!.fillStyle = themeColors[particle.colorIndex];
      ctx!.shadowBlur = 0;
      ctx!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    }
    
    ctx!.fill();
  });

  animationFrame = requestAnimationFrame(animate);
};

const resizeCanvas = () => {
  if (!canvasRef.value || !containerRef.value) return;
  
  canvasRef.value.width = containerRef.value.offsetWidth;
  canvasRef.value.height = containerRef.value.offsetHeight;
};

onMounted(() => {
  if (!canvasRef.value) return;
  
  ctx = canvasRef.value.getContext('2d');
  
  resizeCanvas();
  initParticles();
  animate();

  setInterval(triggerGlitch, 1500);
  window.addEventListener('resize', resizeCanvas);
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrame);
  window.removeEventListener('resize', resizeCanvas);
});
</script>
