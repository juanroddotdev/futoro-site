<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToFinal = () => {
  router.push('/final')
}
</script>

<template>
  <button 
    @click="navigateToFinal"
    class="view-final-btn"
  >
    <span class="btn-text">View Final Design</span>
    <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd" />
    </svg>
  </button>
</template>

<style lang="scss" scoped>
.view-final-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #333;
  color: white;
  border-radius: 9999px;
  font-family: 'Architects Daughter', cursive;
  transition: all 0.3s ease;
  border: 2px solid #333;
  filter: url(#pencil-effect);
  
  &:hover {
    transform: scale(1.05);
    background: white;
    color: #333;
    
    .icon {
      transform: translateX(3px);
    }
  }

  .btn-text {
    font-size: 1rem;
    font-weight: 500;
  }

  .icon {
    width: 1.25rem;
    height: 1.25rem;
    transition: transform 0.3s ease;
  }
}
</style>