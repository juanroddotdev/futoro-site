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
  gradientClass: 'gradient-theme-fire', // CSS class for gradient (e.g., 'gradient-theme-fire', 'gradient-theme-cool')
  iterations: 2 // Number of times to animate the gradient (default: 2)
}
```

#### bounce
```js
{
  height: 20, // Bounce height in pixels (default: 20)
  ease: 'elastic.out(1, 0.3)' // GSAP easing function (default: 'elastic.out(1, 0.3)')
}
```

#### shake
```js
{
  intensity: 5, // Shake intensity in pixels (default: 5)
  iterations: 2, // Number of shakes (default: 2)
  ease: 'power2.inOut' // GSAP easing function (default: 'power2.inOut')
}
```

#### squeeze
```js
{
  scale: 0.8, // Minimum scale value (default: 0.8)
  iterations: 1, // Number of squeeze cycles (default: 1)
  ease: 'power1.inOut' // GSAP easing function (default: 'power1.inOut')
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

This allows you to apply any CSS property to the word during its animation. Custom styles are applied at the beginning of the animation and removed when the animation completes.

Example with custom styles:

```vue
<AnimatedText
  firstPart="Custom Styled"
  secondPart="Animation"
  :wordEffects="true"
  :wordTargets="['Custom', 'Animation']"
  :wordEffectTypes="['bounce', 'highlight']"
  :wordEffectStyles="[
    { 
      height: 15,
      ease: 'elastic.out(1, 0.2)',
      customStyles: {
        fontWeight: 'bold',
        letterSpacing: '2px',
        color: '#FF5500'
      }
    },
    { 
      gradientClass: 'gradient-theme-cool',
      iterations: 2,
      customStyles: {
        fontStyle: 'italic',
        textDecoration: 'underline'
      }
    }
  ]"
/>
```

> **Note**: Custom styles should be used sparingly as they may conflict with theme styles or affect performance. For most cases, the built-in effect parameters should be sufficient.

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

### 🚨 Documentation Improvements Needed 🚨

The following improvements should be made to this section:

1. **Add Visual Examples**: Create GIFs/videos showing each effect with different parameters
2. **Create Interactive Demo**: Develop a simple playground for testing effect combinations
3. **Add Preset Combinations**: Document 3-5 preset effect combinations that work well together
4. **Clarify Theme Integration**: Explain how gradient classes relate to the theming system
5. **Include Performance Notes**: Document performance considerations for multiple effects
6. **Add Timing Guidance**: Provide optimal timing values for different effect combinations
7. **Document Accessibility**: Include information about respecting reduced motion preferences
8. **Add Troubleshooting**: Create a section for common issues and solutions
9. **Consider API Refactoring**: Evaluate implementing the Configuration Object Pattern
10. **Document Mobile Behavior**: Add notes about effects on mobile devices

These improvements will make the word effects feature more accessible and easier to implement correctly.

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
