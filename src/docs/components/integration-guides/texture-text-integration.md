# Texture Text Component Integration Guide

## Overview

The `TextureText` component creates a 3D animated text effect with a noisy texture and shimmer animation. It's perfect for eye-catching headers or feature highlights.

## Files to Copy

1. Copy `TextureText.vue` to `src/components/ui/TextureText.vue`

## Dependencies

This component has no external dependencies - it uses pure CSS for all animations and effects.

## Basic Usage

```vue
<template>
  <TextureText text="Hello World" />
</template>

<script setup>
import TextureText from '@/components/ui/TextureText.vue';
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| text | String | 'Texture' | The text to display with the texture effect |

## Customization

You can customize the appearance by modifying the component's scoped CSS:

- Change the gradient colors in the `.noise` background property
- Adjust animation timing in the `animation-duration` properties
- Modify the 3D rotation by changing the `rotate3d` values
- Change the overlay color to affect the final color blend

## Browser Compatibility

This effect works best in Safari due to differences in how browsers handle `mix-blend-mode`. A special adjustment is included for Chrome to improve compatibility.

## Example Integration

```vue
<template>
  <div class="hero-section">
    <TextureText :text="heroTitle" />
    <p class="subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TextureText from '@/components/ui/TextureText.vue';

const heroTitle = ref('Amazing');
const subtitle = ref('Create stunning visual effects with simple components');
</script>
```