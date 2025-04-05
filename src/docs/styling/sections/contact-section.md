# ContactSection Component Style Documentation

## Component-Specific Classes

### Main Container Classes
- `.contact-v2`
  - Location: Component's scoped styles
  - Purpose: Main container for contact section
  - Key properties: position, z-index, min-height, display, align-items, justify-content, padding

- `.contact-v2__content`
  - Location: `src/scss/components/_contact-section-v2.scss`
  - Purpose: Container for content
  - Key properties: opacity, transform (for animation)

- `.contact-v2__heading`
  - Location: `src/scss/components/_contact-section-v2.scss`
  - Purpose: Heading styling
  - Key properties: font-size, font-weight, text-align

- `.contact-v2__cta`
  - Location: `src/scss/components/_contact-section-v2.scss`
  - Purpose: Call-to-action container
  - Key properties: display, flex-direction, align-items

### Interactive Elements
- `.contact-v2__email`
  - Location: `src/scss/components/_contact-section-v2.scss`
  - Purpose: Email link styling
  - Key properties: color, text-decoration, hover effects

- `.contact-v2__button`
  - Location: `src/scss/components/_contact-section-v2.scss`
  - Purpose: CTA button styling
  - Key properties: background, color, padding, border-radius

### Text Elements
- `.underline`
  - Location: `src/scss/components/_contact-section-v2.scss`
  - Purpose: Underline effect for text
  - Key properties: text-decoration or border-bottom

## Animations

### GSAP Animations
1. Initial State:
   - Content opacity: 0
   - Content y-position: 50px

2. Scroll Trigger Animation:
   - Trigger: '.contact-v2'
   - Start: 'top center'
   - Toggle Actions: 'play none none reverse'
   - Properties:
     - opacity: 1
     - y: 0
     - duration: 1
     - ease: 'power2.out'

## Dependencies
- GSAP
- ScrollTrigger plugin
- Styles from `@/scss/components/_contact-section-v2.scss`

## Component Structure
1. Main section container
2. Content container with:
   - Heading with underlined text
   - CTA section containing:
     - Email link
     - "Get in Touch" button

## Variables
- `email`: 'juan@juanrod.dev'

## Responsive Behavior
- Container uses min-height: 100vh for full viewport height
- Padding: 2rem for spacing on all devices
- Centered content using flexbox
- Additional responsive styles defined in _contact-section-v2.scss

## Style Imports
- Imports styles from `@/scss/components/_contact-section-v2.scss` 