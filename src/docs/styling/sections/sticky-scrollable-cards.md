# StickyScrollableCardsSection Component Style Documentation

## Component-Specific Classes

### Main Container Classes
- `.horizontal-scroll-section`
  - Location: `src/scss/components/_horizontal-scroll.scss`
  - Purpose: Main container for the horizontal scroll section
  - Key properties: isolation, min-height, z-index

- `.container`
  - Location: `src/scss/components/_horizontal-scroll.scss`
  - Purpose: Inner container for content
  - Key properties: position, height, width, overflow

### Header Classes
- `.header-container`
  - Location: `src/scss/components/_hurdles-solutions.scss`
  - Purpose: Container for the section header
  - Key properties: position, z-index, padding
  - Uses mixin: `@include tapered-blur(5px, -20px)`

- `.section-title`
  - Location: `src/scss/components/_hurdles-solutions.scss`
  - Purpose: Styling for section titles
  - Key properties: font-size, margin, text-align

### Card Classes
- `.animation-wrap`
  - Location: `src/scss/components/_horizontal-scroll.scss`
  - Purpose: Container for scrollable cards
  - Key properties: display, padding, transition

- `.item`
  - Location: `src/scss/components/_horizontal-scroll.scss`
  - Purpose: Individual card items
  - Key properties: flex, width, margin, transition

- `.title-card`
  - Location: `src/scss/components/_hurdles-solutions.scss`
  - Purpose: Special styling for title cards
  - Key properties: width, display, background

## Utility Classes

### Tailwind Utilities
- `.p-6` - Padding utility
- `.relative` - Position utility
- `.overflow-hidden` - Overflow utility
- `.z-10` - Z-index utility
- `.text-md` - Text size utility
- `.font-semibold` - Font weight utility
- `.mb-3` - Margin utility

### Theme Utilities
- `.gradient-text`
  - Location: `src/scss/components/_transitions.scss`
  - Purpose: Gradient text effect
  - Uses mixins: `@include transition-base`, `@include gradient-text-clip`

- `.hover-card-themed`
  - Location: `src/scss/components/_transitions.scss`
  - Purpose: Themed card with hover effects
  - Uses mixins: `@include transition-base`, `@include theme-specific-looping-gradients`

- `.theme-text--neutral`
  - Location: `src/scss/themes/_theme-classes.scss`
  - Purpose: Theme-aware neutral text color

## Theme Classes
- `.theme-neon-horizon`
- `.theme-digital-sunset`
- `.theme-retro-wave`
- `.theme-pastel-future`
  - Location: `src/scss/themes/_theme-classes.scss`
  - Purpose: Theme-specific styling overrides

## Mixins Used
1. `tapered-blur`
   - Location: `src/scss/abstracts/_mixins.scss`
   - Purpose: Creates a blur effect that tapers off at the edges

2. `transition-base`
   - Location: `src/scss/components/_transitions.scss`
   - Purpose: Base transition properties

3. `gradient-text-clip`
   - Location: `src/scss/components/_transitions.scss`
   - Purpose: Text gradient clipping properties

4. `theme-specific-looping-gradients`
   - Location: `src/scss/abstracts/_mixins.scss`
   - Purpose: Creates theme-specific gradient effects

## Suggested Organization
1. Create a new file `src/scss/components/_sticky-scrollable-cards.scss` for component-specific styles
2. Move all component-specific classes there
3. Keep theme-specific styles in `_theme-classes.scss`
4. Keep utility classes in their respective files
5. Update imports in `main.scss` 