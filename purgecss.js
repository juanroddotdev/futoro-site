// purgecss.js
import { PurgeCSS } from 'purgecss';
import fs from 'fs';
import path from 'path';

async function runPurgeCSS() {
  console.log('Running PurgeCSS analysis...');
  
  const result = await new PurgeCSS().purge({
    content: [
      './src/**/*.vue',
      './src/**/*.js',
      './src/**/*.ts',
      './src/**/*.jsx',
      './src/**/*.tsx',
      './index.html',
    ],
    css: ['./dist/assets/*.css'],
    safelist: [
      // Add any selectors that should never be removed
      /^router-link-active$/,
      /^router-link-exact-active$/,
      /^fade-/,
      /^slide-/
    ],
    output: './purgecss-analysis',
    rejected: true, // This will output rejected selectors
  });
  
  // Create a report of unused selectors
  const unusedSelectors = [];
  
  result.forEach(file => {
    if (file.rejected) {
      unusedSelectors.push({
        file: file.file,
        rejectedSelectors: file.rejected
      });
    }
  });
  
  // Write the report to a file
  fs.writeFileSync(
    path.resolve('./unused-css-report.json'),
    JSON.stringify(unusedSelectors, null, 2)
  );
  
  console.log('PurgeCSS analysis complete!');
  console.log(`Found ${unusedSelectors.reduce((acc, file) => acc + file.rejectedSelectors.length, 0)} unused CSS selectors.`);
  console.log('Check unused-css-report.json for details.');
}

runPurgeCSS().catch(error => {
  console.error('Error running PurgeCSS:', error);
});