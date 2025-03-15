# Struggles & Offers Horizontal Scroll Integration Guide

## Files to Copy

1. Copy the following files to your project:
   - `StrugglesOffersHorizontalScroll.vue` → `src/components/sections/StrugglesOffersHorizontalScroll.vue`
   - `HorizontalScrollSection.vue` → `src/components/ui/HorizontalScrollSection.vue`
   - `strugglesAndSolutions.ts` → `src/data/strugglesAndSolutions.ts`
   - `icons.ts` → `src/utils/icons.ts` (or merge with your existing icons file)

## Dependencies

This component relies on:
- Vue 3 Composition API
- TailwindCSS for styling (classes like `@apply`, etc.)
- SCSS variables and mixins from your theme system

## Usage

```vue
<template>
  <div class="py-20">
    <h2 class="text-3xl font-bold text-center mb-10">From Frustration to Fantastic</h2>
    <StrugglesOffersHorizontalScroll />
  </div>
</template>

<script setup>
import StrugglesOffersHorizontalScroll from '@/components/sections/StrugglesOffersHorizontalScroll.vue';
</script>
```

## How It Works

The StrugglesOffersHorizontalScroll component creates a scroll-based animation with two rows of cards:
1. "Common Hurdles" row - scrolls from left to right
2. "Clear Solutions" row - scrolls from right to left

As the user scrolls down the page, the cards move horizontally, creating an engaging interactive experience.

## Customization

### Data

You can customize the content by modifying the data in `strugglesAndSolutions.ts`:

```typescript
// Example of modifying a struggle item
export const struggles = [
  {
    id: 1,
    title: 'Your Custom Title',
    description: 'Your custom description text.'
  },
  // Add more items...
];
```

### Icons

Icons are defined in `icons.ts` and can be customized by replacing the SVG content:

```typescript
export const icons = {
  struggle: {
    search: '<svg>...</svg>', // Replace with your custom SVG
    // Add more icons...
  },
  // ...
};
```

### Styling

The component uses a combination of TailwindCSS classes and SCSS. You can customize the appearance by:

1. Modifying the TailwindCSS classes in the component templates
2. Adjusting the SCSS variables in your theme system
3. Overriding specific styles in your global stylesheet