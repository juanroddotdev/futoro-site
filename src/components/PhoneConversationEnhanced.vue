<template>
  <div ref="containerRef" class="container" :id="sectionId">
    <div ref="phoneRef" class="phone">
      
      <div class="phone-inner">
        <div class="phone-header">
          <div class="status-bar">
            <div class="time">9:41</div>
            <div class="status-icons">
              <div class="signal">
                <svg width="18" height="12" viewBox="0 0 18 12" fill="#000">
                  <path d="M16 0h2v12h-2V0zM12 4h2v8h-2V4zM8 6h2v6H8V6zM4 8h2v4H4V8zM0 10h2v2H0v-2z"/>
                </svg>
              </div>
              <div class="wifi">
                <svg width="16" height="12" viewBox="0 0 16 12" fill="#000">
                  <path d="M8 9.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM3.5 5.5c2.5-2.5 6.5-2.5 9 0l1.4-1.4c-3.3-3.3-8.5-3.3-11.8 0L3.5 5.5zM0.7 2.7c4.1-4.1 10.5-4.1 14.6 0l1.4-1.4C11.8-3.6 4.2-3.6-.7 1.3l1.4 1.4z"/>
                </svg>
              </div>
              <div class="battery">
                <svg width="25" height="12" viewBox="0 0 25 12" fill="#000">
                  <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="#000" fill="none"/>
                  <rect x="2" y="2" width="18" height="8" rx="1.5" fill="#000"/>
                  <path d="M23 4v4c.8 0 1.5-.9 1.5-2s-.7-2-1.5-2z"/>
                </svg>
              </div>
            </div>
          </div>
          <div class="chat-header">
            <div class="contact-info">
              <div class="contact-avatar"></div>
              <div class="contact-name">Client</div>
            </div>
            <div class="header-actions">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007AFF">
                <path d="M15 10l5 5-5 5" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
          <div class="notch"></div>
        </div>
        <div ref="messagesRef" class="messages-container">
          <div class="messages-wrapper">
            <!-- First message sequence -->
            <div class="message-sequence">
              <div 
                class="message received typing-indicator message-typing-0"
                :style="{ visibility: messageStates[0] === 'typing' ? 'visible' : 'hidden' }"
              >
                <div class="typing-animation">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              
              <div
                class="message received message-0"
                :style="{ visibility: messageStates[0] === 'shown' ? 'visible' : 'hidden' }"
              >
                <div class="message-content">
                  {{ messages[0].text }}
                </div>
                <div v-if="messages[0].time" class="message-time">
                  {{ messages[0].time }}
                </div>
              </div>
            </div>

            <!-- Second message sequence -->
            <div class="message-sequence">
              <div 
                class="message sent typing-indicator message-typing-1"
                :style="{ visibility: messageStates[1] === 'typing' ? 'visible' : 'hidden' }"
              >
                <div class="typing-animation">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              <div
                class="message sent message-1"
                :style="{ visibility: messageStates[1] === 'shown' ? 'visible' : 'hidden' }"
              >
                <div class="message-content">
                  {{ messages[1].text }}
                </div>
                <div v-if="messages[1].time" class="message-time">
                  {{ messages[1].time }}
                </div>
              </div>
            </div>

            <!-- Third message sequence -->
            <div class="message-sequence">
              <div 
                class="message received typing-indicator message-typing-2"
                :style="{ visibility: messageStates[2] === 'typing' ? 'visible' : 'hidden' }"
              >
                <div class="typing-animation">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              <div
                class="message received message-2"
                :style="{ visibility: messageStates[2] === 'shown' ? 'visible' : 'hidden' }"
              >
                <div class="message-content">
                  {{ messages[2].text }}
                </div>
                <div v-if="messages[2].time" class="message-time">
                  {{ messages[2].time }}
                </div>
              </div>
            </div>

            <!-- Fourth message sequence -->
            <div class="message-sequence">
              <div 
                class="message sent typing-indicator message-typing-3"
                :style="{ visibility: messageStates[3] === 'typing' ? 'visible' : 'hidden' }"
              >
                <div class="typing-animation">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              <div
                class="message sent message-3"
                :style="{ visibility: messageStates[3] === 'shown' ? 'visible' : 'hidden' }"
              >
                <div class="message-content">
                  {{ messages[3].text }}
                </div>
                <div v-if="messages[3].time" class="message-time">
                  {{ messages[3].time }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="message-input-container">
          <div class="input-wrapper">
            <div class="camera-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007AFF">
                <circle cx="12" cy="12" r="3" stroke-width="2"/>
                <path d="M20 4h-3.17l-1.24-1.35A2 2 0 0014.12 2H9.88a2 2 0 00-1.47.65L7.17 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" stroke-width="2"/>
              </svg>
            </div>
            <div class="message-input">
              <span class="placeholder">iMessage</span>
            </div>
            <div class="app-store-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007AFF">
                <rect x="4" y="4" width="16" height="16" rx="2" stroke-width="2"/>
                <path d="M12 8v8M8 12h8" stroke-width="2"/>
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
import { chatSections } from '@/data/chatSections';
gsap.registerPlugin(ScrollTrigger);

interface Props {
  sectionId: string;
}

const props = defineProps<Props>();

// Get the messages from chatSections
const messages = chatSections[0].messages;

const messageStates = ref(messages.map(() => 'hidden'));
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
      scrub: 0.5,
      pinSpacing: true,
    },
  });

  messages.forEach((_, index) => {
    // Typing indicator sequence
    timeline
      .fromTo(`.message-typing-${index}`,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.1 }
      )
      .to({}, { 
        duration: 0.2,
        onStart: () => {
          messageStates.value[index] = 'typing';
        }
      })
      .to(`.message-typing-${index}`, { 
        opacity: 0,
        duration: 0.1,
        onComplete: () => {
          messageStates.value[index] = 'shown';
        }
      })
      .fromTo(`.message-${index}`,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.1 }
      )
      // Small pause between messages
      .to({}, { duration: 0.1 });
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
  box-shadow: 
    0 50px 100px -20px rgba(0,0,0,0.25),
    0 30px 60px -30px rgba(0,0,0,0.3),
    inset 0 -2px 6px 0 rgba(255,255,255,0.1);
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

.phone-header {
  height: 90px;
  background: #fff;
  position: relative;
  border-bottom: 1px solid #e5e5e5;
  z-index: 2;
}

.status-bar {
  height: 44px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.status-icons {
  display: flex;
  gap: 5px;
  align-items: center;
}

.chat-header {
  height: 45px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.contact-avatar {
  width: 30px;
  height: 30px;
  background: #e5e5e5;
  border-radius: 15px;
}

.contact-name {
  font-weight: 600;
  font-size: 16px;
}

.messages-container {
  flex: 1;
  position: relative;
  background: #fff;
  overflow: hidden;
}

.messages-viewport {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
}

.messages-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message-sequence {
  position: relative;
}

.message {
  max-width: 80%;
  position: relative;
}

.message.sent {
  margin-left: auto;
}

.message.received {
  margin-right: auto;
}

.message-content {
  padding: 12px 16px;
  border-radius: 20px;
  font-size: 0.95rem;
  line-height: 1.4;
  position: relative;
}

.message-time {
  font-size: 0.75rem;
  color: #8e8e93;
  margin-top: 4px;
  margin-bottom: 8px;
}

.message-input-container {
  flex-shrink: 0;
  height: 60px;
  background: #fff;
  border-top: 1px solid #e5e5e5;
  padding: 8px 16px;
  position: relative;
  z-index: 2;
}

.input-wrapper {
  background: #e5e5ea;
  border-radius: 20px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin: 0 5px;
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
}

.camera-button, .app-store-button {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
}

.typing-animation {
  padding: 8px 12px;
  border-radius: 16px;
  background: #e5e5ea;
  display: flex;
  align-items: center;
  gap: 4px;
  width: 40px;
}

.sent .typing-animation {
  background: #007AFF;
  margin-left: auto;
}

.typing-animation span {
  width: 4px;
  height: 4px;
  background: #8e8e93;
  border-radius: 50%;
  animation: typing 0.6s infinite;
  display: inline-block;
}

.sent .typing-animation span {
  background: rgba(255, 255, 255, 0.7);
}

.typing-animation span:nth-child(2) {
  animation-delay: 0.1s;
}

.typing-animation span:nth-child(3) {
  animation-delay: 0.2s;
}

@keyframes typing {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.hide {
  display: none;
}

.typing-indicator {
  position: relative;
  opacity: 0;
}

.typing-indicator.sent {
  margin-left: auto;
}

.typing-indicator.received {
  margin-right: auto;
}

@media (prefers-color-scheme: dark) {
  .phone-inner {
    background: #000;
  }
  
  .phone-header,
  .messages-container,
  .message-input-container {
    background: #000;
  }

  .contact-name {
    color: #fff;
  }

  .received .message-content {
    background: #262629;
    color: #fff;
  }

  .input-wrapper {
    background: #262629;
  }

  .typing-animation {
    background: #262629;
  }
  
  .typing-animation span {
    background: #8e8e93;
  }
}
</style> 