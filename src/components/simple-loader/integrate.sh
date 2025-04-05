#!/bin/bash

# SimpleLoader Integration Script
# This script helps integrate the SimpleLoader component into the main branch

echo "SimpleLoader Integration Script"
echo "==============================="
echo ""

# Check if the target directory exists
if [ ! -d "../simple-loader" ]; then
  echo "Creating target directory..."
  mkdir -p "../simple-loader"
fi

# Copy the SimpleLoader component and its dependencies
echo "Copying SimpleLoader component and its dependencies..."
cp -r ./* "../simple-loader/"

# Check if the copy was successful
if [ $? -eq 0 ]; then
  echo "✅ Copy successful!"
else
  echo "❌ Copy failed!"
  exit 1
fi

echo ""
echo "Integration complete!"
echo ""
echo "Next steps:"
echo "1. Switch to the main branch"
echo "2. Copy the simple-loader folder to src/components/"
echo "3. Follow the instructions in INTEGRATION_CHECKLIST.md"
echo ""
echo "Good luck!" 