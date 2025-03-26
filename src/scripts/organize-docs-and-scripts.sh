#!/bin/bash

# Script to organize MD files and shell scripts into appropriate folders
echo "Organizing documentation and script files..."

# Create docs and scripts directories if they don't exist
mkdir -p docs
mkdir -p scripts

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

# Process MD files from project root
echo "Processing MD files in project root..."
for file in *.md; do
  # Skip if no files found or if in docs directory
  if [ ! -f "$file" ] || [[ "$file" == docs/* ]]; then
    continue
  fi
  
  # Skip README.md in the root directory
  if [ "$file" = "README.md" ]; then
    echo "  Keeping $file in root directory"
    continue
  fi
  
  destination="docs/$file"
  if confirm_move "$file" "$destination"; then
    echo "  Moving $file to docs/"
    mv "$file" "$destination"
  else
    echo "  Skipping $file"
  fi
done

# Process shell scripts from project root
echo "Processing shell scripts in project root..."
for file in *.sh; do
  # Skip if no files found or if in scripts directory
  if [ ! -f "$file" ] || [[ "$file" == scripts/* ]]; then
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

# Process MD files from src/ directory
echo "Processing MD files in src/ directory..."
# Create a temporary file to store the list of files
find ./src -type f -name "*.md" -not -path "./src/docs/*" > /tmp/md_files.txt

while IFS= read -r file; do
  filename=$(basename "$file")
  relative_path=${file#./src/}
  parent_dir=$(dirname "$relative_path")
  
  # Create target directory in docs if it doesn't exist
  if [ "$parent_dir" != "." ]; then
    mkdir -p "docs/$parent_dir"
    destination="docs/$parent_dir/$filename"
  else
    destination="docs/$filename"
  fi
  
  if confirm_move "$file" "$destination"; then
    echo "  Moving $file to $destination"
    mv "$file" "$destination"
  else
    echo "  Skipping $file"
  fi
done < /tmp/md_files.txt

# Process shell scripts from src/ directory
echo "Processing shell scripts in src/ directory..."
# Create a temporary file to store the list of files
find ./src -type f -name "*.sh" -not -path "./src/scripts/*" > /tmp/sh_files.txt

while IFS= read -r file; do
  filename=$(basename "$file")
  destination="scripts/$filename"
  
  # Check if file already exists in scripts folder
  if [ -f "$destination" ]; then
    new_destination="scripts/${filename%.sh}_copy.sh"
    if confirm_move "$file" "$new_destination"; then
      echo "  File $filename already exists in scripts/, creating a copy with suffix"
      cp "$file" "$new_destination"
    else
      echo "  Skipping $file"
    fi
  else
    if confirm_move "$file" "$destination"; then
      echo "  Moving $file to $destination"
      mv "$file" "$destination"
    else
      echo "  Skipping $file"
    fi
  fi
done < /tmp/sh_files.txt

# Clean up temporary files
rm -f /tmp/md_files.txt /tmp/sh_files.txt

echo "Organization complete!"
