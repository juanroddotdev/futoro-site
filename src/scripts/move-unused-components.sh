#!/bin/bash

# Create destination directories
UNUSED_DIR="src/_unused"
mkdir -p "$UNUSED_DIR/vue"
mkdir -p "$UNUSED_DIR/js"

# Log file for documenting moved files
LOG_FILE="unused-files-log.md"
echo "# Unused Files Log" > "$LOG_FILE"
echo "Files moved on $(date)" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Create restore script
RESTORE_SCRIPT="restore-unused-files.sh"
echo "#!/bin/bash" > "$RESTORE_SCRIPT"
echo "" >> "$RESTORE_SCRIPT"
echo "# Script to restore moved files" >> "$RESTORE_SCRIPT"
echo "# Generated on $(date)" >> "$RESTORE_SCRIPT"
echo "" >> "$RESTORE_SCRIPT"
chmod +x "$RESTORE_SCRIPT"

# List of components from component-nesting-guide.md
declare -a USED_COMPONENTS=(
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

# Extract component names without extensions for checking related files
declare -a COMPONENT_NAMES=()
for comp in "${USED_COMPONENTS[@]}"; do
  base_name=$(basename "$comp" .vue)
  COMPONENT_NAMES+=("$base_name")
done

# Directories to exclude
EXCLUDE_DIRS="data|composables|scss"

# Process Vue files
echo "## Vue Files" >> "$LOG_FILE"
echo "Processing Vue files..."
ALL_VUE=$(find src -name "*.vue" -type f | grep -v "node_modules" | grep -v "_unused" | grep -v -E "$EXCLUDE_DIRS")

for file in $ALL_VUE; do
  # Check if file is in the used list
  if [[ ! " ${USED_COMPONENTS[@]} " =~ " ${file} " ]]; then
    # Move the file
    mv "$file" "$UNUSED_DIR/vue/$(basename "$file")"
    echo "- $file -> $UNUSED_DIR/vue/$(basename "$file")" >> "$LOG_FILE"
    echo "mkdir -p $(dirname "$file")" >> "$RESTORE_SCRIPT"
    echo "mv $UNUSED_DIR/vue/$(basename "$file") $file" >> "$RESTORE_SCRIPT"
    echo "Moved: $file"
  fi
done

# Process JS files
echo "" >> "$LOG_FILE"
echo "## JavaScript Files" >> "$LOG_FILE"
echo "Processing JavaScript files..."
ALL_JS=$(find src -name "*.js" -type f | grep -v "node_modules" | grep -v "_unused" | grep -v -E "$EXCLUDE_DIRS")

for file in $ALL_JS; do
  base_name=$(basename "$file" .js)
  is_related=false
  
  # Check if this JS file is related to a used component
  for comp_name in "${COMPONENT_NAMES[@]}"; do
    if [[ "$base_name" == "$comp_name" || "$base_name" == "${comp_name}Utils" || "$base_name" == "${comp_name}Helpers" ]]; then
      is_related=true
      break
    fi
  done
  
  if [[ "$is_related" == false ]]; then
    # Move the file
    mv "$file" "$UNUSED_DIR/js/$(basename "$file")"
    echo "- $file -> $UNUSED_DIR/js/$(basename "$file")" >> "$LOG_FILE"
    echo "mkdir -p $(dirname "$file")" >> "$RESTORE_SCRIPT"
    echo "mv $UNUSED_DIR/js/$(basename "$file") $file" >> "$RESTORE_SCRIPT"
    echo "Moved: $file"
  fi
done

echo "Process complete. Check $LOG_FILE for details."
echo "To restore files, run: bash $RESTORE_SCRIPT"
