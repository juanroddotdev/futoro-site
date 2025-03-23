<template>
  <div ref="containerRef" class="container" :id="sectionId">
    <div ref="phoneRef" class="phone">
      <div class="phone-inner">
        <div class="phone-header">
          <div class="notch"></div>
        </div>
        <div ref="messagesRef" class="messages-container">
          <div class="debug-marker top">Top of container</div>
          <div class="debug-marker bottom">Bottom of messages area</div>
          
          <div class="messages-wrapper">
            <div
              v-for="(message, index) in messages"
              :key="index"
              :class="[
                'message',
                message.type === 'sent' || message.type === 'step' ? 'sent' : 'received',
                `message-${index}`,
                index === 0 ? 'first-message' : ''
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
        <div class="message-input-container">
          <div class="input-wrapper">
            <div class="camera-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z" fill="#007AFF"/>
                <path d="M20 4h-3.17l-1.24-1.35A2 2 0 0 0 14.12 2H9.88a2 2 0 0 0-1.47.65L7.17 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" stroke="#007AFF" stroke-width="2"/>
              </svg>
            </div>
            <div class="message-input">
              <span class="placeholder">iMessage</span>
            </div>
            <div class="app-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#007AFF" stroke-width="2"/>
                <path d="M12 16v-4m0-4h.01" stroke="#007AFF" stroke-width="2"/>
              </svg>
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

  // First, set all messages to visible but positioned at the bottom
  gsap.set('.message', { 
    opacity: 0,
    y: 20,
  });

  timeline = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      pin: phone,
      scrub: 1,
      pinSpacing: true,
      onUpdate: (self) => {
        if (self.progress > 0.15) { // Start scrolling after messages have appeared
          const maxScroll = messagesContainer.scrollHeight - messagesContainer.clientHeight;
          const scrollProgress = (self.progress - 0.15) / 0.7; // Adjust for the initial delay
          const scrollPosition = maxScroll * Math.min(scrollProgress, 1);
          messagesContainer.scrollTop = scrollPosition;
        }
      },
    },
  });

  // Animate messages appearing from bottom
  props.messages.forEach((_, index) => {
    timeline.to(
      `.message-${index}`,
      { 
        opacity: 1, 
        y: 0,
        duration: 0.3,
      },
      index * 0.3
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
  padding: 20px;
  height: calc(100% - 110px);
  overflow-y: hidden;
  background: #f5f5f5;
  position: relative;
  display: flex;
  flex-direction: column;
}

.messages-wrapper {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 8px;
}

.message {
  max-width: 80%;
  clear: both;
  opacity: 0;
  margin-bottom: 0;
}

/* Ensure the last message has space before the input */
.messages-wrapper::after {
  content: '';
  padding-bottom: 8px;
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
  margin-left: auto;
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
  margin-right: auto;
}

.received .message-content {
  background: #E5E5EA;
  color: black;
  border-bottom-left-radius: 4px;
}

.message-input-container {
  height: 60px;
  background: #fff;
  border-top: 1px solid #e5e5e5;
  padding: 8px 16px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
}

.input-wrapper {
  background: #f5f5f5;
  border-radius: 20px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.message-input {
  flex: 1;
  min-height: 24px;
}

.placeholder {
  color: #8e8e93;
  font-size: 0.95rem;
}

.camera-button, .app-button {
  cursor: pointer;
}

/* Debug styles */
.debug-marker {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: red;
  z-index: 100;
  font-size: 10px;
  color: red;
  pointer-events: none;
}

.debug-marker.top {
  top: 0;
}

.debug-marker.bottom {
  bottom: 60px; /* Just above input container */
}

.first-message {
  position: relative;
}

.first-message::before {
  content: 'First message';
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  color: blue;
  margin-right: 5px;
  white-space: nowrap;
}

/* Make debug elements visible only during development */
@media screen and (min-width: 768px) {
  .debug-marker, .first-message::before {
    display: block;
  }
}

@media screen and (max-width: 767px) {
  .debug-marker, .first-message::before {
    display: none;
  }
}
</style> 