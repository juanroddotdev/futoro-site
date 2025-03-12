vue
<script setup lang="ts">
import { ref } from 'vue';

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  message: ''
});

const handleSubmit = (e: Event) => {
  e.preventDefault();
  console.log('Form submitted:', form.value);
};
</script>
<template>
  <div class="form-wrapper">
    <form @submit="handleSubmit" autocomplete="on" class="form-contents">
      <div class="field-list border border-black">
        <fieldset class="form-item fields name">
          <legend>
            <div class="title">
              <span>Name</span>
              <span class="description required">(required)</span>
            </div>
          </legend>
          <div class="field-inputs-row">
            <div class="field first-name border border-black">
              <label class="caption" for="fname">
                <div class="caption-text">First Name</div>
              </label>
              <input 
                id="fname"
                v-model="form.firstName"
                aria-required="true" 
                autocomplete="given-name" 
                name="fname" 
                type="text"
              >
              <span class="form-input-effects" aria-hidden="true">
                <span class="form-input-effects-border"></span>
              </span>
            </div>
  
            <div class="field last-name border border-black">
              <label class="caption" for="lname">
                <div class="caption-text">Last Name</div>
              </label>
              <input 
                id="lname"
                v-model="form.lastName"
                aria-required="true" 
                autocomplete="family-name" 
                name="lname" 
                type="text"
              >
              <span class="form-input-effects" aria-hidden="true">
                <span class="form-input-effects-border"></span>
              </span>
            </div>
          </div>
        </fieldset>

        <div class="form-item field email required">
          <label for="email-field" class="title caption">
            <div class="caption-text">
              <span>Email</span>
              <span class="description required">(required)</span>
            </div>
          </label>
          <input 
            id="email-field"
            v-model="form.email"
            aria-required="true" 
            autocomplete="email" 
            type="email"
          >
          <span class="form-input-effects" aria-hidden="true">
            <span class="form-input-effects-border"></span>
          </span>
        </div>
        
        <div class="form-item field textarea required" id="textarea">
          <label for="textarea-field" class="title">
            <div class="caption-text">
              <span>Message</span>
              <span class="description required">(required)</span>
            </div>
          </label>
          <textarea 
            id="textarea-field"
            v-model="form.message"
            aria-required="true"
          ></textarea>
          <span class="form-input-effects" aria-hidden="true">
            <span class="form-input-effects-border"></span>
          </span>
        </div>
      </div>

      <div class="form-button-wrapper">
        <button type="submit">
          <span class="form-submit-button-label">Send</span>
          <span class="form-submit-button-state" aria-label="Send">
            <span aria-hidden="true">Send</span>
          </span>
        </button>
      </div>
    </form>
  </div>
</template>
