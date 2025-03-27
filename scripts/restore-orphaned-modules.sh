#!/bin/bash
# Script to restore orphaned modules

mkdir -p src/utils
mv src/_unused/depWarnings/progressiveReveal.ts src/utils/progressiveReveal.ts
mkdir -p src/utils
mv src/_unused/depWarnings/icons.ts src/utils/icons.ts
mkdir -p src/data
mv src/_unused/depWarnings/aboutSectionData.ts src/data/aboutSectionData.ts
mkdir -p src/composables
mv src/_unused/depWarnings/useScrollAnimation.ts src/composables/useScrollAnimation.ts
mkdir -p src/composables
mv src/_unused/depWarnings/useElementPositioning.js src/composables/useElementPositioning.js
mkdir -p src/components
mv src/_unused/depWarnings/NotFound.vue src/components/NotFound.vue
mkdir -p src/animations
mv src/_unused/depWarnings/strugglesOffersTabs.ts src/animations/strugglesOffersTabs.ts
mkdir -p src/animations
mv src/_unused/depWarnings/servicesSection.ts src/animations/servicesSection.ts
mkdir -p src/animations
mv src/_unused/depWarnings/heroSection.ts src/animations/heroSection.ts
mkdir -p src/animations
mv src/_unused/depWarnings/contactSection.ts src/animations/contactSection.ts
mkdir -p src/animations
mv src/_unused/depWarnings/aboutSectionAlt.ts src/animations/aboutSectionAlt.ts
