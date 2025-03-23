<template>
  <section class="sticky-scroll-section" ref="sectionRef">
    <div 
      class="sticky-container" 
      ref="stickyContainerRef"
      :style="{ backgroundColor: backgroundColor }"
    >
      <div class="phone-container">
        <div class="phone-header">
          <div class="phone-notch"></div>
        </div>
        <div class="chat-container">
          <div class="messages-container">
            <div 
              v-for="(message, index) in visibleMessages" 
              :key="index"
              class="message"
              :class="{ 
                'message-left': index % 2 === 0, 
                'message-right': index % 2 === 1 
              }"
              :style="{ 
                opacity: message.opacity,
                transform: `translateY(${message.translateY}px)`
              }"
            >
              <div class="message-content">
                <slot :name="`message-${index}`">
                  <h3>Message {{ index + 1 }}</h3>
                  <p>Content for message {{ index + 1 }}</p>
                </slot>
              </div>
              <div class="message-time">{{ formatTime(index) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import { rafThrottle } from '@/utils/scroll/performance.ts';

const props = defineProps({
  title: {
    type: String,
    default: 'Conversation'
  },
  startColor: {
    type: String,
    default: 'var(--theme-background, #ffffff)'
  },
  endColor: {
    type: String,
    default: 'var(--theme-primary-light, #f0f0ff)'
  },
  totalMessages: {
    type: Number,
    default: 50
  }
});

const sectionRef = ref<HTMLElement | null>(null);
const stickyContainerRef = ref<HTMLElement | null>(null);
const scrollProgress = ref(0);
const backgroundColor = ref(props.startColor);

// Create array of message objects
const messages = reactive(Array(props.totalMessages).fill(null).map((_, i) => ({
  id: i,
  opacity: 0,
  translateY: 20
})));

// Only show messages that should be visible based on scroll progress
const visibleMessages = computed(() => {
  // Calculate which message should be the latest one visible
  const messageIndex = Math.min(
    props.totalMessages - 1, 
    Math.floor(scrollProgress.value * props.totalMessages)
  );
  
  // Show fewer messages to make each scroll step more noticeable
  // Only show 3 messages at a time
  const startIndex = Math.max(0, messageIndex - 2);
  const endIndex = messageIndex + 1;
  
  console.log(`Showing messages from index ${startIndex} to ${messageIndex} (total: ${endIndex - startIndex})`);
  
  return messages.slice(startIndex, endIndex);
});

// Format time for message timestamp (just for visual effect)
function formatTime(index: number) {
  const minutes = Math.floor(index * 2) % 60;
  const hours = 9 + Math.floor(index / 30);
  return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
}

// Smooth color interpolation
function interpolateColor(color1: string, color2: string, factor: number) {
  // For CSS variables, we'll just do a simple crossfade
  if (color1.startsWith('var(') || color2.startsWith('var(')) {
    return factor < 0.5 ? color1 : color2;
  }
  
  // Convert hex to RGB
  const hex2rgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };
  
  // If colors are hex format
  if (color1.startsWith('#') && color2.startsWith('#')) {
    const rgb1 = hex2rgb(color1);
    const rgb2 = hex2rgb(color2);
    
    const r = Math.round(rgb1[0] + factor * (rgb2[0] - rgb1[0]));
    const g = Math.round(rgb1[1] + factor * (rgb2[1] - rgb1[1]));
    const b = Math.round(rgb1[2] + factor * (rgb2[2] - rgb1[2]));
    
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  return factor < 0.5 ? color1 : color2;
}

// Use requestAnimationFrame for smoother animations
const handleScroll = rafThrottle(() => {
  if (!sectionRef.value) return;
  
  const rect = sectionRef.value.getBoundingClientRect();
  const sectionHeight = sectionRef.value.offsetHeight;
  const viewportHeight = window.innerHeight;
  
  // Calculate scroll progress (0 to 1)
  const totalScrollDistance = sectionHeight - viewportHeight;
  const scrolled = -rect.top;
  
  // Make the progress more dramatic by using a non-linear mapping
  let newProgress = Math.max(0, Math.min(1, scrolled / totalScrollDistance));
  
  // Apply a stronger easing to make the progress more dramatic
  // This will make the messages change more rapidly throughout the scroll
  newProgress = Math.pow(newProgress, 1.2);
  
  // Only update if progress changed significantly (reduces jitter)
  if (Math.abs(newProgress - scrollProgress.value) > 0.0005) { // More sensitive
    scrollProgress.value = newProgress;
    console.log('Scroll progress:', scrollProgress.value, 'Visible messages:', visibleMessages.value.length);
    
    // Update background color based on scroll progress
    backgroundColor.value = interpolateColor(props.startColor, props.endColor, scrollProgress.value);
    
    // Update message animations
    updateMessages();
  }
});

onMounted(() => {
  // Initialize messages array with the correct number of items
  for (let i = 0; i < props.totalMessages; i++) {
    messages[i] = {
      id: i,
      opacity: 0,
      translateY: 20
    };
  }
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll);
  
  // Initial calculation to set up the correct state
  setTimeout(() => {
    handleScroll();
  }, 100);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// Update message animations based on scroll progress
function updateMessages() {
  // Calculate which message should be the latest one visible
  const visibleCount = Math.min(
    props.totalMessages,
    Math.floor(scrollProgress.value * props.totalMessages) + 1
  );
  
  // Make the scroll steps more dramatic by showing fewer messages
  messages.forEach((message, index) => {
    // Is this message one of the visible ones?
    const isVisible = index < visibleCount && index >= Math.max(0, visibleCount - 3);
    
    // For the most recent message, animate it in
    if (index === visibleCount - 1) {
      const entryProgress = (scrollProgress.value * props.totalMessages) % 1;
      // Make the animation more dramatic with a stronger easing
      const easedProgress = 1 - Math.pow(1 - entryProgress, 2); // Quadratic ease out
      
      message.opacity = easedProgress;
      message.translateY = 30 * (1 - easedProgress); // Larger movement
    } else if (isVisible) {
      // Already visible messages are fully shown
      message.opacity = 1;
      message.translateY = 0;
    } else {
      // Not yet visible messages or old messages that should be hidden
      message.opacity = 0;
      message.translateY = 30; // Larger movement
    }
  });
}
</script>

<style lang="scss" scoped>
.sticky-scroll-section {
  position: relative;
  height: 400vh; // Taller for more dramatic scrolling effect
  width: 100%;
  
  .sticky-container {
    position: sticky;
    top: 0;
    height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.5s ease;
    
    .phone-container {
      width: 375px;
      height: 80vh;
      max-height: 700px;
      background-color: #f8f8f8;
      border-radius: 36px;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      position: relative;
      border: 10px solid #333;
      display: flex;
      flex-direction: column;
      
      .phone-header {
        height: 30px;
        background-color: #333;
        position: relative;
        
        .phone-notch {
          position: absolute;
          width: 150px;
          height: 20px;
          background-color: #333;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
        }
      }
      
      .chat-container {
        flex: 1;
        background-color: #fff;
        padding: 10px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        
        .messages-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          padding: 10px;
          max-height: 100%;
          overflow-y: auto;
        }
        
        .message {
          padding: 0;
          margin-bottom: 16px;
          transition: opacity 0.3s ease, transform 0.3s ease; // Faster transitions
          max-width: 80%;
          
          &:last-child {
            margin-bottom: 0;
          }
          
          .message-content {
            padding: 10px 12px;
            border-radius: 18px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            font-size: 14px;
            
            h3 {
              font-size: 13px;
              margin-bottom: 4px;
              font-weight: 600;
            }
            
            p {
              font-size: 15px;
              margin: 0;
              line-height: 1.3;
            }
          }
          
          .message-time {
            font-size: 11px;
            color: #888;
            margin-top: 2px;
            padding: 0 4px;
          }
        }
        
        .message-left {
          align-self: flex-start;
          
          .message-content {
            background-color: #e9e9eb;
            border-bottom-left-radius: 4px;
          }
          
          .message-time {
            text-align: left;
          }
        }
        
        .message-right {
          align-self: flex-end;
          
          .message-content {
            background-color: #0b93f6;
            color: white;
            border-bottom-right-radius: 4px;
          }
          
          .message-time {
            text-align: right;
          }
        }
      }
    }
  }
}
</style>
