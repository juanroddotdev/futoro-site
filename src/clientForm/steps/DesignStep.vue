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
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

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
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>How You Want It To Look & Feel</CardTitle>
        <CardDescription>Here, you can share your ideas about the style and overall impression you want your website to have.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-8">
        <!-- Brand Assets Section -->
        <div class="space-y-6">
          <h3 class="text-base font-medium">Brand Assets</h3>
          
          <!-- Logo -->
          <FormField name="hasLogo" v-slot="{ field }">
            <FormItem>
              <FormLabel :for="field.name" class="text-foreground">{{ props.fieldTexts?.hasLogo?.label }}</FormLabel>
              <FormControl class="mt-2">
                <RadioGroup
                  :model-value="String(field.value)"
                  @update:model-value="(value) => field.onChange(value === 'true')"
                  class="flex items-center space-x-4"
                >
                  <FormItem v-for="option in props.fieldTexts?.hasLogo?.options" :key="String(option.value)" class="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem :id="field.name + '-' + option.value" :value="String(option.value)" />
                    </FormControl>
                    <FormLabel :for="field.name + '-' + option.value" class="font-normal">{{ option.label }}</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
              <FormDescription v-if="formValues.hasLogo === true && props.fieldTexts?.hasLogo?.conditionalText?.['true']" class="mt-2" v-html="props.fieldTexts.hasLogo.conditionalText['true']">
              </FormDescription>
              <FormDescription v-if="formValues.hasLogo === false && props.fieldTexts?.hasLogo?.conditionalText?.['false']" class="mt-2" v-html="props.fieldTexts.hasLogo.conditionalText['false']">
              </FormDescription>
            </FormItem>
          </FormField>

          <!-- Brand Colors -->
          <FormField name="hasBrandColors" v-slot="{ field }">
            <FormItem>
              <FormLabel :for="field.name" class="text-foreground">{{ props.fieldTexts?.hasBrandColors?.label }}</FormLabel>
              <FormControl class="mt-2">
                <RadioGroup
                  :model-value="String(field.value)"
                  @update:model-value="(value) => field.onChange(value === 'true')"
                  class="flex items-center space-x-4"
                >
                  <FormItem v-for="option in props.fieldTexts?.hasBrandColors?.options" :key="String(option.value)" class="flex items-center space-x-2">
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

          <FormField v-if="formValues.hasBrandColors === true" name="brandColorsDescription" v-slot="{ componentField }">
            <FormItem>
              <FormControl>
                <Textarea
                  v-bind="componentField"
                  :placeholder="props.fieldTexts?.brandColorsDescription?.placeholder"
                  class="mt-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Brand Fonts -->
          <FormField name="hasBrandFonts" v-slot="{ field }">
            <FormItem>
              <FormLabel :for="field.name" class="text-foreground">{{ props.fieldTexts?.hasBrandFonts?.label }}</FormLabel>
              <FormControl class="mt-2">
                <RadioGroup
                  :model-value="String(field.value)"
                  @update:model-value="(value) => field.onChange(value === 'true')"
                  class="flex items-center space-x-4"
                >
                  <FormItem v-for="option in props.fieldTexts?.hasBrandFonts?.options" :key="String(option.value)" class="flex items-center space-x-2">
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

          <FormField v-if="formValues.hasBrandFonts === true" name="brandFontsDescription" v-slot="{ componentField }">
            <FormItem>
              <FormControl>
                <Textarea
                  v-bind="componentField"
                  :placeholder="props.fieldTexts?.brandFontsDescription?.placeholder"
                  class="mt-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- Aesthetic Style Section -->
        <div class="space-y-4">
          <h3 class="text-base font-medium">Design Style</h3>
          <FormField name="aestheticStyle" v-slot="{ field }">
            <FormItem>
              <FormLabel>{{ props.fieldTexts?.aestheticStyle?.label }}</FormLabel>
              <FormDescription>{{ props.fieldTexts?.aestheticStyle?.description }}</FormDescription>
              <FormControl>
                <TooltipProvider>
                  <ToggleGroup
                    type="multiple"
                    :model-value="field.value"
                    @update:model-value="(value) => props.updateMultiSelectField('aestheticStyle', value)"
                    class="grid grid-cols-2 gap-2 mt-2"
                  >
                    <Tooltip v-for="option in props.aestheticStyleOptions" :key="option.value">
                      <TooltipTrigger asChild>
                        <ToggleGroupItem :value="option.value" class="text-sm">
                          {{ option.label }}
                        </ToggleGroupItem>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{{ option.definition }}</p>
                      </TooltipContent>
                    </Tooltip>
                  </ToggleGroup>
                </TooltipProvider>
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