<!--
Project Steps:
1. Initial Setup
   - Basic component structure
   - Dependencies and utilities
   - State management for multi-step form

2. Layout Structure
   - Two-column layout container
   - Left sidebar with progress steps
   - Main content area
   - Header with back button and progress status

3. Progress Navigation
   - Vertical step indicator component
   - Step numbering and active states
   - Progress tracking logic
   - Navigation between steps

4. Form Steps Components
   - Business Structure
   - Bank Details
   - 2-Step Authentication
   - Overview

5. State Management & Validation
   - Form state management
   - Per-step validation
   - Progress persistence
   - Form submission

6. Styling & UI Enhancement
   - Clean, minimal design
   - Form inputs and dropdowns
   - Transitions and animations
   - Responsive design
   - Proper spacing and typography

7. Final Touches
   - Loading states
   - Error handling
   - Success feedback
   - Accessibility
   - Documentation
-->

<template>
  <div id="futoro-client-form" class="client-form">
    <!-- Show success view if form is submitted -->
    <SubmissionSuccessView
      v-if="submissionSuccess"
      :form-data="mergedFormValues"
    />
    
    <!-- Show form if not submitted -->
    <template v-else>
      <!-- Header with back button and progress status -->
      <header class="form-header">
        <div class="header-container">
          <button class="back-button" @click="handleBack">
            <ChevronLeft class="back-icon" />
          </button>
          <div>
            <h1 class="form-title">Client Project Questionnaire</h1>
            <p class="form-subtitle">Let's create something amazing together</p>
          </div>
        </div>
      </header>

      <!-- Main content area with two-column layout -->
      <div class="form-container">
        <!-- Left sidebar with progress steps -->
        <nav class="steps-nav">
          <button
            v-for="step in steps"
            :key="step.id"
            class="step-button"
            :class="[
              currentStep === step.id
                ? 'step-button--active'
                : isStepCompleted(step.id)
                  ? 'step-button--completed'
                  : 'step-button--accessible'
            ]"
            @click="navigateToStep(step.id)"
          >
            <span
              class="step-number"
              :class="[
                currentStep === step.id
                  ? 'step-number--active'
                  : isStepCompleted(step.id)
                    ? 'step-number--completed'
                    : 'step-number--accessible'
              ]"
            >
              <component :is="step.icon" class="step-icon" />
            </span>
            <div class="step-content">
              <span class="step-title">{{ step.title }}</span>
              <span class="step-description">{{ step.description }}</span>
            </div>
            <!-- <StepProgress 
              :questions="getStepQuestions(step.id)"
              :form-values="form.values"
              :is-active="currentStep === step.id"
            /> -->
          </button>
        </nav>

        <!-- Main form content -->
        <main class="form-content">
          <!-- Submission error message -->
          <div v-if="submissionError" class="error-message">
            {{ submissionError }}
          </div>
          
          <component
            v-if="currentStepComponent"
            :is="currentStepComponent.component"
            v-bind="currentStepComponent.props"
            @submit="handleSubmit"
          />
        </main>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useForm, type FormContext } from 'vee-validate'
import { formSchema, aboutStepSchema, designStepSchema, functionalityStepSchema, logisticsStepSchema } from '@/clientForm/schema'
import { ChevronLeft, Globe2, Paintbrush2, Puzzle, Calendar } from 'lucide-vue-next'
import StepProgress from '@/components/ui/step-progress.vue'
import SubmissionSuccessView from './SubmissionSuccessView.vue'

// Import step components
import AboutStep from '@/clientForm/steps/AboutStep.vue'
import DesignStep from '@/clientForm/steps/DesignStep.vue'
import FunctionalityStep from '@/clientForm/steps/FunctionalityStep.vue'
import LogisticsStep from '@/clientForm/steps/LogisticsStep.vue'

// Import options and texts
import {
  fullBusinessDescOptions,
  fullTargetAudienceOptions,
  primaryGoalsOptions,
  aestheticStyleOptions,
  essentialPagesOptions,
  functionalityOptions,
  budgetTierOptions
} from '@/clientForm/options'
import { fieldTexts, type AllFieldTexts } from '@/clientForm/texts'

// Add class to body when component is mounted
onMounted(() => {
  document.body.classList.add('client-form-active')
})

// Remove class from body when component is unmounted
onUnmounted(() => {
  document.body.classList.remove('client-form-active')
})

// Steps configuration
const steps = [
  { 
    id: 'about', 
    number: 1, 
    title: 'Your Website',
    description: 'Tell us about your website needs',
    icon: Globe2
  },
  { 
    id: 'design', 
    number: 2, 
    title: 'Design Style',
    description: 'Choose your visual preferences',
    icon: Paintbrush2
  },
  { 
    id: 'functionality', 
    number: 3, 
    title: 'Features & Content',
    description: 'Select your website features',
    icon: Puzzle
  },
  { 
    id: 'logistics', 
    number: 4, 
    title: 'Project Details',
    description: 'Timeline and budget',
    icon: Calendar
  }
]

// Form setup with initial values from localStorage if available
const STORAGE_KEY = 'futoro-client-form-data'
const STORAGE_STEP_KEY = 'futoro-client-form-step'

// Load saved form data from localStorage
const loadSavedFormData = () => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY)
    return savedData ? JSON.parse(savedData) : {}
  } catch (error) {
    console.error('Error loading saved form data:', error)
    return {}
  }
}

// Load saved step from localStorage
const loadSavedStep = () => {
  try {
    const savedStep = localStorage.getItem(STORAGE_STEP_KEY)
    // Always start at 'about' step if we're loading fresh data
    if (!savedStep || Object.keys(loadSavedFormData()).length === 0) {
      return 'about';
    }
    return savedStep;
  } catch (error) {
    console.error('Error loading saved step:', error)
    return 'about'
  }
}

// Initialize form with saved data
const form = useForm({ 
  validationSchema: formSchema,
  initialValues: loadSavedFormData()
})

// Add logging for initial form setup
console.log('=== Initial Form Setup ===');
console.log('Initial form values:', form.values);
console.log('Initial form meta:', form.meta);

// Initialize current step with saved step
const currentStep = ref(loadSavedStep())

// Create a computed property for fieldTexts
const computedFieldTexts = computed<AllFieldTexts>(() => {
  return fieldTexts.value
})

// Save form data to localStorage whenever it changes
watch(() => form.values, (newValues) => {
  try {
    // Get existing data
    const existingData = localStorage.getItem(STORAGE_KEY);
    const existingValues = existingData ? JSON.parse(existingData) : {};
    
    // Merge new values with existing values, preserving all fields
    const mergedValues = {
      ...existingValues,
      ...newValues
    };
    
    // Save merged values
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedValues));
    console.log('Form values saved to localStorage:', mergedValues);
  } catch (error) {
    console.error('Error saving form values:', error);
  }
}, { deep: true });

// Save current step to localStorage whenever it changes
watch(() => currentStep.value, (newStep) => {
  try {
    localStorage.setItem(STORAGE_STEP_KEY, newStep)
  } catch (error) {
    console.error('Error saving current step:', error)
  }
});

// Form submission state
const isSubmitting = ref(false)
const submissionError = ref<string | null>(null)
const submissionSuccess = ref(false)

const emit = defineEmits<{
  (e: 'submit'): void;
  (e: 'back'): void;
  (e: 'next'): void;
}>();

// Handle form submission
const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    submissionError.value = null
    
    // Validate the entire form
    const { valid, errors } = await form.validate()
    
    if (!valid) {
      console.error('Form validation failed:', errors)
      submissionError.value = 'Please fix the errors in the form before submitting.'
      return
    }
    
    // Get saved data from localStorage
    const savedData = localStorage.getItem(STORAGE_KEY)
    const savedValues = savedData ? JSON.parse(savedData) : {}
    
    // Merge saved values with current form values
    const formValues = {
      ...savedValues,
      ...form.values,
      businessName: savedValues.businessName || form.values.businessName,
      businessDescription: savedValues.businessDescription || form.values.businessDescription,
      targetAudience: savedValues.targetAudience || form.values.targetAudience,
      primaryGoals: savedValues.primaryGoals || form.values.primaryGoals,
      hasLogo: savedValues.hasLogo || form.values.hasLogo,
      hasBrandColors: savedValues.hasBrandColors || form.values.hasBrandColors,
      hasBrandFonts: savedValues.hasBrandFonts || form.values.hasBrandFonts,
      brandColorsDescription: savedValues.brandColorsDescription || form.values.brandColorsDescription,
      brandFontsDescription: savedValues.brandFontsDescription || form.values.brandFontsDescription,
      aestheticStyle: savedValues.aestheticStyle || form.values.aestheticStyle,
      essentialPages: savedValues.essentialPages || form.values.essentialPages,
      desiredFeatures: savedValues.desiredFeatures || form.values.desiredFeatures,
      desiredFeaturesOther: savedValues.desiredFeaturesOther || form.values.desiredFeaturesOther,
      timeline: form.values.timeline || savedValues.timeline,
      budgetTier: form.values.budgetTier || savedValues.budgetTier
    }
    
    console.log('Complete form values for submission:', formValues)
    
    // Store the form values in localStorage before simulating submission
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formValues))
    
    // Here you would typically send the form data to your backend
    // For now, we'll just simulate a successful submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Set submission success and pass the complete form values
    submissionSuccess.value = true
    
    // Set the form values to ensure they're available for the success view
    Object.entries(formValues).forEach(([key, value]) => {
      form.setFieldValue(key, value)
    })
    
    emit('submit')
  } catch (error) {
    console.error('Error submitting form:', error)
    submissionError.value = 'An error occurred while submitting the form. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

const handleBack = () => emit('back');
const handleNext = () => emit('next');

// Navigation methods
const navigateToStep = async (stepId: string) => {
  try {
    console.log('Navigating to step:', stepId);
    console.log('Current form values before navigation:', form.values);
    
    // Only update the current step
    currentStep.value = stepId;
    
    console.log('Navigation complete. Form values:', form.values);
  } catch (error) {
    console.error('Error during navigation:', error);
  }
};

// Get the validation schema for the current step
const getCurrentStepSchema = () => {
  switch (currentStep.value) {
    case 'about':
      return aboutStepSchema;
    case 'design':
      return designStepSchema;
    case 'functionality':
      return functionalityStepSchema;
    case 'logistics':
      return logisticsStepSchema;
    default:
      return formSchema;
  }
};

// Validate the current step
const validateCurrentStep = async () => {
  try {
    const { valid, errors } = await form.validate();
    
    if (!valid) {
      console.log('Validation failed:', errors);
    }
    
    return valid;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
};

// Helper functions
function updateMultiSelectField(fieldName: string, newValue: unknown) {
  let finalValue: string[] = []
  if (Array.isArray(newValue)) {
    finalValue = newValue.map(item => String(item))
  } else if (newValue !== null && newValue !== undefined) {
    finalValue = [String(newValue)]
  }
  form.setFieldValue(fieldName, finalValue)
}

function toggleArrayItem(fieldName: string, itemValue: string) {
  const currentArray = (form.values[fieldName] as string[] | undefined) || []
  const itemIndex = currentArray.indexOf(itemValue)
  let updatedArray = [...currentArray]

  if (itemIndex > -1) {
    updatedArray.splice(itemIndex, 1)
  } else {
    updatedArray.push(itemValue)
  }
  form.setFieldValue(fieldName, updatedArray)

  // Clear other field if 'other' checkbox is unchecked
  if (fieldName === 'desiredFeatures' && itemValue === 'other_features' && itemIndex > -1) {
    form.setFieldValue('desiredFeaturesOther', undefined)
  }
}

// Define base props type
type BaseStepProps = {
  form: FormContext<any>;
  fieldTexts: AllFieldTexts | undefined;
  onNext?: () => void;
  onBack?: () => void;
  onSubmit?: () => void;
}

// Define component prop types
type AboutStepProps = BaseStepProps & {
  fullBusinessDescOptions: { value: string; label: string }[];
  fullTargetAudienceOptions: { value: string; label: string }[];
  primaryGoalsOptions: { value: string; label: string }[];
}

type DesignStepProps = BaseStepProps & {
  aestheticStyleOptions: { value: string; label: string; definition: string; style: string }[];
  updateMultiSelectField: (fieldName: string, newValue: unknown) => void;
}

type FunctionalityStepProps = BaseStepProps & {
  essentialPagesOptions: { value: string; label: string; definition: string }[];
  functionalityOptions: { category: string; definition: string; examples: { value: string; label: string }[] }[];
  updateMultiSelectField: (fieldName: string, newValue: unknown) => void;
  toggleArrayItem: (fieldName: string, itemValue: string) => void;
}

type LogisticsStepProps = BaseStepProps & {
  budgetOptions: { value: string; label: string; price: string; definition: string }[];
}

// Define component types
type StepComponent = typeof AboutStep | typeof DesignStep | typeof FunctionalityStep | typeof LogisticsStep
type StepProps = AboutStepProps | DesignStepProps | FunctionalityStepProps | LogisticsStepProps

// Dynamic component loading based on current step
const currentStepComponent = computed(() => {
  console.log('=== Component Switch ===');
  console.log('Switching to:', currentStep.value);
  
  // Remove localStorage operations from here since they're handled by the watcher
  
  switch (currentStep.value) {
    case 'about':
      const aboutProps = {
        form,
        fieldTexts: computedFieldTexts.value,
        fullBusinessDescOptions,
        fullTargetAudienceOptions,
        primaryGoalsOptions,
        onNext: () => {
          validateCurrentStep().then(valid => {
            if (valid) {
              currentStep.value = 'design';
            }
          });
        },
        onBack: handleBack,
        onSubmit: handleSubmit
      };
      return { component: AboutStep, props: aboutProps };

    case 'design':
      const designProps = {
        form,
        fieldTexts: computedFieldTexts.value,
        aestheticStyleOptions,
        updateMultiSelectField,
        onNext: () => {
          validateCurrentStep().then(valid => {
            if (valid) {
              currentStep.value = 'functionality';
            }
          });
        },
        onBack: () => {
          currentStep.value = 'about';
        },
        onSubmit: handleSubmit
      };
      return { component: DesignStep, props: designProps };

    case 'functionality':
      return {
        component: FunctionalityStep,
        props: {
          form,
          fieldTexts: computedFieldTexts.value,
          essentialPagesOptions,
          functionalityOptions,
          updateMultiSelectField,
          toggleArrayItem,
          onNext: () => {
            validateCurrentStep().then(valid => {
              if (valid) {
                currentStep.value = 'logistics';
              }
            });
          },
          onBack: () => {
            currentStep.value = 'design';
          },
          onSubmit: handleSubmit
        } as FunctionalityStepProps
      }
    case 'logistics':
      return {
        component: LogisticsStep,
        props: {
          form,
          fieldTexts: computedFieldTexts.value,
          budgetOptions: budgetTierOptions,
          onNext: () => {
            validateCurrentStep().then(valid => {
              if (valid) {
                handleSubmit();
              }
            });
          },
          onBack: () => {
            currentStep.value = 'functionality';
          },
          onSubmit: handleSubmit
        } as LogisticsStepProps
      }
    default:
      return null
  }
})

// Check if a step is completed
const isStepCompleted = (stepId: string) => {
  const stepIndex = steps.findIndex(step => step.id === stepId)
  const currentStepIndex = steps.findIndex(step => step.id === currentStep.value)
  
  // If the step is before the current step, consider it completed
  return stepIndex < currentStepIndex
}

// Check if a step is accessible
const isStepAccessible = (stepId: string) => {
  const stepIndex = steps.findIndex(step => step.id === stepId)
  const currentStepIndex = steps.findIndex(step => step.id === currentStep.value)
  
  // Allow access to completed steps or the next step
  return stepIndex <= currentStepIndex
}

// Define the questions for each step
const stepQuestions = {
  about: ['businessName', 'businessDescription', 'targetAudience', 'primaryGoals'],
  design: ['hasLogo', 'hasBrandColors', 'hasBrandFonts', 'aestheticStyle'],
  functionality: ['essentialPages', 'desiredFeatures'],
  logistics: ['projectTimeline', 'budgetRange']
} as const;

// Helper function to get questions for a step
const getStepQuestions = (stepId: string): string[] => {
  const questions = stepQuestions[stepId as keyof typeof stepQuestions] || [];
  return [...questions]; // Convert readonly array to regular array
};

// Helper function to check if a question is answered
const isQuestionAnswered = (stepId: string, questionId: string) => {
  const value = form.values[questionId];
  
  // Handle different types of values
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

// Create a computed property for merged form values
const mergedFormValues = computed(() => {
  const savedData = localStorage.getItem(STORAGE_KEY)
  const savedValues = savedData ? JSON.parse(savedData) : {}
  
  return {
    ...savedValues,
    ...form.values
  }
})
</script>

<style scoped>
.client-form {
  --form-primary: #6366F1;
  --form-primary-hover: #4F46E5;
  --form-bg: #ffffff;
  --form-text: #1F2937;
  --form-text-muted: #6B7280;
  --form-border: #E5E7EB;
  background-color: var(--form-bg);
  color: var(--form-text);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Default desktop styles */
.form-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  margin-top: 60px;
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 2rem;
}

.steps-nav {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.step-button {
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: row;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  background: none;
}

.step-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.step-button--active {
  background-color: var(--form-primary);
}

.step-button--active .step-title,
.step-button--active .step-description {
  color: white;
}

.step-button--active .step-description {
  display: block;
}

/* Mobile styles */
@media (max-width: 1023px) {
  .form-container {
    width: 100%;
    margin: 0;
    padding: 0;
    grid-template-columns: 1fr;
    gap: 0;
  }

  .steps-nav {
    position: sticky;
    top: 0;
    z-index: 10;
    margin-top: 0;
    flex-direction: row;
    justify-content: space-between;
    background-color: var(--form-bg);
    border-bottom: 1px solid var(--form-border);
    padding: 0.75rem 1rem;
    gap: 0;
  }

  .step-button {
    flex: 1;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;
    gap: 0.25rem;
    width: auto;
  }

  .step-content {
    display: none;
  }

  .step-button--active {
    flex: 3;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    background-color: transparent;
  }

  .step-button--active .step-content {
    display: block;
  }

  .step-button--active .step-title {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--form-primary);
    margin: 0;
  }

  .step-button--active .step-description {
    display: none;
  }

  .form-content {
    padding: 1rem;
  }
}

.form-header {
  background-color: var(--form-bg);
  border-bottom: 1px solid var(--form-border);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  border: 1px solid var(--form-border);
  background-color: white;
  color: var(--form-text);
  transition: all 0.2s ease;
}

.back-button:hover {
  background-color: #f3f4f6;
  transform: translateX(-2px);
}

.back-icon {
  width: 24px;
  height: 24px;
  stroke-width: 2px;
}

.form-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.125rem;
  color: var(--form-text);
}

.form-subtitle {
  font-size: 0.875rem;
  color: var(--form-text-muted);
}

.step-title {
  font-weight: 500;
  color: #1F2937;
}

.step-description {
  font-size: 0.75rem;
  color: #4B5563;
  text-align: left;
}

.step-button--active {
  background-color: var(--form-primary);
}

.step-button--active .step-title,
.step-button--active .step-description {
  color: white;
}

.step-button--completed .step-title {
  color: var(--form-primary);
}

.step-button--completed .step-description {
  color: #4F46E5;
}

.step-button--accessible .step-title {
  color: #1F2937;
}

.step-button--accessible .step-description {
  color: #4B5563;
}

.step-progress {
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

.step-button--completed .progress-dot,
.step-button--accessible .progress-dot {
  border-color: var(--form-primary);
}

.step-button--completed .progress-dot--filled,
.step-button--accessible .progress-dot--filled {
  background-color: var(--form-primary);
}

.step-button--active .progress-dot {
  border-color: white;
}

.step-button--active .progress-dot--filled {
  background-color: white;
}

.error-message {
  padding: 1rem;
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-radius: 0.375rem;
}

.success-message {
  padding: 1rem;
  background-color: rgba(99, 102, 241, 0.1);
  color: var(--form-primary);
  border-radius: 0.375rem;
}
</style> 