
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/dist/TextPlugin';
import type { CodeStep } from '@/types/code-evolution';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const codeSteps: CodeStep[] = [
  {
    html: '<div class="container">',
    css: '.container {',
    js: 'const app = {}'
  },
  {
    html: '<div class="container">\n  <header class="header">',
    css: '.container {\n  display: flex;',
    js: 'const app = {\n  init() {'
  },
  {
    html: '<div class="container">\n  <header class="header">\n    <nav class="nav">',
    css: '.container {\n  display: flex;\n  justify-content: center;',
    js: 'const app = {\n  init() {\n    this.setupEvents();'
  },
  {
    html: '<div class="container">\n  <header class="header">\n    <nav class="nav">\n      <ul class="nav__list">',
    css: '.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;',
    js: 'const app = {\n  init() {\n    this.setupEvents();\n    this.render();'
  }
];

const htmlCode = ref<string>(codeSteps[0].html);
const cssCode = ref<string>(codeSteps[0].css);
const jsCode = ref<string>(codeSteps[0].js);

const animateCode = () => {
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: '.code-evolution',
      start: 'top center',
      end: 'bottom center',
      toggleActions: 'play none none reverse'
    }
  });

  codeSteps.forEach((step, index) => {
    if (index === 0) return;
    
    // HTML animation
    timeline.to(htmlCode, {
      duration: 1,
      text: step.html,
      ease: 'none'
    }, index * 2);

    // CSS animation
    timeline.to(cssCode, {
      duration: 1,
      text: step.css,
      ease: 'none'
    }, index * 2 + 0.5);

    // JS animation
    timeline.to(jsCode, {
      duration: 1,
      text: step.js,
      ease: 'none'
    }, index * 2 + 1);
  });

  // Reset animation
  timeline.to(htmlCode, {
    duration: 1,
    text: codeSteps[0].html,
    ease: 'none'
  })
  .to(cssCode, {
    duration: 1,
    text: codeSteps[0].css,
    ease: 'none'
  }, '<')
  .to(jsCode, {
    duration: 1,
    text: codeSteps[0].js,
    ease: 'none'
  }, '<');
};

onMounted(() => {
  animateCode();
});
</script>

<template>
  <div class="code-evolution my-32">
    <div class="code-container">
      <div class="code-panel">
        <div class="code-header">
          <span class="code-dot"></span>
          <span class="code-dot"></span>
          <span class="code-dot"></span>
          <span class="code-label">HTML</span>
        </div>
        <pre><code>{{ htmlCode }}</code></pre>
      </div>
      
      <div class="code-panel">
        <div class="code-header">
          <span class="code-dot"></span>
          <span class="code-dot"></span>
          <span class="code-dot"></span>
          <span class="code-label">CSS</span>
        </div>
        <pre><code>{{ cssCode }}</code></pre>
      </div>
      
      <div class="code-panel">
        <div class="code-header">
          <span class="code-dot"></span>
          <span class="code-dot"></span>
          <span class="code-dot"></span>
          <span class="code-label">JavaScript</span>
        </div>
        <pre><code>{{ jsCode }}</code></pre>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.code-evolution {
  .code-container {
    @apply grid grid-cols-1 md:grid-cols-3 gap-4;
  }

  .code-panel {
    @apply bg-neutral-900/50 rounded-lg overflow-hidden;
  }

  .code-header {
    @apply flex items-center gap-2 p-3 bg-neutral-900/80;
  }

  .code-dot {
    @apply w-3 h-3 rounded-full bg-neutral-700;
  }

  .code-label {
    @apply ml-2 text-sm text-neutral-400;
  }

  pre {
    @apply p-4 text-sm overflow-x-auto;
  }

  code {
    @apply font-mono text-neutral-300;
  }
}
</style>