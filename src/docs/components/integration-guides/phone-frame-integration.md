# Phone Frame Component Integration Guide

## Overview

The `PhoneFrame` component provides a customizable SVG phone frame that can be used to showcase mobile app interfaces, chat conversations, or other mobile content. It supports various styling options and can be animated with 3D effects.

## Files to Copy

1. Copy `PhoneFrame.vue` to `src/components/ui/PhoneFrame.vue`

## Dependencies

This component has no external dependencies beyond Vue itself.

## Basic Usage

```vue
<template>
  <div class="phone-container">
    <PhoneFrame />
    <!-- Your content goes here -->
    <div class="phone-content">
      <h1>App Content</h1>
      <p>This will appear inside the phone frame</p>
    </div>
  </div>
</template>

<script setup>
import PhoneFrame from '@/components/ui/PhoneFrame.vue';
</script>

<style scoped>
.phone-container {
  position: relative;
  width: 320px;
  height: 650px;
}

.phone-content {
  position: absolute;
  top: 50px;
  left: 20px;
  width: 280px;
  height: 550px;
  z-index: 2;
  overflow-y: auto;
  padding: 20px;
}
</style>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| shellGradientStart | String | '#2a2a2a' | Start color for phone shell gradient |
| shellGradientEnd | String | '#1a1a1a' | End color for phone shell gradient |
| screenGradientStart | String | '#ffffff' | Start color for phone screen gradient |
| screenGradientEnd | String | '#f5f5f7' | End color for phone screen gradient |
| showCamera | Boolean | true | Whether to show the camera element |
| showSpeaker | Boolean | true | Whether to show the speaker element |
| showHomeButton | Boolean | true | Whether to show the home button |
| tiltDirection | String | 'none' | 3D tilt effect direction ('left', 'right', or 'none') |

## Styling Examples

### Default Dark Phone

```vue
<PhoneFrame />
```

### White/Light Phone with Right Tilt

```vue
<PhoneFrame 
  shellGradientStart="#f0f0f0" 
  shellGradientEnd="#e0e0e0" 
  screenGradientStart="#ffffff" 
  screenGradientEnd="#f8f8f8"
  tiltDirection="right"
/>
```

### Minimal Phone with Left Tilt

```vue
<PhoneFrame 
  :showCamera="false"
  :showHomeButton="false"
  tiltDirection="left"
/>
```

### Colorful Phone

```vue
<PhoneFrame 
  shellGradientStart="#3498db" 
  shellGradientEnd="#2980b9" 
  screenGradientStart="#ecf0f1" 
  screenGradientEnd="#bdc3c7" 
/>
```

## 3D Tilt Effect

You can add a 3D tilt effect to the phone by wrapping it in a container with perspective and applying transforms:

```vue
<template>
  <div class="phone-container" :class="`tilt-${tiltDirection}`">
    <PhoneFrame />
    <div class="phone-content">
      <!-- Your content here -->
    </div>
  </div>
</template>

<script setup>
import PhoneFrame from '@/components/ui/PhoneFrame.vue';

// Add prop for tilt direction
const props = defineProps({
  tiltDirection: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right', 'none'].includes(value)
  }
});
</script>

<style scoped>
.phone-container {
  position: relative;
  width: 320px;
  height: 650px;
  margin: 0 auto;
  perspective: 1000px;
}

.phone-content {
  position: absolute;
  top: 50px;
  left: 20px;
  width: 280px;
  height: 550px;
  z-index: 2;
  overflow-y: auto;
  padding: 20px;
  transform-style: preserve-3d;
  transform-origin: center center;
  transition: transform 0.5s ease;
}

/* Tilt variations */
.tilt-left .phone-frame,
.tilt-left .phone-content {
  transform: rotateY(-10deg) rotateX(5deg) rotateZ(-2deg);
}

.tilt-right .phone-frame,
.tilt-right .phone-content {
  transform: rotateY(10deg) rotateX(5deg) rotateZ(2deg);
}

.tilt-none .phone-frame,
.tilt-none .phone-content {
  transform: rotateY(0deg) rotateX(0deg) rotateZ(0deg);
}

/* Hover effects */
.tilt-left .phone-frame:hover,
.tilt-left .phone-content:hover {
  transform: rotateY(-8deg) rotateX(3deg) rotateZ(-1deg);
}

.tilt-right .phone-frame:hover,
.tilt-right .phone-content:hover {
  transform: rotateY(8deg) rotateX(3deg) rotateZ(1deg);
}
</style>
```

## Example: Chat Interface in Phone

```vue
<template>
  <div class="phone-container">
    <PhoneFrame 
      shellGradientStart="#34495e" 
      shellGradientEnd="#2c3e50" 
    />
    <div class="chat-content">
      <div class="chat-header">
        <h3>Chat App</h3>
      </div>
      <div class="messages">
        <div class="message received">
          <p>Hey there! How's it going?</p>
          <span class="time">10:30 AM</span>
        </div>
        <div class="message sent">
          <p>Pretty good! Working on a new project.</p>
          <span class="time">10:32 AM</span>
        </div>
        <div class="message received">
          <p>That sounds exciting! Tell me more about it.</p>
          <span class="time">10:33 AM</span>
        </div>
      </div>
      <div class="chat-input">
        <input type="text" placeholder="Type a message..." />
        <button>Send</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import PhoneFrame from '@/components/ui/PhoneFrame.vue';
</script>

<style scoped>
.phone-container {
  position: relative;
  width: 320px;
  height: 650px;
  margin: 0 auto;
}

.chat-content {
  position: absolute;
  top: 50px;
  left: 20px;
  width: 280px;
  height: 550px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f7;
}

.chat-header {
  padding: 15px;
  background-color: #3498db;
  color: white;
  text-align: center;
}

.messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  max-width: 70%;
  padding: 10px;
  border-radius: 10px;
}

.message p {
  margin: 0;
}

.time {
  font-size: 0.7rem;
  opacity: 0.7;
  display: block;
  text-align: right;
  margin-top: 5px;
}

.received {
  align-self: flex-start;
  background-color: #e5e5ea;
}

.sent {
  align-self: flex-end;
  background-color: #3498db;
  color: white;
}

.chat-input {
  padding: 10px;
  display: flex;
  gap: 10px;
  background-color: white;
  border-top: 1px solid #e5e5ea;
}

.chat-input input {
  flex: 1;
  padding: 8px;
  border-radius: 20px;
  border: 1px solid #e5e5ea;
}

.chat-input button {
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 15px;
  cursor: pointer;
}
</style>
```

## Performance Considerations

- The SVG is relatively lightweight but consider using a simpler version for performance-critical applications
- When animating the phone, use CSS transforms rather than changing dimensions for better performance
- For complex content inside the phone, consider using virtual scrolling or pagination to improve performance

## Accessibility

- Add appropriate ARIA attributes to the SVG for screen readers
- Ensure sufficient color contrast for any text displayed inside the phone
- Consider adding keyboard navigation support for interactive elements inside the phone
