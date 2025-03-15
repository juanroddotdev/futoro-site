# Coordinated Scroll Sections Guide

## Overview

The coordinated scroll system consists of two main components:

1. `CoordinatedScrollSections` - The parent container that manages overall scroll progress
2. `CoordinatedScrollSection` - Individual sections that receive progress updates

This system allows you to create multi-stage scroll animations where sections transition smoothly from one to another.

## Basic Usage

### Step 1: Import the components

```vue
import CoordinatedScrollSections from '@/components/ui/CoordinatedScrollSections.vue';
import CoordinatedScrollSection from '@/components/ui/CoordinatedScrollSection.vue';
```

### Step 2: Set up the container

```vue
<CoordinatedScrollSections :section-count="3" scroll-distance="400%">
  <!-- Sections will go here -->
</CoordinatedScrollSections>
```

### Step 3: Add individual sections

```vue
<CoordinatedScrollSections :section-count="3" scroll-distance="400%">
  <!-- First section (index 0) -->
  <CoordinatedScrollSection :index="0">
    <template v-slot="{ progress, isActive }">
      <!-- Your content here -->
      <div>Section 1 Progress: {{ progress }}</div>
    </template>
  </CoordinatedScrollSection>
  
  <!-- Second section (index 1) -->
  <CoordinatedScrollSection :index="1">
    <template v-slot="{ progress, isActive }">
      <!-- Your content here -->
      <div>Section 2 Progress: {{ progress }}</div>
    </template>
  </CoordinatedScrollSection>
  
  <!-- Third section (index 2) -->
  <CoordinatedScrollSection :index="2">
    <template v-slot="{ progress, isActive }">
      <!-- Your content here -->
      <div>Section 3 Progress: {{ progress }}</div>
    </template>
  </CoordinatedScrollSection>
</CoordinatedScrollSections>
```

## Using with HorizontalScrollSection

To use with the `HorizontalScrollSection` component:

```vue
<CoordinatedScrollSections :section-count="2" scroll-distance="300%">
  <!-- First horizontal scroll section -->
  <CoordinatedScrollSection :index="0">
    <template v-slot="{ progress }">
      <HorizontalScrollSection
        :items="yourItems"
        :manualProgress="progress"
      >
        <!-- HorizontalScrollSection content -->
      </HorizontalScrollSection>
    </template>
  </CoordinatedScrollSection>
  
  <!-- Second horizontal scroll section -->
  <CoordinatedScrollSection :index="1">
    <template v-slot="{ progress }">
      <HorizontalScrollSection
        :items="otherItems"
        initialDirection="reverse"
        :manualProgress="progress"
      >
        <!-- HorizontalScrollSection content -->
      </HorizontalScrollSection>
    </template>
  </CoordinatedScrollSection>
</CoordinatedScrollSections>
```

## Using with Custom Components

You can use the progress value with any component or element:

```vue
<CoordinatedScrollSection :index="0">
  <template v-slot="{ progress, isActive }">
    <!-- Animate opacity based on progress -->
    <div :style="{ opacity: progress }">
      Fades in as you scroll
    </div>
    
    <!-- Animate transform based on progress -->
    <div :style="{ transform: `translateX(${progress * 100}px)` }">
      Moves right as you scroll
    </div>
    
    <!-- Conditionally show elements -->
    <div v-if="progress > 0.5">
      Appears halfway through the scroll
    </div>
  </template>
</CoordinatedScrollSection>
```

## Using with GSAP Animations

For more complex animations, you can use the progress value to control GSAP timelines:

```vue
<script setup>
import { ref, onMounted, watch } from 'vue';
import gsap from 'gsap';

const animationContainer = ref(null);
const timeline = ref(null);

onMounted(() => {
  // Create a GSAP timeline
  timeline.value = gsap.timeline({ paused: true });
  
  // Add animations to the timeline
  timeline.value.to('.element1', { x: 100, duration: 0.5 })
               .to('.element2', { opacity: 1, duration: 0.3 })
               .to('.element3', { scale: 1.2, duration: 0.2 });
});

// Watch the progress prop and update the timeline
const props = defineProps(['progress']);
watch(() => props.progress, (newProgress) => {
  if (timeline.value) {
    timeline.value.progress(newProgress);
  }
});
</script>

<template>
  <div ref="animationContainer">
    <div class="element1">Element 1</div>
    <div class="element2">Element 2</div>
    <div class="element3">Element 3</div>
  </div>
</template>
```

Then use it in your coordinated section:

```vue
<CoordinatedScrollSection :index="0">
  <template v-slot="{ progress }">
    <YourGsapComponent :progress="progress" />
  </template>
</CoordinatedScrollSection>
```

## Component Props

### CoordinatedScrollSections

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| sectionCount | Number | 2 | Number of sections to coordinate |
| scrollDistance | String | '300%' | Total scroll distance as percentage of viewport height |
| pinSections | Boolean | true | Whether to pin the sections during scroll |
| scrubAmount | Number | 1 | Smoothness of the scroll (higher = smoother) |

### CoordinatedScrollSection

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| index | Number | required | Index of this section in the sequence (0-based) |

## Slot Props

### CoordinatedScrollSections

| Prop | Type | Description |
|------|------|-------------|
| activeSection | Number | Index of the currently active section |
| sectionProgress | Array | Array of progress values for each section |

### CoordinatedScrollSection

| Prop | Type | Description |
|------|------|-------------|
| progress | Number | Progress value for this section (0-1) |
| isActive | Boolean | Whether this section is currently active |

## Advanced Usage

### Creating a 10-Section Sequence

```vue
<CoordinatedScrollSections :section-count="10" scroll-distance="1000%">
  <CoordinatedScrollSection 
    v-for="i in 10" 
    :key="i-1" 
    :index="i-1"
  >
    <template v-slot="{ progress, isActive }">
      <div>Section {{ i }} Progress: {{ progress }}</div>
    </template>
  </CoordinatedScrollSection>
</CoordinatedScrollSections>
```

### Customizing Section Transitions

You can create custom transition effects by combining multiple animations based on the progress value:

```vue
<CoordinatedScrollSection :index="1">
  <template v-slot="{ progress, isActive }">
    <div 
      class="custom-transition"
      :style="{
        opacity: progress,
        transform: `
          translateY(${(1 - progress) * 100}px)
          scale(${0.5 + (progress * 0.5)})
          rotate(${progress * 360}deg)
        `
      }"
    >
      Complex animation based on progress
    </div>
  </template>
</CoordinatedScrollSection>
```

## Troubleshooting

1. **Sections not appearing in the right order**
   - Ensure each section has the correct index (starting from 0)
   - Verify the section count matches the number of sections

2. **Scroll animation feels jerky**
   - Increase the scrubAmount prop (e.g., :scrub-amount="3")
   - Simplify animations to improve performance

3. **Content disappearing unexpectedly**
   - Check that v-show/v-if conditions aren't hiding content prematurely
   - Ensure z-index values are set correctly for overlapping elements

4. **Scroll distance too short/long**
   - Adjust the scrollDistance prop to control the total scroll length
   - Use a larger percentage for more sections (e.g., "100%" per section)

## Performance Tips

1. Use `requestAnimationFrame` or the `rafThrottle` utility for smooth animations:
```javascript
import { rafThrottle } from '@/utils/scroll/utils/performance';

// In your component:
const updateTransform = rafThrottle(() => {
  // Update animations based on progress
});
```

2. Avoid expensive DOM operations in scroll handlers:
```vue
<!-- Good: Use CSS transforms -->
<div :style="{ transform: `translateX(${progress * 100}px)` }">
  Efficient animation
</div>

<!-- Avoid: Changing layout properties -->
<div :style="{ left: `${progress * 100}px` }">
  Less efficient animation
</div>
```

3. Use CSS variables for complex animations:
```vue
<template>
  <div class="animated-element" :style="{ '--progress': progress }">
    Element with multiple animations
  </div>
</template>

<style>
.animated-element {
  transform: 
    translateX(calc(var(--progress) * 100px))
    scale(calc(0.5 + (var(--progress) * 0.5)))
    rotate(calc(var(--progress) * 360deg));
  opacity: var(--progress);
}
</style>
```