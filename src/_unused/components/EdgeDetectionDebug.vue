<template>
  <div class="edge-detection-debug">
    <div class="debug-controls">
      <h2>Edge Detection Debug</h2>
      <div class="status" :class="{ 'active': isAtEdge }">
        Element at edge: {{ isAtEdge ? 'YES' : 'NO' }}
      </div>
      <div class="edge-type" :class="{ 'active': isLeftEdge }">
        Edge type: {{ isLeftEdge ? 'LEFT' : 'RIGHT' }}
      </div>
      <div class="progress-bar">
        <div class="progress" :style="{ width: `${edgeProgress * 100}%` }"></div>
        <div class="value">{{ Math.round(edgeProgress * 100) }}%</div>
      </div>
      <div class="debug-info">
        <div>Element position: {{ position.x.toFixed(0) }}px</div>
        <div>Element right edge: {{ elementRight.toFixed(0) }}px</div>
        <div>Element left edge: {{ elementLeft.toFixed(0) }}px</div>
        <div>Viewport width: {{ viewportWidth }}px</div>
        <div>Distance to right edge: {{ distanceToRight.toFixed(0) }}px</div>
        <div>Distance to left edge: {{ distanceToLeft.toFixed(0) }}px</div>
      </div>
    </div>
    
    <div class="test-area">
      <div 
        ref="testElement" 
        class="test-element"
        :style="{ transform: `translateX(${position.x}px)` }"
      >
        Test Element
      </div>
      
      <div class="controls">
        <button @click="moveLeft">Move Left</button>
        <button @click="moveRight">Move Right</button>
        <button @click="reset">Reset</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue';

const testElement = ref(null);
const position = reactive({ x: 0 });
const isAtEdge = ref(false);
const isLeftEdge = ref(false);
const edgeProgress = ref(0);
const viewportWidth = ref(window.innerWidth);
const threshold = 30; // px

// Element position tracking
const elementLeft = ref(0);
const elementRight = ref(0);

// Computed values for debugging
const distanceToRight = computed(() => {
  return Math.abs(elementRight.value - viewportWidth.value);
});

const distanceToLeft = computed(() => {
  return Math.abs(elementLeft.value);
});

// Movement controls
const moveLeft = () => {
  position.x -= 50;
  // Force update after position change
  setTimeout(checkEdges, 0);
};

const moveRight = () => {
  position.x += 50;
  // Force update after position change
  setTimeout(checkEdges, 0);
};

const reset = () => {
  position.x = 0;
  // Force update after position change
  setTimeout(checkEdges, 0);
};

// Check if element is at edge
const checkEdges = () => {
  if (!testElement.value) return;
  
  const rect = testElement.value.getBoundingClientRect();
  elementLeft.value = rect.left;
  elementRight.value = rect.right;
  
  const rightEdgeOfViewport = viewportWidth.value;
  const leftEdgeOfViewport = 0;
  
  // Check specifically if left edge is at 0 (with threshold)
  const isLeftEdgeAtZero = Math.abs(rect.left - leftEdgeOfViewport) < threshold;
  // Keep right edge check for completeness
  const isRightEdgeAtViewport = Math.abs(rect.right - rightEdgeOfViewport) < threshold;
  
  // Update isAtEdge based on left edge being at zero
  isAtEdge.value = isLeftEdgeAtZero || isRightEdgeAtViewport;
  isLeftEdge.value = isLeftEdgeAtZero;
  
  if (isAtEdge.value) {
    if (isLeftEdgeAtZero) {
      // Calculate progress specifically for left edge
      const leftDiff = Math.abs(rect.left - leftEdgeOfViewport);
      edgeProgress.value = 1 - (leftDiff / threshold);
    } else {
      // Calculate progress for right edge
      const rightDiff = Math.abs(rect.right - rightEdgeOfViewport);
      edgeProgress.value = 1 - (rightDiff / threshold);
    }
  } else {
    edgeProgress.value = 0;
  }
  
  console.log('Edge check:', {
    right: rect.right,
    left: rect.left,
    viewportWidth: rightEdgeOfViewport,
    rightDiff: Math.abs(rect.right - rightEdgeOfViewport),
    leftDiff: Math.abs(rect.left - leftEdgeOfViewport),
    isLeftEdgeAtZero,
    isRightEdgeAtViewport,
    isAtEdge: isAtEdge.value,
    isLeftEdge: isLeftEdge.value,
    edgeProgress: edgeProgress.value
  });
};

// Watch for position changes to update edge detection
watch(() => position.x, () => {
  checkEdges();
}, { immediate: true });

// Handle window resize
const handleResize = () => {
  viewportWidth.value = window.innerWidth;
  checkEdges();
};

// Set up a continuous check for edge detection
let animationFrame = null;
const continuousCheck = () => {
  checkEdges();
  animationFrame = requestAnimationFrame(continuousCheck);
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  // Initial check
  checkEdges();
  // Start continuous checking
  animationFrame = requestAnimationFrame(continuousCheck);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  // Clean up animation frame
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
});
</script>

<style lang="scss" scoped>
.edge-detection-debug {
  padding: 20px;
  
  .debug-controls {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 15px;
    border-radius: 8px;
    z-index: 1000;
    width: 300px;
    
    h2 {
      margin-top: 0;
      margin-bottom: 15px;
    }
    
    .status {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
      padding: 8px;
      background: rgba(255, 0, 0, 0.3);
      border-radius: 4px;
      
      &.active {
        background: rgba(0, 255, 0, 0.3);
      }
    }
    
    .edge-type {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
      padding: 8px;
      background: rgba(0, 0, 255, 0.3);
      border-radius: 4px;
    }
    
    .progress-bar {
      height: 20px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      margin-bottom: 15px;
      position: relative;
      
      .progress {
        height: 100%;
        background: #4CAF50;
        border-radius: 10px;
        transition: width 0.1s ease-out;
      }
      
      .value {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        text-align: center;
        line-height: 20px;
        font-weight: bold;
      }
    }
    
    .debug-info {
      font-size: 14px;
      
      div {
        margin-bottom: 5px;
      }
    }
  }
  
  .test-area {
    height: 300px;
    position: relative;
    border: 1px dashed #ccc;
    margin-top: 20px;
    overflow: hidden;
    
    .test-element {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: #3498db;
      color: white;
      padding: 20px 40px;
      border-radius: 4px;
      font-weight: bold;
      white-space: nowrap;
    }
    
    .controls {
      position: absolute;
      bottom: 20px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      gap: 10px;
      
      button {
        padding: 8px 16px;
        background: #2c3e50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        
        &:hover {
          background: #34495e;
        }
      }
    }
  }
}
</style>