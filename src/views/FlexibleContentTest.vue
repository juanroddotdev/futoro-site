<template>
  <div class="test-container">
    <h1 class="test-title">Flexible Content Test</h1>
    
    <!-- Test 1: Simple Flexible Content (non-sticky) -->
    <div class="test-section">
      <h2 class="test-section-title">Test 1: Simple Flexible Content</h2>
      <SimpleFlexibleContent
        :messages="messages"
        :showTypingFor="[0, 1]"
        layout="content-left"
        phonePosition="right"
        sectionId="test-simple"
        customClass="dark-theme"
      >
        <template #headline>
          <h2 class="heading--accent">Simple Flexible Content</h2>
        </template>
        <template #subheadline>
          <p class="heading--highlight">Non-sticky version with phone on right</p>
        </template>
        <template #content>
          <p>This component doesn't have any sticky behavior built-in.</p>
          <div class="mt-4">
            <button class="btn-round-medium-primary">Primary Action</button>
            <button class="btn-round-medium-outline-primary ml-2">Secondary Action</button>
          </div>
        </template>
      </SimpleFlexibleContent>
    </div>
    
    <!-- Test 2: Sticky Flexible Content -->
    <div class="test-section">
      <h2 class="test-section-title">Test 2: Sticky Flexible Content</h2>
      <StickyFlexibleContent
        :messages="messages"
        :showTypingFor="[0, 1]"
        layout="content-right"
        phonePosition="left"
        containerHeight="300vh"
        :debug="true"
        sectionId="test-sticky"
        class="dark-theme"
      >
        <template #headline>
          <h2 class="heading--accent">Sticky Flexible Content</h2>
        </template>
        <template #subheadline>
          <p class="heading--highlight">Sticky version with phone on left</p>
        </template>
        <template #content>
          <p>This component uses StickySectionContainer for sticky behavior.</p>
          <p class="mt-2">Scroll down to see the sticky effect in action.</p>
          <div class="mt-4">
            <button class="btn-round-medium-primary">Primary Action</button>
            <button class="btn-round-medium-outline-primary ml-2">Secondary Action</button>
          </div>
        </template>
      </StickyFlexibleContent>
    </div>
    
    <!-- Test 3: Another Sticky Flexible Content with different layout -->
    <div class="test-section">
      <h2 class="test-section-title">Test 3: Center Layout</h2>
      <StickyFlexibleContent
        :messages="messages"
        :showTypingFor="[0, 1]"
        layout="content-top"
        phonePosition="center"
        containerHeight="300vh"
        :debug="true"
        sectionId="test-center"
        class="dark-theme"
      >
        <template #headline>
          <h2 class="heading--accent">Center Layout</h2>
        </template>
        <template #subheadline>
          <p class="heading--highlight">Sticky version with centered phone</p>
        </template>
        <template #content>
          <p>This demonstrates the center layout option.</p>
          <div class="mt-4">
            <button class="btn-round-medium-primary">Primary Action</button>
            <button class="btn-round-medium-outline-primary ml-2">Secondary Action</button>
          </div>
        </template>
      </StickyFlexibleContent>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SimpleFlexibleContent from '@/components/sections/SimpleFlexibleContent.vue';
import StickyFlexibleContent from '@/components/sections/StickyFlexibleContent.vue';
import { getInitialConversation } from '@/data/chatSections';

// Get sample messages for the phone
const messages = getInitialConversation();
</script>

<style lang="scss" scoped>
.test-container {
  padding: 2rem;
  background-color: #f5f5f5;
}

.test-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.test-section {
  margin-bottom: 4rem;
}

.test-section-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: var(--theme-bg-secondary);
  border-radius: 0.25rem;
}

/* Dark theme styling */
:deep(.dark-theme) {
  .simple-flexible-content, 
  .section-container {
    background-color: #000 !important;
    color: #fff !important;
  }
  
  .content-area {
    color: #fff !important;
    
    h2, p {
      color: #fff !important;
    }
  }
}
</style>
