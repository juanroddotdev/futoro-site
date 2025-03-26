<template>
  <div class="playground">
    <div class="controls">
      <div class="control-group buttons">
        <button 
          class="toggle-button" 
          :class="{ active: activeView === 'transform' }"
          @click="activeView = 'transform'"
        >
          Transform
        </button>
        <button 
          class="toggle-button" 
          :class="{ active: activeView === 'chat' }"
          @click="activeView = 'chat'"
        >
          Chat
        </button>
      </div>
      
      <!-- Transform controls (show only when transform view is active) -->
      <div v-if="activeView === 'transform'" class="transform-controls">
        <div class="control-group buttons">
          <button 
            class="toggle-button" 
            :class="{ active: is3D }"
            @click="is3D = !is3D"
          >
            {{ is3D ? '3D View' : '2D View' }}
          </button>
          <button 
            class="toggle-button" 
            :class="{ active: isOpaque }"
            @click="isOpaque = !isOpaque"
          >
            {{ isOpaque ? 'Opaque' : 'Transparent' }}
          </button>
          <button 
            class="toggle-button" 
            :class="{ active: isPhone }"
            @click="isPhone = !isPhone"
          >
            {{ isPhone ? 'Phone' : 'Cube' }}
          </button>
        </div>

        <div class="control-group">
          <h3>Rotate</h3>
          <label>X: {{ rotateX }}deg
            <input type="range" v-model="rotateX" min="-180" max="180" />
          </label>
          <label>Y: {{ rotateY }}deg
            <input type="range" v-model="rotateY" min="-180" max="180" />
          </label>
          <label>Z: {{ rotateZ }}deg
            <input type="range" v-model="rotateZ" min="-180" max="180" />
          </label>
        </div>
        
        <div class="control-group">
          <h3>Translate</h3>
          <label>X: {{ translateX }}px
            <input type="range" v-model="translateX" min="-200" max="200" />
          </label>
          <label>Y: {{ translateY }}px
            <input type="range" v-model="translateY" min="-200" max="200" />
          </label>
          <label>Z: {{ translateZ }}px
            <input type="range" v-model="translateZ" min="-200" max="200" />
          </label>
        </div>

        <div class="control-group">
          <h3>Perspective: {{ perspective }}px</h3>
          <input type="range" v-model="perspective" min="100" max="2000" />
        </div>

        <div class="control-group">
          <h3>Phone Tilt</h3>
          <label>Tilt X: {{ tiltX }}deg
            <input type="range" v-model="tiltX" min="-45" max="45" />
          </label>
          <label>Tilt Y: {{ tiltY }}deg
            <input type="range" v-model="tiltY" min="-45" max="45" />
          </label>
        </div>
      </div>

      <!-- Chat controls (show only when chat view is active) -->
      <div v-if="activeView === 'chat'" class="chat-controls">
        <div class="control-group">
          <h3>Chat Settings</h3>
          <button @click="addMessage('sent')">Add Sent Message</button>
          <button @click="addMessage('received')">Add Received Message</button>
          <button @click="toggleTyping">Toggle Typing</button>
          <button @click="clearMessages">Clear Messages</button>
        </div>
        
        <div class="control-group">
          <h3>Message Text</h3>
          <input 
            type="text" 
            v-model="newMessageText" 
            placeholder="Enter message text"
            @keyup.enter="addMessage(newMessageType)"
          />
          <div class="radio-group">
            <label>
              <input type="radio" v-model="newMessageType" value="sent"> Sent
            </label>
            <label>
              <input type="radio" v-model="newMessageType" value="received"> Received
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="viewport" :style="viewportStyle">
      <!-- Show transform view -->
      <div v-if="activeView === 'transform'">
        <div v-if="isPhone" class="element phone">
          <FloatingPhone 
            :tilt-x="tiltX"
            :tilt-y="tiltY"
          >
            <div class="phone-inner">
              <div class="status-bar">
                <div class="notch">
                  <div class="notch-content"></div>
                </div>
                <div class="status-bar-content">
                  <span>9:41</span>
                  <div class="right-items">
                    <span>5G</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
              <div class="content">
                <!-- Phone content here -->
              </div>
            </div>
          </FloatingPhone>
        </div>

        <div v-else class="element cube" :style="elementStyle">
          <div 
            v-for="face in faces" 
            :key="face.name"
            class="face"
            :class="[
              face.name, 
              { 
                hidden: !is3D && face.name !== 'front',
                opaque: isOpaque
              }
            ]"
          >
            {{ face.name }}
          </div>
        </div>
      </div>
      
      <!-- Show chat view -->
      <div v-if="activeView === 'chat'" class="chat-view">
        <ChatScreen 
          :messages="chatMessages" 
          :showTypingFor="typingIndicators"
          :sectionId="'playground-chat'"
          :tiltX="tiltX"
          :tiltY="tiltY"
          :pinSettings="{
            enabled: true,
            start: 'top top',
            end: `+=${chatMessages.length * 50}%`,
            pinSpacing: true,
            anticipatePin: 1
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import FloatingPhone from '@/components/FloatingPhone.vue';
import ChatScreen from '@/components/ChatScreen.vue';

const is3D = ref(true);
const isOpaque = ref(false);
const isPhone = ref(false);
const rotateX = ref(0);
const rotateY = ref(0);
const rotateZ = ref(0);
const translateX = ref(0);
const translateY = ref(0);
const translateZ = ref(0);
const perspective = ref(1000);
const tiltX = ref(8);
const tiltY = ref(-20);

const faces = [
  { name: 'front' },
  { name: 'back' },
  { name: 'left' },
  { name: 'right' },
  { name: 'top' },
  { name: 'bottom' }
];

const viewportStyle = computed(() => ({
  perspective: is3D.value ? `${perspective.value}px` : 'none'
}));

const elementStyle = computed(() => ({
  transform: `
    translateX(${translateX.value}px)
    translateY(${translateY.value}px)
    translateZ(${is3D.value ? translateZ.value : 0}px)
    rotateX(${is3D.value ? rotateX.value : 0}deg)
    rotateY(${is3D.value ? rotateY.value : 0}deg)
    rotateZ(${rotateZ.value}deg)
  `,
  transformStyle: is3D.value ? 'preserve-3d' as const : 'flat' as const
}));

const generatedCSS = computed(() => `
.element {
  transform: translateX(${translateX.value}px)
             translateY(${translateY.value}px)
             translateZ(${translateZ.value}px)
             rotateX(${rotateX.value}deg)
             rotateY(${rotateY.value}deg)
             rotateZ(${rotateZ.value}deg);
}

.viewport {
  perspective: ${perspective.value}px;
}`);

// New refs for chat functionality
const activeView = ref('transform'); // 'transform' or 'chat'
const chatMessages = ref([
  { text: 'Hello! How can I help you today?', type: 'received' },
  { text: 'I need help with my Vue project.', type: 'sent' }
]);
const typingIndicators = ref<number[]>([]);
const newMessageText = ref('');
const newMessageType = ref('sent');

// Chat functions
const addMessage = (type: string) => {
  if (!newMessageText.value.trim() && type !== 'typing') return;
  
  const messageIndex = chatMessages.value.length;
  
  // Add typing indicator first if it's a received message
  if (type === 'received') {
    typingIndicators.value.push(messageIndex);
    setTimeout(() => {
      // Remove typing indicator after 1.5 seconds
      typingIndicators.value = typingIndicators.value.filter(idx => idx !== messageIndex);
      // Then add the actual message
      chatMessages.value.push({ 
        text: newMessageText.value || 'This is a sample received message.', 
        type: 'received' 
      });
      newMessageText.value = '';
    }, 1500);
  } else {
    // Add sent message immediately
    chatMessages.value.push({ 
      text: newMessageText.value || 'This is a sample sent message.', 
      type: 'sent' 
    });
    newMessageText.value = '';
  }
};

const toggleTyping = () => {
  const lastIndex = chatMessages.value.length - 1;
  if (typingIndicators.value.includes(lastIndex)) {
    typingIndicators.value = typingIndicators.value.filter(idx => idx !== lastIndex);
  } else {
    typingIndicators.value.push(lastIndex);
  }
};

const clearMessages = () => {
  chatMessages.value = [];
  typingIndicators.value = [];
};
</script>

<style lang="scss" scoped>
.playground {
  display: grid;
  grid-template-columns: 300px 1fr;
  min-height: 100vh;
  gap: 20px;
  padding: 20px;
  background: #1a1a1a;
  color: #fff;
  padding-top: 100px;
}

.controls {
  background: #2a2a2a;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  h3 {
    margin: 0;
    color: #7c7c7c;
  }
  
  label {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  input[type="range"] {
    width: 100%;
  }
}

.control-group.buttons {
  flex-direction: row;
  gap: 10px;
  
  .toggle-button {
    flex: 1;
  }
}

.generated-css {
  pre {
    background: #333;
    padding: 15px;
    border-radius: 4px;
    font-size: 14px;
    white-space: pre-wrap;
  }
}

.viewport {
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
}

.element {
  width: 200px;
  height: 200px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
}

.face {
  position: absolute;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &.front { 
    transform: translateZ(100px); 
    background: rgba(0, 255, 0, 0.2); 
  }
  &.back { 
    transform: translateZ(-100px) rotateY(180deg); 
    background: rgba(255, 0, 0, 0.2); 
  }
  &.left { 
    transform: translateX(-100px) rotateY(-90deg); 
    background: rgba(0, 0, 255, 0.2); 
  }
  &.right { 
    transform: translateX(100px) rotateY(90deg); 
    background: rgba(255, 255, 0, 0.2); 
  }
  &.top { 
    transform: translateY(-100px) rotateX(90deg); 
    background: rgba(255, 0, 255, 0.2); 
  }
  &.bottom { 
    transform: translateY(100px) rotateX(-90deg); 
    background: rgba(0, 255, 255, 0.2); 
  }

  &.opaque {
    backface-visibility: hidden;
    
    &.front { 
      background: rgb(0, 255, 0);
      border-color: rgba(0, 0, 0, 0.2);
    }
    &.back { 
      background: rgb(255, 0, 0);
      border-color: rgba(0, 0, 0, 0.2);
    }
    &.left { 
      background: rgb(0, 0, 255);
      border-color: rgba(0, 0, 0, 0.2);
    }
    &.right { 
      background: rgb(255, 255, 0);
      border-color: rgba(0, 0, 0, 0.2);
    }
    &.top { 
      background: rgb(255, 0, 255);
      border-color: rgba(0, 0, 0, 0.2);
    }
    &.bottom { 
      background: rgb(0, 255, 255);
      border-color: rgba(0, 0, 0, 0.2);
    }
  }

  &:not(.opaque) {
    backface-visibility: visible;
    background: rgba(255, 255, 255, 0.1);
  }
}

.face {
  &.hidden {
    display: none;
  }
}

.toggle-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background: #333;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #444;
  }
  
  &.active {
    background: #007AFF;
  }
}

.phone {
  width: min(375px, 90vw);
  height: min(812px, 80vh);
  aspect-ratio: 375 / 812;
  transform-style: preserve-3d;
  
  :deep(.phone-inner) {
    position: absolute;
    top: min(12px, 3.2vw);
    left: min(12px, 3.2vw);
    right: min(12px, 3.2vw);
    bottom: min(12px, 3.2vw);
    background: #f5f5f5;
    border-radius: min(44px, 11.7vw);
    overflow: hidden;
  }

  .phone-frame {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #1a1a1a;
    border-radius: min(52px, 13.8vw);
    transform-style: preserve-3d;
    overflow: hidden;
    
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 50%,
        rgba(255, 255, 255, 0.1) 100%
      );
      border-radius: min(52px, 13.8vw);
      z-index: 1;
    }
  }

  .volume-up,
  .volume-down,
  .power-button {
    position: absolute;
    width: min(4px, 1.1vw);
    border-radius: min(2px, 0.5vw);
    background: #2a2a2a;
    z-index: 2;
  }

  .volume-up {
    height: min(40px, 10.6vw);
    left: min(-2px, -0.5vw);
    top: min(120px, 32vw);
  }

  .volume-down {
    height: min(40px, 10.6vw);
    left: min(-2px, -0.5vw);
    top: min(180px, 48vw);
  }

  .power-button {
    height: min(60px, 16vw);
    right: min(-2px, -0.5vw);
    top: min(140px, 37.3vw);
  }

  .phone-shadow {
    position: absolute;
    width: 90%;
    height: min(20px, 5.3vw);
    bottom: min(-50px, -13.3vw);
    left: 5%;
    background: rgba(0, 0, 0, 0.2);
    filter: blur(min(20px, 5.3vw));
    border-radius: 50%;
    transform: rotateX(90deg) translateZ(-20px);
  }

  .status-bar {
    height: min(47px, 12.5vw);
    background: #f5f5f5;
    position: relative;
    z-index: 10;
  }

  .notch {
    position: absolute;
    width: 50%;
    height: min(30px, 8vw);
    background: black;
    left: 50%;
    transform: translateX(-50%);
    border-bottom-left-radius: min(24px, 6.4vw);
    border-bottom-right-radius: min(24px, 6.4vw);
  }

  .status-bar-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: min(14px, 3.7vw) min(20px, 5.3vw);
    color: black;
    font-size: min(14px, 3.7vw);
    font-weight: 600;
  }
}

.cube {
  width: 200px;
  height: 200px;
}

.chat-view {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  border-radius: 12px;
  overflow: hidden;
}

.chat-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  .radio-group {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
  }
  
  input[type="text"] {
    width: 100%;
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
  
  button {
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }
}
</style>
