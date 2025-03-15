# 3D Card Component Integration Guide

This guide explains how to integrate the 3D interactive card components into your project.

## Files to Copy

1. Copy `Card3D.vue` to `src/components/ui/cards/Card3D.vue`
2. Copy `Card3DShowcase.vue` to `src/components/sections/Card3DShowcase.vue`
3. Copy `card3DAnimations.ts` to `src/animations/card3DAnimations.ts`

## Dependencies

This component relies on:
- GSAP (GreenSock Animation Platform) and ScrollTrigger plugin
- Your theme system's SCSS variables

## Basic Usage

### Individual Card

```vue
<template>
  <Card3D
    current-theme="neon-horizon"
    title="Web Development"
    subtitle="Modern, responsive websites"
    image-url="/path/to/image.jpg"
    link-url="#services"
    link-text="Learn More"
  />
</template>

<script setup>
import Card3D from '@/components/ui/cards/Card3D.vue';
</script>
```

### Card Showcase Section

```vue
<template>
  <Card3DShowcase :current-theme="currentTheme" />
</template>

<script setup>
import Card3DShowcase from '@/components/sections/Card3DShowcase.vue';
import { ref } from 'vue';

const currentTheme = ref('neon-horizon');
</script>
```

## Props

### Card3D Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | String | 'Card Title' | Card title text |
| subtitle | String | 'Card Subtitle' | Card subtitle/description |
| imageUrl | String | '' | URL for the card background image |
| linkUrl | String | undefined | URL for the card's call-to-action link |
| linkText | String | 'Learn More' | Text for the call-to-action button |
| currentTheme | String | undefined | Current theme name for styling |

### Card3DShowcase Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| currentTheme | String | required | Current theme name for styling |

## Customization

You can customize the cards by modifying the SCSS in the component files. The cards automatically adapt to your theme system if you're using the `$themes` map in your SCSS.

## Animation

The cards feature:
1. Scroll-triggered entrance animations
2. Mouse-follow 3D rotation effect
3. Hover animations for images and content

These animations are handled by the `card3DAnimations.ts` utility.