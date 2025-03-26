<template>
  <div class="floating-chat-demo">
    <h1>Floating Chat Demo</h1>
    
    <ScrollableChatSection
      :messages="chatMessages"
      :showTypingFor="typingIndicators"
      sectionId="demo-chat"
      containerHeight="300vh"
      layout="content-left"
    >
      <template #headline>
        <h2>Scrollable Chat Demo</h2>
      </template>
      <template #subheadline>
        <p>This demonstrates our reusable scrollable chat component without the phone UI.</p>
      </template>
      <template #content>
        <p>Scroll down to see the chat animation in action.</p>
        <button class="btn-primary">Example Button</button>
      </template>
    </ScrollableChatSection>
    
    <div class="content-after">
      <h2>Content after the chat</h2>
      <p>This content appears after scrolling through the chat.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ScrollableChatSection from '@/components/sections/refactored/ScrollableChatSection.vue';
import { getVisionToRealitySteps } from '@/data/chatSections';

// Get messages from chatSections.ts
const chatMessages = getVisionToRealitySteps();

// Set typing indicators for specific messages
const typingIndicators = [1, 4, 7, 10]; // Show typing indicators before messages 2, 5, 8, and 11
</script>

<style lang="scss" scoped>
.floating-chat-demo {
  padding: 20px;
  
  h1 {
    text-align: center;
    margin-bottom: 40px;
  }
  
  .content-after {
    padding: 100px 20px;
    text-align: center;
  }
}
</style>
