# HurdlesSolutionsSection Component Style Documentation

## Component-Specific Classes

### Main Container Classes
- `.progressive-reveal`
  - Location: Component's scoped styles
  - Purpose: Main container for the section
  - Key properties: position, margin-top, text-align

- `.solutions-heading`
  - Location: Component's scoped styles
  - Purpose: Styling for the solutions heading
  - Key properties: font-size (clamp)

- `.section-separator`
  - Location: Component's scoped styles
  - Purpose: Separator between sections
  - Key properties: height, display, align-items, justify-content, margin, border

- `.comparison-title`
  - Location: Component's scoped styles
  - Purpose: Styling for comparison titles
  - Key properties: font-size, color, opacity

### Deep Selectors
- `:deep(.hurdles-intro-section)`
  - Location: Component's scoped styles
  - Purpose: Styling for hurdles introduction section
  - Key properties: grid layout, z-index

## Utility Classes

### Tailwind Utilities
- `.overflow-visible` - Overflow visibility utility
- `.text-center` - Text alignment utility
- `.font-bold` - Font weight utility

### Theme Utilities
- `.gradient-text` - Gradient text effect
- `.gradient-theme-fire` - Fire theme gradient
- `.gradient-theme-cool` - Cool theme gradient

### Component Utilities
- `.heading-responsive` - Responsive heading size
- `.sticky-version` - Sticky positioning version
- `.struggle-card` - Struggle card styling
- `.solution-card` - Solution card styling
- `.header-container--hurdles` - Hurdles header container
- `.header-container--solutions` - Solutions header container

## Props
- `sectionId`: string (default: 'stickyHurdlesSection')
- `containerId`: string (default: 'stickyHurdlesContainer')
- `title`: string (default: 'Common Hurdles')
- `items`: array (from struggles data)
- `sectionClass`: string (default: 'hurdles-section sticky-version')
- `cardClass`: string (default: 'struggle-card')
- `headerContainerClass`: string (default: 'header-container--hurdles')
- `titleAnimation`: string (default: 'slideInRight')
- `reverseLayout`: boolean (default: false)
- `containerHeight`: string (default: '250vh')
- `debug`: boolean (default: false)

## Events
- `word-effect-start`: Emitted when word effects start
- `ember-start`: Emitted when ember animation starts

## Dependencies
- AnimatedOutlineToFillText
- TextAnimation
- EmberAnimation
- StickyScrollableCardsSection
- Various utility functions from @/utils and @/data

## Refs
- `sectionContainerRef`: Reference to main container
- `introSectionRef`: Reference to intro section
- `splitTextRef`: Reference to split text
- `toFantasticRef`: Reference to "fantastic" text
- `fantasticWrapperRef`: Reference to fantastic wrapper
- `frustrationElement`: Reference to frustration element

## Computed Properties
- `reversedSolutions`: Reversed array of solutions
- `introContainerHeight`: Calculated height for intro container
- `solutionsContainerHeight`: Calculated height for solutions container 