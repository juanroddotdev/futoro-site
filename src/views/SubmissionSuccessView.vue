<template>
  <div class="submission-success">
    <div class="success-card">
      <div class="success-header">
        <h1 class="success-title">Thank You!</h1>
        <p class="success-message">Your project questionnaire has been submitted successfully. We'll review your responses and get back to you soon.</p>
      </div>

      <div class="answers-summary">
        <h2 class="summary-title">Your Project Details</h2>
        
        <!-- About Section -->
        <div class="summary-section">
          <h3 class="section-title">About Your Website</h3>
          <div class="answer-grid">
            <div class="answer-item">
              <span class="answer-label">Business Name:</span>
              <span class="answer-value">{{ formData.businessName }}</span>
            </div>
            <div class="answer-item">
              <span class="answer-label">Business Description:</span>
              <span class="answer-value">{{ formatArray(formData.businessDescription) }}</span>
            </div>
            <div class="answer-item">
              <span class="answer-label">Target Audience:</span>
              <span class="answer-value">{{ formatArray(formData.targetAudience) }}</span>
            </div>
            <div class="answer-item">
              <span class="answer-label">Primary Goals:</span>
              <span class="answer-value">{{ formatArray(formData.primaryGoals) }}</span>
            </div>
          </div>
        </div>

        <!-- Design Section -->
        <div class="summary-section">
          <h3 class="section-title">Design Style</h3>
          <div class="answer-grid">
            <div class="answer-item">
              <span class="answer-label">Has Logo:</span>
              <span class="answer-value">{{ formData.hasLogo ? 'Yes' : 'No' }}</span>
            </div>
            <div class="answer-item">
              <span class="answer-label">Has Brand Colors:</span>
              <span class="answer-value">{{ formData.hasBrandColors ? 'Yes' : 'No' }}</span>
            </div>
            <div class="answer-item">
              <span class="answer-label">Has Brand Fonts:</span>
              <span class="answer-value">{{ formData.hasBrandFonts ? 'Yes' : 'No' }}</span>
            </div>
            <div class="answer-item">
              <span class="answer-label">Aesthetic Style:</span>
              <span class="answer-value">{{ formatArray(formData.aestheticStyle) }}</span>
            </div>
            <div v-if="formData.brandColorsDescription" class="answer-item">
              <span class="answer-label">Brand Colors Description:</span>
              <span class="answer-value">{{ formData.brandColorsDescription }}</span>
            </div>
            <div v-if="formData.brandFontsDescription" class="answer-item">
              <span class="answer-label">Brand Fonts Description:</span>
              <span class="answer-value">{{ formData.brandFontsDescription }}</span>
            </div>
          </div>
        </div>

        <!-- Functionality Section -->
        <div class="summary-section">
          <h3 class="section-title">Features & Content</h3>
          <div class="answer-grid">
            <div class="answer-item">
              <span class="answer-label">Essential Pages:</span>
              <span class="answer-value">{{ formatArray(formData.essentialPages) }}</span>
            </div>
            <div class="answer-item">
              <span class="answer-label">Desired Features:</span>
              <span class="answer-value">{{ formatArray(formData.desiredFeatures) }}</span>
            </div>
            <div v-if="formData.desiredFeaturesOther" class="answer-item">
              <span class="answer-label">Other Features:</span>
              <span class="answer-value">{{ formData.desiredFeaturesOther }}</span>
            </div>
          </div>
        </div>

        <!-- Logistics Section -->
        <div class="summary-section">
          <h3 class="section-title">Project Details</h3>
          <div class="answer-grid">
            <div class="answer-item">
              <span class="answer-label">Project Timeline:</span>
              <span class="answer-value">{{ formData.timeline }}</span>
            </div>
            <div class="answer-item">
              <span class="answer-label">Budget Range:</span>
              <span class="answer-value">{{ formData.budgetTier }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="success-footer">
        <p class="next-steps">What's Next?</p>
        <ul class="steps-list">
          <li>We'll review your questionnaire within 24 hours</li>
          <li>Our team will prepare a customized proposal</li>
          <li>We'll schedule a call to discuss your project in detail</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  formData: any;
}>();

// Add logging to debug form data
console.log('SubmissionSuccessView - Received formData:', props.formData);

// Helper function to format array values
const formatArray = (value: any) => {
  if (!value) return 'Not specified';
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  return value;
};
</script>

<style scoped>
.submission-success {
  min-height: 100vh;
  padding: 2rem;
  background-color: #f9fafb;
}

.success-card {
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.success-header {
  padding: 2rem;
  text-align: center;
  background-color: #6366F1;
  color: white;
}

.success-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.success-message {
  font-size: 1.125rem;
  opacity: 0.9;
}

.answers-summary {
  padding: 2rem;
}

.summary-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #1F2937;
}

.summary-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #E5E7EB;
}

.summary-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 1rem;
}

.answer-grid {
  display: grid;
  gap: 1rem;
}

.answer-item {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1rem;
  padding: 0.5rem;
  background-color: #F9FAFB;
  border-radius: 0.5rem;
}

.answer-label {
  font-weight: 500;
  color: #4B5563;
}

.answer-value {
  color: #1F2937;
}

.success-footer {
  padding: 2rem;
  background-color: #F3F4F6;
  text-align: center;
}

.next-steps {
  font-size: 1.25rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 1rem;
}

.steps-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
}

.steps-list li {
  padding: 0.5rem 0;
  color: #4B5563;
  position: relative;
  padding-left: 1.5rem;
}

.steps-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #6366F1;
}

@media (max-width: 640px) {
  .answer-item {
    grid-template-columns: 1fr;
  }
  
  .answer-label {
    margin-bottom: 0.25rem;
  }
}
</style> 