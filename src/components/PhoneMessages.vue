<template>
  <div 
    ref="messagesRef" 
    class="messages-container"
    :class="{'messages-visible': isVisible}"
    :style="{ visibility: isHidden ? 'hidden' : 'visible', opacity: isHidden ? 0 : 1 }"
  >
    <template v-for="(message, idx) in messages" :key="`message-${idx}`">
      <div 
        :class="`message-group message-group-${idx + 1}`"
      >
        <div 
          class="message"
          :class="[
            message.type === 'sent' ? 'sent' : 'received',
            `message-${idx + 1}`
          ]"
        >
          <div class="message-content">
            {{ message.text }}
          </div>
        </div>
      </div>
    </template>
    
    <template v-for="(typingIndex, idx) in showTypingFor" :key="`typing-${idx}`">
      <div 
        :class="`typing-container typing-container-${typingIndex + 1}`"
      >
        <TypingIndicator />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineExpose, onMounted } from 'vue';
import TypingIndicator from './TypingIndicator.vue';
import gsap from 'gsap';

interface Message {
  text: string;
  type: string;
}

const props = defineProps({
  messages: {
    type: Array as () => Message[],
    required: true
  },
  showTypingFor: {
    type: Array as () => number[],
    default: () => []
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  sectionId: {
    type: String,
    required: true
  }
});

const messagesRef = ref(null);

// Add methods to control message animations
const MESSAGE_OFFSET = 100; // Define the offset for message animations

const resetMessageAnimations = () => {
  const sectionSelector = `#${props.sectionId}`;
  
  // Hide all message groups
  gsap.set(`${sectionSelector} .message-group`, { 
    opacity: 0, 
    y: 20,
    force3D: true 
  });
  
  // Hide all typing containers
  gsap.set(`${sectionSelector} .typing-container`, { 
    opacity: 0, 
    y: 20,
    force3D: true 
  });
};

const showFirstMessage = () => {
  if (props.messages.length > 0) {
    const sectionSelector = `#${props.sectionId}`;
    const firstGroupSelector = `${sectionSelector} .message-group-1`;
    const firstGroup = document.querySelector(firstGroupSelector);
    
    if (firstGroup) {
      gsap.to(firstGroup, { opacity: 1, y: 0, duration: 0.3 });
    }
  }
};

const createMessageTimeline = () => {
  const timeline = gsap.timeline();
  const sectionSelector = `#${props.sectionId}`;
  
  props.messages.forEach((_, idx) => {
    const currentGroup = `${sectionSelector} .message-group-${idx + 1}`;
    if (idx > 0) {
      const previousGroups = props.messages
        .slice(0, idx)
        .map((_, i) => `${sectionSelector} .message-group-${i + 1}`);
      
      timeline.to(previousGroups, {
        y: `-=${MESSAGE_OFFSET}`,
        duration: 0.3,
        ease: "power2.out",
        stagger: {
          amount: 0.1,
          ease: "power1.in"
        }
      });
    }

    if (props.showTypingFor.includes(idx)) {
      const typingContainer = `${sectionSelector} .typing-container-${idx + 1}`;
      
      timeline
        .to(typingContainer, { 
          opacity: 1, 
          duration: 0.15,
          ease: "power1.out"
        })
        .to({}, { duration: 0.3 })
        .to(typingContainer, { 
          opacity: 0, 
          duration: 0.15,
          ease: "power1.in"
        });
    }

    timeline.to(currentGroup, { 
      opacity: 1,
      duration: 0.2,
      ease: "power1.out"
    })
    .to({}, { duration: 0.3 });
  });
  
  return timeline;
};

defineExpose({
  messagesRef,
  resetMessageAnimations,
  showFirstMessage,
  createMessageTimeline
});
</script>

<style lang="scss" scoped>
.messages-container {
  height: calc(100% - 60px);
  padding: 20px;
  position: relative;
  overflow: hidden;
  width: auto;
  z-index: 1; /* Lower z-index initially */
  transition: opacity 0.3s ease;
}

.messages-visible {
  z-index: 10; /* Higher z-index when visible */
}

.message-group {
  position: absolute;
  bottom: 80px;
  left: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  will-change: transform;
  margin-bottom: 16px;
}

.typing-container {
  position: absolute;
  bottom: 80px;
  left: 20px;
  right: 20px;
  opacity: 0;
}

.message {
  max-width: 80%;
  padding-bottom: 8px;
  
  &.sent {
    margin-left: auto;
    margin-right: 0;
  }
  
  &.received {
    margin-right: auto;
    margin-left: 0;
  }
  
  &-content {
    padding: 12px 16px;
    border-radius: 20px;
    font-size: 16px;
    line-height: 1.4;
  }
}
</style>
