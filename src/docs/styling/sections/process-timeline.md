# ProcessTimeline Component Style Documentation

## Component-Specific Classes

### Main Container Classes
- `.section`
  - Location: Component's scoped styles
  - Purpose: Main section container
  - Key properties: padding

- `.timeline-container`
  - Location: Component's scoped styles
  - Purpose: Container for timeline items
  - Key properties: max-width, margin, position

- `.timeline-line`
  - Location: Component's scoped styles
  - Purpose: Vertical line connecting timeline items
  - Key properties: position, width, height

- `.timeline-progress`
  - Location: Component's scoped styles
  - Purpose: Progress indicator for timeline
  - Key properties: position, width, background-color

### Timeline Item Classes
- `.timeline-item`
  - Location: Component's scoped styles
  - Purpose: Individual timeline step container
  - Key properties: position, margin, transition

- `.timeline-item--active`
  - Location: Component's scoped styles
  - Purpose: Active state styling for timeline items
  - Key properties: box-shadow, transform

- `.timeline-stem`
  - Location: Component's scoped styles
  - Purpose: Connecting line from main timeline to items
  - Key properties: position, width, height

- `.timeline-card`
  - Location: Component's scoped styles
  - Purpose: Card container for timeline content
  - Key properties: background, border-radius, padding

- `.timeline-number`
  - Location: Component's scoped styles
  - Purpose: Number indicator for timeline steps
  - Key properties: position, width, height, border-radius

- `.timeline-title`
  - Location: Component's scoped styles
  - Purpose: Title styling for timeline steps
  - Key properties: font-size, font-weight, margin

- `.timeline-bullet`
  - Location: Component's scoped styles
  - Purpose: Bullet point styling for descriptions
  - Key properties: font-size, list-style

### Button Classes
- `.touch-circle-btn`
  - Location: Component's scoped styles
  - Purpose: Circular button styling
  - Key properties: position, width, height, border-radius

- `.pulse-gradient`
  - Location: Component's scoped styles
  - Purpose: Pulsing gradient effect
  - Key properties: position, width, height, border-radius

- `.floating-texts`
  - Location: Component's scoped styles
  - Purpose: Container for floating text elements
  - Key properties: position, width, height

- `.floating-text`
  - Location: Component's scoped styles
  - Purpose: Individual floating text elements
  - Key properties: position, animation

- `.rotating-text`
  - Location: Component's scoped styles
  - Purpose: Rotating text container
  - Key properties: position, animation

## Utility Classes

### Tailwind Utilities
- `.py-32` - Padding utility
- `.mb-24` - Margin utility
- `.text-center` - Text alignment utility
- `.text-5xl` - Text size utility
- `.max-w-2xl` - Max width utility
- `.mx-auto` - Margin auto utility
- `.mt-4` - Margin top utility
- `.text-sm` - Text size utility
- `.font-bold` - Font weight utility
- `.ml-4` - Margin left utility
- `.max-w-4xl` - Max width utility
- `.relative` - Position utility
- `.absolute` - Position utility
- `.left-1/2` - Position utility
- `.transform` - Transform utility
- `.-translate-x-1/2` - Transform utility
- `.h-full` - Height utility
- `.w-1` - Width utility
- `.mb-24` - Margin utility
- `.last:mb-0` - Last child margin utility
- `.text-left` - Text alignment utility
- `.ml-auto` - Margin left auto utility
- `.pl-8` - Padding left utility
- `.text-right` - Text alignment utility
- `.mr-auto` - Margin right auto utility
- `.pr-8` - Padding right utility
- `.w-[4rem]` - Width utility
- `.bg-opacity-30` - Background opacity utility
- `.rounded-xl` - Border radius utility
- `.p-6` - Padding utility
- `.backdrop-blur-sm` - Backdrop blur utility
- `.-top-3` - Top position utility
- `.w-8` - Width utility
- `.h-8` - Height utility
- `.rounded-full` - Border radius utility
- `.flex` - Display utility
- `.items-center` - Align items utility
- `.justify-center` - Justify content utility
- `.text-lg` - Text size utility
- `.font-semibold` - Font weight utility
- `.mb-4` - Margin bottom utility
- `.space-y-2` - Space utility
- `.pl-4` - Padding left utility
- `.text-sm` - Text size utility
- `.list-none` - List style utility
- `.flex` - Display utility
- `.mt-4` - Margin top utility
- `.justify-start` - Justify content utility
- `.justify-end` - Justify content utility
- `.text-4xl` - Text size utility
- `.opacity-80` - Opacity utility
- `.flex` - Display utility
- `.justify-center` - Justify content utility
- `.mt-24` - Margin top utility
- `.relative` - Position utility

### Theme Utilities
- `.heading--accent` - Accent color for headings
- `.theme-text--gradient` - Gradient text effect
- `.gradient-normal` - Normal gradient direction
- `.gradient-reverse` - Reversed gradient direction
- `.btn-round--outline-secondary` - Secondary outline button

## Props
- `useAlternative`: boolean (default: false)

## Events
- `ember-start`: Emitted when ember animation starts

## Dependencies
- GSAP
- ScrollTrigger
- Various utility functions from @/animations and @/data

## Refs
- `activeStepId`: Reference to active step
- `timelineProgress`: Reference to timeline progress
- `timelineItems`: Reference to timeline items
- `scrollTriggers`: Reference to scroll triggers

## Computed Properties
- `steps`: Computed steps based on useAlternative prop
- `isDevelopment`: Environment check 