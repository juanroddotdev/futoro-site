# SCSS Shared Patterns and Mixins Guide

## What are Shared Patterns?

Shared patterns are common styling structures that appear across multiple components. They help maintain consistency and reduce code duplication.

### Example from Your Project

Looking at your components, here are some shared patterns:

1. **Card Pattern**
```scss
// Common card styling across components
.card-base {
  border-radius: var(--border-radius-medium);
  padding: var(--spacing-medium);
  background: var(--color-background);
  box-shadow: var(--shadow-card);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
}
```

2. **Section Header Pattern**
```scss
// Common section header styling
.section-header {
  text-align: center;
  margin-bottom: var(--spacing-large);
  
  &__title {
    font-size: var(--font-size-xxl);
    margin-bottom: var(--spacing-medium);
  }
  
  &__subtitle {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
  }
}
```

## What are Mixins?

Mixins are reusable style blocks that can be included in multiple selectors. They're like functions for CSS.

### Common Mixins from Your Project

1. **Responsive Mixins**
```scss
// _mixins.scss
@mixin respond-to($breakpoint) {
  @if $breakpoint == "small" {
    @media (min-width: var(--breakpoint-sm)) { @content; }
  }
  @if $breakpoint == "medium" {
    @media (min-width: var(--breakpoint-md)) { @content; }
  }
  @if $breakpoint == "large" {
    @media (min-width: var(--breakpoint-lg)) { @content; }
  }
}
```

2. **Flexbox Mixins**
```scss
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

3. **Animation Mixins**
```scss
@mixin fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@mixin slide-up {
  animation: slideUp 0.5s ease-out;
}
```

## How to Use Shared Patterns and Mixins

### 1. Creating a New Component Using Patterns

```scss
// _service-card.scss
.service-card {
  @extend .card-base;  // Use shared pattern
  
  &__icon {
    @include flex-center;  // Use mixin
    margin-bottom: var(--spacing-medium);
  }
  
  &__title {
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-small);
  }
  
  @include respond-to('medium') {  // Use responsive mixin
    padding: var(--spacing-large);
  }
}
```

### 2. Creating Reusable Animation Patterns

```scss
// _animations.scss
@mixin hover-lift {
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
}

@mixin hover-scale {
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
}
```

### 3. Creating Theme-Aware Patterns

```scss
// _themes.scss
@mixin themed-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  
  &:hover {
    background: var(--color-background-hover);
    border-color: var(--color-border-hover);
  }
}
```

## Best Practices for Creating Shared Patterns

### 1. Identify Common Patterns
```scss
// Look for repeated styles across components
// Example: Common button styles
.button-base {
  padding: var(--spacing-small) var(--spacing-medium);
  border-radius: var(--border-radius-small);
  font-weight: var(--font-weight-medium);
  transition: all 0.3s ease;
}
```

### 2. Create Flexible Mixins
```scss
// Make mixins configurable
@mixin card($padding: var(--spacing-medium), $radius: var(--border-radius-medium)) {
  padding: $padding;
  border-radius: $radius;
  background: var(--color-background);
  box-shadow: var(--shadow-card);
}
```

### 3. Document Usage
```scss
/// Card mixin with hover effect
/// @param {String} $padding - Padding value
/// @param {String} $radius - Border radius value
/// @example
///   .my-card {
///     @include card(var(--spacing-large), var(--border-radius-large));
///   }
@mixin card($padding, $radius) {
  // Mixin implementation
}
```

## Common Patterns in Your Project

### 1. Section Layouts
```scss
// Common section layout pattern
.section-base {
  padding: var(--spacing-large) 0;
  
  &__container {
    max-width: var(--container-width);
    margin: 0 auto;
    padding: 0 var(--spacing-medium);
  }
}
```

### 2. Text Styles
```scss
// Common text style patterns
.text-gradient {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-accent {
  color: var(--color-accent);
  font-weight: var(--font-weight-bold);
}
```

### 3. Interactive Elements
```scss
// Common interactive element patterns
.interactive-element {
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:active {
    transform: scale(0.98);
  }
}
```

## Implementation Steps

1. **Audit Existing Components**
   - Identify repeated styles
   - Note common patterns
   - Document shared behaviors

2. **Create Base Patterns**
   - Extract common styles
   - Create reusable classes
   - Document usage

3. **Create Mixins**
   - Identify repeated style blocks
   - Make them configurable
   - Add documentation

4. **Update Components**
   - Use shared patterns
   - Apply mixins
   - Remove duplicate code

5. **Test and Document**
   - Verify across components
   - Test responsiveness
   - Update documentation 