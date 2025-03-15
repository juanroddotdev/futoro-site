# Grid Paper Overlay Component Integration Guide

## Files to Copy

1. Copy `GridPaperOverlay.vue` to `src/components/ui/backgrounds/GridPaperOverlay.vue`
2. Ensure the grid-paper-background mixin is available in your SCSS mixins

## Dependencies

This component relies on:
- SCSS variables and mixins from your theme system
- The grid-paper-background mixin

## Usage

```vue
<template>
  <GridPaperOverlay 
    theme="neon-horizon" 
    :floating="true" 
    :spotlight="true"
  >
    <div class="your-content">
      <h1>Your Content Here</h1>
      <p>This content will appear above the grid background</p>
    </div>
  </GridPaperOverlay>
</template>

<script setup>
import GridPaperOverlay from '@/components/ui/backgrounds/GridPaperOverlay.vue';
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| theme | String | undefined | Theme name to apply (e.g., 'neon-horizon') |
| floating | Boolean | false | Enable floating animation of grid |
| spotlight | Boolean | false | Enable spotlight effect on grid |
| spotlightPosition | String | '20% 20%' | Position of spotlight (format: 'x% y%') |

## Example: Using in a Hero Section

```vue
<template>
  <GridPaperOverlay 
    :theme="currentTheme" 
    :floating="true" 
    :spotlight="true"
  >
    <section class="hero-section">
      <div class="container">
        <h1 class="heading">Welcome to our site</h1>
        <p class="subheading">Discover amazing features</p>
      </div>
    </section>
  </GridPaperOverlay>
</template>
```

## Required SCSS Mixin

Ensure this mixin is available in your project:

```scss
@mixin grid-paper-background(
  $line-color: rgba(255, 255, 255, 0.1),
  $line-size: 1px,
  $cell-size: 40px
) {
  background-image: 
    linear-gradient(to right, $line-color $line-size, transparent $line-size),
    linear-gradient(to bottom, $line-color $line-size, transparent $line-size);
  background-size: $cell-size $cell-size;
  background-position: center center;
}
```