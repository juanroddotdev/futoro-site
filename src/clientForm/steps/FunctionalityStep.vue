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
  console.log('FunctionalityStep mounted');
  console.log('Form values:', props.form?.values);
  console.log('Essential pages options:', props.essentialPagesOptions);
  console.log('Essential pages value:', props.form?.values?.essentialPages);
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
  console.log('FunctionalityStep handleNext called');
  console.log('Current form values:', props.form?.values);
  console.log('Essential pages value:', props.form?.values?.essentialPages);
  
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
const updateCheckboxValue = (field: any, optionValue: string, checked: boolean) => {
  console.log('Updating checkbox value:', { fieldName: field.name, optionValue, checked });
  console.log('Current field value:', field.value);
  
  const currentValue = field.value || [];
  let newValue;
  
  if (checked) {
    newValue = [...currentValue, optionValue];
  } else {
    newValue = currentValue.filter((v: string) => v !== optionValue);
  }
  
  console.log('New field value:', newValue);
  field.value = newValue;
  
  // Ensure the form object is updated
  if (props.form && props.form.setFieldValue) {
    props.form.setFieldValue(field.name, newValue);
  }
};
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>What Your Website Will Do & Say</CardTitle>
        <CardDescription>This is where you'll tell us about the specific features you need and the kind of information (content) your website will include.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-8">
        <!-- Essential Pages -->
        <FormField name="essentialPages" v-slot="{ field }">
          <FormItem>
            <FormLabel :for="field.name">{{ props.fieldTexts?.essentialPages?.label }}</FormLabel>
            <FormControl>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div v-for="option in props.essentialPagesOptions" :key="option.value" class="flex items-start space-x-3 space-y-0">
                  <Checkbox
                    :id="option.value"
                    :checked="field.value?.includes(option.value)"
                    @update:checked="(checked: boolean) => updateCheckboxValue(field, option.value, checked)"
                  />
                  <div class="grid gap-1.5 leading-none">
                    <label
                      :for="option.value"
                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {{ option.label }}
                    </label>
                    <p class="text-sm text-muted-foreground">{{ option.definition }}</p>
                  </div>
                </div>
              </div>
            </FormControl>
            <FormDescription v-if="props.fieldTexts?.essentialPages?.description">
              {{ props.fieldTexts?.essentialPages.description }}
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </CardContent>
      <CardFooter class="flex justify-between">
        <Button type="button" variant="outline" @click="handleBack">Back</Button>
        <Button type="button" @click="handleNext">Continue</Button>
      </CardFooter>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Desired Features</CardTitle>
        <CardDescription>Select the features you want for your website.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-8">
        <!-- Desired Features -->
        <div v-for="category in props.functionalityOptions" :key="category.category" class="space-y-6">
          <h3 class="text-lg font-medium">{{ category.category }}</h3>
          <p class="text-sm text-muted-foreground">{{ category.definition }}</p>
          
          <FormField name="desiredFeatures" v-slot="{ field }">
            <FormItem>
              <FormControl>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div v-for="option in category.examples" :key="option.value" class="flex items-start space-x-3 space-y-0">
                    <Checkbox
                      :id="option.value"
                      :checked="field.value?.includes(option.value)"
                      @update:checked="(checked: boolean) => updateCheckboxValue(field, option.value, checked)"
                    />
                    <div class="grid gap-1.5 leading-none">
                      <label
                        :for="option.value"
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {{ option.label }}
                      </label>
                    </div>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          
          <!-- Other Features -->
          <FormField v-if="formValues.desiredFeatures?.includes('other_features')" name="desiredFeaturesOther" v-slot="{ componentField }">
            <FormItem>
              <FormLabel :for="componentField.name">{{ props.fieldTexts?.desiredFeaturesOther?.label }}</FormLabel>
              <FormControl>
                <Textarea 
                  v-bind="componentField"
                  :placeholder="props.fieldTexts?.desiredFeaturesOther?.placeholder"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </CardContent>
      <CardFooter class="flex justify-between">
        <Button type="button" variant="outline" @click="handleBack">Back</Button>
        <Button type="button" @click="handleNext">Continue</Button>
      </CardFooter>
    </Card>
  </div>
</template>

<style scoped>
/* Add any specific styles needed */
</style> 