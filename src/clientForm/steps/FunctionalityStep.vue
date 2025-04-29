<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Field as VeeField } from 'vee-validate';

// UI components
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-vue-next';

// Types
import type { AllFieldTexts } from '../texts';

// Props
const props = defineProps<{
  form: any;
  fieldTexts: AllFieldTexts | undefined;
  essentialPagesOptions: any[];
  functionalityOptions: any[];
  updateMultiSelectField: (fieldName: string, newValue: unknown) => void;
  toggleArrayItem: (fieldName: string, itemValue: string) => void;
  onNext?: () => void;
  onBack?: () => void;
}>();

// Debug logs
onMounted(() => {
  // Load saved form data
  const savedData = localStorage.getItem('futoro-client-form-data');
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    // Set form values for this step
    if (parsedData.essentialPages !== undefined) {
      props.form.setFieldValue('essentialPages', parsedData.essentialPages);
    }
    if (parsedData.desiredFeatures !== undefined) {
      props.form.setFieldValue('desiredFeatures', parsedData.desiredFeatures);
    }
    if (parsedData.desiredFeaturesOther !== undefined) {
      props.form.setFieldValue('desiredFeaturesOther', parsedData.desiredFeaturesOther);
    }
  }
});

// Emits
const emit = defineEmits<{
  (e: 'next'): void;
  (e: 'back'): void;
}>();

// Access form values
const formValues = computed(() => props.form?.values ?? {});

// Handle navigation
const handleNext = async () => {
  const { valid } = await props.form.validate();
  if (valid) {
    if (props.onNext) {
      props.onNext();
    } else {
      emit('next');
    }
  }
};

const handleBack = () => {
  if (props.onBack) {
    props.onBack();
  } else {
    emit('back');
  }
};

// Helper function to update checkbox values
const updateCheckboxValue = (field: any, value: string, checked: boolean) => {
  const currentValue = field.value || [];
  if (checked) {
    field.onChange([...currentValue, value]);
  } else {
    field.onChange(currentValue.filter((v: string) => v !== value));
  }
};
</script>

<template>
  <div class="functionality-step">
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Features & Content</h2>
        <p class="card-description">Select the pages and features you want for your website.</p>
      </div>
      <div class="card-content">
        <!-- Essential Pages -->
        <div class="section">
          <h3 class="section-title">Essential Pages</h3>
          <FormField name="essentialPages" v-slot="{ field }">
            <div class="form-item">
              <FormLabel :for="field.name">{{ props.fieldTexts?.essentialPages?.label }}</FormLabel>
              <FormControl>
                <div class="feature-grid">
                  <button
                    v-for="option in props.essentialPagesOptions"
                    :key="option.value"
                    type="button"
                    class="feature-card"
                    :class="{ 'feature-card--selected': field.value?.includes(option.value) }"
                    @click="updateCheckboxValue(field, option.value, !field.value?.includes(option.value))"
                    :title="option.definition"
                  >
                    <div class="feature-card__checkbox">
                      <Checkbox
                        :id="option.value"
                        :checked="field.value?.includes(option.value)"
                        class="sr-only"
                      />
                      <div class="feature-card__checkbox-icon">
                        <Check v-if="field.value?.includes(option.value)" class="h-4 w-4" />
                      </div>
                    </div>
                    <div class="feature-card__content">
                      <h4 class="feature-card__title">{{ option.label }}</h4>
                      <p class="feature-card__description">{{ option.definition }}</p>
                    </div>
                  </button>
                </div>
              </FormControl>
              <FormDescription v-if="props.fieldTexts?.essentialPages?.description">
                {{ props.fieldTexts?.essentialPages.description }}
              </FormDescription>
              <FormMessage />
            </div>
          </FormField>
        </div>

        <!-- Desired Features -->
        <div class="section">
          <h3 class="section-title">Desired Features</h3>
          <div v-for="category in props.functionalityOptions" :key="category.category" class="feature-category">
            <h4 class="category-title">{{ category.category }}</h4>
            <p class="category-description">{{ category.definition }}</p>
            
            <FormField name="desiredFeatures" v-slot="{ field }">
              <div class="form-item">
                <FormControl>
                  <div class="feature-grid">
                    <button
                      v-for="option in category.examples"
                      :key="option.value"
                      type="button"
                      class="feature-card"
                      :class="{ 'feature-card--selected': field.value?.includes(option.value) }"
                      @click="updateCheckboxValue(field, option.value, !field.value?.includes(option.value))"
                    >
                      <div class="feature-card__checkbox">
                        <Checkbox
                          :id="option.value"
                          :checked="field.value?.includes(option.value)"
                          class="sr-only"
                        />
                        <div class="feature-card__checkbox-icon">
                          <Check v-if="field.value?.includes(option.value)" class="h-4 w-4" />
                        </div>
                      </div>
                      <div class="feature-card__content">
                        <h4 class="feature-card__title">{{ option.label }}</h4>
                      </div>
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </div>
            </FormField>
          </div>
          
          <!-- Other Features -->
          <FormField v-if="formValues.desiredFeatures?.includes('other_features')" name="desiredFeaturesOther" v-slot="{ componentField }">
            <div class="form-item">
              <FormLabel :for="componentField.name">{{ props.fieldTexts?.desiredFeaturesOther?.label }}</FormLabel>
              <FormControl>
                <Textarea 
                  v-bind="componentField"
                  :placeholder="props.fieldTexts?.desiredFeaturesOther?.placeholder"
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormField>
        </div>
      </div>
      <div class="card-footer">
        <Button type="button" variant="outline" @click="handleBack">Back</Button>
        <Button type="button" @click="handleNext">Continue</Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.functionality-step {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card {
  background-color: white;
  border-radius: 0.5rem;
  border: 1px solid var(--form-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--form-border);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card-description {
  color: var(--form-text-muted);
  font-size: 0.875rem;
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.card-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--form-border);
  display: flex;
  justify-content: space-between;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 500;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}

@media (min-width: 640px) {
  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .feature-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--form-border);
  border-radius: 0.5rem;
  background-color: white;
  text-align: left;
  transition: all 0.2s ease;
  cursor: pointer;
  width: 100%;
}

.feature-card:hover {
  border-color: var(--form-primary);
  background-color: var(--form-primary-light);
}

.feature-card--selected {
  border-color: var(--form-primary);
  background-color: var(--form-primary-light);
}

.feature-card__checkbox {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.125rem;
}

.feature-card__checkbox-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: 2px solid var(--form-border);
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.feature-card--selected .feature-card__checkbox-icon {
  border-color: var(--form-primary);
  background-color: var(--form-primary);
  color: white;
}

.feature-card__content {
  flex: 1;
  min-width: 0;
}

.feature-card__title {
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
  /* margin-bottom: 0.25rem; */
  color: var(--form-text);
  /* margin-top: 0; */
}

.feature-card__description {
  font-size: 0.75rem;
  color: var(--form-text-muted);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.feature-category {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-title {
  font-size: 1rem;
  font-weight: 500;
  color: var(--form-text);
}

.category-description {
  font-size: 0.875rem;
  color: var(--form-text-muted);
  margin-bottom: 0.5rem;
}
</style> 