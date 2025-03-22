<template>
  <section class="scroll-text-section" :id="sectionId" ref="sectionRef">
    <!-- <h2 class="section-title">{{ title }}</h2> -->
    
    <!-- Phone frame overlay fixed to section -->
    <div class="phone-frame-overlay">
      <div class="phone-notch"></div>
      <div class="phone-home-indicator"></div>
      <div class="phone-frame">
        <!-- Status bar with phone icons -->
        <div class="phone-status-bar">
          <div class="status-time">9:41</div>
          <div class="status-icons">
            <div class="status-icon signal">
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 8H2V11H1V8Z" fill="#333"/>
                <path d="M5 6H6V11H5V6Z" fill="#333"/>
                <path d="M9 4H10V11H9V4Z" fill="#333"/>
                <path d="M13 2H14V11H13V2Z" fill="#333"/>
              </svg>
            </div>
            <div class="status-icon wifi">
              <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 10.5C8.32843 10.5 9 9.82843 9 9C9 8.17157 8.32843 7.5 7.5 7.5C6.67157 7.5 6 8.17157 6 9C6 9.82843 6.67157 10.5 7.5 10.5Z" fill="#333"/>
                <path d="M1 3.5C3.5 1 7.5 1 7.5 1C7.5 1 11.5 1 14 3.5" stroke="#333" stroke-width="1.5"/>
                <path d="M3 5.5C4.5 4 7.5 4 7.5 4C7.5 4 10.5 4 12 5.5" stroke="#333" stroke-width="1.5"/>
              </svg>
            </div>
            <div class="status-icon battery">
              <svg width="25" height="12" viewBox="0 0 25 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="#333"/>
                <rect x="2" y="2" width="18" height="8" rx="1" fill="#333"/>
                <path d="M23 4V8C23.8047 7.66122 24.328 6.87313 24.328 6C24.328 5.12687 23.8047 4.33878 23 4Z" fill="#333"/>
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Chat header -->
        <div class="chat-header">
          <h3>{{ title }}</h3>
        </div>
      </div>
      <div class="phone-frame"></div>
    </div>
    
    <!-- Scrollable messages that appear through the phone frame -->
    <div class="messages-container">
      <div class="messages-list">
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          class="message-item"
          :class="[
            message.type === 'sent' ? 'message-item--sent' : 'message-item--received',
            index < visibleMessageCount ? 'message-item--visible' : ''
          ]"
        >
          <div class="message-header" v-if="message.type === 'received'">
            {{ clientLabel }}
          </div>
          <div class="message-content">
            {{ message.text }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Conversation'
  },
  messages: {
    type: Array,
    default: () => []
  },
  sectionId: {
    type: String,
    default: 'scroll-text'
  },
  clientLabel: {
    type: String,
    default: 'Client:'
  }
});

const visibleMessageCount = ref(0);
const sectionRef = ref(null);

function handleScroll() {
  if (!sectionRef.value) return;
  
  const messageElements = document.querySelectorAll(`#${props.sectionId} .message-item`);
  if (!messageElements.length) return;
  
  const windowHeight = window.innerHeight;
  
  // Reset visible count first
  visibleMessageCount.value = 0;
  
  // Check each message element's position
  messageElements.forEach((element, index) => {
    const rect = element.getBoundingClientRect();
    
    // If element is in viewport (with some buffer)
    if (rect.top < windowHeight * 0.85 && rect.bottom > 0) {
      if (visibleMessageCount.value < index + 1) {
        visibleMessageCount.value = index + 1;
      }
    }
  });
  
  // Update phone frame position
  updatePhonePosition();
}

function updatePhonePosition() {
  if (!sectionRef.value) return;
  
  const sectionRect = sectionRef.value.getBoundingClientRect();
  const phoneOverlay = document.querySelector(`#${props.sectionId} .phone-frame-overlay`);
  
  if (!phoneOverlay) return;
  
  // Only show phone when section is in viewport
  if (sectionRect.top < window.innerHeight && sectionRect.bottom > 0) {
    phoneOverlay.style.display = 'block';
    
    // Calculate position relative to section, not viewport
    const sectionHeight = sectionRect.height;
    const phoneHeight = 700; // Phone height in px
    
    // Center phone in visible portion of section
    const visibleSectionTop = Math.max(0, sectionRect.top);
    const visibleSectionBottom = Math.min(window.innerHeight, sectionRect.bottom);
    const visibleSectionCenter = (visibleSectionTop + visibleSectionBottom) / 2;
    
    // Calculate offset from section top to keep phone centered in visible area
    const offsetFromSectionTop = visibleSectionCenter - sectionRect.top - (phoneHeight / 2);
    
    // Constrain to section bounds with some padding
    const maxOffset = sectionHeight - phoneHeight - 20;
    const clampedOffset = Math.max(20, Math.min(offsetFromSectionTop, maxOffset));
    
    phoneOverlay.style.position = 'absolute';
    phoneOverlay.style.top = `${clampedOffset}px`;
    phoneOverlay.style.transform = 'translateX(-50%)';
  } else {
    phoneOverlay.style.display = 'none';
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  // Initial calculation
  setTimeout(handleScroll, 100);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.scroll-text-section {
  padding: 2rem 1rem;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  min-height: 100vh;
  overflow: hidden; /* Prevent phone from affecting other sections */
}

.section-title {
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2rem;
  color: #333;
}

/* Phone frame overlay */
.phone-frame-overlay {
  position: absolute; /* Changed from sticky to absolute */
  left: 50%;
  width: 375px;
  height: 700px;
  transform: translateX(-50%); /* Center horizontally */
  border-radius: 40px;
  pointer-events: none;
  z-index: 10;
}

/* Mask to hide content outside the phone */
.phone-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 9;
  border-radius: 40px;
  /* Remove the mask that extends beyond the phone */
}

.phone-frame {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 40px;
  box-shadow: inset 0 0 0 10px #1a1a1a, 0 12px 30px rgba(0, 0, 0, 0.2);
  z-index: 11;
}

.phone-notch {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 30px;
  background-color: #1a1a1a;
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
  z-index: 12;
}

.phone-home-indicator {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 5px;
  background-color: #1a1a1a;
  border-radius: 3px;
  z-index: 12;
}

/* Phone status bar */
.phone-status-bar {
  position: absolute;
  top: 5px;
  left: 0;
  /* width: 100%; */
  padding: 10px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 13;
  min-width: 296px;
  background-color: #f5f5f7;
  margin: 0 0 0 10px;
  border-radius: 40px;
  
}

.status-time {
  font-size: 12px;
  font-weight: 600;
  color: #333;
}

.status-icons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.status-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Chat header positioning - moved down to account for status bar */
.chat-header {
  position: absolute;
  top: 35px; /* Position below the notch and status bar */
  left: 0;
  width: 100%;
  padding: 0 20px;
  background-color: #f5f5f7;
  z-index: 12;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  width: 325px;
}

/* Container for messages that scrolls normally */
.messages-container {
  width: 375px;
  margin: 0 auto;
  padding: 160px 0 40px;
  background-color: #f5f5f7;
  border-radius: 40px;
  min-height: 700px;
  position: relative; /* Ensure proper stacking */
  z-index: 1; /* Below the phone frame */
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0 15px;
}

.message-item {
  max-width: 80%;
  padding: 1rem;
  border-radius: 1rem;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message-item--visible {
  opacity: 1;
  transform: translateY(0);
}

.message-item--sent {
  align-self: flex-end;
  background-color: #0084ff;
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.message-item--received {
  align-self: flex-start;
  background-color: #e5e5ea;
  color: #333;
  border-bottom-left-radius: 0.25rem;
}

.message-header {
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  opacity: 0.8;
}

.message-content {
  line-height: 1.4;
  font-size: 1rem;
}
</style>
