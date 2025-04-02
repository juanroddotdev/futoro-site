<template>
  <div class="section-separator" ref="separatorRef">
    <!-- Add debug overlay if debug mode is enabled -->
    <div v-if="debug" class="debug-overlay">
      <div class="debug-info">
        <p>Progress: {{ debugInfo.progress.toFixed(3) }}</p>
        <p>Element Top: {{ debugInfo.elementTop.toFixed(0) }}px</p>
        <p>Viewport Height: {{ debugInfo.viewportHeight }}px</p>
        <p>Scrolled Distance: {{ debugInfo.scrolledDistance.toFixed(0) }}px</p>
        <p>Total Distance: {{ debugInfo.totalScrollDistance.toFixed(0) }}px</p>
      </div>
      <!-- Visual indicators for trigger points -->
      <div class="debug-trigger-points">
        <div class="trigger-line top" :style="{ top: '20%' }">Start Trigger (20%)</div>
        <div class="trigger-line bottom" :style="{ bottom: '20%' }">End Trigger (80%)</div>
      </div>
    </div>

    <svg 
      ref="svgRef"
      class="separator-line" 
      width="100%"
      height="32"
      viewBox="0 0 110 32"
      preserveAspectRatio="none"
      :class="{ 'debug-highlight': debug }"
    >
      <SvgFilters />
      <path
        class="line"
        :stroke="color"
        stroke-width="1"
        :d="
          type === 'zigzag'
            ? generateZigzagPath(lastProgress || 0)
            : type === 'squiggly'
            ? generateSquigglyPath(lastProgress || 0)
            : generateStraightPath(lastProgress || 0)
        "
      />
    </svg>

    <!-- Add a debug display for the current progress -->
    <div v-if="debug" class="debug-progress">
      Progress: {{ lastProgress.toFixed(3) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Vivus from 'vivus';
import SvgFilters from '@/components/svg/SvgFilters.vue';

const props = defineProps<{
  color?: string;
  type?: 'straight' | 'squiggly' | 'zigzag';
  debug?: boolean;
}>();

const separatorRef = ref<HTMLElement | null>(null);
const svgRef = ref<SVGElement | null>(null);
let vivusInstance: Vivus | null = null;
let lastScrollTime = 0;
let animationFrame: number | null = null;
let lastProgress = 0;

// Add debug values
const debugInfo = ref({
  progress: 0,
  elementTop: 0,
  viewportHeight: 0,
  scrolledDistance: 0,
  totalScrollDistance: 0
});

const SCROLL_THRESHOLD = 50; // ms between scroll updates
const SMOOTHING_FACTOR = 0.15; // Lower = smoother but slower

const generateZigzagPath = (progress = 1) => {
  const zigWidth = 2.5;
  const totalWidth = 70;
  const maxZigs = Math.floor(totalWidth / zigWidth);
  const currentZigs = Math.floor(maxZigs * progress);
  
  // Increase amplitude - change from 12/20 to 10/22 for slightly higher peaks
  let path = `M20,16 `;
  for (let i = 0; i < currentZigs; i++) {
    const x = 20 + (i * zigWidth);
    
    if (i % 2 === 0) {
      path += `L${x},10 `; // Changed from 12 to 10
    } else {
      path += `L${x},22 `; // Changed from 20 to 22
    }
  }
  
  if (progress < 1) {
    const finalX = 20 + (currentZigs * zigWidth);
    path += `L${finalX},16`;
  } else {
    path += 'L90,16';
  }
  return path;
};

const generateStraightPath = (progress = 1) => {
  const currentX = 20 + (70 * progress); // 70 is total width (90-20)
  return `M20,16 L${currentX},16`;
};

const generateSquigglyPath = (progress = 1) => {
  const totalWidth = 70;
  const currentWidth = totalWidth * progress;
  let path = `M20,16 `;
  
  // Create a more organic, curvy pattern
  const segments = 40; // More segments for smoother curves
  const segmentWidth = totalWidth / segments;
  const amplitude = 4; // Height of the waves
  
  for (let i = 0; i <= Math.floor(segments * progress); i++) {
    const x = 20 + (i * segmentWidth);
    const prevX = 20 + ((i - 1) * segmentWidth);
    const nextX = x + segmentWidth;
    
    // Calculate y positions using sine waves
    const y = 16 + Math.sin(i * 0.8) * amplitude;
    const prevY = 16 + Math.sin((i - 1) * 0.8) * amplitude;
    const nextY = 16 + Math.sin((i + 1) * 0.8) * amplitude;
    
    if (i === 0) {
      // First point
      path += `C${x + segmentWidth/3},${y} ${nextX - segmentWidth/3},${nextY} ${nextX},${nextY} `;
    } else if (i < Math.floor(segments * progress)) {
      // Middle points - smooth curve through current point
      path += `S${nextX - segmentWidth/3},${nextY} ${nextX},${nextY} `;
    }
  }
  
  return path;
};

const updateProgress = () => {
  if (!separatorRef.value) return;

  const now = Date.now();
  if (now - lastScrollTime < SCROLL_THRESHOLD) {
    animationFrame = requestAnimationFrame(updateProgress);
    return;
  }
  lastScrollTime = now;

  const rect = separatorRef.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const elementTop = rect.top;
  
  const startTrigger = viewportHeight * 0.8;
  const endTrigger = viewportHeight * 0.2;
  
  const totalDistance = startTrigger - endTrigger;
  const currentPosition = startTrigger - elementTop;
  const rawProgress = Math.max(0, Math.min(1, currentPosition / totalDistance));

  // Update debug info
  if (props.debug) {
    debugInfo.value = {
      progress: rawProgress,
      elementTop,
      viewportHeight,
      scrolledDistance: currentPosition,
      totalScrollDistance: totalDistance
    };
    console.log('[SectionSeparator Debug]', debugInfo.value);
  }

  // Smooth out the progress
  const smoothProgress = lastProgress + (rawProgress - lastProgress) * SMOOTHING_FACTOR;
  lastProgress = smoothProgress;

  if (svgRef.value) {
    const path = svgRef.value.querySelector('.line') as SVGPathElement;
    if (path) {
      // Update the path based on type
      path.setAttribute('d', generateZigzagPath(smoothProgress));
    }
  }

  if (Math.abs(rawProgress - lastProgress) > 0.001) {
    animationFrame = requestAnimationFrame(updateProgress);
  }
};

const handleScroll = () => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
  animationFrame = requestAnimationFrame(updateProgress);
};

onMounted(() => {
  if (!svgRef.value) {
    console.warn('[SectionSeparator] SVG ref not found on mount');
    return;
  }

  try {
    vivusInstance = new Vivus(svgRef.value as unknown as HTMLElement, {
      type: 'delayed',
      duration: 100,
      start: 'manual',
      dashGap: 0,
      forceRender: true
    });

    console.log('[SectionSeparator] Vivus initialized:', vivusInstance);
  } catch (error) {
    console.error('[SectionSeparator] Error initializing Vivus:', error);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  updateProgress(); // Initial calculation
});

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
  window.removeEventListener('scroll', handleScroll);
  vivusInstance = null;
});
</script>

<style lang="scss" scoped>
.section-separator {
  width: 100%;
  padding: 2rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 100;
  overflow: visible;
}

.separator-line {
  display: block;
  width: 100%;
  position: relative;
  z-index: 100;
  overflow: visible;
  min-height: 24px;
}

.line {
  will-change: d;
  opacity: 1;
  visibility: visible;
}

.pencil-dot {
  opacity: 0;
  transition: opacity 0.15s ease;
  will-change: cx, opacity;
  pointer-events: none;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.9)) 
          drop-shadow(0 0 16px rgba(255, 255, 255, 0.6));
  animation: pencilPulse 1s ease-in-out infinite;
}

@keyframes pencilPulse {
  0% {
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.9)) 
            drop-shadow(0 0 16px rgba(255, 255, 255, 0.6));
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 12px rgba(255, 255, 255, 1)) 
            drop-shadow(0 0 24px rgba(255, 255, 255, 0.8));
    transform: scale(1.2);
  }
  100% {
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.9)) 
            drop-shadow(0 0 16px rgba(255, 255, 255, 0.6));
    transform: scale(1);
  }
}

// Add debug styles
.debug-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
}

.debug-info {
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 1rem;
  font-family: monospace;
  font-size: 12px;
  border-radius: 4px;
  margin: 1rem;

  p {
    margin: 0.25rem 0;
    white-space: nowrap;
  }
}

.debug-trigger-points {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.trigger-line {
  position: absolute;
  width: 100%;
  border-top: 1px dashed rgba(255, 0, 0, 0.5);
  font-family: monospace;
  font-size: 12px;
  color: rgba(255, 0, 0, 0.8);
  padding: 4px;
  
  &.top {
    background: linear-gradient(to bottom, rgba(255, 0, 0, 0.1), transparent);
  }
  
  &.bottom {
    background: linear-gradient(to top, rgba(255, 0, 0, 0.1), transparent);
  }
}

.debug-highlight {
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 1px dashed rgba(0, 255, 0, 0.5);
    pointer-events: none;
  }
}

// Add debug progress display
.debug-progress {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  pointer-events: none;
}
</style> 