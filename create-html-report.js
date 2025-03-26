// Create an HTML report from the JSON data
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as globModule from 'glob'; // Import the entire module

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use the glob function from the module
const glob = globModule.glob;

// Read the unused CSS report
const report = JSON.parse(fs.readFileSync('./unused-css-report.json', 'utf8'));

// Component ID to name mapping (you can expand this based on your project)
// This maps the data-v-XXXXX IDs to meaningful component names
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

// Find potential component matches for unknown component IDs
function findPotentialComponentMatches(componentId, selectors) {
  // This is a simplified approach - in a real implementation, you would:
  // 1. Scan your Vue files for potential matches
  // 2. Look for components with similar class names or patterns
  
  const potentialMatches = [];
  
  // Example: Look for Vue files in the src directory
  try {
    // Get all Vue files in the project
    const vueFiles = glob.sync(path.join(__dirname, 'src/**/*.vue'));
    
    // For each selector, try to find Vue files that might contain similar class names
    const classNames = selectors.map(selector => {
      // Extract class name from selector (e.g., '.my-class[data-v-123456]' -> 'my-class')
      const match = selector.match(/\.([a-zA-Z0-9_-]+)(?:\[|$|\s|:)/);
      return match ? match[1] : null;
    }).filter(Boolean);
    
    // Check each Vue file for potential matches
    for (const file of vueFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Simple heuristic: if the file contains any of the class names, it's a potential match
      const matchesFound = classNames.some(className => content.includes(className));
      
      if (matchesFound) {
        // Get the component name from the file path
        const componentName = path.basename(file, '.vue');
        potentialMatches.push(componentName);
        
        // Limit to 5 potential matches
        if (potentialMatches.length >= 5) break;
      }
    }
  } catch (error) {
    console.warn(`Could not scan for potential component matches: ${error.message}`);
  }
  
  return potentialMatches;
}

// Find the HomePage CSS file entry
const homepageEntry = report.find(entry => 
  entry.file.includes('HomePage') || entry.file.includes('HomePage-IKIVVTRY.css')
);

if (!homepageEntry) {
  console.error('HomePage CSS file not found in the report');
  process.exit(1);
}

// Group selectors by component (based on data-v- attributes)
const componentGroups = {};
const utilityClasses = [];
const themeClasses = [];
const otherClasses = [];

// Additional stats
const stats = {
  totalSelectors: homepageEntry.rejectedSelectors.length,
  componentSelectors: 0,
  themeSelectors: 0,
  utilitySelectors: 0,
  otherSelectors: 0,
  componentBreakdown: {},
  // Align with project folder structure
  componentTypes: {
    common: { count: 0, selectors: [] },
    ui: { count: 0, selectors: [] },
    chat: { count: 0, selectors: [] },
    effects: { count: 0, selectors: [] },
    layout: { count: 0, selectors: [] },
    other: { count: 0, selectors: [] }
  }
};

// Manual override for component categorization
const componentTypeOverrides = {
  'e43325f4': 'common', // LoadingDots
  'f600ccf0': 'effects', // RetroWaveElement
  '79360350': 'chat',    // ChatContainer
  // Add more overrides as needed
};

// Function to categorize component by ID using multiple strategies
function categorizeComponentById(componentId, selectors) {
  // 1. Check for manual override first
  if (componentTypeOverrides[componentId]) {
    return componentTypeOverrides[componentId];
  }
  
  // 2. Try to infer from component name if available
  const componentName = componentMap[componentId] || '';
  
  // 3. Analyze selectors for clues about the component type
  const selectorText = selectors.join(' ');
  
  // Chat-related components
  if (componentName.includes('Chat') || 
      componentName.includes('Message') || 
      selectorText.includes('chat') || 
      selectorText.includes('message') ||
      selectorText.includes('typing-indicator')) {
    return 'chat';
  }
  
  // UI components
  if (componentName.includes('Button') || 
      componentName.includes('Card') || 
      componentName.includes('Input') ||
      componentName.includes('Theme') ||
      selectorText.includes('button') || 
      selectorText.includes('card') ||
      selectorText.includes('theme-')) {
    return 'ui';
  }
  
  // Effect/animation components
  if (componentName.includes('Animation') || 
      componentName.includes('Effect') || 
      componentName.includes('Transition') ||
      selectorText.includes('animation') || 
      selectorText.includes('transition') ||
      selectorText.includes('reveal') ||
      selectorText.includes('ember')) {
    return 'effects';
  }
  
  // Layout components
  if (componentName.includes('Layout') || 
      componentName.includes('Container') || 
      componentName.includes('Section') ||
      componentName.includes('Grid') ||
      selectorText.includes('container') || 
      selectorText.includes('section') ||
      selectorText.includes('layout') ||
      selectorText.includes('grid')) {
    return 'layout';
  }
  
  // Common components (fallback for general UI elements)
  if (componentName.includes('Base') ||
      selectorText.includes('base-')) {
    return 'common';
  }
  
  // Default fallback
  return 'other';
}

homepageEntry.rejectedSelectors.forEach(selector => {
  // Check if it's a component selector (with data-v- attribute)
  const componentMatch = selector.match(/\[data-v-([a-z0-9]+)\]/);
  if (componentMatch) {
    const componentId = componentMatch[1];
    if (!componentGroups[componentId]) {
      componentGroups[componentId] = [];
      stats.componentBreakdown[componentId] = 0;
    }
    componentGroups[componentId].push(selector);
    stats.componentSelectors++;
    stats.componentBreakdown[componentId]++;
    
    // Get all selectors for this component to help with categorization
    const componentSelectors = componentGroups[componentId];
    
    // Categorize using the combined approach
    const category = categorizeComponentById(componentId, componentSelectors);
    stats.componentTypes[category].count++;
    stats.componentTypes[category].selectors.push(selector);
    
    return;
  }
  
  // Check if it's a theme-specific class
  if (selector.startsWith('.theme-')) {
    themeClasses.push(selector);
    stats.themeSelectors++;
    return;
  }
  
  // Check if it's a utility class (simple pattern like .mb-1, .w-12, etc.)
  if (/^\.\w+(-\w+)*$/.test(selector) && !selector.includes(' ')) {
    utilityClasses.push(selector);
    stats.utilitySelectors++;
    return;
  }
  
  // Everything else
  otherClasses.push(selector);
  stats.otherSelectors++;
});

// Format the data for the report
const formattedReport = {
  file: homepageEntry.file,
  totalRejectedSelectors: homepageEntry.rejectedSelectors.length,
  components: Object.entries(componentGroups).map(([id, selectors]) => {
    // Find potential matches for unknown components
    let potentialMatches = [];
    if (!componentMap[id]) {
      potentialMatches = findPotentialComponentMatches(id, selectors);
    }
    
    return {
      componentId: id,
      componentName: componentMap[id] || 'Unknown Component',
      selectorCount: selectors.length,
      selectors,
      percentage: ((selectors.length / homepageEntry.rejectedSelectors.length) * 100).toFixed(1),
      potentialMatches
    };
  }),
  themeClasses,
  utilityClasses,
  otherClasses,
  stats
};

// Sort components by selector count (highest first)
formattedReport.components.sort((a, b) => b.selectorCount - a.selectorCount);

// Create HTML content
let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unused CSS Classes - ${formattedReport.file}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1, h2, h3 { margin-top: 30px; }
    .component { margin-bottom: 10px; border: 1px solid #eee; border-radius: 5px; }
    .stats { display: flex; flex-wrap: wrap; gap: 15px; margin: 20px 0; }
    .stat-card { background: #f9f9f9; border-radius: 5px; padding: 15px; flex: 1; min-width: 200px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .stat-value { font-size: 24px; font-weight: bold; margin: 10px 0; }
    .chart-container { height: 300px; margin: 30px 0; }
    .component-type-breakdown { display: flex; flex-wrap: wrap; gap: 15px; margin: 20px 0; }
    .type-card { background: #f5f5f5; border-radius: 5px; padding: 15px; flex: 1; min-width: 150px; }
    .type-count { font-size: 20px; font-weight: bold; margin: 10px 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f2f2f2; }
    .progress-bar { height: 20px; background: #e9ecef; border-radius: 5px; margin-top: 5px; }
    .progress-bar-fill { height: 100%; border-radius: 5px; background: #4CAF50; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <h1>Unused CSS Classes Report</h1>
  <p>File: <code>${formattedReport.file}</code></p>
  
  <div class="stats">
    <div class="stat-card">
      <h3>Total Unused Selectors</h3>
      <div class="stat-value">${formattedReport.totalRejectedSelectors}</div>
    </div>
    <div class="stat-card">
      <h3>Component Selectors</h3>
      <div class="stat-value">${stats.componentSelectors}</div>
      <div>${((stats.componentSelectors / formattedReport.totalRejectedSelectors) * 100).toFixed(1)}% of total</div>
    </div>
    <div class="stat-card">
      <h3>Theme Selectors</h3>
      <div class="stat-value">${stats.themeSelectors}</div>
      <div>${((stats.themeSelectors / formattedReport.totalRejectedSelectors) * 100).toFixed(1)}% of total</div>
    </div>
    <div class="stat-card">
      <h3>Utility Selectors</h3>
      <div class="stat-value">${stats.utilitySelectors}</div>
      <div>${((stats.utilitySelectors / formattedReport.totalRejectedSelectors) * 100).toFixed(1)}% of total</div>
    </div>
  </div>
  
  <h2>Component Types Breakdown</h2>
  <p class="info-text">Components are categorized based on a combination of:
    <ol>
      <li>Manual categorization overrides</li>
      <li>Component naming patterns</li>
      <li>Analysis of selector text and class names</li>
    </ol>
    This provides a project-specific view while remaining flexible for components without explicit categorization.
  </p>
  
  <div class="chart-container">
    <canvas id="componentTypesChart"></canvas>
  </div>
  
  <div class="component-type-breakdown">
    <div class="type-card">
      <h3>Common Components</h3>
      <div class="type-count">${stats.componentTypes.common.count}</div>
      <div>${((stats.componentTypes.common.count / stats.componentSelectors) * 100).toFixed(1)}% of component selectors</div>
    </div>
    <div class="type-card">
      <h3>UI Components</h3>
      <div class="type-count">${stats.componentTypes.ui.count}</div>
      <div>${((stats.componentTypes.ui.count / stats.componentSelectors) * 100).toFixed(1)}% of component selectors</div>
    </div>
    <div class="type-card">
      <h3>Chat Components</h3>
      <div class="type-count">${stats.componentTypes.chat.count}</div>
      <div>${((stats.componentTypes.chat.count / stats.componentSelectors) * 100).toFixed(1)}% of component selectors</div>
    </div>
    <div class="type-card">
      <h3>Effects & Animations</h3>
      <div class="type-count">${stats.componentTypes.effects.count}</div>
      <div>${((stats.componentTypes.effects.count / stats.componentSelectors) * 100).toFixed(1)}% of component selectors</div>
    </div>
    <div class="type-card">
      <h3>Layout Components</h3>
      <div class="type-count">${stats.componentTypes.layout.count}</div>
      <div>${((stats.componentTypes.layout.count / stats.componentSelectors) * 100).toFixed(1)}% of component selectors</div>
    </div>
    <div class="type-card">
      <h3>Other Components</h3>
      <div class="type-count">${stats.componentTypes.other.count}</div>
      <div>${((stats.componentTypes.other.count / stats.componentSelectors) * 100).toFixed(1)}% of component selectors</div>
    </div>
  </div>
  
  <h2>Components (${formattedReport.components.length})</h2>
  <table>
    <tr>
      <th>Component</th>
      <th>Unused Selectors</th>
      <th>Percentage</th>
    </tr>
    ${formattedReport.components.map(comp => `
      <tr>
        <td>${comp.componentName} <code>(${comp.componentId})</code></td>
        <td>${comp.selectorCount}</td>
        <td>
          ${comp.percentage}%
          <div class="progress-bar">
            <div class="progress-bar-fill" style="width: ${comp.percentage}%"></div>
          </div>
        </td>
      </tr>
    `).join('')}
  </table>
`;

// Add explanation of categorization approaches
html += `
  <h2>Unused CSS Analysis</h2>
  
  <div class="analysis-section">
    <h3>Project Structure-Based Grouping</h3>
    <p class="info-text">
      This grouping aligns with your current project file structure, as observed in your documentation:
      <ul>
        <li><strong>Common Components:</strong> Base/foundational components (BaseCard, etc.)</li>
        <li><strong>UI Components:</strong> Themed elements, buttons, cards, forms</li>
        <li><strong>Chat Components:</strong> Message bubbles, chat containers, typing indicators</li>
        <li><strong>Effects & Animations:</strong> Transitions, reveals, animations</li>
        <li><strong>Layout Components:</strong> Containers, sections, grids, layouts</li>
      </ul>
    </p>
    
    <div class="chart-container">
      <canvas id="componentTypesChart"></canvas>
    </div>
    
    <div class="component-type-breakdown">
      <div class="type-card">
        <h3>Common Components</h3>
        <div class="type-count">${stats.componentTypes.common.count}</div>
        <div>${((stats.componentTypes.common.count / stats.componentSelectors) * 100).toFixed(1)}% of component selectors</div>
      </div>
      <div class="type-card">
        <h3>UI Components</h3>
        <div class="type-count">${stats.componentTypes.ui.count}</div>
        <div>${((stats.componentTypes.ui.count / stats.componentSelectors) * 100).toFixed(1)}% of component selectors</div>
      </div>
      <div class="type-card">
        <h3>Chat Components</h3>
        <div class="type-count">${stats.componentTypes.chat.count}</div>
        <div>${((stats.componentTypes.chat.count / stats.componentSelectors) * 100).toFixed(1)}% of component selectors</div>
      </div>
      <div class="type-card">
        <h3>Effects & Animations</h3>
        <div class="type-count">${stats.componentTypes.effects.count}</div>
        <div>${((stats.componentTypes.effects.count / stats.componentSelectors) * 100).toFixed(1)}% of component selectors</div>
      </div>
      <div class="type-card">
        <h3>Layout Components</h3>
        <div class="type-count">${stats.componentTypes.layout.count}</div>
        <div>${((stats.componentTypes.layout.count / stats.componentSelectors) * 100).toFixed(1)}% of component selectors</div>
      </div>
      <div class="type-card">
        <h3>Other Components</h3>
        <div class="type-count">${stats.componentTypes.other.count}</div>
        <div>${((stats.componentTypes.other.count / stats.componentSelectors) * 100).toFixed(1)}% of component selectors</div>
      </div>
    </div>
  </div>

  <div class="analysis-section">
    <h3>Selector Type-Based Grouping</h3>
    <p class="info-text">
      This grouping categorizes selectors based on their nature, regardless of component:
      <ul>
        <li><strong>Component Selectors:</strong> Scoped to specific components (with data-v- attributes)</li>
        <li><strong>Theme Selectors:</strong> Related to theming (theme-* classes)</li>
        <li><strong>Utility Selectors:</strong> Generic utility classes (flex, gap-*, etc.)</li>
        <li><strong>Other Selectors:</strong> Miscellaneous selectors that don't fit other categories</li>
      </ul>
    </p>
    
    <div class="chart-container">
      <canvas id="selectorTypesChart"></canvas>
    </div>
    
    <div class="selector-type-breakdown">
      <div class="type-card">
        <h3>Component Selectors</h3>
        <div class="type-count">${stats.componentSelectors}</div>
        <div>${((stats.componentSelectors / stats.totalSelectors) * 100).toFixed(1)}% of total selectors</div>
      </div>
      <div class="type-card">
        <h3>Theme Selectors</h3>
        <div class="type-count">${stats.themeSelectors}</div>
        <div>${((stats.themeSelectors / stats.totalSelectors) * 100).toFixed(1)}% of total selectors</div>
      </div>
      <div class="type-card">
        <h3>Utility Selectors</h3>
        <div class="type-count">${stats.utilitySelectors}</div>
        <div>${((stats.utilitySelectors / stats.totalSelectors) * 100).toFixed(1)}% of total selectors</div>
      </div>
      <div class="type-card">
        <h3>Other Selectors</h3>
        <div class="type-count">${stats.otherSelectors}</div>
        <div>${((stats.otherSelectors / stats.totalSelectors) * 100).toFixed(1)}% of total selectors</div>
      </div>
    </div>
  </div>
`;

// Add CSS for the new sections
const css = `
  /* Existing CSS */
  
  /* Analysis sections */
  .analysis-section {
    margin-bottom: 40px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  
  .analysis-section h3 {
    margin-top: 0;
    color: #333;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
  }
  
  .info-text {
    color: #555;
    line-height: 1.5;
    margin-bottom: 20px;
  }
  
  .info-text ul {
    padding-left: 20px;
  }
  
  .info-text li {
    margin-bottom: 5px;
  }
  
  .chart-container {
    height: 300px;
    margin: 20px 0;
  }
  
  .component-type-breakdown,
  .selector-type-breakdown {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    margin-top: 20px;
  }
  
  .type-card {
    background-color: white;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    text-align: center;
  }
  
  .type-card h3 {
    margin-top: 0;
    font-size: 16px;
    border-bottom: none;
    padding-bottom: 0;
  }
  
  .type-count {
    font-size: 24px;
    font-weight: bold;
    margin: 10px 0;
    color: #333;
  }
`;

// Update the charts
html += `
<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Project structure-based chart
    const ctxComponentTypes = document.getElementById('componentTypesChart').getContext('2d');
    new Chart(ctxComponentTypes, {
      type: 'pie',
      data: {
        labels: ['Common', 'UI', 'Chat', 'Effects', 'Layout', 'Other'],
        datasets: [{
          data: [
            ${stats.componentTypes.common.count},
            ${stats.componentTypes.ui.count},
            ${stats.componentTypes.chat.count},
            ${stats.componentTypes.effects.count},
            ${stats.componentTypes.layout.count},
            ${stats.componentTypes.other.count}
          ],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Unused CSS by Component Type'
          }
        }
      }
    });
    
    // Selector type-based chart
    const ctxSelectorTypes = document.getElementById('selectorTypesChart').getContext('2d');
    new Chart(ctxSelectorTypes, {
      type: 'pie',
      data: {
        labels: ['Component Selectors', 'Theme Selectors', 'Utility Selectors', 'Other Selectors'],
        datasets: [{
          data: [
            ${stats.componentSelectors},
            ${stats.themeSelectors},
            ${stats.utilitySelectors},
            ${stats.otherSelectors}
          ],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Unused CSS by Selector Type'
          }
        }
      }
    });
  });
</script>
`;

// Write the HTML report
fs.writeFileSync('./unused-css-report.html', html);
console.log('Enhanced HTML report saved to unused-css-report.html');
