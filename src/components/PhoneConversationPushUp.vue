<template>
  <div ref="containerRef" class="container" :id="sectionId">
    <div ref="phoneRef" class="phone">
      <div class="phone-inner">
        <!-- iOS Status Bar -->
        <div class="status-bar">
          <div class="notch">
            <div class="notch-content"></div>
          </div>
          <div class="status-bar-content">
            <div class="time">{{ currentTime }}</div>
            <div class="right-items">
              <div class="signal">
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                  <path d="M16 0H17C17.5523 0 18 0.447715 18 1V11C18 11.5523 17.5523 12 17 12H16C15.4477 12 15 11.5523 15 11V1C15 0.447715 15.4477 0 16 0Z" fill="black"/>
                  <path d="M11 3H12C12.5523 3 13 3.44772 13 4V11C13 11.5523 12.5523 12 12 12H11C10.4477 12 10 11.5523 10 11V4C10 3.44772 10.4477 3 11 3Z" fill="black"/>
                  <path d="M6 6H7C7.55228 6 8 6.44772 8 7V11C8 11.5523 7.55228 12 7 12H6C5.44772 12 5 11.5523 5 11V7C5 6.44772 5.44772 6 6 6Z" fill="black"/>
                  <path d="M1 9H2C2.55228 9 3 9.44772 3 10V11C3 11.5523 2.55228 12 2 12H1C0.447715 12 0 11.5523 0 11V10C0 9.44772 0.447715 9 1 9Z" fill="black"/>
                </svg>
              </div>
              <div class="wifi">
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                  <path d="M8 9.5C8.82843 9.5 9.5 10.1716 9.5 11C9.5 11.8284 8.82843 12.5 8 12.5C7.17157 12.5 6.5 11.8284 6.5 11C6.5 10.1716 7.17157 9.5 8 9.5Z" fill="black"/>
                  <path d="M4.45455 6.72727C6.21991 4.96191 9.78009 4.96191 11.5455 6.72727" stroke="black" stroke-width="1.5"/>
                  <path d="M1.63636 3.90909C4.78526 0.760194 11.2147 0.760194 14.3636 3.90909" stroke="black" stroke-width="1.5"/>
                </svg>
              </div>
              <div class="battery">
                <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
                  <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="black"/>
                  <path d="M23 4V8C23.8047 7.66122 24.328 6.87313 24.328 6C24.328 5.12687 23.8047 4.33878 23 4Z" fill="black"/>
                  <rect x="2" y="2" width="18" height="8" rx="1.5" fill="black"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div ref="messagesRef" class="messages-container">
          <!-- Fixed v-for with index -->
          <template v-for="(message, idx) in messages" :key="`typing-${idx}`">
            <div 
              v-if="showTypingFor.includes(idx)"
              :class="`typing-container typing-container-${idx + 1}`"
            >
              <TypingIndicator 
                :class="`typing-indicator-${idx + 1}`"
                :is-sent="message.type === 'sent' || message.type === 'step'"
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
                  message.type === 'sent' || message.type === 'step' ? 'sent' : 'received',
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
              <span class="placeholder">iMessage</span>
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
import TypingIndicator from './TypingIndicator.vue';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  messages: ChatMessage[];
  sectionId: string;
  showTypingFor?: number[];
}

const props = defineProps<Props>();
const containerRef = ref<HTMLElement | null>(null);
const phoneRef = ref<HTMLElement | null>(null);
const messagesRef = ref<HTMLElement | null>(null);
let timeline: gsap.core.Timeline;

// Default to empty array if not provided
const showTypingFor = props.showTypingFor ?? [];

// Time formatting function
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).replace(/\s/g, '').toLowerCase();
}

const currentTime = ref(formatTime(new Date()));
let timeInterval: number | null = null;

function logPositions() {
  const inputContainer = document.querySelector('.message-input-container');
  const messageGroup1 = document.querySelector('.message-group-1');
  const messageGroup2 = document.querySelector('.message-group-2');
  const message1 = document.querySelector('.message-1');
  const message2 = document.querySelector('.message-2');

  console.log('=== Elements Present ===');
  console.log('Input Container:', !!inputContainer);
  console.log('Message Group 1:', !!messageGroup1);
  console.log('Message Group 2:', !!messageGroup2);
  console.log('Message 1:', !!message1);
  console.log('Message 2:', !!message2);

  if (messageGroup1 && messageGroup2) {
    const group1Rect = messageGroup1.getBoundingClientRect();
    const group2Rect = messageGroup2.getBoundingClientRect();
    
    console.log('\n=== Positions ===');
    console.log('Message Group 1 Bottom:', group1Rect.bottom);
    console.log('Message Group 2 Bottom:', group2Rect.bottom);
    console.log('Message Group 1 Opacity:', window.getComputedStyle(messageGroup1).opacity);
    console.log('Message Group 2 Opacity:', window.getComputedStyle(messageGroup2).opacity);
  }
}

onMounted(() => {
  const phone = phoneRef.value;
  const container = containerRef.value;

  if (!phone || !container) return;

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
      pin: phone,
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

    if (showTypingFor.includes(idx)) {
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

  // Update time every minute
  timeInterval = window.setInterval(() => {
    currentTime.value = formatTime(new Date());
  }, 60000);
});

onUnmounted(() => {
  if (timeline) {
    timeline.kill();
  }

  // Clean up interval when component is destroyed
  if (timeInterval !== null) {
    clearInterval(timeInterval);
  }
});
</script>

<style scoped>
.container {
  width: 100%;
  min-height: 200vh;
  position: relative;
  display: flex;
  justify-content: center;
  padding: 0 20px;
}

.phone {
  width: 375px;
  height: 812px;
  background: #000;
  border-radius: 40px;
  padding: 20px;
  position: relative;
}

.phone-inner {
  background: #fff;
  height: 100%;
  border-radius: 30px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

.messages-container {
  flex: 1;
  padding: 20px;
  background: #f5f5f5;
  position: relative;
  overflow: hidden;
  height: 100%;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
}

.typing-container {
  position: absolute;
  bottom: 80px;
  left: 20px;
  right: 20px;
  opacity: 0;
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
}

.message-group {
  position: absolute;
  bottom: 80px;
  left: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  will-change: transform, opacity; /* Optimize for these properties */
  transform: translateZ(0); /* Force GPU acceleration */
  backface-visibility: hidden; /* Prevent flickering */
  perspective: 1000; /* Improve 3D performance */
}

.message {
  max-width: 80%;
  padding-bottom: 8px;
  transform: translateZ(0);
  will-change: transform;
}

.message.sent {
  margin-left: auto; /* Push sent messages to the right */
  margin-right: 0;
}

.message.received {
  margin-right: auto; /* Push received messages to the left */
  margin-left: 0;
}

.message-content {
  padding: 12px 16px;
  border-radius: 20px;
  font-size: 16px;
  line-height: 1.4;
}

.sent .message-content {
  background: #007AFF;
  color: white;
  border-bottom-right-radius: 4px; /* iMessage style corners */
}

.received .message-content {
  background: #e5e5ea;
  color: black;
  border-bottom-left-radius: 4px; /* iMessage style corners */
}

.message-input-container {
  height: 60px;
  background: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 8px 16px;
  position: relative;
  z-index: 2;
}

.input-wrapper {
  background: rgba(0, 0, 0, 0.05); /* Lighter gray to match image */
  border-radius: 20px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
}

.message-input {
  flex: 1;
  min-height: 24px;
  display: flex;
  align-items: center;
}

.placeholder {
  color: #8e8e93;
  font-size: 0.95rem;
  margin-left: 8px; /* Add some left padding to match image */
}

/* Ensure typing indicators are visible */
:deep(.typing-indicator) {
  width: fit-content;
  opacity: 1 !important;
}

/* Align typing indicators with their respective messages */
:deep(.typing-indicator.is-sent) {
  margin-left: auto;
  margin-right: 0;
}

:deep(.typing-indicator.is-received) {
  margin-right: auto;
  margin-left: 0;
}

.status-bar {
  height: 47px;
  width: 100%;
  position: relative;
  background: #f5f5f5;
  z-index: 10;
}

.notch {
  position: absolute;
  width: 50%;
  height: 30px;
  background: black;
  left: 50%;
  transform: translateX(-50%);
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
}

.notch-content {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  margin-top: 1px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.status-bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  color: black;
  font-size: 14px;
  font-weight: 600;
}

.time {
  flex: 1;
}

.right-items {
  display: flex;
  gap: 6px;
  align-items: center;
}

.signal, .wifi, .battery {
  display: flex;
  align-items: center;
}

.messages-container {
  height: calc(100% - 107px); /* Adjusted for status bar */
  padding-top: 10px; /* Added padding below status bar */
}
</style> 