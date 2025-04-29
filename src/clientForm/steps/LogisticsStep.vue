<script setup lang="ts">
import { ref, computed } from 'vue';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Check } from 'lucide-vue-next';

// Types
import type { AllFieldTexts } from '../texts';
import type { BudgetTierOption } from '../options';

// Props
const props = defineProps<{
  form: any;
  fieldTexts: AllFieldTexts | undefined;
  budgetOptions: BudgetTierOption[];
  onNext?: () => void;
  onBack?: () => void;
}>();

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
</script>

<template>
  <div class="logistics-step">
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Project Details</h2>
        <p class="card-description">Let's discuss your timeline and budget for this project.</p>
      </div>
      <div class="card-content">
        <!-- Project Timeline -->
        <div class="section">
          <h3 class="section-title">Project Timeline</h3>
          <FormField name="timeline" v-slot="{ field }">
            <div class="form-item">
              <FormLabel :for="field.name">{{ props.fieldTexts?.projectTimeline?.label }}</FormLabel>
              <FormControl>
                <RadioGroup
                  :model-value="field.value"
                  @update:model-value="field.onChange"
                  class="timeline-grid"
                >
                  <button
                    v-for="option in props.fieldTexts?.projectTimeline?.options"
                    :key="String(option.value)"
                    type="button"
                    class="timeline-card"
                    :class="{ 'timeline-card--selected': field.value === String(option.value) }"
                    @click="field.onChange(String(option.value))"
                  >
                    <div class="timeline-card__radio">
                      <RadioGroupItem
                        :id="field.name + '-' + String(option.value)"
                        :value="String(option.value)"
                        class="sr-only"
                      />
                      <div class="timeline-card__radio-icon">
                        <div class="timeline-card__radio-dot"></div>
                      </div>
                    </div>
                    <div class="timeline-card__content">
                      <h4 class="timeline-card__title">{{ option.label }}</h4>
                    </div>
                  </button>
                </RadioGroup>
              </FormControl>
              <FormDescription v-if="props.fieldTexts?.projectTimeline?.description">
                {{ props.fieldTexts?.projectTimeline.description }}
              </FormDescription>
              <FormMessage />
            </div>
          </FormField>
        </div>

        <!-- Budget Tiers -->
        <div class="section">
          <h3 class="section-title">Budget Range</h3>
          <FormField name="budgetTier" v-slot="{ field }">
            <div class="form-item">
              <FormLabel :for="field.name">{{ props.fieldTexts?.budgetTier?.label }}</FormLabel>
              <FormControl>
                <RadioGroup
                  :model-value="field.value"
                  @update:model-value="field.onChange"
                  class="budget-grid"
                >
                  <button
                    v-for="option in props.budgetOptions"
                    :key="option.value"
                    type="button"
                    class="budget-card"
                    :class="{ 'budget-card--selected': field.value === option.value }"
                    @click="field.onChange(option.value)"
                  >
                    <div class="budget-card__radio">
                      <RadioGroupItem
                        :id="field.name + '-' + option.value"
                        :value="option.value"
                        class="sr-only"
                      />
                      <div class="budget-card__radio-icon">
                        <div class="budget-card__radio-dot"></div>
                      </div>
                    </div>
                    <div class="budget-card__content">
                      <h4 class="budget-card__title">{{ option.label }}</h4>
                      <p class="budget-card__price">{{ option.price }}</p>
                      <p class="budget-card__description">{{ option.definition }}</p>
                    </div>
                  </button>
                </RadioGroup>
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
.logistics-step {
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

.timeline-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}

@media (min-width: 640px) {
  .timeline-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.timeline-card {
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

.timeline-card:hover {
  border-color: var(--form-primary);
  background-color: var(--form-primary-light);
}

.timeline-card--selected {
  border-color: var(--form-primary);
  background-color: var(--form-primary-light);
}

.timeline-card__radio {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.125rem;
}

.timeline-card__radio-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: 2px solid var(--form-border);
  border-radius: 50%;
  transition: all 0.2s ease;
}

.timeline-card--selected .timeline-card__radio-icon {
  border-color: var(--form-primary);
}

.timeline-card__radio-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: transparent;
  transition: all 0.2s ease;
}

.timeline-card--selected .timeline-card__radio-dot {
  background-color: var(--form-primary);
}

.timeline-card__content {
  flex: 1;
  min-width: 0;
}

.timeline-card__title {
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
  color: var(--form-text);
}

.budget-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}

@media (min-width: 640px) {
  .budget-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .budget-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.budget-card {
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

.budget-card:hover {
  border-color: var(--form-primary);
  background-color: var(--form-primary-light);
}

.budget-card--selected {
  border-color: var(--form-primary);
  background-color: var(--form-primary-light);
}

.budget-card__radio {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.125rem;
}

.budget-card__radio-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: 2px solid var(--form-border);
  border-radius: 50%;
  transition: all 0.2s ease;
}

.budget-card--selected .budget-card__radio-icon {
  border-color: var(--form-primary);
}

.budget-card__radio-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: transparent;
  transition: all 0.2s ease;
}

.budget-card--selected .budget-card__radio-dot {
  background-color: var(--form-primary);
}

.budget-card__content {
  flex: 1;
  min-width: 0;
}

.budget-card__title {
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
  color: var(--form-text);
}

.budget-card__price {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--form-primary);
  margin: 0.25rem 0;
}

.budget-card__description {
  font-size: 0.75rem;
  color: var(--form-text-muted);
  line-height: 1.4;
  margin-top: 0.25rem;
}
</style> 