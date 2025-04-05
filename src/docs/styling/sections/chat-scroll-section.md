# ChatScrollSection Component Style Documentation

## Component-Specific Classes

### Main Container Classes
- `.scrollable-chat-section`
  - Location: Component's scoped styles
  - Purpose: Main container for the chat section
  - Key properties: position, width, display

- `.section-container`
  - Location: Component's scoped styles
  - Purpose: Container for section content
  - Key properties: padding, width, max-width, margin

- `.section-inner`
  - Location: Component's scoped styles
  - Purpose: Inner container for content layout
  - Key properties: display, flex-direction, gap

- `.content-area`
  - Location: Component's scoped styles
  - Purpose: Container for main content
  - Key properties: flex, display, flex-direction

- `.chat-area`
  - Location: Component's scoped styles
  - Purpose: Container for chat component
  - Key properties: position, width, height

## Props

### Layout Props
- `layout`: 'content-left' | 'content-right' | 'content-top' (default: 'content-left')
- `sectionId`: string (default: 'floating-chat-section')
- `containerHeight`: string (default: '300vh')
- `debug`: boolean (default: false)
- `customClass`: string (default: '')

### Chat Props
- `messages`: any[] (required)
- `showTypingFor`: number[] (required)
- `tiltX`: number (default: 8)
- `tiltY`: number (default: -20)

### Phone-Related Props
- `phonePosition`: 'left' | 'right' | 'center' (default: 'right')
- `startAtBeginning`: boolean (default: true)
- `isUnlocked`: boolean (default: false)
- `ambientMode`: boolean (default: false)
- `enablePullEffect`: boolean (default: true)
- `unlockAnimationType`: 'wave' | 'ripple' (default: 'wave')
- `alternatePhoneStyle`: boolean (default: false)

### CTA Props
- `primaryCta`: { text: string; link: string; } (optional)
- `secondaryCta`: { text: string; link: string; } (optional)

### Theme Props
- `ambientTheme`: {
  - baseColor?: string (default: '#1a1f2c')
  - endColor?: string (default: '#2E3440')
  - accentColor?: string (default: 'rgba(245, 245, 245, 0.3)')
}

## Events
- `pull-threshold-reached`: Emitted when pull threshold is reached
- `unlock`: Emitted when unlock action is triggered

## Slots
- `headline`: Slot for headline content
- `subheadline`: Slot for subheadline content
- `content`: Slot for main content
- Default slot: Additional content

## Dependencies
- StickyScrollContainer
- FloatingChat
- FloatingChat2 (commented out)
- Various utility functions from @/utils

## Computed Properties
- `computedContainerHeight`: Computed height based on props or messages length

## Exposed Methods
- `focusContent`: No-op method for compatibility with ScrollablePhoneSection

## Component Structure
1. StickyScrollContainer wrapper
2. Main scrollable chat section
3. Section container with max-width
4. Section inner with flex layout
5. Two main areas:
   - Content area with slots for headline, subheadline, and content
   - Chat area with FloatingChat component

## Chat Component Configuration
- Animation style: slide-stack
- Slide easing: power1.out
- Pin settings:
  - enabled: false
  - start: 'top top'
  - end: dynamic based on messages length
  - pinSpacing: false 