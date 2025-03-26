#!/bin/bash

# Script to reorganize project files according to comprehensive-project-structure.md
# and update import paths in all files

# Set up logging
LOG_FILE="reorganization-log.md"
echo "# Project Reorganization Log" > "$LOG_FILE"
echo "Executed on $(date)" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Create backup
BACKUP_DIR="project-backup-$(date +%Y%m%d%H%M%S)"
echo "Creating backup in $BACKUP_DIR..."
mkdir -p "$BACKUP_DIR"
cp -r src "$BACKUP_DIR/"
echo "Backup created in $BACKUP_DIR" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Function to create directories if they don't exist
create_directories() {
  echo "## Creating Directory Structure" >> "$LOG_FILE"
  
  # Create main directories
  mkdir -p src/components/{common,layout,ui/{backgrounds,containers},sections/refactored,chat,text,effects}
  mkdir -p src/composables
  mkdir -p src/views
  mkdir -p src/utils
  mkdir -p src/data
  
  echo "Directory structure created" >> "$LOG_FILE"
  echo "" >> "$LOG_FILE"
}

# Function to move files to their new locations
move_files() {
  echo "## Moving Files" >> "$LOG_FILE"
  
  # Array of file moves [source,destination]
  declare -a FILE_MOVES=(
    # Common components
    "src/components/Card.vue,src/components/common/Card.vue"
    "src/components/MessageBubble.vue,src/components/common/MessageBubble.vue"
    "src/components/ServiceCard.vue,src/components/common/ServiceCard.vue"
    "src/components/TimelineItem.vue,src/components/common/TimelineItem.vue"
    
    # Layout components
    "src/components/layout/Navbar.vue,src/components/layout/Navbar.vue"
    "src/components/layout/Footer.vue,src/components/layout/Footer.vue"
    
    # UI components
    "src/components/GridPaperOverlay.vue,src/components/ui/backgrounds/GridPaperOverlay.vue"
    "src/components/scroll/ScrollPinWrapper.vue,src/components/ui/containers/ScrollPinWrapper.vue"
    
    # Section components
    "src/components/sections/refactored/HeroSectionChat.vue,src/components/sections/refactored/HeroSectionChat.vue"
    "src/components/sections/refactored/ScrollableChatSection.vue,src/components/sections/refactored/ScrollableChatSection.vue"
    "src/components/sections/refactored/ScrollableChatSectionV2.vue,src/components/sections/refactored/ScrollableChatSectionV2.vue"
    "src/components/sections/refactored/HurdlesSolutionsSection.vue,src/components/sections/refactored/HurdlesSolutionsSection.vue"
    "src/components/sections/refactored/ServicesSection.vue,src/components/sections/refactored/ServicesSection.vue"
    "src/components/sections/refactored/StickyScrollableCardsSection.vue,src/components/sections/refactored/StickyScrollableCardsSection.vue"
    "src/components/sections/TimelineHowItWorks.vue,src/components/sections/TimelineHowItWorks.vue"
    
    # Chat components
    "src/components/FloatingChatInterface.vue,src/components/chat/FloatingChatInterface.vue"
    "src/components/TypingIndicator.vue,src/components/chat/TypingIndicator.vue"
    
    # Text components
    "src/components/text/AnimatedText.vue,src/components/text/AnimatedText.vue"
    
    # Other components
    "src/components/LazySection.vue,src/components/LazySection.vue"
    "src/components/effects/EmberEffect.vue,src/components/effects/EmberEffect.vue"
    
    # Views
    "src/views/HomeRebuilt.vue,src/views/HomeRebuilt.vue"
    "src/views/Home.vue,src/views/Home.vue"
    "src/views/FloatingChatDemo.vue,src/views/FloatingChatDemo.vue"
    "src/views/ChatSectionsDemo.vue,src/views/ChatSectionsDemo.vue"
    "src/views/Playground.vue,src/views/Playground.vue"
    
    # Utils
    "src/utils/animations.js,src/utils/animations.js"
    "src/utils/titleCardEdgeDetection.js,src/utils/titleCardEdgeDetection.js"
    
    # Data files
    "src/data/services.js,src/data/services.js"
    "src/data/timeline.ts,src/data/timeline.ts"
    "src/data/chatMessages.ts,src/data/chatMessages.ts"
    "src/data/heroContent.ts,src/data/heroContent.ts"
    "src/data/hurdlesSolutions.ts,src/data/hurdlesSolutions.ts"
    
    # Composables
    "src/composables/useScroll.js,src/composables/useScroll.js"
    "src/composables/useAnimation.js,src/composables/useAnimation.js"
    "src/composables/useTheme.ts,src/composables/useTheme.ts"
    "src/composables/useSectionLoader.ts,src/composables/useSectionLoader.ts"
  )
  
  # Process each file move
  for move in "${FILE_MOVES[@]}"; do
    IFS=',' read -r source dest <<< "$move"
    
    # Check if source exists
    if [ -f "$source" ]; then
      # Create destination directory if it doesn't exist
      mkdir -p "$(dirname "$dest")"
      
      # Move the file
      mv "$source" "$dest"
      echo "- Moved: $source → $dest" >> "$LOG_FILE"
    else
      echo "- Warning: Source file not found: $source" >> "$LOG_FILE"
    fi
  done
  
  echo "" >> "$LOG_FILE"
}

# Function to update import paths in all files
update_imports() {
  echo "## Updating Import Paths" >> "$LOG_FILE"
  
  # Array of path replacements [old_pattern,new_pattern]
  declare -a PATH_REPLACEMENTS=(
    # Common components
    "@/components/Card,@/components/common/Card"
    "@/components/MessageBubble,@/components/common/MessageBubble"
    "@/components/ServiceCard,@/components/common/ServiceCard"
    "@/components/TimelineItem,@/components/common/TimelineItem"
    
    # UI components
    "@/components/GridPaperOverlay,@/components/ui/backgrounds/GridPaperOverlay"
    "@/components/scroll/ScrollPinWrapper,@/components/ui/containers/ScrollPinWrapper"
    
    # Chat components
    "@/components/FloatingChatInterface,@/components/chat/FloatingChatInterface"
    "@/components/TypingIndicator,@/components/chat/TypingIndicator"
    
    # Relative path replacements (more complex, handle with care)
    "../GridPaperOverlay,../../ui/backgrounds/GridPaperOverlay"
    "../scroll/ScrollPinWrapper,../../ui/containers/ScrollPinWrapper"
    "../FloatingChatInterface,../../chat/FloatingChatInterface"
    "../TypingIndicator,../../chat/TypingIndicator"
    "../Card,../../common/Card"
    "../MessageBubble,../../common/MessageBubble"
    "../ServiceCard,../../common/ServiceCard"
    "../TimelineItem,../../common/TimelineItem"
  )
  
  # Find all .vue, .js, and .ts files
  FILES=$(find src -type f \( -name "*.vue" -o -name "*.js" -o -name "*.ts" \) -not -path "*/node_modules/*" -not -path "*/dist/*")
  
  # Process each file
  for file in $FILES; do
    file_modified=false
    
    # Apply each replacement
    for replacement in "${PATH_REPLACEMENTS[@]}"; do
      IFS=',' read -r old_pattern new_pattern <<< "$replacement"
      
      # Check if the file contains the pattern
      if grep -q "$old_pattern" "$file"; then
        # Replace the pattern
        sed -i "s|$old_pattern|$new_pattern|g" "$file"
        file_modified=true
      fi
    done
    
    # Log if file was modified
    if [ "$file_modified" = true ]; then
      echo "- Updated imports in: $file" >> "$LOG_FILE"
    fi
  done
  
  echo "" >> "$LOG_FILE"
}

# Function to clean up empty directories
cleanup() {
  echo "## Cleaning Up" >> "$LOG_FILE"
  
  # Find and remove empty directories
  find src -type d -empty -delete
  echo "Empty directories removed" >> "$LOG_FILE"
  echo "" >> "$LOG_FILE"
}

# Main execution
echo "Starting project reorganization..."
create_directories
move_files
update_imports
cleanup

echo "Project reorganization complete. See $LOG_FILE for details."
echo "" >> "$LOG_FILE"
echo "## Next Steps" >> "$LOG_FILE"
echo "1. Run your tests to ensure everything works correctly" >> "$LOG_FILE"
echo "2. Check for any import errors and fix them manually" >> "$LOG_FILE"
echo "3. Update any documentation that references file paths" >> "$LOG_FILE"
echo "4. If needed, restore from backup at $BACKUP_DIR" >> "$LOG_FILE"