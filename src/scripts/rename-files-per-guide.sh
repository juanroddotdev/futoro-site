#!/bin/bash

# Script to rename files according to file-naming-guide.md
echo "Renaming files according to file-naming-guide.md..."

# Function to ask for confirmation
confirm_rename() {
  local old_path="$1"
  local new_path="$2"
  
  if [ "$CONFIRM_ALL" = "true" ]; then
    return 0
  fi
  
  # Make sure to flush output before prompt
  echo -n "Rename '$old_path' to '$new_path'? (y/n/a - yes to all/s - skip all): "
  read -r response
  
  case "$response" in
    a|A)
      CONFIRM_ALL="true"
      return 0
      ;;
    s|S)
      SKIP_ALL="true"
      return 1
      ;;
    y|Y)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

# Initialize flags
CONFIRM_ALL="false"
SKIP_ALL="false"

# Create a log file
LOG_FILE="rename-files-log-$(date +%Y%m%d%H%M%S).txt"
echo "# File Renaming Log - $(date)" > "$LOG_FILE"
echo "Old Path,New Path,Status" >> "$LOG_FILE"

# Function to update imports in files
update_imports() {
  local old_path="$1"
  local new_path="$2"
  
  # Extract the base names without extensions
  local old_base=$(basename "$old_path" | cut -f1 -d.)
  local new_base=$(basename "$new_path" | cut -f1 -d.)
  
  # Extract the paths without the filename
  local old_dir=$(dirname "$old_path")
  local new_dir=$(dirname "$new_path")
  
  # Create import patterns
  local old_import_pattern="@/$old_dir/$old_base"
  local new_import_pattern="@/$new_dir/$new_base"
  
  # If the directories are the same, just replace the filename
  if [ "$old_dir" = "$new_dir" ]; then
    old_import_pattern="$old_base"
    new_import_pattern="$new_base"
  fi
  
  echo "Updating imports: $old_import_pattern -> $new_import_pattern"
  
  # Find all .vue, .js, and .ts files
  find src -type f \( -name "*.vue" -o -name "*.js" -o -name "*.ts" \) -not -path "*/node_modules/*" -not -path "*/dist/*" | while read -r file; do
    # Check if the file contains the old import
    if grep -q "$old_import_pattern" "$file"; then
      echo "  Updating imports in $file"
      sed -i "s|$old_import_pattern|$new_import_pattern|g" "$file"
    fi
  done
}

# Process file renaming
process_rename() {
  local old_path="$1"
  local new_path="$2"
  
  # Check if the old path exists
  if [ -f "$old_path" ]; then
    # Create the destination directory if it doesn't exist
    mkdir -p "$(dirname "$new_path")"
    
    # Ask for confirmation
    if [ "$SKIP_ALL" = "true" ]; then
      echo "Skipping $old_path (skip all)"
      echo "$old_path,$new_path,Skipped" >> "$LOG_FILE"
      return
    fi
    
    if confirm_rename "$old_path" "$new_path"; then
      # Rename the file
      mv "$old_path" "$new_path"
      echo "Renamed: $old_path -> $new_path"
      echo "$old_path,$new_path,Renamed" >> "$LOG_FILE"
      
      # Update imports in other files
      update_imports "$old_path" "$new_path"
    else
      echo "Skipped: $old_path"
      echo "$old_path,$new_path,Skipped" >> "$LOG_FILE"
    fi
  else
    echo "File not found: $old_path"
    echo "$old_path,$new_path,Not Found" >> "$LOG_FILE"
  fi
}

# Common components
process_rename "src/components/common/Card.vue" "src/components/common/BaseCard.vue"
process_rename "src/components/Card.vue" "src/components/common/BaseCard.vue"
process_rename "src/components/common/MessageBubble.vue" "src/components/common/ChatBubble.vue"
process_rename "src/components/MessageBubble.vue" "src/components/common/ChatBubble.vue"

# Components/UI
process_rename "src/components/ui/backgrounds/GridPaperOverlay.vue" "src/components/ui/backgrounds/PaperGridBackground.vue"
process_rename "src/components/GridPaperOverlay.vue" "src/components/ui/backgrounds/PaperGridBackground.vue"
process_rename "src/components/ui/containers/ScrollPinWrapper.vue" "src/components/ui/containers/StickyScrollContainer.vue"
process_rename "src/components/scroll/ScrollPinWrapper.vue" "src/components/ui/containers/StickyScrollContainer.vue"

# Components/Sections/Refactored
process_rename "src/components/sections/HeroSectionChat.vue" "src/components/sections/ChatHeroSection.vue"
process_rename "src/components/sections/ScrollableChatSection.vue" "src/components/sections/ChatScrollSection.vue"
process_rename "src/components/sections/ScrollableChatSectionV2.vue" "src/components/sections/ChatScrollSectionV2.vue"
process_rename "src/components/sections/HurdlesSolutionsSection.vue" "src/components/sections/ProblemSolutionSection.vue"
process_rename "src/components/sections/StickyScrollableCardsSection.vue" "src/components/sections/StickyCardSection.vue"

# Components/Chat
process_rename "src/components/chat/FloatingChatInterface.vue" "src/components/chat/FloatingChat.vue"
process_rename "src/components/FloatingChatInterface.vue" "src/components/chat/FloatingChat.vue"
process_rename "src/components/chat/TypingIndicator.vue" "src/components/chat/ChatTypingIndicator.vue"
process_rename "src/components/TypingIndicator.vue" "src/components/chat/ChatTypingIndicator.vue"

# Components/Text
process_rename "src/components/text/AnimatedText.vue" "src/components/text/TextAnimation.vue"
process_rename "src/components/AnimatedText.vue" "src/components/text/TextAnimation.vue"

# Components/Effects
process_rename "src/components/effects/EmberEffect.vue" "src/components/effects/EmberAnimation.vue"
process_rename "src/components/EmberEffect.vue" "src/components/effects/EmberAnimation.vue"

# Views
process_rename "src/views/HomeRebuilt.vue" "src/views/HomePage.vue"
process_rename "src/views/FloatingChatDemo.vue" "src/views/ChatDemoPage.vue"
process_rename "src/views/ChatSectionsDemo.vue" "src/views/ChatSectionsDemoPage.vue"
process_rename "src/views/Playground.vue" "src/views/ComponentPlayground.vue"

# Composables
process_rename "src/composables/useSectionLoader.ts" "src/composables/useLazySection.ts"

# Utils
process_rename "src/utils/animations.js" "src/utils/animationUtils.js"
process_rename "src/utils/titleCardEdgeDetection.js" "src/utils/cardEdgeDetection.js"

# Data Files
process_rename "src/data/services.js" "src/data/servicesData.js"
process_rename "src/data/timeline.ts" "src/data/timelineData.ts"
process_rename "src/data/chatMessages.ts" "src/data/chatMessagesData.ts"
process_rename "src/data/heroContent.ts" "src/data/heroContentData.ts"
process_rename "src/data/hurdlesSolutions.ts" "src/data/problemSolutionsData.ts"

echo "Renaming complete! Check $LOG_FILE for details."
echo "Note: You may need to manually update some imports if they weren't caught by the automatic process."
