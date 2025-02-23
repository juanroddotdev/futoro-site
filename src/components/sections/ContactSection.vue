<script setup lang="ts">
import { ref, onMounted } from 'vue';
import gsap from 'gsap';

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
  <section id="contact" class="section py-32">
    <div class="contact-content max-w-4xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="heading">Let's Talk</h2>
        <p class="subheading">
          Ready to transform your digital presence? Get in touch with us today.
        </p>
      </div>
      
      <form @submit="handleSubmit" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Name</label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            class="w-full px-4 py-3 bg-space border border-white/10 rounded-lg focus:border-secondary/50 focus:outline-none text-white"
            required
          />
        </div>
        
        <div>
          <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            class="w-full px-4 py-3 bg-space border border-white/10 rounded-lg focus:border-secondary/50 focus:outline-none text-white"
            required
          />
        </div>
        
        <div>
          <label for="message" class="block text-sm font-medium text-gray-300 mb-2">Message</label>
          <textarea
            id="message"
            v-model="form.message"
            rows="4"
            class="w-full px-4 py-3 bg-space border border-white/10 rounded-lg focus:border-secondary/50 focus:outline-none text-white"
            required
          ></textarea>
        </div>
        
        <div class="text-center">
          <button type="submit" class="btn btn-primary">
            Send Message
          </button>
        </div>
      </form>
      
      <div class="mt-16 text-center">
        <p class="text-gray-300 mb-4">Or reach us directly at:</p>
        <a href="mailto:hello@futoro.design" class="text-secondary hover:text-accent transition-colors">
          hello@futoro.design
        </a>
      </div>
    </div>
  </section>
</template>