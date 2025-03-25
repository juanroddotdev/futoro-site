<template>
  <div class="chat-screen" :style="{ opacity: isVisible ? 1 : 0 }">
    <div ref="messagesRef" class="messages-container">
      <template v-for="(message, idx) in messages" :key="`typing-${idx}`">
        <div v-if="showTypingFor.includes(idx)" :class="`typing-container typing-container-${idx + 1}`">
          <TypingIndicator :class="`typing-indicator-${idx + 1}`" :is-sent="message.type === 'sent'" />
        </div>
      </template>

      <template v-for="(message, idx) in messages" :key="`message-${idx}`">
        <div :class="`message-group message-group-${idx + 1}`">
          <div class="message" :class="[
            message.type === 'sent' ? 'sent' : 'received',
            `message-${idx + 1}`
          ]">
            <div class="message-content">
              {{ message.text }}
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="message-input-container">
      <div class="input-wrapper">
        <div class="message-input">
          <span class="placeholder"><span class="futoro">futoro</span>Message</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import TypingIndicator from '@/components/TypingIndicator.vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Message {
  text: string;
  type: string;
}

interface Props {
  messages: Message[];
  showTypingFor: number[];
  sectionId: string;
  pinSettings?: {
    enabled?: boolean;
    start?: string;
    end?: string;
    pinSpacing?: boolean;
    anticipatePin?: number;
  };
  isUnlocked?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  pinSettings: () => ({ enabled: false }),
  isUnlocked: false
});

const messagesRef = ref<HTMLElement | null>(null);
let timeline: gsap.core.Timeline;
let scrollTriggerInstance: ScrollTrigger;
const isVisible = ref(false);

const resetState = () => {
  // Reset any state needed when entering the section
};

const setupScrollAnimation = () => {
  if (!messagesRef.value) return;
  
  const container = messagesRef.value.closest('.chat-screen') || messagesRef.value;
  
  // Clear any existing ScrollTrigger instances
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill();
  }
  
  // Create timeline with ScrollTrigger
  timeline = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: props.pinSettings?.start || 'top top',
      end: props.pinSettings?.end || `+=${props.messages.length * 50}%`,
      scrub: 0.5,
      // Only pin if enabled
      pin: props.pinSettings?.enabled,
      pinSpacing: props.pinSettings?.enabled ? props.pinSettings?.pinSpacing : false,
      anticipatePin: props.pinSettings?.enabled ? props.pinSettings?.anticipatePin : 0,
      onEnter: resetState,
      onEnterBack: resetState,
    }
  });

  // Modify selectors to be scoped to this section
  const sectionSelector = `#${props.sectionId}`;
  const MESSAGE_OFFSET = 100;

  props.messages.forEach((_, idx) => {
    const currentGroup = `${sectionSelector} .message-group-${idx + 1}`;
    // Check if element exists before animating
    const currentGroupEl = document.querySelector(currentGroup);
    if (!currentGroupEl) {
      return; // Skip this animation if element doesn't exist
    }
    
    if (idx > 0) {
      const previousGroups = [];
      // Collect only existing elements
      for (let i = 0; i < idx; i++) {
        const el = document.querySelector(`${sectionSelector} .message-group-${i + 1}`);
        if (el) previousGroups.push(el);
      }
      
      if (previousGroups.length > 0) {
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
    }

    if (props.showTypingFor.includes(idx)) {
      const typingContainer = `${sectionSelector} .typing-container-${idx + 1}`;
      // Check if typing container exists
      const typingEl = document.querySelector(typingContainer);
      if (typingEl) {
        timeline
          .to(typingEl, {
            opacity: 1,
            duration: 0.15,
            ease: "power1.out"
          })
          .to({}, { duration: 0.3 })
          .to(typingEl, {
            opacity: 0,
            duration: 0.15,
            ease: "power1.in"
          });
      }
    }

    timeline.to(currentGroupEl, {
      opacity: 1,
      duration: 0.2,
      ease: "power1.out"
    })
      .to({}, { duration: 0.3 });
  });
  
  // Store the ScrollTrigger instance for cleanup
  scrollTriggerInstance = timeline.scrollTrigger as ScrollTrigger;
};

onMounted(() => {
  if (props.isUnlocked) {
    setupScrollAnimation();
  }
});

onBeforeUnmount(() => {
  // Clean up ScrollTrigger instances
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill();
  }
});

// Watch for changes in isUnlocked to set up scroll animations when the phone is unlocked
watch(() => props.isUnlocked, (newValue) => {
  console.log('[ChatScreen] 📱 isUnlocked changed:', newValue);
  if (newValue) {
    isVisible.value = true;
    // Small delay to ensure DOM is updated
    setTimeout(() => {
      console.log('[ChatScreen] 🎬 Setting up scroll animations');
      setupScrollAnimation();
    }, 100);
  } else {
    isVisible.value = false;
  }
}, { immediate: true });

// Expose methods to parent
defineExpose({
  setupScrollAnimation
});
</script>

<style scoped>
.chat-screen {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.message-group {
  margin-bottom: 16px;
  opacity: 0;
  transform: translateY(20px);
}

.message {
  max-width: 80%;
  padding-bottom: 8px;
  word-break: break-word;
}

.message.sent {
  margin-left: auto;
  margin-right: 0;
}

.message.received {
  margin-right: auto;
  margin-left: 0;
}

.message-content {
  padding: 12px 16px;
  border-radius: 20px;
  font-size: 16px;
  line-height: 1.4;
}

.message.sent .message-content {
  background-color: #0084ff;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.received .message-content {
  background-color: #e5e5ea;
  color: black;
  border-bottom-left-radius: 4px;
}

.typing-container {
  opacity: 0;
  margin-bottom: 8px;
}

.message-input-container {
  padding: 10px 16px;
  border-top: 1px solid #e5e5ea;
  background-color: white;
}

.input-wrapper {
  background-color: #f1f1f1;
  border-radius: 20px;
  padding: 8px 12px;
}

.message-input {
  font-size: 16px;
  color: #999;
}

.placeholder {
  color: #999;
}

.futoro {
  font-weight: bold;
  color: #0084ff;
  margin-right: 4px;
}
</style>
