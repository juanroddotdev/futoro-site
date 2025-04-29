import { defineStore } from 'pinia'
import type { FormData, FormStep, ValidationError } from '../types/FormTypes'

interface FormState {
  formData: Partial<FormData>;
  currentStep: FormStep;
  isSubmitted: boolean;
  validationErrors: ValidationError[];
  isSubmitting: boolean;
}

export const useFormStore = defineStore('form', {
  state: (): FormState => ({
    formData: {},
    currentStep: 'about',
    isSubmitted: false,
    validationErrors: [],
    isSubmitting: false
  }),

  getters: {
    // Get specific form field value
    getField: (state) => (field: keyof FormData) => {
      return state.formData[field]
    },

    // Check if current step is valid
    isStepValid: (state) => (step: FormStep): boolean => {
      const requiredFields: Record<FormStep, Array<keyof FormData>> = {
        about: ['businessName', 'businessDescription', 'targetAudience', 'primaryGoals'],
        design: ['hasLogo', 'hasBrandColors', 'hasBrandFonts', 'aestheticStyle'],
        functionality: ['essentialPages', 'desiredFeatures'],
        logistics: ['timeline', 'budgetTier']
      }

      return requiredFields[step].every(field => {
        const value = state.formData[field]
        if (Array.isArray(value)) {
          return value.length > 0
        }
        return value !== undefined && value !== ''
      })
    },

    // Check if form is complete
    isFormComplete: (state) => {
      const steps: FormStep[] = ['about', 'design', 'functionality', 'logistics'];
      return steps.every(step => {
        const requiredFields = state.formData;
        const stepFields: Record<FormStep, Array<keyof FormData>> = {
          about: ['businessName', 'businessDescription', 'targetAudience', 'primaryGoals'],
          design: ['hasLogo', 'hasBrandColors', 'hasBrandFonts', 'aestheticStyle'],
          functionality: ['essentialPages', 'desiredFeatures'],
          logistics: ['timeline', 'budgetTier']
        };

        return stepFields[step]?.every(field => {
          const value = requiredFields[field];
          if (Array.isArray(value)) {
            return value.length > 0;
          }
          return value !== undefined && value !== '';
        }) ?? false;
      });
    }
  },

  actions: {
    // Update a single form field
    updateField<K extends keyof FormData>(field: K, value: FormData[K]) {
      this.formData[field] = value
    },

    // Update multiple fields at once
    updateFields(fields: Partial<FormData>) {
      this.formData = { ...this.formData, ...fields }
    },

    // Set current step
    setStep(step: FormStep) {
      this.currentStep = step
    },

    // Navigate to next step
    nextStep() {
      const steps: FormStep[] = ['about', 'design', 'functionality', 'logistics']
      const currentIndex = steps.indexOf(this.currentStep)
      if (currentIndex < steps.length - 1) {
        this.currentStep = steps[currentIndex + 1]
      }
    },

    // Navigate to previous step
    previousStep() {
      const steps: FormStep[] = ['about', 'design', 'functionality', 'logistics']
      const currentIndex = steps.indexOf(this.currentStep)
      if (currentIndex > 0) {
        this.currentStep = steps[currentIndex - 1]
      }
    },

    // Add validation error
    addValidationError(error: ValidationError) {
      this.validationErrors.push(error)
    },

    // Clear validation errors
    clearValidationErrors() {
      this.validationErrors = []
    },

    // Reset form state
    resetForm() {
      this.formData = {}
      this.currentStep = 'about'
      this.isSubmitted = false
      this.validationErrors = []
      this.isSubmitting = false
    },

    // Submit form
    async submitForm() {
      if (!this.isFormComplete) {
        return false
      }

      try {
        this.isSubmitting = true
        // Here you would typically send the form data to your backend
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.isSubmitted = true
        return true
      } catch (error) {
        console.error('Error submitting form:', error)
        return false
      } finally {
        this.isSubmitting = false
      }
    }
  }
}) 