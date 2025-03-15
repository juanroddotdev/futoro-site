# Horizontal Scroll Component Guide

## Basic Implementation

```vue
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ScrollTracker } from '@/utils/scroll/core/ScrollTracker';

const sectionRef = ref(null);
const containerRef = ref(null);
const wrapperRef = ref(null);
let tracker = null;
let isFixed = ref(false);
let progress = ref(0);
let transformStyle = ref('');

onMounted(() => {
  setupScrollTracking();
});

onBeforeUnmount(() => {
  if (tracker) tracker.destroy();
});

function setupScrollTracking() {
  tracker = new ScrollTracker({ throttleMs: 16 });
  
  tracker.trackElement(sectionRef.value, {
    updateCallback: (position) => {
      progress.value = position.progress;
      isFixed.value = position.progress > 0.05 && position.progress < 0.95;
      
      // Calculate transform based on progress
      const translateX = -1 * progress.value * (wrapperRef.value.offsetWidth - window.innerWidth + 100);
      transformStyle.value = `translateX(${translateX}px)`;
    }
  });
}
</script>

<template>
  <section ref="sectionRef" class="horizontal-scroll">
    <div class="container">
      <div ref="containerRef" class="row-container" :class="{ 'is-fixed': isFixed }">
        <h2 class="section-title">Your Section Title</h2>
        
        <div class="rows-wrapper">
          <div class="row">
            <div ref="wrapperRef" class="animation-wrap to-right" :style="{ transform: transformStyle }">
              <!-- Title card -->
              <div class="item title-card">
                <h3>Title Card</h3>
              </div>
              
              <!-- Content cards -->
              <div v-for="(item, index) in items" :key="index" class="item content-card">
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
```

## Direction Options

The component supports two scroll directions:
- **Normal (right-to-left)**: Content moves from right to left as user scrolls down
- **Reverse (left-to-right)**: Content moves from left to right as user scrolls down

To use reverse direction:
1. Add the `reverse` class to the main container
2. Use `to-left` instead of `to-right` on the animation wrapper

## Performance Tips

1. Use RAF throttling for smooth animations:
```javascript
import { rafThrottle } from '@/utils/scroll/utils/performance';

// In your scroll handler:
const updateTransform = rafThrottle(() => {
  const translateX = calculateTranslation();
  transformStyle.value = `translateX(${translateX}px)`;
});
```

2. Optimize DOM updates by using CSS variables:
```javascript
// Set a CSS variable instead of inline styles
document.documentElement.style.setProperty('--scroll-progress', progress);
```

3. Use the VisualizationPlugin for debugging:
```javascript
import { VisualizationPlugin } from '@/utils/scroll/plugins/VisualizationPlugin';

const visualPlugin = new VisualizationPlugin({
  showMarkers: true,
  showScrollPosition: true
});

tracker.registerPlugin(visualPlugin);
```

## Troubleshooting

- **Content not appearing**: Ensure your content has sufficient width
- **Jerky animations**: Lower the throttle time or use rafThrottle
- **Section height issues**: Check the CSS variable `--horizontal-scroll-height`
```

## Storage Options

1. **Project Documentation**: Create a dedicated documentation folder in your project:
   ```
   /docs/components/horizontal-scroll-guide.md
   ```

2. **Component Comments**: Add detailed JSDoc comments at the top of your component files

3. **README Section**: Add a section to your project README.md with component usage instructions

4. **Storybook**: If you use Storybook, add documentation in the component stories

5. **Wiki**: If your project has a wiki or knowledge base, add it there

I recommend using a combination of these approaches to ensure the documentation is accessible and won't be lost.