<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { struggles, solutions } from '@/data/strugglesAndSolutions';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const activeTab = ref('struggles');

onMounted(() => {
  // Animate text reveals
  const textElements = document.querySelectorAll('.content-text');
  
  textElements.forEach(element => {
    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      duration: 0.4,
      ease: 'power1.out'
    });
  });
});
</script>

<template>
  <section class="wireframe-section py-32">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Wireframe Heading with Content -->
      <div class="wireframe-heading mb-40 relative">
        <div class="heading-line"></div>
        <div class="heading-line heading-line--short"></div>
        <h2 class="content-text heading-text absolute top-0 left-1/2 -translate-x-1/2">
          Common Challenges & Solutions
        </h2>
        <p class="content-text subheading-text absolute top-12 left-1/2 -translate-x-1/2">
          Let's address your development concerns
        </p>
      </div>

      <!-- Wireframe Tab Headers with Content -->
      <div class="flex justify-center mb-12">
        <div class="wireframe-tabs">
          <button 
            @click="activeTab = 'struggles'"
            class="wireframe-tab relative"
            :class="{ 'active': activeTab === 'struggles' }"
          >
            <div class="tab-icon"></div>
            <div class="tab-text"></div>
            <span class="content-text tab-label">Challenges</span>
          </button>
          <button 
            @click="activeTab = 'solutions'"
            class="wireframe-tab relative"
            :class="{ 'active': activeTab === 'solutions' }"
          >
            <div class="tab-icon"></div>
            <div class="tab-text"></div>
            <span class="content-text tab-label">Solutions</span>
          </button>
        </div>
      </div>

      <!-- Wireframe Cards Grid with Content -->
      <div class="relative" style="min-height: 900px;">
        <!-- Struggles Cards -->
        <div 
          v-if="activeTab === 'struggles'"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div 
            v-for="struggle in struggles" 
            :key="struggle.id"
            class="wireframe-card relative"
          >
            <div class="card-content">
              <div class="card-title"></div>
              <div class="card-text-line"></div>
              <div class="card-text-line"></div>
              <div class="card-text-line card-text-line--short"></div>
            </div>
            <div class="card-icon"></div>
            <!-- Actual content overlaid -->
            <div class="content-text card-real-content">
              <h3 class="font-bold mb-3">{{ struggle.title }}</h3>
              <p class="text-sm">{{ struggle.description }}</p>
            </div>
          </div>
        </div>

        <!-- Solutions Cards -->
        <div 
          v-if="activeTab === 'solutions'"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div 
            v-for="solution in solutions" 
            :key="solution.id"
            class="wireframe-card relative"
          >
            <div class="card-content">
              <div class="card-title"></div>
              <div class="card-text-line"></div>
              <div class="card-text-line"></div>
              <div class="card-text-line card-text-line--short"></div>
            </div>
            <div class="card-icon"></div>
            <!-- Actual content overlaid -->
            <div class="content-text card-real-content">
              <h3 class="font-bold mb-3">{{ solution.title }}</h3>
              <p class="text-sm">{{ solution.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.wireframe-section {
  background-color: #ffffff;
  font-family: 'Architects Daughter', cursive;
}

// Content text styles
.content-text {
  font-family: 'Architects Daughter', cursive;
  color: #333;
  z-index: 2;

  p {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    font-size: 0.875rem;
    line-height: 1.5;
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
}

// Heading styles
.wireframe-heading {
  .heading-line {
    height: 24px;
    background: #e0e0e0;
    margin: 0 auto;
    width: 70%;
    border-radius: 4px;

    &--short {
      width: 50%;
      margin-top: 8px;
    }
  }
}

// Tabs styles
.wireframe-tabs {
  display: flex;
  gap: 16px;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 50px;
  border: 2px dashed #cecece;
}

.wireframe-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 24px;
  border-radius: 50px;

  &.active {
    background: #e0e0e0;
  }

  .tab-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #cecece;
  }

  .tab-text {
    width: 80px;
    height: 16px;
    background: #cecece;
    border-radius: 4px;
  }

  .tab-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    white-space: nowrap;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 500;
    font-size: 0.875rem;
    letter-spacing: 0.025em;
    color: #333;
  }
}

// Card styles
.wireframe-card {
  border: 2px dashed #cecece;
  padding: 24px;
  border-radius: 12px;
  position: relative;
  background: #f5f5f5;
  min-height: 200px;

  .card-content {
    position: relative;
    z-index: 1;
    opacity: 0.5;
  }

  .card-title {
    height: 20px;
    background: #cecece;
    width: 60%;
    margin-bottom: 16px;
    border-radius: 4px;
  }

  .card-text-line {
    height: 12px;
    background: #e0e0e0;
    margin-bottom: 8px;
    border-radius: 4px;

    &--short {
      width: 70%;
    }
  }

  .card-icon {
    position: absolute;
    bottom: 24px;
    right: 24px;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #e0e0e0;
    opacity: 0.3;
  }

  .card-real-content {
    position: absolute;
    top: 24px;
    left: 24px;
    right: 24px;
    z-index: 2;
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .wireframe-heading .heading-line {
    width: 90%;
    
    &--short {
      width: 70%;
    }
  }

  .heading-text {
    font-size: 2rem;
  }

  .subheading-text {
    font-size: 1rem;
  }
}
</style>
