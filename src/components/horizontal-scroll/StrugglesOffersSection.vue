<script setup>
import { ref } from 'vue';
import HorizontalScrollContainer from './core/HorizontalScrollContainer.vue';
import ScrollRow from './ScrollRow.vue';
import ScrollItem from './ScrollItem.vue';

// Sample data (you can replace with your actual data)
const struggles = ref([
  {
    id: 1,
    title: 'Complex Requirements',
    description: 'Navigating intricate business needs and technical constraints.'
  },
  {
    id: 2,
    title: 'Technical Debt',
    description: 'Dealing with legacy code and architectural limitations.'
  },
  {
    id: 3,
    title: 'Tight Deadlines',
    description: 'Balancing quality and speed under pressure.'
  },
  {
    id: 4,
    title: 'Resource Constraints',
    description: 'Accomplishing more with limited team capacity.'
  },
  {
    id: 5,
    title: 'Changing Priorities',
    description: 'Adapting to shifting business goals and market demands.'
  }
]);

const solutions = ref([
  {
    id: 1,
    title: 'Strategic Planning',
    description: 'Comprehensive roadmaps aligned with business objectives.'
  },
  {
    id: 2,
    title: 'Agile Methodology',
    description: 'Flexible, iterative approach to development and delivery.'
  },
  {
    id: 3,
    title: 'Technical Excellence',
    description: 'Clean architecture and sustainable coding practices.'
  },
  {
    id: 4,
    title: 'Effective Communication',
    description: 'Clear, consistent dialogue between all stakeholders.'
  },
  {
    id: 5,
    title: 'Continuous Improvement',
    description: 'Regular refinement of processes and practices.'
  }
]);

// Helper function to get icon (simplified for this example)
const getIcon = (type, index) => {
  const icons = {
    struggle: ['🔍', '⚠️', '⏱️', '📊', '🔄'],
    solution: ['🎯', '🚀', '💻', '🗣️', '📈']
  };
  
  return icons[type][index % icons[type].length];
};
</script>

<template>
  <div class="struggles-offers-section">
    <HorizontalScrollContainer>
      <!-- Struggles Row -->
      <ScrollRow 
        title="Common Hurdles" 
        direction="normal"
      >
        <!-- Title Card -->
        <ScrollItem type="title">
          <h3 class="heading-responsive gradient-text">Common Hurdles</h3>
        </ScrollItem>
        
        <!-- Content Cards -->
        <ScrollItem 
          v-for="(struggle, index) in struggles" 
          :key="struggle.id"
          type="content"
        >
          <span class="icon-imprint" v-html="getIcon('struggle', index)"></span>
          <h3 class="card-title">{{ struggle.title }}</h3>
          <p class="card-description">{{ struggle.description }}</p>
        </ScrollItem>
      </ScrollRow>
      
      <!-- Solutions Row -->
      <ScrollRow 
        title="Clear Solutions" 
        direction="reverse"
        :slideInReverse="true"
      >
        <!-- Title Card -->
        <ScrollItem type="title">
          <h3 class="heading-responsive gradient-text">Clear Solutions</h3>
        </ScrollItem>
        
        <!-- Content Cards -->
        <ScrollItem 
          v-for="(solution, index) in solutions" 
          :key="solution.id"
          type="content"
        >
          <span class="icon-imprint" v-html="getIcon('solution', index)"></span>
          <h3 class="card-title">{{ solution.title }}</h3>
          <p class="card-description">{{ solution.description }}</p>
        </ScrollItem>
      </ScrollRow>
    </HorizontalScrollContainer>
  </div>
</template>

<style scoped>
.struggles-offers-section {
  width: 100%;
}

.heading-responsive {
  font-size: 1.75rem;
  font-weight: 700;
}

.gradient-text {
  background: linear-gradient(90deg, #4a6cf7, #f3a4ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card-description {
  font-size: 1rem;
  line-height: 1.5;
  opacity: 0.8;
}

.icon-imprint {
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 3rem;
  opacity: 0.2;
  transform: translate(6px, 6px);
}
</style>