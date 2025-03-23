<template>
  <div class="floating-container">
    <div 
      class="floating-phone"
      :style="{
        '--tilt-x': `${tiltX}deg`,
        '--tilt-x-hover': `${tiltX - 2}deg`,
        '--tilt-y': `${tiltY}deg`,
        '--tilt-y-hover': `${tiltY - 2}deg`,
      }"
    >
      <!-- Phone frame/casing -->
      <div class="phone-frame">
        <!-- Side buttons -->
        <div class="volume-up"></div>
        <div class="volume-down"></div>
        <div class="power-button"></div>
      </div>
      
      <!-- Main screen -->
      <div class="phone-inner">
        <!-- Status Bar -->
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
        
        <!-- Content Area -->
        <div class="content">
          <slot></slot>
        </div>
      </div>

      <!-- Phone shadow -->
      <div class="phone-shadow"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
  tiltX?: number;
  tiltY?: number;
}

const props = withDefaults(defineProps<Props>(), {
  tiltX: -12,  // Default X rotation
  tiltY: -15   // Default Y rotation
});

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

onMounted(() => {
  timeInterval = window.setInterval(() => {
    currentTime.value = formatTime(new Date());
  }, 60000);
});

onUnmounted(() => {
  if (timeInterval !== null) {
    clearInterval(timeInterval);
  }
});
</script>

<style scoped>
.floating-container {
  perspective: 2000px;
  padding: 60px;
}

.floating-phone {
  position: relative;
  width: 375px;
  height: 812px;
  margin: 0 auto;
  transform-style: preserve-3d;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: 
      rotateX(var(--tilt-x)) 
      rotateY(var(--tilt-y)) 
      translateZ(0) 
      translateY(0);
  }
  50% {
    transform: 
      rotateX(var(--tilt-x-hover)) 
      rotateY(var(--tilt-y-hover)) 
      translateZ(30px) 
      translateY(-15px);
  }
}

/* Phone frame/casing */
.phone-frame {
  position: absolute;
  width: calc(100% + 24px);
  height: calc(100% + 24px);
  left: -12px;
  top: -12px;
  background: #1a1a1a;
  border-radius: 52px;
  transform: translateZ(-12px);
  transform-style: preserve-3d;
}

/* Side buttons */
.volume-up {
  position: absolute;
  width: 4px;
  height: 40px;
  background: #2a2a2a;
  left: -2px;
  top: 120px;
  border-radius: 2px;
  transform: translateZ(2px);
}

.volume-down {
  position: absolute;
  width: 4px;
  height: 40px;
  background: #2a2a2a;
  left: -2px;
  top: 180px;
  border-radius: 2px;
  transform: translateZ(2px);
}

.power-button {
  position: absolute;
  width: 4px;
  height: 60px;
  background: #2a2a2a;
  right: -2px;
  top: 140px;
  border-radius: 2px;
  transform: translateZ(2px);
}

.phone-inner {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  border-radius: 44px;
  overflow: hidden;
  transform: translateZ(0);
  transform-style: preserve-3d;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Phone shadow */
.phone-shadow {
  position: absolute;
  width: 90%;
  height: 20px;
  bottom: -50px;
  left: 5%;
  background: rgba(0, 0, 0, 0.2);
  filter: blur(20px);
  border-radius: 50%;
  transform: rotateX(90deg) translateZ(-20px);
  animation: shadow 6s ease-in-out infinite;
}

@keyframes shadow {
  0%, 100% {
    transform: rotateX(90deg) translateZ(-20px) scale(1);
    opacity: 0.4;
  }
  50% {
    transform: rotateX(90deg) translateZ(-20px) scale(0.85);
    opacity: 0.2;
  }
}

/* Bezel shine effect */
.phone-frame::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 52px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%,
    rgba(255, 255, 255, 0.1) 100%
  );
  transform: translateZ(1px);
}

/* Side edges */
.phone-inner::before {
  content: '';
  position: absolute;
  width: 11px;
  background: #1a1a1a;
  left: -11px;
  top: 0;
  bottom: 0;
  transform-origin: right;
  transform: rotateY(-90deg);
}

.phone-inner::after {
  content: '';
  position: absolute;
  height: 11px;
  background: #1a1a1a;
  left: -11px;
  right: 0;
  bottom: -11px;
  transform-origin: top;
  transform: rotateX(-90deg);
}

/* Status bar styles */
.status-bar {
  position: relative;
  height: 47px;
  background: #f5f5f5;
  z-index: 10;
  transform: translateZ(0.1px);
  border-top-left-radius: 44px;
  border-top-right-radius: 44px;
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

.content {
  height: calc(100% - 47px);
  background: #f5f5f5;
  position: relative;
  transform: translateZ(0.1px);
}
</style> 