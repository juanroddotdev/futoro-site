#!/bin/bash

# Script to restore specific files from the unused directory
# Usage: ./restore-specific-files.sh file1.vue file2.js file3.vue

UNUSED_DIR="src/_unused"
LOG_FILE="restored-files-log.md"

# Check if the unused directory exists
if [ ! -d "$UNUSED_DIR" ]; then
  echo "Error: Unused directory $UNUSED_DIR does not exist."
  exit 1
fi

# Create log file
echo "# Restored Files Log" > "$LOG_FILE"
echo "Files restored on $(date)" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Function to restore a file
restore_file() {
  local filename=$1
  local extension="${filename##*.}"
  local subdir=""
  
  # Determine subdirectory based on file extension
  case "$extension" in
    vue)
      subdir="vue"
      ;;
    js)
      subdir="js"
      ;;
    *)
      echo "Unsupported file extension: $extension"
      return 1
      ;;
  esac
  
  # Check if file exists in the unused directory
  if [ -f "$UNUSED_DIR/$subdir/$filename" ]; then
    # Get original path from restore-unused-files.sh
    original_path=$(grep -m 1 "mv $UNUSED_DIR/$subdir/$filename " restore-unused-files.sh | awk '{print $3}')
    
    if [ -n "$original_path" ]; then
      # Create directory if it doesn't exist
      mkdir -p "$(dirname "$original_path")"
      
      # Move file back to original location
      mv "$UNUSED_DIR/$subdir/$filename" "$original_path"
      echo "Restored: $filename -> $original_path"
      echo "- $filename -> $original_path" >> "$LOG_FILE"
    else
      echo "Could not find original path for $filename"
      echo "- $filename: Original path not found" >> "$LOG_FILE"
    fi
  else
    echo "File not found: $UNUSED_DIR/$subdir/$filename"
    echo "- $filename: Not found in unused directory" >> "$LOG_FILE"
  fi
}

# Check if any files were specified
if [ $# -eq 0 ]; then
  echo "Usage: $0 file1.vue file2.js file3.vue"
  exit 1
fi

# Process each specified file
for file in "$@"; do
  restore_file "$(basename "$file")"
done

echo "Restoration complete. Check $LOG_FILE for details."