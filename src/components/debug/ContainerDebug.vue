<template>
  <div class="container-debug">
    <div class="debug-panel">
      <h3>Container Debug</h3>
      <div class="debug-info">
        <div>Section ID: {{ sectionId }}</div>
        <div>Section Rect: {{ sectionRect }}</div>
        <div>Sticky Rect: {{ stickyRect }}</div>
        <div>Phone Rect: {{ phoneRect }}</div>
        <div>Chat Rect: {{ chatRect }}</div>
        <div>Scroll Y: {{ scrollY }}</div>
        <div>Is Pinned: {{ isPinned }}</div>
      </div>
    </div>
    <div class="debug-outlines" v-if="showOutlines">
      <div class="section-outline" :style="sectionOutlineStyle"></div>
      <div class="sticky-outline" :style="stickyOutlineStyle"></div>
      <div class="phone-outline" :style="phoneOutlineStyle"></div>
      <div class="chat-outline" :style="chatOutlineStyle"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps<{
  sectionId: string;
  showOutlines?: boolean;
}>();

const sectionRect = ref({ top: 0, left: 0, width: 0, height: 0, bottom: 0 });
const stickyRect = ref({ top: 0, left: 0, width: 0, height: 0, bottom: 0 });
const phoneRect = ref({ top: 0, left: 0, width: 0, height: 0, bottom: 0 });
const chatRect = ref({ top: 0, left: 0, width: 0, height: 0, bottom: 0 });
const scrollY = ref(0);
const isPinned = ref(false);

// Computed styles for outlines
const sectionOutlineStyle = computed(() => ({
  top: `${sectionRect.value.top}px`,
  left: `${sectionRect.value.left}px`,
  width: `${sectionRect.value.width}px`,
  height: `${sectionRect.value.height}px`
}));

const stickyOutlineStyle = computed(() => ({
  top: `${stickyRect.value.top}px`,
  left: `${stickyRect.value.left}px`,
  width: `${stickyRect.value.width}px`,
  height: `${stickyRect.value.height}px`
}));

const phoneOutlineStyle = computed(() => ({
  top: `${phoneRect.value.top}px`,
  left: `${phoneRect.value.left}px`,
  width: `${phoneRect.value.width}px`,
  height: `${phoneRect.value.height}px`
}));

const chatOutlineStyle = computed(() => ({
  top: `${chatRect.value.top}px`,
  left: `${chatRect.value.left}px`,
  width: `${chatRect.value.width}px`,
  height: `${chatRect.value.height}px`
}));

// Update measurements
const updateMeasurements = () => {
  scrollY.value = window.scrollY;
  
  const sectionEl = document.querySelector(`.narrative-section[data-section-id="${props.sectionId}"]`);
  const stickyEl = document.querySelector(`.narrative-section[data-section-id="${props.sectionId}"] .sticky-container`);
  const phoneEl = document.querySelector(`.narrative-section[data-section-id="${props.sectionId}"] .phone-container`);
  const chatEl = document.querySelector(`.narrative-section[data-section-id="${props.sectionId}"] .narrative-chat`);
  
  if (sectionEl) {
    const rect = sectionEl.getBoundingClientRect();
    sectionRect.value = { 
      top: rect.top + window.scrollY, 
      left: rect.left, 
      width: rect.width, 
      height: rect.height,
      bottom: rect.bottom + window.scrollY
    };
  }
  
  if (stickyEl) {
    const rect = stickyEl.getBoundingClientRect();
    stickyRect.value = { 
      top: rect.top + window.scrollY, 
      left: rect.left, 
      width: rect.width, 
      height: rect.height,
      bottom: rect.bottom + window.scrollY
    };
    
    // Check if element is pinned (fixed position)
    const style = window.getComputedStyle(stickyEl);
    isPinned.value = style.position === 'fixed';
  }
  
  if (phoneEl) {
    const rect = phoneEl.getBoundingClientRect();
    phoneRect.value = { 
      top: rect.top + window.scrollY, 
      left: rect.left, 
      width: rect.width, 
      height: rect.height,
      bottom: rect.bottom + window.scrollY
    };
  }
  
  if (chatEl) {
    const rect = chatEl.getBoundingClientRect();
    chatRect.value = { 
      top: rect.top + window.scrollY, 
      left: rect.left, 
      width: rect.width, 
      height: rect.height,
      bottom: rect.bottom + window.scrollY
    };
  }
};

let rafId: number | null = null;

const loop = () => {
  updateMeasurements();
  rafId = requestAnimationFrame(loop);
};

onMounted(() => {
  updateMeasurements();
  rafId = requestAnimationFrame(loop);
  window.addEventListener('resize', updateMeasurements);
});

onUnmounted(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
  }
  window.removeEventListener('resize', updateMeasurements);
});
</script>

<style lang="scss" scoped>
.container-debug {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 9999;
  pointer-events: none;
  
  .debug-panel {
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px;
    border-radius: 4px;
    font-size: 12px;
    max-width: 300px;
    
    h3 {
      margin-top: 0;
      margin-bottom: 8px;
      font-size: 14px;
    }
    
    .debug-info {
      div {
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  
  .debug-outlines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    
    .section-outline {
      position: absolute;
      border: 2px solid red;
      z-index: 9990;
    }
    
    .sticky-outline {
      position: absolute;
      border: 2px solid blue;
      z-index: 9991;
    }
    
    .phone-outline {
      position: absolute;
      border: 2px solid green;
      z-index: 9992;
    }
    
    .chat-outline {
      position: absolute;
      border: 2px solid yellow;
      z-index: 9993;
    }
  }
}
</style>
