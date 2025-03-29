<template>
  <span class="typing-text">
    <span class="left">
      <span 
        v-for="(char, index) in leftChars" 
        :key="`left-${index}`"
        class="letter"
        :data-word-index="0"
        :data-letter-index="index"
      >
        {{ char }}
      </span>
    </span>
    <span class="caret" :class="caretAnimation"></span>
    <span class="right" v-if="rightChars.length > 0">
      <span 
        v-for="(char, index) in rightChars" 
        :key="`right-${index}`"
        class="letter"
        :data-word-index="0"
        :data-letter-index="leftChars.length + index"
        style="opacity: 0"
      >
        {{ char }}
      </span>
    </span>
  </span>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = defineProps<{
  text: string;
  speed?: number;
  delay?: number;
  caretAnimation?: string;
}>();

const emit = defineEmits<{
  (e: 'complete'): void;
}>();

const currentIndex = ref(0);
const isTyping = ref(false);

const leftChars = computed(() => props.text.slice(0, currentIndex.value));
const rightChars = computed(() => props.text.slice(currentIndex.value));

const startTyping = () => {
  if (isTyping.value) return;
  isTyping.value = true;
  currentIndex.value = 0;
  
  const typeNextChar = () => {
    if (currentIndex.value < props.text.length) {
      currentIndex.value++;
      setTimeout(typeNextChar, props.speed || 100);
    } else {
      isTyping.value = false;
      emit('complete');
    }
  };

  setTimeout(typeNextChar, props.delay || 0);
};

defineExpose({
  startTyping
});
</script>

<style scoped>
.typing-text {
  display: inline-flex;
  gap: 0.1em;
  cursor: default;
  user-select: none;
}

.letter {
  position: relative;
  color: transparent;
  -webkit-text-stroke: 2px var(--theme-primary, #88C0D0);
  transition: all 0.3s ease;
  display: inline-block;
  min-width: 0.5em;
  opacity: 1;
  transform: none;
}

.caret {
  display: inline-block;
  width: 2px;
  height: 1em;
  background-color: currentColor;
  margin: 0 2px;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Caret animations */
.caret.smooth {
  animation: blink 1s infinite;
}

.caret.phase {
  animation: blink 1s infinite;
  animation-timing-function: steps(1);
}

.caret.expand {
  animation: expand 1s infinite;
}

@keyframes expand {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.5); }
}

/* For Firefox which doesn't support -webkit-text-stroke well */
@-moz-document url-prefix() {
  .letter {
    text-shadow: 
      -2px -2px 0 var(--theme-primary, #88C0D0),
      2px -2px 0 var(--theme-primary, #88C0D0),
      -2px 2px 0 var(--theme-primary, #88C0D0),
      2px 2px 0 var(--theme-primary, #88C0D0);
  }
}
</style> 