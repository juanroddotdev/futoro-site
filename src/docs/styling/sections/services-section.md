# ServicesSection Component Style Documentation

## Component-Specific Classes

### Main Container Classes
- `.services-grid`
  - Location: `src/scss/components/_services-section.scss`
  - Purpose: Main grid container for services section
  - Key properties: grid layout, gap

- `.sticky-heading-container`
  - Location: `src/scss/components/_services-section.scss`
  - Purpose: Container for sticky heading
  - Key properties: position, grid column span

- `.service-card`
  - Location: `src/scss/components/_services-section.scss`
  - Purpose: Container for service cards
  - Key properties: grid column span

## Utility Classes

### Tailwind Utilities
- `.grid` - Grid display utility
- `.grid-cols-5` - Grid columns utility
- `.gap-4` - Gap utility
- `.col-span-2` - Grid column span utility
- `.col-span-3` - Grid column span utility
- `.text-5xl` - Text size utility
- `.text-center` - Text alignment utility
- `.my-16` - Margin utility
- `.font-bold` - Font weight utility

### Theme Utilities
- `.theme-bg--neutral` - Neutral background theme
- `.gradient-text` - Gradient text effect
- `.heading-responsive-large` - Responsive heading size

## Props
- `containerHeight`: string (optional)
- `debug`: boolean (default: false)
- `heightMultiplier`: number (default: 1.2)

## Computed Properties
- `computedContainerHeight`: Computed height based on props or services length

## Dependencies
- StickyScrollContainer
- ScrollAccordionVanilla
- Various utility functions from @/utils and @/data

## Component Structure
1. Main container with sticky scroll behavior
2. Two-column grid layout:
   - Left column (2/5): Sticky heading with text animation
   - Right column (3/5): Scrollable accordion with services

## Style Imports
- Imports styles from `@/scss/components/_services-section.scss` 