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
  <div id="futoro-client-form" class="min-h-screen bg-white">
    <!-- Header with back button and progress status -->
    <header class="border-b">
      <div class="container flex h-16 items-center px-4">
        <button class="mr-4" @click="handleBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <div>
          <h1 class="text-lg font-semibold">Client Project Questionnaire</h1>
          <p class="text-sm text-muted-foreground">Let's create something amazing together</p>
        </div>
      </div>
    </header>

    <!-- Main content area with two-column layout -->
    <div class="container grid grid-cols-[240px_1fr] gap-8 px-4 py-12 flex-grow mt-[300px]">
      <!-- Left sidebar with progress steps -->
      <nav class="space-y-2 mt-4">
        <button
          v-for="step in steps"
          :key="step.id"
          class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors"
          :class="[
            currentStep === step.id
              ? 'bg-[#6366F1] text-white'
              : isStepCompleted(step.id)
                ? 'text-[#6366F1] hover:bg-gray-50'
                : isStepAccessible(step.id)
                  ? 'hover:bg-gray-50 text-gray-700'
                  : 'opacity-50 cursor-not-allowed'
          ]"
          @click="isStepAccessible(step.id) && navigateToStep(step.id)"
          :disabled="!isStepAccessible(step.id)"
        >
          <span
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-center text-xs"
            :class="[
              currentStep === step.id
                ? 'border-white bg-white text-[#6366F1]'
                : isStepCompleted(step.id)
                  ? 'border-[#6366F1] bg-[#6366F1] text-white'
                  : isStepAccessible(step.id)
                    ? 'border-gray-300'
                    : 'border-gray-200'
            ]"
          >
            {{ step.number }}
          </span>
          <div class="flex flex-col items-start">
            <span class="font-medium">{{ step.title }}</span>
            <span class="text-xs text-gray-500 text-left">{{ step.description }}</span>
          </div>
        </button>
      </nav>

      <!-- Main form content -->
      <main class="space-y-8">
        <!-- Submission error message -->
        <div v-if="submissionError" class="p-4 bg-destructive/10 text-destructive rounded-md">
          {{ submissionError }}
        </div>
        
        <!-- Submission success message -->
        <div v-if="submissionSuccess" class="p-4 bg-primary/10 text-primary rounded-md">
          Thank you for submitting your questionnaire! We'll be in touch soon.
        </div>
        
        <component
          v-if="currentStepComponent"
          :is="currentStepComponent.component"
          v-bind="currentStepComponent.props"
          @submit="handleSubmit"
        />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useForm, type FormContext } from 'vee-validate'
import { formSchema, aboutStepSchema, designStepSchema, functionalityStepSchema, logisticsStepSchema } from '@/clientForm/schema'

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

// Steps configuration
const steps = [
  { 
    id: 'about', 
    number: 1, 
    title: 'About Your Website',
    description: 'Tell us the basics about what you need your website to do and who it\'s for.'
  },
  { 
    id: 'design', 
    number: 2, 
    title: 'How You Want It To Look & Feel',
    description: 'Share your ideas about the style and overall impression you want your website to have.'
  },
  { 
    id: 'functionality', 
    number: 3, 
    title: 'What Your Website Will Do & Say',
    description: 'Tell us about the specific features you need and the kind of information your website will include.'
  },
  { 
    id: 'logistics', 
    number: 4, 
    title: 'Website Details & How We\'ll Work Together',
    description: 'Cover the more technical aspects and how we\'ll communicate and manage the project together.'
  }
]

// Form setup with initial values from localStorage if available
const STORAGE_KEY = 'futoro-client-form-data'
const STORAGE_STEP_KEY = 'futoro-client-form-step'

// Load saved form data from localStorage
const loadSavedFormData = () => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY)
    console.log('Loading saved form data from localStorage:', savedData);
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
    console.log('Loading saved step from localStorage:', savedStep);
    // Always start at 'about' step if we're loading fresh data
    if (!savedStep || Object.keys(loadSavedFormData()).length === 0) {
      console.log('No saved data found, starting at about step');
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

// Log initial form values
console.log('Initial form values:', form.values);

// Initialize current step with saved step
const currentStep = ref(loadSavedStep())
console.log('Initial current step:', currentStep.value);

// Create a computed property for fieldTexts
const computedFieldTexts = computed<AllFieldTexts>(() => {
  return fieldTexts.value
})

// Save form data to localStorage whenever it changes
watch(() => form.values, (newValues) => {
  try {
    console.log('Saving form values to localStorage:', newValues);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newValues))
  } catch (error) {
    console.error('Error saving form data:', error)
  }
}, { deep: true })

// Save current step to localStorage whenever it changes
watch(() => currentStep.value, (newStep) => {
  try {
    console.log('Saving current step to localStorage:', newStep);
    localStorage.setItem(STORAGE_STEP_KEY, newStep)
  } catch (error) {
    console.error('Error saving current step:', error)
  }
})

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
    
    // Here you would typically send the form data to your backend
    // For now, we'll just simulate a successful submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Clear saved form data after successful submission
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STORAGE_STEP_KEY)
    
    submissionSuccess.value = true
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
const navigateToStep = (stepId: string) => {
  console.log('navigateToStep called');
  console.log('Target step:', stepId);
  console.log('Current step:', currentStep.value);
  
  // Only allow navigation to completed steps or the next step
  const currentStepIndex = steps.findIndex(step => step.id === currentStep.value)
  const targetStepIndex = steps.findIndex(step => step.id === stepId)
  
  console.log('Current step index:', currentStepIndex);
  console.log('Target step index:', targetStepIndex);
  
  // Allow going back to any previous step
  if (targetStepIndex < currentStepIndex) {
    console.log('Navigating back to previous step');
    currentStep.value = stepId
    return
  }
  
  // Only allow going forward one step at a time
  if (targetStepIndex === currentStepIndex + 1) {
    console.log('Navigating to next step');
    currentStep.value = stepId
    return
  }
  
  // For other steps, validate the current step first
  console.log('Validating current step before navigation');
  validateCurrentStep().then(valid => {
    console.log('Validation result for navigation:', valid);
    if (valid) {
      console.log('Validation passed, navigating to step:', stepId);
      currentStep.value = stepId
    } else {
      console.log('Validation failed, staying on current step');
    }
  })
  console.log('navigateToStep completed');
}

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
  console.log('validateCurrentStep called');
  console.log('Current step:', currentStep.value);
  console.log('Current form values:', form.values);
  
  // Use the step-specific schema for validation
  const stepSchema = getCurrentStepSchema();
  console.log('Using schema for step:', currentStep.value);
  
  try {
    // Validate using the current form instance
    const { valid, errors } = await form.validate();
    console.log('Validation result:', valid);
    if (!valid) {
      console.log('Validation errors:', errors);
    }
    console.log('validateCurrentStep completed');
    return valid;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
}

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
  budgetTierOptions: { value: string; label: string; price: string; definition: string }[];
  toggleArrayItem: (fieldName: string, itemValue: string) => void;
}

// Define component types
type StepComponent = typeof AboutStep | typeof DesignStep | typeof FunctionalityStep | typeof LogisticsStep
type StepProps = AboutStepProps | DesignStepProps | FunctionalityStepProps | LogisticsStepProps

// Dynamic component loading based on current step
const currentStepComponent = computed(() => {
  console.log('currentStepComponent computed');
  console.log('Current step:', currentStep.value);
  console.log('Current form values:', form.values);
  
  switch (currentStep.value) {
    case 'about':
      const aboutStepProps = {
        form,
        fieldTexts: computedFieldTexts.value,
        fullBusinessDescOptions,
        fullTargetAudienceOptions,
        primaryGoalsOptions,
        onNext: () => {
          console.log('AboutStep onNext function called');
          console.log('Current form values:', form.values);
          validateCurrentStep().then(valid => {
            console.log('AboutStep validation result:', valid);
            if (valid) {
              console.log('AboutStep validation valid, navigating to design');
              currentStep.value = 'design';
              console.log('currentStep.value after navigation:', currentStep.value);
            } else {
              console.log('AboutStep validation failed');
            }
          });
        },
        onBack: handleBack,
        onSubmit: handleSubmit
      } as AboutStepProps;
      
      console.log('AboutStep props:', aboutStepProps);
      console.log('AboutStep onNext type:', typeof aboutStepProps.onNext);
      
      return {
        component: AboutStep,
        props: aboutStepProps
      }
    case 'design':
      return {
        component: DesignStep,
        props: {
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
        } as DesignStepProps
      }
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
          budgetTierOptions,
          toggleArrayItem,
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
</script>

<style scoped>
#futoro-client-form {
  --form-primary: #6366F1;
  --form-primary-hover: #4F46E5;
  --form-bg: #ffffff;
  --form-text: #1F2937;
  --form-text-muted: #6B7280;
  --form-border: #E5E7EB;
}

#futoro-client-form {
  background-color: var(--form-bg);
  color: var(--form-text);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

#futoro-client-form header {
  background-color: var(--form-bg);
  border-color: var(--form-border);
}

#futoro-client-form .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  margin-top: 200px;
   /* margin-top: 300px;* dont erase this */ 
}

#futoro-client-form button {
  transition: all 0.2s ease;
}

#futoro-client-form button:hover {
  transform: translateY(-1px);
}

#futoro-client-form .text-muted-foreground {
  color: var(--form-text-muted);
}
</style> 