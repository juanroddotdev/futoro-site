#!/bin/bash

# Create destination directory
DEST_DIR="src/components/export-to-main/home-rebuilt"
mkdir -p "$DEST_DIR"

# Array of component paths from the nesting guide
declare -a COMPONENTS=(
  "src/views/HomeRebuilt.vue"
  "src/components/GridPaperOverlay.vue"
  "src/components/sections/refactored/HeroSectionChat.vue"
  "src/components/sections/refactored/ScrollableChatSection.vue"
  "src/components/scroll/ScrollPinWrapper.vue"
  "src/components/FloatingChatInterface.vue"
  "src/components/MessageBubble.vue"
  "src/components/TypingIndicator.vue"
  "src/components/LazySection.vue"
  "src/components/sections/refactored/HurdlesSolutionsSection.vue"
  "src/components/sections/refactored/ScrollableChatSectionV2.vue"
  "src/components/sections/refactored/StickyScrollableCardsSection.vue"
  "src/components/Card.vue"
  "src/components/sections/refactored/ServicesSection.vue"
  "src/components/ServiceCard.vue"
  "src/components/sections/TimelineHowItWorks.vue"
  "src/components/TimelineItem.vue"
  "src/components/effects/EmberEffect.vue"
)

# Data files needed
declare -a DATA_FILES=(
  "src/data/heroContent.ts"
  "src/data/chatMessages.ts"
  "src/data/hurdlesSolutions.ts"
  "src/data/services.ts"
  "src/data/timeline.ts"
)

# Composables needed
declare -a COMPOSABLES=(
  "src/composables/useTheme.ts"
  "src/composables/useSectionLoader.ts"
)

# Copy components while preserving directory structure
for component in "${COMPONENTS[@]}"; do
  if [ -f "$component" ]; then
    # Create the directory structure in the destination
    mkdir -p "$DEST_DIR/$(dirname "$component")"
    # Copy the file
    cp "$component" "$DEST_DIR/$component"
    echo "Copied $component to $DEST_DIR/$component"
  else
    echo "Warning: $component not found"
  fi
done

# Copy data files
for data_file in "${DATA_FILES[@]}"; do
  if [ -f "$data_file" ]; then
    mkdir -p "$DEST_DIR/$(dirname "$data_file")"
    cp "$data_file" "$DEST_DIR/$data_file"
    echo "Copied $data_file to $DEST_DIR/$data_file"
  else
    echo "Warning: $data_file not found"
  fi
done

# Copy composables
for composable in "${COMPOSABLES[@]}"; do
  if [ -f "$composable" ]; then
    mkdir -p "$DEST_DIR/$(dirname "$composable")"
    cp "$composable" "$DEST_DIR/$composable"
    echo "Copied $composable to $DEST_DIR/$composable"
  else
    echo "Warning: $composable not found"
  fi
done

# Create an integration guide
cat > "$DEST_DIR/integration-guide.md" << 'EOL'
# HomeRebuilt Component Integration Guide

This folder contains all components needed for the HomeRebuilt page, organized in their original directory structure.

## Directory Structure

The components maintain their original directory structure to preserve imports. The main components are:

- `src/views/HomeRebuilt.vue` - Main landing page
- Various components in `src/components/` and subdirectories
- Data files in `src/data/`
- Composables in `src/composables/`

## Integration Steps

1. Copy all files and folders to your project, maintaining the directory structure
2. Ensure all dependencies are installed (Vue 3, GSAP if used for animations)
3. Add the route for HomeRebuilt.vue in your router configuration
4. Test the page to ensure all components are working correctly

## Component Hierarchy

See the component-nesting-guide.md for a detailed visualization of how components are nested.

## Customization

- Update content in the data files to customize text and information
- Adjust styling by modifying the component CSS or applying your theme variables
- Add or remove sections by editing the HomeRebuilt.vue template
EOL

echo "Created integration guide at $DEST_DIR/integration-guide.md"
echo "All components have been copied to $DEST_DIR"