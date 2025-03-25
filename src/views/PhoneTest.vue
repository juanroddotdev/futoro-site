<template>
  <div class="phone-test-container">
  
    
    <div class="test-section mb-16">
      <h2 class="text-2xl font-semibold mb-4">Sticky Content with Phone</h2>
      <ScrollablePhoneSection
        phonePosition="right"
        :messages="flexibleMessages"
        :showTypingFor="[1]"
        :tilt-x="5"
        :tilt-y="-10"
        sectionId="flexible-phone"
        layout="content-left"
        :debug="false"
        containerHeight="300vh"
        :ambient-mode="true"
        :enable-pull-effect="true"
        @pull-threshold-reached="handlePullThresholdReached"
        :unlock-animation-type="'wave'"
        :ambient-theme="{
          baseColor: '#0a1525',
          endColor: '#1a2535',
          accentColor: 'rgba(100, 200, 255, 0.3)'
        }"
        :pin-settings="{ enabled: true, start: 'top top', end: 'bottom bottom' }"
        :is-unlocked="isUnlocked"
        @unlock="handlePhoneUnlock"
      >
        <template #headline>
          <h3 class="text-2xl font-bold mb-4">Sticky Content Test</h3>
        </template>
        <template #subheadline>
          <p class="mb-6">Testing the flexible content with phone component with various configurations.</p>
          <!-- <div class="flex gap-4">
            <button class="btn-round-large-primary">Primary Action</button>
            <button class="btn-round-large-outline-primary">Secondary Action</button>
          </div> -->
          <div class="flex gap-4 mb-4">
        <button 
          class="px-4 py-2 rounded" 
          :class="ambientMode ?'bg-green-500 text-white' : 'bg-gray-200'"
          @click="ambientMode = true"
        >
          Ambient On
        </button>
        <button 
          class="px-4 py-2 rounded" 
          :class="!ambientMode ? 'bg-blue-500 text-white' : 'bg-gray-200'"
          @click="ambientMode = false"
        >
          Ambient Off
        </button>
        <button 
          class="px-4 py-2 rounded" 
          :class="isUnlocked ? 'bg-purple-500 text-white' : 'bg-gray-200'"
          @click="isUnlocked = !isUnlocked"
        >
          {{ isUnlocked ? 'Locked' : 'Unlock' }}
        </button>
      </div>
        </template>
      </ScrollablePhoneSection>
    </div>
    
    
   
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PhoneSection from '@/components/PhoneSection.vue';
import ScrollablePhoneSection from '@/components/sections/refactored/ScrollablePhoneSection.vue';

// Sample messages for testing
const basicMessages = [
  { text: "Hi there! How can I help you today?", type: "received" },
  { text: "I'm looking for information about your web development services.", type: "sent" },
  { text: "Great! We offer full-stack web development with modern frameworks like Vue, React, and Angular.", type: "received" },
  { text: "Do you also handle design?", type: "sent" },
  { text: "Yes! Our team includes UI/UX designers who create beautiful, user-friendly interfaces.", type: "received" }
];

const flexibleMessages = [
  { text: "Welcome to our flexible content test!", type: "received" },
  { text: "This component combines content and phone in one layout.", type: "sent" },
  { text: "You can customize the position, animation, and more.", type: "received" }
];

const controlMessages = [
  { text: "This phone's tilt can be controlled with the sliders.", type: "received" },
  { text: "Try adjusting the X and Y values to see how it affects the 3D perspective.", type: "sent" }
];

// Control values
const ambientMode = ref(true);
const isUnlocked = ref(false);
const unlockAnimationType = ref<'wave' | 'ripple'>('wave');
const tiltX = ref(5);
const tiltY = ref(-10);

// Handle phone unlock
const handlePhoneUnlock = () => {
  console.log('Phone unlocked!');
  isUnlocked.value = true;
};

// Handle pull threshold reached
const handlePullThresholdReached = () => {
  console.log('Pull threshold reached, triggering unlock animation');
  setTimeout(() => {
    isUnlocked.value = true;
  }, 500); // Small delay to make the transition feel natural
};
</script>

<style lang="scss" scoped>
@import '@/scss/main.scss';

.phone-test-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 2; /* Add higher z-index to appear above contact section */
  background: linear-gradient(135deg, #2E3440 0%, #88C0D0 50%, #A3BE8C 100%);;
  min-height: 100vh;
}

.test-section {
  padding: 2rem;
  border-radius: 0.5rem;
  background-color: var(--color-background-soft);
}

.phone-wrapper {
  display: flex;
  justify-content: center;
  min-height: 600px;
}

.controls {
  background: linear-gradient(135deg, #2E3440 0%, #88C0D0 50%, #A3BE8C 100%);;
  padding: 1.5rem;
  border-radius: 0.5rem;
}
</style>
