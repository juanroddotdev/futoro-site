<script setup lang="ts">
// No props or special logic needed for now
</script>

<template>
  <footer class="footer footer--transparent">
    <div class="footer-content">
      <p class="body-text text-white">© {{ new Date().getFullYear() }} Futoro Digital Design Lab. All rights reserved.</p>
      <div class="footer-links">
        <router-link to="/client-form" class="body-text text-white hover:text-white/90">Client Form</router-link>
        <a href="#" class="body-text text-white hover:text-white/90">Privacy Policy</a>
        <a href="#" class="body-text text-white hover:text-white/90">Terms of Service</a>
      </div>
    </div>
  </footer>
</template>

<style lang="scss">
// Footer styles are already in @/scss/layout/_app.scss

.footer--transparent {
  background: transparent;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 3; // Higher than ContactSection's z-index of 2
}
</style>