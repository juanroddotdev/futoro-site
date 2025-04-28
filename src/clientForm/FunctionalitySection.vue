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
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import BentoSection from '@/components/layout/BentoSection.vue';

// Types
import type { AllFieldTexts } from './texts';
import type { FunctionalityOption, PageOption } from './options'; 

// Define props
const props = defineProps<{
  title: string;
  description: string;
  form: Object; 
  fieldTexts: AllFieldTexts | undefined;
  essentialPagesOptions: Array<PageOption>;
  functionalityOptions: Array<FunctionalityOption>;
  updateMultiSelectField: (fieldName: string, newValue: unknown) => void;
  toggleArrayItem: (fieldName: any, itemValue: string) => void;
}>();

// Access form values reactively
const formValues = computed(() => (props.form as any)?.values ?? {});

</script>

<template>
  <BentoSection :title="props.title" :description="props.description" class="form-grid">
      
        <!-- Essential Pages Question -->
          <FormField name="essentialPages" v-slot="{ componentField }"> 
            <FormItem class="form-item form-item--functionality-pages">
             <FormLabel :for="componentField.name">{{ props.fieldTexts?.essentialPages?.label }}</FormLabel>
             <FormControl class="mt-2">
               <TooltipProvider :delay-duration="200">
                 <ToggleGroup 
                     v-bind="componentField"
                     type="multiple" 
                     variant="outline" 
                     class="flex flex-wrap gap-2" 
                     :model-value="componentField.modelValue || []"
                     @update:model-value="(value) => props.updateMultiSelectField('essentialPages', value)"
                 > 
                     <Tooltip v-for="option in props.essentialPagesOptions" :key="option.value">
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
              <FormDescription v-if="props.fieldTexts?.essentialPages?.description" class="mt-2">
               {{ props.fieldTexts.essentialPages.description }}
             </FormDescription>
             <FormMessage />
            </FormItem>
          </FormField>

          <!-- Desired Functionality Question -->
          <FormField name="desiredFeatures" v-slot="{ field }">
            <FormItem class="form-item form-item--functionality-features">
              <FormLabel :for="field.name">{{ props.fieldTexts?.desiredFeatures?.label }}</FormLabel>
              <div class="mt-4 space-y-6">
                <!-- Loop through Categories from functionalityOptions (for structure) -->
                <!-- But use text from fieldTexts.desiredFeatures.categories -->
                <div v-for="category in props.functionalityOptions" :key="category.category">
                  <h4 v-if="props.fieldTexts?.desiredFeatures?.categories?.[category.category]" class="font-medium text-foreground mb-1">{{ category.category }}</h4>
                  <p v-if="props.fieldTexts?.desiredFeatures?.categories?.[category.category]?.definition" class="text-sm text-muted-foreground mb-3">{{ props.fieldTexts.desiredFeatures.categories[category.category].definition }}</p>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div v-for="(label, value) in props.fieldTexts?.desiredFeatures?.categories?.[category.category]?.options" :key="value" class="flex items-center space-x-2">
                      <Checkbox 
                        :id="field.name + '-' + value"
                        :value="value"
                        :checked="field.value?.includes(value)"
                        @update:checked="() => props.toggleArrayItem('desiredFeatures', value)"
                      />
                      <Label :for="field.name + '-' + value" class="font-normal">{{ label }}</Label>
                    </div>
                  </div>
                </div>

                <div class="pt-4 border-t">
                   <div class="flex items-center space-x-2">
                       <Checkbox 
                        :id="field.name + '-other_features'"
                        value="other_features"
                        :checked="field.value?.includes('other_features')"
                        @update:checked="() => props.toggleArrayItem('desiredFeatures', 'other_features')" 
                      />
                      <Label :for="field.name + '-other_features'" class="font-normal">{{ props.fieldTexts?.desiredFeatures?.otherOptionLabel }}</Label> 
                   </div>
                    <!-- Use formValues for v-if -->
                   <FormField v-if="formValues.desiredFeatures?.includes('other_features')" name="desiredFeaturesOther" v-slot="{ componentField }">
                      <FormItem class="mt-2 pl-8">
                        <FormLabel :for="componentField.name" class="sr-only">Other Desired Features</FormLabel>
                        <FormControl>
                          <Textarea 
                            v-bind="componentField"
                            :placeholder="props.fieldTexts?.desiredFeaturesOther?.placeholder"
                            rows="3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                   </FormField>
                </div>
              </div>
               <FormMessage />
            </FormItem>
          </FormField>

  </BentoSection>
</template>

<style lang="scss" scoped>
// Remove the bento-item styles since they're now in _form-grid.scss
</style> 