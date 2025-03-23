<template>
  <div ref="containerRef" class="container" :id="sectionId">
    <div ref="phoneRef" class="phone">
      <div class="phone-inner">
        <div class="phone-header">
          <div class="notch"></div>
        </div>
        <div ref="messagesRef" class="messages-container">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="[
              'message',
              message.type === 'sent' || message.type === 'step' ? 'sent' : 'received',
              `message-${index}`
            ]"
          >
            <div class="message-content">
              {{ message.text }}
            </div>
            <div v-if="message.time" class="message-time">
              {{ message.time }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import type { ChatMessage } from '../data/chatSections';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  messages: ChatMessage[];
  sectionId: string;
}

const props = defineProps<Props>();

const containerRef = ref<HTMLElement | null>(null);
const phoneRef = ref<HTMLElement | null>(null);
const messagesRef = ref<HTMLElement | null>(null);
let timeline: gsap.core.Timeline;

onMounted(() => {
  const phone = phoneRef.value;
  const container = containerRef.value;
  const messagesContainer = messagesRef.value;

  if (!phone || !container || !messagesContainer) return;

  timeline = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      pin: phone,
      scrub: 1,
      pinSpacing: true,
      onUpdate: (self) => {
        const maxScroll = messagesContainer.scrollHeight - messagesContainer.clientHeight;
        const scrollPosition = maxScroll * Math.min(self.progress / 0.85, 1);
        messagesContainer.scrollTop = scrollPosition;
      },
    },
  });

  props.messages.forEach((_, index) => {
    timeline.fromTo(
      `.message-${index}`,
      { 
        opacity: 0, 
        y: 20,
      },
      { 
        opacity: 1, 
        y: 0,
        duration: 0.5,
      },
      index * 0.5
    );
  });
});

onUnmounted(() => {
  if (timeline) {
    timeline.kill();
  }
});
</script>

<style scoped>
.container {
  min-height: 300vh;
  position: relative;
  padding: 2rem;
}

.phone {
  width: 375px;
  height: 700px;
  background: #1a1a1a;
  border-radius: 40px;
  padding: 15px;
  position: relative;
  margin: 0 auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.phone-inner {
  background: #fff;
  height: 100%;
  border-radius: 30px;
  overflow: hidden;
  position: relative;
}

.phone-header {
  height: 50px;
  background: #000;
  position: relative;
}

.notch {
  width: 150px;
  height: 25px;
  background: #000;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.messages-container {
  padding: 120px 20px 160px 20px;
  height: calc(100% - 50px);
  overflow-y: hidden;
  background: #f5f5f5;
}

.message {
  max-width: 80%;
  margin-bottom: 25px;
  clear: both;
  opacity: 0;
}

.message-content {
  padding: 12px 16px;
  border-radius: 20px;
  font-size: 0.95rem;
  line-height: 1.4;
}

.message-time {
  font-size: 0.75rem;
  color: #999;
  margin-top: 4px;
  margin-bottom: 8px;
}

.sent {
  float: right;
}

.sent .message-content {
  background: #007AFF;
  color: white;
  border-bottom-right-radius: 4px;
}

.sent .message-time {
  text-align: right;
}

.received {
  float: left;
}

.received .message-content {
  background: #E5E5EA;
  color: black;
  border-bottom-left-radius: 4px;
}
</style> 