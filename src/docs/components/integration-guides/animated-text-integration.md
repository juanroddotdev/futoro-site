# Text Animation Components Integration Guide

## Overview

The `AnimatedText` component provides dynamic text animations with support for multiple animation types, word-level effects, and highlighting. It's designed to create engaging text transitions and effects with minimal configuration.

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
- `fadeUp`: Text fades in while moving upward
- `slideInLeft`: Text slides in from left side of screen
- `slideInRight`: Text slides in from right side of screen

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
| highlightKeywords | Boolean | false | Enable keyword highlighting |
| keywordsToHighlight | Array | [] | Array of strings to highlight |
| keywordGradients | Array | [] | Array of gradient strings to apply to keywords |
| highlightDuration | Number | 2 | Duration of the highlight animation |
| highlightDelay | Number | 1 | Delay before starting the highlight animation |

## Configuration Object Pattern (New)

Based on the refactoring options, you can now use the configuration object pattern for a cleaner API:

```vue
<template>
  <AnimatedText 
    :content="{
      firstPart: 'Hello',
      secondPart: 'World',
      suffix: '!'
    }"
    :animation="{
      type: 'split',
      duration: 2,
      delay: 1,
      ease: 'power3.out'
    }"
    :highlighting="{
      enabled: true,
      keywords: ['Hello'],
      gradients: ['linear-gradient(90deg, #FF4500, #FF7F50, #FFAA33, #FFD700)'],
      delay: 0.5,
      duration: 1.5
    }"
  />
</template>
```

This pattern organizes related props into logical groups, making the component more readable and maintainable.

## Word Effects

The `AnimatedText` component supports word-level animations through the following props:

- `wordEffects`: Boolean to enable word-level animations
- `wordTargets`: Array of strings to target specific words
- `wordEffectTypes`: Array of effect types to apply to each target word
- `wordEffectStyles`: Array of style objects for each effect
- `wordEffectDuration`: Number for duration of word effects (in seconds)
- `wordEffectDelay`: Number for delay before word effects start (in seconds)

### Available Word Effect Types

- `highlight`: Animates gradient background position
- `bounce`: Makes the word bounce up and down
- `shake`: Creates a shaking motion
- `squeeze`: Squeezes and expands the word

### Word Effect Styles

Each effect type accepts different style parameters:

#### highlight
```js
{
  gradientClass: 'gradient-theme-fire', // CSS class for gradient
  iterations: 2 // Number of times to animate the gradient
}
```

#### bounce
```js
{
  height: 20, // Bounce height in pixels
  ease: 'elastic.out(1, 0.3)' // GSAP easing function
}
```

#### shake
```js
{
  intensity: 5, // Shake intensity in pixels
  iterations: 2, // Number of shakes
  ease: 'power2.inOut' // GSAP easing function
}
```

#### squeeze
```js
{
  scale: 0.8, // Minimum scale value
  iterations: 1, // Number of squeeze cycles
  ease: 'power1.inOut' // GSAP easing function
}
```

### Advanced: Custom Effect Styles

For advanced use cases, you can add custom CSS properties to any effect through the `customStyles` property:

```js
{
  // Standard effect parameters
  height: 15,
  ease: 'elastic.out(1, 0.2)',
  
  // Custom CSS properties to apply during the animation
  customStyles: {
    color: '#FF5500',
    fontWeight: 'bold',
    textShadow: '0 0 5px rgba(255,85,0,0.5)'
  }
}
```

### Example Usage

```vue
<AnimatedText
  firstPart="From Frustration"
  secondPart="To Fantastic"
  animation="split"
  :wordEffects="true"
  :wordTargets="['Frustration', 'Fantastic']"
  :wordEffectTypes="['highlight', 'bounce']"
  :wordEffectStyles="[
    { 
      gradientClass: 'gradient-theme-fire',
      iterations: 3
    },
    { 
      height: 15,
      ease: 'elastic.out(1, 0.2)'
    }
  ]"
  :wordEffectDuration="2"
  :wordEffectDelay="0.3"
/>
```

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

## Events

The component emits the following events:

- `animation-complete`: Fired when the main animation completes
- `word-effects-complete`: Fired when word-level effects complete
- `all-animations-complete`: Fired when all animations (main + word effects) complete

## Accessibility

The component respects the user's `prefers-reduced-motion` setting. When this preference is enabled, animations will be simplified or disabled to prevent motion sickness.

## Performance Tips

- Use simpler animations like `fade` or `fadeUp` for frequently animated elements
- Limit the number of simultaneous animations on a page
- For word effects, target only a few key words rather than every word
- Consider using `triggerOnVisible` to only animate elements when they enter the viewport

## Examples

### Hero Section

```vue
<template>
  <div class="hero">
    <AnimatedText
      firstPart="Transform Your"
      secondPart="Digital Experience"
      animation="split"
      :duration="1.5"
      :useGradient="true"
    />
  </div>
</template>
```

### Feature List

```vue
<template>
  <div class="features">
    <AnimatedText
      firstPart="Key Features"
      animation="fadeUp"
      :triggerOnVisible="true"
    />
    
    <div v-for="(feature, index) in features" :key="index" class="feature">
      <AnimatedText
        :firstPart="feature.title"
        animation="slideInLeft"
        :delay="index * 0.2"
        :triggerOnVisible="true"
      />
    </div>
  </div>
</template>
```

### Interactive Example

```vue
<template>
  <div class="interactive-demo">
    <div class="controls">
      <select v-model="selectedAnimation">
        <option v-for="anim in animations" :key="anim" :value="anim">
          {{ anim }}
        </option>
      </select>
      <button @click="resetKey++">Reset Animation</button>
    </div>
    
    <AnimatedText
      firstPart="This is an"
      secondPart="interactive demo"
      :animation="selectedAnimation"
      :resetKey="resetKey"
      @animation-complete="animationCompleted = true"
    />
    
    <div v-if="animationCompleted" class="completion-message">
      Animation completed!
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const animations = [
  'fade', 'split', 'typewriter', 'bounce', 'rotate', 
  'glitch', 'shake', 'scramble', 'fadeUp', 
  'slideInLeft', 'slideInRight'
];
const selectedAnimation = ref('fade');
const resetKey = ref(0);
const animationCompleted = ref(false);

watch(resetKey, () => {
  animationCompleted.value = false;
});
</script>
```


