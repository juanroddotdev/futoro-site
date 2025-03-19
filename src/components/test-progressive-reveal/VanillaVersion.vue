<template>
  <div class="progressive-reveal overflow-visible"> <!-- Ensure overflow is visible -->
    <div class="py-20">
      <!-- <h2 class="text-3xl font-bold text-center my-16 gradient-text">From Frustration to Fantastic</h2> -->
      <AnimatedText 
        class="text-3xl font-bold text-center my-16 gradient-text"
        firstPart="From Frustration" 
        secondPart="To Fantastic" 
        suffix="Website Solutions" 
        animation="split"
        :useGradient="true"
        :duration="3"
        :initiallyHidden="true"
      />
    </div>
    <!-- Hurdles Section -->
    <section class="reveal-section hurdles-section" id="hurdlesSection">
      <div class="sticky-container">
        <div class="cards-container" id="hurdlesContainer">
          <!-- Title card -->
          <div class="card title-card">
            <h2 class="section-title gradient-text">Common Hurdles</h2>
          </div>
          <div 
            class="card struggle-card group hover-card p-6 relative overflow-hidden"
            v-for="struggle in struggles" 
            :key="`hurdle-${struggle.id}`"
          >
            <div class="relative z-10">
              <h3 class="text-md font-semibold gradient-text mb-3">{{ struggle.title }}</h3>
              <p class="theme-text--neutral">{{ struggle.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Solutions Section -->
    <section class="reveal-section solutions-section" id="solutionsSection">
      <div class="sticky-container">
        <div class="cards-container" id="solutionsContainer">
          <div 
            class="card solution-card group hover-card p-6 relative overflow-hidden"
            v-for="solution in solutions" 
            :key="`solution-${solution.id}`"
          >
            <div class="relative z-10">
              <h3 class="text-md font-semibold gradient-text mb-3">{{ solution.title }}</h3>
              <p class="theme-text--neutral">{{ solution.description }}</p>
            </div>
          </div>
          <!-- Title card moved to the beginning -->
          <div class="card title-card">
            <h2 class="section-title gradient-text">Clear Solutions</h2>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { struggles, solutions } from '@/data/strugglesAndSolutions';
import AnimatedText from '../export-to-main/animatedText/AnimatedText.vue';


onMounted(() => {
  // Elements
  const hurdlesSection = document.getElementById('hurdlesSection');
  const solutionsSection = document.getElementById('solutionsSection');
  const hurdlesContainer = document.getElementById('hurdlesContainer');
  const solutionsContainer = document.getElementById('solutionsContainer');
  
  // Calculate total scrollable width for each container
  const getScrollableWidth = (container: HTMLElement) => {
    return container.scrollWidth - window.innerWidth + 100; // Adding padding
  };
  
  const hurdlesScrollWidth = hurdlesContainer ? getScrollableWidth(hurdlesContainer) : 0;
  const solutionsScrollWidth = solutionsContainer ? getScrollableWidth(solutionsContainer) : 0;
  
  // Intersection Observers
  const hurdlesObserver = new IntersectionObserver((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      document.body.classList.add('hurdles-active');
      document.body.classList.remove('solutions-active');
    } else {
      document.body.classList.remove('hurdles-active');
    }
  }, { threshold: 0.1 });
  
  const solutionsObserver = new IntersectionObserver((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      document.body.classList.add('solutions-active');
      document.body.classList.remove('hurdles-active');
    } else {
      document.body.classList.remove('solutions-active');
    }
  }, { threshold: 0.1 });
  
  if (hurdlesSection) {
    hurdlesObserver.observe(hurdlesSection);
  }
  if (solutionsSection) {
    solutionsObserver.observe(solutionsSection);
  }
  
  // Scroll handler
  const handleScroll = () => {
    // Handle Hurdles section
    if (document.body.classList.contains('hurdles-active')) {
      if (!hurdlesSection) return;
      const hurdlesRect = hurdlesSection.getBoundingClientRect();
      const hurdlesProgress = Math.min(1, Math.max(0, 
        -hurdlesRect.top / (hurdlesSection.offsetHeight - window.innerHeight)
      ));
      
      // // Apply transform to hurdles container (right to left)
      const hurdlesTransform = hurdlesProgress * hurdlesScrollWidth;
      if (hurdlesContainer) {
        hurdlesContainer.style.transform = `translateX(-${hurdlesTransform}px)`;
      }
    }
    
    // Handle Solutions section
    if (document.body.classList.contains('solutions-active')) {
      if (!solutionsSection) return;
      const solutionsRect = solutionsSection.getBoundingClientRect();
      const solutionsProgress = Math.min(1, Math.max(0, 
        -solutionsRect.top / (solutionsSection.offsetHeight - window.innerHeight)
      ));
      
      // Apply transform to solutions container (right to left)
      // Reverse the direction for solutions to make title card lead
      const solutionsTransform = (1 - solutionsProgress) * solutionsScrollWidth;
      if (solutionsContainer) {
        solutionsContainer.style.transform = `translateX(-${solutionsTransform}px)`;
      }
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  
  // Cleanup
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    hurdlesObserver.disconnect();
    solutionsObserver.disconnect();
  });
});
</script>

<style lang="scss" scoped>
@import '@/scss/abstracts/variables';
@import '@/scss/components/buttons-round';

.progressive-reveal {
  position: relative;
  
  .reveal-section {
    position: relative;
    height: 300vh; // Tall enough for scrolling
    
    .sticky-container {
      position: sticky;
      top: 0;
      height: 100vh;
      width: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding: 2rem;
    }
    
    .section-title {
      font-size: 2.5rem;
      margin-bottom: 0;
      text-align: center;
    }
    
    .cards-container {
      display: flex;
      gap: 2rem;
      // transition: transform 0.1s ease-out;
      padding: 0 2rem;
      align-items: center;
      height: 100%;
      
      .card {
        flex: 0 0 auto;
        width: 300px;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        will-change: transform, opacity;
        backface-visibility: hidden;
        
        h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }
        
        p {
          font-size: 1rem;
          line-height: 1.5;
        }
        
        &.title-card {
          width: 350px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
          background: transparent;
          box-shadow: none;
          border: none;
          
          .section-title {
            margin: 0;
          }
        }
      }
    }
  }
  
  .hurdles-section {
    .cards-container {
      // // Start with all cards visible on the right
      transform: translateX(0);

      ////NEWWWWWW TESTTTT
      // Start with all cards off-screen to the right
      // transform: translateX(calc(100vw - 350px)); // Show just the title card initially
      transition: transform 0.1s ease-out;
      
      // // Add this to ensure the title card is visible at the start
      // .title-card {
      //   margin-right: 2rem; // Add some space between title and first card
      // }
    }
  }
  
  .solutions-section {
    .cards-container {
      // Start with all cards off-screen to the right
      transform: translateX(calc(100% - 350px)); // Show just the title card initially
      transition: transform 0.1s ease-out;
    }
  }
}

// Card icon styles from StrugglesOffersTabs.vue
.hover-card span svg {
  @apply w-32 h-32;
}

.icon-imprint svg {
  filter: opacity(0.4) drop-shadow(0 1px 1px rgba(255, 255, 255, 0.1)) drop-shadow(0 -1px 1px rgba(0, 0, 0, 0.2));
}

/* Theme-specific icon styles */
:deep(.theme-neon-horizon), :deep(.theme-digital-sunset), :deep(.theme-retro-wave) {
  .icon-imprint svg {
    filter: opacity(0.3)
      drop-shadow(0 1px 1px rgba(255, 255, 255, 0.15))
      drop-shadow(0 -1px 1px rgba(0, 0, 0, 0.3))
      drop-shadow(0 0 2px rgba(255, 255, 255, 0.1));
  }
}

:deep(.theme-pastel-future) {
  .icon-imprint svg {
    filter: opacity(0.15)
      drop-shadow(0 1px 1px rgba(255, 255, 255, 0.2))
      drop-shadow(0 -1px 1px rgba(0, 0, 0, 0.1));
  }
}

.struggle-card,
.solution-card {
  will-change: transform, opacity;
  backface-visibility: hidden;
}
</style>
