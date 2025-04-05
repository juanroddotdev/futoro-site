<template>
  <div class="example-container">
    <SimpleLoader 
      :headline="'Welcome to Futoro Digital Design'" 
      :subheadline="'Creating innovative digital experiences that drive results'"
      :showDebug="false"
      @complete="onLoaderComplete"
    />
  </div>
</template>

<script setup lang="ts">
import { SimpleLoader } from './index';

const onLoaderComplete = () => {
  console.log('Loader animation complete!');
  // You can navigate to the next page or show content here
};
</script>

<style scoped>
.example-container {
  width: 100%;
  height: 100vh;
  position: relative;
}
</style> 