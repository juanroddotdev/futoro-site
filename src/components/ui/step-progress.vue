# Create a new component for step progress
<script setup lang="ts">
import { computed, watch } from 'vue';

const props = defineProps<{
  questions: string[];
  formValues: Record<string, any>;
  isActive: boolean;
}>();

// Helper function to check if a question is answered
const isQuestionAnswered = (questionId: string) => {
  const value = props.formValues[questionId];
  
  if (Array.isArray(value)) {
    return value.length > 0;
  } else if (typeof value === 'boolean') {
    return value !== null && value !== undefined;
  } else if (value === undefined || value === null || value === '') {
    return false;
  } else if (typeof value === 'string') {
    return value.trim() !== '';
  }
  
  return true;
};

// Computed property to track answered questions
const answeredQuestions = computed(() => {
  // Map each question to its answered state
  return props.questions.map(questionId => ({
    id: questionId,
    isAnswered: isQuestionAnswered(questionId),
    value: props.formValues[questionId]
  }));
});

// Watch for changes in answered questions and log them
watch(answeredQuestions, (newState) => {
  const changes = newState.map(q => ({
    question: q.id,
    isAnswered: q.isAnswered,
    value: q.value
  }));
  
  console.log('Progress Update:', {
    answeredCount: newState.filter(q => q.isAnswered).length,
    totalQuestions: props.questions.length,
    details: changes
  });
}, { deep: true });
</script>

<template>
  <div class="step-progress">
    <span 
      v-for="(question, index) in questions" 
      :key="question"
      class="progress-dot"
      :class="{ 'progress-dot--filled': isQuestionAnswered(question) }"
      :title="`Question ${index + 1}: ${isQuestionAnswered(question) ? 'Answered' : 'Not answered'}`"
    ></span>
  </div>
</template>

<style scoped>
.step-progress {
  display: none; /* Temporarily hide the step progress */
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.25rem;
}

.progress-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: 1px solid var(--form-primary);
  opacity: 0.5;
  transition: all 0.2s ease;
}

.progress-dot--filled {
  background-color: var(--form-primary);
  opacity: 1;
}

/* Handle active state */
:deep(.step-button--active) .progress-dot {
  border-color: white;
}

:deep(.step-button--active) .progress-dot--filled {
  background-color: white;
}
</style> 