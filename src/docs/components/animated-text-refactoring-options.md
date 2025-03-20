# AnimatedText Component Refactoring Options

## Current Challenges
- Many props making the component complex to use
- Difficult to combine multiple animation effects
- Growing feature set leading to increased complexity

## Option 1: Configuration Object Pattern

```vue
<template>
  <AnimatedText 
    :content="{
      firstPart: 'Hello',
      secondPart: 'World'
    }"
    :animation="{
      type: 'split',
      duration: 2,
      delay: 1
    }"
    :highlighting="{
      enabled: true,
      keywords: ['Hello'],
      gradients: ['linear-gradient(90deg, #FF4500, #FF7F50, #FFAA33, #FFD700)'],
      delay: 0.5
    }"
  />
</template>
```

### Benefits
- Organizes related props into logical groups
- Reduces prop count while maintaining flexibility
- Makes component usage more readable and self-documenting
- Easy to extend with new features without adding more top-level props
- Familiar pattern for Vue developers

### Implementation Complexity: Medium
- Requires refactoring component props and internal logic
- Backward compatibility can be maintained with prop deprecation warnings

## Option 2: Preset System

```vue
<template>
  <AnimatedText 
    preset="heroHeadline" 
    firstPart="Hello" 
    secondPart="World"
    :customizations="{
      highlightDelay: 0.5
    }"
  />
</template>
```

### Benefits
- Dramatically simplifies common use cases
- Encourages consistency across the application
- Allows for design system integration
- Still provides customization when needed
- Great for teams with designers and developers

### Implementation Complexity: Medium-High
- Requires defining a preset system
- Need to identify common animation patterns
- Should include a way to extend/override preset values

## Option 3: Composition API Custom Hook

```vue
<template>
  <div ref="textContainer">
    <span>{{ firstPart }}</span>
    <span>{{ secondPart }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAnimatedText } from '@/composables/useAnimatedText';

const textContainer = ref(null);
const firstPart = ref('Hello');
const secondPart = ref('World');

useAnimatedText(textContainer, {
  parts: [firstPart, secondPart],
  animation: 'split',
  highlighting: {
    keywords: ['Hello'],
    delay: 0.5
  }
});
</script>
```

### Benefits
- Separates animation logic from component rendering
- Provides maximum flexibility for custom layouts
- Leverages Vue 3's Composition API strengths
- Can be combined with other composables easily
- Great for complex, custom animations

### Implementation Complexity: High
- Requires creating a new composable
- More setup code for each usage
- May require more DOM manipulation

## Recommendation

The **Configuration Object Pattern** offers the best balance of simplicity and flexibility while being a natural evolution of your current approach. It would be the easiest to implement while significantly improving the component's usability.

If you frequently use the same animation configurations, consider implementing the **Preset System** as a second phase after the configuration object pattern is in place.