# HeroSectionNoChat Component Style Documentation

## Component-Specific Classes

### Main Container Classes
- `.hero-section-chat`
  - Location: `src/scss/components/_hero-section-chat.scss`
  - Purpose: Main container for the hero section
  - Key properties: height, width, display, position, z-index

- `.right-content-placeholder`
  - Location: Component's scoped styles
  - Purpose: Placeholder for right column content
  - Key properties: width, height, min-height, display

### Deep Selectors
- `:deep(.heading--accent)`
  - Location: Component's scoped styles
  - Purpose: Styling for accent headings
  - Key properties: position, z-index

- `:deep(.heading--highlight)`
  - Location: Component's scoped styles
  - Purpose: Styling for highlighted headings
  - Key properties: position, z-index

- `:deep(.content-area)`
  - Location: Component's scoped styles
  - Purpose: Styling for content area
  - Key properties: position, z-index

## Utility Classes

### Tailwind Utilities
- `.mb-4` - Margin bottom utility
- `.mt-2` - Margin top utility
- `.mb-8` - Margin bottom utility
- `.flex` - Flex display utility
- `.gap-4` - Gap utility

### Theme Utilities
- `.heading--accent`
  - Location: `src/scss/themes/_theme-classes.scss`
  - Purpose: Accent color for headings

- `.heading--highlight`
  - Location: `src/scss/themes/_theme-classes.scss`
  - Purpose: Highlight color for headings

- `.theme-text--gradient-animated`
  - Location: `src/scss/themes/_theme-classes.scss`
  - Purpose: Animated gradient text effect

- `.gradient-shine`
  - Location: `src/scss/themes/_theme-classes.scss`
  - Purpose: Shine effect for gradient text

### Component Utilities
- `.heading-responsive-large`
  - Location: `src/scss/components/_hero-section-chat.scss`
  - Purpose: Responsive heading size

- `.subheading-responsive`
  - Location: `src/scss/components/_hero-section-chat.scss`
  - Purpose: Responsive subheading size

- `.btn-round--secondary`
  - Location: `src/scss/components/_buttons-round.scss`
  - Purpose: Secondary button styling

- `.btn-round--large`
  - Location: `src/scss/components/_buttons-round.scss`
  - Purpose: Large button size

- `.btn-round-large-outline-secondary`
  - Location: `src/scss/components/_buttons-round.scss`
  - Purpose: Large outline secondary button

## Theme Classes
- `.dark-theme`
  - Location: `src/scss/themes/_theme-classes.scss`
  - Purpose: Dark theme styling

## Props
- `heroContent`: HeroContent type (optional)
- `layout`: 'content-left' | 'content-right' | 'content-top' (default: 'content-left')
- `sectionId`: string (default: 'hero-section')
- `debug`: boolean (default: false)
- `customClass`: string (default: 'dark-theme')
- `primaryCtaLink`: string (default: '#contact')
- `secondaryCtaLink`: string (default: '#services')
- `secondaryCtaText`: string (default: 'Our Services')
- `messages`: any[] (optional)

## Events
- `mounted`: Emitted when component is mounted

## Dependencies
- TwoColumnSection
- TextAnimation
- ChatScrollSection
- Various utility functions from @/utils and @/data 