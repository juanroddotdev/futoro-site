# Component Debugger Utility Guide

This guide explains how to use the `ComponentDebugger` utility to debug scroll-based animations and component behavior in your Vue application.

## Overview

The `ComponentDebugger` utility provides a structured way to debug components without cluttering your main component code. It helps track:

- Element visibility in the viewport
- Style and attribute changes
- Animation events and timelines
- Component props and state changes
- Custom events and logs

## Setup Instructions

### 1. Create a Debug File

For each component you want to debug, create a separate debug file. This keeps debugging logic isolated from your component code.

```typescript
// src/debug/YourComponentDebug.ts
import { watch } from 'vue';
import { createComponentDebugger } from '@/utils/scroll/debug/ComponentDebugger';

export function useYourComponentDebug(component: any, props: any) {
  // Create the debugger
  const componentDebugger = createComponentDebugger({
    componentName: 'YourComponent',
    sectionId: `your-component-${props.id || 'main'}`,
    enabled: true,
    observeElements: {
      'container': {
        ref: component.containerRef,
        threshold: 0.1,
        trackStyles: true
      },
      'header': {
        ref: component.headerRef,
        trackAttributes: ['class', 'data-state']
      }
    },
    trackAnimations: true,
    trackProps: true,
    props
  });
  
  // Initialize on component mount
  const init = () => {
    componentDebugger.init();
    
    // Watch for visibility changes
    watch(() => componentDebugger.visibilityState, (state) => {
      if (state && state.container) {
        componentDebugger.log('Container is now visible');
      }
    });
  };
  
  return {
    init,
    log: componentDebugger.log,
    error: componentDebugger.error,
    trackAnimation: (status: string, details?: any) => {
      componentDebugger.trackAnimation('main', status, details);
    },
    cleanup: componentDebugger.cleanup
  };
}
```

### 2. Import and Use in Your Component

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useYourComponentDebug } from '@/debug/YourComponentDebug';

// Component refs
const containerRef = ref(null);
const headerRef = ref(null);
const animationStarted = ref(false);

// Props
const props = defineProps({
  id: String,
  title: String,
  initiallyHidden: Boolean
});

// Component methods
const startAnimations = () => {
  animationStarted.value = true;
  debug.trackAnimation('started', { timestamp: Date.now() });
  // Your animation logic here
};

// Create component object to pass to debugger
const component = {
  containerRef,
  headerRef,
  animationStarted,
  startAnimations
};

// Initialize debugger
const debug = useYourComponentDebug(component, props);

onMounted(() => {
  debug.init();
  debug.log('Component mounted');
});

onUnmounted(() => {
  debug.cleanup();
});
</script>

<template>
  <div ref="containerRef" class="your-component">
    <h2 ref="headerRef" class="header">{{ title }}</h2>
    <button @click="startAnimations">Start Animation</button>
    <!-- Rest of your component -->
  </div>
</template>
```

## Configuration Options

The `createComponentDebugger` function accepts these configuration options:

| Option | Type | Description |
|--------|------|-------------|
| `componentName` | String | Name of your component for logs |
| `sectionId` | String | Unique ID for the section containing your component |
| `enabled` | Boolean | Toggle debugging on/off |
| `observeElements` | Object | Elements to track with IntersectionObserver and MutationObserver |
| `trackAnimations` | Boolean | Whether to track animation events |
| `trackProps` | Boolean | Whether to log component props |
| `props` | Object | Component props to log |

### observeElements Configuration

For each element you want to observe:

```typescript
'elementName': {
  ref: component.elementRef, // Vue ref to the element
  threshold: 0.3, // Visibility threshold (0-1)
  trackStyles: true, // Whether to track style changes
  trackAttributes: ['class', 'data-state'] // Specific attributes to monitor
}
```

## Debugging Features

### 1. Element Visibility Tracking

The debugger uses IntersectionObserver to track when elements enter or exit the viewport:

```typescript
watch(() => componentDebugger.visibilityState, (state) => {
  if (state && state.container) {
    componentDebugger.log('Container is now visible');
    // Trigger animations when element becomes visible
    if (!component.animationStarted.value) {
      component.startAnimations();
    }
  }
}, { deep: true });
```

### 2. Animation Tracking

Track animation states throughout their lifecycle:

```typescript
// In your component
const startAnimations = () => {
  debug.trackAnimation('triggered');
  
  gsap.to(element, {
    opacity: 1,
    duration: 0.5,
    onStart: () => debug.trackAnimation('started'),
    onComplete: () => debug.trackAnimation('completed')
  });
};
```

### 3. Style and Attribute Changes

Monitor when styles or attributes change on specific elements:

```typescript
'header': {
  ref: component.headerRef,
  trackStyles: true, // Log all style changes
  trackAttributes: ['class', 'aria-expanded'] // Only track these attributes
}
```

### 4. Custom Logging

Add custom logs for specific events:

```typescript
// In your component
const handleClick = () => {
  debug.log('Button clicked', { timestamp: Date.now() });
  // Handle click logic
};
```

## Practical Example: Debugging a Scroll Animation

Here's a complete example of debugging a scroll-triggered animation:

```vue
<!-- ScrollRevealSection.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useScrollRevealDebug } from '@/debug/ScrollRevealDebug';
import gsap from 'gsap';

const sectionRef = ref(null);
const titleRef = ref(null);
const itemsRef = ref([]);
const animationStarted = ref(false);

const props = defineProps({
  id: {
    type: String,
    default: 'reveal-section'
  },
  title: String,
  items: Array
});

// Animation logic
const startAnimations = () => {
  if (animationStarted.value) return;
  
  debug.trackAnimation('triggered', { itemCount: props.items.length });
  
  // Start animation with GSAP
  const timeline = gsap.timeline();
  
  timeline.to(titleRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    onStart: () => debug.trackAnimation('title-started'),
    onComplete: () => debug.trackAnimation('title-completed')
  });
  
  itemsRef.value.forEach((item, index) => {
    timeline.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      delay: 0.1 * index,
      onStart: () => debug.trackAnimation(`item-${index}-started`),
      onComplete: () => debug.trackAnimation(`item-${index}-completed`)
    }, "-=0.2");
  });
  
  animationStarted.value = true;
  debug.trackAnimation('started');
  
  timeline.then(() => {
    debug.trackAnimation('completed');
  });
};

// Create component object to pass to debugger
const component = {
  sectionRef,
  titleRef,
  itemsRef,
  animationStarted,
  startAnimations
};

// Initialize debugger
const debug = useScrollRevealDebug(component, props);

onMounted(() => {
  debug.init();
});

onUnmounted(() => {
  debug.cleanup();
});
</script>

<template>
  <section ref="sectionRef" class="scroll-reveal-section">
    <h2 ref="titleRef" class="title opacity-0 transform translate-y-8">
      {{ title }}
    </h2>
    <div class="items-grid">
      <div 
        v-for="(item, index) in items" 
        :key="index"
        :ref="el => { if (el) itemsRef[index] = el }"
        class="item opacity-0 transform translate-y-12"
      >
        {{ item.text }}
      </div>
    </div>
  </section>
</template>
```

```typescript
// src/debug/ScrollRevealDebug.ts
import { watch } from 'vue';
import { createComponentDebugger } from '@/utils/scroll/debug/ComponentDebugger';

export function useScrollRevealDebug(component: any, props: any) {
  const componentDebugger = createComponentDebugger({
    componentName: 'ScrollRevealSection',
    sectionId: `reveal-${props.id}`,
    enabled: true,
    observeElements: {
      'section': {
        ref: component.sectionRef,
        threshold: 0.3,
        trackStyles: true
      },
      'title': {
        ref: component.titleRef,
        trackStyles: true,
        trackAttributes: ['class']
      }
    },
    trackAnimations: true,
    trackProps: true,
    props
  });
  
  const init = () => {
    componentDebugger.init();
    
    // Start animations when section becomes visible
    watch(() => componentDebugger.visibilityState, (state) => {
      if (state && state.section && !component.animationStarted.value) {
        componentDebugger.log('Section is now visible, starting animations');
        component.startAnimations();
      }
    }, { deep: true });
  };
  
  return {
    init,
    log: componentDebugger.log,
    error: componentDebugger.error,
    trackAnimation: componentDebugger.trackAnimation,
    cleanup: componentDebugger.cleanup
  };
}
```

## Console Output

When running this code, you'll see detailed logs in your console:

```
🔍 ScrollDebugger [+0.5s] ℹ️🧠 Component initialized (ScrollRevealSection)
🔍 ScrollDebugger [+0.6s] ℹ️🧠 Props (ScrollRevealSection)
🔍 ScrollDebugger [+1.2s] 👁️✨ Element section is visible (ScrollRevealSection)
🔍 ScrollDebugger [+1.2s] ℹ️🧠 Section is now visible, starting animations (ScrollRevealSection)
🔍 ScrollDebugger [+1.2s] ℹ️🧠 Animation main: triggered (ScrollRevealSection)
🔍 ScrollDebugger [+1.3s] ℹ️🧠 Animation main: started (ScrollRevealSection)
🔍 ScrollDebugger [+1.3s] ℹ️🧠 Animation main: title-started (ScrollRevealSection)
🔍 ScrollDebugger [+1.9s] ℹ️🧠 Animation main: title-completed (ScrollRevealSection)
🔍 ScrollDebugger [+1.9s] ℹ️🧠 Animation main: item-0-started (ScrollRevealSection)
🔍 ScrollDebugger [+2.3s] ℹ️🧠 Animation main: item-0-completed (ScrollRevealSection)
```

## Best Practices

1. **Keep Debug Files Separate**: Always create separate debug files to keep your component code clean
2. **Disable in Production**: Set `enabled: false` or conditionally import debug files only in development
3. **Use Meaningful Names**: Use descriptive names for elements and animation states
4. **Clean Up**: Always call `cleanup()` in `onUnmounted()` to prevent memory leaks
5. **Be Selective**: Only track elements and attributes that are relevant to your debugging needs

### Using Debug Configuration Objects

To better separate debug logic from component logic, use a dedicated debug configuration object:

```typescript
// In your component file
import { ref } from 'vue';
import { useYourComponentDebug } from '@/debug/YourComponentDebug';

// Component refs and state
const containerRef = ref(null);
const headerRef = ref(null);
const animationStarted = ref(false);

// Component methods
const startAnimations = () => {
  animationStarted.value = true;
  // Your animation logic here
};

// Create a dedicated debug configuration object
const debugConfig = {
  // Component references needed for debugging
  refs: {
    containerRef,
    headerRef
  },
  // Component state needed for debugging
  state: {
    animationStarted
  },
  // Component methods needed for debugging
  methods: {
    startAnimations
  },
  // Props to track
  props: props,
  // Optional configuration
  options: {
    enabled: import.meta.env.DEV, // Only enable in development
    trackStyles: true
  }
};

// Initialize debugger with the configuration object
const debug = useYourComponentDebug(debugConfig);

// Use debug utilities in your component
onMounted(() => {
  debug.init();
  debug.log('Component mounted');
});
```

This approach clearly separates debug configuration from component logic, making it easier to identify what's used for debugging versus core component functionality.

## Troubleshooting

### No Visibility Events

If you're not seeing visibility events:
- Check that your element refs are correctly passed to the debugger
- Verify the threshold value (0.1 is more sensitive than 0.5)
- Ensure the element is actually entering/exiting the viewport

### Animation Events Not Logging

If animation events aren't being logged:
- Verify you're calling `trackAnimation()` with the correct parameters
- Check that `trackAnimations: true` is set in the configuration
- Ensure the animation is actually running (check for errors in your animation code)

## Integration with Other Tools

The ComponentDebugger works well with other debugging tools:

- **Vue DevTools**: Use alongside Vue DevTools for a complete debugging experience
- **Browser DevTools**: Console logs are formatted for easy filtering in browser DevTools
- **Performance Panel**: Use the timestamps in logs to correlate with browser performance recordings

## Conclusion

The ComponentDebugger utility provides a powerful way to debug complex components, especially those with scroll-based animations. By keeping debugging code separate from component logic, you can maintain clean, production-ready code while still having robust debugging capabilities during development.
