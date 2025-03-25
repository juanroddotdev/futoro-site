<template>
  <div class="phone-test-container">
    <h1 class="text-3xl font-bold mb-8">Phone Component Testing</h1>
    
    <div class="test-section mb-16">
      <h2 class="text-2xl font-semibold mb-4">Basic Phone</h2>
      <div class="phone-wrapper">
        <PhoneSection
          :messages="basicMessages"
          :showTypingFor="[0, 2]"
          sectionId="basic-phone"
          :tilt-x="8"
          :tilt-y="-15"
          position="center"
          :pin-settings="{ enabled: false }"
        />
      </div>
    </div>
    
    <div class="test-section mb-16">
      <h2 class="text-2xl font-semibold mb-4">Sticky Content with Phone</h2>
      <StickyFlexibleContent
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
      </div>
        </template>
      </StickyFlexibleContent>
    </div>
    
    <div class="test-section mb-16">
      <h2 class="text-2xl font-semibold mb-4">Ambient Mode</h2>
      <div class="flex gap-4 mb-4">
        <button 
          class="px-4 py-2 rounded" 
          :class="ambientMode ? 'bg-green-500 text-white' : 'bg-gray-200'"
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
      </div>
      <div class="phone-wrapper">
        <PhoneSection
          :messages="basicMessages"
          :showTypingFor="[0, 2]"
          sectionId="ambient-phone"
          :tilt-x="5"
          :tilt-y="-10"
          position="center"
          :ambient-mode="true"
          :enable-pull-effect="true"
          :ambient-theme="{
            baseColor: '#0a1525',
            endColor: '#1a2535',
            accentColor: 'rgba(100, 200, 255, 0.3)'
          }"
          :pin-settings="{ enabled: false }"
        />
      </div>
    </div>
    
    <div class="test-section">
      <h2 class="text-2xl font-semibold mb-4">Animation Controls</h2>
      <div class="controls grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="control-group">
          <h3 class="text-xl mb-2">Phone Tilt</h3>
          <div class="flex gap-4 mb-4">
            <label class="flex flex-col">
              X Tilt
              <input type="range" min="-30" max="30" v-model="tiltX" class="w-full">
              <span>{{ tiltX }}°</span>
            </label>
            <label class="flex flex-col">
              Y Tilt
              <input type="range" min="-30" max="30" v-model="tiltY" class="w-full">
              <span>{{ tiltY }}°</span>
            </label>
          </div>
          <PhoneSection
            :messages="controlMessages"
            :showTypingFor="[]"
            sectionId="control-phone"
            :tilt-x="tiltX"
            :tilt-y="tiltY"
            position="center"
            :pin-settings="{ enabled: false }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PhoneSection from '@/components/PhoneSection.vue';
import StickyFlexibleContent from '@/components/sections/refactored/StickyFlexibleContent.vue';

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
const tiltX = ref(8);
const tiltY = ref(-15);

// Ambient mode toggle
const ambientMode = ref(false);
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
