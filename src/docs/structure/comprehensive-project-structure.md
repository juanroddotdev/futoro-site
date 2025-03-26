# Comprehensive Project Structure

This document provides a complete overview of all files in the project, organized in a logical structure.

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
│   │   ├── ServiceCard.vue
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
│   │   ├
│   │   ├── HeroSectionChat.vue
│   │   ├── ScrollableChatSection.vue
│   │   ├── ScrollableChatSectionV2.vue
│   │   ├── HurdlesSolutionsSection.vue
│   │   ├── ServicesSection.vue
│   │   ├── StickyScrollableCardsSection.vue
│   │   └── TimelineHowItWorks.vue
│   │
│   ├── chat/                 # Chat-related components
│   │   ├── FloatingChatInterface.vue
│   │   └── TypingIndicator.vue
│   │
│   ├── text/                 # Text-related components
│   │   └── AnimatedText.vue
│   │
│   ├── LazySection.vue       # Lazy loading component
│   └── effects/              # Visual effects
│       └── EmberEffect.vue
│
├── composables/              # Vue composables
│   ├── useScroll.js
│   ├── useAnimation.js
│   ├── useTheme.ts
│   └── useSectionLoader.ts
│
├── views/                    # Page components
│   ├── HomeRebuilt.vue       # Main landing page
│   ├── Home.vue              # Original home page
│   ├── FloatingChatDemo.vue  # Chat demo page
│   ├── ChatSectionsDemo.vue  # Chat sections demo
│   └── Playground.vue        # Component playground
│
├── utils/                    # Utility functions
│   ├── animations.js
│   └── titleCardEdgeDetection.js
│
├── data/                     # Data files
│   ├── services.js           # Services information
│   ├── timeline.ts           # Timeline data
│   ├── chatMessages.ts       # Chat messages
│   ├── heroContent.ts        # Hero section content
│   └── hurdlesSolutions.ts   # Problems and solutions data
│
├
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

## File Organization Principles

1. **Component Organization**
   - Components are grouped by function and purpose
   - Common components are separated from specialized ones
   - Section components are organized by page/feature

2. **Feature-Based Structure**
   - Related components are kept together (e.g., chat components)
   - Specialized components have their own directories

3. **Documentation**
   - Documentation is organized by topic
   - Maintenance guides are separated from structure documentation
   - Component documentation is kept with the components

4. **Styles Organization**
   - SCSS files are organized by function
   - Component styles are separated from layout styles
   - Theme styles are kept in their own directory

5. **Data and Utilities**
   - Data files are kept separate from components
   - Utility functions are organized by purpose
   - Scripts are kept in their own directory

## Migration Strategy

1. Create the new directory structure
2. Move files to their new locations
3. Update imports in all files
4. Test the application thoroughly
5. Remove any empty directories

## Benefits of This Structure

- Complete organization of all project files
- Clear separation of concerns
- Intuitive navigation for developers
- Scalable structure for future growth
- Proper documentation integration