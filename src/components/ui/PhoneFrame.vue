<template>
  <div class="phone-frame-container">
    <svg class="phone-frame" :class="`tilt-${tiltDirection}`" viewBox="0 0 320 650" xmlns="http://www.w3.org/2000/svg">
      <!-- Phone Outer Shell with subtle gradient -->
      <linearGradient id="phoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" :stop-color="shellGradientStart" />
        <stop offset="100%" :stop-color="shellGradientEnd" />
      </linearGradient>
      <rect x="10" y="10" width="300" height="630" rx="30" fill="url(#phoneGradient)" />
      
      <!-- Phone Inner Screen with subtle gradient -->
      <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" :stop-color="screenGradientStart" />
        <stop offset="100%" :stop-color="screenGradientEnd" />
      </linearGradient>
      <rect x="20" y="50" width="280" height="550" rx="5" fill="url(#screenGradient)" />
      
      <!-- Phone Notch -->
      <rect x="120" y="20" width="80" height="15" rx="7.5" fill="#0a0a0a" />
      
      <!-- Phone Camera -->
      <circle cx="140" cy="27.5" r="5" fill="#333" />
      <circle cx="140" cy="27.5" r="2" fill="#555" />
      
      <!-- Phone Speaker -->
      <rect x="155" y="25" width="40" height="5" rx="2.5" fill="#333" />
      
      <!-- Home Button with subtle gradient -->
      <linearGradient id="buttonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#444" />
        <stop offset="100%" stop-color="#333" />
      </linearGradient>
      <circle cx="160" cy="620" r="15" fill="url(#buttonGradient)" />
      
      <!-- Phone Edge Highlight -->
      <rect x="10" y="10" width="300" height="630" rx="30" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
    </svg>
    
    <!-- Chat content inside the phone -->
    <div v-if="chatMessages && chatMessages.length" class="phone-content chat-content">
      <div class="chat-header">
        <h3>{{ chatTitle }}</h3>
      </div>
      <div class="messages">
        <div 
          v-for="(message, index) in chatMessages" 
          :key="index" 
          class="message" 
          :class="message.type"
        >
          <p v-html="message.text"></p>
          <span v-if="message.time" class="time">{{ message.time }}</span>
        </div>
      </div>
      <div v-if="showChatInput" class="chat-input">
        <input type="text" placeholder="Type a message..." />
        <button>Send</button>
      </div>
    </div>
    
    <!-- Slot for custom content -->
    <slot v-if="!chatMessages || !chatMessages.length"></slot>
  </div>
</template>

<script setup lang="ts">
interface ChatMessage {
  text: string;
  type: 'sent' | 'received';
  time?: string;
}

interface Props {
  shellGradientStart?: string;
  shellGradientEnd?: string;
  screenGradientStart?: string;
  screenGradientEnd?: string;
  showCamera?: boolean;
  showSpeaker?: boolean;
  showHomeButton?: boolean;
  tiltDirection?: 'left' | 'right' | 'none';
  // Chat props
  chatMessages?: ChatMessage[];
  chatTitle?: string;
  showChatInput?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  shellGradientStart: '#2a2a2a',
  shellGradientEnd: '#1a1a1a',
  screenGradientStart: '#ffffff',
  screenGradientEnd: '#f5f5f7',
  showCamera: true,
  showSpeaker: true,
  showHomeButton: true,
  tiltDirection: 'none',
  chatMessages: () => [],
  chatTitle: 'Chat',
  showChatInput: true
});
</script>

<style lang="scss" scoped>
.phone-frame-container {
  position: relative;
  width: 320px;
  height: 650px;
  margin: 0 auto;
}

.phone-frame {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  z-index: 1;
  filter: drop-shadow(5px 15px 25px rgba(0, 0, 0, 0.4));
  transform-style: preserve-3d;
  transform-origin: center center;
  transition: transform 0.5s ease;
  
  // Base styles without tilt
  &.tilt-none {
    transform: rotateY(0deg) rotateX(0deg) rotateZ(0deg);
    
    &:hover {
      transform: rotateY(0deg) rotateX(0deg) rotateZ(0deg);
    }
  }
  
  // Left tilt
  &.tilt-left {
    transform: rotateY(-10deg) rotateX(5deg) rotateZ(-2deg);
    
    &:hover {
      transform: rotateY(-8deg) rotateX(3deg) rotateZ(-1deg);
    }
  }
  
  // Right tilt
  &.tilt-right {
    transform: rotateY(10deg) rotateX(5deg) rotateZ(2deg);
    
    &:hover {
      transform: rotateY(8deg) rotateX(3deg) rotateZ(1deg);
    }
  }
}

.phone-content {
  position: absolute;
  top: 50px;
  left: 20px;
  width: 280px;
  height: 550px;
  z-index: 2;
  background-color: #f5f5f7;
  border-radius: 8px;
  overflow-y: auto;
}

.chat-content {
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 15px;
  background-color: #3498db;
  color: white;
  text-align: center;
  border-radius: 8px 8px 0 0;
}

.messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  max-width: 70%;
  padding: 10px;
  border-radius: 10px;
  
  &.sent {
    align-self: flex-end;
    background-color: #dcf8c6;
  }
  
  &.received {
    align-self: flex-start;
    background-color: #ffffff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  p {
    margin: 0;
  }
}

.time {
  font-size: 0.7rem;
  opacity: 0.7;
  display: block;
  text-align: right;
  margin-top: 5px;
}

.chat-input {
  display: flex;
  padding: 10px;
  background-color: #f0f0f0;
  border-top: 1px solid #ddd;
  
  input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 20px;
    margin-right: 8px;
  }
  
  button {
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 8px 15px;
    cursor: pointer;
    
    &:hover {
      background-color: #2980b9;
    }
  }
}
</style>
