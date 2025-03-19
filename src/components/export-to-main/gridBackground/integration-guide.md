# Grid Paper Overlay Component Integration Guide

## Files to Copy

1. Copy `GridPaperOverlay.vue` to `src/components/ui/backgrounds/GridPaperOverlay.vue`
2. Ensure the grid-paper-background mixin is available in your SCSS mixins

## Dependencies

This component relies on:
- SCSS variables and mixins from your theme system
- The grid-paper-background mixin and other pattern mixins

## Usage

```vue
<template>
  <GridPaperOverlay 
    theme="neon-horizon" 
    pattern="grid"
    :floating="true" 
    :spotlight="true"
    spotlightCorner="top-left"
    spotlightSize="medium"
    intensity="medium"
    :fade="true"
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
| pattern | String | 'grid' | Background pattern type ('grid', 'dots', 'diagonal-lines', 'diamonds', 'hexagons', 'checkerboard', 'stripes', 'circuit', 'blueprint') |
| floating | Boolean | false | Enable floating animation of pattern |
| spotlight | Boolean | false | Enable spotlight effect on pattern |
| spotlightCorner | String | 'top-left' | Position of spotlight ('top-left', 'top-right', 'bottom-left', 'bottom-right') |
| spotlightSize | String | 'medium' | Size of spotlight effect ('small', 'medium', 'large') |
| intensity | String | 'medium' | Opacity intensity of pattern ('low', 'medium', 'high') |
| fade | Boolean | false | Enable pulsing opacity animation |

## Available Patterns

The component supports multiple background patterns:

- `grid`: Classic graph paper style grid (default)
- `dots`: Evenly spaced dots pattern
- `diagonal-lines`: Diagonal lines pattern
- `diamonds`: Diamond grid pattern
- `hexagons`: Honeycomb/hexagonal pattern
- `checkerboard`: Classic checkerboard pattern
- `stripes`: Horizontal stripes pattern
- `circuit`: Circuit board style pattern
- `blueprint`: Engineering blueprint style pattern

## Example: Using Different Patterns

```vue
<template>
  <GridPaperOverlay 
    theme="digital-sunset" 
    pattern="dots"
    :floating="true"
  >
    <section class="dots-section">
      <h2>Dots Pattern Example</h2>
    </section>
  </GridPaperOverlay>
  
  <GridPaperOverlay 
    theme="retro-wave" 
    pattern="circuit"
    :spotlight="true"
    spotlightCorner="bottom-right"
  >
    <section class="circuit-section">
      <h2>Circuit Pattern Example</h2>
    </section>
  </GridPaperOverlay>
</template>
```

## Theme Integration

The component automatically adapts to your theme system if you're using a `$themes` map in your SCSS. Different themes will apply appropriate styling to the patterns.

## Required SCSS Mixins

Ensure these mixins are available in your project:

```scss
@mixin grid-pattern(
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

// Additional pattern mixins should be defined in your background-patterns file
```
