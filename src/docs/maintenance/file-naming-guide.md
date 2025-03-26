# File Naming Conventions Guide

This document provides recommendations for renaming files to improve consistency, clarity, and maintainability across the project.

## Naming Principles

1. **Consistency**: Use consistent naming patterns across similar file types
2. **Clarity**: Names should clearly indicate the file's purpose
3. **Specificity**: Names should be specific enough to understand the file's role
4. **Brevity**: Names should be concise while still being descriptive

## Component Renaming Suggestions

### Components/Common

| Current Name | Suggested Name | Rationale |
|--------------|----------------|-----------|
| `Card.vue` | `BaseCard.vue` | Prefix with "Base" to indicate it's a foundational component |
| `MessageBubble.vue` | `ChatBubble.vue` | More common terminology for this UI element |
| `ServiceCard.vue` | `ServiceCard.vue` | Already clear and specific |
| `TimelineItem.vue` | `TimelineItem.vue` | Already clear and specific |

### Components/UI

| Current Name | Suggested Name | Rationale |
|--------------|----------------|-----------|
| `GridPaperOverlay.vue` | `PaperGridBackground.vue` | More descriptive of its function as a background |
| `ScrollPinWrapper.vue` | `StickyScrollContainer.vue` | More intuitive name for developers familiar with CSS |

### Components/Sections/Refactored

| Current Name | Suggested Name | Rationale |
|--------------|----------------|-----------|
| `HeroSectionChat.vue` | `ChatHeroSection.vue` | Consistent with other component naming |
| `ScrollableChatSection.vue` | `ChatScrollSection.vue` | More concise |
| `ScrollableChatSectionV2.vue` | `ChatScrollSectionV2.vue` | More concise and consistent with above |
| `HurdlesSolutionsSection.vue` | `ProblemSolutionSection.vue` | More generic and reusable name |
| `StickyScrollableCardsSection.vue` | `StickyCardSection.vue` | Shorter, more concise |

### Components/Chat

| Current Name | Suggested Name | Rationale |
|--------------|----------------|-----------|
| `FloatingChatInterface.vue` | `FloatingChat.vue` | More concise |
| `TypingIndicator.vue` | `ChatTypingIndicator.vue` | Prefix with "Chat" for better context |

### Components/Text

| Current Name | Suggested Name | Rationale |
|--------------|----------------|-----------|
| `AnimatedText.vue` | `TextAnimation.vue` | Noun-first naming for consistency |

### Components/Effects

| Current Name | Suggested Name | Rationale |
|--------------|----------------|-----------|
| `EmberEffect.vue` | `EmberAnimation.vue` | Clearer indication that it's an animation |

### Views

| Current Name | Suggested Name | Rationale |
|--------------|----------------|-----------|
| `HomeRebuilt.vue` | `HomePage.vue` | Simpler, more standard naming |
| `FloatingChatDemo.vue` | `ChatDemoPage.vue` | More consistent with page naming |
| `ChatSectionsDemo.vue` | `ChatSectionsDemoPage.vue` | More consistent with page naming |
| `Playground.vue` | `ComponentPlayground.vue` | More descriptive |

### Composables

| Current Name | Suggested Name | Rationale |
|--------------|----------------|-----------|
| `useScroll.js` | `useScroll.js` | Already follows Vue conventions |
| `useAnimation.js` | `useAnimation.js` | Already follows Vue conventions |
| `useTheme.ts` | `useTheme.ts` | Already follows Vue conventions |
| `useSectionLoader.ts` | `useLazySection.ts` | More specific to its purpose |

### Utils

| Current Name | Suggested Name | Rationale |
|--------------|----------------|-----------|
| `animations.js` | `animationUtils.js` | Add "Utils" suffix for clarity |
| `titleCardEdgeDetection.js` | `cardEdgeDetection.js` | More generic for reusability |

### Data Files

| Current Name | Suggested Name | Rationale |
|--------------|----------------|-----------|
| `services.js` | `servicesData.js` | Add "Data" suffix for clarity |
| `timeline.ts` | `timelineData.ts` | Add "Data" suffix for clarity |
| `chatMessages.ts` | `chatMessagesData.ts` | Add "Data" suffix for clarity |
| `heroContent.ts` | `heroContentData.ts` | Add "Data" suffix for clarity |
| `hurdlesSolutions.ts` | `problemSolutionsData.ts` | Rename to match component naming |

## Implementation Strategy

1. **Gradual Approach**: Rename files in small batches to minimize disruption
2. **Update References**: Update all import statements and references after renaming
3. **Test Thoroughly**: Test the application after each batch of renames
4. **Update Documentation**: Update documentation to reflect new file names

## Benefits of Consistent Naming

1. **Improved Developer Experience**: Easier to find and understand files
2. **Better Maintainability**: Clearer organization and purpose
3. **Easier Onboarding**: New developers can understand the codebase faster
4. **Reduced Cognitive Load**: Less mental effort required to navigate the project