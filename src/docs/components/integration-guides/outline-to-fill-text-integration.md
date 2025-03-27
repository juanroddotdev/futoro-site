# OutlineToFillText Component Integration Guide

## Overview

The `OutlineToFillText` component provides a specialized text animation that transitions from an outlined text to a gradient-filled text. It's designed to create an engaging visual effect with minimal configuration.

## Usage

```vue
<template>
  <OutlineToFillText 
    text="Amazing Text" 
    :duration="2" 
    :delay="0.5"
    :triggerOnVisible="true"
  />
</template>

<script setup>
import OutlineToFillText from '@/components/text/OutlineToFillText.vue';
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| text | String | required | The text to animate |
| duration | Number | 1.5 | Animation duration in seconds |
| delay | Number | 0 | Delay before animation starts |
| ease | String | 'power2.inOut' | GSAP easing function |
| triggerOnVisible | Boolean | false | Only animate when element enters viewport |
| initiallyHidden | Boolean | true | Whether element is initially hidden |

## Events

| Event | Description |
|-------|-------------|
| animation-complete | Emitted when the animation completes |

## Example

```vue
<template>
  <div class="hero-section">
    <OutlineToFillText 
      text="Transform Your Digital Experience" 
      :duration="2"
      :triggerOnVisible="true"
    />
  </div>
</template>
```