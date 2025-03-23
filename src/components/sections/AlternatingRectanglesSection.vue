<template>
  <div>
    <StickyScrollContainer 
      title="Conversation History"
      startColor="var(--theme-background)"
      endColor="var(--theme-primary-light)"
      :totalMessages="50"
    >
      <template v-for="(item, index) in messages" :key="index" #[`message-${index}`]>
        <h3>{{ item.sender }}</h3>
        <p>{{ item.text }}</p>
      </template>
    </StickyScrollContainer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import StickyScrollContainer from './StickyScrollContainer.vue';

// Generate sample conversation data
const messages = ref([
  { sender: "User", text: "Hello! I'm looking for help with my website." },
  { sender: "Support", text: "Hi there! I'd be happy to help. What specific issues are you having with your website?" },
  { sender: "User", text: "It's loading really slowly, especially on mobile devices." },
  { sender: "Support", text: "That's definitely frustrating. Let's look at a few common causes. Have you optimized your images?" },
  { sender: "User", text: "I'm not sure what that means exactly." },
  { sender: "Support", text: "No problem! Image optimization means reducing file sizes without sacrificing quality. It's one of the most effective ways to speed up your site." },
  // Generate more messages to fill out the conversation
  ...Array(44).fill(null).map((_, i) => {
    const isUser = i % 2 === 0;
    return {
      sender: isUser ? "User" : "Support",
      text: isUser 
        ? `This is question ${Math.floor(i/2) + 4} about my website.` 
        : `Here's a detailed answer to help you solve problem ${Math.floor(i/2) + 4}.`
    };
  })
]);
</script>
