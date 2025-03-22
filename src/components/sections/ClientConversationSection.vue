<template>
  <section class="narrative-section" :data-section-id="sectionId">
    <div class="sticky-container">
      <div class="container mx-auto px-4">
        <div class="phone-container mx-auto">
          <!-- Phone SVG Frame with custom chat content -->
          <PhoneFrame :tiltDirection="tiltDirection">
            <div class="narrative-chat" ref="chatContainer">
              <!-- Dynamic Chat Section based on conversationType -->
              <ChatSection
                :title="sectionTitle"
                :messages="chatMessages"
                :sectionId="sectionId"
                :clientLabel="clientLabel || 'Client:'"
                ref="chatSectionRef"
              />
            </div>
          </PhoneFrame>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, nextTick, onUnmounted } from 'vue';
import PhoneFrame from '@/components/ui/PhoneFrame.vue';
import ChatSection from '@/components/chat/ChatSection.vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollTracker } from '@/utils/scroll/core/ScrollTracker';
import { 
  getVisionToRealitySteps, 
  getCommonFrustrationsSteps,
  getPersonalApproachSteps,
  getCollaborationProcessSteps,
  convertStepsToMessages,
  type ChatMessage
} from '@/data/chatSections';

gsap.registerPlugin(ScrollTrigger);

// Add props for customization
interface Props {
  tiltDirection?: 'left' | 'right' | 'none';
  conversationType?: 'vision' | 'frustration' | 'approach' | 'process' | 'custom';
  customMessages?: ChatMessage[];
  sectionTitle?: string;
  sectionId?: string;
  clientLabel?: string;
  sectionHeight?: string; // Control the height of the scrollable section
  scrollMultiplier?: number; // Add a multiplier to control scroll distance
}

const props = withDefaults(defineProps<Props>(), {
  tiltDirection: 'left',
  conversationType: 'vision',
  customMessages: () => [],
  sectionTitle: '',
  sectionId: 'chat',
  clientLabel: 'Client:',
  sectionHeight: '150vh', // Default height to allow for scrolling
  scrollMultiplier: 1 // Default multiplier
});

const chatContainer = ref<HTMLElement | null>(null);
const chatSectionRef = ref<InstanceType<typeof ChatSection> | null>(null);
const currentMessageIndex = ref(0);
const totalMessages = ref(0);

// Initialize the message variables
const visionMessages = computed(() => convertStepsToMessages(getVisionToRealitySteps()));
const frustrationMessages = computed(() => convertStepsToMessages(getCommonFrustrationsSteps()));
const approachMessages = computed(() => convertStepsToMessages(getPersonalApproachSteps()));
const processMessages = computed(() => convertStepsToMessages(getCollaborationProcessSteps()));

// Determine which set of messages to use based on conversationType
const chatMessages = computed(() => {
  console.log(`Getting messages for type: ${props.conversationType}`);
  if (props.customMessages && props.customMessages.length > 0) {
    console.log(`Using custom messages: ${props.customMessages.length}`);
    return props.customMessages;
  }
  
  switch (props.conversationType) {
    case 'vision':
      console.log(`Using vision messages: ${visionMessages.value.length}`);
      return visionMessages.value;
    case 'frustration':
      console.log(`Using frustration messages: ${frustrationMessages.value.length}`);
      return frustrationMessages.value;
    case 'approach':
      console.log(`Using approach messages: ${approachMessages.value.length}`);
      return approachMessages.value;
    case 'process':
      console.log(`Using process messages: ${processMessages.value.length}`);
      return processMessages.value;
    default:
      console.log(`No matching message type, using empty array`);
      return [];
  }
});

// Convert vh to pixels for GSAP
function vhToPx(vh: number): number {
  return (vh * window.innerHeight) / 100;
}

// Add a computed property for dynamic section height
const dynamicSectionHeight = computed(() => {
  // Base height plus additional height per message
  const baseHeight = 150; // vh
  const heightPerMessage = 20; // vh per message
  const totalHeight = (baseHeight + (chatMessages.value.length * heightPerMessage)) * props.scrollMultiplier;
  return totalHeight; // Return as number, not string
});

// Initialize GSAP animations
onMounted(() => {
  nextTick(() => {
    console.log(`Initializing ScrollTrigger for section: ${props.sectionId}`);
    
    // Get the sticky container element
    const stickyContainer = document.querySelector(`.narrative-section[data-section-id="${props.sectionId}"] .sticky-container`);
    if (!stickyContainer) {
      console.error(`Sticky container not found for section: ${props.sectionId}`);
      return;
    }
    
    // Set total messages for scroll calculation
    totalMessages.value = chatMessages.value.length;
    
    // Calculate appropriate section height based on message count
    const sectionHeightVh = props.sectionId === 'vision-intro' 
      ? dynamicSectionHeight.value 
      : (parseFloat(props.sectionHeight) || dynamicSectionHeight.value);
    
    // Convert vh to pixels for GSAP
    const sectionHeightPx = vhToPx(sectionHeightVh);
    
    console.log(`Set section height to ${sectionHeightVh}vh (${sectionHeightPx}px) for ${props.sectionId}`);
    
    // Set the CSS variable for styling
    const section = document.querySelector(`.narrative-section[data-section-id="${props.sectionId}"]`);
    if (section) {
      section.style.setProperty('--section-height', `${sectionHeightVh}vh`);
    }
    
    // Get all message elements for this section
    const messageElements = document.querySelectorAll(`.narrative-section[data-section-id="${props.sectionId}"] .message`);
    
    // Set initial state for all messages
    gsap.set(messageElements, { autoAlpha: 0, y: 20 });

    // Create a single ScrollTrigger for the entire animation sequence
    ScrollTrigger.create({
      trigger: `.narrative-section[data-section-id="${props.sectionId}"]`,
      start: 'top 20%', // Start earlier - when the top of the section reaches 20% from the top of viewport
      end: `+=${sectionHeightPx}px`, // Use pixels explicitly
      pin: true,
      pinSpacing: true,
      markers: process.env.NODE_ENV === 'development',
      id: props.sectionId,
      onEnter: () => {
        console.log(`Section ${props.sectionId} entered`);
        gsap.to(stickyContainer, {
          backgroundColor: 'rgba(25, 25, 112, 0.8)',
          duration: 0.5
        });
        
        // Show first message immediately on enter
        if (messageElements.length > 0) {
          gsap.to(messageElements[0], { 
            autoAlpha: 1, 
            y: 0, 
            duration: 0.3
          });
        }
      },
      onLeaveBack: () => {
        console.log(`Section ${props.sectionId} left (going back)`);
        gsap.to(stickyContainer, {
          backgroundColor: 'rgba(0, 0, 0, 0)',
          duration: 0.5
        });
      },
      onUpdate: (self) => {
        // Calculate how many messages should be visible based on scroll progress
        const progress = self.progress;
        const messagesToShow = Math.ceil(totalMessages.value * progress);
        
        // Show messages up to the calculated index
        for (let i = 0; i < messagesToShow && i < messageElements.length; i++) {
          if (messageElements[i].style.opacity < 0.5) {
            gsap.to(messageElements[i], { 
              autoAlpha: 1, 
              y: 0, 
              duration: 0.3,
              delay: i === 0 ? 0 : 0.1 // Small delay for staggered effect
            });
          }
        }
        
        // Hide messages when scrolling back up
        for (let i = messagesToShow; i < messageElements.length; i++) {
          if (messageElements[i].style.opacity > 0.5) {
            gsap.to(messageElements[i], { 
              autoAlpha: 0, 
              y: 20, 
              duration: 0.2
            });
          }
        }
      }
    });
  });
});

// Clean up ScrollTrigger instances on component unmount
onUnmounted(() => {
  // Find and destroy any ScrollTrigger instances for this section
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.vars.id && trigger.vars.id.includes(props.sectionId)) {
      trigger.kill();
    }
  });
});

// Remove the duplicate section height setting
// onMounted(() => {
//   nextTick(() => {
//     const section = document.querySelector(`.narrative-section[data-section-id="${props.sectionId}"]`);
//     if (section) {
//       section.style.setProperty('--section-height', props.sectionHeight);
//       console.log(`Set section height to ${props.sectionHeight} for ${props.sectionId}`);
//     }
//   });
// }); // Removed
</script>

<style lang="scss" scoped>
.narrative-section {
  height: var(--section-height, 150vh);
  position: relative;
}

.sticky-container {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: background-color 0.5s ease, transform 0.3s ease;
  will-change: transform, background-color;
}

.container {
  width: 100%;
  height: auto; // Let it size to content
}

.phone-container {
  position: relative;
  z-index: 20; /* Ensure phone is above other elements */
  max-width: 360px;
  margin: 0 auto;
  transform: translateZ(0); /* Force hardware acceleration */
  will-change: transform;
}

.narrative-chat {
  height: 100%;
  overflow-y: auto; /* Changed from hidden to auto to enable scrolling */
  position: relative;
  z-index: 30; /* Ensure chat content is visible */
  transform: translateZ(0); /* Force hardware acceleration */
  will-change: transform;
  display: flex;
  flex-direction: column;
}

:deep(.message) {
  visibility: hidden; /* Start hidden */
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s, transform 0.3s, visibility 0s 0.3s;
  will-change: opacity, transform, visibility;
  z-index: 40;
  
  &.visible {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.3s, transform 0.3s, visibility 0s;
  }
}
</style>
