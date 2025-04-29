<template>
  <!-- No changes to template section -->
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

const STORAGE_KEY = 'futoro-client-form-data';

const form = ref({
  timeline: '',
  budgetTier: '',
  // Add any other form fields here
});

const saveFormData = (formData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    console.log('Form data saved successfully:', formData);
  } catch (error) {
    console.error('Error saving form data:', error);
  }
};

const loadSavedFormData = () => {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      console.log('Loading saved form data:', parsedData);
      
      // Update form with saved data, maintaining reactivity
      form.value = {
        ...form.value,
        ...parsedData
      };
      
      console.log('Form values updated:', form.value);
    } catch (error) {
      console.error('Error loading saved form data:', error);
    }
  }
};

// Watch for changes in form values
watch(
  () => form.value,
  (newValues) => {
    console.log('Form values changed:', newValues);
    saveFormData(newValues);
  },
  { deep: true }
);

// Initialize form data when component is mounted
onMounted(() => {
  loadSavedFormData();
});

// Export form for use in parent components if needed
defineExpose({
  form
});
</script>

<style>
  /* No changes to style section */
</style> 