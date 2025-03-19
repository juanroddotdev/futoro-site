# Scroll Accordion Integration Guide

## Files to Copy

1. Copy `ScrollAccordionVanilla.vue` to `src/components/ui/ScrollAccordionVanilla.vue`
2. Copy `scrollAccordion.ts` to `src/utils/scrollAccordion.ts`
3. Ensure `scrollUtils.ts` is in `src/utils/scroll/scrollUtils.ts`

## Dependencies

This component relies on the scroll utilities in your project. Make sure the following files are present:
- `src/utils/scrollAccordion.ts`
- `src/utils/scroll/scrollUtils.ts` (referenced by scrollAccordion.ts)

## Usage

```vue
<template>
  <div class="py-20">
    <h2 class="text-3xl font-bold text-center mb-10">Scroll Accordion</h2>
    <ScrollAccordionVanilla :items="accordionItems" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ScrollAccordionVanilla from '@/components/ui/ScrollAccordionVanilla.vue';

// Sample accordion items
const accordionItems = ref([
  { id: 1, title: 'First Item', description: 'This is the description for the first accordion item.' },
  { id: 2, title: 'Second Item', description: 'Here is the second item with its own unique description.' },
  { id: 3, title: 'Third Item', description: 'The third item in our accordion list.' },
  { id: 4, title: 'Fourth Item', description: 'Our final accordion item with some descriptive text.' },
]);
</script>
```

## How It Works

The ScrollAccordionVanilla component creates a scroll-based animation where accordion items collapse as the user scrolls down the page. It uses vanilla JavaScript for scroll tracking and animations without relying on GSAP or other animation libraries.

Key features:
- Smooth accordion collapse animation on scroll
- Pure CSS transitions for performance
- No external animation libraries required
- Responsive design

## Customization

You can customize the appearance by modifying the component's scoped CSS. The main styling elements are:

- `.scroll-accordion`: Container element with fixed height
- `.accordion`: Individual accordion items with gradient background
- `.title`: Accordion title styling
- `.text`: Accordion content that animates on scroll

To change the height of the scroll area, modify the `min-height` and `max-height` properties of the `.scroll-accordion` class.