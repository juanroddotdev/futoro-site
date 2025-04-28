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
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
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
  essentialPagesOptions: any[];
  functionalityOptions: any[];
  updateMultiSelectField: (fieldName: string, newValue: unknown) => void;
  toggleArrayItem: (fieldName: string, itemValue: string) => void;
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
    
    <div class="grid gap-6">
      <!-- Essential Pages -->
      <Card>
        <CardHeader>
          <CardTitle>Essential Pages</CardTitle>
          <CardDescription>{{ props.fieldTexts?.essentialPagesGroup?.intro }}</CardDescription>
        </CardHeader>
        <CardContent>
          <FormField name="essentialPages" v-slot="{ field }">
            <FormItem>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem v-for="option in props.essentialPagesOptions" :key="option.value" class="flex items-start space-x-2">
                  <FormControl>
                    <Checkbox 
                      :id="option.value" 
                      :checked="field.value?.includes(option.value)" 
                      @update:checked="(checked) => props.toggleArrayItem('essentialPages', option.value)"
                    />
                  </FormControl>
                  <div class="space-y-1 leading-none">
                    <FormLabel :for="option.value">{{ option.label }}</FormLabel>
                    <FormDescription v-if="option.description">
                      {{ option.description }}
                    </FormDescription>
                  </div>
                </FormItem>
              </div>
              <FormMessage />
            </FormItem>
          </FormField>
        </CardContent>
      </Card>
      
      <!-- Functionality -->
      <Card>
        <CardHeader>
          <CardTitle>Functionality</CardTitle>
          <CardDescription>{{ props.fieldTexts?.functionalityGroup?.intro }}</CardDescription>
        </CardHeader>
        <CardContent>
          <FormField name="desiredFeatures" v-slot="{ field }">
            <FormItem>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem v-for="option in props.functionalityOptions" :key="option.value" class="flex items-start space-x-2">
                  <FormControl>
                    <Checkbox 
                      :id="option.value" 
                      :checked="field.value?.includes(option.value)" 
                      @update:checked="(checked) => props.toggleArrayItem('desiredFeatures', option.value)"
                    />
                  </FormControl>
                  <div class="space-y-1 leading-none">
                    <FormLabel :for="option.value">{{ option.label }}</FormLabel>
                    <FormDescription v-if="option.description">
                      {{ option.description }}
                    </FormDescription>
                  </div>
                </FormItem>
              </div>
              <FormMessage />
            </FormItem>
          </FormField>
          
          <!-- Other Features -->
          <FormField v-if="formValues.desiredFeatures?.includes('other_features')" name="desiredFeaturesOther" v-slot="{ componentField }" class="mt-6">
            <FormItem>
              <FormLabel :for="componentField.name">{{ props.fieldTexts?.desiredFeaturesOther?.label }}</FormLabel>
              <FormControl>
                <Textarea 
                  v-bind="componentField"
                  :placeholder="props.fieldTexts?.desiredFeaturesOther?.placeholder"
                  class="mt-1"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </CardContent>
      </Card>
      
      <!-- Content Creation -->
      <Card>
        <CardHeader>
          <CardTitle>Content Creation</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField name="contentCreationHelp" v-slot="{ field }">
            <FormItem>
              <FormLabel :for="field.name">{{ props.fieldTexts?.contentCreationHelp?.label }}</FormLabel>
              <FormControl>
                <Textarea 
                  v-bind="field"
                  :placeholder="props.fieldTexts?.contentCreationHelp?.placeholder"
                  class="mt-1"
                  rows="4"
                />
              </FormControl>
              <FormDescription v-if="props.fieldTexts?.contentCreationHelp?.description" class="mt-1">
                {{ props.fieldTexts?.contentCreationHelp.description }}
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
