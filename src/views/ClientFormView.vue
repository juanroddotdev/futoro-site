<template>
  <!-- Container spanning full width, setting text color for intro -->
  <div class="py-12 px-4 text-foreground client-form-container">
    <!-- Center align the introductory text -->
    <div class="text-center max-w-3xl mx-auto mb-12 client-form-intro">
      <h1 class="text-3xl font-bold mb-4">Client Project Questionnaire</h1>
      <h4 class="mb-2 text-lg text-muted-foreground">Hey there! 👋 To make sure I create a website that really clicks with you and your business goals, I've put together a quick little "getting to know you" survey.</h4>
      <h4 class="mb-6 text-lg text-muted-foreground">It's just a friendly way for me to understand exactly what you're looking for, so we can build something awesome together!</h4>
    </div>

    <!-- Apply paper effect to the form - centered within the full-width container -->
    <form 
      @submit="onSubmit" 
      class="space-y-8 max-w-3xl mx-auto text-card-foreground p-8 shadow-lg client-form-bento-box"
    >
      <!-- Use the AboutSection2 component -->
      <AboutSection2 
        :title="sectionInfo[0].title" 
        :description="sectionInfo[0].description"
        :form="form" 
        :field-texts="computedFieldTexts" 
        :fullBusinessDescOptions="fullBusinessDescOptions" 
        :fullTargetAudienceOptions="fullTargetAudienceOptions" 
        :primaryGoalsOptions="primaryGoalsOptions"
      />

       <!-- Use the new DesignSection component -->
       <DesignSection
         :title="sectionInfo[1].title"
         :description="sectionInfo[1].description"
         :form="form"
         :field-texts="computedFieldTexts"
         :aesthetic-style-options="aestheticStyleOptions"
         :update-multi-select-field="updateMultiSelectField" 
       />

       <!-- Section 3 -->
       <FunctionalitySection
         :title="sectionInfo[2].title"
         :description="sectionInfo[2].description"
         :form="form"
         :field-texts="computedFieldTexts"
         :essential-pages-options="essentialPagesOptions"
         :functionality-options="functionalityOptions"
         :update-multi-select-field="updateMultiSelectField"
         :toggle-array-item="toggleArrayItem"
       />

       <!-- Section 4 -->
       <LogisticsSection
         :title="sectionInfo[3].title"
         :description="sectionInfo[3].description"
         :form="form"
         :field-texts="computedFieldTexts"
         :budget-tier-options="budgetTierOptions"
         :toggle-array-item="toggleArrayItem"
       />

       <Button type="submit">
         Submit Questionnaire
       </Button>
     </form>
   </div>
</template>

<script setup lang="ts">
import { h, ref, watch, computed } from 'vue'
import { useForm } from 'vee-validate'

import { Button } from '@/components/ui/button'

import { 
    fullBusinessDescOptions,
    fullTargetAudienceOptions,
    primaryGoalsOptions,
    aestheticStyleOptions,
    essentialPagesOptions,
    functionalityOptions,
    budgetTierOptions
} from '@/clientForm/options';
import { fieldTexts, type AllFieldTexts } from '@/clientForm/texts';
import { formSchema } from '@/clientForm/schema';

// import AboutSection from '@/clientForm/AboutSection.vue';
import AboutSection2 from '@/clientForm/AboutSection2.vue';
import DesignSection from '@/clientForm/DesignSection.vue';
import FunctionalitySection from '@/clientForm/FunctionalitySection.vue';
import LogisticsSection from '@/clientForm/LogisticsSection.vue';

const sectionInfo = ref([
  { id: 'about', title: 'About Your Website', description: 'In this section, tell us the basics about what you need your website to do and who it\'s for.' },
  { id: 'design', title: 'How You Want It To Look & Feel', description: 'Here, you can share your ideas about the style and overall impression you want your website to have.' },
  { id: 'functionality', title: 'What Your Website Will Do & Say', description: 'This is where you\'ll tell us about the specific features you need and the kind of information (content) your website will include.' },
  { id: 'logistics', title: 'Website Details & How We\'ll Work Together', description: 'In this final section, we\'ll cover some of the more technical aspects and how we\'ll communicate and manage the project together.' }
]);

const form = useForm({ validationSchema: formSchema })
const onSubmit = form.handleSubmit((values) => { 
    console.log('Form submitted!', values); 
    // Add actual submission logic here later (e.g., API call)
}) 

// Create a computed property for fieldTexts
const computedFieldTexts = computed<AllFieldTexts>(() => {
  // console.log("PARENT: Computing fieldTexts.value:", JSON.stringify(fieldTexts.value));
  return fieldTexts.value;
});

function updateMultiSelectField(fieldName: string, newValue: unknown) {
  let finalValue: string[] = [];
  if (Array.isArray(newValue)) {
    finalValue = newValue.map(item => String(item)); 
  } else if (newValue !== null && newValue !== undefined) {
    finalValue = [String(newValue)];
  } 
  form.setFieldValue(fieldName as any, finalValue);
}

function toggleArrayItem(fieldName: keyof typeof form.values, itemValue: string) { 
  const currentArray = (form.values[fieldName] as string[] | undefined) || [];
  const itemIndex = currentArray.indexOf(itemValue);
  let updatedArray = [...currentArray];

  if (itemIndex > -1) {
    updatedArray.splice(itemIndex, 1);
  } else {
    updatedArray.push(itemValue);
  }
  form.setFieldValue(fieldName, updatedArray);

  // Clear other field if 'other' checkbox is unchecked
  if (fieldName === 'desiredFeatures' && itemValue === 'other_features' && itemIndex > -1) {
     form.setFieldValue('desiredFeaturesOther', undefined);
  }
}

// console.log('PARENT: Initial fieldTexts.value:', JSON.stringify(fieldTexts.value)); // Log initial value

</script> 