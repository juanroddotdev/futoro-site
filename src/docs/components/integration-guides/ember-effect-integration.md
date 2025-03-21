# Ember Effect Component Integration Guide

## Overview

The `EmberEffect` component creates animated particle effects that can be attached to any element in your application. It supports multiple effect types including embers, fireworks, sparks, and rain.

## Files to Copy

1. Copy `EmberEffect.vue` to `src/components/effects/EmberEffect.vue`
2. Copy `particleEffects.js` to `src/components/effects/particleEffects.js`

## Dependencies

This component relies on:
- GSAP (GreenSock Animation Platform) for animations

```bash
npm install gsap
```

## Basic Usage

```vue
<template>
  <div class="card" ref="cardElement">
    <h2>Hover me!</h2>
    <p>I have a cool ember effect</p>
    
    <!-- Attach the ember effect to the card -->
    <EmberEffect 
      :targetElement="cardElement" 
      :active="isHovered"
      effectType="ember"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import EmberEffect from '@/components/effects/EmberEffect.vue';

const cardElement = ref(null);
const isHovered = ref(false);

const handleMouseEnter = () => {
  isHovered.value = true;
};

const handleMouseLeave = () => {
  isHovered.value = false;
};
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| targetElement | Object | null | The DOM element to attach the effect to |
| particleCount | Number | 15 | Number of particles to create |
| duration | Number | 2 | Duration of the animation in seconds |
| colors | Array | ['#ff4500', '#ff7800', '#ffaa33', '#ffcc00'] | Array of colors for the particles |
| offsetX | Number | 0 | Horizontal offset from the target element |
| offsetY | Number | 0 | Vertical offset from the target element |
| originX | Number | 50 | Horizontal origin point (0-100%) |
| originY | Number | 0 | Vertical origin point (0-100%) |
| relativeToParent | Boolean | false | Position relative to parent instead of absolute |
| startDelay | Number | 0 | Delay before starting the effect (seconds) |
| active | Boolean | true | Whether the effect is currently active |
| effectType | String | 'ember' | Type of effect ('ember', 'firework', 'spark', 'rain') |

## Events

| Event | Description |
|-------|-------------|
| ember-start | Emitted when the ember effect starts |

## Effect Types

The component supports multiple effect types through the `effectType` prop:

- **ember**: Particles that float upward with a glowing effect
- **firework**: Particles that explode outward in all directions
- **spark**: Small, fast-moving particles with a trail
- **rain**: Particles that fall downward

## Advanced Examples

### Button Click Effect

```vue
<template>
  <button 
    ref="buttonRef" 
    @click="triggerEffect"
    class="action-button"
  >
    Click Me!
    <EmberEffect 
      :targetElement="buttonRef" 
      :active="effectActive"
      effectType="firework"
      :particleCount="30"
      :duration="1.5"
      :colors="['#4287f5', '#42c5f5', '#42f5e3']"
    />
  </button>
</template>

<script setup>
import { ref } from 'vue';
import EmberEffect from '@/components/effects/EmberEffect.vue';

const buttonRef = ref(null);
const effectActive = ref(false);

const triggerEffect = () => {
  effectActive.value = true;
  setTimeout(() => {
    effectActive.value = false;
  }, 1500);
};
</script>
```

### Background Rain Effect

```vue
<template>
  <div class="hero-section" ref="heroSection">
    <h1>Welcome to our site</h1>
    <p>Discover amazing features</p>
    
    <EmberEffect 
      :targetElement="heroSection" 
      effectType="rain"
      :particleCount="50"
      :relativeToParent="true"
      :colors="['#ffffff', '#e0e0e0']"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import EmberEffect from '@/components/effects/EmberEffect.vue';

const heroSection = ref(null);
</script>
```

## Performance Considerations

- Use a reasonable `particleCount` (15-30 is usually sufficient)
- Deactivate effects when not needed using the `active` prop
- For frequently triggered effects, consider using a lower particle count

## Customizing Particle Effects

To create custom particle effects, you can extend the `particleEffects.js` file:

1. Add a new particle creation function
2. Add a new animation function
3. Register your effect in the `effectTypes` object

Example:

```js
// In particleEffects.js

// Create function
export const createSnowParticle = (container, props) => {
  const snow = document.createElement('div');
  // Style your particle
  return snow;
};

// Animate function
export const animateSnow = (particle, timeline, props) => {
  timeline.to(particle, {
    // Animation properties
  });
};

// Register in effectTypes
export const effectTypes = {
  // Existing effects...
  snow: {
    create: createSnowParticle,
    animate: animateSnow
  }
};
```

Then use it in your component:

```vue
<EmberEffect 
  :targetElement="element" 
  effectType="snow"
/>
```