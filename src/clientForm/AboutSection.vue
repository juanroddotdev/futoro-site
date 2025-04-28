<script setup lang="ts">
import { ref, h, computed, onMounted, type PropType } from 'vue';
import type { FormContext } from 'vee-validate';
import Multiselect from '@vueform/multiselect'
import { Field as VeeField, Form as VeeForm } from 'vee-validate';

// UI components 
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label' 
import BentoSection from '@/components/layout/BentoSection.vue'

// Types
import type { AllFieldTexts } from './texts';

// Props
// interface MinimalFormShape { 
//   values: Record<string, any>;
//   setFieldValue: (field: string, value: any) => void;
// }

// Use the correct type for the prop
const props = defineProps<{
  title: string; 
  description: string; 
  form: Object; // Use a less strict type for the form prop
  fieldTexts: AllFieldTexts | undefined; // Use the correct type
  fullBusinessDescOptions: any[]; 
  fullTargetAudienceOptions: any[];
  primaryGoalsOptions: any[];
}>();

console.log('AboutSection: Received fieldTexts prop (in setup):', props.fieldTexts);

onMounted(() => {
  console.log('AboutSection: fieldTexts prop in onMounted:', props.fieldTexts);
});

// Access form values (needed for v-if conditions)
// Need to cast props.form to access nested properties safely
const formValues = ref((props.form as any)?.values ?? {});

// Multiselect update function (remains the same)
function updateMultiSelectField(fieldName: string, newValue: unknown) {
    let finalValue: string[] = [];
    if (Array.isArray(newValue)) {
      finalValue = newValue.map(item => String(item));
    } else if (newValue !== null && newValue !== undefined) {
      finalValue = [String(newValue)];
    }
    // Need to cast props.form to call setFieldValue
    (props.form as any)?.setFieldValue(fieldName, finalValue);
  }

</script>

<template>
  <BentoSection 
    :title="props.title" 
    :description="props.description"
    class="form-grid"
    >
    <!-- Business Name -->
        <FormField v-slot="{ componentField }" name="businessName">
           <FormItem class="form-item form-item--about-name">
              <FormLabel :for="componentField.name">{{ props.fieldTexts?.businessName?.label }}</FormLabel>
              <FormControl>
                <Input v-bind="componentField" type="text" :placeholder="props.fieldTexts?.businessName?.placeholder" class="mt-2"/>
              </FormControl>
              <FormDescription v-if="props.fieldTexts?.businessName?.description" class="mt-2">
                {{ props.fieldTexts?.businessName.description }}
              </FormDescription>
              <FormMessage />
           </FormItem>
        </FormField>
        <!-- Business Description -->
        <FormField name="businessDescription" v-slot="{ field, errors }">
           <FormItem class="form-item form-item--about-desc">
             <FormLabel :for="field.name">{{ props.fieldTexts?.businessDescription?.label }}</FormLabel>
             <FormControl class="mt-2">
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
              <FormDescription v-if="props.fieldTexts?.businessDescription?.description" class="mt-2">
                {{ props.fieldTexts?.businessDescription.description }}
              </FormDescription>
              <FormMessage />
           </FormItem>
        </FormField>
        <!-- Target Audience -->
        <FormField name="targetAudience" v-slot="{ field, errors }">
           <FormItem class="form-item form-item--about-audience">
             <FormLabel :for="field.name">{{ props.fieldTexts?.targetAudience?.label }}</FormLabel>
             <FormControl class="mt-2">
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
              <FormDescription v-if="props.fieldTexts?.targetAudience?.description" class="mt-2">
                {{ props.fieldTexts?.targetAudience.description }}
              </FormDescription>
              <FormMessage />
           </FormItem>
        </FormField>
         <!-- Primary Goals -->
         <FormField name="primaryGoals" v-slot="{ field, errors }">
           <FormItem class="form-item form-item--about-goals">
              <FormLabel :for="field.name">{{ props.fieldTexts?.primaryGoals?.label }}</FormLabel>
              <FormControl class="mt-2">
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
               <FormDescription v-if="props.fieldTexts?.primaryGoals?.description" class="mt-2">
                {{ props.fieldTexts?.primaryGoals.description }}
              </FormDescription>
              <FormMessage />
           </FormItem>
         </FormField>
         <!-- Existing Website Question -->
         <FormItem class="form-item form-item--about-existing-website">
             <!-- Part 1: Yes/No -->
             <FormField name="hasExistingWebsite" v-slot="{ field }">
                <FormLabel :for="field.name">{{ props.fieldTexts?.hasExistingWebsite?.label }}</FormLabel> 
                <FormControl class="mt-2">
                 <RadioGroup
                   :model-value="field.value"
                   @update:model-value="field.onChange"
                   class="flex items-center space-x-4"
                 >
                   <FormItem class="flex items-center space-x-2">
                     <FormControl>
                       <RadioGroupItem id="hasWebsiteYes" value="yes" />
                     </FormControl>
                     <FormLabel for="hasWebsiteYes" class="font-normal">Yes</FormLabel> 
                   </FormItem>
                   <FormItem class="flex items-center space-x-2">
                     <FormControl>
                       <RadioGroupItem id="hasWebsiteNo" value="no" />
                     </FormControl>
                     <FormLabel for="hasWebsiteNo" class="font-normal">No</FormLabel> 
                   </FormItem>
                 </RadioGroup>
                </FormControl>
                <FormMessage />
             </FormField>

             <!-- Part 2: Conditional Fields (URL and Feedback) -->
             <div v-if="formValues.hasExistingWebsite === 'yes'" class="mt-6 space-y-6 border-t pt-6">
                <FormField name="existingWebsiteUrl" v-slot="{ componentField }">
                   <FormItem>
                     <FormLabel :for="componentField.name">{{ props.fieldTexts?.existingWebsiteUrl?.label }}</FormLabel>
                     <FormControl>
                       <Input :id="componentField.name" type="url" :placeholder="props.fieldTexts?.existingWebsiteUrl?.placeholder" v-bind="componentField" class="mt-1"/>
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 </FormField>

                 <FormField name="existingWebsiteFeedback" v-slot="{ componentField }">
                   <FormItem>
                     <FormLabel :for="componentField.name">{{ props.fieldTexts?.existingWebsiteFeedback?.label }}</FormLabel>
                     <FormControl>
                       <Textarea 
                         :id="componentField.name"
                         :placeholder="props.fieldTexts?.existingWebsiteFeedback?.placeholder"
                         v-bind="componentField"
                         class="mt-1"
                       />
                     </FormControl>
                      <FormDescription v-if="props.fieldTexts?.existingWebsiteFeedback?.description" class="mt-1">
                        {{ props.fieldTexts?.existingWebsiteFeedback.description }}
                      </FormDescription>
                      <FormMessage />
                   </FormItem>
                 </FormField>
             </div>

             <!-- Part 3: Conditional Fields if NO -->
             <div v-if="formValues.hasExistingWebsite === 'no'" class="mt-6 space-y-4 border-t pt-6">
               <FormField name="domainNameStatus" v-slot="{ field }">
                  <FormLabel :for="field.name" class="text-base">{{ props.fieldTexts?.domainNameStatus?.label }}</FormLabel>
                  <FormControl class="mt-2">
                   <RadioGroup
                     :model-value="field.value"
                     @update:model-value="field.onChange"
                     class="space-y-2" 
                   >
                     <FormItem class="flex items-center space-x-2">
                       <FormControl><RadioGroupItem id="domainYes" value="yes" /></FormControl>
                       <FormLabel for="domainYes" class="font-normal">Yes, I have a domain name.</FormLabel>
                     </FormItem>
                     <!-- Nested Conditional Input for Domain Name if Status is 'yes' -->
                     <div v-if="formValues.domainNameStatus === 'yes'" class="pl-8 pt-2 pb-2">
                       <FormField name="domainName" v-slot="{ componentField }">
                         <FormItem>
                           <FormLabel :for="componentField.name">{{ props.fieldTexts?.domainName?.label }}</FormLabel>
                           <FormControl>
                             <Input :id="componentField.name" type="text" :placeholder="props.fieldTexts?.domainName?.placeholder" v-bind="componentField" class="mt-1"/>
                           </FormControl>
                           <FormMessage />
                         </FormItem>
                       </FormField>
                     </div>

                     <FormItem class="flex items-center space-x-2">
                       <FormControl><RadioGroupItem id="domainNo" value="no" /></FormControl>
                       <FormLabel for="domainNo" class="font-normal">No, I don't have a domain name yet.</FormLabel>
                     </FormItem>
                      
                     <!-- Nested Conditional Question if Status is 'no' -->
                     <div v-if="formValues.domainNameStatus === 'no'" class="pl-8 pt-4 space-y-3">
                        <p class="text-sm text-muted-foreground">
                         Got it! Let's get you set up with a web address. Which of the following best describes your situation with a domain name?
                       </p>
                        <FormField name="domainHelpNeededStatus" v-slot="{ field: helpField }">
                           <FormControl>
                             <RadioGroup
                               :model-value="helpField.value"
                               @update:model-value="helpField.onChange"
                               class="flex flex-col space-y-2"
                             >
                               <!-- Radio options text remains hardcoded for simplicity -->
                               <FormItem class="flex items-center space-x-2">
                                 <FormControl><RadioGroupItem id="helpKnows" value="knows_want"></RadioGroupItem></FormControl>
                                 <FormLabel for="helpKnows" class="font-normal">I haven't purchased one yet, but I know what I want.</FormLabel>
                               </FormItem>
                                <FormItem class="flex items-center space-x-2">
                                 <FormControl><RadioGroupItem id="helpNeeds" value="needs_help"></RadioGroupItem></FormControl>
                                 <FormLabel for="helpNeeds" class="font-normal">I haven't purchased one yet, and I'd like some help choosing one.</FormLabel>
                               </FormItem>
                                <FormItem class="flex items-center space-x-2">
                                 <FormControl><RadioGroupItem id="helpUnsure" value="unsure"></RadioGroupItem></FormControl>
                                 <FormLabel for="helpUnsure" class="font-normal">I'm not sure what a domain name is or where to start.</FormLabel>
                               </FormItem>
                             </RadioGroup>
                           </FormControl>
                          <FormMessage /> 
                       </FormField>
                     </div>
                   </RadioGroup>
                  </FormControl>
                  <FormMessage /> <!-- Message for domainNameStatus field itself -->
               </FormField>
             </div>
         </FormItem>
  </BentoSection>
</template>
