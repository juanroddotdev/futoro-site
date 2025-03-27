#!/bin/bash

# Script to move orphaned modules to _unused/depWarnings directory
# Based on dependency-violations.log

# Create log file
LOG_FILE="orphaned-modules-move-log-$(date +%Y%m%d%H%M%S).txt"
RESTORE_SCRIPT="restore-orphaned-modules.sh"

# Create target directory
mkdir -p "src/_unused/depWarnings"

# Create restore script header
echo "#!/bin/bash" > "$RESTORE_SCRIPT"
echo "# Script to restore orphaned modules" >> "$RESTORE_SCRIPT"
echo "" >> "$RESTORE_SCRIPT"

# List of orphaned modules from dependency-violations.log
ORPHANED_MODULES=(
  "src/utils/progressiveReveal.ts"
  "src/utils/icons.ts"
  "src/data/aboutSectionData.ts"
  "src/composables/useScrollAnimation.ts"
  "src/composables/useElementPositioning.js"
  "src/components/NotFound.vue"
  "src/animations/strugglesOffersTabs.ts"
  "src/animations/servicesSection.ts"
  "src/animations/heroSection.ts"
  "src/animations/contactSection.ts"
  "src/animations/aboutSectionAlt.ts"
)

echo "Moving orphaned modules to src/_unused/depWarnings/..." | tee -a "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Process each file
for file in "${ORPHANED_MODULES[@]}"; do
  if [ -f "$file" ]; then
    # Create destination path
    dest="src/_unused/depWarnings/$(basename "$file")"
    
    # Move the file
    mv "$file" "$dest"
    echo "- Moved: $file → $dest" | tee -a "$LOG_FILE"
    
    # Add restore command to script
    echo "mkdir -p $(dirname "$file")" >> "$RESTORE_SCRIPT"
    echo "mv $dest $file" >> "$RESTORE_SCRIPT"
  else
    echo "- Warning: File not found: $file" | tee -a "$LOG_FILE"
  fi
done

# Make restore script executable
chmod +x "$RESTORE_SCRIPT"

echo "" >> "$LOG_FILE"
echo "Process complete. Check $LOG_FILE for details." | tee -a "$LOG_FILE"
echo "To restore files, run: bash $RESTORE_SCRIPT" | tee -a "$LOG_FILE"