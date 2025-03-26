#!/bin/bash

echo "Searching for missing components..."

# List of missing components from the previous run
declare -a MISSING_COMPONENTS=(
  "src/components/GridPaperOverlay.vue"
  "src/components/scroll/ScrollPinWrapper.vue"
  "src/components/MessageBubble.vue"
  "src/components/Card.vue"
  "src/components/ServiceCard.vue"
  "src/components/TimelineItem.vue"
  "src/data/chatMessages.ts"
  "src/data/hurdlesSolutions.ts"
  "src/data/timeline.ts"
)

# Destination directory
DEST_DIR="src/components/export-to-main/home-rebuilt"

# Search for each missing component
for component in "${MISSING_COMPONENTS[@]}"; do
  base_name=$(basename "$component")
  echo "Looking for $base_name..."
  
  # Find all files with the same name
  found_files=$(find src -name "$base_name" -type f 2>/dev/null)
  
  if [ -n "$found_files" ]; then
    echo "Found potential matches for $base_name:"
    echo "$found_files"
    
    # If only one match is found, copy it
    if [ $(echo "$found_files" | wc -l) -eq 1 ]; then
      found_file=$(echo "$found_files")
      mkdir -p "$DEST_DIR/$(dirname "$component")"
      cp "$found_file" "$DEST_DIR/$component"
      echo "Copied $found_file to $DEST_DIR/$component"
    else
      echo "Multiple matches found. Please manually select the correct one."
    fi
  else
    echo "No matches found for $base_name"
    
    # Try a more flexible search for similar files
    echo "Searching for similar files..."
    similar_files=$(find src -name "*$(echo "$base_name" | cut -d. -f1)*" -type f 2>/dev/null)
    
    if [ -n "$similar_files" ]; then
      echo "Found similar files:"
      echo "$similar_files"
    else
      echo "No similar files found."
    fi
  fi
  
  echo "-----------------------------------"
done

# Check for UI components in a ui directory
echo "Checking for UI components in ui directory..."
ui_components=$(find src -path "*/ui/*" -name "*.vue" -type f 2>/dev/null)
if [ -n "$ui_components" ]; then
  echo "Found UI components:"
  echo "$ui_components"
fi

echo "Search complete. Please review the results and manually copy any needed files."