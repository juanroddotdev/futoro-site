<template>
  <div ref="containerRef" class="container" :id="sectionId" :class="position">
    <div ref="phoneContainerRef">
      <FloatingPhone ref="floatingPhoneRef" :tilt-x="tiltX" :tilt-y="tiltY">
        <div v-if="!props.isUnlocked && ambientMode" class="ambient-screen">
          <div class="ambient-time">{{ currentTime }}</div>
          <div class="ambient-date">{{ currentDate }}</div>
          <div class="ambient-notifications">
            <LoadingDots ref="notificationDotsRef" :dots="5" :dotSize="8" :dotSpacing="8"
              :dotColor="'rgba(255, 255, 255, 0.8)'" :duration="0.8" :paused="!isUnlocked" animationStyle="pulse" />
          </div>
        </div>
        <div v-else class="chat-screen">
          <div ref="messagesRef" class="messages-container">
            <template v-for="(message, idx) in messages" :key="`typing-${idx}`">
              <div v-if="showTypingFor.includes(idx)" :class="`typing-container typing-container-${idx + 1}`">
                <TypingIndicator :class="`typing-indicator-${idx + 1}`" :is-sent="message.type === 'sent'" />
              </div>
            </template>

            <template v-for="(message, idx) in messages" :key="`message-${idx}`">
              <div :class="`message-group message-group-${idx + 1}`">
                <div class="message" :class="[
                  message.type === 'sent' ? 'sent' : 'received',
                  `message-${idx + 1}`
                ]">
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
        </div>
      </FloatingPhone>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import TypingIndicator from './TypingIndicator.vue';
import FloatingPhone from './FloatingPhone.vue';
import LoadingDots from './LoadingDots.vue';
import { getCurrentTime } from '@/utils/timestamp';
import {
  applyAmbientPullEffect,
  resetAmbientScreen,
  performUnlockAnimation,
  performRippleUnlockAnimation
} from '@/utils/ambientEffects';

gsap.registerPlugin(ScrollTrigger);

interface Message {
  text: string;
  type: string;
}

interface Props {
  messages: Message[];
  sectionId: string;
  showTypingFor: number[];
  tiltX?: number;
  tiltY?: number;
  position?: 'left' | 'center' | 'right';
  ambientMode?: boolean;
  enablePullEffect?: boolean; // New prop to toggle pull effect
  ambientTheme?: {
    baseColor?: string;
    endColor?: string;
    accentColor?: string;
  };
  pinSettings?: {
    enabled?: boolean;
    start?: string;
    end?: string;
    pinSpacing?: boolean;
    anticipatePin?: number;
  };
  unlockAnimationType?: 'wave' | 'ripple';
  isUnlocked?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  tiltX: 0,
  tiltY: 0,
  position: 'right',
  ambientMode: false,
  enablePullEffect: true,
  ambientTheme: () => ({
    baseColor: '#1a1f2c',
    endColor: '#2E3440',
    accentColor: 'rgba(245, 245, 245, 0.3)'
  }),
  pinSettings: () => ({
    enabled: true,
    start: 'top top',
    end: 'bottom bottom',
    pinSpacing: true,
    anticipatePin: 1
  }),
  unlockAnimationType: 'wave',
  isUnlocked: false
});

const containerRef = ref<HTMLElement | null>(null);
const floatingPhoneRef = ref<InstanceType<typeof FloatingPhone> | null>(null);
const messagesRef = ref<HTMLElement | null>(null);
const phoneContainerRef = ref<HTMLElement | null>(null);
const notificationDotsRef = ref<InstanceType<typeof LoadingDots> | null>(null);


// Control for notification dots animation
const shouldAnimateNotifications = ref(false);

// Add emit for ambient mode toggle
const emit = defineEmits(['update:ambientMode', 'pull-threshold-reached', 'unlock']);

// First, declare the timeline variable
let timeline: gsap.core.Timeline;
let scrollTriggerInstance: ScrollTrigger;

const scrollPosition = ref(0);
const isVisible = ref(false);

// For ambient mode
const currentTime = ref(getCurrentTime());

const currentDate = computed(() => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  return now.toLocaleDateString('en-US', options);
});

// Update time every minute if in ambient mode
let timeInterval: number | null = null;
// Add these imports at the top
const isMaxPullReached = ref(false);
const isRebounding = ref(false);
const lastProgress = ref(0);
const pullThreshold = 0.9; // Threshold to consider max pull reached
const isUnlocked = ref(false);

// Enhanced wave-like rebound animation with matching gradient effects
const triggerReboundAnimation = () => {
  if (notificationDotsRef.value && notificationDotsRef.value.$el) {
    const dotsContainer = notificationDotsRef.value.$el;
    const dots = dotsContainer.querySelectorAll('.loading-dot');
    const ambientScreen = containerRef.value?.querySelector('.ambient-screen') as HTMLElement;
    const chatScreen = containerRef.value?.querySelector('.chat-screen') as HTMLElement;

    if (dots && dots.length > 0 && ambientScreen) {
      console.log('Triggering wave oscillation with gradient effects');

      // Get base and end colors for gradients
      const baseColor = '#1a1f2c'; // Dark blue base
      const endColor = '#2E3440';  // Slightly lighter blue end
      const accentColor = 'rgba(245, 245, 245, 0.3)'; // Light accent for pull effect

      // Reset the container's transform immediately
      gsap.to(dotsContainer, {
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });

      // Create timeline for background gradient animations
      const bgTimeline = gsap.timeline();

      // First phase: Inverted U - gradient from bottom
      bgTimeline.to({}, {
        duration: 0.4,
        onUpdate: function () {
          const progress = this.progress();
          const pullHeight = 40 * progress;
          const pullWidth = 40 * progress;

          // Bottom-up gradient for inverted U shape
          ambientScreen.style.background = `
            radial-gradient(
              ${100 + pullWidth}% ${100 + Math.abs(pullHeight)}% at 50% 100%, 
              ${accentColor} 0%, 
              transparent ${progress * 50}%
            ),
            linear-gradient(135deg, ${baseColor} 0%, ${endColor} 100%)
          `;

          // Add subtle box-shadow to enhance the 3D effect
          ambientScreen.style.boxShadow = `inset 0 -${Math.abs(pullHeight) * 0.5}px ${Math.abs(pullHeight)}px -${Math.abs(pullHeight) * 0.3}px rgba(0,0,0,${progress * 0.3})`;
        }
      });

      // Second phase: U shape - gradient from top
      bgTimeline.to({}, {
        duration: 0.3,
        onUpdate: function () {
          const progress = this.progress();
          const pullHeight = 30 * progress;
          const pullWidth = 30 * progress;

          // Top-down gradient for U shape
          ambientScreen.style.background = `
            radial-gradient(
              ${100 + pullWidth}% ${100 + Math.abs(pullHeight)}% at 50% 0%, 
              ${accentColor} 0%, 
              transparent ${progress * 50}%
            ),
            linear-gradient(135deg, ${baseColor} 0%, ${endColor} 100%)
          `;

          // Add subtle box-shadow to enhance the 3D effect
          ambientScreen.style.boxShadow = `inset 0 ${Math.abs(pullHeight) * 0.5}px ${Math.abs(pullHeight)}px -${Math.abs(pullHeight) * 0.3}px rgba(0,0,0,${progress * 0.3})`;
        }
      });

      // Third phase: Smaller inverted U - gradient from bottom (smaller)
      bgTimeline.to({}, {
        duration: 0.25,
        onUpdate: function () {
          const progress = this.progress();
          const pullHeight = 20 * progress;
          const pullWidth = 20 * progress;

          // Bottom-up gradient for inverted U shape (smaller)
          ambientScreen.style.background = `
            radial-gradient(
              ${100 + pullWidth}% ${100 + Math.abs(pullHeight)}% at 50% 100%, 
              ${accentColor} 0%, 
              transparent ${progress * 50}%
            ),
            linear-gradient(135deg, ${baseColor} 0%, ${endColor} 100%)
          `;

          // Add subtle box-shadow to enhance the 3D effect
          ambientScreen.style.boxShadow = `inset 0 -${Math.abs(pullHeight) * 0.5}px ${Math.abs(pullHeight)}px -${Math.abs(pullHeight) * 0.3}px rgba(0,0,0,${progress * 0.3})`;
        }
      });

      // Fourth phase: Smaller U shape - gradient from top (smaller)
      bgTimeline.to({}, {
        duration: 0.2,
        onUpdate: function () {
          const progress = this.progress();
          const pullHeight = 10 * progress;
          const pullWidth = 10 * progress;

          // Top-down gradient for U shape (smaller)
          ambientScreen.style.background = `
            radial-gradient(
              ${100 + pullWidth}% ${100 + Math.abs(pullHeight)}% at 50% 0%, 
              ${accentColor} 0%, 
              transparent ${progress * 50}%
            ),
            linear-gradient(135deg, ${baseColor} 0%, ${endColor} 100%)
          `;

          // Add subtle box-shadow to enhance the 3D effect
          ambientScreen.style.boxShadow = `inset 0 ${Math.abs(pullHeight) * 0.5}px ${Math.abs(pullHeight)}px -${Math.abs(pullHeight) * 0.3}px rgba(0,0,0,${progress * 0.3})`;
        }
      });

      // Final phase: Return to normal
      bgTimeline.to({}, {
        duration: 0.3,
        onUpdate: function () {
          const progress = 1 - this.progress(); // Reverse progress to fade out
          if (progress < 0.1) {
            // Reset to default background
            ambientScreen.style.background = 'linear-gradient(135deg, #1a1f2c 0%, #2E3440 100%)';
            ambientScreen.style.boxShadow = 'none';
          } else {
            const pullHeight = 5 * progress;
            const pullWidth = 5 * progress;

            // Fade out any remaining gradient
            ambientScreen.style.background = `
              radial-gradient(
                ${100 + pullWidth}% ${100 + Math.abs(pullHeight)}% at 50% 50%, 
                rgba(245, 245, 245, ${progress * 0.1}) 0%, 
                transparent ${progress * 30}%
              ),
              linear-gradient(135deg, ${baseColor} 0%, ${endColor} 100%)
            `;

            // Fade out box shadow
            ambientScreen.style.boxShadow = `inset 0 0 ${Math.abs(pullHeight)}px -${Math.abs(pullHeight) * 0.3}px rgba(0,0,0,${progress * 0.1})`;
          }
        }
      });

      // Create oscillating wave effect for each dot (same as before)
      dots.forEach((dot: HTMLElement, index: number) => {
        const centerIndex = Math.floor((dots.length - 1) / 2);
        const distanceFromCenter = Math.abs(index - centerIndex);
        const maxDistance = Math.max(centerIndex, dots.length - 1 - centerIndex);
        const normalizedDistance = distanceFromCenter / maxDistance;

        // Stagger based on distance from center (center dot moves first)
        const delay = normalizedDistance * 0.1;

        // Create timeline for this dot
        const timeline = gsap.timeline({ delay });

        // First spring back past flat (inverted U-shape)
        timeline.to(dot, {
          y: -20 * (1 - normalizedDistance), // Center dot goes highest
          scaleY: 1.2,
          scaleX: 0.8,
          duration: 0.4,
          ease: "back.out(1.5)"
        });

        // Then spring down past flat (U-shape again but smaller)
        timeline.to(dot, {
          y: 15 * (1 - normalizedDistance),
          scaleY: 0.8,
          scaleX: 1.2,
          duration: 0.3,
          ease: "power2.out"
        });

        // Then spring back up (smaller inverted U)
        timeline.to(dot, {
          y: -10 * (1 - normalizedDistance),
          scaleY: 1.1,
          scaleX: 0.9,
          duration: 0.25,
          ease: "power2.out"
        });

        // Then spring down (smaller U)
        timeline.to(dot, {
          y: 5 * (1 - normalizedDistance),
          scaleY: 0.9,
          scaleX: 1.1,
          duration: 0.2,
          ease: "power2.out"
        });

        // Finally return to normal with slight elastic effect
        timeline.to(dot, {
          y: 0,
          scaleY: 1,
          scaleX: 1,
          duration: 0.3,
          ease: "elastic.out(1, 0.3)"
        });
      });
      bgTimeline.call(() => {
        // Get direct references to elements instead of using selectors
        const chatScreen = containerRef.value?.querySelector('.chat-screen') as HTMLElement;
        const ambientScreen = containerRef.value?.querySelector('.ambient-screen') as HTMLElement;
        console.log('Animation complete, showing chat screen chatScreen:', chatScreen);
  if (chatScreen) chatScreen.style.display = 'block';
  if (ambientScreen) ambientScreen.style.display = 'none';
  
  // First, ensure we've updated the isUnlocked state
  isUnlocked.value = true;
  
  // Emit unlock event immediately to ensure parent components update
  emit('unlock');
  
  // Wait for Vue to update the DOM with the new content
  nextTick(() => {
    setTimeout(() => {
      // Get fresh references to elements after DOM update
      const messagesContainer = containerRef.value?.querySelector('.messages-container');
      console.log('Chat screen elements after update:', {
        chatScreen: containerRef.value?.querySelector('.chat-screen'),
        messagesContainer,
        hasChildren: messagesContainer ? messagesContainer.children.length > 0 : false
      });
        // If we have a messages container, make sure it's visible
        if (messagesContainer) {
        gsap.to(messagesContainer, {
          opacity: 1,
          duration: 0.3
        });
        
        // Try to animate any direct children
        if (messagesContainer.children.length > 0) {
          gsap.to(messagesContainer.children, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.1,
            delay: 0.1
          });
        }
      }
       // Use direct element reference instead of selector
       if (chatScreen) {
        gsap.set(chatScreen, { display: 'block', opacity: 1 });
      }
      const sectionSelector = `#${props.sectionId}`;
      console.log('Looking for message elements after unlock in section:', sectionSelector);
      
      // Try to find any content in the chat screen
      const chatScreenElement = containerRef.value?.querySelector('.chat-screen');
      // const messagesContainer = containerRef.value?.querySelector('.messages-container');
      
      console.log('Chat screen elements:', {
        chatScreen: chatScreenElement,
        messagesContainer,
        hasChildren: messagesContainer ? messagesContainer.children.length > 0 : false
      });
      
      // If we have a messages container, make sure it's visible
      if (messagesContainer) {
        gsap.to(messagesContainer, {
          opacity: 1,
          duration: 0.3
        });
        
        // Try to animate any direct children
        if (messagesContainer.children.length > 0) {
          gsap.to(messagesContainer.children, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.1,
            delay: 0.1
          });
        }
      }
      
      // Force render any message elements that might appear
      gsap.set(`${sectionSelector} .chat-screen`, { display: 'block', opacity: 1 });
      
    }, 200); // Longer delay to ensure DOM updates
  });
});

      // Reset rebound flag after animation completes
      setTimeout(() => {
        isRebounding.value = false;
        // Ensure background is reset
        ambientScreen.style.background = 'linear-gradient(135deg, #1a1f2c 0%, #2E3440 100%)';
        ambientScreen.style.boxShadow = 'none';
      }, 2000);
    }
  }
}; // Define setupScrollAnimation function
const setupScrollAnimation = () => {
  const container = containerRef.value;
  if (!container) {
    return;
  }

  // Reset function to set initial state
  const resetState = () => {
    // Only hide messages if not in ambient mode
    if (!props.ambientMode) {
      const sectionSelector = `#${props.sectionId}`;

      // Check if message groups exist before setting styles
      const messageGroups = document.querySelectorAll(`${sectionSelector} .message-group`);
      if (messageGroups.length > 0) {
        gsap.set(messageGroups, {
          opacity: 0,
          y: 20,
          force3D: true
        });
      }

      // Check if typing containers exist before setting styles
      const typingContainers = document.querySelectorAll(`${sectionSelector} .typing-container`);
      if (typingContainers.length > 0) {
        gsap.set(typingContainers, {
          opacity: 0,
          y: 20,
          force3D: true
        });
      }
    }
  };

  // Create timeline with ScrollTrigger
  timeline = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: props.pinSettings.start,
      end: props.pinSettings.end || `+=${props.messages.length * 50}%`,
      scrub: 0.5,
      pin: props.pinSettings.enabled,
      pinSpacing: props.pinSettings.enabled ? props.pinSettings.pinSpacing : false,
      anticipatePin: props.pinSettings.enabled ? props.pinSettings.anticipatePin : 0,
      onEnter: () => {
        // Show first message only when scrolling begins
        if (props.messages.length > 0 && !props.ambientMode) {
          const sectionSelector = `#${props.sectionId}`;
          const firstGroup = `${sectionSelector} .message-group-1`;
          gsap.to(firstGroup, { opacity: 1, y: 0, duration: 0.3 });
        }
      },
      onEnterBack: () => {
        resetState();
        // Show first message when scrolling back into view
        if (props.messages.length > 0 && !props.ambientMode) {
          const sectionSelector = `#${props.sectionId}`;
          const firstGroup = `${sectionSelector} .message-group-1`;
          gsap.to(firstGroup, { opacity: 1, y: 0, duration: 0.3 });
        }
      },
      onUpdate: (self: ScrollTrigger) => {
        // Add these variables after other refs

        // Inside the onUpdate callback, after calculating progress
        // Replace the existing detection code with this improved version
        if (self.progress > pullThreshold && !isMaxPullReached.value && !isRebounding.value) {
          console.log('MAX PULL REACHED - TRIGGERING SPRING/BOUNCE:', self.progress.toFixed(3));
          isMaxPullReached.value = true;
          isRebounding.value = true;

          // Emit the event to notify parent
          emit('pull-threshold-reached');

          // Trigger the unlock animation based on the animation type
          if (props.unlockAnimationType === 'wave') {
            triggerReboundAnimation();

            // Add this: After animation, update local state and emit unlock event
            setTimeout(() => {
              emit('unlock');
            }, 1000); // Wait for animation to complete before unlocking
          } else if (props.unlockAnimationType === 'ripple') {
            const ambientScreen = containerRef.value?.querySelector('.ambient-screen') as HTMLElement;
            performRippleUnlockAnimation(ambientScreen, containerRef.value);
            setTimeout(() => {
              emit('unlock');
            }, 1000); // Adjust timing to match animation duration);
          }
        }

        // Always keep animations paused
        shouldAnimateNotifications.value = false;

        // Add U-shaped pull-down effect for dots based on scroll progress
        if (self.progress > 0.5 && props.ambientMode) {
          // Add U-shaped pull-down effect for dots based on scroll progress
          if (notificationDotsRef.value && notificationDotsRef.value.$el) {
            const maxOffset = 40; // Increased from 20 to 40 for more downward movement
            const maxScale = 1.5; // Maximum scale factor for middle dot
            const progress = Math.min(1, Math.max(0, (self.progress - 0.5) * 2)); // Normalize to 0-1

            // Get all dots in the container
            const dotsContainer = notificationDotsRef.value.$el;
            const dots = dotsContainer.querySelectorAll('.loading-dot');

            if (dots && dots.length > 0) {
              // Calculate center position
              const centerIndex = Math.floor((dots.length - 1) / 2);

              // Move the entire dots container down slightly to enhance the pulling effect
              dotsContainer.style.transform = `translateY(${progress * 15}px)`;

              // Find the ambient-screen element directly
              const ambientScreen = containerRef.value?.querySelector('.ambient-screen');
              if (ambientScreen) {
                // Calculate center position for reference (same as used for dots)
                const centerIndex = Math.floor((dots.length - 1) / 2);

                // Get the middle dot's offset to match background pull with dots
                const dotPosition = 0.5; // Middle position (0.5 is center of 0-1 range)
                const middleDotOffset = Math.sin(dotPosition * Math.PI) * maxOffset * progress;

                // Scale the pull height based on the middle dot's movement
                const pullHeight = middleDotOffset * 1.5; // Scale factor to make it visually match
                const pullWidth = progress * 40; // Width of the pull effect

                // Get theme-based colors for the gradient
                let baseColor = '#1a1f2c';
                let endColor = '#2E3440';

                // // Set colors based on current theme
                // if (currentTheme?.value === 'theme-neon-horizon') {
                //   baseColor = '#1a1b26';
                //   endColor = '#2E3440';
                // } else if (currentTheme?.value === 'theme-digital-sunset') {
                //   baseColor = '#2E3440';
                //   endColor = '#4C566A';
                // } else if (currentTheme?.value === 'theme-retro-wave') {
                //   baseColor = '#0f0f17';
                //   endColor = '#1A1A1A';
                // } else if (currentTheme?.value === 'theme-pastel-future') {
                //   baseColor = '#f8f9fa';
                //   endColor = '#e5e5ea';
                // }

                // Create a radial gradient that simulates pulling from the top center
                // Use chat screen background color (#f5f5f5) instead of red
                const gradientColor = progress > 0.9
                  ? `rgba(245, 245, 245, ${(progress - 0.9) * 10})` // #f5f5f5 as rgba
                  : 'transparent';

                // Calculate the gradient position based on the middle dot movement
                const gradientPosition = 50 + (middleDotOffset / 2); // Adjust center position slightly

                // Apply custom background with pull-down effect synchronized with dots
                (ambientScreen as HTMLElement).style.background = `
                  radial-gradient(
                    ${100 + pullWidth}% ${100 + Math.abs(pullHeight)}% at ${gradientPosition}% 0%, 
                    ${gradientColor} 0%, 
                    transparent ${progress * 50}%
                  ),
                  linear-gradient(135deg, ${baseColor} 0%, ${endColor} 100%)
                `;

                // Add a subtle box-shadow to enhance the 3D effect, matched to dot movement
                (ambientScreen as HTMLElement).style.boxShadow = progress > 0.3
                  ? `inset 0 ${Math.abs(pullHeight) * 0.5}px ${Math.abs(pullHeight)}px -${Math.abs(pullHeight) * 0.3}px rgba(0,0,0,${progress * 0.3})`
                  : 'none';

                // Add transition for smoother effect
                (ambientScreen as HTMLElement).style.transition = 'box-shadow 0.2s ease';
              }

              // Apply different offsets and scales to each dot
              dots.forEach((dot: { style: { transform: string; boxShadow: string; }; }, index: number) => {
                // Calculate U-shaped offset (middle dot gets pulled down most)
                const dotPosition = index / (dots.length - 1); // 0 to 1
                const uShapeOffset = Math.sin(dotPosition * Math.PI) * maxOffset * progress;

                // Calculate scale based on distance from center
                const distanceFromCenter = Math.abs(index - centerIndex);
                const maxDistance = Math.max(centerIndex, dots.length - 1 - centerIndex);
                const scaleFactor = 1 - (distanceFromCenter / maxDistance) * 0.5 * progress;

                // Add slight rotation to enhance the pulling effect
                const rotationAngle = (index - centerIndex) * -2 * progress; // negative angle for outer dots

                // Apply transform - more vertical offset, variable scale, and slight rotation
                dot.style.transform = `translateY(${uShapeOffset}px) scale(${scaleFactor}) rotate(${rotationAngle}deg)`;

                // Add subtle shadow to enhance 3D effect
                dot.style.boxShadow = progress > 0.3 ? `0 ${uShapeOffset * 0.1}px ${uShapeOffset * 0.2}px rgba(0,0,0,${progress * 0.2})` : 'none';
              });
            }
          }
        } else if (self.progress <= 0.5) {
          shouldAnimateNotifications.value = false;

          // Reset dots position when scrolling back up
          if (notificationDotsRef.value && notificationDotsRef.value.$el) {
            const dotsContainer = notificationDotsRef.value.$el;
            dotsContainer.style.transform = 'translateY(0)';

            // Reset ambient screen background
            const ambientScreen = containerRef.value?.querySelector('.ambient-screen');
            if (ambientScreen) {
              (ambientScreen as HTMLElement).style.background = 'linear-gradient(135deg, #1a1f2c 0%, #2E3440 100%)';
              (ambientScreen as HTMLElement).style.boxShadow = 'none';
              (ambientScreen as HTMLElement).style.transition = '';
            }

            const dots = dotsContainer.querySelectorAll('.loading-dot');
            if (dots && dots.length > 0) {
              dots.forEach((dot: { style: { transform: string; boxShadow: string; }; }) => {
                dot.style.transform = 'translateY(0) scale(1) rotate(0deg)';
                dot.style.boxShadow = 'none';
              });
            }
          }
        }
      },
      immediateRender: true
    }
  });

  // Store the ScrollTrigger instance for cleanup
  scrollTriggerInstance = timeline.scrollTrigger as ScrollTrigger;

  // Modify selectors to be scoped to this section
  const sectionSelector = `#${props.sectionId}`;
  // Check if messages exist before creating animations
  if (props.messages.length === 0) {
    return;
  }

  // Don't show first message immediately - wait for scroll to begin

  const MESSAGE_OFFSET = 100;

  props.messages.forEach((_, idx) => {
    const currentGroup = `${sectionSelector} .message-group-${idx + 1}`;
    // Check if element exists before animating
    const currentGroupEl = document.querySelector(currentGroup);
    if (!currentGroupEl) {
      return; // Skip this animation if element doesn't exist
    }

    if (idx > 0) {
      const previousGroups = [];
      // Collect only existing elements
      for (let i = 0; i < idx; i++) {
        const el = document.querySelector(`${sectionSelector} .message-group-${i + 1}`);
        if (el) previousGroups.push(el);
      }

      if (previousGroups.length > 0) {
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
    }

    if (props.showTypingFor.includes(idx)) {
      const typingContainer = `${sectionSelector} .typing-container-${idx + 1}`;
      // Check if typing container exists
      const typingEl = document.querySelector(typingContainer);
      if (typingEl) {
        timeline
          .to(typingEl, {
            opacity: 1,
            duration: 0.15,
            ease: "power1.out"
          })
          .to({}, { duration: 0.3 })
          .to(typingEl, {
            opacity: 0,
            duration: 0.15,
            ease: "power1.in"
          });
      }
    }

    timeline.to(currentGroupEl, {
      opacity: 1,
      duration: 0.2,
      ease: "power1.out"
    })
      .to({}, { duration: 0.3 });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        scrollPosition.value = 0;  // Reset scroll position
      } else {
        isVisible.value = false;
      }
    });
  }, {
    threshold: 0.1
  });

  if (containerRef.value) {
    observer.observe(containerRef.value);
  }

  return () => observer.disconnect();
};

onMounted(() => {
  if (props.ambientMode) {
    timeInterval = window.setInterval(() => {
      currentTime.value = getCurrentTime();
    }, 60000); // Update every minute
  }

  // Initialize with notifications paused
  shouldAnimateNotifications.value = false;

  // Hide all messages immediately on mount, but only if not in ambient mode
  if (!props.ambientMode) {
    const sectionSelector = `#${props.sectionId}`;

    // Check if elements exist before applying GSAP
    const messageGroups = document.querySelectorAll(`${sectionSelector} .message-group`);
    if (messageGroups.length > 0) {
      gsap.set(messageGroups, {
        opacity: 0,
        y: 20,
        force3D: true
      });
    }

    const typingContainers = document.querySelectorAll(`${sectionSelector} .typing-container`);
    if (typingContainers.length > 0) {
      gsap.set(typingContainers, {
        opacity: 0,
        y: 20,
        force3D: true
      });
    }
  }

  // Then continue with setup
  nextTick(() => {
    setupScrollAnimation();
  });
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }

  // Clean up ScrollTrigger
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill();
  }
  if (timeline) {
    timeline.kill();
  }
});

// Watch for changes to ambientMode prop
watch(() => props.ambientMode, (newValue) => {
  if (newValue && !timeInterval) {
    currentTime.value = getCurrentTime(); // Update immediately when switching to ambient mode
    timeInterval = window.setInterval(() => {
      currentTime.value = getCurrentTime();
    }, 60000);
  } else if (!newValue && timeInterval) {
    clearInterval(timeInterval);
    timeInterval = null;
  }

  // Reset notification animation state when toggling ambient mode
  if (!newValue) {
    shouldAnimateNotifications.value = false;
  }

  // Re-setup scroll animation when ambient mode changes
  nextTick(() => {
    // Kill existing ScrollTrigger
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
    }
    if (timeline) {
      timeline.kill();
    }

    // Setup new ScrollTrigger
    setupScrollAnimation();
  });
});

// Watch for changes to enablePullEffect prop
watch(() => props.enablePullEffect, () => {
  if (props.ambientMode) {
    const ambientScreen = containerRef.value?.querySelector('.ambient-screen') as HTMLElement;
    resetAmbientScreen(
      ambientScreen,
      props.ambientTheme.baseColor,
      props.ambientTheme.endColor
    );
  }
});

// Watch for changes to ambientTheme prop
watch(() => props.ambientTheme, () => {
  if (props.ambientMode) {
    const ambientScreen = containerRef.value?.querySelector('.ambient-screen') as HTMLElement;
    resetAmbientScreen(
      ambientScreen,
      props.ambientTheme.baseColor,
      props.ambientTheme.endColor
    );
  }
}, { deep: true });

// Add this watch to respond to isUnlocked changes
watch(() => props.isUnlocked, (newValue) => {
  if (newValue) {
    // Force update the UI when unlocked
    nextTick(() => {
      const chatScreen = containerRef.value?.querySelector('.chat-screen') as HTMLElement;
      if (chatScreen) {
        chatScreen.style.display = 'block';
      }

      const ambientScreen = containerRef.value?.querySelector('.ambient-screen') as HTMLElement;
      if (ambientScreen) {
        ambientScreen.style.display = 'none';
      }
    });
  }
});
</script>

<style lang="scss" scoped>
.container {
  padding: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: relative;

  &.left {
    justify-content: flex-start;

    :deep(.floating-container) {
      margin: 0;
      position: absolute;
      left: 0;
      transform: translateX(-25%);
    }
  }

  &.right {
    justify-content: flex-end;

    :deep(.floating-container) {
      margin: 0;
      position: absolute;
      right: 0;
      transform: translateX(25%);
    }
  }

  &.center {
    justify-content: center;
    padding: 0 40px;

    :deep(.floating-container) {
      margin: 0 auto;
    }
  }
}

.ambient-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: linear-gradient(135deg, #1a1f2c 0%, #2E3440 100%);
  color: white;
  padding: 20px;
  text-align: center;

  .ambient-time {
    font-size: 3.5rem;
    font-weight: 300;
    margin-bottom: 0.5rem;
  }

  .ambient-date {
    font-size: 1rem;
    opacity: 0.8;
    margin-bottom: 2rem;
  }

  .ambient-notifications {
    display: flex;
    justify-content: center;
    min-height: 20px; // Ensure space is reserved even when dots are not visible
  }
}

.chat-screen {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f5f5;
}

.messages-container {
  flex: 1;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.message-group {
  position: absolute;
  bottom: 80px;
  left: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  will-change: transform;
  margin-bottom: 16px;
}

.typing-container {
  position: absolute;
  bottom: 80px;
  left: 20px;
  right: 20px;
  opacity: 0;
}

.message {
  max-width: 80%;
  padding-bottom: 8px;

  &.sent {
    margin-left: auto;
    margin-right: 0;
  }

  &.received {
    margin-right: auto;
    margin-left: 0;
  }

  &-content {
    padding: 12px 16px;
    border-radius: 20px;
    font-size: 16px;
    line-height: 1.4;
  }
}

.sent .message-content {
  background: linear-gradient(135deg, #007aff, #0063cc);
  color: white;
  border-bottom-right-radius: 4px;
}

.received .message-content {
  background: linear-gradient(135deg, #e5e5ea, #d1d1d6);
  color: black;
  border-bottom-left-radius: 4px;
}

.message-input-container {
  padding: 10px 15px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.input-wrapper {
  background: white;
  border-radius: 20px;
  padding: 10px 15px;
}

.message-input {
  width: 100%;
  min-height: 24px;
}

.placeholder {
  color: #8e8e93;
  font-size: 16px;
}

.futoro {
  font-weight: bold;
  color: #007aff;
  margin-right: 4px;
}
</style>
