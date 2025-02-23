<script setup lang="ts">
import { onMounted } from 'vue';
import gsap from 'gsap';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CEO, TechVision',
    content: 'Futoro transformed our digital presence completely. Their innovative approach and attention to detail exceeded our expectations.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  },
  {
    name: 'Michael Rodriguez',
    role: 'Founder, EcoFlow',
    content: 'Working with Futoro was a game-changer for our brand. Their design solutions perfectly captured our vision while driving real results.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
  },
  {
    name: 'Emma Thompson',
    role: 'Marketing Director, Quantum Labs',
    content: 'The team at Futoro consistently delivers exceptional work. Their understanding of digital design trends and user experience is unmatched.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80'
  }
];

onMounted(() => {
  gsap.from('.testimonial-card', {
    scrollTrigger: {
      trigger: '.testimonials-grid',
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power2.out'
  });
});
</script>

<template>
  <section class="section py-32 bg-space/50">
    <div class="text-center mb-16">
      <h2 class="heading">What Our Clients Say</h2>
      <p class="subheading max-w-2xl mx-auto">
        Don't just take our word for it. Here's what our clients have to say about working with Futoro.
      </p>
    </div>
    
    <div class="testimonials-grid grid md:grid-cols-3 gap-8">
      <div v-for="testimonial in testimonials" :key="testimonial.name" 
           class="testimonial-card bg-space p-6 rounded-xl border border-white/10 hover:border-secondary/50 transition-all duration-300">
        <div class="flex items-center mb-6">
          <img 
            :src="testimonial.image" 
            :alt="testimonial.name"
            class="w-12 h-12 rounded-full object-cover mr-4"
          />
          <div>
            <h3 class="font-semibold">{{ testimonial.name }}</h3>
            <p class="text-gray-400 text-sm">{{ testimonial.role }}</p>
          </div>
        </div>
        <p class="text-gray-300">{{ testimonial.content }}</p>
        <div class="mt-4 text-secondary">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>