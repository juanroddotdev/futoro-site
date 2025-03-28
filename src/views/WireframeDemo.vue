<template>
  <div class="wireframe-demo">
    <div class="demo-controls">
      <div class="spotlight-controls">
        <label>
          Spotlight X: {{ spotlightX }}%
          <input type="range" v-model.number="spotlightX" min="0" max="100" step="1">
        </label>
        <label>
          Spotlight Y: {{ spotlightY }}%
          <input type="range" v-model.number="spotlightY" min="0" max="100" step="1">
        </label>
        <label>
          <input type="checkbox" v-model="followMouse"> Follow Mouse
        </label>
      </div>
    </div>
    
    <div class="viewport-grid">
      <PaperGridBackground 
        :theme="currentTheme.replace('theme-', '')" 
        :floating="true" 
        :spotlight="true"
        :spotlightX="spotlightX"
        :spotlightY="spotlightY"
      />
    </div>
    
    <GridStyleWrapper
      :enabled="true"
      :spotlightX="spotlightX"
      :spotlightY="spotlightY"
      class="grid-wrapper"
    >
      <div class="demo-content">
        <!-- Regular heading as a fallback -->
        <h1 class="debug-heading">Wireframe Demo (Debug Heading)</h1>
        
        <!-- Using OutlineToFillText component for the heading -->
        <OutlineToFillText 
          ref="textElement"
          class="demo-heading heading-responsive" 
          text="Wireframe Demo" 
          :fillPercentage="0" 
          :spotlightEnabled="true"
          :spotlightX="spotlightX"
          :spotlightY="spotlightY"
        />
        
        <!-- New AnimatedOutlineToFillText component -->
        <AnimatedOutlineToFillText 
          class="animated-heading"
          text="Animated Text" 
          :spotlightEnabled="true"
          :spotlightX="spotlightX"
          :spotlightY="spotlightY"
          animation="fadeUp"
          :animateFill="true"
          :fillDuration="1.2"
        />
        
        <!-- Debug info -->
        <div class="debug-info">
          <p>Fill Percentage: {{ calculatedFillPercentage }}%</p>
          <p>Spotlight Position: {{ spotlightX }}%, {{ spotlightY }}%</p>
        </div>
      </div>
    </GridStyleWrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import GridStyleWrapper from '@/components/effects/GridStyleWrapper.vue';
import OutlineToFillText from '@/components/text/OutlineToFillText.vue';
import AnimatedOutlineToFillText from '@/components/text/AnimatedOutlineToFillText.vue';
// import PaperGridBackground from '@/components/ui/backgrounds/PaperGridBackground.vue';

// Theme
const currentTheme = ref('theme-future');

// Spotlight properties
const spotlightX = ref(20);
const spotlightY = ref(20);
const followMouse = ref(false);

// Reference to the text element
const textElement = ref<InstanceType<typeof OutlineToFillText> | null>(null);
const calculatedFillPercentage = ref(50);

// Calculate fill percentage based on position relative to spotlight
const calculateFillPercentage = () => {
  if (!textElement.value) return;
  
  const textRect = textElement.value.$el.getBoundingClientRect();
  const textCenter = {
    x: textRect.left + textRect.width / 2,
    y: textRect.top + textRect.height / 2
  };
  
  // Convert spotlight position from percentage to viewport coordinates
  const spotlightPos = {
    x: (window.innerWidth * spotlightX.value) / 100,
    y: (window.innerHeight * spotlightY.value) / 100
  };
  
  // Calculate distance from text center to spotlight center
  const distance = Math.sqrt(
    Math.pow(textCenter.x - spotlightPos.x, 2) + 
    Math.pow(textCenter.y - spotlightPos.y, 2)
  );
  
  // Use a responsive approach for normalization
  // Use the text element size as a factor in the calculation
  const textSize = Math.max(textRect.width, textRect.height);
  const viewportSize = Math.min(window.innerWidth, window.innerHeight);
  
  // Blend text size and viewport size for better responsiveness
  const referenceSize = (textSize * 0.7) + (viewportSize * 0.3);
  const normalizedDistance = distance / referenceSize;
  
  // Apply a non-linear curve with responsive scaling
  const scaleFactor = Math.max(1, Math.min(2, window.innerWidth / 1000));
  let fillPercent = 100 * (1 - Math.pow(Math.min(normalizedDistance * scaleFactor, 1), 2));
  
  // Clamp between 0 and 100
  fillPercent = Math.max(0, Math.min(100, fillPercent));
  
  calculatedFillPercentage.value = fillPercent;
};

// Track mouse position to update spotlight
const updateSpotlightPosition = (e: { clientX: number; clientY: number; }) => {
  if (followMouse.value) {
    spotlightX.value = (e.clientX / window.innerWidth) * 100;
    spotlightY.value = (e.clientY / window.innerHeight) * 100;
  }
};

// Update fill percentage on spotlight position change
watch([spotlightX, spotlightY], () => {
  calculateFillPercentage();
});

// Set up resize and scroll listeners
onMounted(() => {
  calculateFillPercentage();
  window.addEventListener('resize', calculateFillPercentage);
  window.addEventListener('scroll', calculateFillPercentage);
  window.addEventListener('mousemove', updateSpotlightPosition);
});

onUnmounted(() => {
  window.removeEventListener('resize', calculateFillPercentage);
  window.removeEventListener('scroll', calculateFillPercentage);
  window.removeEventListener('mousemove', updateSpotlightPosition);
});
</script>

<style scoped>
.wireframe-demo {
  position: relative;
  min-height: 100vh;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Add explicit height and width to the grid wrapper */
.grid-wrapper {
  min-height: 80vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.demo-heading {
  margin-top: 0; /* Remove top margin since we're centering vertically */
  font-size: 4rem;
  text-align: center;
}

.animated-heading {
  margin-top: 2rem;
  font-size: 3rem;
  text-align: center;
}

.debug-heading {
  color: #ff0000;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.debug-info {
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 8px;
  text-align: center;
}

.demo-controls {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.spotlight-controls, .fill-control {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.spotlight-controls label, .fill-control label {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.viewport-grid {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0; /* Increase from -1 to 0 to make it visible */
}

.demo-content {
  padding: 20px;
  max-width: 1200px;
  width: 100%;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
