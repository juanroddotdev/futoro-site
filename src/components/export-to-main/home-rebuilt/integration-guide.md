# HomeRebuilt Component Integration Guide

This folder contains all components needed for the HomeRebuilt page, organized in their original directory structure.

## Directory Structure

The components maintain their original directory structure to preserve imports. The main components are:

- `src/views/HomeRebuilt.vue` - Main landing page
- Various components in `src/components/` and subdirectories
- Data files in `src/data/`
- Composables in `src/composables/`

## Integration Steps

1. Copy all files and folders to your project, maintaining the directory structure
2. Ensure all dependencies are installed (Vue 3, GSAP if used for animations)
3. Add the route for HomeRebuilt.vue in your router configuration
4. Test the page to ensure all components are working correctly

## Component Hierarchy

See the component-nesting-guide.md for a detailed visualization of how components are nested.

## Customization

- Update content in the data files to customize text and information
- Adjust styling by modifying the component CSS or applying your theme variables
- Add or remove sections by editing the HomeRebuilt.vue template
