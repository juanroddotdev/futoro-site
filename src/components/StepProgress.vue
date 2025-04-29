const answeredQuestions = computed(() => {
  const questions = getStepQuestions(props.currentStep);
  return questions.filter(question => {
    const value = props.formValues[question];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    // Consider a question answered if it has a truthy value or is explicitly set to false (for boolean fields)
    return value !== undefined && value !== null && (value !== '' || value === false);
  });
});

const progress = computed(() => {
  const questions = getStepQuestions(props.currentStep);
  const answered = answeredQuestions.value;
  
  return {
    total: questions.length,
    answered: answered.length,
    percentage: questions.length ? (answered.length / questions.length) * 100 : 0,
    questions: questions.map(q => ({
      question: q,
      isAnswered: answered.includes(q),
      value: props.formValues[q]
    }))
  };
});

// Watch for changes in progress and log them
watch(() => progress.value, (newProgress) => {
  console.log('Step Progress Updated:', {
    step: props.currentStep,
    progress: newProgress
  });
}, { deep: true }); 