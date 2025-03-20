<template>
  <div class="progressive-reveal overflow-visible"> <!-- Ensure overflow is visible -->
    <!-- Add DelayTest component at the top -->

    <div class="py-20">
      <AnimatedText class="text-3xl font-bold text-center gradient-text" firstPart="From Frustration"
        secondPart="To Fantastic" animation="split" :useGradient="true" :delay="8" :duration="3"
        :initiallyHidden="true" />
      <AnimatedText class="text-3xl font-bold text-center gradient-text" firstPart="Website Solutions"
        animation="fadeUp" :useGradient="true" :duration="3" :initiallyHidden="true" />
    </div>
    <!-- Hurdles Section -->
    <section class="reveal-section hurdles-section" id="hurdlesSection">
      <div class="sticky-container">
        <div class="header-container header-container--hurdles">
          <h2 class="section-title gradient-text">Common Hurdles</h2>
        </div>
        <div class="cards-container" id="hurdlesContainer">
          <div class="card title-card">
            <!-- placeholder card -->
          </div>
          <div class="card struggle-card group hover-card-themed p-6 relative overflow-hidden"
            v-for="struggle in struggles" :key="`hurdle-${struggle.id}`">
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
        <div class="header-container header-container--hurdles">
          <h2 class="section-title gradient-text">Clear Solutions</h2>
        </div>
        <div class="cards-container" id="solutionsContainer">
          <div class="card solution-card group hover-card-themed p-6 relative overflow-hidden"
            v-for="solution in solutions" :key="`solution-${solution.id}`">
            <div class="relative z-10">
              <h3 class="text-md font-semibold gradient-text mb-3">{{ solution.title }}</h3>
              <p class="theme-text--neutral">{{ solution.description }}</p>
            </div>
          </div>
          <!-- Title card moved to the beginning -->
          <div class="card title-card">
            <!-- placeholder card -->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { struggles, solutions } from '@/data/strugglesAndSolutions';
import AnimatedText from '@/components/export-to-main/animatedText/AnimatedText.vue';

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

      // Apply transform to hurdles container (right to left)
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
// 
</style>
