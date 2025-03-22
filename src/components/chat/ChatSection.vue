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

<style lang="scss" scoped>
.chat-section {
  margin-bottom: 2rem;
  
  &__title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    
    &.gradient-text {
      background: linear-gradient(90deg, #3498db, #8e44ad);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}

.narrative-steps {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.message {
  position: relative;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  max-width: 80%;
  line-height: 1.4;
  
  &__time {
    display: block;
    font-size: 0.7rem;
    opacity: 0.7;
    margin-top: 0.25rem;
    text-align: right;
  }
  
  &--sent {
    align-self: flex-end;
    background-color: #dcf8c6;
    border-bottom-right-radius: 0.25rem;
  }
  
  &--received {
    align-self: flex-start;
    background-color: #ffffff;
    border-bottom-left-radius: 0.25rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
}

.client-indicator {
  font-weight: 600;
  color: #3498db;
  margin-right: 0.5rem;
  font-size: 0.8rem;
}
</style>