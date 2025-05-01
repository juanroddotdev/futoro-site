<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Field as VeeField } from 'vee-validate';
import { VeeValidateAdapter } from '../validation/veeValidateAdapter';
import type { ValidationSchema } from '../validation/types';

// UI components
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Check } from 'lucide-vue-next';

// Types
import type { AllFieldTexts } from '../texts';

// Define validation schema for all fields
const validationSchema: ValidationSchema = {
  businessName: {
    required: true,
    min: 2,
    max: 100,
    custom: (value: string) => {
      if (!value) return 'Business name is required';
      if (value.length < 2) return 'Business name must be at least 2 characters';
      if (value.length > 100) return 'Business name must be less than 100 characters';
      return true;
    }
  },
  businessDescription: {
    required: true,
    custom: (value: string[]) => {
      if (!value || value.length === 0) return 'At least one business description is required';
      return true;
    }
  },
  targetAudience: {
    required: true,
    custom: (value: string[]) => {
      if (!value || value.length === 0) return 'At least one target audience is required';
      return true;
    }
  },
  primaryGoals: {
    required: true,
    custom: (value: string[]) => {
      if (!value || value.length === 0) return 'At least one primary goal is required';
      return true;
    }
  }
};

// Initialize validator
const validator = new VeeValidateAdapter(validationSchema);

// Props
const props = defineProps<{
  form: any;
  fieldTexts: AllFieldTexts | undefined;
  fullBusinessDescOptions: any[];
  fullTargetAudienceOptions: any[];
  primaryGoalsOptions: any[];
  onNext?: (() => void) | (() => void)[];
  onBack?: () => void;
  onSubmit?: () => void;
}>();

// Search states
const businessDescSearch = ref('');
const targetAudienceSearch = ref('');
const primaryGoalsSearch = ref('');

// Filtered options
const filteredBusinessDescOptions = computed(() => {
  const customOptions = (props.form.values.businessDescription || [])
    .filter((value: string) => !props.fullBusinessDescOptions.some(option => option.value === value))
    .map((value: string) => ({ value, label: value }));

  const filteredPredefined = props.fullBusinessDescOptions.filter((option: { label: string }) => 
    option.label.toLowerCase().includes(businessDescSearch.value.toLowerCase())
  );

  const filteredCustom = customOptions.filter((option: { label: string }) =>
    option.label.toLowerCase().includes(businessDescSearch.value.toLowerCase())
  );

  return [...filteredPredefined, ...filteredCustom];
});

const filteredTargetAudienceOptions = computed(() => {
  const customOptions = (props.form.values.targetAudience || [])
    .filter((value: string) => !props.fullTargetAudienceOptions.some(option => option.value === value))
    .map((value: string) => ({ value, label: value }));

  const filteredPredefined = props.fullTargetAudienceOptions.filter((option: { label: string }) => 
    option.label.toLowerCase().includes(targetAudienceSearch.value.toLowerCase())
  );

  const filteredCustom = customOptions.filter((option: { label: string }) =>
    option.label.toLowerCase().includes(targetAudienceSearch.value.toLowerCase())
  );

  return [...filteredPredefined, ...filteredCustom];
});

const filteredPrimaryGoalsOptions = computed(() => {
  const customOptions = (props.form.values.primaryGoals || [])
    .filter((value: string) => !props.primaryGoalsOptions.some(option => option.value === value))
    .map((value: string) => ({ value, label: value }));

  const filteredPredefined = props.primaryGoalsOptions.filter((option: { label: string }) => 
    option.label.toLowerCase().includes(primaryGoalsSearch.value.toLowerCase())
  );

  const filteredCustom = customOptions.filter((option: { label: string }) =>
    option.label.toLowerCase().includes(primaryGoalsSearch.value.toLowerCase())
  );

  return [...filteredPredefined, ...filteredCustom];
});

// Selection handlers
const toggleSelection = (field: string, value: string) => {
  const currentValues = props.form.values[field] || [];
  const index = currentValues.indexOf(value);
  
  if (index === -1) {
    props.form.setFieldValue(field, [...currentValues, value]);
  } else {
    props.form.setFieldValue(field, currentValues.filter((v: string) => v !== value));
  }
};

const handleSearchKeydown = (field: string, searchValue: string, event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    const value = searchValue.trim();
    if (!value) return;
    
    // Check if the value matches any existing option
    const options = field === 'businessDescription' 
      ? props.fullBusinessDescOptions 
      : field === 'targetAudience'
        ? props.fullTargetAudienceOptions
        : props.primaryGoalsOptions;
    
    const matchingOption = options.find(option => 
      option.label.toLowerCase() === value.toLowerCase()
    );
    
    if (matchingOption) {
      // If it matches an existing option, toggle its selection
      toggleSelection(field, matchingOption.value);
    } else {
      // If it doesn't match, add it as a custom option
      const currentValues = props.form.values[field] || [];
      if (!currentValues.includes(value)) {
        props.form.setFieldValue(field, [...currentValues, value]);
      }
    }
    
    // Clear the search input
    if (field === 'businessDescription') {
      businessDescSearch.value = '';
    } else if (field === 'targetAudience') {
      targetAudienceSearch.value = '';
    } else {
      primaryGoalsSearch.value = '';
    }
  }
};

// Debug logs
onMounted(() => {
  // Component mounted
});

// Emits
const emit = defineEmits<{
  (e: 'next'): void;
  (e: 'back'): void;
  (e: 'submit'): void;
}>();

// Access form values
const formValues = computed(() => props.form?.values ?? {});

// Add validation for all fields
const businessNameError = ref('');
const businessDescriptionError = ref('');
const targetAudienceError = ref('');
const primaryGoalsError = ref('');

const validateBusinessName = async (value: string) => {
  try {
    const result = await validator.validateField('businessName', value);
    businessNameError.value = result.errors.businessName || '';
    return result.valid;
  } catch (error) {
    console.error('Validation error:', error);
    businessNameError.value = 'An error occurred during validation';
    return false;
  }
};

const validateBusinessDescription = async (value: string[]) => {
  try {
    const result = await validator.validateField('businessDescription', value);
    businessDescriptionError.value = result.errors.businessDescription || '';
    return result.valid;
  } catch (error) {
    console.error('Validation error:', error);
    businessDescriptionError.value = 'An error occurred during validation';
    return false;
  }
};

const validateTargetAudience = async (value: string[]) => {
  try {
    const result = await validator.validateField('targetAudience', value);
    targetAudienceError.value = result.errors.targetAudience || '';
    return result.valid;
  } catch (error) {
    console.error('Validation error:', error);
    targetAudienceError.value = 'An error occurred during validation';
    return false;
  }
};

const validatePrimaryGoals = async (value: string[]) => {
  try {
    const result = await validator.validateField('primaryGoals', value);
    primaryGoalsError.value = result.errors.primaryGoals || '';
    return result.valid;
  } catch (error) {
    console.error('Validation error:', error);
    primaryGoalsError.value = 'An error occurred during validation';
    return false;
  }
};

// Watch for changes in all fields to validate
watch(() => props.form.values.businessDescription, (newValue) => {
  validateBusinessDescription(newValue || []);
}, { deep: true });

watch(() => props.form.values.targetAudience, (newValue) => {
  validateTargetAudience(newValue || []);
}, { deep: true });

watch(() => props.form.values.primaryGoals, (newValue) => {
  validatePrimaryGoals(newValue || []);
}, { deep: true });

// Handle next step
const handleNext = async () => {
  const { valid } = await props.form.validate();
  if (valid) {
    if (props.onNext) {
      if (Array.isArray(props.onNext)) {
        props.onNext.forEach(fn => fn());
      } else {
        props.onNext();
      }
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
</script>

<template>
  <div class="about-step">
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">About Your Website</h2>
        <p class="card-description">In this section, tell us the basics about what you need your website to do and who it's for.</p>
      </div>
      <div class="card-content">
        <!-- Business Name -->
        <FormField v-slot="{ componentField }" name="businessName">
          <FormItem>
            <FormLabel :for="componentField.name">{{ props.fieldTexts?.businessName?.label }}</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                @input="(e: Event) => validateBusinessName((e.target as HTMLInputElement).value)"
                :placeholder="props.fieldTexts?.businessName?.placeholder"
              />
            </FormControl>
            <FormMessage v-if="businessNameError">{{ businessNameError }}</FormMessage>
          </FormItem>
        </FormField>

        <!-- Business Description -->
        <FormField name="businessDescription" v-slot="{ field, errors }">
          <FormItem>
            <FormLabel :for="field.name">{{ props.fieldTexts?.businessDescription?.label }}</FormLabel>
            <div class="search-container">
              <Input
                v-model="businessDescSearch"
                type="text"
                placeholder="Search or add custom option..."
                class="search-input"
                @keydown="(e: KeyboardEvent) => handleSearchKeydown('businessDescription', businessDescSearch, e)"
              >
                <template #prefix>
                  <Search class="search-icon" />
                </template>
              </Input>
            </div>
            <div class="feature-grid">
              <button
                v-for="option in filteredBusinessDescOptions"
                :key="option.value"
                type="button"
                class="feature-card"
                :class="{ 'feature-card--selected': (field.value || []).includes(option.value) }"
                @click="toggleSelection('businessDescription', option.value)"
              >
                <div class="feature-card__checkbox">
                  <div class="feature-card__checkbox-icon">
                    <Check v-if="(field.value || []).includes(option.value)" class="h-4 w-4" />
                  </div>
                </div>
                <div class="feature-card__content">
                  <h4 class="feature-card__title">{{ option.label }}</h4>
                  <p v-if="option.definition" class="feature-card__description">{{ option.definition }}</p>
                </div>
              </button>
            </div>
            <FormDescription v-if="props.fieldTexts?.businessDescription?.description">
              {{ props.fieldTexts?.businessDescription.description }}
            </FormDescription>
            <FormMessage v-if="businessDescriptionError">{{ businessDescriptionError }}</FormMessage>
          </FormItem>
        </FormField>

        <!-- Target Audience -->
        <FormField name="targetAudience" v-slot="{ field, errors }">
          <FormItem>
            <FormLabel :for="field.name">{{ props.fieldTexts?.targetAudience?.label }}</FormLabel>
            <div class="search-container">
              <Input
                v-model="targetAudienceSearch"
                type="text"
                placeholder="Search or add custom option..."
                class="search-input"
                @keydown="(e: KeyboardEvent) => handleSearchKeydown('targetAudience', targetAudienceSearch, e)"
              >
                <template #prefix>
                  <Search class="search-icon" />
                </template>
              </Input>
            </div>
            <div class="feature-grid">
              <button
                v-for="option in filteredTargetAudienceOptions"
                :key="option.value"
                type="button"
                class="feature-card"
                :class="{ 'feature-card--selected': (field.value || []).includes(option.value) }"
                @click="toggleSelection('targetAudience', option.value)"
              >
                <div class="feature-card__checkbox">
                  <div class="feature-card__checkbox-icon">
                    <Check v-if="(field.value || []).includes(option.value)" class="h-4 w-4" />
                  </div>
                </div>
                <div class="feature-card__content">
                  <h4 class="feature-card__title">{{ option.label }}</h4>
                  <p v-if="option.definition" class="feature-card__description">{{ option.definition }}</p>
                </div>
              </button>
            </div>
            <FormDescription v-if="props.fieldTexts?.targetAudience?.description">
              {{ props.fieldTexts?.targetAudience.description }}
            </FormDescription>
            <FormMessage v-if="targetAudienceError">{{ targetAudienceError }}</FormMessage>
          </FormItem>
        </FormField>

        <!-- Primary Goals -->
        <FormField name="primaryGoals" v-slot="{ field, errors }">
          <FormItem>
            <FormLabel :for="field.name">{{ props.fieldTexts?.primaryGoals?.label }}</FormLabel>
            <div class="search-container">
              <Input
                v-model="primaryGoalsSearch"
                type="text"
                placeholder="Search or add custom option..."
                class="search-input"
                @keydown="(e: KeyboardEvent) => handleSearchKeydown('primaryGoals', primaryGoalsSearch, e)"
              >
                <template #prefix>
                  <Search class="search-icon" />
                </template>
              </Input>
            </div>
            <div class="feature-grid">
              <button
                v-for="option in filteredPrimaryGoalsOptions"
                :key="option.value"
                type="button"
                class="feature-card"
                :class="{ 'feature-card--selected': (field.value || []).includes(option.value) }"
                @click="toggleSelection('primaryGoals', option.value)"
              >
                <div class="feature-card__checkbox">
                  <div class="feature-card__checkbox-icon">
                    <Check v-if="(field.value || []).includes(option.value)" class="h-4 w-4" />
                  </div>
                </div>
                <div class="feature-card__content">
                  <h4 class="feature-card__title">{{ option.label }}</h4>
                  <p v-if="option.definition" class="feature-card__description">{{ option.definition }}</p>
                </div>
              </button>
            </div>
            <FormDescription v-if="props.fieldTexts?.primaryGoals?.description">
              {{ props.fieldTexts?.primaryGoals.description }}
            </FormDescription>
            <FormMessage v-if="primaryGoalsError">{{ primaryGoalsError }}</FormMessage>
          </FormItem>
        </FormField>
      </div>
      <div class="card-footer">
        <Button type="button" variant="outline" @click="handleBack">Back</Button>
        <Button type="button" @click="handleNext">Continue</Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-step {
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

.form-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.search-container {
  display: flex;
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
}

.search-icon {
  width: 1rem;
  height: 1rem;
  color: var(--form-text-muted);
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
  color: var(--form-text);
}

.feature-card__description {
  font-size: 0.75rem;
  color: var(--form-text-muted);
  line-height: 1.4;
  margin-top: 0.25rem;
}
</style> 