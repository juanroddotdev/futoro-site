<template>
  <section class="narrative-intro">
    <div class="container mx-auto px-4">
      <div class="phone-container mx-auto my-24">
        <!-- Phone SVG Frame with chat content -->
        <PhoneFrame 
          :tiltDirection="tiltDirection"
          :chatMessages="chatMessages"
          chatTitle="Product Journey"
          :showChatInput="false"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AnimatedText from '@/components/text/AnimatedText.vue';
import PhoneFrame from '@/components/ui/PhoneFrame.vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Add prop for tilt direction
interface Props {
  tiltDirection?: 'left' | 'right' | 'none';
}

const props = withDefaults(defineProps<Props>(), {
  tiltDirection: 'left'
});

// Define chat messages
const chatMessages = ref([
  {
    type: 'received',
    text: "Hi there! I'm your product guide. Let me show you how our solution works.",
    time: '10:30 AM'
  },
  {
    type: 'sent',
    text: "Great! I'd like to know more about the process.",
    time: '10:31 AM'
  },
  {
    type: 'received',
    text: 'First, we analyze your current workflow to identify bottlenecks and opportunities for improvement.',
    time: '10:32 AM'
  },
  {
    type: 'received',
    text: 'Then, we implement our solution tailored to your specific needs.',
    time: '10:33 AM'
  },
  {
    type: 'sent',
    text: 'How long does the implementation usually take?',
    time: '10:34 AM'
  },
  {
    type: 'received',
    text: 'Most clients are up and running within 2-3 weeks, with immediate productivity gains!',
    time: '10:35 AM'
  }
]);

// Rest of the component code...
</script>

<style lang="scss" scoped>
.phone-container {
  position: relative;
  max-width: 500px;
  height: 800px;
  margin: 0 auto;
  perspective: 1000px;
}

// Remove the narrative-chat styles since we're now using the built-in chat functionality
</style>
<template>
  <section class="narrative-intro">
    <div class="container mx-auto px-4">
      <div class="phone-container mx-auto my-24">
        <!-- Phone SVG Frame - Pass tiltDirection directly to PhoneFrame -->
        <PhoneFrame :tiltDirection="tiltDirection" />
        
        <!-- Chat Content Inside Phone -->
        <div class="narrative-chat">
          <!-- Vision to Reality Section -->
          <div class="chat-section mb-8">
            <h3 class="chat-section__title gradient-text">From Vision to Reality</h3>
            <div class="narrative-steps">
              <p v-for="(step, index) in visionSteps" :key="`vision-${index}`" :class="[
                'message',
                step.isResponse ? 'message--received' : 'message--sent'
              ]">
                <span v-if="step.isResponse" class="client-indicator"></span>
                {{ step.text }}
                <span class="message__time">{{ step.time || '10:30 AM' }}</span>
              </p>
            </div>
          </div>

          <!-- Common Frustrations Section -->
          <div class="chat-section mb-8">
            <h3 class="chat-section__title gradient-text">Common Frustrations</h3>
            <div class="narrative-steps">
              <p v-for="(step, index) in frustrationSteps" :key="`frustration-${index}`" :class="[
                'message',
                step.isResponse ? 'message--received' : 'message--sent'
              ]">
                <span v-if="step.isResponse" class="client-indicator">Client:</span>
                {{ step.text }}
                <span class="message__time">{{ step.time || '10:30 AM' }}</span>
              </p>
            </div>
          </div>

          <!-- Personal Approach Section -->
          <div class="chat-section mb-8">
            <h3 class="chat-section__title gradient-text">A Personal Approach</h3>
            <div class="narrative-steps">
              <p v-for="(step, index) in approachSteps" :key="`approach-${index}`" :class="[
                'message',
                step.isResponse ? 'message--received' : 'message--sent'
              ]">
                <span v-if="step.isResponse" class="client-indicator">Client:</span>
                {{ step.text }}
                <span class="message__time">{{ step.time || '10:30 AM' }}</span>
              </p>
            </div>
          </div>

          <!-- Collaboration Process Section -->
          <div class="chat-section">
            <h3 class="chat-section__title gradient-text">Our Collaboration Process</h3>
            <div class="narrative-steps">
              <p v-for="(step, index) in processSteps" :key="`process-${index}`" :class="[
                'message',
                step.isResponse ? 'message--received' : 'message--sent'
              ]">
                <span v-if="step.isResponse" class="client-indicator">Client:</span>
                {{ step.text }}
                <span class="message__time">{{ step.time || '10:30 AM' }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AnimatedText from '@/components/text/AnimatedText.vue';
import PhoneFrame from '@/components/ui/PhoneFrame.vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Add prop for tilt direction
interface Props {
  tiltDirection?: 'left' | 'right' | 'none';
}

const props = withDefaults(defineProps<Props>(), {
  tiltDirection: 'left'
});

// Get step data using arrays of objects
const getVisionToRealitySteps = () => {
  return [
    { type: 'response', text: "I've got a vision!" },
    { type: 'step', text: "Of love?! 😍" },
    { type: 'response', text: "Yeah.....? No!!" },
    { type: 'response', text: "I have this idea for my business" },
    { type: 'step', text: "Like, a really cool storefront," },
    { type: 'response', text: "but idk how to make it work online." },
    { type: 'step', text: "a brand that's gonna pop," },
    { type: 'step', text: "or maybe a portfolio that'll blow minds." },
    { type: 'response', text: "Exactly! I want something that stands out from my competitors." },
    { type: 'step', text: "But then you gotta build a website..." },
    { type: 'response', text: "That's where I get stuck. I don't know where to start." },
    { type: 'step', text: "and suddenly it's like, what's a 'widget' and why is my site taking forever to load?" },
    { type: 'response', text: "Right? All this technical jargon is overwhelming!" },
    { type: 'step', text: "Let's ditch the tech-speak and figure out how to make this awesome together." },
    { type: 'response', text: "That sounds perfect. I need someone who speaks my language." }
  ];
};

const getCommonFrustrationsSteps = () => {
  return [
    { type: 'step', text: "Seriously, who's got time for all this website stuff?" },
    { type: 'response', text: "I know I don't. I'm already juggling so much with my business." },
    { type: 'step', text: "You're busy, I get it." },
    { type: 'response', text: "Thank you! Sometimes it feels like no one understands that." },
    { type: 'step', text: "DIY builders? They're okay, but they never really nail your vibe." },
    { type: 'response', text: "I tried one of those and gave up after two days. It looked nothing like I wanted." },
    { type: 'step', text: "And SEO? Forget about it." },
    { type: 'response', text: "Is that why no one can find my current site on Google?" },
    { type: 'step', text: "Basically, there's a ton of stuff that can go sideways, and it's super frustrating." },
    { type: 'response', text: "You're speaking my language. This is exactly what I've been dealing with." }
  ];
};

const getPersonalApproachSteps = () => {
  return [
    { type: 'step', text: "Okay, so here's the deal:" },
    { type: 'response', text: "I'm listening..." },
    { type: 'step', text: "What if you had someone real on your team?" },
    { type: 'response', text: "That would be amazing instead of dealing with chatbots and templates." },
    { type: 'step', text: "Not some robot website thing, but like, an actual person who gets your whole vibe?" },
    { type: 'response', text: "Yes! Someone who understands what makes my business unique." },
    { type: 'step', text: "Someone who can turn your crazy ideas into a website that actually, you know, works?" },
    { type: 'response', text: "That's exactly what I need - someone who can translate my vision into reality." },
    { type: 'step', text: "Yeah, that's me." },
    { type: 'response', text: "I think we're going to work well together." }
  ];
};

const getCollaborationProcessSteps = () => {
  return [
    { type: 'step', text: "Look, I'm not just throwing together some random website." },
    { type: 'response', text: "That's refreshing to hear. I want something thoughtful." },
    { type: 'step', text: "I'm building your online hangout, your digital HQ, you know?" },
    { type: 'response', text: "I like that perspective - it's more than just a website." },
    { type: 'step', text: "A place where people actually get you." },
    { type: 'response', text: "That's what's been missing from my online presence!" },
    { type: 'step', text: "Think of me as your web-bestie, your inside guy, your creative wingman." },
    { type: 'response', text: "Having someone in my corner who understands tech would be such a relief." },
    { type: 'step', text: "So, how do we make this happen? Let's break it down." },
    { type: 'response', text: "I'm ready to get started. What's the first step?" }
  ];
};

// Simplified conversion function
const convertStepsToArray = (steps) => {
  return steps.map((step, index) => ({
    text: step.text,
    isResponse: step.type === 'response',
    time: getMessageTime(index)
  }));
};

// Function to get message time in appropriate format
const getMessageTime = (index) => {
  const now = new Date();
  
  // Add a few seconds for each message
  const secondsToAdd = index * 3;
  now.setSeconds(now.getSeconds() + secondsToAdd);
  
  // Get user's locale
  const userLocale = navigator.language || 'en-US';
  
  // Check if user is in the United States
  const isUSLocale = /^en-US/i.test(userLocale);
  
  if (isUSLocale) {
    // Force 12-hour format for US users
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  } else {
    // Use browser's locale settings for non-US users
    return new Intl.DateTimeFormat(userLocale, {
      hour: 'numeric',
      minute: '2-digit'
    }).format(now);
  }
};

// Use the new conversion function for all step arrays
const visionSteps = computed(() => convertStepsToArray(getVisionToRealitySteps()));
const frustrationSteps = computed(() => convertStepsToArray(getCommonFrustrationsSteps()));
const approachSteps = computed(() => convertStepsToArray(getPersonalApproachSteps()));
const processSteps = computed(() => convertStepsToArray(getCollaborationProcessSteps()));

// Initialize GSAP animations
onMounted(() => {
  // Select all message elements
  const messages = document.querySelectorAll('.narrative-chat .message');

  // Set initial state - all messages hidden
  gsap.set(messages, {
    opacity: 0,
    y: 20
  });

  // Create animations for each chat section
  const sections = document.querySelectorAll('.chat-section');

  sections.forEach((section) => {
    const sectionMessages = section.querySelectorAll('.message');

    // Create a timeline for this section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        end: 'bottom 30%',
        toggleActions: 'play none none reverse',
        // markers: true, // Helpful for debugging
        scrub: 0.5, // This makes the animation tied directly to scroll position
      }
    });

    // Add each message to the timeline with staggered reveal
    sectionMessages.forEach((message, index) => {
      // Calculate when this message should appear in the timeline
      // Each message appears at a specific scroll point
      const position = index * 0.2; // Adjust this value to control spacing

      tl.to(message, {
        opacity: 1,
        y: 0,
        duration: 0.1, // Short duration since we're using scrub
        ease: 'power1.out'
      }, position);
    });
  });
});
</script>

<style lang="scss" scoped>
// Import the narrative-chat styles
@import '@/scss/components/narrative-chat';

// Keep some of your custom styles that don't conflict
.gradient-text {
  background: linear-gradient(to right, var(--theme-accent), var(--theme-secondary));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

// You can add custom overrides here if needed

.phone-container {
  position: relative;
  max-width: 500px; // Increased from 320px
  height: 800px; // Added height for 3D perspective
  margin: 0 auto;
  perspective: 1000px; // Add perspective for 3D effect
  
  // Base styles without tilt
  &.tilt-none {
    .phone-frame, .narrative-chat {
      transform: rotateY(0deg) rotateX(0deg) rotateZ(0deg);
      
      &:hover {
        transform: rotateY(0deg) rotateX(0deg) rotateZ(0deg);
      }
    }
  }
  
  // Left tilt (default)
  &.tilt-left {
    .phone-frame, .narrative-chat {
      transform: rotateY(-10deg) rotateX(5deg) rotateZ(-2deg);
      
      &:hover {
        transform: rotateY(-8deg) rotateX(3deg) rotateZ(-1deg);
      }
    }
  }
  
  // Right tilt
  &.tilt-right {
    .phone-frame, .narrative-chat {
      transform: rotateY(10deg) rotateX(5deg) rotateZ(2deg);
      
      &:hover {
        transform: rotateY(8deg) rotateX(3deg) rotateZ(1deg);
      }
    }
  }
}

.narrative-chat {
  position: relative;
  z-index: 2;
  padding: 70px 30px 30px; // Increased padding
  height: 650px; // Increased height
  overflow-y: auto;
  margin-top: 70px; // Adjusted for larger phone
  background-color: #f5f5f7;
  border-radius: 8px;
  transform-style: preserve-3d;
  transform-origin: center center;
  transition: transform 0.5s ease;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
  
  // Apply the same tilt as the phone frame
  &.tilt-left {
    transform: rotateY(-10deg) rotateX(5deg) rotateZ(-2deg);
    
    &:hover {
      transform: rotateY(-8deg) rotateX(3deg) rotateZ(-1deg);
    }
  }
  
  &.tilt-right {
    transform: rotateY(10deg) rotateX(5deg) rotateZ(2deg);
    
    &:hover {
      transform: rotateY(8deg) rotateX(3deg) rotateZ(1deg);
    }
  }
  
  &.tilt-none {
    transform: rotateY(0deg) rotateX(0deg) rotateZ(0deg);
    
    &:hover {
      transform: rotateY(0deg) rotateX(0deg) rotateZ(0deg);
    }
  }
}

/* Adjust message styles to fit phone screen but keep them readable */
.message {
  font-size: 1rem; // Slightly larger
  padding: 10px 15px;
  margin-bottom: 12px;
  max-width: 80%;
  border-radius: 18px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transform-style: preserve-3d;
  transform: translateZ(1px); // Subtle depth
}

.chat-section__title {
  font-size: 1.4rem;
  margin-bottom: 16px;
  transform: translateZ(2px); // More depth for titles
}

/* Make scrollbar less obtrusive */
.narrative-chat::-webkit-scrollbar {
  width: 5px;
}

.narrative-chat::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

/* Add some depth to the phone elements */
.phone-container::after {
  content: '';
  position: absolute;
  width: 90%;
  height: 20px;
  bottom: -20px;
  left: 5%;
  background: rgba(0, 0, 0, 0.2);
  filter: blur(15px);
  border-radius: 50%;
  z-index: 0;
}

/* Keep your existing message styles */
</style>
<template>
  <section class="narrative-intro">
    <div class="container mx-auto px-4">
      <div class="phone-container mx-auto my-24">
        <!-- Phone SVG Frame with custom chat content -->
        <PhoneFrame :tiltDirection="tiltDirection">
          <div class="narrative-chat">
            <!-- Vision to Reality Section -->
            <ChatSection
              title="From Vision to Reality"
              :messages="visionMessages"
              sectionId="vision"
            />
            
            <!-- Common Frustrations Section -->
            <ChatSection
              title="Common Frustrations"
              :messages="frustrationMessages"
              sectionId="frustration"
              clientLabel="Client:"
            />
            
            <!-- Personal Approach Section -->
            <ChatSection
              title="A Personal Approach"
              :messages="approachMessages"
              sectionId="approach"
              clientLabel="Client:"
            />
            
            <!-- Collaboration Process Section -->
            <ChatSection
              title="Our Collaboration Process"
              :messages="processMessages"
              sectionId="process"
              clientLabel="Client:"
            />
          </div>
        </PhoneFrame>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import PhoneFrame from '@/components/ui/PhoneFrame.vue';
import ChatSection from '@/components/chat/ChatSection.vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  getVisionToRealitySteps, 
  getCommonFrustrationsSteps,
  getPersonalApproachSteps,
  getCollaborationProcessSteps,
  convertStepsToMessages
} from '@/data/chatSections';

gsap.registerPlugin(ScrollTrigger);

// Add prop for tilt direction
interface Props {
  tiltDirection?: 'left' | 'right' | 'none';
}

const props = withDefaults(defineProps<Props>(), {
  tiltDirection: 'left'
});

// Convert step data to chat message format
const visionMessages = computed(() => convertStepsToMessages(getVisionToRealitySteps()));
const frustrationMessages = computed(() => convertStepsToMessages(getCommonFrustrationsSteps()));
const approachMessages = computed(() => convertStepsToMessages(getPersonalApproachSteps()));
const processMessages = computed(() => convertStepsToMessages(getCollaborationProcessSteps()));

// Initialize GSAP animations
onMounted(() => {
  // Select all message elements
  const messages = document.querySelectorAll('.narrative-chat .message');

  // Set initial state - all messages hidden
  gsap.set(messages, {
    opacity: 0,
    y: 20
  });

  // Create animations for each chat section
  const sections = document.querySelectorAll('.chat-section');
  
  sections.forEach((section, index) => {
    const sectionMessages = section.querySelectorAll('.message');
    
    // Create a timeline for this section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none none'
      }
    });
    
    // Add each message to the timeline with a stagger effect
    tl.to(sectionMessages, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.2
    });
  });
});
</script>

<style lang="scss" scoped>
.phone-container {
  position: relative;
  max-width: 500px;
  height: 800px;
  margin: 0 auto;
  perspective: 1000px;
}

.narrative-chat {
  position: relative;
  z-index: 2;
  padding: 70px 30px 30px;
  height: 650px;
  overflow-y: auto;
  margin-top: 70px;
  background-color: #f5f5f7;
  border-radius: 8px;
  transform-style: preserve-3d;
  transform-origin: center center;
  transition: transform 0.5s ease;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
