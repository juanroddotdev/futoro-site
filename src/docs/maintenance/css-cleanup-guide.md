# CSS Cleanup Guide Using PurgeCSS Results

This guide outlines a systematic approach to cleaning up unused CSS based on PurgeCSS analysis results.

## Step 1: Analyze PurgeCSS Report

The `unused-css-report.json` file contains selectors that PurgeCSS couldn't find in your content files. Categorize these into:

- Tailwind utility classes (`.mb-1`, `.h-12`, etc.)
- Theme-specific classes (`.theme-neon-horizon .btn`)
- Component-specific classes (`.btn-round-xlarge-primary`)
- Basic HTML elements (`hr`, `table`, etc.)

## Step 2: Handle Tailwind Classes

For Tailwind utility classes, ensure your `tailwind.config.js` is properly configured:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    // Your theme config
  },
  purge: {
    enabled: true,
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
  },
}
```

## Step 3: Identify Source Files for Custom Classes

Find which SCSS files contain unused custom classes:

```bash
# Search for a specific class in your SCSS files
grep -r "btn-round-xlarge-primary" --include="*.scss" src/
```

## Step 4: Move Potentially Unused Files

Follow the strategy in the Unused Files Guide:

```bash
# Create directories if they don't exist
mkdir -p src/_unused/scss/components
mkdir -p src/_unused/scss/themes

# Example of moving a file
mv src/scss/components/_buttons-round.scss src/_unused/scss/components/
```

## Step 5: Comment Out Imports

In your `main.scss` or other import files:

```scss
// Then your custom components
@import 'components/buttons';
@import 'components/icons';
/* @import 'components/buttons-round'; */ /* Potentially unused - moved to _unused folder */
@import 'components/form';
```

## Step 6: Test Your Application

After commenting out imports, thoroughly test your application to ensure nothing breaks.

## Step 7: Remove Specific Unused Classes

For files that are partially used, you can remove specific unused selectors:

```scss
// Keep used button classes
.btn {
  // styles
}

// Remove unused button classes
// .btn-neutral,
// .btn-neutral--primary,
// .btn-neutral--primary:hover,
// ...
```

## Step 8: Document Your Changes

Update the Unused Files Guide with details about moved files.

## Step 9: Create a Safelist for False Positives

Some selectors might be dynamically generated or added via JavaScript. Update your PurgeCSS config:

```javascript
safelist: [
  // Add any selectors that should never be removed
  /^router-link-active$/,
  /^router-link-exact-active$/,
  /^fade-/,
  /^slide-/,
  // Add classes that might be dynamically added
  /^theme-/,
  /^btn-/
]
```

## Step 10: Implement Gradual Removal

Don't remove everything at once. Follow this process:
1. Move one file to `_unused` folder
2. Comment out its import
3. Test thoroughly
4. If everything works, move to the next file

## Common False Positives

Be cautious with these types of selectors, which might be false positives:

1. Classes added dynamically via JavaScript
2. Classes used in components loaded conditionally
3. Classes used in third-party libraries
4. Classes used in SVG or other embedded content
5. Classes referenced in string literals or template literals

## Re-running PurgeCSS

After making changes, re-run PurgeCSS to verify improvements:

```bash
npm run analyze-css
```

Compare the new report with the previous one to track your progress.

## Final Verification

Before final removal of any CSS:
1. Test across all browsers
2. Test all user interactions
3. Test all responsive breakpoints
4. Test all theme variations
5. Test with JavaScript disabled (if applicable)