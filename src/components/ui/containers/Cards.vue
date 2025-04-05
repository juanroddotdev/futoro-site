<template>
  <div class="cards-container">
    <div 
      class="cards__item hover-card-themed p-6 relative overflow-hidden"
      :class="[cardClass, `cards__item--${variant}`]"
      v-for="item in items" 
      :key="`${sectionId}-${item.id}`"
    >
      <div class="cards__content relative z-10">
        <h3 class="cards__title text-md font-semibold gradient-text mb-3">{{ item.title }}</h3>
        <p class="cards__description theme-text--neutral">{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Item {
  id: number;
  title: string;
  description: string;
}

interface Props {
  items: Item[];
  sectionId: string;
  cardClass?: string;
  variant?: 'default' | 'hover' | 'gradient';
}

const props = withDefaults(defineProps<Props>(), {
  cardClass: '',
  variant: 'default'
});
</script>

<style lang="scss" scoped>
.cards-container {
  width: 100%;
  padding: 1rem;
}

.cards {
  &__item {
    // Base styles for all cards
    transition: transform 0.3s ease;
    
    &--hover {
      &:hover {
        transform: translateY(-5px);
      }
    }
    
    &--gradient {
      background: var(--gradient-primary);
    }
  }
  
  &__content {
    // Content wrapper styles
  }
  
  &__title {
    // Title styles
  }
  
  &__description {
    // Description styles
  }
}
</style>

