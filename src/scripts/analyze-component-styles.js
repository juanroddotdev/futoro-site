#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the file path from command line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide a file path');
  process.exit(1);
}

// Read the file
try {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Check if the file has a style section
  const hasScoped = fileContent.includes('<style lang="scss" scoped>');
  const hasNonScoped = fileContent.includes('<style lang="scss">');
  
  console.log(`\n=== Style Analysis for ${filePath} ===\n`);
  
  // Check for direct style imports in the component
  const styleImports = [];
  const importStyleMatches = fileContent.match(/import\s+['"](.+\.scss)['"]/g) || [];
  for (const match of importStyleMatches) {
    const importPath = match.match(/import\s+['"](.+\.scss)['"]/)[1];
    styleImports.push(importPath);
  }
  
  if (styleImports.length > 0) {
    console.log('✓ Component directly imports these SCSS files:');
    styleImports.forEach(imp => console.log(`  ${imp}`));
    console.log('');
  }
  
  if (hasScoped || hasNonScoped) {
    console.log('✓ Component has direct SCSS styles');
    
    // Extract class names from the template
    const classMatches = fileContent.match(/class="([^"]*)"/g) || [];
    const classes = new Set();
    
    classMatches.forEach(match => {
      const classString = match.replace('class="', '').replace('"', '');
      classString.split(/\s+/).forEach(cls => {
        if (cls) classes.add(cls);
      });
    });
    
    console.log(`\n- Component uses ${classes.size} CSS classes in template:`);
    console.log([...classes].sort().join(', '));
  } else {
    console.log('✗ Component has no direct SCSS styles');
  }
  
  // Check for deep selectors which might indicate reliance on other components' styles
  const deepSelectors = (fileContent.match(/:deep\([^)]+\)/g) || [])
    .map(match => match.replace(':deep(', '').replace(')', ''));
  
  if (deepSelectors.length > 0) {
    console.log(`\n- Component uses :deep selectors for:`);
    deepSelectors.forEach(selector => console.log(`  ${selector}`));
  }
  
  // Check for imported components that might bring their own styles
  const importMatches = fileContent.match(/import\s+\w+\s+from\s+['"]([^'"]+)['"]/g) || [];
  const componentImports = importMatches
    .filter(match => match.includes('.vue'))
    .map(match => match.match(/from\s+['"]([^'"]+)['"]/)[1]);
  
  if (componentImports.length > 0) {
    console.log(`\n- Component imports these Vue components that may have styles:`);
    componentImports.forEach(imp => console.log(`  ${imp}`));
  }
  
  // Check for global styles that might affect this component
  console.log('\n- Global SCSS files that likely affect this component:');
  console.log('  src/scss/main.scss (via src/style.scss)');
  console.log('  src/scss/components/_hero-section-with-phone.scss');
  
  console.log('\n=== Recommendation ===');
  console.log('Check these files for styles affecting this component:');
  console.log('1. The component\'s own <style> section');
  console.log('2. src/scss/components/_hero-section-with-phone.scss');
  console.log('3. Global styles in src/scss/main.scss');
  console.log('4. Styles in imported components like ChatScrollSection.vue');
  
} catch (error) {
  console.error(`Error reading file: ${error.message}`);
  process.exit(1);
}
