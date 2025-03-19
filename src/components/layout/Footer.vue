<script setup lang="ts">
// No props or special logic needed for now
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <p class="body-text text-white">© {{ new Date().getFullYear() }} Futoro Digital Design Lab. All rights reserved.</p>
      <div class="footer-links">
        <a href="#" class="body-text text-white hover:text-white/90">Privacy Policy</a>
        <a href="#" class="body-text text-white hover:text-white/90">Terms of Service</a>
      </div>
    </div>
  </footer>
</template>

<style lang="scss">
// Footer styles are already in @/scss/layout/_app.scss
</style>