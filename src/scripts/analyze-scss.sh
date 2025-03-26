#!/bin/bash

# Set up log directory and file
LOG_DIR="logs"
mkdir -p "$LOG_DIR"
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
LOG_FILE="$LOG_DIR/scss-analysis-$TIMESTAMP.txt"

# Create log file with header
echo "SCSS Analysis Report - $(date)" > "$LOG_FILE"
echo "=======================================" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Add this function at the beginning of the script
ensure_temp_directory() {
  # Make sure the temp directory exists
  mkdir -p temp_scss_analysis
}

# Main analysis
echo "Starting SCSS analysis..." | tee -a "$LOG_FILE"

# Ensure temp directory exists and is clean
rm -rf temp_scss_analysis
ensure_temp_directory

# Basic project stats
echo "Project Overview:" >> "$LOG_FILE"
scss_files=$(find src -name "*.scss" | wc -l)
scss_partials=$(find src -name "_*.scss" | wc -l)
echo "- Total SCSS Files: $scss_files" >> "$LOG_FILE"
echo "- SCSS Partials: $scss_partials" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Call your analysis functions here
analyze_scss_structure
analyze_scss_variables
analyze_scss_mixins
analyze_nesting_depth
detect_tailwind_apply_redundancies
detect_inconsistent_colors
analyze_scss_duplicates
detect_redundant_vendor_prefixes
detect_important_overuse
detect_redundant_nesting

# Cleanup
echo "Analysis complete. Results saved to $LOG_FILE"
