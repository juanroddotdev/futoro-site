<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Types
import type { AllFieldTexts } from '../texts';

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

// Debug logs
onMounted(() => {
  console.log('AboutStep mounted');
  console.log('Form values:', props.form?.values);
  console.log('Field texts:', props.fieldTexts);
  console.log('onNext prop:', props.onNext);
  console.log('onNext prop type:', typeof props.onNext);
  console.log('onNext is array:', Array.isArray(props.onNext));
});

// Emits
const emit = defineEmits<{
  (e: 'next'): void;
  (e: 'back'): void;
  (e: 'submit'): void;
}>();

// Access form values
const formValues = computed(() => props.form?.values ?? {});

// Handle next step
const handleNext = async () => {
  console.log('AboutStep handleNext called');
  console.log('Current form values:', props.form?.values);
  console.log('onNext prop:', props.onNext);
  console.log('onNext prop type:', typeof props.onNext);
  console.log('onNext is array:', Array.isArray(props.onNext));
  
  if (props.onNext && typeof props.onNext === 'function') {
    console.log('Calling onNext prop function directly');
    props.onNext();
  } else if (Array.isArray(props.onNext) && props.onNext.length > 0 && typeof props.onNext[0] === 'function') {
    console.log('Calling first function from onNext array');
    props.onNext[0]();
  } else {
    console.log('Falling back to emitting next event');
    emit('next');
  }
  console.log('AboutStep handleNext completed');
};
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>About Your Website</CardTitle>
        <CardDescription>In this section, tell us the basics about what you need your website to do and who it's for.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-8">
        <!-- Business Name -->
        <FormField v-slot="{ componentField }" name="businessName">
          <FormItem>
            <FormLabel :for="componentField.name">{{ props.fieldTexts?.businessName?.label }}</FormLabel>
            <FormControl>
              <Input 
                v-bind="componentField" 
                type="text" 
                :placeholder="props.fieldTexts?.businessName?.placeholder"
              />
            </FormControl>
            <FormDescription v-if="props.fieldTexts?.businessName?.description">
              {{ props.fieldTexts?.businessName.description }}
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Business Description -->
        <FormField name="businessDescription" v-slot="{ field, errors }">
          <FormItem>
            <FormLabel :for="field.name">{{ props.fieldTexts?.businessDescription?.label }}</FormLabel>
            <FormControl>
              <Multiselect
                :id="field.name"
                v-bind="field"
                mode="tags"
                :options="props.fullBusinessDescOptions"
                :searchable="true"
                :create-tag="true"
                :placeholder="props.fieldTexts?.businessDescription?.placeholder"
                :close-on-select="false"
                :class="{ 'multiselect-invalid': errors.length > 0 }"
              />
            </FormControl>
            <FormDescription v-if="props.fieldTexts?.businessDescription?.description">
              {{ props.fieldTexts?.businessDescription.description }}
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Target Audience -->
        <FormField name="targetAudience" v-slot="{ field, errors }">
          <FormItem>
            <FormLabel :for="field.name">{{ props.fieldTexts?.targetAudience?.label }}</FormLabel>
            <FormControl>
              <Multiselect
                :id="field.name"
                v-bind="field"
                mode="tags"
                :options="props.fullTargetAudienceOptions"
                :searchable="true"
                :create-tag="true"
                :placeholder="props.fieldTexts?.targetAudience?.placeholder"
                :close-on-select="false"
                :class="{ 'multiselect-invalid': errors.length > 0 }"
              />
            </FormControl>
            <FormDescription v-if="props.fieldTexts?.targetAudience?.description">
              {{ props.fieldTexts?.targetAudience.description }}
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Primary Goals -->
        <FormField name="primaryGoals" v-slot="{ field, errors }">
          <FormItem>
            <FormLabel :for="field.name">{{ props.fieldTexts?.primaryGoals?.label }}</FormLabel>
            <FormControl>
              <Multiselect
                :id="field.name"
                v-bind="field"
                mode="tags"
                :options="props.primaryGoalsOptions"
                :searchable="true"
                :create-tag="true"
                :placeholder="props.fieldTexts?.primaryGoals?.placeholder"
                :close-on-select="false"
                :class="{ 'multiselect-invalid': errors.length > 0 }"
              />
            </FormControl>
            <FormDescription v-if="props.fieldTexts?.primaryGoals?.description">
              {{ props.fieldTexts?.primaryGoals.description }}
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </CardContent>
      <CardFooter class="flex justify-end">
        <Button type="button" @click="handleNext">Continue</Button>
      </CardFooter>
    </Card>
  </div>
</template>

<style lang="scss" scoped>
:deep(.multiselect) {
  @apply mt-2;
}

:deep(.multiselect-invalid) {
  --ms-border-color: hsl(var(--destructive));
}
</style> 