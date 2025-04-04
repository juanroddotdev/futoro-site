# HeroSectionChat Component Style Documentation

## Component-Specific Classes

### Main Container Classes
- `.hero-section-chat`
  - Location: Component's scoped styles
  - Purpose: Main container for hero section
  - Key properties: position, width, height

### Text Classes
- `.heading--accent`
  - Location: Theme styles
  - Purpose: Accent styling for main heading
  - Key properties: color, font-weight

- `.heading--highlight`
  - Location: Theme styles
  - Purpose: Highlight styling for subheading
  - Key properties: color, font-weight

- `.theme-text--gradient-animated`
  - Location: Theme styles
  - Purpose: Animated gradient text effect
  - Key properties: background, animation

- `.gradient-shine`
  - Location: Theme styles
  - Purpose: Shine effect for gradient text
  - Key properties: animation, opacity

### Button Classes
- `.btn-round--secondary`
  - Location: Button styles
  - Purpose: Secondary rounded button
  - Key properties: background, border, border-radius

- `.btn-round--large`
  - Location: Button styles
  - Purpose: Large size modifier for rounded button
  - Key properties: padding, font-size

- `.btn-round-large-outline-secondary`
  - Location: Button styles
  - Purpose: Large outline secondary button
  - Key properties: border, background, padding

## Utility Classes

### Tailwind Utilities
- `.mb-4` - Margin bottom utility
- `.mt-2` - Margin top utility
- `.mb-8` - Margin bottom utility
- `.flex` - Display flex utility
- `.gap-4` - Gap utility

### Theme Utilities
- `.heading-responsive` - Responsive heading size
- `.subheading-responsive` - Responsive subheading size
- `.dark-theme` - Dark theme styling

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
- ChatScrollSection
- TextAnimation
- Various utility functions from @/data and @/utils

## Computed Properties
- `heroContent`: Computed hero content from props or random
- `heroMessages`: Computed messages from props or default

## Helper Functions
- `calculateHeroContainerHeight`: Calculates container height based on message count
  - Parameters:
    - baseHeight: 100
    - itemHeight: 30
    - padding: 150
    - heightMultiplier: 1.5

## Component Structure
1. Main hero section container
2. ChatScrollSection component with:
   - Headline slot:
     - H1 with TextAnimation for headline
   - Subheadline slot:
     - Paragraph with TextAnimation for subheadline
     - CTA buttons container with:
       - Primary CTA button
       - Secondary CTA button

## Text Animation Configuration
- Headline:
  - Animation: fadeUp
  - Duration: 3
  - Gradient: true
  - Initially hidden
  - Trigger on visible
  - Restart on visible

- Subheadline:
  - Animation: fade
  - Duration: 3
  - Gradient: true
  - Initially hidden
  - Trigger on visible
  - Restart on visible

## Chat Configuration
- Shows typing indicator for first two messages
- Tilt settings:
  - X: 1
  - Y: -5 