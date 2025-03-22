<template>
  <section class="reveal-section" :class="sectionClass" :id="sectionId">
    <div class="sticky-container">
      <div class="header-container" :class="headerContainerClass">
        <AnimatedText 
          class="section-title gradient-text"
          :firstPart="title"  
          :animation="titleAnimation"
          :useGradient="true" 
          :duration="3" 
          :initiallyHidden="true"
        />
      </div>
      <div class="cards-container" :id="containerId">
        <div v-if="!reverseLayout" class="card title-card">
          <!-- placeholder card -->
        </div>
        <div 
          class="card group hover-card-themed p-6 relative overflow-hidden"
          :class="cardClass"
          v-for="item in items" 
          :key="`${sectionId}-${item.id}`"
        >
          <div class="relative z-10">
            <h3 class="text-md font-semibold gradient-text mb-3">{{ item.title }}</h3>
            <p class="theme-text--neutral">{{ item.description }}</p>
          </div>
        </div>
        <div v-if="reverseLayout" class="card title-card">
          <!-- placeholder card -->
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface Item {
  id: number;
  title: string;
  description: string;
}

interface Props {
  sectionId: string;
  containerId: string;
  title: string;
  items: Item[];
  sectionClass?: string;
  cardClass?: string;
  headerContainerClass?: string;
  titleAnimation?: string;
  reverseLayout?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  sectionClass: '',
  cardClass: '',
  headerContainerClass: '',
  titleAnimation: 'slideInRight',
  reverseLayout: false
});
</script>