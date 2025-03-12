<script setup lang="ts">
import { ref, onMounted } from 'vue';
import gsap from 'gsap';
import ContactForm from '@/components/layout/ContactForm.vue';

const form = ref({
  name: '',
  email: '',
  message: ''
});

const handleSubmit = (e: Event) => {
  e.preventDefault();
  // Handle form submission
  console.log('Form submitted:', form.value);
};

onMounted(() => {
  gsap.from('.contact-content', {
    scrollTrigger: {
      trigger: '.contact-content',
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out'
  });
});
</script>

<template>
  <section id="contact" class="section theme-bg--primary">
    <div class="text-center mb-16">
      <h2 class="heading heading--accent">Get In Touch</h2>
      <p class="body-text heading--highlight text-lg max-w-2xl mx-auto mt-4">
        Ready to start your project? We're here to help bring your vision to life.
      </p>
    </div>
    <form class="max-w-2xl mx-auto">
      <div class="grid grid-cols-5 gap-4 contact-content">
        <div class="col-span-2">
          <h2 class="heading heading--accent heading-2xl">Let's Work Together</h2>
          <p>
            From custom website development to SEO optimization and ongoing maintenance, I offer a comprehensive range of services to meet your digital needs.
          </p>
          <p>Transform your online presence. Reach out to learn how.</p>
        </div>
        <div class="col-span-3 border">
          <!-- <ContactForm /> -->
          <h2>juan@juanrod.dev</h2>
        </div>
      </div>
      <button type="submit" class="theme-btn theme-btn--secondary w-full">
        Send Message
      </button>
    </form>
  </section>
</template>