# Component Nesting Structure Guide

This document provides a visual representation of how components are nested within the HomeRebuilt.vue page, which serves as the main landing page of the application.

## Deep Nested Component Structure

```
HomeRebuilt.vue
└── div.main-content
    ├── div.viewport-grid
    │   └── GridPaperOverlay.vue (floating grid background)
    │
    ├── HeroSectionChat.vue
    │   └── ScrollableChatSection.vue
    │       └── ScrollPinWrapper.vue
    │           └── div.scrollable-chat-section
    │               └── div.section-container
    │                   └── div.section-inner
    │                       ├── div.content-area
    │                       │   ├── h1.headline (heroContent.headline)
    │                       │   ├── p.subheadline (heroContent.subheadline)
    │                       │   └── div.flex (CTA buttons)
    │                       │
    │                       └── div.chat-area
    │                           └── FloatingChatInterface.vue
    │                               └── div.floating-chat
    │                                   ├── div.message-container
    │                                   │   └── [MessageBubble.vue] (multiple)
    │                                   └── TypingIndicator.vue (conditional)
    │
    ├── LazySection.vue (id="hurdles-solutions")
    │   └── HurdlesSolutionsSection.vue
    │       ├── ScrollableChatSectionV2.vue (intro section)
    │       │   └── ScrollPinWrapper.vue
    │       │       └── FloatingChatInterface.vue
    │       │
    │       ├── StickyScrollableCardsSection.vue (hurdles)
    │       │   └── ScrollPinWrapper.vue
    │       │       └── div.cards-container
    │       │           └── [Card.vue] (multiple hurdle cards)
    │       │
    │       ├── ScrollableChatSectionV2.vue (transition)
    │       │   └── (same structure as first ScrollableChatSectionV2)
    │       │
    │       └── StickyScrollableCardsSection.vue (solutions)
    │           └── (same structure as first StickyScrollableCardsSection)
    │
    ├── LazySection.vue (id="services")
    │   └── ServicesSection.vue
    │       ├── div.section-header
    │       │   ├── h2.section-title
    │       │   └── p.section-description
    │       │
    │       └── div.services-grid
    │           └── [ServiceCard.vue] (multiple service cards)
    │               └── div.service-card
    │                   ├── div.icon-container
    │                   ├── h3.service-title
    │                   └── p.service-description
    │
    └── LazySection.vue (id="timeline")
        └── TimelineHowItWorks.vue
            ├── div.timeline-header
            │   ├── h2.timeline-title
            │   └── p.timeline-description
            │
            └── div.timeline-container
                └── [TimelineItem.vue] (multiple timeline steps)
                    ├── div.timeline-marker
                    ├── div.timeline-content
                    │   ├── h3.step-title
                    │   └── p.step-description
                    └── div.timeline-connector (between items)
```

## Component Files List

Here's a comprehensive list of all Vue component files used in the HomeRebuilt page:

1. `src/views/HomeRebuilt.vue` - Main landing page
2. `src/components/GridPaperOverlay.vue` - Background grid effect
3. `src/components/sections/refactored/HeroSectionChat.vue` - Hero section with chat
4. `src/components/sections/refactored/ScrollableChatSection.vue` - Scrollable section with chat
5. `src/components/scroll/ScrollPinWrapper.vue` - Handles scroll-based pinning
6. `src/components/FloatingChatInterface.vue` - Chat interface with messages
7. `src/components/MessageBubble.vue` - Individual chat message
8. `src/components/TypingIndicator.vue` - Chat typing animation
9. `src/components/LazySection.vue` - Lazy-loading section wrapper
10. `src/components/sections/refactored/HurdlesSolutionsSection.vue` - Problems and solutions section
11. `src/components/sections/refactored/ScrollableChatSectionV2.vue` - Updated scrollable chat section
12. `src/components/sections/refactored/StickyScrollableCardsSection.vue` - Cards with sticky scroll effect
13. `src/components/Card.vue` - Individual card component
14. `src/components/sections/refactored/ServicesSection.vue` - Services showcase section
15. `src/components/ServiceCard.vue` - Individual service card
16. `src/components/sections/TimelineHowItWorks.vue` - Timeline section
17. `src/components/TimelineItem.vue` - Individual timeline step
18. `src/components/effects/EmberEffect.vue` - Particle animation effect

## Component Imports by File

### HomeRebuilt.vue

```typescript
import { ref, onMounted, computed } from 'vue';
import HeroSectionChat from '@/components/sections/refactored/HeroSectionChat.vue';
import HeroSection from '@/components/sections/refactored/HeroSection.vue'; // Commented out in code
import HurdlesSolutionsSection from '@/components/sections/refactored/HurdlesSolutionsSection.vue';
import LazySection from '@/components/LazySection.vue';
import Timeline from '@/components/sections/refactored/Timeline.vue'; // Commented out in code
import TimelineHowItWorks from '@/components/sections/TimelineHowItWorks.vue';
import ServicesSection from '@/components/sections/refactored/ServicesSection.vue';
import { useTheme } from '@/composables/useTheme';
import { useSectionLoader } from '@/composables/useSectionLoader';
import { HeroContent, getRandomHeroContent } from '@/data/heroContent';
```

### HeroSectionChat.vue

```typescript
import { ref, onMounted } from 'vue';
import ScrollableChatSection from '@/components/sections/refactored/ScrollableChatSection.vue';
import { getHeroMessages } from '@/data/chatMessages';
```

### HurdlesSolutionsSection.vue

```typescript
import { ref, computed } from 'vue';
import ScrollableChatSectionV2 from '@/components/sections/refactored/ScrollableChatSectionV2.vue';
import StickyScrollableCardsSection from '@/components/sections/refactored/StickyScrollableCardsSection.vue';
import EmberEffect from '@/components/effects/EmberEffect.vue';
import { getHurdlesIntroduction, getTransitionToSolutions } from '@/data/chatMessages';
import { struggles, solutions } from '@/data/hurdlesSolutions';
```

### ScrollableChatSectionV2.vue

```typescript
import { ref, onMounted, computed, watch } from 'vue';
import ScrollPinWrapper from '@/components/scroll/ScrollPinWrapper.vue';
import FloatingChatInterface from '@/components/FloatingChatInterface.vue';
```

### StickyScrollableCardsSection.vue

```typescript
import { ref, computed } from 'vue';
import ScrollPinWrapper from '@/components/scroll/ScrollPinWrapper.vue';
import Card from '@/components/Card.vue';
```

### ServicesSection.vue

```typescript
import { ref } from 'vue';
import ServiceCard from '@/components/ServiceCard.vue';
import { services } from '@/data/services';
```

### TimelineHowItWorks.vue

```typescript
import { ref, onMounted } from 'vue';
import TimelineItem from '@/components/TimelineItem.vue';
import { timelineSteps } from '@/data/timeline';
```

## Key Data Files

The components rely on several data files that provide content:

1. `src/data/heroContent.ts` - Content for the hero section
2. `src/data/chatMessages.ts` - Chat messages for various sections
3. `src/data/hurdlesSolutions.ts` - Content for hurdles and solutions cards
4. `src/data/services.ts` - Services information
5. `src/data/timeline.ts` - Timeline steps data

## Composables

Key composables used throughout the components:

1. `src/composables/useTheme.ts` - Theme management
2. `src/composables/useSectionLoader.ts` - Section loading and visibility tracking