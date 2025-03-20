# Unused Files Management Guide

This document combines best practices for identifying, managing, and cleaning up potentially unused files in the project.

## Overview

The `_unused` folder contains files that might not be used in the application. They were moved here as part of a cleanup process to reduce bundle size and improve maintainability.

## Current Unused Files

### SCSS Files
- `components/_availability-badge.scss` - Moved on [DATE]
  - Contains styles for availability badges that don't appear to be used in current components
- `components/_scroll-accordion.scss` - Moved on [DATE]
  - Contains styles for scroll accordion functionality that may be superseded by newer implementations
- `components/_scroll-accordion-vanilla.scss` - Moved on [DATE]
  - Contains vanilla JS implementation of scroll accordion
- `components/_horizontal-scroll.scss` - Moved on [DATE]
  - Contains styles for horizontal scrolling sections that may not be in current use
- `separators/_code-evolution.scss` - Moved on [DATE]
  - Contains styles for code evolution separators that may not be in current use

### Components
- [List any Vue components moved here]

### Utils
- [List any utility files moved here]

## Detection Methods

### 1. Comment-Out Method (Easiest)
1. Comment out the import in main.scss
2. Rebuild/reload your application
3. Check if anything breaks visually
4. If nothing breaks, the file is likely unused

Example:
```scss
// In main.scss
// @import 'components/availability-badge'; // Temporarily commented out
```

### 2. Search for Class Names (Reliable)
1. Open each SCSS file you suspect is unused
2. Identify unique class names defined in that file
3. Search your entire codebase for those class names
4. If no matches are found, the file is likely unused

Example:
```bash
grep -r "availability-badge" --include="*.vue" --include="*.js" --include="*.ts" src/
```

### 3. Browser DevTools Approach (Visual Confirmation)
1. Open your application in Chrome/Firefox
2. Open DevTools (F12)
3. Go to Coverage tab (Chrome) or Style Editor (Firefox)
4. Reload the page and interact with all features
5. Check which CSS rules were never used

### 4. Build Tool Analysis (Automated)
Use tools like PurgeCSS or UnCSS to analyze your CSS:

```bash
# Install PurgeCSS
npm install -g purgecss

# Run analysis
purgecss --css dist/css/main.css --content src/**/*.vue src/**/*.js --output analysis
```

### 5. Temporary Class Addition (Quick Test)
1. Add a very obvious temporary class to the suspected unused file:
```scss
// In _availability-badge.scss
.THIS-FILE-IS-BEING-USED {
  background: red !important;
  border: 10px solid yellow !important;
}
```
2. Add this class to an element in your HTML/template
3. If the style appears, the file is being processed

## Management Strategy

### 1. Create an "unused" folder structure
```bash
mkdir -p src/_unused/scss/components
mkdir -p src/_unused/scss/separators
mkdir -p src/_unused/components
mkdir -p src/_unused/utils
```

### 2. Move potentially unused files
```bash
# Example for moving a component SCSS file
mv src/scss/components/_availability-badge.scss src/_unused/scss/components/
```

### 3. Update import references
Comment out or remove the import in main.scss:
```scss
// @import 'components/availability-badge'; /* Moved to _unused folder */
```

### 4. Test your application
Run your application and verify everything works correctly.

### 5. Document what you've moved
Update this README with details about moved files.

### 6. Add the _unused folder to .gitignore (optional)
If you don't want to track these files in git:
```
# Unused files storage
src/_unused/
```

## How to Determine if a File is Actually Used

1. **For SCSS files**:
   - Search for class names defined in the file: `grep -r "class-name" --include="*.vue" --include="*.js" --include="*.ts" src/`
   - Check if any visual elements break when the file is removed

2. **For Vue components**:
   - Search for import statements: `grep -r "import ComponentName" --include="*.vue" --include="*.js" --include="*.ts" src/`
   - Check if any routes or dynamic imports reference the component

3. **For utility files**:
   - Search for import statements or function names: `grep -r "functionName" --include="*.vue" --include="*.js" --include="*.ts" src/`

## If You Need to Restore a File

1. Move it back to its original location
2. Uncomment its import statement in the appropriate file (e.g., main.scss for SCSS files)
3. Test the application to ensure everything works correctly

## Common False Positives

Be cautious with these types of selectors, which might be false positives:

1. Classes added dynamically via JavaScript
2. Classes used in components loaded conditionally
3. Classes used in third-party libraries
4. Classes used in SVG or other embedded content
5. Classes referenced in string literals or template literals

## Future Cleanup

If these files remain unused after 3-6 months of active development, consider permanently removing them from the project.