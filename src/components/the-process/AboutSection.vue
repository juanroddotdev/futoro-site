<script setup lang="ts">
import { onMounted, ref } from 'vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { highlights, expertise, journey } from '@/data/aboutSectionData';

// Register ScrollTrigger plugin BEFORE any GSAP usage
gsap.registerPlugin(ScrollTrigger);

const animatedNumbers = ref<string[]>(highlights.map(highlight => 
  highlight.number.includes('+') ? '0+' : 
  highlight.number.includes('%') ? '0%' : 
  highlight.number.includes('/') ? '0/7' : '0'
));

onMounted(() => {
  try {
    // Animate numbers
    highlights.forEach((highlight, index) => {
      const endNumber = parseInt(highlight.number.replace(/[^0-9]/g, '')) || 0;
      gsap.to({
        value: 0  // Start value
      }, {
        value: endNumber,  // End value
        duration: 2,
        scrollTrigger: {
          trigger: '.highlights',
          start: 'top 80%',
        },
        onUpdate: function(this: any) {
          const value = Math.round(this.targets()[0].value).toString();
          if (highlight.number.includes('+')) {
            animatedNumbers.value[index] = value + '+';
          } else if (highlight.number.includes('%')) {
            animatedNumbers.value[index] = value + '%';
          } else if (highlight.number.includes('/')) {
            animatedNumbers.value[index] = value + '/7';
          } else {
            animatedNumbers.value[index] = value;
          }
        }
      });
    });
  } catch (error) {
    console.error('Error in animation setup:', error);
  }
});
</script>

<template>
  <section class="about-section relative py-32 bg-gradient-to-b from-white to-slate-50">
    <!-- Decorative elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-0 left-1/4 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute top-0 right-1/4 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-0 left-1/3 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 relative z-10">
      <!-- Header -->
      <div class="text-center mb-20">
        <h2 class="font-space-grotesk text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          About Futoro
        </h2>
        <p class="font-raleway text-lg text-slate-600 max-w-3xl mx-auto">
          Transforming Ideas into Engaging Digital Experiences
        </p>
      </div>

      <!-- Highlights Section -->
      <div class="highlights grid grid-cols-1 md:grid-cols-4 gap-8 mb-24">
        <div v-for="(highlight, index) in highlights" 
             :key="highlight.label"
             class="highlight-card bg-white rounded-2xl p-12 shadow-lg transform hover:-translate-y-1 transition-all duration-300"
        >
          <h3 class="text-6xl font-space-grotesk font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            {{ animatedNumbers[index] }}
          </h3>
          <p class="font-raleway text-xl text-slate-600">{{ highlight.label }}</p>
        </div>
      </div>

      <!-- Journey Section -->
      <div class="journey-section grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        <div v-for="item in journey" 
             :key="item.title"
             class="journey-section__card bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <h3 class="font-space-grotesk text-lg font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {{ item.title }}
          </h3>
          <p class="font-raleway text-slate-600 font-bold leading-relaxed">{{ item.content }}</p>
        </div>
      </div>

      <!-- Expertise Section -->
      <div class="expertise-grid grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="item in expertise" 
             :key="item.title"
             class="expertise-grid__card bg-white rounded-2xl p-8 shadow-lg transform hover:-translate-y-2 transition-all duration-300"
        >
          <div class="text-4xl mb-6">{{ item.icon }}</div>
          <h3 class="font-space-grotesk text-xl font-bold text-slate-800 mb-4">{{ item.title }}</h3>
          <p class="font-raleway text-slate-600 leading-relaxed">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.about-section {
  position: relative;
  overflow: hidden;
  .expertise-grid__card{
    max-height: 300px;
  }
}

.highlight-card {
  border: 1px solid rgba(99, 102, 241, 0.1);
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.9);
}

.journey-section__card, .expertise-grid__card {
  border: 1px solid rgba(99, 102, 241, 0.1);
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.9);
}

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>