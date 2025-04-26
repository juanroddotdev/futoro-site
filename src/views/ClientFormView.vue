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
      class="space-y-8 max-w-3xl mx-auto bg-card text-card-foreground p-8 rounded-lg shadow-lg"
    >
      <!-- Section 1: Business & Goals - Styled as Bento Box -->
      <section class="space-y-6 p-6 border rounded-lg bg-background/50">
        <h2 class="text-2xl font-semibold mb-0 col-span-full">Business & Goals</h2>

        <!-- Bento Compartment 1: Business Name -->
        <FormField v-slot="{ componentField }" name="businessName">
          <FormItem class="p-4 border rounded-md bg-card/50">
            <FormLabel for="businessName">What name do you primarily use for your creative work or business?</FormLabel>
            <FormControl>
              <Input id="businessName" type="text" placeholder="e.g., Acme Corporation" v-bind="componentField" class="mt-2"/>
            </FormControl>
            <FormDescription class="mt-2">
              The official name of your company or organization.
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Bento Compartment 2: Business Description -->
        <FormField name="businessDescription" v-slot="{ field, errors }">
          <FormItem class="p-4 border rounded-md bg-card/50">
            <FormLabel>Briefly describe your business, organization, or freelance practice.</FormLabel>
            <FormControl class="mt-2">
               <Multiselect
                 v-bind="field" 
                 mode="tags"
                 :options="fullBusinessDescOptions"
                 :searchable="true"
                 :create-tag="true"
                 placeholder="Type or select categories"
                 :close-on-select="false"
                 :class="{ 'multiselect-invalid': errors.length > 0 }"
               />
            </FormControl>
             <FormDescription class="mt-2">
              Select from suggestions or type your own and press Enter.
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Bento Compartment 3: Target Audience -->
        <FormField name="targetAudience" v-slot="{ field, errors }">
          <FormItem class="p-4 border rounded-md bg-card/50">
            <FormLabel>Who is your target audience (ideal customer/client)?</FormLabel>
            <FormControl class="mt-2">
               <Multiselect
                 v-bind="field"
                 mode="tags"
                 :options="fullTargetAudienceOptions"
                 :searchable="true"
                 :create-tag="true"
                 placeholder="Type or select audiences"
                 :close-on-select="false"
                 :class="{ 'multiselect-invalid': errors.length > 0 }"
               />
            </FormControl>
             <FormDescription class="mt-2">
              Select from suggestions or type your own and press Enter.
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Primary Goals Multiselect -->
        <FormField name="primaryGoals" v-slot="{ field, errors }">
          <FormItem class="p-4 border rounded-md bg-card/50">
            <FormLabel>What are the primary goals for your new website?</FormLabel>
            <FormControl class="mt-2">
               <Multiselect
                 v-bind="field" 
                 mode="tags"
                 :options="primaryGoalsOptions"
                 :searchable="true"
                 :create-tag="true"
                 placeholder="Select or type goals"
                 :close-on-select="false"
                 :class="{ 'multiselect-invalid': errors.length > 0 }"
               />
            </FormControl>
             <FormDescription class="mt-2">
              What should the website achieve for your business? Select all that apply or add your own.
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Existing Website Question (Combined) -->
        <FormItem class="p-4 border rounded-md bg-card/50">
          <!-- Part 1: Yes/No -->
          <FormField name="hasExistingWebsite" v-slot="{ field }">
             <FormLabel>Do you currently have a website?</FormLabel>
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
          <div v-if="form.values.hasExistingWebsite === 'yes'" class="mt-6 space-y-6 border-t pt-6">
             <FormField name="existingWebsiteUrl" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel for="existingWebsiteUrl">If yes, what is the URL?</FormLabel>
                  <FormControl>
                    <Input id="existingWebsiteUrl" type="url" placeholder="https://example.com" v-bind="componentField" class="mt-1"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="existingWebsiteFeedback" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel for="existingWebsiteFeedback">What do you like and dislike about your current site?</FormLabel>
                  <FormControl>
                    <Textarea 
                      id="existingWebsiteFeedback"
                      placeholder="e.g., Like the design, dislike slow loading times..."
                      v-bind="componentField"
                      class="mt-1"
                    />
                  </FormControl>
                   <FormDescription class="mt-1">
                    Be specific! This helps understand your preferences.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              </FormField>
          </div>

          <!-- Part 3: Conditional Fields if NO -->
          <div v-if="form.values.hasExistingWebsite === 'no'" class="mt-6 space-y-4 border-t pt-6">
            <FormField name="domainNameStatus" v-slot="{ field }">
               <FormLabel class="text-base">Do you already have a domain name?</FormLabel>
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
                  <div v-if="form.values.domainNameStatus === 'yes'" class="pl-8 pt-2 pb-2">
                    <FormField name="domainName" v-slot="{ componentField }">
                      <FormItem>
                        <FormLabel for="domainName">What is your domain name?</FormLabel>
                        <FormControl>
                          <Input id="domainName" type="text" placeholder="yourdomain.com" v-bind="componentField" class="mt-1"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </div>

                  <FormItem class="flex items-center space-x-2">
                    <FormControl><RadioGroupItem id="domainNo" value="no" /></FormControl>
                    <FormLabel for="domainNo" class="font-normal">No, I don't have a domain name yet.</FormLabel>
                  </FormItem>
                   <!-- Removed Help option from here -->
                  
                  <!-- Nested Conditional Question if Status is 'no' -->
                  <div v-if="form.values.domainNameStatus === 'no'" class="pl-8 pt-4 space-y-3">
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

        <!-- More questions in this section will go here (as more compartments) -->
      </section>

      <!-- Section 2: Design Preferences & Inspiration -->
      <section class="space-y-6 p-6 border rounded-lg bg-background/50">
        <h2 class="text-2xl font-semibold mb-0 col-span-full">Design Preferences & Inspiration</h2>
        
        <!-- Visual Identity Question (Combined) -->
        <FormItem class="p-4 border rounded-md bg-card/50 space-y-6">
            <p class="font-medium text-foreground">Let's talk about your visual identity. Do you have anything like:</p>

            <!-- Logo -->
            <FormField name="hasLogo" v-slot="{ field }">
                <div class="space-y-2">
                    <FormLabel class="text-foreground">A specific logo you use?</FormLabel>
                    <FormControl class="mt-2">
                        <RadioGroup
                            :model-value="String(field.value)" 
                            @update:model-value="(value) => field.onChange(value === 'true')" 
                            class="flex items-center space-x-4"
                        >
                            <FormItem class="flex items-center space-x-2">
                                <FormControl><RadioGroupItem id="logoYes" value="true" /></FormControl>
                                <FormLabel for="logoYes" class="font-normal">Yes</FormLabel>
                            </FormItem>
                            <FormItem class="flex items-center space-x-2">
                                <FormControl><RadioGroupItem id="logoNo" value="false" /></FormControl>
                                <FormLabel for="logoNo" class="font-normal">No</FormLabel>
                            </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage /> 
                </div>
                 <!-- Message if YES -->
                 <FormDescription v-if="field.value === true" class="pl-2 text-xs">
                    Great! Please email your logo file(s) (preferably vector format like .svg or .ai, or high-res .png) separately.
                </FormDescription>
                <!-- Message if NO -->
                 <FormDescription v-if="field.value === false" class="pl-2 text-xs">
                    That's completely fine! Logo design is definitely something we can discuss. Start thinking about logos you like the look and feel of – it'll give us a great direction. You can also explore some interesting styles and ideas on <a href="https://logosystem.co/" target="_blank" rel="noopener noreferrer" class="underline hover:text-secondary">this site</a>.
                </FormDescription>
            </FormField>
            
            <!-- Brand Colors -->
            <FormField name="hasBrandColors" v-slot="{ field }">
                 <div class="space-y-2 border-t pt-4">
                    <FormLabel class="text-foreground">Certain colors you always use for your business?</FormLabel>
                    <FormControl class="mt-2">
                         <RadioGroup
                            :model-value="String(field.value)"
                            @update:model-value="(value) => field.onChange(value === 'true')"
                            class="flex items-center space-x-4"
                        >
                           <FormItem class="flex items-center space-x-2">
                                <FormControl><RadioGroupItem id="colorsYes" value="true" /></FormControl>
                                <FormLabel for="colorsYes" class="font-normal">Yes</FormLabel>
                            </FormItem>
                             <FormItem class="flex items-center space-x-2">
                                <FormControl><RadioGroupItem id="colorsNo" value="false" /></FormControl>
                                <FormLabel for="colorsNo" class="font-normal">No</FormLabel>
                            </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </div>
                <FormField v-if="field.value === true" name="brandColorsDescription" v-slot="{ componentField: descField }">
                     <FormItem class="mt-2 pl-2">
                        <FormLabel for="brandColorsDescription" class="sr-only">Brand Colors Description</FormLabel>                        
                        <FormControl>
                            <Textarea 
                            id="brandColorsDescription"
                            placeholder="Describe your colors (e.g., hex codes #RRGGBB, names, primary/secondary)"
                            v-bind="descField"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
            </FormField>

            <!-- Brand Fonts -->
            <FormField name="hasBrandFonts" v-slot="{ field }">
                 <div class="space-y-2 border-t pt-4">
                     <FormLabel class="text-foreground">Particular fonts you prefer for your name or materials?</FormLabel>
                    <FormControl class="mt-2">
                         <RadioGroup
                            :model-value="String(field.value)"
                            @update:model-value="(value) => field.onChange(value === 'true')"
                            class="flex items-center space-x-4"
                            >
                            <FormItem class="flex items-center space-x-2">
                                <FormControl><RadioGroupItem id="fontsYes" value="true" /></FormControl>
                                <FormLabel for="fontsYes" class="font-normal">Yes</FormLabel>
                            </FormItem>
                             <FormItem class="flex items-center space-x-2">
                                <FormControl><RadioGroupItem id="fontsNo" value="false" /></FormControl>
                                <FormLabel for="fontsNo" class="font-normal">No</FormLabel>
                            </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </div>
                <FormField v-if="field.value === true" name="brandFontsDescription" v-slot="{ componentField: descField }">
                     <FormItem class="mt-2 pl-2">
                        <FormLabel for="brandFontsDescription" class="sr-only">Brand Fonts Description</FormLabel>                        
                        <FormControl>
                            <Textarea 
                            id="brandFontsDescription"
                            placeholder="List font names (e.g., Montserrat for headings, Lato for body)"
                            v-bind="descField"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
            </FormField>

        </FormItem>

        <!-- Inspirational Websites Question -->
        <FormItem class="p-4 border rounded-md bg-card/50 space-y-4">
           <p class="font-medium text-foreground">Got any favorite websites that you think look really cool?</p>

           <FormField name="inspirationalWebsitesUrls" v-slot="{ componentField }">
              <FormItem>
                  <FormLabel for="inspirationalWebsitesUrls">Please share the URLs (web addresses)</FormLabel>
                  <FormControl>
                      <Textarea 
                        id="inspirationalWebsitesUrls"
                        placeholder="e.g., https://example.com, www.anothercoolsite.net (one per line is helpful)"
                        v-bind="componentField"
                        class="mt-1"
                        rows="3"
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
           </FormField>

            <FormField name="inspirationalWebsitesComments" v-slot="{ componentField }">
              <FormItem>
                  <FormLabel for="inspirationalWebsitesComments">What catches your eye about them?</FormLabel>
                  <FormControl>
                      <Textarea 
                        id="inspirationalWebsitesComments"
                        placeholder="e.g., I love the color scheme on the first site, the smooth animations on the second..."
                        v-bind="componentField"
                        class="mt-1"
                        rows="4"
                      />
                  </FormControl>
                   <FormDescription class="mt-1">
                    Visual inspiration is super helpful!
                  </FormDescription>
                  <FormMessage />
              </FormItem>
           </FormField>

        </FormItem>

        <!-- Aesthetic Style Question -->
        <FormField name="aestheticStyle" v-slot="{ componentField }">
           <FormItem class="p-4 border rounded-md bg-card/50">
            <FormLabel>What is your preferred aesthetic style for your website?</FormLabel>
            <FormControl class="mt-2">
              <TooltipProvider :delay-duration="200">
                <ToggleGroup 
                    type="multiple" 
                    variant="outline" 
                    class="flex flex-wrap gap-2" 
                    :model-value="componentField.modelValue || []"
                    @update:model-value="(value) => updateMultiSelectField('aestheticStyle', value)"
                > 
                    <Tooltip v-for="option in aestheticStyleOptions" :key="option.value">
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
             <FormDescription class="mt-2">
              Select multiple styles if applicable. Hover over a style for a brief description.
            </FormDescription>
            <FormMessage />
           </FormItem>
         </FormField>

        <!-- More questions for this section will go here -->
      </section>

      <!-- Section 3: Functionality & Content -->
      <section class="space-y-6 p-6 border rounded-lg bg-background/50">
        <h2 class="text-2xl font-semibold mb-0 col-span-full">Functionality & Content</h2>
        
        <!-- Essential Pages Question -->
         <FormField name="essentialPages" v-slot="{ componentField }"> 
           <FormItem class="p-4 border rounded-md bg-card/50">
            <FormLabel>What are the essential pages you envision for your website?</FormLabel>
            <FormControl class="mt-2">
              <TooltipProvider :delay-duration="200">
                <ToggleGroup 
                    type="multiple" 
                    variant="outline" 
                    class="flex flex-wrap gap-2" 
                    :model-value="componentField.modelValue || []"
                    @update:model-value="(value) => updateMultiSelectField('essentialPages', value)"
                > 
                    <Tooltip v-for="option in essentialPagesOptions" :key="option.value">
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
             <FormDescription class="mt-2">
              Select the pages you definitely need. Hover over a page name for a description.
            </FormDescription>
            <FormMessage />
           </FormItem>
         </FormField>

        <!-- Desired Functionality Question -->
        <FormField name="desiredFeatures" v-slot="{ field }">
          <FormItem class="p-4 border rounded-md bg-card/50">
            <FormLabel>Thinking about what you want your website visitors to be able to do on your site, what key features or functionalities come to mind? Consider these common categories:</FormLabel>
            <div class="mt-4 space-y-6">
              <!-- Loop through Categories -->
              <div v-for="category in functionalityOptions" :key="category.category">
                <h4 class="font-medium text-foreground mb-1">{{ category.category }}</h4>
                <p class="text-sm text-muted-foreground mb-3">{{ category.definition }}</p>
                <div class="space-y-2 pl-2">
                  <!-- Loop through Examples -->
                  <div 
                    v-for="example in category.examples" 
                    :key="example.value" 
                    class="flex items-center space-x-2"
                  >
                    <Checkbox 
                      :id="example.value"
                      :value="example.value"
                      :checked="field.value?.includes(example.value)"
                      @update:checked="() => toggleArrayItem('desiredFeatures', example.value)"
                    />
                    <Label :for="example.value" class="font-normal">{{ example.label }}</Label>
                  </div>
                </div>
              </div>

              <!-- 'Other' Option -->
              <div class="pt-4 border-t">
                 <div class="flex items-center space-x-2">
                     <Checkbox 
                      id="other_features"
                      value="other_features"
                      :checked="field.value?.includes('other_features')"
                      @update:checked="() => toggleArrayItem('desiredFeatures', 'other_features')"
                    />
                    <Label for="other_features" class="font-normal">Other (please specify)</Label>
                 </div>
                 <FormField v-if="form.values.desiredFeatures?.includes('other_features')" name="desiredFeaturesOther" v-slot="{ componentField }">
                    <FormItem class="mt-2 pl-8">
                      <FormLabel for="desiredFeaturesOther" class="sr-only">Other Desired Features</FormLabel>
                      <FormControl>
                        <Textarea 
                          id="desiredFeaturesOther"
                          placeholder="Describe any other features you need..."
                          v-bind="componentField"
                          rows="3"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                 </FormField>
              </div>
            </div>
             <FormMessage /> <!-- For the main desiredFeatures field if needed -->
          </FormItem>
        </FormField>

        <!-- More questions for this section will go here -->
      </section>

      <!-- Section 4: Technical & Logistical Aspects -->
      <section class="space-y-6 p-6 border rounded-lg bg-background/50">
        <h2 class="text-2xl font-semibold mb-0 col-span-full">Technical & Logistical Aspects</h2>
        
        <!-- Budget Tier Question -->
        <FormField name="projectBudgetTier" v-slot="{ field }">
           <FormItem class="p-4 border rounded-md bg-card/50">
            <FormLabel>What is your desired budget range for this project?</FormLabel> 
            <FormDescription class="text-xs mt-1 mb-4">
              (This helps gauge the scope and features feasible. We can adjust based on detailed needs.)
            </FormDescription>
            <FormDescription class="text-xs mt-1 mb-4">
              Just a heads-up, the quicker you need it, the more focused the project might have to be or the more it could cost, while a more relaxed timeline gives us more room to explore and potentially keep the budget a bit easier.
            </FormDescription>
            <FormControl>
                <RadioGroup
                  :model-value="field.value"
                  @update:model-value="field.onChange"
                  class="flex flex-col space-y-4"
                >
                  <div v-for="option in budgetTierOptions" :key="option.value">
                     <FormItem class="flex items-start space-x-3 space-y-0">
                        <FormControl>
                           <RadioGroupItem :id="option.value" :value="option.value" />
                        </FormControl>
                        <div class="grid gap-1.5 leading-none">
                           <Label :for="option.value" class="font-medium">
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
        <FormItem class="p-4 border rounded-md bg-card/50">
           <p class="font-medium text-foreground">Who will be the primary point of contact for this project?</p>
           <div class="mt-4 space-y-4">
              <FormField name="contactName" v-slot="{ componentField }">
                 <FormItem>
                   <FormLabel for="contactName">Name</FormLabel>
                   <FormControl>
                     <Input id="contactName" type="text" placeholder="Full Name" v-bind="componentField" />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               </FormField>

               <FormField name="contactEmail" v-slot="{ componentField }">
                 <FormItem>
                   <FormLabel for="contactEmail">Email</FormLabel>
                   <FormControl>
                     <Input id="contactEmail" type="email" placeholder="email@example.com" v-bind="componentField" />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               </FormField>

               <FormField name="contactPhone" v-slot="{ componentField }">
                 <FormItem>
                   <FormLabel for="contactPhone">Phone Number (Optional)</FormLabel>
                   <FormControl>
                     <Input id="contactPhone" type="tel" placeholder="(555) 123-4567" v-bind="componentField" />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               </FormField>
           </div>
        </FormItem>

        <!-- Feedback Preference Question -->
         <FormField name="feedbackPreference" v-slot="{ field }">
          <FormItem class="p-4 border rounded-md bg-card/50">
            <FormLabel>How would you prefer to provide feedback during the design process?</FormLabel>
             <div class="mt-4 space-y-2">
              <div 
                v-for="option in feedbackPreferenceOptions" 
                :key="option.value" 
                class="flex items-center space-x-2"
              >
                <Checkbox 
                  :id="option.value"
                  :value="option.value"
                  :checked="field.value?.includes(option.value)"
                  @update:checked="() => toggleArrayItem('feedbackPreference', option.value)" 
                />
                <Label :for="option.value" class="font-normal">{{ option.label }}</Label>
              </div>
            </div>
             <FormMessage />
          </FormItem>
        </FormField>

        <!-- More questions for this section will go here -->
      </section>

      <Button type="submit">
        Submit Questionnaire
      </Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { h, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import Multiselect from '@vueform/multiselect'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

// --- Kept full options arrays ---
const fullBusinessDescOptions = [
  { value: 'small-business-general', label: 'Small Business (General)' },
  { value: 'startup', label: 'Startup' },
  { value: 'ecommerce', label: 'E-commerce Store' },
  { value: 'local-retail', label: 'Local Retail Business' },
  { value: 'food-service', label: 'Restaurant/Cafe/Bar' },
  { value: 'service-based', label: 'Service-Based Business (e.g., consulting, marketing)' },
  { value: 'tech', label: 'Technology Company' },
  { value: 'non-profit', label: 'Non-Profit Organization' },
  { value: 'education', label: 'Educational Institution' },
  { value: 'real-estate', label: 'Real Estate Agency' },
  { value: 'health-wellness', label: 'Health & Wellness Practice' },
  { value: 'manufacturing', label: 'Manufacturing Company' },
  { value: 'freelance-writer', label: 'Freelance Writer/Editor' },
  { value: 'freelance-designer', label: 'Freelance Graphic Designer' },
  { value: 'freelance-developer', label: 'Freelance Web Developer' },
  { value: 'visual-artist', label: 'Visual Artist (e.g., painter, sculptor)' },
  { value: 'musician-performer', label: 'Musician/Performer' },
  { value: 'photo-video', label: 'Photographer/Videographer' },
  { value: 'illustrator-animator', label: 'Illustrator/Animator' },
  { value: 'craftsperson-maker', label: 'Craftsperson/Maker' },
  { value: 'agency', label: 'Agency (e.g., marketing, design, PR)' },
  { value: 'arts-culture', label: 'Arts & Culture Organization (e.g., gallery, museum, theater)' },
  { value: 'community-group', label: 'Community Group/Organization' },
  { value: 'consulting-firm', label: 'Consulting Firm' },
  { value: 'saas', label: 'Software as a Service (SaaS) Company' },
  { value: 'freelance-social', label: 'Freelance Social Media Manager' },
  { value: 'freelance-translator', label: 'Freelance Translator/Interpreter' },
  { value: 'fashion', label: 'Fashion Designer/Stylist' },
  { value: 'architect-interior', label: 'Architect/Interior Designer' },
  { value: 'coach-therapist', label: 'Life Coach/Therapist' },
  { value: 'other', label: 'Other (Type to add)' },
];

const fullTargetAudienceOptions = [
  { value: 'consumers-general', label: 'General Consumers' },
  { value: 'smb', label: 'Small to Medium-Sized Businesses (SMBs)' },
  { value: 'enterprise', label: 'Large Enterprises' },
  { value: 'local-community', label: 'Local Community Members' },
  { value: 'age-specific', label: 'Specific Age Groups (e.g., Millennials, Gen Z, Baby Boomers)' },
  { value: 'income-specific', label: 'Specific Income Levels' },
  { value: 'profession-industry', label: 'Specific Professions/Industries (e.g., Healthcare, Tech)' },
  { value: 'creative-pros', label: 'Creative Professionals (e.g., Artists, Designers)' },
  { value: 'students', label: 'Students' },
  { value: 'homeowners', label: 'Homeowners' },
  { value: 'pet-owners', label: 'Pet Owners' },
  { value: 'travelers', label: 'Travel Enthusiasts' },
  { value: 'foodies', label: 'Foodies/Culinary Enthusiasts' },
  { value: 'tech-savvy', label: 'Tech-Savvy Individuals' },
  { value: 'eco-conscious', label: 'Environmentally Conscious Consumers' },
  { value: 'health-wellness', label: 'Health & Wellness Seekers' },
  { value: 'luxury-consumers', label: 'Luxury Goods Consumers' },
  { value: 'budget-conscious', label: 'Budget-Conscious Consumers' },
  { value: 'other-local-biz', label: 'Other Local Businesses' },
  { value: 'non-profits', label: 'Non-Profit Organizations' },
  { value: 'educational', label: 'Educational Institutions' },
  { value: 'event-attendees', label: 'Event Attendees' },
  { value: 'group-members', label: 'Members of a Specific Group/Association' },
  { value: 'global-audience', label: 'Global Audience' },
  { value: 'niche-market', label: 'Niche Market (please specify in \'Other\')' },
  { value: 'freelancers-individual', label: 'Individual Freelancers' },
  { value: 'startups', label: 'Startups' },
  { value: 'creative-agencies', label: 'Small Creative Agencies' },
  { value: 'authors-writers', label: 'Authors/Writers' },
  { value: 'musicians', label: 'Musicians/Performers' },
  { value: 'other', label: 'Other (Type to add)' },
];

const primaryGoalsOptions = [
  { value: 'sales-revenue', label: 'Increase Sales/Revenue' },
  { value: 'leads-inquiries', label: 'Generate Leads/Inquiries' },
  { value: 'brand-awareness', label: 'Build Brand Awareness/Recognition' },
  { value: 'customer-engagement', label: 'Improve Customer Engagement' },
  { value: 'provide-info', label: 'Provide Information to Existing Customers' },
  { value: 'attract-customers', label: 'Attract New Customers' },
  { value: 'showcase-portfolio', label: 'Showcase Portfolio/Work' },
  { value: 'credibility-authority', label: 'Establish Online Credibility/Authority' },
  { value: 'customer-support', label: 'Improve Customer Support' },
  { value: 'build-community', label: 'Build a Community/Forum' },
  { value: 'ecommerce', label: 'Sell Products/Services Online (E-commerce)' },
  { value: 'promote-events', label: 'Promote Events/Workshops' },
  { value: 'blog-news', label: 'Share News/Updates (Blog)' },
  { value: 'collect-emails', label: 'Collect Email Addresses/Build a Mailing List' },
  { value: 'drive-traffic-physical', label: 'Drive Traffic to a Physical Location' },
  { value: 'seo-visibility', label: 'Increase Online Visibility (SEO)' },
  { value: 'online-bookings', label: 'Facilitate Online Bookings/Reservations' },
  { value: 'streamline-processes', label: 'Streamline Internal Processes' },
  { value: 'recruit-talent', label: 'Recruit New Talent' },
  { value: 'increase-donations', label: 'Increase Donations (for Non-Profits)' },
  { value: 'educate-audience', label: 'Educate the Audience' },
  { value: 'personal-branding', label: 'Personal Branding/Online Presence (for Individuals)' },
  { value: 'resource-hub', label: 'Create a Resource Hub' },
  { value: 'integrate-marketing', label: 'Integrate with Other Marketing Channels' },
  { value: 'other', label: 'Other (please specify)' },
];

// --- Option sets ---
const aestheticStyleOptions = [
  { value: 'modern', label: 'Modern', definition: 'Clean lines, open space, contemporary fonts, often incorporates technology and innovation.', style: 'aesthetic' },
  { value: 'minimalist', label: 'Minimalist', definition: 'Emphasizes simplicity, functionality, and ample white space. Often uses a limited color palette.', style: 'aesthetic' },
  { value: 'classic', label: 'Classic', definition: 'Timeless design, often with traditional fonts, balanced layouts, and a sense of sophistication.', style: 'aesthetic' },
  { value: 'bold', label: 'Bold', definition: 'High contrast, strong colors, impactful typography, makes a strong visual statement.', style: 'aesthetic' },
  { value: 'creative', label: 'Creative', definition: 'Unique, artistic, often breaks traditional design rules, emphasizes originality.', style: 'aesthetic' },
  { value: 'corporate', label: 'Corporate', definition: 'Professional, trustworthy, often uses a more reserved color palette and structured layouts.', style: 'aesthetic' },
  { value: 'playful', label: 'Playful', definition: 'Fun, energetic, uses bright colors, whimsical elements, and a lighthearted tone.', style: 'aesthetic' },
  { value: 'luxury', label: 'Luxury', definition: 'Elegant, sophisticated, often uses high-quality imagery, refined typography, and a sense of exclusivity.', style: 'aesthetic' },
  { value: 'rustic', label: 'Rustic', definition: 'Natural, organic, often incorporates textures like wood and stone, earthy color palettes.', style: 'aesthetic' },
  { value: 'industrial', label: 'Industrial', definition: 'Raw, edgy, often inspired by factories and urban environments, uses exposed elements and dark colors.', style: 'aesthetic' },
  { value: 'bohemian', label: 'Bohemian', definition: 'Relaxed, eclectic, often incorporates natural elements, patterns, and a warm color palette.', style: 'aesthetic' },
  { value: 'artdeco', label: 'Art Deco', definition: 'Glamorous, geometric patterns, rich colors, and a sense of vintage luxury from the 1920s-1930s.', style: 'aesthetic' },
  { value: 'vintage', label: 'Vintage', definition: 'Inspired by past eras, can range from retro to antique, often uses specific color palettes and typography.', style: 'aesthetic' },
  { value: 'scandinavian', label: 'Scandinavian', definition: 'Clean, functional, minimalist with a focus on natural light and materials, often uses muted colors.', style: 'aesthetic' },
  { value: 'geometric', label: 'Geometric', definition: 'Emphasizes shapes, lines, and patterns in a structured way.', style: 'aesthetic' },
  { value: 'organic', label: 'Organic', definition: 'Natural, flowing shapes, often uses earthy tones and textures inspired by nature.', style: 'aesthetic' },
  { value: 'dark', label: 'Dark', definition: 'Evokes a sense of drama, mystery, or sophistication through dark color palettes and contrasting elements.', style: 'aesthetic' },
  { value: 'bright', label: 'Bright', definition: 'Energetic, optimistic, uses bold and saturated colors.', style: 'aesthetic' },
  { value: 'elegant', label: 'Elegant', definition: 'Refined, graceful, often uses sophisticated typography and a balanced layout.', style: 'aesthetic' },
  { value: 'tech', label: 'Tech', definition: 'Sleek, often incorporates digital-inspired elements, sharp lines, and a modern color palette.', style: 'aesthetic' },
  { value: 'clean', label: 'Clean', definition: 'Prioritizes clarity and simplicity in layout and design elements.', style: 'aesthetic' },
  { value: 'maximalist', label: 'Maximalist', definition: 'Embraces abundance, patterns, colors, and textures.', style: 'aesthetic' },
  { value: 'whimsical', label: 'Whimsical', definition: 'Playful, fanciful, imaginative.', style: 'aesthetic' },
  { value: 'sophisticated', label: 'Sophisticated', definition: 'Refined, cultured, often uses a more mature color palette and elegant typography.', style: 'aesthetic' },
  { value: 'abstract', label: 'Abstract', definition: 'Non-representational, focuses on form, color, and texture for artistic expression.', style: 'aesthetic' },
  { value: 'earthy', label: 'Earthy', definition: 'Natural, grounded, uses a color palette inspired by earth tones.', style: 'aesthetic' },
  { value: 'professional', label: 'Professional', definition: 'Formal, competent, reliable.', style: 'tone' },
  { value: 'friendly', label: 'Friendly', definition: 'Welcoming, warm, approachable.', style: 'tone' },
  { value: 'authoritative', label: 'Authoritative', definition: 'Knowledgeable, expert, confident.', style: 'tone' },
  { value: 'trustworthy', label: 'Trustworthy', definition: 'Reliable, honest, credible.', style: 'tone' },
  { value: 'modern', label: 'Modern', definition: 'Contemporary, up-to-date, stylish.', style: 'tone' },
  { value: 'approachable', label: 'Approachable', definition: 'Easy to connect with, open, inviting.', style: 'tone' },
  { value: 'creative', label: 'Creative', definition: 'Imaginative, original, artistic.', style: 'tone' },
  { value: 'innovative', label: 'Innovative', definition: 'Cutting-edge, forward-thinking, experimental.', style: 'tone' },
  { value: 'sophisticated', label: 'Sophisticated', definition: 'Refined, elegant, cultured.', style: 'tone' },
  { value: 'playful', label: 'Playful', definition: 'Fun, lighthearted, whimsical.', style: 'tone' },
  { value: 'serious', label: 'Serious', definition: 'Earnest, focused, important.', style: 'tone' },
  { value: 'calming', label: 'Calming', definition: 'Peaceful, serene, relaxing.', style: 'tone' },
  { value: 'energetic', label: 'Energetic', definition: 'Lively, dynamic, enthusiastic.', style: 'tone' },
  { value: 'elegant', label: 'Elegant', definition: 'Graceful, stylish, refined.', style: 'tone' },
  { value: 'casual', label: 'Casual', definition: 'Relaxed, informal, easygoing.', style: 'tone' },
  { value: 'bold', label: 'Bold', definition: 'Confident, assertive, impactful.', style: 'tone' },
  { value: 'minimalist', label: 'Minimalist', definition: 'Simple, clean, uncluttered.', style: 'tone' },
  { value: 'warm', label: 'Warm', definition: 'Inviting, comforting, friendly.', style: 'tone' },
  { value: 'cool', label: 'Cool', definition: 'Modern, sleek, sophisticated (can also imply aloofness depending on context).' , style: 'tone' },
  { value: 'luxurious', label: 'Luxurious', definition: 'High-end, opulent, exclusive.', style: 'tone' },
  { value: 'down-to-earth', label: 'Down-to-earth', definition: 'Honest, genuine, relatable.', style: 'tone' },
  { value: 'informative', label: 'Informative', definition: 'Educational, factual, helpful.', style: 'tone' },
  { value: 'educational', label: 'Educational', definition: 'Instructive, guiding, knowledgeable.', style: 'tone' },
  { value: 'inspirational', label: 'Inspirational', definition: 'Motivating, uplifting, encouraging.', style: 'tone' },
  { value: 'empowering', label: 'Empowering', definition: 'Strengthening, confident, enabling.', style: 'tone' },
  { value: 'authentic', label: 'Authentic', definition: 'Genuine, real, true to its values.', style: 'tone' },
  { value: 'intriguing', label: 'Intriguing', definition: 'Curious, fascinating, captivating.', style: 'tone' },
  { value: 'direct', label: 'Direct', definition: 'Clear, straightforward, concise.', style: 'tone' },
  { value: 'subtle', label: 'Subtle', definition: 'Understated, delicate, nuanced.', style: 'tone' },
  { value: 'whimsical', label: 'Whimsical', definition: 'Playful, fanciful, imaginative.', style: 'tone' },
];

const essentialPagesOptions = [
  { value: 'homepage', label: 'Homepage', definition: 'The main entry point and introduction to your website.' },
  { value: 'about', label: 'About Us/Me', definition: 'Information about your business, organization, or yourself.' },
  { value: 'services', label: 'Services', definition: 'A detailed overview of the services you offer.' },
  { value: 'products', label: 'Products', definition: 'A catalog or listing of the products you sell.' },
  { value: 'portfolio', label: 'Portfolio/Work', definition: 'Showcase of your previous projects or artistic work.' },
  { value: 'contact', label: 'Contact Us', definition: 'Information and a form for users to get in touch with you.' },
  { value: 'blog', label: 'Blog/News', definition: 'A section for sharing updates, articles, and insights.' },
  { value: 'pricing', label: 'Pricing/Plans', definition: 'Information about your fees, packages, or subscription options.' },
  { value: 'testimonials', label: 'Testimonials/Reviews', definition: 'Showcase of positive feedback from previous clients or customers.' },
  { value: 'faq', label: 'FAQ (Frequently Asked Questions)', definition: 'Answers to common questions users might have.' },
  { value: 'gallery', label: 'Gallery/Images', definition: 'A visual collection of photos or artwork.' },
  { value: 'team', label: 'Team/Staff', definition: 'Information about the people behind your business or organization.' },
  { value: 'careers', label: 'Careers/Jobs', definition: 'Information about job openings within your company.' },
  { value: 'events', label: 'Events/Calendar', definition: 'A listing of upcoming events, workshops, or appointments.' },
  { value: 'resources', label: 'Resources/Downloads', definition: 'A section for offering helpful documents, guides, or tools.' },
  { value: 'store', label: 'Online Store/Shop', definition: 'The main section for e-commerce functionality.' },
  { value: 'account', label: 'User Account/Dashboard', definition: 'A personalized area for registered users to manage their information.' },
  { value: 'privacy', label: 'Privacy Policy', definition: 'Information about how user data is collected and used.' },
  { value: 'terms', label: 'Terms of Service/Use', definition: 'The rules and regulations for using your website.' },
  { value: 'search', label: 'Search', definition: 'Functionality for users to find specific content on your site.' },
  { value: 'landingpage', label: 'Landing Page (Specific Campaign)', definition: 'A dedicated page for a particular marketing campaign or offer.' },
  { value: 'membership', label: 'Membership/Subscription', definition: 'Information about joining a membership program or subscribing to content.' },
  { value: 'booking', label: 'Booking/Reservations', definition: 'Functionality for users to schedule appointments or make reservations.' },
  { value: 'contactform', label: 'Contact Form (Standalone)', definition: 'A dedicated page with only a contact form.' },
  { value: 'other', label: 'Other', definition: 'A field for the user to specify any other essential pages.' }
];

const functionalityOptions = [
  {
    category: "Communication",
    definition: "Ways for you and your website visitors to talk to each other or stay in touch.",
    examples: [
      { value: "comm-contact-forms", label: "Contact forms" },
      { value: "comm-live-chat", label: "Live chat" },
      { value: "comm-newsletter", label: "Newsletter signup" }
    ]
  },
  {
    category: "E-commerce",
    definition: "If you plan to sell things online, these are the tools to make that happen.",
    examples: [
      { value: "ecom-cart", label: "Shopping cart" },
      { value: "ecom-payment", label: "Payment processing" },
      { value: "ecom-filtering", label: "Product filtering/sorting" },
      { value: "ecom-order-mgmt", label: "Order management" }
    ]
  },
  {
    category: "User Interaction",
    definition: "Features that allow visitors to engage with your website and each other.",
    examples: [
      { value: "user-accounts", label: "Account creation/login" },
      { value: "user-profiles", label: "User profiles" },
      { value: "user-comments", label: "Commenting systems" },
      { value: "user-forums", label: "Forums" },
      { value: "user-surveys", label: "Surveys/Polls" }
    ]
  },
  {
    category: "Content Display",
    definition: "How information and media are shown on your website.",
    examples: [
      { value: "content-galleries", label: "Image galleries" },
      { value: "content-video", label: "Video embedding" },
      { value: "content-search", label: "Search functionality" },
      { value: "content-blog", label: "Blog/Article sections" },
      { value: "content-maps", label: "Interactive maps" }
    ]
  },
   // ... Add all other categories and examples here following the same structure ...
   // Make sure each 'value' is unique across all examples
   {
    category: "Community Features",
    definition: "Tools for building a group of people around your website.",
    examples: [
      { value: "commty-discussions", label: "Discussion areas" },
      { value: "commty-profiles", label: "Personal profiles for members" },
      { value: "commty-messaging", label: "Ways for members to send private messages" }
    ]
  }
];

const budgetTierOptions = [
  {
    value: 'launchpad',
    label: 'Launchpad',
    price: 'Under $1,500',
    definition: 'Ideal for a very simple online presence, such as a basic landing page or informational one-pager. Limited features and design options.'
  },
  {
    value: 'foundation',
    label: 'Foundation',
    price: '$1,500 - $3,000',
    definition: 'Best for foundational websites, simple portfolios, or single landing pages with a bit more customization.'
  },
  {
    value: 'growthengine',
    label: 'Growth Engine',
    price: '$3,000 - $7,500',
    definition: 'Suitable for small business websites with essential features, custom design, and a few key functionalities to get you growing.'
  },
  {
    value: 'expansion',
    label: 'Expansion',
    price: '$7,500 - $15,000',
    definition: 'Ideal for established small to medium-sized businesses needing more advanced features, basic e-commerce, or enhanced customization to attract more customers.'
  },
  {
    value: 'enterprise',
    label: 'Enterprise',
    price: '$15,000 - $25,000+',
    definition: 'For businesses requiring sophisticated design, custom integrations, and robust functionality for significant online presence and growth.'
  },
  {
    value: 'not_sure',
    label: 'Not Sure / Open to Discussion',
    price: 'Discuss Needs',
    definition: "I'm not sure about the cost, but I'm open to discussing options based on my needs."
  }
];

const feedbackPreferenceOptions = [
  { value: 'written', label: 'Primarily through written comments and emails.' },
  { value: 'video', label: "I'd prefer regular video calls to discuss visuals." },
  { value: 'mix', label: "I'm happy with a mix of both." },
  { value: 'milestones', label: 'I trust your expertise and will mostly provide feedback at key milestones.' },
];

// --- Zod schema ---
const formSchema = toTypedSchema(z.object({
  businessName: z.string().min(2).max(100),
  businessDescription: z.array(z.string()).optional().default([]),
  targetAudience: z.array(z.string()).optional().default([]),
  primaryGoals: z.array(z.string()).optional().default([]),
  // Fields for existing website question
  hasExistingWebsite: z.enum(['yes', 'no'], { 
    required_error: 'Please indicate if you have an existing website.',
  }),
  existingWebsiteUrl: z.string().optional(),
  existingWebsiteFeedback: z.string().optional(),
  // Changed enum, only Yes/No now
  domainNameStatus: z.enum(['yes', 'no']).optional(), 
  domainName: z.string().optional(), 
  // New field for help status when domainNameStatus is 'no'
  domainHelpNeededStatus: z.enum(['knows_want', 'needs_help', 'unsure']).optional(), 
  // Design Preferences fields
  hasLogo: z.boolean().optional().default(false),
  hasBrandColors: z.boolean().optional().default(false),
  brandColorsDescription: z.string().optional(),
  hasBrandFonts: z.boolean().optional().default(false),
  brandFontsDescription: z.string().optional(),
  // Inspiration fields
  inspirationalWebsitesUrls: z.string().optional(),
  inspirationalWebsitesComments: z.string().optional(),
  // New field for aesthetic style
  aestheticStyle: z.array(z.string()).optional().default([]),
  // New field for essential pages
  essentialPages: z.array(z.string()).optional().default([]),
  // Functionality fields
  desiredFeatures: z.array(z.string()).optional().default([]),
  desiredFeaturesOther: z.string().optional(),
  // New field for budget tier
  projectBudgetTier: z.string({ 
    required_error: 'Please select a budget range or indicate if unsure.' 
  }).optional(), // Making it optional for now, but added error message
  // Contact fields
  contactName: z.string().min(1, { message: 'Name is required.'}),
  contactEmail: z.string().min(1, { message: 'Email is required.'}).email({ message: 'Please enter a valid email address.'}),
  contactPhone: z.string().optional(),
  // New field for feedback preference
  feedbackPreference: z.array(z.string()).optional().default([]),
}).superRefine((data, ctx) => {
  // If they have a website, the URL is required and must be a valid URL
  if (data.hasExistingWebsite === 'yes') {
    if (!data.existingWebsiteUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Website URL is required.',
        path: ['existingWebsiteUrl'],
      });
    } else {
      const urlResult = z.string().url({ message: "Please enter a valid URL (e.g., https://example.com)" }).safeParse(data.existingWebsiteUrl);
      if (!urlResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: urlResult.error.issues[0].message,
          path: ['existingWebsiteUrl'],
        });
      }
    }
    // You could add a check here if feedback is required too
  }
  // Refinement for domainName (unchanged logic, but now depends on domainNameStatus === 'yes')
  if (data.hasExistingWebsite === 'no' && data.domainNameStatus === 'yes' && !data.domainName?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please enter your domain name.',
      path: ['domainName'],
    });
  }
  // Refinement for Brand Colors
  if (data.hasBrandColors && !data.brandColorsDescription?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please describe your brand colors or provide hex codes.',
        path: ['brandColorsDescription'],
      });
  }
  // Refinement for Brand Fonts
  if (data.hasBrandFonts && !data.brandFontsDescription?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please list your preferred font names.',
        path: ['brandFontsDescription'],
      });
  }
  // Refinement for Desired Features Other
  if (data.desiredFeatures?.includes('other_features') && !data.desiredFeaturesOther?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please specify the other desired features.',
      path: ['desiredFeaturesOther'],
    });
  }
}));

// --- Form setup ---
const form = useForm({ validationSchema: formSchema })
const onSubmit = form.handleSubmit((values) => { console.log('Form submitted!', values) })

// Helper function to update array field values for ToggleGroup
function updateMultiSelectField(fieldName: string, newValue: unknown) {
  let finalValue: string[] = [];
  // Check if it's an array first
  if (Array.isArray(newValue)) {
    // Ensure all elements are strings
    finalValue = newValue.map(item => String(item)); 
  } else if (newValue !== null && newValue !== undefined) {
    // Handle single value (string or number), convert to string
    finalValue = [String(newValue)];
  } 
  // Now finalValue is guaranteed to be string[]
  form.setFieldValue(fieldName as any, finalValue);
}

// Helper function to toggle features/preferences in an array field
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

  // Specific logic for clearing 'other' fields if needed (can be expanded)
  if (fieldName === 'desiredFeatures' && itemValue === 'other_features' && itemIndex > -1) {
     form.setFieldValue('desiredFeaturesOther', undefined);
  }
}
</script>

<style>
/* Import Multiselect styles (scoped might interfere) */
/* @import "@vueform/multiselect/themes/default.css"; - MOVED TO main.scss */

/* Custom styling for Multiselect to better match Shadcn/Tailwind */
:deep(.multiselect-wrapper) {
  @apply relative w-full flex items-center justify-end box-border cursor-pointer border border-input bg-background rounded-md shadow-sm pl-3 pr-10 py-2 text-left 
         focus:outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring sm:text-sm;
}

:deep(.multiselect-tags) {
  @apply flex-grow flex-shrink flex flex-wrap items-center gap-1;
}

:deep(.multiselect-tag) {
  @apply inline-flex items-center text-sm font-medium whitespace-nowrap rounded-md 
         bg-secondary text-secondary-foreground 
         py-0.5 px-2 mr-1 mb-1;
}

:deep(.multiselect-tag-remove) {
  @apply inline-flex items-center justify-center w-4 h-4 ml-1.5;
}
:deep(.multiselect-tag-remove-icon) {
  @apply w-3 h-3;
}

:deep(.multiselect-placeholder) {
 @apply absolute left-3 right-10 top-1/2 transform -translate-y-1/2 text-muted-foreground;
}

:deep(.multiselect-search) {
  @apply w-full absolute inset-0 outline-none appearance-none box-border border-0 
         bg-transparent text-sm font-sans pl-3;
  /* Match input height potentially */
}

:deep(.multiselect-dropdown) {
  @apply absolute -left-px -right-px bottom-0 transform translate-y-full border border-input mt-1.5 
         max-h-60 w-[calc(100%+2px)] overflow-auto rounded-md bg-popover py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 
         focus:outline-none sm:text-sm z-10;
}

:deep(.multiselect-options) {
  @apply list-none p-0 m-0;
}

:deep(.multiselect-option) {
  @apply relative cursor-default select-none py-2 pl-3 pr-9 text-popover-foreground;
}
:deep(.multiselect-option.is-pointed) {
  @apply bg-accent text-accent-foreground;
}
:deep(.multiselect-option.is-selected) {
  @apply font-semibold;
}
:deep(.multiselect-option.is-disabled) {
  @apply text-muted-foreground cursor-not-allowed;
}

/* Add a style for invalid state */
:deep(.multiselect-invalid .multiselect-wrapper) {
   @apply border-destructive ring-destructive focus-visible:border-destructive focus-visible:ring-destructive;
}

/* Add background and text color to Tooltip Content */
:deep(.tooltip-content) { /* Or inspect browser for the exact class */
  @apply bg-popover text-popover-foreground;
}

/* Scoped styles from before */
.client-form-container {
  color: #f0f0f0;
  height: 100vh;
}
.client-form-intro {
  color: #f0f0f0;
  margin-top: 96px;
}

/* Custom Switch Styling */
:deep(button[role='switch']) {
  /* Ensure positioning context for the thumb */
  @apply relative;
}

:deep(button[role='switch'][data-state='unchecked']) {
  @apply bg-muted/50 border border-muted;
}

:deep(button[role='switch'][data-state='checked']) {
   /* Optional: Ensure checked state uses primary/accent color if needed */
   /* @apply bg-primary; */ 
}

/* Explicitly style the thumb's position and transition */
:deep(button[role='switch'] > span) { 
  @apply pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out; 
  /* Adjust h- / w- based on your switch size if needed */
}

:deep(button[role='switch'][data-state='unchecked'] > span) {
   @apply translate-x-0.5; /* Start position */
}

:deep(button[role='switch'][data-state='checked'] > span) {
   @apply translate-x-[1.125rem]; /* End position (adjust based on switch width) */
   /* Typically width of switch - width of thumb - padding */
}

</style> 