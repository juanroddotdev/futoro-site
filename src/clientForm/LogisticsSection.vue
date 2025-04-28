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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import BentoSection from '@/components/layout/BentoSection.vue';

// Types
import type { AllFieldTexts } from './texts';
import type { BudgetTierOption } from './options'; // Import specific option type

// Define props
const props = defineProps<{
  title: string;
  description: string;
  form: Object; // Keep using Object for form
  fieldTexts: AllFieldTexts | undefined;
  budgetTierOptions: Array<BudgetTierOption>;
  toggleArrayItem: (fieldName: any, itemValue: string) => void; // Use any for fieldName
}>();

// Access form values reactively if needed
// const formValues = computed(() => (props.form as any)?.values ?? {}); // Might not be needed if no v-if depends on form state in this section

</script>

<template>
  <BentoSection :title="props.title" :description="props.description" class="form-grid">

          <!-- Budget Tier Question -->
           <FormField name="projectBudgetTier" v-slot="{ field }">
              <FormItem class="form-item form-item--logistics-budget">
                 <FormLabel :for="field.name">{{ props.fieldTexts?.projectBudgetTier?.label }}</FormLabel> 
                 <FormDescription v-if="props.fieldTexts?.projectBudgetTier?.description" class="text-xs mt-1 mb-4">
                   {{ props.fieldTexts.projectBudgetTier.description }}
                 </FormDescription>
                 <FormControl class="mt-2">
                     <RadioGroup
                       :model-value="field.value"
                       @update:model-value="field.onChange"
                       class="flex flex-col space-y-4"
                     >
                       <!-- Options now come from props -->
                       <div v-for="option in props.budgetTierOptions" :key="option.value">
                          <FormItem class="flex items-start space-x-3 space-y-0">
                             <FormControl>
                                <RadioGroupItem :id="field.name + '-' + option.value" :value="option.value" />
                             </FormControl>
                             <div class="grid gap-1.5 leading-none">
                                <Label :for="field.name + '-' + option.value" class="font-medium">
                                 {{ option.label }} <span class="text-muted-foreground text-sm">({{ option.price }})</span>
                                </Label>
                                <FormDescription class="text-xs">
                                 {{ option.definition }}
                                </FormDescription>
                             </div>
                          </FormItem>
                       </div>
                      </RadioGroup>
                 </FormControl>
                 <FormMessage class="mt-4"/>
              </FormItem>
            </FormField>

           <!-- Point of Contact Question -->
           <FormItem class="form-item form-item--logistics-contact">
              <p class="font-medium text-foreground">{{ props.fieldTexts?.pointOfContactGroup?.intro }}</p>
              <div class="mt-4 space-y-4">
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
           </FormItem>

           <!-- Feedback Preference Question -->
            <FormField name="feedbackPreference" v-slot="{ field }">
             <FormItem class="form-item form-item--logistics-feedback">
               <FormLabel :for="field.name">{{ props.fieldTexts?.feedbackPreference?.label }}</FormLabel>
                <div class="mt-4 space-y-2">
                 <!-- Loop through options defined in fieldTexts -->
                 <div 
                   v-for="option in props.fieldTexts?.feedbackPreference?.options" 
                   :key="String(option.value)" 
                   class="flex items-center space-x-2"
                 >
                   <Checkbox 
                     :id="field.name + '-' + String(option.value)"
                     :checked="field.value?.includes(String(option.value))" 
                     @update:checked="() => props.toggleArrayItem('feedbackPreference', String(option.value))"
                   />
                   <Label :for="field.name + '-' + String(option.value)" class="font-normal">{{ option.label }}</Label>
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