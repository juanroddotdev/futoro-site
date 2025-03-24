<template>
  <section ref="sectionRef" :id="id" class="lazy-section" style="min-height: 100px;">
    <slot v-if="isVisible"></slot>
    <div v-else class="lazy-section-placeholder" style="min-height: inherit;">
      <slot name="placeholder"></slot>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineProps, defineEmits } from 'vue';
import scrollDebugger from '@/utils/scroll/debug/ScrollDebugger';
import { formatDuration } from '@/utils/timestamp';

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  threshold: {
    type: Number,
    default: 0.1
  },
  rootMargin: {
    type: String,
    default: '0px'
  },
  forceVisible: {
    type: Boolean,
    default: false
  },
  debug: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['visible', 'hidden']);
const isVisible = ref(false);
const sectionRef = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  // Register with ScrollDebugger
  if (props.debug) {
    scrollDebugger.registerSection(`lazy-section-${props.id}`);
  }
  
  if (props.forceVisible) {
    isVisible.value = true;
    emit('visible');
    
    if (props.debug) {
      scrollDebugger.sectionVisible(`lazy-section-${props.id}`, {
        forceVisible: true,
        timeSincePageLoad: scrollDebugger.getTimeSincePageLoad()
      });
    }
    
    return;
  }

  const options = {
    rootMargin: props.rootMargin,
    threshold: props.threshold
  };

  observer = new IntersectionObserver((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && !isVisible.value) {
      const timeSincePageLoad = scrollDebugger.getTimeSincePageLoad();
      
      console.log(`👁️✨ [LazySection] Section ${props.id} entering viewport - initializing content (${timeSincePageLoad} since page load)`);
      isVisible.value = true;
      emit('visible');
      
      if (props.debug) {
        scrollDebugger.sectionVisible(`lazy-section-${props.id}`, {
          intersectionRatio: entry.intersectionRatio,
          timeSincePageLoad
        });
      }
    } else if (!entry.isIntersecting && isVisible.value) {
      // Uncomment if you want sections to unload when out of view
      // isVisible.value = false;
      // emit('hidden');
      // console.log(`🚶‍♂️💨 [LazySection] Section ${props.id} leaving viewport - unloading content`);
    }
  }, options);

  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
.lazy-section {
  position: relative;
  width: 100%;
  min-height: 100px; /* Ensure minimum height */
  display: block;
  z-index: 2;
}

.lazy-section-placeholder {
  width: 100%;
  min-height: inherit; /* Inherit the parent's min-height */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
