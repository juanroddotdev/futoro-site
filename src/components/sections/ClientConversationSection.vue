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
}

const props = withDefaults(defineProps<Props>(), {
  tiltDirection: 'left',
  conversationType: 'vision',
  customMessages: () => [],
  sectionTitle: '',
  sectionId: 'chat',
  clientLabel: 'Client:',
  sectionHeight: '150vh' // Default height to allow for scrolling
});

const chatContainer = ref<HTMLElement | null>(null);
const chatSectionRef = ref<InstanceType<typeof ChatSection> | null>(null);
const currentMessageIndex = ref(0);
const totalMessages = ref(0);

// Determine which messages to use based on conversationType
const chatMessages = computed(() => {
  if (props.conversationType === 'custom' && props.customMessages.length > 0) {
    return props.customMessages;
  }
  
  switch (props.conversationType) {
    case 'vision':
      return convertStepsToMessages(getVisionToRealitySteps());
    case 'frustration':
      return convertStepsToMessages(getCommonFrustrationsSteps());
    case 'approach':
      return convertStepsToMessages(getPersonalApproachSteps());
    case 'process':
      return convertStepsToMessages(getCollaborationProcessSteps());
    default:
      return convertStepsToMessages(getVisionToRealitySteps());
  }
});

// Initialize GSAP animations
onMounted(() => {
  nextTick(() => {
    // Get the sticky container element
    const stickyContainer = document.querySelector(`.narrative-section[data-section-id="${props.sectionId}"] .sticky-container`);
    if (!stickyContainer) return;
    
    // Set total messages for scroll calculation
    totalMessages.value = chatMessages.value.length;
    
    // Hide all messages initially
    const messageElements = document.querySelectorAll(`.narrative-section[data-section-id="${props.sectionId}"] .message`);
    gsap.set(messageElements, { autoAlpha: 0, y: 20 });
    
    // Create ScrollTrigger for pinning the entire section
    const pinTrigger = ScrollTrigger.create({
      trigger: `.narrative-section[data-section-id="${props.sectionId}"]`,
      start: 'top top', // Start pinning when section reaches top of viewport
      end: `+=${props.sectionHeight}`, // Pin for the duration of sectionHeight
      pin: true,
      pinSpacing: true, // Ensure proper spacing
      markers: true,
      id: props.sectionId,
      onEnter: () => {
        // Change background when section sticks to viewport
        gsap.to(stickyContainer, {
          backgroundColor: 'rgba(25, 25, 112, 0.8)', // Dark blue when pinned
          duration: 0.5
        });
      },
      onLeaveBack: () => {
        // Revert background when unpinned (scrolling back up)
        gsap.to(stickyContainer, {
          backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent
          duration: 0.5
        });
      },
      onLeave: () => {
        // Ensure smooth exit when scrolling past the section
        gsap.to(stickyContainer, {
          y: 0,
          duration: 0.3
        });
      }
    });
    
    // Create a separate ScrollTrigger for the middle-of-viewport color change
    // and to start the message animations
    const midpointTrigger = ScrollTrigger.create({
      trigger: `.narrative-section[data-section-id="${props.sectionId}"] .phone-container`,
      start: 'top center', // When phone container reaches middle of viewport
      end: 'bottom center',
      id: `${props.sectionId}-midpoint`,
      markers: false,
      onEnter: () => {
        // Change background when phone reaches middle of viewport
        gsap.to(stickyContainer, {
          backgroundColor: 'rgba(139, 0, 139, 0.5)', // Purple when in middle
          duration: 0.5
        });
        
        // Show the first message when we reach the middle
        if (messageElements[0]) {
          gsap.to(messageElements[0], { 
            autoAlpha: 1, 
            y: 0, 
            duration: 0.5 
          });
          currentMessageIndex.value = 1;
        }
      },
      onLeave: () => {
        // Change back when phone passes middle (if not pinned yet)
        if (!pinTrigger.isActive) {
          gsap.to(stickyContainer, {
            backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent
            duration: 0.5
          });
        }
      },
      onEnterBack: () => {
        // Change to purple again when scrolling back up
        gsap.to(stickyContainer, {
          backgroundColor: 'rgba(139, 0, 139, 0.5)', // Purple when in middle
          duration: 0.5
        });
      },
      onLeaveBack: () => {
        // Change back when scrolling up past middle
        gsap.to(stickyContainer, {
          backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent
          duration: 0.5
        });
        
        // Hide all messages when scrolling back up past the trigger point
        gsap.to(messageElements, { 
          autoAlpha: 0, 
          y: 20, 
          duration: 0.3,
          stagger: 0.1
        });
        currentMessageIndex.value = 0;
      }
    });
    
    // Create a ScrollTrigger to reveal messages as user scrolls
    ScrollTrigger.create({
      trigger: `.narrative-section[data-section-id="${props.sectionId}"]`,
      start: 'top top',
      end: `+=${props.sectionHeight}`,
      id: `${props.sectionId}-messages`,
      markers: false,
      onUpdate: (self) => {
        // Only start revealing messages after the midpoint trigger is active
        if (!midpointTrigger.isActive) return;
        
        // Calculate how many messages should be visible based on scroll progress
        // Skip the first message which is already shown by the midpoint trigger
        const progress = self.progress;
        const messagesToShow = Math.ceil((totalMessages.value - 1) * progress) + 1;
        
        // Show messages up to the calculated index
        for (let i = currentMessageIndex.value; i < messagesToShow && i < messageElements.length; i++) {
          gsap.to(messageElements[i], { 
            autoAlpha: 1, 
            y: 0, 
            duration: 0.5,
            delay: 0.1 * (i - currentMessageIndex.value) // Stagger the animations
          });
        }
        
        // Hide messages when scrolling back up
        for (let i = messagesToShow; i < currentMessageIndex.value && i < messageElements.length; i++) {
          gsap.to(messageElements[i], { 
            autoAlpha: 0, 
            y: 20, 
            duration: 0.3
          });
        }
        
        currentMessageIndex.value = messagesToShow;
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
</script>

<style lang="scss" scoped>
.narrative-section {
  position: relative;
  height: v-bind('sectionHeight'); // Dynamic height based on prop
  width: 100%;
  overflow: visible;
  z-index: 1; // Add z-index to manage stacking context
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
  transition: background-color 0.5s ease, transform 0.3s ease; // Add transform transition
  will-change: transform, background-color; // Optimize for animation
}

.container {
  width: 100%;
  height: auto; // Let it size to content
}

.phone-container {
  position: relative;
  max-width: 500px;
  height: 800px;
  perspective: 1000px;
  margin: 0 auto;
}

.narrative-chat {
  height: 100%;
  overflow-y: hidden; // Prevent scrolling within the chat container
  position: relative; // Ensure proper positioning
}

:deep(.message) {
  transition: opacity 0.3s, transform 0.3s;
  will-change: opacity, transform;
}
</style>
