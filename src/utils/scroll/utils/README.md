# ScrollTracker

A flexible, extensible scroll tracking utility for web applications.

## Features

- Track scroll position and direction
- Monitor element visibility and position
- Calculate scroll progress
- Trigger events based on scroll position
- Visualize scroll animations (optional)
- Framework-agnostic core with Vue integration

## Installation

Currently used as part of this project. To use in other projects:

```bash
# Future npm package (not yet published)
npm install @your-username/scroll-tracker
# or
yarn add @your-username/scroll-tracker
```

## Basic Usage

### Vanilla JavaScript

```javascript
import { ScrollTracker } from './utils/scroll/core/ScrollTracker';

// Create a tracker instance
const tracker = new ScrollTracker({
  debug: true,
  throttleMs: 100
});

// Track an element
const element = document.querySelector('.my-element');
tracker.trackElement(element, {
  updateCallback: (position) => {
    console.log('Element position:', position);
    
    // Do something based on position
    if (position.inView && position.progress > 0.5) {
      element.classList.add('active');
    } else {
      element.classList.remove('active');
    }
  }
});

// Get current scroll position
const scrollPosition = tracker.getScrollPosition();
console.log('Current scroll:', scrollPosition);

// Clean up when done
tracker.untrackElement(element);
tracker.destroy();
```

## Common Patterns and Best Practices

### Performance Optimization

For best performance, especially on mobile devices:

1. **Use throttling**: The default 100ms throttle is a good balance, but adjust based on your needs.
   ```javascript
   const tracker = new ScrollTracker({ throttleMs: 150 }); // Less frequent updates for better performance
   ```

2. **Limit tracked elements**: Only track elements that need scroll-based behavior.

3. **Clean up properly**: Always call `untrackElement()` when elements are removed from DOM and `destroy()` when the tracker is no longer needed.

4. **Use efficient CSS properties**: When animating, prefer `transform` and `opacity` which don't trigger layout recalculations.
   ```javascript
   // Good (uses GPU acceleration)
   element.style.transform = `translateY(${progress * 50}px)`;
   element.style.opacity = progress.toString();
   
   // Avoid (triggers layout recalculation)
   element.style.top = `${progress * 50}px`;
   element.style.height = `${100 + progress * 50}px`;
   ```

5. **Use performance utilities**: The package includes performance utilities for manual optimization:
   ```javascript
   import { throttle, debounce, rafThrottle } from './utils/scroll/utils/performance';
   
   // Throttle: Limit execution frequency (calls at regular intervals)
   window.addEventListener('scroll', throttle(() => {
     // Update animations
   }, 100));
   
   // Debounce: Wait for inactivity (calls once after waiting)
   window.addEventListener('resize', debounce(() => {
     // Recalculate boundaries
   }, 200));
   
   // RAF Throttle: Sync with browser's animation frame (smoothest option)
   window.addEventListener('scroll', rafThrottle(() => {
     // Smooth parallax effect
     element.style.transform = `translateY(${window.scrollY * 0.1}px)`;
   }));
   ```

### Debugging Scroll Animations

The VisualizationPlugin is invaluable for debugging:

```javascript
import { VisualizationPlugin } from './utils/scroll/plugins/VisualizationPlugin';

const visualPlugin = new VisualizationPlugin({
  showMarkers: true,
  markerPosition: 'right',
  showScrollPosition: true,
  showElementBoundaries: true
});

const tracker = new ScrollTracker({
  plugins: [visualPlugin],
  debug: true
});

// Toggle visualization in dev tools
window.toggleScrollVisualization = (show) => {
  visualPlugin.setVisible(show);
};
```

### Creating Scroll-Triggered Animations

#### Fade-in elements as they enter viewport:

```javascript
document.querySelectorAll('.fade-in-element').forEach(element => {
  // Initially hide elements
  element.style.opacity = '0';
  element.style.transform = 'translateY(20px)';
  element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  
  tracker.trackElement(element, {
    updateCallback: (position) => {
      if (position.inView && position.progress > 0.15) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    }
  });
});
```

#### Parallax scrolling effect:

```javascript
const parallaxElements = document.querySelectorAll('.parallax-element');
parallaxElements.forEach(element => {
  const speed = element.dataset.parallaxSpeed || 0.5;
  
  tracker.trackElement(element, {
    updateCallback: (position) => {
      if (position.inView) {
        // Move element at different speed than scroll
        const yOffset = (position.viewportProgress - 0.5) * speed * 100;
        element.style.transform = `translateY(${yOffset}px)`;
      }
    }
  });
});
```

#### Sequential animations (staggered reveal):

```javascript
const stepsContainer = document.querySelector('.steps-container');
const steps = document.querySelectorAll('.step');

tracker.trackElement(stepsContainer, {
  updateCallback: (position) => {
    steps.forEach((step, index) => {
      // Calculate individual progress for each step
      const stepProgress = tracker.calculateSegmentProgress(
        position.progress,
        index,
        steps.length
      );
      
      // Apply staggered animation
      step.style.opacity = stepProgress.toString();
      step.style.transform = `translateX(${(1 - stepProgress) * 50}px)`;
    });
  }
});
```

### Integration with Animation Libraries

#### With GSAP:

```javascript
import { gsap } from 'gsap';

const section = document.querySelector('.animated-section');
const timeline = gsap.timeline({ paused: true });

// Setup your GSAP animation
timeline.to('.target-element', { opacity: 1, y: 0, duration: 1 })
        .to('.next-element', { scale: 1, duration: 0.5 }, "-=0.5");

// Control animation progress with ScrollTracker
tracker.trackElement(section, {
  updateCallback: (position) => {
    // Update timeline progress based on scroll
    timeline.progress(position.progress);
  }
});
```

#### With CSS Variables:

```javascript
const animatedSection = document.querySelector('.animated-section');

tracker.trackElement(animatedSection, {
  updateCallback: (position) => {
    // Update CSS variable that can be used in multiple CSS rules
    animatedSection.style.setProperty('--scroll-progress', position.progress);
  }
});

// In your CSS:
// .animated-section {
//   --scroll-progress: 0;
// }
// .animated-section .element {
//   opacity: calc(var(--scroll-progress) * 1);
//   transform: translateY(calc((1 - var(--scroll-progress)) * 50px));
// }
```

### Advanced: Custom Boundary Calculations

For more control over when animations start and end:

```javascript
const section = document.querySelector('.custom-section');
const { startPosition, endPosition } = tracker.calculateElementBoundaries(
  section,
  {
    // Start when 20% of viewport is above the element
    topOffset: 0.2,
    // End when element is 150% of its height from the top
    heightMultiplier: 1.5,
    // Add 10% of viewport height to the end position
    bottomOffset: 0.1
  }
);

// Now manually track scroll position relative to these boundaries
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const progress = Math.max(0, Math.min(1, 
    (scrollY - startPosition) / (endPosition - startPosition)
  ));
  
  // Apply animations based on custom progress
  section.style.setProperty('--custom-progress', progress);
});
```

## Framework Integration

ScrollTracker is designed to be framework-agnostic, making it compatible with vanilla JavaScript and all major frameworks.

### Vue Integration

#### Vue 3 Composition API:

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { ScrollTracker } from '@/utils/scroll/core/ScrollTracker';

const elementRef = ref(null);
const progress = ref(0);
let tracker = null;

onMounted(() => {
  tracker = new ScrollTracker({ throttleMs: 100 });
  
  if (elementRef.value) {
    tracker.trackElement(elementRef.value, {
      updateCallback: (position) => {
        progress.value = position.progress;
      }
    });
  }
});

onUnmounted(() => {
  if (tracker) {
    tracker.destroy();
  }
});
</script>

<template>
  <div ref="elementRef" class="scroll-section">
    <div class="progress-bar" :style="{ width: `${progress * 100}%` }"></div>
    <div class="content" :style="{ opacity: progress }">
      Scroll-animated content
    </div>
  </div>
</template>
```

#### Vue 2 Options API:

```vue
<template>
  <div ref="scrollElement" class="scroll-section">
    <div class="progress-bar" :style="{ width: `${progress * 100}%` }"></div>
    <div class="content" :style="{ opacity: progress }">
      Scroll-animated content
    </div>
  </div>
</template>

<script>
import { ScrollTracker } from '@/utils/scroll/core/ScrollTracker';

export default {
  data() {
    return {
      progress: 0,
      tracker: null
    };
  },
  mounted() {
    this.tracker = new ScrollTracker({ throttleMs: 100 });
    
    this.tracker.trackElement(this.$refs.scrollElement, {
      updateCallback: (position) => {
        this.progress = position.progress;
      }
    });
  },
  beforeDestroy() {
    if (this.tracker) {
      this.tracker.destroy();
    }
  }
};
</script>
```

### React Integration

```jsx
import { useEffect, useRef, useState } from 'react';
import { ScrollTracker } from '../utils/scroll/core/ScrollTracker';

function ScrollAnimation() {
  const elementRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const trackerRef = useRef(null);
  
  useEffect(() => {
    // Initialize tracker on component mount
    trackerRef.current = new ScrollTracker({ throttleMs: 100 });
    
    // Clean up on unmount
    return () => {
      if (trackerRef.current) {
        trackerRef.current.destroy();
      }
    };
  }, []);
  
  useEffect(() => {
    if (!trackerRef.current || !elementRef.current) return;
    
    // Track element when ref is available
    trackerRef.current.trackElement(elementRef.current, {
      updateCallback: (position) => {
        setProgress(position.progress);
      }
    });
    
    // Clean up tracking when component updates or unmounts
    return () => {
      if (trackerRef.current && elementRef.current) {
        trackerRef.current.untrackElement(elementRef.current);
      }
    };
  }, [elementRef.current]);
  
  return (
    <div ref={elementRef} className="scroll-section">
      <div className="progress-indicator" style={{width: `${progress * 100}%`}} />
      <div className="content" style={{opacity: progress}}>
        Scroll-animated content
      </div>
    </div>
  );
}

export default ScrollAnimation;
```

### Angular Integration

```typescript
import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ScrollTracker } from '../utils/scroll/core/ScrollTracker';

@Component({
  selector: 'app-scroll-animation',
  template: `
    <div #scrollElement class="scroll-section">
      <div class="progress-bar" [style.width.%]="progress * 100"></div>
      <div class="content" [style.opacity]="progress">
        Scroll-animated content
      </div>
    </div>
  `,
  styles: [/* ... */]
})
export class ScrollAnimationComponent implements OnInit, OnDestroy {
  @ViewChild('scrollElement', { static: true }) scrollElement: ElementRef;
  progress = 0;
  private tracker: any = null;

  ngOnInit() {
    // Import dynamically to avoid SSR issues
    import('../utils/scroll/core/ScrollTracker').then(module => {
      const ScrollTracker = module.ScrollTracker;
      this.tracker = new ScrollTracker({ throttleMs: 100 });
      
      this.tracker.trackElement(this.scrollElement.nativeElement, {
        updateCallback: (position) => {
          // Run change detection by using zone
          this.progress = position.progress;
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.tracker) {
      this.tracker.destroy();
    }
  }
}
```

### Svelte Integration

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import { ScrollTracker } from '../utils/scroll/core/ScrollTracker';
  
  let scrollElement;
  let progress = 0;
  let tracker;
  
  onMount(() => {
    tracker = new ScrollTracker({ throttleMs: 100 });
    
    tracker.trackElement(scrollElement, {
      updateCallback: (position) => {
        progress = position.progress;
      }
    });
  });
  
  onDestroy(() => {
    if (tracker) {
      tracker.destroy();
    }
  });
</script>

<div bind:this={scrollElement} class="scroll-section">
  <div class="progress-bar" style="width: {progress * 100}%"></div>
  <div class="content" style="opacity: {progress}">
    Scroll-animated content
  </div>
</div>
```

### Vanilla JavaScript with HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ScrollTracker Demo</title>
  <style>
    .scroll-section {
      height: 100vh;
      position: relative;
    }
    .progress-bar {
      position: fixed;
      top: 0;
      left: 0;
      height: 5px;
      background: #ff0066;
      width: 0%;
      transition: width 0.1s ease-out;
    }
    .content {
      opacity: 0;
      transition: opacity 0.3s ease;
    }
  </style>
</head>
<body>
  <div id="scrollSection" class="scroll-section">
    <div id="progressBar" class="progress-bar"></div>
    <div id="content" class="content">
      <h1>Scroll Down</h1>
      <p>This content will fade in as you scroll.</p>
    </div>
  </div>
  
  <!-- Add more sections as needed -->
  <div style="height: 200vh;"></div>
  
  <script type="module">
    import { ScrollTracker } from './utils/scroll/core/ScrollTracker.js';
    
    document.addEventListener('DOMContentLoaded', () => {
      const scrollSection = document.getElementById('scrollSection');
      const progressBar = document.getElementById('progressBar');
      const content = document.getElementById('content');
      
      const tracker = new ScrollTracker({ throttleMs: 100 });
      
      tracker.trackElement(scrollSection, {
        updateCallback: (position) => {
          // Update progress bar width
          progressBar.style.width = `${position.progress * 100}%`;
          
          // Fade in content when 30% scrolled
          if (position.progress > 0.3) {
            content.style.opacity = Math.min(1, (position.progress - 0.3) * 2);
          } else {
            content.style.opacity = 0;
          }
        }
      });
      
      // Clean up on page unload (optional)
      window.addEventListener('beforeunload', () => {
        tracker.destroy();
      });
    });
  </script>
</body>
</html>
```

### Using with Web Components

```javascript
class ScrollAnimationElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.progress = 0;
    this.tracker = null;
  }
  
  connectedCallback() {
    this.render();
    
    // Import and initialize ScrollTracker
    import('./utils/scroll/core/ScrollTracker.js').then(module => {
      const ScrollTracker = module.ScrollTracker;
      this.tracker = new ScrollTracker({ throttleMs: 100 });
      
      this.tracker.trackElement(this, {
        updateCallback: (position) => {
          this.progress = position.progress;
          this.updateProgress();
        }
      });
    });
  }
  
  disconnectedCallback() {
    if (this.tracker) {
      this.tracker.destroy();
    }
  }
  
  updateProgress() {
    const progressBar = this.shadowRoot.querySelector('.progress-bar');
    const content = this.shadowRoot.querySelector('.content');
    
    if (progressBar) {
      progressBar.style.width = `${this.progress * 100}%`;
    }
    
    if (content) {
      content.style.opacity = this.progress;
    }
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          min-height: 100vh;
        }
        .progress-bar {
          height: 5px;
          background: var(--progress-color, #ff0066);
          width: 0%;
          transition: width 0.1s ease-out;
        }
        .content {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
      </style>
      <div class="progress-bar"></div>
      <div class="content">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('scroll-animation', ScrollAnimationElement);
```

Usage:
```html
<scroll-animation style="--progress-color: #00aaff;">
  <h2>Custom scroll animation</h2>
  <p>This content will animate as you scroll.</p>
</scroll-animation>
```

## Troubleshooting

### Common Issues

1. **Elements not tracking correctly**
   - Ensure elements are in the DOM when `trackElement()` is called
   - Check if element has dimensions (height/width > 0)
   - Verify the element isn't hidden with `display: none`

2. **Performance issues**
   - Increase throttle time (`throttleMs`)
   - Reduce number of tracked elements
   - Simplify update callbacks
   - Use `requestAnimationFrame` for smoother animations

3. **Animation jumps or flickers**
   - Use CSS transitions for smoother effects
   - Ensure calculations don't result in NaN or undefined values
   - Add debouncing for resize events

### Debugging Tips

1. Enable debug mode to see logs:
   ```javascript
   const tracker = new ScrollTracker({ debug: true });
   ```

2. Log element positions to understand tracking:
   ```javascript
   tracker.trackElement(element, {
     updateCallback: (position) => {
       console.log('Element position:', {
         inView: position.inView,
         progress: position.progress.toFixed(2),
         viewportProgress: position.viewportProgress.toFixed(2)
       });
     }
   });
   ```

3. Use the VisualizationPlugin to see boundaries and progress visually.

## Browser Compatibility

ScrollTracker works in all modern browsers that support:
- IntersectionObserver API
- ResizeObserver API (optional, falls back to window resize)

For older browsers, consider using polyfills:
```javascript
import 'intersection-observer'; // polyfill
import 'resize-observer-polyfill'; // polyfill

// Then import and use ScrollTracker
```

## Using Plugins

### Visualization Plugin

```javascript
import { ScrollTracker } from './utils/scroll/core/ScrollTracker';
import { VisualizationPlugin } from './utils/scroll/plugins/VisualizationPlugin';

// Create visualization plugin
const visualPlugin = new VisualizationPlugin({
  showMarkers: true,
  markerPosition: 'right'
});

// Create tracker with plugin
const tracker = new ScrollTracker({
  plugins: [visualPlugin]
});

// Or register plugin after creation
tracker.registerPlugin(visualPlugin);

// Update a marker
visualPlugin.updateMarker('my-element', 0.75, {
  label: 'Progress',
  showProgress: true
});
```

### Animation Plugin

```javascript
import { ScrollTracker } from './utils/scroll/core/ScrollTracker';
import { AnimationPlugin } from './utils/scroll/plugins/AnimationPlugin';

// Create animation plugin
const animPlugin = new AnimationPlugin({
  debug: true
});

// Create tracker with plugin
const tracker = new ScrollTracker({
  plugins: [animPlugin]
});

// Track animation progress
const element = document.querySelector('.animated-element');
animPlugin.trackProgress(0.8, {
  element,
  id: 'fade-in-animation',
  threshold: 0.9,
  onComplete: (detail) => {
    console.log('Animation complete!', detail);
    element.classList.add('animation-complete');
  },
  onReset: () => {
    element.classList.remove('animation-complete');
  }
});
```

## Creating Custom Plugins

You can extend the ScrollTracker with custom plugins:

```javascript
import { ScrollTracker, Plugin } from './utils/scroll/core/ScrollTracker';

// Create a custom plugin
class MyCustomPlugin implements Plugin {
  name = 'my-custom-plugin';
  
  init(tracker) {
    console.log('Plugin initialized with tracker:', tracker);
    // Setup code here
  }
  
  update(tracker) {
    // Called on scroll updates
    const scrollPosition = tracker.getScrollPosition();
    // Do something with the scroll position
  }
  
  destroy() {
    // Cleanup code here
  }
  
  // Custom methods
  myCustomMethod() {
    // Add your own functionality
  }
}

// Use the custom plugin
const myPlugin = new MyCustomPlugin();
const tracker = new ScrollTracker({
  plugins: [myPlugin]
});

// Call custom methods
myPlugin.myCustomMethod();
```

## API Reference

### ScrollTracker

#### Constructor Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| debug | boolean | false | Enable debug logging |
| throttleMs | number | 100 | Throttle scroll updates (ms) |
| observeResize | boolean | true | Watch for element resize |
| plugins | Plugin[] | [] | Plugins to initialize with |

#### Methods

| Method | Description |
|--------|-------------|
| trackElement(element, options) | Start tracking an element |
| untrackElement(element) | Stop tracking an element |
| getScrollPosition() | Get current scroll position |
| getElementPosition(element) | Get element's position |
| registerPlugin(plugin) | Add a plugin |
| destroy() | Clean up all listeners |

### Performance Utilities

#### Functions

| Function | Description |
|----------|-------------|
| throttle(fn, delay) | Limit how often a function can be called |
| debounce(fn, delay) | Delay execution until after a period of inactivity |
| rafThrottle(fn) | Throttle using requestAnimationFrame for smooth animations |

#### Usage Examples

```javascript
import { throttle, debounce, rafThrottle } from './utils/scroll/utils/performance';

// Throttle: Good for scroll events (regular intervals)
const throttledFn = throttle(() => updateAnimation(), 100);

// Debounce: Good for resize events (wait for completion)
const debouncedFn = debounce(() => recalculateLayout(), 200);

// RAF Throttle: Best for smooth visual animations
const smoothFn = rafThrottle(() => updateParallax());
```

### Types

#### ScrollPosition

```typescript
interface ScrollPosition {
  scrollY: number;
  scrollX: number;
  direction: 'up' | 'down' | 'left' | 'right' | 'none';
  previousScrollY: number;
  previousScrollX: number;
  delta: number;
}
```

#### ElementPosition

```typescript
interface ElementPosition {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
  inView: boolean;
  progress: number; // 0 to 1
}
```

## License

MIT