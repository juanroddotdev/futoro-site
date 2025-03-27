// Extract unused selectors from HomePage CSS
const fs = require('fs');
const path = require('path');

// Read the unused CSS report
const report = JSON.parse(fs.readFileSync('./unused-css-report.json', 'utf8'));

// Find the HomePage CSS file entry
const homepageEntry = report.find(entry => 
  entry.file.includes('HomePage') || entry.file.includes('HomePage-IKIVVTRY.css')
);

if (!homepageEntry) {
  console.error('HomePage CSS file not found in the report');
  process.exit(1);
}

// Extract and format the rejected selectors
const rejectedSelectors = homepageEntry.rejectedSelectors;

// Group selectors by component (based on data-v- attributes)
const componentGroups = {};
const utilityClasses = [];
const themeClasses = [];
const otherClasses = [];

rejectedSelectors.forEach(selector => {
  // Check if it's a component selector (with data-v- attribute)
  const componentMatch = selector.match(/\[data-v-([a-z0-9]+)\]/);
  if (componentMatch) {
    const componentId = componentMatch[1];
    if (!componentGroups[componentId]) {
      componentGroups[componentId] = [];
    }
    componentGroups[componentId].push(selector);
    return;
  }
  
  // Check if it's a theme-specific class
  if (selector.startsWith('.theme-')) {
    themeClasses.push(selector);
    return;
  }
  
  // Check if it's a utility class (simple pattern like .mb-1, .w-12, etc.)
  if (/^\.\w+(-\w+)*$/.test(selector) && !selector.includes(' ')) {
    utilityClasses.push(selector);
    return;
  }
  
  // Everything else
  otherClasses.push(selector);
});

// Create a formatted report
const output = {
  file: homepageEntry.file,
  totalRejectedSelectors: rejectedSelectors.length,
  components: Object.entries(componentGroups).map(([id, selectors]) => ({
    componentId: id,
    selectorCount: selectors.length,
    selectors
  })),
  themeClasses,
  utilityClasses,
  otherClasses
};

// Write the formatted report
fs.writeFileSync(
  './homepage-unused-classes.json',
  JSON.stringify(output, null, 2)
);

console.log(`Found ${rejectedSelectors.length} unused selectors in ${homepageEntry.file}`);
console.log(`Grouped by ${Object.keys(componentGroups).length} components`);
console.log(`Report saved to homepage-unused-classes.json`);