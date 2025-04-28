<script setup lang="ts">
import { ref, computed, type PropType } from 'vue';
import { Field as VeeField, Form as VeeForm } from 'vee-validate';

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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import BentoSection from '@/components/layout/BentoSection.vue';

// Types
import type { AllFieldTexts } from './texts';

// Define props (similar to AboutSection)
const props = defineProps<{
  title: string;
  description: string;
  form: Object; // Keep using Object for simplicity for now
  fieldTexts: AllFieldTexts | undefined;
  aestheticStyleOptions: Array<{ value: string; label: string; definition: string }>;
  // Need updateMultiSelectField from parent for ToggleGroup
  updateMultiSelectField: (fieldName: string, newValue: unknown) => void;
}>();

// Access form values reactively if needed for v-if, etc.
const formValues = computed(() => (props.form as any)?.values ?? {});

</script>

<template>
  <div class="bg-background">
    <div class="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
      <h2 class="text-center text-base/7 font-semibold text-primary">{{ props.title }}</h2>
      <p class="mx-auto mt-2 max-w-lg text-center text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl">{{ props.description }}</p>

      <!-- Bento Grid Layout -->
      <div class="form-grid">

        <!-- Visual Identity - Tall Left Column -->
        <div class="bento-cell bento-cell--span-2">
          <div class="bento-bg bento-bg--left-rounded"></div>
          <div class="bento-content bento-content--left-rounded">
            <div class="bento-header">
              <p>{{ props.fieldTexts?.visualIdentityGroup?.intro }}</p>
            </div>

            <div class="bento-body">
              <!-- Logo -->
              <FormField name="hasLogo" v-slot="{ field }">
                <FormItem class="space-y-2 mb-6">
                  <FormLabel :for="field.name" class="text-foreground">{{ props.fieldTexts?.hasLogo?.label }}</FormLabel>
                  <FormControl class="mt-2">
                    <RadioGroup
                      :model-value="String(field.value)"
                      @update:model-value="(value) => field.onChange(value === 'true')"
                      class="flex items-center space-x-4"
                    >
                      <!-- Loop through options -->
                      <FormItem v-for="option in props.fieldTexts?.hasLogo?.options" :key="String(option.value)" class="flex items-center space-x-2">
                        <FormControl><RadioGroupItem :id="field.name + '-' + option.value" :value="String(option.value)" /></FormControl>
                        <FormLabel :for="field.name + '-' + option.value" class="font-normal">{{ option.label }}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />

                  <!-- Conditional descriptions -->
                  <FormDescription v-if="formValues.hasLogo === true && props.fieldTexts?.hasLogo?.conditionalText?.['true']" class="pl-2 text-xs" v-html="props.fieldTexts.hasLogo.conditionalText['true']">
                  </FormDescription>
                  <FormDescription v-if="formValues.hasLogo === false && props.fieldTexts?.hasLogo?.conditionalText?.['false']" class="pl-2 text-xs" v-html="props.fieldTexts.hasLogo.conditionalText['false']">
                  </FormDescription>
                </FormItem>
              </FormField>

              <!-- Brand Colors -->
              <FormField name="hasBrandColors" v-slot="{ field }">
                <FormItem class="space-y-2 border-t pt-4 mb-6">
                  <FormLabel :for="field.name" class="text-foreground">{{ props.fieldTexts?.hasBrandColors?.label }}</FormLabel>
                  <FormControl class="mt-2">
                    <RadioGroup
                      :model-value="String(field.value)"
                      @update:model-value="(value) => field.onChange(value === 'true')"
                      class="flex items-center space-x-4"
                    >
                      <!-- Loop through options -->
                      <FormItem v-for="option in props.fieldTexts?.hasBrandColors?.options" :key="String(option.value)" class="flex items-center space-x-2">
                        <FormControl><RadioGroupItem :id="field.name + '-' + option.value" :value="String(option.value)" /></FormControl>
                        <FormLabel :for="field.name + '-' + option.value" class="font-normal">{{ option.label }}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormField v-if="formValues.hasBrandColors === true" name="brandColorsDescription" v-slot="{ componentField }">
                  <FormItem class="mt-2 pl-2 mb-6">
                    <FormLabel :for="componentField.name" class="sr-only">Brand Colors Description</FormLabel>
                    <FormControl>
                      <Textarea
                        v-bind="componentField"
                        :placeholder="props.fieldTexts?.brandColorsDescription?.placeholder"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </FormField>

              <!-- Brand Fonts -->
              <FormField name="hasBrandFonts" v-slot="{ field }">
                <FormItem class="space-y-2 border-t pt-4">
                  <FormLabel :for="field.name" class="text-foreground">{{ props.fieldTexts?.hasBrandFonts?.label }}</FormLabel>
                  <FormControl class="mt-2">
                    <RadioGroup
                      :model-value="String(field.value)"
                      @update:model-value="(value) => field.onChange(value === 'true')"
                      class="flex items-center space-x-4"
                    >
                      <!-- Loop through options -->
                      <FormItem v-for="option in props.fieldTexts?.hasBrandFonts?.options" :key="String(option.value)" class="flex items-center space-x-2">
                        <FormControl><RadioGroupItem :id="field.name + '-' + option.value" :value="String(option.value)" /></FormControl>
                        <FormLabel :for="field.name + '-' + option.value" class="font-normal">{{ option.label }}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <!-- Use formValues for v-if -->
                <FormField v-if="formValues.hasBrandFonts === true" name="brandFontsDescription" v-slot="{ componentField }">
                  <FormItem class="mt-2 pl-2">
                    <FormLabel :for="componentField.name" class="sr-only">Brand Fonts Description</FormLabel>
                    <FormControl>
                      <Textarea
                        v-bind="componentField"
                        :placeholder="props.fieldTexts?.brandFontsDescription?.placeholder"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </FormField>
            </div>
          </div>
          <div class="bento-border bento-border--left-rounded"></div>
        </div>

        <!-- Inspirational Websites - Top Right -->
        <div class="bento-cell bento-cell--row-1-mobile">
          <div class="bento-bg bento-bg--top-rounded-mobile"></div>
          <div class="bento-content bento-content--top-rounded-mobile">
            <div class="bento-header">
              <p>{{ props.fieldTexts?.inspirationalWebsitesGroup?.intro }}</p>
            </div>

            <div class="bento-body">
              <FormField name="inspirationalWebsitesUrls" v-slot="{ componentField }">
                <FormItem class="mb-4">
                  <FormLabel :for="componentField.name">{{ props.fieldTexts?.inspirationalWebsitesUrls?.label }}</FormLabel>
                  <FormControl>
                    <Textarea
                      v-bind="componentField"
                      :placeholder="props.fieldTexts?.inspirationalWebsitesUrls?.placeholder"
                      class="mt-1"
                      rows="3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </div>
          <div class="bento-border bento-border--top-rounded-mobile"></div>
        </div>

        <!-- Inspirational Comments - Bottom Middle -->
        <div class="bento-cell bento-cell--row-3-mobile bento-cell--col-2 bento-cell--row-2">
          <div class="bento-bg"></div>
          <div class="bento-content">
            <div class="bento-header">
              <p>Comments</p>
            </div>

            <div class="bento-body">
              <FormField name="inspirationalWebsitesComments" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel :for="componentField.name">{{ props.fieldTexts?.inspirationalWebsitesComments?.label }}</FormLabel>
                  <FormControl>
                    <Textarea
                      v-bind="componentField"
                      :placeholder="props.fieldTexts?.inspirationalWebsitesComments?.placeholder"
                      class="mt-1"
                      rows="4"
                    />
                  </FormControl>
                  <FormDescription v-if="props.fieldTexts?.inspirationalWebsitesComments?.description" class="mt-1">
                    {{ props.fieldTexts?.inspirationalWebsitesComments.description }}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </div>
          <div class="bento-border"></div>
        </div>

        <!-- Aesthetic Style - Tall Right Column -->
        <div class="bento-cell bento-cell--span-2">
          <div class="bento-bg bento-bg--right-rounded"></div>
          <div class="bento-content bento-content--right-rounded">
            <div class="bento-header">
              <p>Aesthetic Style</p>
            </div>

            <div class="bento-body">
              <FormField name="aestheticStyle" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel :for="componentField.name">{{ props.fieldTexts?.aestheticStyle?.label }}</FormLabel>
                  <FormControl class="mt-2">
                    <TooltipProvider :delay-duration="200">
                      <ToggleGroup
                        v-bind="componentField"
                        type="multiple"
                        variant="outline"
                        class="flex flex-wrap gap-2"
                        :model-value="componentField.modelValue || []"
                        @update:model-value="(value) => props.updateMultiSelectField('aestheticStyle', value)"
                      >
                        <!-- Options now come from props -->
                        <Tooltip v-for="option in props.aestheticStyleOptions" :key="option.value">
                          <TooltipTrigger asChild>
                            <ToggleGroupItem
                              :value="option.value"
                              :aria-label="option.label">
                              {{ option.label }}
                            </ToggleGroupItem>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" class="max-w-xs text-center">
                            <p>{{ option.definition }}</p>
                          </TooltipContent>
                        </Tooltip>
                      </ToggleGroup>
                    </TooltipProvider>
                  </FormControl>
                  <FormDescription v-if="props.fieldTexts?.aestheticStyle?.description" class="mt-2">
                    {{ props.fieldTexts.aestheticStyle.description }}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Visual representation of aesthetic styles -->
              <div class="mt-8 relative w-full">
                <div class="relative overflow-hidden rounded-xl bg-gray-900/10 shadow-md">
                  <div class="flex flex-wrap gap-2 p-4">
                    <div v-for="option in props.aestheticStyleOptions.slice(0, 6)" :key="option.value"
                         class="h-12 w-12 rounded-md flex items-center justify-center text-xs font-medium"
                         :class="{
                           'bg-primary text-primary-foreground': (formValues.aestheticStyle || []).includes(option.value),
                           'bg-muted text-muted-foreground': !(formValues.aestheticStyle || []).includes(option.value)
                         }">
                      {{ option.label.substring(0, 2) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bento-border bento-border--right-rounded"></div>
        </div>

      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// Component-specific styles can be added here if needed
</style>