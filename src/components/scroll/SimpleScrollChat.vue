<template>
  <section :id="sectionId" ref="sectionRef" class="scroll-chat-section debug">
    <div class="messages-list" ref="messagesRef">
      <div 
        v-for="(message, index) in messages" 
        :key="index"
        :class="[
          'message-item', 
          message.type === 'received' ? 'message-item--client' : 'message-item--agent',
          index < visibleCount ? 'visible' : ''
        ]"
      >
        <div class="message-label" v-if="message.type === 'received'">{{ clientLabel }}</div>
        <div class="message-label" v-else>{{ agentLabel }}</div>
        <div class="message-content">{{ message.text }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  sectionId: {
    type: String,
    default: 'scroll-chat'
  },
  clientLabel: {
    type: String,
    default: 'Client:'
  },
  agentLabel: {
    type: String,
    default: 'Agent:'
  }
});

const sectionRef = ref(null);
const messagesRef = ref(null);
const visibleCount = ref(0);

// Calculate section height based on message count
const sectionHeight = computed(() => {
  return props.messages.length * 150 + 300; // Base height + height per message
});

// Handle scroll event
function handleScroll() {
  if (!sectionRef.value) return;
  
  const rect = sectionRef.value.getBoundingClientRect();
  const sectionTop = rect.top;
  const sectionHeight = rect.height;
  const windowHeight = window.innerHeight;
  
  // Calculate how far we've scrolled through the section
  const scrollProgress = Math.max(0, Math.min(1, 
    (windowHeight - sectionTop) / (sectionHeight + windowHeight)
  ));
  
  // Calculate how many messages to show based on scroll progress
  const messagesToShow = Math.ceil(props.messages.length * scrollProgress);
  visibleCount.value = messagesToShow;
}

onMounted(() => {
  // Set initial section height
  if (sectionRef.value) {
    sectionRef.value.style.height = `${sectionHeight.value}px`;
  }
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll);
  
  // Initial calculation
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.scroll-chat-section {
  position: relative;
  width: 100%;
  /* Height will be set dynamically in JS */
}

.messages-list {
  position: sticky;
  top: 20vh;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message-item {
  max-width: 80%;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.message-item.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Swapped client and agent positioning */
.message-item--client {
  align-self: flex-start;
  background-color: #e1f5fe;
  margin-right: auto;
  border-bottom-left-radius: 0.25rem;
}

.message-item--agent {
  align-self: flex-end;
  background-color: #f5f5f5;
  margin-left: auto;
  border-bottom-right-radius: 0.25rem;
}

.message-label {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.25rem;
  font-weight: 600;
}

.message-content {
  font-size: 1rem;
  line-height: 1.5;
}
</style>
