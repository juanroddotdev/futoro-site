<template>
  <div class="progressive-reveal">
    <div class="py-20 debug">
      <h1 class="heading-responsive gradient-text text-center mb-40">From Frustration to Fantastic: Website Solutions</h1>
    </div>
    <!-- Hurdles Section -->
    <section class="reveal-section hurdles-section" id="hurdlesSection">
      <div class="sticky-container">
        <div class="cards-container" id="hurdlesContainer">
          <!-- Title card -->
          <div class="card title-card">
            <h2 class="section-title theme-text--gradient">Common Hurdles</h2>
          </div>
          <div class="card" v-for="struggle in struggles" :key="`hurdle-${struggle.id}`">
            <h3 class="text-md font-semibold gradient-text mb-3">{{ struggle.title }}</h3>
            <p class="theme-text--neutral">{{ struggle.description }}</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Solutions Section -->
    <section class="reveal-section solutions-section" id="solutionsSection">
      <div class="sticky-container">
        <div class="cards-container" id="solutionsContainer">
          <div class="card" v-for="solution in solutions" :key="`solution-${solution.id}`">
            <h3 class="text-md font-semibold gradient-text mb-3">{{ solution.title }}</h3>
            <p class="theme-text--neutral">{{ solution.description }}</p>
          </div>
          <!-- Title card moved to the beginning -->
          <div class="card title-card">
            <h2 class="section-title theme-text--gradient">Clear Solutions</h2>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { struggles, solutions } from '@/data/strugglesAndSolutions';

onMounted(() => {
  // Elements
  const hurdlesSection = document.getElementById('hurdlesSection');
  const solutionsSection = document.getElementById('solutionsSection');
  const hurdlesContainer = document.getElementById('hurdlesContainer');
  const solutionsContainer = document.getElementById('solutionsContainer');
  
  // Calculate total scrollable width for each container
  const getScrollableWidth = (container) => {
    return container.scrollWidth - window.innerWidth + 100; // Adding padding
  };
  
  const hurdlesScrollWidth = getScrollableWidth(hurdlesContainer);
  const solutionsScrollWidth = getScrollableWidth(solutionsContainer);
  
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
  
  hurdlesObserver.observe(hurdlesSection);
  solutionsObserver.observe(solutionsSection);
  
  // Scroll handler
  const handleScroll = () => {
    // Handle Hurdles section
    if (document.body.classList.contains('hurdles-active')) {
      const hurdlesRect = hurdlesSection.getBoundingClientRect();
      const hurdlesProgress = Math.min(1, Math.max(0, 
        -hurdlesRect.top / (hurdlesSection.offsetHeight - window.innerHeight)
      ));
      
      // Apply transform to hurdles container (right to left)
      const hurdlesTransform = hurdlesProgress * hurdlesScrollWidth;
      hurdlesContainer.style.transform = `translateX(-${hurdlesTransform}px)`;
    }
    
    // Handle Solutions section
    if (document.body.classList.contains('solutions-active')) {
      const solutionsRect = solutionsSection.getBoundingClientRect();
      const solutionsProgress = Math.min(1, Math.max(0, 
        -solutionsRect.top / (solutionsSection.offsetHeight - window.innerHeight)
      ));
      
      // Apply transform to solutions container (right to left)
      // Reverse the direction for solutions to make title card lead
      const solutionsTransform = (1 - solutionsProgress) * solutionsScrollWidth;
      solutionsContainer.style.transform = `translateX(-${solutionsTransform}px)`;
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
      transition: transform 0.1s ease-out;
      padding: 0 2rem;
      align-items: center;
      height: 100%;
      
      .card {
        flex: 0 0 auto;
        width: 300px;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        
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
      // Start with all cards visible on the right
      transform: translateX(0);
    }
    
    .card:not(.title-card) {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
  }
  
  .solutions-section {
    .cards-container {
      // Start with all cards off-screen to the right
      transform: translateX(calc(100% - 350px)); // Show just the title card initially
    }
    
    .card:not(.title-card) {
      background: linear-gradient(135deg, #e0f7fa 0%, #80deea 100%);
    }
  }
}
</style>
