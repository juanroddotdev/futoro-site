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
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

// Types
import type { AllFieldTexts } from '../texts';

// Props
const props = defineProps<{
  title: string;
  description: string;
  form: any;
  fieldTexts: AllFieldTexts | undefined;
  aestheticStyleOptions: any[];
  updateMultiSelectField: (fieldName: string, newValue: unknown) => void;
}>();

// Access form values (needed for v-if conditions)
const formValues = computed(() => props.form?.values ?? {});
</script>

<template>
  <div class="section-container">
    <div class="section-header">
      <h2 class="text-2xl font-semibold mb-2">{{ props.title }}</h2>
      <p class="text-muted-foreground mb-6">{{ props.description }}</p>
    </div>
    
    <div class="grid gap-6 md:grid-cols-2">
      <!-- Visual Identity -->
      <Card>
        <CardHeader>
          <CardTitle>Visual Identity</CardTitle>
          <CardDescription>{{ props.fieldTexts?.visualIdentityGroup?.intro }}</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Logo -->
          <FormField name="hasLogo" v-slot="{ field }">
            <FormItem class="mb-6">
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
              <FormDescription v-if="formValues.hasLogo === true && props.fieldTexts?.hasLogo?.conditionalText?.['true']" class="pl-2 text-xs mt-2" v-html="props.fieldTexts.hasLogo.conditionalText['true']">
              </FormDescription>
              <FormDescription v-if="formValues.hasLogo === false && props.fieldTexts?.hasLogo?.conditionalText?.['false']" class="pl-2 text-xs mt-2" v-html="props.fieldTexts.hasLogo.conditionalText['false']">
              </FormDescription>
            </FormItem>
          </FormField>
          
          <!-- Brand Colors -->
          <FormField name="hasBrandColors" v-slot="{ field }">
            <FormItem class="mb-6">
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
            <FormItem>
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
        </CardContent>
      </Card>
      
      <!-- Inspirational Websites -->
      <Card>
        <CardHeader>
          <CardTitle>Inspiration</CardTitle>
          <CardDescription>{{ props.fieldTexts?.inspirationalWebsitesGroup?.intro }}</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
      
      <!-- Aesthetic Style -->
      <Card class="md:col-span-2">
        <CardHeader>
          <CardTitle>Aesthetic Style</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.section-container {
  margin-bottom: 2rem;
}

.section-header {
  margin-bottom: 1.5rem;
}
</style>
