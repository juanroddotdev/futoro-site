import { defineStore } from 'pinia'

interface FormSubmissionState {
  formData: any
  isSubmitted: boolean
  submissionError: string | null
}

export const useFormSubmissionStore = defineStore('formSubmission', {
  state: (): FormSubmissionState => ({
    formData: {},
    isSubmitted: false,
    submissionError: null
  }),

  actions: {
    setFormData(data: any) {
      this.formData = data
    },

    setSubmitted(status: boolean) {
      this.isSubmitted = status
    },

    setSubmissionError(error: string | null) {
      this.submissionError = error
    },

    resetState() {
      this.formData = {}
      this.isSubmitted = false
      this.submissionError = null
    }
  }
}) 