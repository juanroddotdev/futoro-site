<template>
  <div ref="sectionRef" class="lazy-section">
    <!-- Show placeholder while loading -->
    <slot v-if="isVisible" name="content"></slot>
    <slot v-else name="placeholder">
      <div class="section-placeholder min-h-[50vh] flex items-center justify-center">
        <div class="text-center">
          <div class="animate-pulse h-8 w-64 bg-gray-200 rounded mb-4 mx-auto"></div>
          <div class="animate-pulse h-4 w-48 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  id: {
    type: String,
    default: () => `lazy-section-${Math.random().toString(36).substring(2, 9)}`
  },
  rootMargin: {
    type: String,
    default: '200px 0px' // Load when within 200px of viewport
  },
  threshold: {
    type: Number,
    default: 0
  },
  forceVisible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['visible', 'hidden']);

const sectionRef = ref<HTMLElement | null>(null);
const isVisible = ref(props.forceVisible);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (props.forceVisible) {
    isVisible.value = true;
    emit('visible');
    return;
  }

  const options = {
    rootMargin: props.rootMargin,
    threshold: props.threshold
  };

  observer = new IntersectionObserver((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && !isVisible.value) {
      console.log(`👁️✨ [LazySection] Section ${props.id} entering viewport - initializing content`);
      isVisible.value = true;
      emit('visible');
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

defineExpose({
  isVisible
});
</script>

<style scoped>
.lazy-section {
  position: relative;
  width: 100%;
}
</style>
