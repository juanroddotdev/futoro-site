# Component Props Analysis

This document tracks which props should remain configurable vs. which could be moved to internal defaults for components used in the Hurdles page.

## AnimatedOutlineToFillText

### Current Props
```typescript
text: string
fillPercentage: number
animation: TextAnimationType
duration: number
delay: number
ease: string
initiallyHidden: boolean
triggerOnVisible: boolean
animateFill: boolean
fillDuration: number
fillDelay: number
triggerOnScroll: boolean
scrollStart: string
scrollEnd: string
scrub: boolean | number
fillScrollStart: string
fillScrollEnd: string
fluidFill: boolean
fluidFillDuration: number
fluidFillDirection: string
fluidFillOverflow: string
transparentFill: boolean
transparentFillDuration: number
```

### Recommended Props to Keep
```typescript
text: string                    // Required for content
animation: TextAnimationType    // Core animation type
initiallyHidden: boolean        // Initial visibility state
triggerOnScroll: boolean        // Scroll trigger control
animateFill: boolean           // Core fill animation control
```

### Props to Move to Internal Defaults
```typescript
// Animation Timing
duration: number               // Could be based on animation type
delay: number                  // Could be based on animation type
ease: string                   // Could be based on animation type
fillDuration: number           // Could be based on animation type
fillDelay: number              // Could be based on animation type

// Scroll Configuration
scrollStart: string            // Could be based on section type
scrollEnd: string              // Could be based on section type
scrub: boolean | number        // Could be based on animation type
fillScrollStart: string        // Could be based on section type
fillScrollEnd: string          // Could be based on section type

// Fill Effects
fluidFill: boolean             // Could be based on animation type
fluidFillDuration: number      // Could be based on animation type
fluidFillDirection: string     // Could be based on animation type
fluidFillOverflow: string      // Could be based on animation type
transparentFill: boolean       // Could be based on animation type
transparentFillDuration: number // Could be based on animation type
```

## TextAnimation

### Current Props
```typescript
firstPart: string
secondPart: string
suffix: string
useGradient: boolean
animation: string
duration: number
delay: number
ease: string
resetKey: number
triggerOnVisible: boolean
restartOnVisible: boolean
initiallyHidden: boolean
wordEffects: boolean
wordTargets: string[]
wordEffectTypes: string[]
wordEffectStyles: EffectStyle[]
wordEffectDuration: number
wordEffectDelay: number
wordEffectClasses: string[]
instanceId: string
triggerOnScroll: boolean
scrollStart: string
scrollEnd: string
scrub: boolean | number
```

### Recommended Props to Keep
```typescript
firstPart: string              // Required for content
secondPart: string             // Required for content
animation: string              // Core animation type
initiallyHidden: boolean       // Initial visibility state
triggerOnScroll: boolean       // Scroll trigger control
wordEffects: boolean           // Core word effects control
wordTargets: string[]          // Required for word effects
wordEffectClasses: string[]    // Required for word effects styling
```

### Props to Move to Internal Defaults
```typescript
// Animation Timing
duration: number               // Could be based on animation type
delay: number                  // Could be based on animation type
ease: string                   // Could be based on animation type
wordEffectDuration: number     // Could be based on animation type
wordEffectDelay: number        // Could be based on animation type

// Scroll Configuration
scrollStart: string            // Could be based on section type
scrollEnd: string              // Could be based on section type
scrub: boolean | number        // Could be based on animation type

// Styling
useGradient: boolean           // Could be based on animation type

// Internal State
resetKey: number               // Internal state management
restartOnVisible: boolean      // Internal state management
instanceId: string             // Internal state management
```

## EmberAnimation

### Current Props
```typescript
targetElement: HTMLElement
effectType: string
particleCount: number
duration: number
colors: string[]
relativeToParent: boolean
startDelay: number
active: boolean
ease: string
offsetX: number
offsetY: number
originX: number
originY: number
```

### Recommended Props to Keep
```typescript
targetElement: HTMLElement     // Required for positioning
effectType: string             // Core effect type
active: boolean                // Control effect state
```

### Props to Move to Internal Defaults
```typescript
// Effect Configuration
particleCount: number          // Could be based on effect type
duration: number               // Could be based on effect type
colors: string[]               // Could be based on effect type
ease: string                   // Could be based on effect type

// Positioning
relativeToParent: boolean      // Could be based on effect type
startDelay: number             // Could be based on effect type
offsetX: number                // Could be based on effect type
offsetY: number                // Could be based on effect type
originX: number                // Could be based on effect type
originY: number                // Could be based on effect type
```

## Next Steps

1. For each component, create internal configuration objects that contain the default values
2. Update the components to use these internal configurations
3. Keep only the essential props that truly need to be configurable
4. Add TypeScript interfaces for the configuration objects
5. Consider creating a shared animation configuration system for consistent timing and easing across components

## Notes

- This analysis is based on the current usage in the Hurdles page
- Some props might need to remain configurable if they're used differently in other sections
- Consider creating a shared animation configuration system for consistent timing and easing across components
- The internal defaults should be easily overridable if needed for special cases 