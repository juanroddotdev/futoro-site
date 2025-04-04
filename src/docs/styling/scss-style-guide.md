# SCSS Style Guide

## Table of Contents
1. [Architecture](#architecture)
2. [Naming Conventions](#naming-conventions)
3. [Variables and Custom Properties](#variables-and-custom-properties)
4. [Mixins and Functions](#mixins-and-functions)
5. [Component Organization](#component-organization)
6. [Responsive Design](#responsive-design)
7. [Animations](#animations)
8. [Theme System](#theme-system)
9. [Best Practices](#best-practices)
10. [File Structure](#file-structure)

## Architecture

### 7-1 Pattern Implementation
```
scss/
|-- abstracts/      # Variables, mixins, functions
|-- base/          # Base styles, reset, typography
|-- components/    # Component-specific styles
|-- layout/        # Layout-specific styles
|-- themes/        # Theme-specific styles
|-- vendors/       # Third-party styles
|-- separators/    # Section separators
```

### Import Order
1. Vendors (Tailwind)
2. Abstracts (variables, mixins)
3. Base styles
4. Components
5. Layout
6. Themes

## Naming Conventions

### BEM Methodology
```scss
// Block
.block {}

// Element
.block__element {}

// Modifier
.block--modifier {}
.block__element--modifier {}

// Example
.hero-section {}
.hero-section__heading {}
.hero-section__heading--accent {}
```

### Utility Classes
```scss
// Prefix with 'u-'
.u-flex {}
.u-mt-4 {}
.u-text-center {}
```

### Component Classes
```scss
// Use kebab-case
.hero-section {}
.service-card {}
.contact-form {}
```

## Variables and Custom Properties

### CSS Custom Properties (Theme Variables)
```scss
:root {
  // Colors
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  
  // Typography
  --font-family-base: 'Inter', sans-serif;
  --font-size-base: 16px;
  
  // Spacing
  --spacing-unit: 8px;
  --spacing-small: calc(var(--spacing-unit) * 2);
  --spacing-medium: calc(var(--spacing-unit) * 4);
  --spacing-large: calc(var(--spacing-unit) * 8);
  
  // Breakpoints
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
}
```

### SCSS Variables (Fixed Values)
```scss
// Use for values that don't change between themes
$z-index-layers: (
  modal: 1000,
  overlay: 900,
  dropdown: 800,
  header: 700
);

$border-radius: (
  small: 4px,
  medium: 8px,
  large: 16px
);
```

## Mixins and Functions

### Responsive Mixins
```scss
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
  @if $breakpoint == "xlarge" {
    @media (min-width: var(--breakpoint-xl)) { @content; }
  }
}
```

### Component Mixins
```scss
@mixin card-base {
  border-radius: var(--border-radius-medium);
  padding: var(--spacing-medium);
  background: var(--color-background);
  box-shadow: var(--shadow-card);
}

@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

## Component Organization

### Component File Structure
```scss
// _component-name.scss
.component-name {
  // Variables
  $component-spacing: var(--spacing-medium);
  
  // Base styles
  &__element {
    // Element styles
  }
  
  // Modifiers
  &--modifier {
    // Modifier styles
  }
  
  // Media queries
  @include respond-to('medium') {
    // Responsive styles
  }
}
```

### Component Dependencies
```scss
// List dependencies at the top of each component file
@import '../abstracts/variables';
@import '../abstracts/mixins';
@import '../base/typography';
```

## Responsive Design

### Mobile-First Approach
```scss
.component {
  // Base styles (mobile)
  padding: var(--spacing-small);
  
  // Tablet and up
  @include respond-to('medium') {
    padding: var(--spacing-medium);
  }
  
  // Desktop and up
  @include respond-to('large') {
    padding: var(--spacing-large);
  }
}
```

### Breakpoint Usage
```scss
// Use predefined breakpoints
$breakpoints: (
  'small': 576px,
  'medium': 768px,
  'large': 992px,
  'xlarge': 1200px
);
```

## Animations

### Animation Mixins
```scss
@mixin fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@mixin slide-up {
  animation: slideUp 0.5s ease-out;
}
```

### Keyframe Organization
```scss
// _animations.scss
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

## Theme System

### Theme Variables
```scss
// _themes.scss
.theme-light {
  --color-background: #ffffff;
  --color-text: #333333;
  --color-primary: #007bff;
}

.theme-dark {
  --color-background: #1a1a1a;
  --color-text: #ffffff;
  --color-primary: #4dabf7;
}
```

### Theme Mixins
```scss
@mixin themed() {
  @each $theme, $map in $themes {
    .theme-#{$theme} & {
      @content($map);
    }
  }
}
```

## Best Practices

### Performance
1. Use CSS custom properties for theme values
2. Minimize nesting (max 3 levels)
3. Use BEM to avoid specificity issues
4. Leverage CSS Grid and Flexbox
5. Use hardware-accelerated properties

### Maintainability
1. Keep components modular
2. Document complex mixins
3. Use meaningful variable names
4. Group related styles
5. Comment complex logic

### Accessibility
1. Use relative units (rem, em)
2. Maintain sufficient color contrast
3. Support reduced motion
4. Use semantic HTML
5. Test with screen readers

## File Structure

### Component Organization
```
components/
|-- _buttons.scss
|-- _cards.scss
|-- _forms.scss
|-- sections/
    |-- _hero.scss
    |-- _services.scss
    |-- _contact.scss
```

### Theme Organization
```
themes/
|-- _variables.scss
|-- _light.scss
|-- _dark.scss
|-- _classes.scss
```

### Layout Organization
```
layout/
|-- _grid.scss
|-- _header.scss
|-- _footer.scss
|-- _navigation.scss
```

## Maintenance Guidelines

### Adding New Components
1. Create new file in appropriate directory
2. Follow BEM naming convention
3. Use existing variables and mixins
4. Add to main.scss imports
5. Document in style guide

### Modifying Existing Styles
1. Check for existing variables/mixins
2. Maintain BEM structure
3. Update documentation
4. Test across breakpoints
5. Verify theme compatibility

### Code Review Checklist
- [ ] Follows BEM naming
- [ ] Uses existing variables
- [ ] Responsive implementation
- [ ] Theme compatibility
- [ ] Performance considerations
- [ ] Accessibility standards 