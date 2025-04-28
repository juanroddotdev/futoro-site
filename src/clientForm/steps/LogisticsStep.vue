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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Types
import type { AllFieldTexts } from '../texts';

// Props
const props = defineProps<{
  form: any;
  fieldTexts: AllFieldTexts | undefined;
  budgetTierOptions: any[];
  toggleArrayItem: (fieldName: string, itemValue: string) => void;
  onNext?: () => void;
  onBack?: () => void;
  onSubmit?: () => void;
}>();

// Emits
const emit = defineEmits<{
  (e: 'next'): void;
  (e: 'back'): void;
  (e: 'submit'): void;
}>();

// Access form values
const formValues = computed(() => props.form?.values ?? {});

// Handle navigation
const handleNext = async () => {
  const { valid } = await props.form.validate();
  if (valid) {
    if (props.onSubmit) {
      props.onSubmit();
    } else {
      emit('submit');
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
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
        <CardDescription>Let's discuss the project timeline, budget, and how we'll work together.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-8">
        <!-- Timeline -->
        <div class="space-y-4">
          <div>
            <h3 class="text-base font-medium">Timeline</h3>
          </div>

          <FormField name="projectTimeline" v-slot="{ field }">
            <FormItem>
              <FormLabel :for="field.name">{{ props.fieldTexts?.projectTimeline?.label }}</FormLabel>
              <FormControl class="mt-2">
                <RadioGroup 
                  :model-value="String(field.value || '')"
                  @update:model-value="(value: string) => field.onChange(value)" 
                  class="space-y-2"
                >
                  <FormItem v-for="option in props.fieldTexts?.projectTimeline?.options" :key="String(option.value)" class="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem :id="field.name + '-' + option.value" :value="String(option.value)" />
                    </FormControl>
                    <FormLabel :for="field.name + '-' + option.value" class="font-normal">{{ option.label }}</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- Budget -->
        <div class="space-y-4">
          <div>
            <h3 class="text-base font-medium">Budget</h3>
          </div>

          <FormField name="budgetTier" v-slot="{ field }">
            <FormItem>
              <FormLabel :for="field.name">{{ props.fieldTexts?.budgetTier?.label }}</FormLabel>
              <FormControl class="mt-2">
                <RadioGroup 
                  :model-value="String(field.value || '')"
                  @update:model-value="(value: string) => field.onChange(value)" 
                  class="space-y-2"
                >
                  <FormItem v-for="option in props.budgetTierOptions" :key="String(option.value)" class="flex items-start space-x-2">
                    <FormControl>
                      <RadioGroupItem :id="field.name + '-' + option.value" :value="String(option.value)" />
                    </FormControl>
                    <div class="space-y-1 leading-none">
                      <FormLabel :for="field.name + '-' + option.value" class="font-normal">{{ option.label }}</FormLabel>
                      <FormDescription v-if="option.definition">
                        {{ option.definition }}
                      </FormDescription>
                      <div v-if="option.price" class="text-sm font-medium text-primary">
                        {{ option.price }}
                      </div>
                    </div>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- Contact Information -->
        <div class="space-y-4">
          <div>
            <h3 class="text-base font-medium">Contact Information</h3>
            <p class="text-sm text-muted-foreground">{{ props.fieldTexts?.pointOfContactGroup?.intro }}</p>
          </div>

          <div class="space-y-4">
            <FormField name="contactName" v-slot="{ componentField }">
              <FormItem>
                <FormLabel :for="componentField.name">{{ props.fieldTexts?.contactName?.label }}</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="text" :placeholder="props.fieldTexts?.contactName?.placeholder" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="contactEmail" v-slot="{ componentField }">
              <FormItem>
                <FormLabel :for="componentField.name">{{ props.fieldTexts?.contactEmail?.label }}</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="email" :placeholder="props.fieldTexts?.contactEmail?.placeholder" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="contactPhone" v-slot="{ componentField }">
              <FormItem>
                <FormLabel :for="componentField.name">{{ props.fieldTexts?.contactPhone?.label }}</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="tel" :placeholder="props.fieldTexts?.contactPhone?.placeholder" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>

        <!-- Additional Comments -->
        <div class="space-y-4">
          <FormField name="additionalComments" v-slot="{ componentField }">
            <FormItem>
              <FormLabel :for="componentField.name">{{ props.fieldTexts?.additionalComments?.label }}</FormLabel>
              <FormControl>
                <Textarea 
                  v-bind="componentField"
                  :placeholder="props.fieldTexts?.additionalComments?.placeholder"
                  rows="4"
                />
              </FormControl>
              <FormDescription v-if="props.fieldTexts?.additionalComments?.description">
                {{ props.fieldTexts?.additionalComments.description }}
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </CardContent>
      <CardFooter class="flex justify-between">
        <Button type="button" variant="outline" @click="handleBack">Back</Button>
        <Button type="button" @click="handleNext">Submit Questionnaire</Button>
      </CardFooter>
    </Card>
  </div>
</template>

<style scoped>
/* Add any specific styles needed */
</style> 