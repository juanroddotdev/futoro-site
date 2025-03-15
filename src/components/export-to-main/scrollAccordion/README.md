# Scroll Accordion Component

A vanilla JavaScript implementation of a scroll-based accordion animation. As users scroll down the page, accordion items collapse sequentially, creating an engaging interactive experience.

## Features

- Pure JavaScript implementation without external animation libraries
- Smooth, scroll-based animations
- Responsive design that works on all devices
- Customizable styling and behavior
- Efficient performance with minimal DOM operations

## Files

- `ScrollAccordionVanilla.vue`: The main component
- `integration-guide.md`: Step-by-step instructions for adding to your project
- `usage-example.vue`: A complete example showing how to use the component

## Dependencies

This component relies on the scroll utilities in your project:
- `src/utils/scrollAccordion.ts`
- `src/utils/scroll/scrollUtils.ts`

## How to Use

See the `integration-guide.md` for detailed instructions on adding this component to your project.

Basic usage:

```vue
<template>
  <ScrollAccordionVanilla :items="accordionItems" />
</template>

<script setup>
import { ref } from 'vue';
import ScrollAccordionVanilla from '@/components/ui/ScrollAccordionVanilla.vue';

const accordionItems = ref([
  { id: 1, title: 'Title 1', description: 'Description 1' },
  { id: 2, title: 'Title 2', description: 'Description 2' },
  // Add more items as needed
]);
</script>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| items | Array<AccordionItem> | Yes | Array of accordion items to display |

Where `AccordionItem` has the following structure:
```ts
interface AccordionItem {
  id: number;
  title: string;
  description: string;
}
```