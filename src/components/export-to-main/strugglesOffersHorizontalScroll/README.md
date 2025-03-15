# Struggles & Offers Horizontal Scroll Component

A Vue 3 component that creates an engaging horizontal scrolling experience showing common challenges and their solutions. As users scroll down the page, cards move horizontally in opposite directions, creating a dynamic and interactive presentation.

## Features

- Smooth, scroll-based horizontal animations
- Responsive design that works on all devices
- Two rows of content that scroll in opposite directions
- Customizable content and styling
- Built with Vue 3 Composition API

## Files

- `StrugglesOffersHorizontalScroll.vue`: The main component
- `HorizontalScrollSection.vue`: Reusable horizontal scroll section component
- `data/strugglesAndSolutions.ts`: Sample data for struggles and solutions
- `utils/icons.ts`: SVG icons used in the component
- `integration-guide.md`: Step-by-step instructions for adding to your project

## Dependencies

This component relies on:
- Vue 3 Composition API
- TailwindCSS for styling
- SCSS variables and mixins from your theme system

## How to Use

See the `integration-guide.md` for detailed instructions on adding this component to your project.

Basic usage:

```vue
<template>
  <StrugglesOffersHorizontalScroll />
</template>

<script setup>
import StrugglesOffersHorizontalScroll from '@/components/sections/StrugglesOffersHorizontalScroll.vue';
</script>
```

## How It Works

The component uses the Intersection Observer API and scroll events to:
1. Detect when the section enters the viewport
2. Pin the section in place while scrolling continues
3. Translate the card containers horizontally based on scroll position
4. Release the pin when scrolling is complete

This creates a smooth, engaging experience where content moves horizontally as the user scrolls vertically.

## Customization

You can customize:
- Content: Modify the data in `strugglesAndSolutions.ts`
- Icons: Replace SVGs in `icons.ts`
- Styling: Adjust TailwindCSS classes and SCSS variables
- Behavior: Modify scroll sensitivity and animation parameters