<script setup lang="ts">
const props = defineProps<{
  showPlayground: boolean
}>();

const emit = defineEmits<{
  (e: 'update:showPlayground', value: boolean): void
}>();

const toggleView = () => {
  emit('update:showPlayground', !props.showPlayground);
};
</script>

<template>
  <!-- Changed positioning from 'top-1/2 -translate-y-1/2' to 'top-24' to position it right under the navbar -->
  <div class="fixed right-4 top-24 z-[100] view-toggle-minimal">
    <button 
      @click="toggleView"
      class="toggle-dot"
      :class="{ 'is-playground': showPlayground }"
    >
      <span class="sr-only">Toggle View</span>
      <svg class="icon-playground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
      <svg class="icon-final" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.view-toggle-minimal {
  .toggle-dot {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    border: 1px solid currentColor;
    transition: all 0.3s ease;
    overflow: hidden;
    
    svg {
      width: 12px;
      height: 12px;
      opacity: 0;
      transition: all 0.3s ease;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    
    .icon-playground {
      opacity: 0;
    }
    
    .icon-final {
      opacity: 1;
    }
    
    &.is-playground {
      .icon-playground {
        opacity: 1;
      }
      .icon-final {
        opacity: 0;
      }
    }
    
    &:hover {
      transform: scale(1.1);
      background: rgba(255, 255, 255, 0.2);
    }
  }
}
</style>