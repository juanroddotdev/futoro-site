<script setup lang="ts">
import { onMounted } from 'vue';
import { services } from '@/data/services';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
  // Animate services cards
  gsap.utils.toArray('.service-card').forEach((card: any, i) => {
    gsap.from(card, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      delay: i * 0.2,
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
      }
    });
  });
});
</script>

<template>
  <section class="services-section py-32 relative overflow-hidden">
    <!-- Decorative Background Elements -->
    <div class="absolute inset-0 z-0">
      <div class="sketch-bg-dot" v-for="i in 50" :key="i"
           :style="{
             left: `${Math.random() * 100}%`,
             top: `${Math.random() * 100}%`,
             animationDelay: `${Math.random() * 2}s`
           }">
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 relative z-10">
      <!-- Section Header -->
      <div class="wireframe-heading mb-24 relative">
        <div class="heading-line"></div>
        <div class="heading-line heading-line--short"></div>
        <h2 class="content-text heading-text absolute top-0 left-1/2 -translate-x-1/2">
          Services
        </h2>
        <p class="content-text subheading-text absolute top-12 left-1/2 -translate-x-1/2">
          Comprehensive web development solutions tailored to your needs
        </p>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="service in services" 
             :key="service.id"
             class="service-card group">
          <div class="wireframe-card relative p-8">
            <!-- Sketchy Card Elements -->
            <div class="card-doodle"></div>
            
            <!-- Icon Placeholder -->
            <div class="service-icon mb-6">
              <div class="icon-placeholder"></div>
              <span class="icon-actual">{{ service.icon }}</span>
            </div>

            <!-- Content -->
            <div class="card-content">
              <div class="card-title"></div>
              <div v-for="i in 3" :key="i" class="card-text-line"
                   :class="{ 'card-text-line--short': i === 3 }">
              </div>
            </div>

            <!-- Actual Content -->
            <div class="content-text card-real-content">
              <h3 class="font-bold mb-4">{{ service.title }}</h3>
              <p class="text-sm">{{ service.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.services-section {
  background-color: #fafafa;
}

.content-text {
  font-family: 'Architects Daughter', cursive;
  color: #2d3748;

  p {
    font-family: 'Raleway', sans-serif;
    color: #718096;
    line-height: 1.5;
    font-size: 1rem; // 16px instead of text-sm
    font-weight: 600; // Changed to semi-bold
  }
}

.heading-text {
  font-size: 2.5rem;
  width: 100%;
  text-align: center;
}

.subheading-text {
  font-size: 1.2rem;
  width: 100%;
  text-align: center;
  color: #4a5568;
}

.wireframe-heading {
  .heading-line {
    height: 24px;
    background: rgba(#6B46C1, 0.1); // Subtle purple
    margin: 0 auto;
    width: 70%;
    border-radius: 4px;

    &--short {
      width: 50%;
      margin-top: 8px;
    }
  }
}

.service-card {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);

    .wireframe-card {
      border-color: #6B46C1;
      background: rgba(#6B46C1, 0.03);
    }
  }
}

.wireframe-card {
  border: 2px dashed #CBD5E0;
  border-radius: 12px;
  background: white;
  transition: all 0.3s ease;
  overflow: hidden;

  .card-doodle {
    position: absolute;
    top: -20px;
    right: -20px;
    width: 60px;
    height: 60px;
    border: 2px dashed rgba(#6B46C1, 0.3);
    border-radius: 50%;
    transform: rotate(-15deg);
  }
}

.service-icon {
  position: relative;
  width: 48px;
  height: 48px;

  .icon-placeholder {
    position: absolute;
    inset: 0;
    background: rgba(#6B46C1, 0.1);
    border-radius: 12px;
    transform: rotate(5deg);
  }

  .icon-actual {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: #6B46C1;
  }
}

.card-content {
  position: relative;
  z-index: 1;
  opacity: 0.5;
}

.card-title {
  height: 20px;
  background: rgba(#6B46C1, 0.1);
  width: 60%;
  margin-bottom: 16px;
  border-radius: 4px;
}

.card-text-line {
  height: 12px;
  background: rgba(#6B46C1, 0.05);
  margin-bottom: 8px;
  border-radius: 4px;

  &--short {
    width: 70%;
  }
}

.card-real-content {
  position: absolute;
  top: 24px;
  left: 24px;
  right: 24px;
  z-index: 2;

  h3 {
    font-family: Arial, sans-serif;
  }

  p {
    font-family: 'Raleway', sans-serif;
    color: #718096;
    font-size: 1rem; // 16px
    font-weight: 600; // Semi-bold
    line-height: 1.5;
  }
}

.sketch-bg-dot {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(#6B46C1, 0.1);
  border-radius: 50%;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 768px) {
  .services-section {
    padding: 4rem 0;
  }

  .heading-text {
    font-size: 2rem;
  }

  .subheading-text {
    font-size: 1rem;
  }
}
</style>