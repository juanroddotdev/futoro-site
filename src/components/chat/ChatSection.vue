<template>
  <div class="chat-section mb-8">
    <h3 v-if="title" class="chat-section__title gradient-text">{{ title }}</h3>
    <div class="narrative-steps">
      <p v-for="(message, index) in messages" :key="`${sectionId}-${index}`" :class="[
        'message',
        message.type === 'received' ? 'message--received' : 'message--sent'
      ]">
        <span v-if="message.type === 'received'" class="client-indicator">{{ clientLabel }}</span>
        {{ message.text }}
        <span class="message__time">{{ message.time || '10:30 AM' }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChatMessage } from '@/data/chatSections';

interface Props {
  title?: string;
  messages: ChatMessage[];
  sectionId: string;
  clientLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  clientLabel: '',
  sectionId: 'chat'
});
</script>

<style scoped>
.chat-section {
  padding: 1rem;
  height: 100%;
  overflow-y: auto;
}

.chat-section__title {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.narrative-steps {
  display: flex;
  flex-direction: column;
}

.message {
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  margin-bottom: 0.75rem;
  position: relative;
  word-break: break-word;
  opacity: 1; /* Ensure messages are visible by default */
  transform: translateY(0); /* Reset any transform */
}

.message--sent {
  align-self: flex-end;
  background-color: #0084ff;
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.message--received {
  align-self: flex-start;
  background-color: #f1f0f0;
  color: #333;
  border-bottom-left-radius: 0.25rem;
}

.client-indicator {
  display: block;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
  font-weight: 600;
  opacity: 0.7;
}

.message__time {
  display: block;
  font-size: 0.7rem;
  margin-top: 0.25rem;
  opacity: 0.7;
  text-align: right;
}
</style>
