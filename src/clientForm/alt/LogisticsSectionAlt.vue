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
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

// Types
import type { AllFieldTexts } from '../texts';

// Props
const props = defineProps<{
  title: string;
  description: string;
  form: any;
  fieldTexts: AllFieldTexts | undefined;
  budgetTierOptions: any[];
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
    
    <div class="grid gap-6 md:grid-cols-2">
      <!-- Timeline -->
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField name="projectTimeline" v-slot="{ field }">
            <FormItem>
              <FormLabel :for="field.name">{{ props.fieldTexts?.projectTimeline?.label }}</FormLabel>
              <FormControl class="mt-2">
                <RadioGroup :model-value="field.value" @update:model-value="field.onChange" class="space-y-2">
                  <FormItem v-for="option in props.fieldTexts?.projectTimeline?.options" :key="option.value" class="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem :id="field.name + '-' + option.value" :value="option.value" />
                    </FormControl>
                    <FormLabel :for="field.name + '-' + option.value" class="font-normal">{{ option.label }}</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          
          <!-- Timeline Details -->
          <FormField name="projectTimelineDetails" v-slot="{ componentField }" class="mt-6">
            <FormItem>
              <FormLabel :for="componentField.name">{{ props.fieldTexts?.projectTimelineDetails?.label }}</FormLabel>
              <FormControl>
                <Textarea 
                  v-bind="componentField"
                  :placeholder="props.fieldTexts?.projectTimelineDetails?.placeholder"
                  class="mt-1"
                  rows="3"
                />
              </FormControl>
              <FormDescription v-if="props.fieldTexts?.projectTimelineDetails?.description" class="mt-1">
                {{ props.fieldTexts?.projectTimelineDetails.description }}
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </CardContent>
      </Card>
      
      <!-- Budget -->
      <Card>
        <CardHeader>
          <CardTitle>Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField name="budgetTier" v-slot="{ field }">
            <FormItem>
              <FormLabel :for="field.name">{{ props.fieldTexts?.budgetTier?.label }}</FormLabel>
              <FormControl class="mt-2">
                <RadioGroup :model-value="field.value" @update:model-value="field.onChange" class="space-y-2">
                  <FormItem v-for="option in props.budgetTierOptions" :key="option.value" class="flex items-start space-x-2">
                    <FormControl>
                      <RadioGroupItem :id="field.name + '-' + option.value" :value="option.value" />
                    </FormControl>
                    <div class="space-y-1 leading-none">
                      <FormLabel :for="field.name + '-' + option.value" class="font-normal">{{ option.label }}</FormLabel>
                      <FormDescription v-if="option.description">
                        {{ option.description }}
                      </FormDescription>
                    </div>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </CardContent>
      </Card>
      
      <!-- Communication -->
      <Card class="md:col-span-2">
        <CardHeader>
          <CardTitle>Communication</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField name="communicationPreferences" v-slot="{ field }">
            <FormItem>
              <FormLabel :for="field.name">{{ props.fieldTexts?.communicationPreferences?.label }}</FormLabel>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <FormItem v-for="option in props.fieldTexts?.communicationPreferences?.options" :key="option.value" class="flex items-start space-x-2">
                  <FormControl>
                    <Checkbox 
                      :id="option.value" 
                      :checked="field.value?.includes(option.value)" 
                      @update:checked="(checked) => props.toggleArrayItem('communicationPreferences', option.value)"
                    />
                  </FormControl>
                  <div class="space-y-1 leading-none">
                    <FormLabel :for="option.value">{{ option.label }}</FormLabel>
                  </div>
                </FormItem>
              </div>
              <FormMessage />
            </FormItem>
          </FormField>
          
          <!-- Additional Comments -->
          <FormField name="additionalComments" v-slot="{ componentField }" class="mt-6">
            <FormItem>
              <FormLabel :for="componentField.name">{{ props.fieldTexts?.additionalComments?.label }}</FormLabel>
              <FormControl>
                <Textarea 
                  v-bind="componentField"
                  :placeholder="props.fieldTexts?.additionalComments?.placeholder"
                  class="mt-1"
                  rows="4"
                />
              </FormControl>
              <FormDescription v-if="props.fieldTexts?.additionalComments?.description" class="mt-1">
                {{ props.fieldTexts?.additionalComments.description }}
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
