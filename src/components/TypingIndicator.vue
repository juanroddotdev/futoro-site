<template>
  <div 
    class="typing-indicator"
    :class="{ 'sent': isSent }"
  >
    <div class="typing-animation">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isSent?: boolean;
}>();
</script>

<style scoped>
.typing-indicator {
  max-width: 80%;
  position: relative;
  margin-right: auto;
  opacity: 0;
}

.typing-indicator.sent {
  margin-left: auto;
  margin-right: 0;
}

.typing-animation {
  padding: 8px 12px;
  border-radius: 16px;
  background: #e5e5ea;
  display: flex;
  align-items: center;
  gap: 4px;
  width: 40px;
}

.sent .typing-animation {
  background: #007AFF;
}

.typing-animation span {
  width: 4px;
  height: 4px;
  background: #8e8e93;
  border-radius: 50%;
  animation: typing 0.6s infinite;
  display: inline-block;
}

.sent .typing-animation span {
  background: rgba(255, 255, 255, 0.7);
}

.typing-animation span:nth-child(2) {
  animation-delay: 0.1s;
}

.typing-animation span:nth-child(3) {
  animation-delay: 0.2s;
}

@keyframes typing {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

@media (prefers-color-scheme: dark) {
  .typing-animation {
    background: #262629;
  }
  
  .typing-animation span {
    background: #8e8e93;
  }
}
</style> 