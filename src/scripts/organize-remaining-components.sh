#!/bin/bash

# Create necessary directories
mkdir -p src/components/ui/loaders
mkdir -p src/components/ui/theme

# Move LoadingDots.vue
if [ -f "src/components/LoadingDots.vue" ]; then
  mv src/components/LoadingDots.vue src/components/ui/loaders/LoadingDots.vue
  echo "Moved LoadingDots.vue to ui/loaders directory"
fi

# Move ThemeSwitcher.vue
if [ -f "src/components/ThemeSwitcher.vue" ]; then
  mv src/components/ThemeSwitcher.vue src/components/ui/theme/ThemeSwitcher.vue
  echo "Moved ThemeSwitcher.vue to ui/theme directory"
fi

# LazySection.vue stays in the root components directory
echo "LazySection.vue remains in the root components directory as per the structure"