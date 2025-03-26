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
import { ref, defineProps, defineExpose, onMounted, nextTick } from 'vue';
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

const messagesRef = ref<HTMLElement | null>(null);

// Add methods to control message animations
const MESSAGE_OFFSET = 100; // Define the offset for message animations

// Add onMounted hook to reset animations and show first message/typing indicator
onMounted(() => {
  console.log('PhoneMessages2 mounted');
  // Reset message animations on initial mount
  resetMessageAnimations();
  
  // After reset, show the first message or typing indicator
  nextTick(() => {
    showFirstMessage();
    console.log('First message shown after mount');
  });
});

const resetMessageAnimations = () => {
  // Wait for next tick to ensure DOM is updated
  nextTick(() => {
    const sectionSelector = `#${props.sectionId}`;
    console.log('Resetting animations for', sectionSelector);
    
    // Try direct reference first if possible
    if (messagesRef.value) {
      // Get all message groups within this component directly
      const messageGroups = messagesRef.value.querySelectorAll('.message-group');
      console.log(`Found ${messageGroups.length} message groups directly in component`);
      
      // Hide all message groups using direct reference
      gsap.set(messageGroups, { 
        opacity: 0, 
        y: 20,
        force3D: true 
      });
      
      // Hide all typing containers using direct reference
      const typingContainers = messagesRef.value.querySelectorAll('.typing-container');
      gsap.set(typingContainers, { 
        opacity: 0, 
        y: 20,
        force3D: true 
      });
    } else {
      // Fallback to document queries if direct reference not available
      const messageGroups = document.querySelectorAll(`${sectionSelector} .message-group`);
      console.log(`Found ${messageGroups.length} message groups via document query`);
      
      gsap.set(`${sectionSelector} .message-group`, { 
        opacity: 0, 
        y: 20,
        force3D: true 
      });
      
      gsap.set(`${sectionSelector} .typing-container`, { 
        opacity: 0, 
        y: 20,
        force3D: true 
      });
    }
  });
};

// Add a function to show the first message or typing indicator
const showFirstMessage = () => {
  if (!messagesRef.value) return;
  
  const sectionSelector = `#${props.sectionId}`;
  
  // Check if we should show typing indicator first
  if (props.showTypingFor.includes(0)) {
    // Show the first typing indicator
    const firstTypingContainer = messagesRef.value.querySelector('.typing-container-1');
    if (firstTypingContainer) {
      console.log('Showing first typing indicator');
      gsap.to(firstTypingContainer, { 
        opacity: 1, 
        y: 0, 
        duration: 0.3,
        ease: "power1.out"
      });
    }
  } else if (props.messages.length > 0) {
    // Show the first message
    const firstMessageGroup = messagesRef.value.querySelector('.message-group-1');
    if (firstMessageGroup) {
      console.log('Showing first message');
      gsap.to(firstMessageGroup, { 
        opacity: 1, 
        y: 0, 
        duration: 0.3,
        ease: "power1.out"
      });
    }
  }
};

// Modify createMessageTimeline to ensure messages appear after typing indicators
const createMessageTimeline = () => {
  console.log('createMessageTimeline called');
  const timeline = gsap.timeline();
  
  // Skip the first message since it's already shown
  props.messages.forEach((_, idx) => {
    // Only animate messages after the first one (index 0)
    if (idx > 0) {
      console.log(`Setting up animation for message ${idx + 1}`);
      const currentGroup = messagesRef.value?.querySelector(`.message-group-${idx + 1}`);
      const previousGroups = Array.from(messagesRef.value?.querySelectorAll(`.message-group-${idx}`) || []);
      
      if (previousGroups.length > 0) {
        timeline.to(previousGroups, {
          y: `-=${MESSAGE_OFFSET}`,
          duration: 0.3,
          ease: "power2.out"
        });
      }

      if (props.showTypingFor.includes(idx)) {
        const typingContainer = messagesRef.value?.querySelector(`.typing-container-${idx + 1}`);
        
        if (typingContainer) {
          timeline
            .to(typingContainer, { 
              opacity: 1, 
              y: 0,
              duration: 0.15,
              ease: "power1.out"
            })
            .to({}, { duration: 0.5 }) // Longer pause to see typing
            .to(typingContainer, { 
              opacity: 0, 
              duration: 0.15,
              ease: "power1.in"
            });
        }
      }

      if (currentGroup) {
        // Ensure this runs after typing indicator is hidden
        timeline.to(currentGroup, { 
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power1.out"
        });
      }
    }
  });
  
  console.log('Message timeline created with', timeline.getChildren().length, 'animations');
  return timeline;
};

// Add a function to check if the timeline is being properly used
const checkTimelineIntegration = () => {
  console.log('Checking timeline integration');
  // This is just a utility function to be called from the parent component
  // to verify that the component is accessible
  return {
    messagesCount: props.messages.length,
    hasMessagesRef: !!messagesRef.value,
    messageGroupsCount: messagesRef.value ? messagesRef.value.querySelectorAll('.message-group').length : 0
  };
};

// Add a method to play the timeline for testing
const playMessageTimeline = () => {
  const tl = createMessageTimeline();
  tl.play();
  return tl;
};

defineExpose({
  resetMessageAnimations,
  showFirstMessage,
  createMessageTimeline,
  playMessageTimeline, // Add this new method
  messagesRef,
  checkTimelineIntegration
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
