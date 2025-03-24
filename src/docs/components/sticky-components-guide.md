# Sticky Components Implementation Guide

This guide explains how to use the various sticky components in our project for creating scroll-based interactive sections.

## Overview of Components

Our project includes several sticky components that work together:

1. `StickySectionContainer` - Base component that creates a sticky container
2. `StickyFlexibleContent` - Combines sticky behavior with flexible content layout
3. `StickyHeroSection` - Specialized sticky hero section with phone display

## Basic Usage Pattern

All sticky components follow a similar pattern:
- They create a tall container that takes up more vertical space than the viewport
- Content inside the container sticks to the viewport while scrolling through this space
- This creates an opportunity for scroll-based animations and interactions

## 1. StickySectionContainer

This is the foundational component that provides sticky behavior.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| height | String | "300vh" | Height of the scrollable container (e.g., "300vh") |
| position | String | "top" | Position to stick to ("top", "center", "bottom") |
| offset | Number | 0 | Offset in pixels from the position |
| zIndex | Number | 2 | z-index of the sticky element |
| debug | Boolean | false | Show debug information |

### Example

```vue
<template>
  <StickySectionContainer 
    height="300vh"
    position="top"
    :offset="0"
    :zIndex="10"
    :debug="true"
  >
    <div class="your-content">
      <h2>Your Sticky Content</h2>
      <p>This content will stick to the top as you scroll.</p>
    </div>
  </StickySectionContainer>
</template>

<script setup>
import StickySectionContainer from '@/components/ui/containers/StickySectionContainer.vue';
</script>
```

## 2. StickyFlexibleContent

This component combines the sticky behavior with a flexible content layout that includes a phone display and content area.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| messages | Array | required | Array of messages to display on phone |
| showTypingFor | Array | [] | Indices of messages to show typing animation |
| layout | String | "content-left" | Layout type ("content-left", "content-right", "content-top") |
| phonePosition | String | "right" | Phone position ("left", "right", "center") |
| tiltX | Number | 0 | X-axis tilt for phone |
| tiltY | Number | 0 | Y-axis tilt for phone |
| sectionId | String | "" | ID for the section |
| containerHeight | String | "300vh" | Height of the sticky container |
| debug | Boolean | false | Show debug information |
| customClass | String | "" | Additional CSS classes |

### Example

```vue
<template>
  <StickyFlexibleContent
    :messages="messages"
    :showTypingFor="[0, 1]"
    layout="content-left"
    phonePosition="right"
    :tiltX="5"
    :tiltY="-10"
    containerHeight="400vh"
    :debug="false"
    customClass="dark-theme"
  >
    <template #headline>
      <h1 class="heading--accent">Main Headline</h1>
    </template>
    <template #subheadline>
      <p class="heading--highlight">Subheadline text here</p>
    </template>
    <template #content>
      <p>Additional content goes here.</p>
      <button class="btn-primary">Call to Action</button>
    </template>
  </StickyFlexibleContent>
</template>

<script setup>
import StickyFlexibleContent from '@/components/sections/StickyFlexibleContent.vue';
import { ref } from 'vue';

const messages = ref([
  { type: 'received', text: 'Hello there!' },
  { type: 'sent', text: 'Hi! How can I help you?' },
  // More messages...
]);
</script>
```

## 3. StickyHeroSection

A specialized sticky section designed specifically for hero sections.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| currentTheme | String | "theme-default" | Current theme name |
| debug | Boolean | false | Show debug information |

### Example

```vue
<template>
  <StickyHeroSection
    current-theme="theme-neon"
    :debug="true"
  />
</template>

<script setup>
import StickyHeroSection from '@/components/sections/StickyHeroSection.vue';
</script>
```

## Advanced Usage: Combining with Other Components

### Using with GridPaperOverlay

You can combine sticky sections with the grid paper overlay for enhanced visual effects:

```vue
<template>
  <div class="main-content">
    <!-- Fixed grid overlay -->
    <div class="viewport-grid">
      <GridPaperOverlay :theme="currentTheme" :floating="true" :spotlight="true" />
    </div>
    
    <!-- Sticky content -->
    <StickyFlexibleContent
      :messages="messages"
      layout="content-left"
      phonePosition="right"
      containerHeight="400vh"
    >
      <!-- Content slots here -->
    </StickyFlexibleContent>
  </div>
</template>

<style lang="scss">
.viewport-grid {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  pointer-events: none;
  z-index: 1;
}
</style>
```

### Using with Scroll Accordion

Combine sticky sections with scroll accordion for complex scroll-based interactions:

```vue
<template>
  <StickySectionContainer height="500vh">
    <div class="sticky-content">
      <h2>Scroll down to see the accordion</h2>
      <ScrollAccordionVanilla :items="accordionItems" />
    </div>
  </StickySectionContainer>
</template>
```

## Troubleshooting

### Z-Index Issues

If elements are not appearing in the correct stacking order:

1. Check the `zIndex` prop on your sticky containers
2. Ensure parent elements have appropriate positioning (relative/absolute)
3. Verify that no other elements have higher z-index values

### Content Not Sticking

If content is not sticking properly:

1. Verify the container height is sufficient (at least "200vh")
2. Check that no parent elements have `overflow: hidden`
3. Ensure the sticky element has a background color if needed for visibility

### Performance Issues

For better performance:

1. Minimize DOM elements inside sticky containers
2. Use hardware-accelerated properties for animations (`transform`, `opacity`)
3. Consider using `will-change` CSS property for elements that will animate
4. Set `debug` to `false` in production

## Best Practices

1. **Container Height**: Set an appropriate container height based on the amount of content and desired scroll duration.
2. **Content Structure**: Keep the DOM structure inside sticky containers as simple as possible.
3. **Responsive Design**: Test sticky sections on various screen sizes and adjust layouts accordingly.
4. **Animation Performance**: Use efficient animations that don't cause layout thrashing.
5. **Accessibility**: Ensure content remains accessible when using sticky sections.