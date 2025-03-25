<template>
  <div class="chat-screen">
    <div ref="messagesRef" class="messages-container">
      <template v-for="(message, idx) in messages" :key="`typing-${idx}`">
        <div v-if="showTypingFor.includes(idx)" :class="`typing-container typing-container-${idx + 1}`">
          <TypingIndicator :class="`typing-indicator-${idx + 1}`" :is-sent="message.type === 'sent'" />
        </div>
      </template>

      <template v-for="(message, idx) in messages" :key="`message-${idx}`">
        <div :class="`message-group message-group-${idx + 1}`">
          <div class="message" :class="[
            message.type === 'sent' ? 'sent' : 'received',
            `message-${idx + 1}`
          ]">
            <div class="message-content">
              {{ message.text }}
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="message-input-container">
      <div class="input-wrapper">
        <div class="message-input">
          <span class="placeholder"><span class="futoro">futoro</span>Message</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TypingIndicator from '@/components/TypingIndicator.vue';

interface Message {
  text: string;
  type: string;
}

interface Props {
  messages: Message[];
  showTypingFor: number[];
}

const props = defineProps<Props>();
const messagesRef = ref<HTMLElement | null>(null);
</script>

<style scoped>
.chat-screen {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.message-group {
  margin-bottom: 16px;
  opacity: 0;
  transform: translateY(20px);
}

.message {
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 18px;
  margin-bottom: 4px;
  word-break: break-word;
}

.message.sent {
  background-color: #0084ff;
  color: white;
  margin-left: auto;
  border-bottom-right-radius: 4px;
}

.message.received {
  background-color: #e5e5ea;
  color: black;
  margin-right: auto;
  border-bottom-left-radius: 4px;
}

.message-content {
  font-size: 16px;
  line-height: 1.4;
}

.typing-container {
  opacity: 0;
  margin-bottom: 8px;
}

.message-input-container {
  padding: 10px 16px;
  border-top: 1px solid #e5e5ea;
  background-color: white;
}

.input-wrapper {
  background-color: #f1f1f1;
  border-radius: 20px;
  padding: 8px 12px;
}

.message-input {
  font-size: 16px;
  color: #999;
}

.placeholder {
  color: #999;
}

.futoro {
  font-weight: bold;
  color: #0084ff;
  margin-right: 4px;
}
</style>
