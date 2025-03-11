
<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const struggles = reactive([
    {
      id: 1,
      title: "Poor User Experience (UX)",
      description: "Many websites have confusing navigation, slow loading times, and designs that don't translate well to mobile devices. This leads to frustrated visitors who quickly leave the site."
    },
    {
      id: 2,
      title: "Lack of Clear Calls to Action (CTAs)",
      description: "Websites often fail to guide visitors towards desired actions. This results in missed opportunities for lead generation, sales, or engagement."
    },
    {
      id: 3,
      title: "Search Engine Optimization (SEO) Issues",
      description: "Without proper SEO, websites struggle to rank in search results. This means potential customers can't find the business online."
    },
    {
      id: 4,
      title: "Outdated Design and Technology",
      description: "Websites with outdated designs and technology can make a business look unprofessional and out of touch."
    },
    {
      id: 5,
      title: "Lack of Maintenance and Security",
      description: "Websites that aren't regularly updated can become vulnerable to security threats and may not function properly."
    },
    {
      id: 6,
      title: "Not Mobile-Friendly",
      description: "With the majority of web traffic coming from mobile devices. If your website isn't optimized for mobile, you're losing out on potential customers."
    }
]);

const solutions = reactive([
    {
      id: 1,
      title: "User-Centered Design",
      description: "I create intuitive, responsive, and visually appealing websites that provide a seamless user experience across all devices."
    },
    {
      id: 2,
      title: "Strategic CTAs",
      description: "I implement clear and compelling CTAs that guide visitors towards desired actions, increasing conversions and engagement."
    },
    {
      id: 3,
      title: "SEO Optimization",
      description: "I optimize websites for search engines, improving visibility and driving organic traffic."
    },
    {
      id: 4,
      title: "Modern Design and Technology",
      description: "I use the latest design trends and technologies to create websites that are both visually stunning and functionally robust."
    },
    {
      id: 5,
      title: "Ongoing Maintenance and Support",
      description: "I provide regular website maintenance, updates, and security monitoring to ensure optimal performance."
    },
    {
      id: 6,
      title: "Mobile-First Approach",
      description: "I prioritize mobile-friendliness in all my designs, ensuring a seamless experience for all users."
    }
]);

onMounted(() => {
  gsap.from('.struggles-content', {
    scrollTrigger: {
      trigger: '.struggles-content',
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power2.out'
  });

  gsap.from('.solutions-content', {
    scrollTrigger: {
      trigger: '.solutions-content',
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
  <section class="section py-32">
    <div class="grid grid-cols-2 gap-16">
      <!-- Struggles Section -->
      <div class="struggles-content">
        <h2 class="heading text-neutral-medium heading-2xl mb-8">Common Struggles</h2>
        <div class="space-y-6">
          <div v-for="struggle in struggles" 
               :key="struggle.id"
               class="p-6 bg-neutral-gray/50 rounded-xl border border-white/10">
            <h3 class="text-xl font-semibold mb-2">{{ struggle.title }}</h3>
            <p class="text-gray-300">{{ struggle.description }}</p>
          </div>
        </div>
      </div>

      <!-- Solutions Section -->
      <div class="solutions-content">
        <h2 class="heading text-neutral-medium heading-2xl mb-8">Our Solutions</h2>
        <div class="space-y-6">
          <div v-for="solution in solutions" 
               :key="solution.id"
               class="p-6 bg-neutral-gray/50 rounded-xl border border-white/10 hover:border-secondary/50 transition-all duration-300">
            <h3 class="text-xl font-semibold mb-2">{{ solution.title }}</h3>
            <p class="text-gray-300">{{ solution.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
.heading-2xl {
  @apply text-4xl md:text-5xl font-bold;
}
</style>