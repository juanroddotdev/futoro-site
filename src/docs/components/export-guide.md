# Components Export Guide

This guide outlines the process for exporting components from development to the main branch.

## Overview

The `src/components/export-to-main` folder contains clean, tested components ready to be copied to the main branch. Each component has been isolated and verified to work independently.

## Export Process

1. Review each component in the export folder
2. Copy the desired components to their corresponding locations in the main branch
3. Test each component after integration
4. Update imports in any files that use the component
5. Remove the component from the export folder once successfully integrated

## Components List

- `AnimatedText`: Enhanced text animation component with multiple animation styles
- `textAnimations`: Utility functions for text animations
- [Add more components as they become ready for export]

## Component Requirements

Before a component is ready for export, ensure it meets these requirements:

1. **Self-contained**: The component should have minimal dependencies
2. **Well-documented**: Include comments explaining complex logic
3. **Tested**: Verify the component works in isolation
4. **Optimized**: Remove any console.log statements or debugging code
5. **Typed**: Ensure proper TypeScript types are defined

## Export Checklist

For each component you plan to export, complete this checklist:

- [ ] Component has been tested in isolation
- [ ] All dependencies are documented
- [ ] Props are properly typed
- [ ] Events are properly documented
- [ ] Component is responsive (if applicable)
- [ ] Component works across supported browsers
- [ ] No console.log or debugging code remains