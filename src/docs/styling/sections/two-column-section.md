# TwoColumnSection Component Style Documentation

## Component-Specific Classes

### Main Container Classes
- `.scrollable-section`
  - Location: Component's scoped styles
  - Purpose: Main container for the section
  - Key properties: position, width, display, align-items, height

- `.section-container`
  - Location: Component's scoped styles
  - Purpose: Container for section content
  - Key properties: padding, width, max-width, margin, display, flex-direction

- `.section-inner`
  - Location: Component's scoped styles
  - Purpose: Inner container for content layout
  - Key properties: display, flex-direction, gap

- `.content-area`
  - Location: Component's scoped styles
  - Purpose: Container for main content
  - Key properties: flex, display, flex-direction, justify-content, padding

- `.content-area.right`
  - Location: Component's scoped styles
  - Purpose: Container for right column content
  - Key properties: display, justify-content, align-items, position, max-width, margin

## Layout Variations

### Content Left Layout
- `.content-left`
  - Location: Component's scoped styles
  - Purpose: Left-aligned content layout
  - Key properties: flex-direction (row on desktop)

### Content Right Layout
- `.content-right`
  - Location: Component's scoped styles
  - Purpose: Right-aligned content layout
  - Key properties: flex-direction (row-reverse on desktop)

### Content Top Layout
- `.content-top`
  - Location: Component's scoped styles
  - Purpose: Top-aligned content layout
  - Key properties: flex-direction (column)

## Media Queries

### Desktop (min-width: 1024px)
- Section container padding: 4rem 2rem
- Section inner: flex-direction: row, gap: 4rem
- Content area padding: 3rem 0

### Tablet (min-width: 768px)
- Section container padding: 4rem 2rem
- Content area padding: 3rem 0

### Mobile (max-width: 768px)
- Section inner: flex-direction: column
- Right content area: margin-right: 0, max-width: 100%

## Props
- `layout`: 'content-left' | 'content-right' | 'content-top' (default: 'content-left')
- `customClass`: string (default: '')

## Slots
- `headline`: Slot for headline content
- `subheadline`: Slot for subheadline content
- `content`: Slot for main content
- `right-content`: Slot for right column content
- Default slot: Additional content

## Component Structure
1. Main scrollable section container
2. Section container with max-width and padding
3. Section inner with flex layout
4. Two content areas:
   - Main content area with slots for headline, subheadline, and content
   - Right content area with slot for right content

## Responsive Behavior
- Desktop: Two-column layout with configurable content position
- Tablet: Maintains two-column layout with adjusted spacing
- Mobile: Single column layout with full-width content 