<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { contactSectionAnimations } from '@/animations/contactSection';
import AvailabilityBadge from '@/components/ui/AvailabilityBadge.vue';
import { emailIcon } from '@/utils/icons';

const contactInfo = {
  email: 'juan@juanrod.dev',
  availability: 'Available for projects',
  response: 'Quick response: 24-48h'
};

onMounted(() => {
  contactSectionAnimations.initializeAnimations();
});
</script>

<template>
  <section id="contact" class="contact-section">
    <div class="container">
      <div class="max-w-2xl mx-auto">
        <div class="contact-card">
          <div class="contact-content">
            <h2 class="heading heading--accent">Let's Connect</h2>
            <p class="body-text heading--highlight">
              Ready to bring your vision to life? Let's create something amazing together.
            </p>

            <div class="contact-info">
              <AvailabilityBadge :text="contactInfo.availability" />
              <p class="contact-info__response">{{ contactInfo.response }}</p>
              <a :href="`mailto:${contactInfo.email}`" class="contact-info__email">
                <span v-html="emailIcon" class="email-icon"></span>
                <span>{{ contactInfo.email }}</span>
              </a>
            </div>

            <a href="mailto:juan@juanrod.dev" class="cta-button">
              Start Your Project
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
@import '@/scss/components/contact-section';

.email-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }

  .email-icon {
    display: inline-flex;
    width: 1.5rem;
    height: 1.5rem;
  }
}
</style>