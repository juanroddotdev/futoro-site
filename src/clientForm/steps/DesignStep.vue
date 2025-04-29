<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import Multiselect from '@vueform/multiselect';
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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Check } from 'lucide-vue-next';
import { Input } from '@/components/ui/input';

// Types
import type { AllFieldTexts } from '../texts';

// Props
const props = defineProps<{
  form: any;
  fieldTexts: AllFieldTexts | undefined;
  aestheticStyleOptions: any[];
  updateMultiSelectField: (fieldName: string, newValue: unknown) => void;
  onNext?: () => void;
  onBack?: () => void;
  modelValue?: DesignFormValues;
}>();

// Custom input for aesthetic style
const aestheticStyleCustom = ref('');

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

const addCustomAestheticStyle = () => {
  const value = aestheticStyleCustom.value.trim();
  if (!value) return;
  
  const currentValues = props.form.values.aestheticStyle || [];
  if (!currentValues.includes(value)) {
    props.form.setFieldValue('aestheticStyle', [...currentValues, value]);
  }
  aestheticStyleCustom.value = '';
};

// Debug logs
onMounted(() => {
  // Load saved form data
  const savedData = localStorage.getItem('futoro-client-form-data');
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    // Set form values for this step
    if (parsedData.hasLogo !== undefined) {
      props.form.setFieldValue('hasLogo', parsedData.hasLogo);
    }
    if (parsedData.hasBrandColors !== undefined) {
      props.form.setFieldValue('hasBrandColors', parsedData.hasBrandColors);
    }
    if (parsedData.hasBrandFonts !== undefined) {
      props.form.setFieldValue('hasBrandFonts', parsedData.hasBrandFonts);
    }
    if (parsedData.aestheticStyle !== undefined) {
      props.form.setFieldValue('aestheticStyle', parsedData.aestheticStyle);
    }
    if (parsedData.brandColorsDescription !== undefined) {
      props.form.setFieldValue('brandColorsDescription', parsedData.brandColorsDescription);
    }
    if (parsedData.brandFontsDescription !== undefined) {
      props.form.setFieldValue('brandFontsDescription', parsedData.brandFontsDescription);
    }
  }
  
  // Log current form values when returning to the step
  console.log('DesignStep - Current form values:', {
    hasLogo: props.form.values.hasLogo,
    hasBrandColors: props.form.values.hasBrandColors,
    hasBrandFonts: props.form.values.hasBrandFonts,
    aestheticStyle: props.form.values.aestheticStyle,
    brandColorsDescription: props.form.values.brandColorsDescription,
    brandFontsDescription: props.form.values.brandFontsDescription
  });
});

interface DesignFormValues {
  logo?: string;
  brandColors?: string[];
  brandFonts?: string[];
  [key: string]: any;
}

const emit = defineEmits<{
  (e: 'update:modelValue', value: DesignFormValues): void;
  (e: 'field-change', payload: { field: string; value: any; isAnswered: boolean }): void;
  (e: 'next'): void;
  (e: 'back'): void;
}>();

// Access form values
const formValues = computed(() => props.form?.values ?? {});

// Initialize modelValue if not provided
const localModelValue = ref<DesignFormValues>(props.modelValue ?? {});

// Handle navigation
const handleNext = async () => {
  const { valid } = await props.form.validate();
  if (valid) {
    // Log form values before proceeding to next step
    console.log('DesignStep - Proceeding to next step with values:', {
      hasLogo: props.form.values.hasLogo,
      hasBrandColors: props.form.values.hasBrandColors,
      hasBrandFonts: props.form.values.hasBrandFonts,
      aestheticStyle: props.form.values.aestheticStyle,
      brandColorsDescription: props.form.values.brandColorsDescription,
      brandFontsDescription: props.form.values.brandFontsDescription
    });
    
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

const handleFieldChange = (field: string, value: any) => {
  const updatedValue = {
    ...localModelValue.value,
    [field]: value
  };
  localModelValue.value = updatedValue;
  emit('update:modelValue', updatedValue);
  emit('field-change', {
    field,
    value,
    isAnswered: value !== undefined && value !== null && (value !== '' || value === false)
  });
};

// Add watchers for each field to ensure proper progress tracking
watch(() => localModelValue.value.logo, (newValue) => {
  if (newValue !== undefined) {
    handleFieldChange('logo', newValue);
  }
}, { immediate: true });

watch(() => localModelValue.value.brandColors, (newValue) => {
  if (newValue !== undefined) {
    handleFieldChange('brandColors', newValue);
  }
}, { immediate: true });

watch(() => localModelValue.value.brandFonts, (newValue) => {
  if (newValue !== undefined) {
    handleFieldChange('brandFonts', newValue);
  }
}, { immediate: true });

// Watch for external modelValue changes
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    localModelValue.value = { ...newValue };
  }
}, { deep: true });
</script>

<template>
  <div class="design-step">
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">How You Want It To Look & Feel</h2>
        <p class="card-description">Here, you can share your ideas about the style and overall impression you want your website to have.</p>
      </div>
      <div class="card-content">
        <!-- Brand Assets Section -->
        <div class="section">
          <h3 class="section-title">Brand Assets</h3>
          
          <!-- Logo -->
          <FormField name="hasLogo" v-slot="{ field }">
            <div class="form-item">
              <FormLabel :for="field.name">{{ props.fieldTexts?.hasLogo?.label }}</FormLabel>
              <FormControl>
                <div class="feature-grid">
                  <button
                    v-for="option in props.fieldTexts?.hasLogo?.options"
                    :key="String(option.value)"
                    type="button"
                    class="feature-card"
                    :class="{ 'feature-card--selected': field.value === option.value }"
                    @click="field.onChange(option.value)"
                  >
                    <div class="feature-card__checkbox">
                      <div class="feature-card__checkbox-icon">
                        <Check v-if="field.value === option.value" class="h-4 w-4" />
                      </div>
                    </div>
                    <div class="feature-card__content">
                      <h4 class="feature-card__title">{{ option.label }}</h4>
                      <p v-if="option.description" class="feature-card__description">{{ option.description }}</p>
                    </div>
                  </button>
                </div>
              </FormControl>
              <FormMessage />
              <FormDescription v-if="formValues.hasLogo === true && props.fieldTexts?.hasLogo?.conditionalText?.['true']" v-html="props.fieldTexts.hasLogo.conditionalText['true']">
              </FormDescription>
              <FormDescription v-if="formValues.hasLogo === false && props.fieldTexts?.hasLogo?.conditionalText?.['false']" v-html="props.fieldTexts.hasLogo.conditionalText['false']">
              </FormDescription>
            </div>
          </FormField>

          <!-- Brand Colors -->
          <FormField name="hasBrandColors" v-slot="{ field }">
            <div class="form-item">
              <FormLabel :for="field.name">{{ props.fieldTexts?.hasBrandColors?.label }}</FormLabel>
              <FormControl>
                <div class="feature-grid">
                  <button
                    v-for="option in props.fieldTexts?.hasBrandColors?.options"
                    :key="String(option.value)"
                    type="button"
                    class="feature-card"
                    :class="{ 'feature-card--selected': field.value === option.value }"
                    @click="field.onChange(option.value)"
                  >
                    <div class="feature-card__checkbox">
                      <div class="feature-card__checkbox-icon">
                        <Check v-if="field.value === option.value" class="h-4 w-4" />
                      </div>
                    </div>
                    <div class="feature-card__content">
                      <h4 class="feature-card__title">{{ option.label }}</h4>
                      <p v-if="option.description" class="feature-card__description">{{ option.description }}</p>
                    </div>
                  </button>
                </div>
              </FormControl>
              <FormMessage />
              <FormDescription v-if="formValues.hasBrandColors === true && props.fieldTexts?.hasBrandColors?.conditionalText?.['true']" v-html="props.fieldTexts.hasBrandColors.conditionalText['true']">
              </FormDescription>
              <FormDescription v-if="formValues.hasBrandColors === false && props.fieldTexts?.hasBrandColors?.conditionalText?.['false']" v-html="props.fieldTexts.hasBrandColors.conditionalText['false']">
              </FormDescription>
            </div>

            <!-- Conditional textarea for brand colors description -->
            <FormField v-if="formValues.hasBrandColors === true" name="brandColorsDescription" v-slot="{ componentField }">
              <div class="form-item mt-2 pl-2">
                <FormLabel :for="componentField.name" class="sr-only">Brand Colors Description</FormLabel>
                <FormControl>
                  <Textarea
                    v-bind="componentField"
                    :placeholder="props.fieldTexts?.brandColorsDescription?.placeholder"
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormField>
          </FormField>

          <!-- Brand Fonts -->
          <FormField name="hasBrandFonts" v-slot="{ field }">
            <div class="form-item">
              <FormLabel :for="field.name">{{ props.fieldTexts?.hasBrandFonts?.label }}</FormLabel>
              <FormControl>
                <div class="feature-grid">
                  <button
                    v-for="option in props.fieldTexts?.hasBrandFonts?.options"
                    :key="String(option.value)"
                    type="button"
                    class="feature-card"
                    :class="{ 'feature-card--selected': field.value === option.value }"
                    @click="field.onChange(option.value)"
                  >
                    <div class="feature-card__checkbox">
                      <div class="feature-card__checkbox-icon">
                        <Check v-if="field.value === option.value" class="h-4 w-4" />
                      </div>
                    </div>
                    <div class="feature-card__content">
                      <h4 class="feature-card__title">{{ option.label }}</h4>
                      <p v-if="option.description" class="feature-card__description">{{ option.description }}</p>
                    </div>
                  </button>
                </div>
              </FormControl>
              <FormMessage />
              <FormDescription v-if="formValues.hasBrandFonts === true && props.fieldTexts?.hasBrandFonts?.conditionalText?.['true']" v-html="props.fieldTexts.hasBrandFonts.conditionalText['true']">
              </FormDescription>
              <FormDescription v-if="formValues.hasBrandFonts === false && props.fieldTexts?.hasBrandFonts?.conditionalText?.['false']" v-html="props.fieldTexts.hasBrandFonts.conditionalText['false']">
              </FormDescription>
            </div>

            <!-- Conditional textarea for brand fonts description -->
            <FormField v-if="formValues.hasBrandFonts === true" name="brandFontsDescription" v-slot="{ componentField }">
              <div class="form-item mt-2 pl-2">
                <FormLabel :for="componentField.name" class="sr-only">Brand Fonts Description</FormLabel>
                <FormControl>
                  <Textarea
                    v-bind="componentField"
                    :placeholder="props.fieldTexts?.brandFontsDescription?.placeholder"
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormField>
          </FormField>
        </div>

        <!-- Aesthetic Style -->
        <FormField name="aestheticStyle" v-slot="{ field, errors }">
          <div class="form-item">
            <FormLabel :for="field.name">{{ props.fieldTexts?.aestheticStyle?.label }}</FormLabel>
            <FormControl>
              <div class="feature-grid">
                <button
                  v-for="option in props.aestheticStyleOptions"
                  :key="option.value"
                  type="button"
                  class="feature-card"
                  :class="{ 'feature-card--selected': (field.value || []).includes(option.value) }"
                  @click="toggleSelection('aestheticStyle', option.value)"
                  :title="option.definition"
                >
                  <div class="feature-card__checkbox">
                    <div class="feature-card__checkbox-icon">
                      <Check v-if="(field.value || []).includes(option.value)" class="h-4 w-4" />
                    </div>
                  </div>
                  <div class="feature-card__content">
                    <h4 class="feature-card__title">{{ option.label }}</h4>
                    <p class="feature-card__description">{{ option.definition }}</p>
                  </div>
                </button>
              </div>
              <!-- Custom input for aesthetic style -->
              <div class="mt-4">
                <Input
                  v-model="aestheticStyleCustom"
                  type="text"
                  placeholder="Add custom style..."
                  @keyup.enter="addCustomAestheticStyle"
                />
              </div>
            </FormControl>
            <FormDescription v-if="props.fieldTexts?.aestheticStyle?.description">
              {{ props.fieldTexts?.aestheticStyle.description }}
            </FormDescription>
            <FormMessage />
          </div>
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
.design-step {
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
  font-size: 1rem;
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
  color: var(--form-text);
}

.feature-card__description {
  font-size: 0.75rem;
  color: var(--form-text-muted);
  line-height: 1.4;
  margin-top: 0.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style> 