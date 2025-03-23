<template>
  <div ref="containerRef" class="container" :id="sectionId">
    <FloatingPhone 
      ref="floatingPhoneRef"
      :tilt-x="8"
      :tilt-y="-20"
    >
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
      <div class="message-input-container">
        <div class="input-wrapper">
          <div class="message-input">
            <span class="placeholder"><span class="futoro">futoro</span>Message</span>
          </div>
        </div>
      </div>
    </FloatingPhone>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import TypingIndicator from './TypingIndicator.vue';
import FloatingPhone from './FloatingPhone.vue';

gsap.registerPlugin(ScrollTrigger);

interface Message {
  text: string;
  type: 'sent' | 'received' | 'step';
}

interface Props {
  messages: Message[];
  sectionId: string;
  showTypingFor: number[];
}

const props = defineProps<Props>();

const containerRef = ref<HTMLElement | null>(null);
const floatingPhoneRef = ref<InstanceType<typeof FloatingPhone> | null>(null);
const messagesRef = ref<HTMLElement | null>(null);

let timeline: gsap.core.Timeline;

onMounted(() => {
  const container = containerRef.value;
  const floatingPhone = floatingPhoneRef.value?.$el;

  if (!floatingPhone || !container) return;

  // Initial state with force3D for better performance
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

  timeline = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: `+=${props.messages.length * 50}%`,
      pin: floatingPhone,
      scrub: 0.5,
      pinSpacing: true,
      anticipatePin: 1,
      fastScrollEnd: true,
      preventOverlaps: true,
      invalidateOnRefresh: true,
    },
  });

  const MESSAGE_OFFSET = 100;

  props.messages.forEach((_, idx) => {
    const currentGroup = `.message-group-${idx + 1}`;
    if (idx > 0) {
      const previousGroups = props.messages
        .slice(0, idx)
        .map((_, i) => `.message-group-${i + 1}`);
      
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
      const typingContainer = `.typing-container-${idx + 1}`;
      
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

    timeline
      .to(currentGroup, { 
        opacity: 1,
        duration: 0.2,
        ease: "power1.out"
      })
      .to({}, { duration: 0.3 });
  });
});
</script>

<style lang="scss">
// @import '../scss/components/phone-conversation-floating';
</style> 
