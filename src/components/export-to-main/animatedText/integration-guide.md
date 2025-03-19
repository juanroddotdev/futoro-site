# Text Animation Components Integration Guide

## Files to Copy

1. Copy `textAnimations.ts` to `src/animations/text/textAnimations.ts`
2. Copy `AnimatedText.vue` to `src/components/text/AnimatedText.vue`

## Dependencies

Ensure these dependencies are installed:
```bash
npm install gsap@^3.12.5
```

## Usage

### Local Import

```vue
<template>
  <AnimatedText 
    firstPart="Hello" 
    secondPart="World" 
    animation="typewriter"
  />
</template>

<script setup>
import AnimatedText from '@/components/text/AnimatedText.vue';
</script>
```

### Global Registration

To avoid importing the component in every file, you can register it globally in your main.ts/main.js file:

```typescript
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import AnimatedText from '@/components/text/AnimatedText.vue'

const app = createApp(App)

// Register AnimatedText as a global component
app.component('AnimatedText', AnimatedText)

app.mount('#app')
```

After registering it globally, you can use it in any component without importing it:

```vue
<template>
  <AnimatedText 
    firstPart="Hello" 
    secondPart="World" 
    animation="typewriter"
  />
</template>

<script setup>
// No need to import AnimatedText
</script>
```

## Available Animations

- `fade`: Simple fade-in animation
- `split`: Split text parts enter from opposite sides
- `typewriter`: Character-by-character typing effect
- `bounce`: Text bounces up into view
- `rotate`: 3D rotation effect
- `glitch`: Digital glitch effect
- `shake`: Progressive shaking effect
- `scramble`: Letters scramble into place

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| firstPart | String | required | First part of the text |
| secondPart | String | '' | Second part of the text |
| suffix | String | '' | Suffix text |
| useGradient | Boolean | false | Apply gradient styling |
| animation | String | 'fade' | Animation type |
| duration | Number | 1 | Animation duration |
| delay | Number | 0 | Animation delay |
| ease | String | 'power2.out' | GSAP easing function |
| resetKey | Number | 0 | Change to restart animation |
| triggerOnVisible | Boolean | true | Trigger animation when element becomes visible |
| restartOnVisible | Boolean | true | Restart animation when element becomes visible again |
| initiallyHidden | Boolean | false | Start with elements hidden before animation |

## Resetting Animations

To reset an animation, change the `resetKey` prop:

```vue
<script setup>
import { ref } from 'vue';

const resetKey = ref(0);

function resetAnimation() {
  resetKey.value++;
}
</script>

<template>
  <AnimatedText 
    firstPart="Resettable" 
    secondPart="Animation" 
    animation="typewriter"
    :resetKey="resetKey"
  />
  <button @click="resetAnimation">Reset</button>
</template>
```
