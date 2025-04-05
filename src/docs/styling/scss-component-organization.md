# SCSS Component Organization Guide

## Current Issues

### Mixed Styling Locations
```vue
<!-- Current structure in Vue files -->
<style lang="scss" scoped>
.component {
  // Styles mixed between Vue and SCSS files
}
</style>
```

```scss
// Current structure in SCSS files
.component {
  // Duplicate or related styles
}
```

## Organization Plan

### 1. Component Style Migration

#### A. Vue Component Structure
```vue
<template>
  <div class="component-name">
    <!-- Component markup -->
  </div>
</template>

<script setup>
// Component logic
</script>

<style lang="scss">
// Only scoped styles that are truly component-specific
// and cannot be shared or reused
</style>
```

#### B. SCSS Component Structure
```scss
// _component-name.scss
.component-name {
  // Base styles
  // Shared styles
  // Reusable patterns
  // Theme variables
  // Responsive styles
}
```

### 2. Style Separation Rules

#### Keep in Vue Files:
- Scoped styles that are truly component-specific
- Dynamic styles based on component state
- Styles that depend on component props
- Styles that are tightly coupled with component logic

#### Move to SCSS Files:
- Shared styles
- Reusable patterns
- Theme-dependent styles
- Responsive styles
- Common utilities
- Animation keyframes
- Mixins and functions

### 3. Implementation Steps

1. **Create Component SCSS Files**
   ```
   components/
   |-- _sticky-scrollable-cards.scss
   |-- _hero-section.scss
   |-- _contact-section.scss
   ```

2. **Audit Current Styles**
   ```scss
   // Example audit of mixed styles
   // In Vue file:
   .horizontal-scroll-section {
     // Component-specific styles
   }
   
   // In SCSS file:
   .horizontal-scroll-section {
     // Shared styles
   }
   ```

3. **Migrate Styles**
   ```scss
   // _sticky-scrollable-cards.scss
   .horizontal-scroll-section {
     // Base styles
     &__container {
       // Container styles
     }
     
     &__header {
       // Header styles
     }
     
     // Responsive styles
     @include respond-to('medium') {
       // Medium breakpoint styles
     }
   }
   ```

4. **Update Vue Components**
   ```vue
   <style lang="scss">
   // Only keep truly component-specific styles
   .horizontal-scroll-section {
     &--active {
       // Component state styles
     }
     
     &--custom {
       // Prop-based styles
     }
   }
   </style>
   ```

### 4. Style Dependencies

#### A. Component-Specific Variables
```scss
// _variables.scss
$component-spacing: (
  'small': 1rem,
  'medium': 2rem,
  'large': 4rem
);
```

#### B. Shared Mixins
```scss
// _mixins.scss
@mixin scroll-container {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}
```

### 5. Documentation Requirements

For each component:
1. List all style locations
2. Document style dependencies
3. Note any shared patterns
4. Record responsive breakpoints
5. Document theme variables used

### 6. Migration Checklist

- [ ] Create SCSS file for component
- [ ] Audit current styles in Vue file
- [ ] Identify shared vs. component-specific styles
- [ ] Move shared styles to SCSS file
- [ ] Update component to use new styles
- [ ] Test across breakpoints
- [ ] Verify theme compatibility
- [ ] Update documentation

### 7. Example Migration

#### Before:
```vue
<style lang="scss" scoped>
.horizontal-scroll-section {
  // All styles here
  .container {
    // Container styles
  }
  
  .header {
    // Header styles
  }
  
  @media (min-width: 768px) {
    // Responsive styles
  }
}
</style>
```

#### After:
```scss
// _sticky-scrollable-cards.scss
.horizontal-scroll-section {
  // Base styles
  
  &__container {
    // Container styles
  }
  
  &__header {
    // Header styles
  }
  
  @include respond-to('medium') {
    // Responsive styles
  }
}
```

```vue
<style lang="scss" scoped>
.horizontal-scroll-section {
  // Only component-specific styles
  &--active {
    // Active state styles
  }
}
</style>
```

### 8. Testing Requirements

1. **Visual Testing**
   - Compare before/after screenshots
   - Check all breakpoints
   - Verify theme switching

2. **Performance Testing**
   - Check CSS bundle size
   - Verify style application
   - Test animation performance

3. **Browser Testing**
   - Cross-browser compatibility
   - Mobile responsiveness
   - Touch device support 