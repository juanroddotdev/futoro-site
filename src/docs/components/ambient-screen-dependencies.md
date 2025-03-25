# AmbientScreen Component Dependencies

## Overview

The `AmbientScreen.vue` component displays a lock screen-like interface with time, date, and loading dots animation. This document outlines all dependencies required for the component to function properly.

## Direct Dependencies

1. **LoadingDots.vue**
   - Imported directly in AmbientScreen.vue
   - Provides the animated dots shown at the bottom of the ambient screen
   - Used to indicate the pull-to-unlock functionality

## Parent Components That Use AmbientScreen

1. **PhoneSection.vue (refactored version)**
   - Uses AmbientScreen as a child component
   - Passes props like time, date, theme, and enablePullEffect
   - Handles the unlock animation transition from ambient to chat screen

2. **ScrollablePhoneSection.vue**
   - A higher-level component that uses PhoneSection
   - Configures ambient mode settings and theme

3. **PhoneContentLayout.vue**
   - Another higher-level component that can use PhoneSection
   - Provides layout configuration for the phone UI

## Utility Files

1. **usePullEffect.ts**
   - Composable that implements the pull-to-unlock gesture detection
   - Calls the `applyAmbientPullEffect` function from ambientEffects.ts
   - Connects to AmbientScreen through the parent components

2. **useAmbientTime.ts**
   - Composable that provides reactive time and date values
   - Used by parent components to pass time/date props to AmbientScreen

3. **ambientEffects.ts**
   - Contains functions for visual effects like `applyAmbientPullEffect` and `resetAmbientScreen`
   - Used to create the pull effect gradient and animations

4. **phoneAnimations.ts**
   - Contains animation functions like `performUnlockAnimation` and `performRippleUnlockAnimation`
   - Used when transitioning from ambient screen to chat screen

## Flow of Operation

1. Parent components (PhoneSection) create an instance of AmbientScreen
2. Time/date values are provided via useAmbientTime composable
3. Pull effects are managed via usePullEffect composable
4. When pull threshold is reached, AmbientScreen emits an event
5. Parent component handles the event and triggers unlock animations
6. Unlock animations are performed using functions from phoneAnimations.ts

This architecture separates concerns nicely, with AmbientScreen focusing on presentation while parent components and utility files handle the more complex interactions and animations.