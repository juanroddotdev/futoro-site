#!/bin/bash

# Script to organize analysis reports, logs, and other generated files into folders
echo "Organizing reports, logs, and analysis files..."

# Create directories if they don't exist
mkdir -p reports/analysis
mkdir -p reports/css
mkdir -p reports/dependencies
mkdir -p logs/backup
mkdir -p logs/maintenance

# Function to ask for confirmation
confirm_move() {
  local file=$1
  local destination=$2
  
  if [ "$CONFIRM_ALL" = "true" ]; then
    return 0
  fi
  
  read -p "Move '$file' to '$destination'? (y/n/a - yes to all): " response
  
  if [ "$response" = "a" ]; then
    CONFIRM_ALL="true"
    return 0
  elif [ "$response" = "y" ]; then
    return 0
  else
    return 1
  fi
}

# Initialize confirm all flag
CONFIRM_ALL="false"

# Move analysis reports
echo "Processing analysis reports..."
for file in *-analysis.html *-analysis.json *-report.html *-report.json; do
  # Skip if no files found
  if [[ ! -f "$file" || "$file" == reports/* ]]; then
    continue
  fi
  
  destination="reports/analysis/$file"
  if confirm_move "$file" "$destination"; then
    echo "  Moving $file to reports/analysis/"
    mv "$file" "$destination"
  else
    echo "  Skipping $file"
  fi
done

# Move CSS reports
echo "Processing CSS reports..."
for file in css-*.html css-*.json scss-*.html scss-*.json; do
  # Skip if no files found
  if [[ ! -f "$file" || "$file" == reports/css/* ]]; then
    continue
  fi
  
  destination="reports/css/$file"
  if confirm_move "$file" "$destination"; then
    echo "  Moving $file to reports/css/"
    mv "$file" "$destination"
  else
    echo "  Skipping $file"
  fi
done

# Move dependency reports
echo "Processing dependency reports..."
for file in dependency-*.html dependency-*.json deps-*.html deps-*.json; do
  # Skip if no files found
  if [[ ! -f "$file" || "$file" == reports/dependencies/* ]]; then
    continue
  fi
  
  destination="reports/dependencies/$file"
  if confirm_move "$file" "$destination"; then
    echo "  Moving $file to reports/dependencies/"
    mv "$file" "$destination"
  else
    echo "  Skipping $file"
  fi
done

# Move log files
echo "Processing log files..."
for file in *.log *-log-*.txt *-log.md; do
  # Skip if no files found
  if [[ ! -f "$file" || "$file" == logs/* ]]; then
    continue
  fi
  
  # Determine appropriate log directory based on content
  if [[ "$file" == *backup* || "$file" == *restore* ]]; then
    log_dir="logs/backup"
  else
    log_dir="logs/maintenance"
  fi
  
  destination="$log_dir/$file"
  if confirm_move "$file" "$destination"; then
    echo "  Moving $file to $log_dir/"
    mv "$file" "$destination"
  else
    echo "  Skipping $file"
  fi
done

# Move orphaned modules logs specifically
echo "Processing orphaned modules logs..."
for file in orphaned-modules-*.txt; do
  # Skip if no files found
  if [[ ! -f "$file" || "$file" == logs/maintenance/* ]]; then
    continue
  fi
  
  destination="logs/maintenance/$file"
  if confirm_move "$file" "$destination"; then
    echo "  Moving $file to logs/maintenance/"
    mv "$file" "$destination"
  else
    echo "  Skipping $file"
  fi
done

# Move restore scripts to a scripts folder
echo "Processing restore scripts..."
for file in restore-*.sh; do
  # Skip if no files found
  if [[ ! -f "$file" || "$file" == scripts/* ]]; then
    continue
  fi
  
  destination="scripts/$file"
  if confirm_move "$file" "$destination"; then
    echo "  Moving $file to scripts/"
    mv "$file" "$destination"
  else
    echo "  Skipping $file"
  fi
done

echo "Organization complete!"