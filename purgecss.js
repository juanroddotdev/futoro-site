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
      './src/**/*.scss',
    ],
    css: [
      './dist/assets/*.css'  // This should match your build output
    ],
    // Exclude the _unused folder and any backup folders
    defaultExtractor: content => {
      // This is the default extractor with added logging
      const matches = content.match(/[A-Za-z0-9-_:/]+/g) || [];
      return matches;
    },
    // Use a custom file extractor to skip _unused folders
    skippedContentGlobs: [
      // Unused and backup folders
      './src/_unused/**/*',
      './project-backup-*/**/*',
      './pre-restoration-backup-*/**/*',
      
      // Test and development files
      './tests/**/*',
      './cypress/**/*',
      './vitest/**/*',
      './storybook/**/*',
      './src/**/*.test.*',
      './src/**/*.spec.*',
      './src/**/*.stories.*',
      
      // Build artifacts and cache
      './node_modules/**/*',
      './.cache/**/*',
      './.output/**/*',
      './coverage/**/*',
      
      // Documentation and examples
      './docs/**/*',
      './examples/**/*',
      './src/docs/**/*',
      
      // Configuration files
      './*.config.js',
      './*.config.ts',
      
      // Temporary and local files
      './.tmp/**/*',
      './temp/**/*',
      './**/*.local.*',
      
      // Editor and IDE files
      './.vscode/**/*',
      './.idea/**/*'
    ],
    safelist: [
      // Add any selectors that should never be removed
      /^router-link-active$/,
      /^router-link-exact-active$/,
      /^fade-/,
      /^slide-/,
      // Add classes that might be dynamically added
      /^theme-/,
      /^btn-/,
      // Add Tailwind classes that might be dynamically composed
      /^(h|w)-\d+$/,
      /^(m|p)[trblxy]?-\d+$/,
      /^bg-/,
      /^text-/,
      // Add any classes used in JavaScript string literals
      /^translate-/,
      /^rotate-/,
      /^scale-/,
      // Vue scoped styles
      /\[data-v-[a-z0-9]+\]/,
      // Theme variations
      /^theme-.*$/,
      // Animation and transition classes
      /typing-indicator/,
      /typing-animation/,
      /progressive-reveal/,
      /animated-text-container/,
      /initially-hidden/,
      // Layout and positioning classes
      /sticky-section/,
      /sticky-heading/,
      /horizontal-scroll-section/,
      // UI component classes
      /message/,
      /chat-container/,
      /card-3d/,
      /retro-wave-element/,
      // Border utility classes
      /border-(primary|secondary|accent|space|neutral-\d+)/
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

  // After writing the report
  const totalRejected = unusedSelectors.reduce((acc, file) => acc + file.rejectedSelectors.length, 0);
  const totalFiles = result.length;
  const filesWithUnused = unusedSelectors.length;

  // Count total selectors across all files
  let totalSelectors = 0;
  result.forEach(file => {
    // Each PurgeCSS result has a 'css' array containing all selectors
    if (file.css) {
      totalSelectors += file.css.length;
    } else {
      // Fallback if 'css' isn't available - add rejected + used
      const rejectedCount = file.rejected ? file.rejected.length : 0;
      const usedCount = file.used ? file.used.length : 0;
      totalSelectors += rejectedCount + usedCount;
    }
  });

  // Add this before creating the summary report
  console.log('Debug selector counts:');
  result.forEach(file => {
    const rejectedCount = file.rejected ? file.rejected.length : 0;
    const usedCount = file.used ? file.used.length : 0;
    const cssCount = file.css ? file.css.length : 0;
    console.log(`File: ${file.file}`);
    console.log(`  - Rejected selectors: ${rejectedCount}`);
    console.log(`  - Used selectors: ${usedCount}`);
    console.log(`  - CSS selectors: ${cssCount}`);
    console.log(`  - Total calculated: ${rejectedCount + usedCount}`);
  });
  console.log(`Total rejected across all files: ${totalRejected}`);
  console.log(`Total selectors calculated: ${totalSelectors}`);

  // After counting total selectors, create a detailed breakdown
  const fileBreakdown = result.map(file => {
    const rejectedCount = file.rejected ? file.rejected.length : 0;
    // If PurgeCSS doesn't provide used selectors, calculate them from cssSelectors
    const cssCount = file.css ? file.css.length : 0;
    // Assume used = total CSS selectors - rejected
    const usedCount = cssCount > 0 ? cssCount - rejectedCount : 0;
    
    return {
      file: file.file,
      rejectedSelectors: rejectedCount,
      usedSelectors: usedCount,
      cssSelectors: cssCount,
      totalSelectors: cssCount, // Use the actual CSS count as the total
      percentageUnused: cssCount > 0 ? ((rejectedCount / cssCount) * 100).toFixed(2) + '%' : '0%'
    };
  });

  // Recalculate the total selectors based on CSS counts
  const totalCSSSelectors = fileBreakdown.reduce((acc, file) => acc + file.cssSelectors, 0);

  // Create an enhanced summary report
  const summary = {
    date: new Date().toISOString(),
    totalCSSFiles: totalFiles,
    filesWithUnusedSelectors: filesWithUnused,
    totalUnusedSelectors: totalRejected,
    totalSelectors: totalCSSSelectors, // Use the sum of all CSS selectors
    percentageUnused: totalCSSSelectors > 0 ? ((totalRejected / totalCSSSelectors) * 100).toFixed(2) + '%' : '0%',
    fileBreakdown: fileBreakdown,
    countingMethodology: "Selectors are counted based on the total CSS selectors in each file. Unused percentage is calculated as (rejected selectors / total CSS selectors) * 100."
  };

  fs.writeFileSync(
    path.resolve('./unused-css-summary.json'),
    JSON.stringify(summary, null, 2)
  );

  console.log('PurgeCSS analysis complete!');
  console.log(`Analyzed ${totalFiles} CSS files.`);
  console.log(`Found ${totalRejected} unused CSS selectors across ${filesWithUnused} files.`);
  console.log(`Approximately ${summary.percentageUnused} of your CSS may be unused.`);
  console.log('Check unused-css-report.json for details and unused-css-summary.json for statistics.');
}

runPurgeCSS().catch(error => {
  console.error('Error running PurgeCSS:', error);
});
