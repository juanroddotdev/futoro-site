
<script setup lang="ts">
import { onMounted, reactive, computed } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { steps as defaultSteps, alternativeSteps, type ProcessSteps } from "@/data/howItWorksSteps";

gsap.registerPlugin(ScrollTrigger);

// Props to allow switching between versions
interface Props {
  useAlternative?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  useAlternative: false
});

const steps = computed<ProcessSteps>(() => 
  props.useAlternative ? alternativeSteps : defaultSteps
);

onMounted(() => {
  // Set initial state for all cards
  gsap.set(".process-card", {
    y: 50,
    opacity: 0
  });

  // Create the animation
  gsap.to(".process-card", {
    scrollTrigger: {
      trigger: ".process-grid",
      start: "top 80%",
      toggleActions: "play none none reverse"
    },
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: {
      amount: 0.6,
      ease: "power2.out"
    }
  });
});
</script>

<template>
  <section id="howItWorks" class="section min-h-screen py-32 theme-bg--secondary">
    <div class="text-center mb-24">
      <h2 class="heading">How It Works</h2>
      <p class="body-text text-lg max-w-2xl mx-auto mt-4">
        A streamlined process designed to deliver exceptional results for your web project
      </p>
    </div>

    <div 
      class="process-grid grid md:grid-cols-2 gap-12"
      :class="{
        'lg:grid-cols-3': !useAlternative,
        'lg:grid-cols-2': useAlternative
      }"
    >
      <div
        v-for="step in steps"
        :key="step.id"
        class="process-card group relative p-8 bg-neutral-gray/50 rounded-xl border border-white/10 hover:border-secondary/50 transition-all duration-300"
      >
        <div class="flex flex-col items-start text-left">
          <div class="flex items-center gap-4 mb-6">
            <span class="text-4xl">{{ step.icon }}</span>
            <div class="absolute -top-3 -left-3 w-8 h-8 bg-secondary/80 rounded-full flex items-center justify-center text-white font-bold">
              {{ step.id }}
            </div>
          </div>
          <h3 class="text-xl font-semibold mb-4">{{ step.step }}</h3>
          <ul class="space-y-2 text-gray-300 list-disc pl-4">
            <li v-for="(bullet, index) in step.description" 
                :key="index"
                class="text-sm">
              {{ bullet }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="text-center mt-24">
      <a href="#contact" class="theme-btn theme-btn--primary">
        Start Your Project
      </a>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
.heading-2xl {
  @apply text-4xl md:text-5xl font-bold;
}

.btn-neutral {
  @apply px-6 py-3 rounded-lg font-semibold transition-all duration-300;
}

.btn-neutral--primary {
  @apply bg-secondary text-white hover:bg-secondary/80;
}
</style>