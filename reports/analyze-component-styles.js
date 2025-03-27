// Analyze Vue components and their SCSS dependencies
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as globModule from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const glob = globModule.glob;

// Read the unused CSS report for reference
const unusedReport = JSON.parse(fs.readFileSync('./unused-css-report.json', 'utf8'));

// Component ID to name mapping from create-html-report.js
const componentMap = {
  'e43325f4': 'LoadingDots',
  'f600ccf0': 'RetroWaveElement',
  '79360350': 'ChatContainer',
  '0684dc54': 'ScrollableChatSection',
  '3b6000a8': 'ProgressiveReveal',
  '301c791b': 'EmberContainer',
  'ab149217': 'ProgressiveRevealSection',
  '55b7bfe7': 'AnimatedText',
  // Add more mappings as needed
};

// Find all Vue components
const vueFiles = glob.sync('src/**/*.vue');
const scssFiles = glob.sync('src/**/*.scss');

// Results object
const componentStyleMap = {
  definitelyUsing: {},  // Direct imports or <style> blocks
  probablyUsing: {},    // Class names match but no direct import
  maybeUsing: {}        // Potential matches based on naming patterns
};

// Extract component IDs from selectors in the unused report
const componentIds = new Set();
unusedReport.forEach(entry => {
  entry.rejectedSelectors.forEach(selector => {
    const match = selector.match(/\[data-v-([a-z0-9]+)\]/);
    if (match) {
      componentIds.add(match[1]);
    }
  });
});

// Add this function to map component styles to their SCSS files
function findComponentStylesInScssFiles(componentName, classes) {
  const matchingScssFiles = {};
  
  // Search through all SCSS files for class names used in the component
  scssFiles.forEach(scssFile => {
    const content = fs.readFileSync(scssFile, 'utf8');
    let matchCount = 0;
    
    // Check for component name in file
    const hasComponentName = content.includes(componentName) || 
                             content.includes(kebabCase(componentName));
    
    // Check for class names in file
    const matchingClasses = [];
    classes.forEach(className => {
      if (content.includes(className)) {
        matchCount++;
        matchingClasses.push(className);
      }
    });
    
    if (hasComponentName || matchCount > 0) {
      matchingScssFiles[scssFile] = {
        hasComponentName,
        matchCount,
        matchingClasses
      };
    }
  });
  
  return matchingScssFiles;
}

// Modify the existing code to include this information
// Inside the loop where you process each Vue file:
const componentName = path.basename(vueFile, '.vue');
const relativePath = path.relative(process.cwd(), vueFile);

// After you've collected classes and other info
if (hasScssStyle || scssImports.length > 0) {
  const matchingScssFiles = findComponentStylesInScssFiles(componentName, Array.from(classes));
  
  componentStyleMap.definitelyUsing[relativePath] = {
    hasScssStyle,
    scssImports,
    classes: Array.from(classes),
    matchingScssFiles
  };
} else if (classes.size > 0) {
  const matchingScssFiles = findComponentStylesInScssFiles(componentName, Array.from(classes));
  
  // Rest of your existing code...
}

// Helper function to convert camelCase or PascalCase to kebab-case
function kebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

// Process each Vue file
vueFiles.forEach(vueFile => {
  const relativePath = path.relative(__dirname, vueFile);
  const content = fs.readFileSync(vueFile, 'utf8');
  const componentName = path.basename(vueFile, '.vue');
  
  // Check for <style> blocks with scss
  const hasScssStyle = content.includes('<style lang="scss">') || 
                       content.includes('<style scoped lang="scss">');
  
  // Check for direct imports of scss files
  const scssImports = [];
  const importMatches = content.matchAll(/import\s+['"](.+\.scss)['"]/g);
  for (const match of importMatches) {
    scssImports.push(match[1]);
  }
  
  // Extract classes used in the template
  const classMatches = content.matchAll(/class="([^"]*)"/g);
  const classes = new Set();
  for (const match of classMatches) {
    match[1].split(/\s+/).forEach(cls => {
      if (cls.trim()) classes.add(cls.trim());
    });
  }
  
  // Determine component ID if present
  let componentId = null;
  const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/);
  if (scriptMatch) {
    const idMatch = scriptMatch[1].match(/data-v-([a-z0-9]+)/);
    if (idMatch) {
      componentId = idMatch[1];
    }
  }
  
  // Map component to styles
  if (hasScssStyle || scssImports.length > 0) {
    const matchingScssFiles = findComponentStylesInScssFiles(componentName, Array.from(classes));
    
    componentStyleMap.definitelyUsing[relativePath] = {
      hasScssStyle,
      scssImports,
      classes: Array.from(classes),
      matchingScssFiles
    };
  } else if (classes.size > 0) {
    // Check if any SCSS files might match the component name
    const matchingScssFiles = scssFiles.filter(scssFile => {
      const scssName = path.basename(scssFile, '.scss');
      return scssName.includes(componentName) || 
             componentName.includes(scssName) ||
             scssFile.includes(componentName.toLowerCase());
    });
    
    if (matchingScssFiles.length > 0) {
      componentStyleMap.probablyUsing[relativePath] = {
        matchingScssFiles: matchingScssFiles.map(f => path.relative(__dirname, f)),
        classes: Array.from(classes)
      };
    } else {
      componentStyleMap.maybeUsing[relativePath] = {
        classes: Array.from(classes),
        componentId,
        mappedName: componentId ? componentMap[componentId] || null : null
      };
    }
  } else {
    componentStyleMap.maybeUsing[relativePath] = {
      note: "No direct style usage detected",
      componentId,
      mappedName: componentId ? componentMap[componentId] || null : null
    };
  }
});

// Generate HTML report
const htmlReport = `
<!DOCTYPE html>
<html>
<head>
  <title>Vue Component Style Usage Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1, h2, h3 { color: #333; }
    .category { margin-bottom: 30px; }
    .component { margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
    .definitely { background-color: #d4edda; }
    .probably { background-color: #fff3cd; }
    .maybe { background-color: #f8d7da; }
    .details { margin-left: 20px; }
    .classes { display: flex; flex-wrap: wrap; gap: 5px; }
    .class { background: #eee; padding: 2px 6px; border-radius: 3px; font-size: 0.9em; }
  </style>
</head>
<body>
  <h1>Vue Component Style Usage Report</h1>
  
  <div class="category">
    <h2>Definitely Using SCSS (${Object.keys(componentStyleMap.definitelyUsing).length} components)</h2>
    ${Object.entries(componentStyleMap.definitelyUsing).map(([component, data]) => `
      <div class="component definitely">
        <h3>${component}</h3>
        <div class="details">
          ${data.hasScssStyle ? '<p>Has SCSS style block</p>' : ''}
          ${data.scssImports.length > 0 ? `
            <p>Imports:</p>
            <ul>
              ${data.scssImports.map(imp => `<li>${imp}</li>`).join('')}
            </ul>
          ` : ''}
          ${data.classes.length > 0 ? `
            <p>Classes used:</p>
            <div class="classes">
              ${data.classes.map(cls => `<span class="class">${cls}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `).join('')}
  </div>
  
  <div class="category">
    <h2>Probably Using SCSS (${Object.keys(componentStyleMap.probablyUsing).length} components)</h2>
    ${Object.entries(componentStyleMap.probablyUsing).map(([component, data]) => `
      <div class="component probably">
        <h3>${component}</h3>
        <div class="details">
          ${data.matchingScssFiles.length > 0 ? `
            <p>Potential SCSS files:</p>
            <ul>
              ${data.matchingScssFiles.map(file => `<li>${file}</li>`).join('')}
            </ul>
          ` : ''}
          ${data.classes.length > 0 ? `
            <p>Classes used:</p>
            <div class="classes">
              ${data.classes.map(cls => `<span class="class">${cls}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `).join('')}
  </div>
  
  <div class="category">
    <h2>Maybe Using SCSS (${Object.keys(componentStyleMap.maybeUsing).length} components)</h2>
    ${Object.entries(componentStyleMap.maybeUsing).map(([component, data]) => `
      <div class="component maybe">
        <h3>${component}</h3>
        <div class="details">
          ${data.note ? `<p>${data.note}</p>` : ''}
          ${data.mappedName ? `<p>Mapped component name: ${data.mappedName}</p>` : ''}
          ${data.componentId ? `<p>Component ID: ${data.componentId}</p>` : ''}
          ${data.classes && data.classes.length > 0 ? `
            <p>Classes used:</p>
            <div class="classes">
              ${data.classes.map(cls => `<span class="class">${cls}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>
`;

// Write the report to a file
fs.writeFileSync('component-style-usage-report.html', htmlReport);
console.log('Component style usage report generated: component-style-usage-report.html');

// Helper function to convert camelCase or PascalCase to kebab-case
function kebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}
