# Project Structure

This document outlines the recommended structure for the project files, focusing on clarity, maintainability, and logical organization.

## Directory Structure

```
src/
├── assets/                    # Static assets
│   ├── images/                # Image files
│   └── fonts/                 # Font files
│
├── components/                # Reusable Vue components
│   ├── common/                # Truly generic components
│   │   ├── Card.vue
│   │   ├── MessageBubble.vue
│   │   └── TimelineItem.vue
│   │
│   ├── layout/               # Layout components
│   │   ├── Navbar.vue
│   │   └── Footer.vue
│   │
│   ├── ui/                   # UI components
│   │   ├── backgrounds/
│   │   │   └── GridPaperOverlay.vue
│   │   └── containers/
│   │       └── ScrollPinWrapper.vue
│   │
│   ├── sections/             # Page sections
│   │   ├── refactored/       # Refactored sections
│   │   │   ├── HeroSectionChat.vue
│   │   │   ├── ScrollableChatSection.vue
│   │   │   ├── ScrollableChatSectionV2.vue
│   │   │   ├── HurdlesSolutionsSection.vue
│   │   │   ├── ServicesSection.vue
│   │   │   └── StickyScrollableCardsSection.vue
│   │   └── TimelineHowItWorks.vue
│   │
│   ├── chat/                 # Chat-related components
│   │   ├── FloatingChatInterface.vue
│   │   └── TypingIndicator.vue
│   │
│   └── effects/              # Visual effects
│       └── EmberEffect.vue
│
├── composables/              # Vue composables
│   ├── useScroll.js
│   └── useAnimation.js
│
├── views/                    # Page components
│   └── HomeRebuilt.vue
│
├── utils/                    # Utility functions
│   └── animations.js
│
├── data/                     # Data files
│   ├── services.js
│   └── timeline.js
│
├── styles/                   # Global styles
│   ├── main.scss             # Main stylesheet
│   ├── variables.scss        # SCSS variables
│   └── mixins.scss           # SCSS mixins
│
├── router/                   # Vue Router
│   └── index.js
│
├── store/                    # Vuex/Pinia store (if used)
│   └── index.js
│
├── App.vue                   # Root component
└── main.js                   # Entry point
```

## Key Organizational Principles

1. **Component Organization**
   - Components are grouped by function rather than technology
   - Common components are truly reusable across the application
   - Section components are organized by page/feature

2. **Feature-Based Structure**
   - Related components are kept together (e.g., chat components)
   - Specialized components have their own directories

3. **Clear Separation**
   - Views are separate from components
   - Business logic is separated from UI components
   - Global styles are separated from component-specific styles

4. **Naming Conventions**
   - Use PascalCase for component files (e.g., `HeroSection.vue`)
   - Use camelCase for utility files (e.g., `animations.js`)
   - Use kebab-case for style files (e.g., `variables.scss`)

## Migration Strategy

1. Create the new directory structure
2. Move files to their new locations
3. Update imports in all files
4. Test the application thoroughly
5. Remove any empty directories

## Benefits of This Structure

- Easier to find components by function
- Clearer separation of concerns
- More intuitive for new developers
- Better scalability for future growth
- Reduced duplication through proper organization