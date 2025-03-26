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
    css: ['./dist/assets/*.css'],
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
      './dist/**/*',
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
      /^scale-/
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

  // Create a summary report
  const summary = {
    date: new Date().toISOString(),
    totalCSSFiles: totalFiles,
    filesWithUnusedSelectors: filesWithUnused,
    totalUnusedSelectors: totalRejected,
    percentageUnused: totalFiles > 0 ? ((filesWithUnused / totalFiles) * 100).toFixed(2) + '%' : '0%'
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
