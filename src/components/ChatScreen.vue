<template>
  <div ref="containerRef" class="chat-container" :id="sectionId">
    <div ref="messagesRef" class="messages-container">
      <template v-for="(message, idx) in messages" :key="`typing-${idx}`">
        <div 
          v-if="showTypingFor.includes(idx)"
          :class="`typing-container typing-container-${idx + 1}`"
        >
          <TypingIndicator 
            :class="`typing-indicator-${idx + 1}`"
            :is-sent="message.type === 'sent'"
          />
        </div>
      </template>

      <template v-for="(message, idx) in messages" :key="`message-${idx}`">
        <div 
          :class="`message-group message-group-${idx + 1}`"
        >
          <div 
            class="message"
            :class="[
              message.type === 'sent'  ? 'sent' : 'received',
              `message-${idx + 1}`
            ]"
          >
            <div class="message-content">
              {{ message.text }}
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import TypingIndicator from './TypingIndicator.vue';

gsap.registerPlugin(ScrollTrigger);

interface Message {
  text: string;
  type: string;
}

interface Props {
  messages: Message[];
  sectionId: string;
  showTypingFor: number[];
  tiltX?: number;
  tiltY?: number;
  pinSettings?: {
    enabled?: boolean;
    start?: string;
    end?: string;
    pinSpacing?: boolean;
    anticipatePin?: number;
  };
}

const props = withDefaults(defineProps<Props>(), {
  tiltX: 8,
  tiltY: -20,
  pinSettings: () => ({
    enabled: true,
    start: 'top top',
    pinSpacing: true,
    anticipatePin: 1
  })
});

const containerRef = ref<HTMLElement | null>(null);
const messagesRef = ref<HTMLElement | null>(null);

let timeline: gsap.core.Timeline;

const scrollPosition = ref(0);
const isVisible = ref(false);

onMounted(() => {
  const container = containerRef.value;

  if (!container) return;

  // Reset function to set initial state
  const resetState = () => {
    gsap.set('.message-group', { 
      opacity: 0, 
      y: 0,
      force3D: true 
    });
    gsap.set('.typing-container', { 
      opacity: 0, 
      y: 0,
      force3D: true 
    });
  };

  // Initial reset
  resetState();

  // Create timeline with ScrollTrigger
  timeline = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: props.pinSettings.start,
      end: props.pinSettings.end || `+=${props.messages.length * 50}%`,
      scrub: 0.5,
      // Only pin if enabled
      pin: props.pinSettings.enabled,
      pinSpacing: props.pinSettings.enabled ? props.pinSettings.pinSpacing : false,
      anticipatePin: props.pinSettings.enabled ? props.pinSettings.anticipatePin : 0,
      onEnter: resetState,
      onEnterBack: resetState,
    }
  });

  // Modify selectors to be scoped to this section
  const sectionSelector = `#${props.sectionId}`;

  const MESSAGE_OFFSET = 100;

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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        scrollPosition.value = 0;  // Reset scroll position
      } else {
        isVisible.value = false;
      }
    });
  }, {
    threshold: 0.1
  });

  if (containerRef.value) {
    observer.observe(containerRef.value);
  }

  return () => observer.disconnect();
});

onUnmounted(() => {
  // Clean up ScrollTrigger
  if (timeline) {
    timeline.scrollTrigger?.kill();
    timeline.kill();
  }
});
</script>

<style lang="scss" scoped>
.chat-container {
  width: 100%;
  height: 100%;
  min-height: 500px; /* Add a minimum height */
  background: #f5f5f5;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.messages-container {
  flex: 1;
  padding: 20px;
  position: relative;
  overflow: hidden;
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

.sent .message-content {
  background: linear-gradient(135deg, #007aff, #0063cc);
  color: white;
  border-bottom-right-radius: 4px;
}

.received .message-content {
  background: linear-gradient(135deg, #e5e5ea, #d1d1d6);
  color: black;
  border-bottom-left-radius: 4px;
}

.message-input-container {
  padding: 10px 15px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.input-wrapper {
  background: white;
  border-radius: 20px;
  padding: 10px 15px;
}

.message-input {
  width: 100%;
  min-height: 24px;
}

.placeholder {
  color: #8e8e93;
  font-size: 16px;
}

.futoro {
  font-weight: bold;
  color: #007aff;
  margin-right: 4px;
}
</style>
