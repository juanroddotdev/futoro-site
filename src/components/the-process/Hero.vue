<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { heroSectionAnimations } from '@/animations/heroSection';
import { HeroContent, getRandomHeroContent } from '@/data/heroContent';

const heroContent = ref<HeroContent>(getRandomHeroContent());

onMounted(() => {
  heroSectionAnimations.contentFadeIn();
});
</script>

<template>
  <section class="min-h-screen flex items-center relative overflow-hidden wireframe-section">
    <!-- SVG Filter for Pencil Effect -->
    <svg width="0" height="0" class="absolute">
      <filter id="pencil-effect">
        <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
      </filter>
      <filter id="rough-paper">
        <feTurbulence type="turbulence" baseFrequency="0.15" numOctaves="2" result="turbulence"/>
        <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="2" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </svg>

    <div class="section relative z-10 my-40 hero-content wireframe-content">
      <h1 class="heading--wireframe mb-6 headline heading-responsive">{{ heroContent.headline }}</h1>
      <p class="mb-8 subheadline subheading-responsive heading--wireframe">
        {{ heroContent.subheadline }}
      </p>
      <div class="flex gap-4">
        <a 
          href="#contact" 
          class="btn-wireframe btn-wireframe--primary cta"
        >
          {{ heroContent.cta }}
        </a>
        <a 
          href="#services" 
          class="btn-wireframe btn-wireframe--secondary"
        >
          Our Services
        </a>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.wireframe-section {
  background: #fff;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      linear-gradient(90deg, rgba(230,230,230,.3) 1px, transparent 1px),
      linear-gradient(rgba(230,230,230,.3) 1px, transparent 1px);
    background-size: 20px 20px;
  }
}

.wireframe-content {
  filter: url(#rough-paper);
}

.heading--wireframe {
  color: #333;
  font-family: 'Architects Daughter', cursive;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    height: 2px;
    background: #333;
    filter: url(#pencil-effect);
  }
}

.btn-wireframe {
  position: relative;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-family: 'Architects Daughter', cursive;
  transition: all 0.3s ease;
  color: #333;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    border: 2px solid #333;
    filter: url(#pencil-effect);
  }

  &--primary {
    &::before {
      border-style: solid;
    }
  }

  &--secondary {
    &::before {
      border-style: dashed;
    }
  }

  &:hover {
    transform: scale(1.02);
    
    &::before {
      filter: url(#pencil-effect) blur(0.5px);
    }
  }
}

// Add some roughness to text
.headline, .subheadline {
  filter: url(#pencil-effect);
  letter-spacing: 0.5px;
}

// Responsive text sizes (keeping your original sizes)
.heading-responsive {
  font-size: clamp(2rem, 5vw, 4rem);
}

.subheading-responsive {
  font-size: clamp(1rem, 3vw, 1.5rem);
}

// Optional: Add hand-drawn arrows or indicators
.wireframe-section::after {
  content: '↓';
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Architects Daughter', cursive;
  font-size: 2rem;
  color: #333;
  filter: url(#pencil-effect);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>
