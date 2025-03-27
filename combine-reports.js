// Combine HTML reports into a single tabbed interface
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the existing reports
const unusedCssReport = fs.existsSync('./unused-css-report.html') 
  ? fs.readFileSync('./unused-css-report.html', 'utf8')
  : '<p>Unused CSS report not found</p>';

// Generate component style report HTML if it doesn't exist yet
let componentStyleReport = '';
if (fs.existsSync('./component-style-usage.json')) {
  const componentData = JSON.parse(fs.readFileSync('./component-style-usage.json', 'utf8'));
  componentStyleReport = generateComponentStyleReportHtml(componentData);
} else {
  componentStyleReport = '<p>Component style usage report not found</p>';
}

// Add SCSS analysis report
const scssAnalysisReport = fs.existsSync('./scss-analysis.log') 
  ? fs.readFileSync('./scss-analysis.log', 'utf8')
  : '<p>SCSS analysis report not found</p>';

// Format the SCSS log into HTML
function formatScssLogToHtml(logContent) {
  // Replace newlines with <br> tags and format sections
  const htmlContent = logContent
    .replace(/^Project Overview:/m, '<h2>Project Overview:</h2>')
    .replace(/^SCSS Structure Analysis:/m, '<h2>SCSS Structure Analysis:</h2>')
    .replace(/^Variable Analysis:/m, '<h2>Variable Analysis:</h2>')
    .replace(/^Mixin Analysis:/m, '<h2>Mixin Analysis:</h2>')
    .replace(/^Nesting Depth Analysis:/m, '<h2>Nesting Depth Analysis:</h2>')
    .replace(/^Redundancy Analysis:/m, '<h2>Redundancy Analysis:</h2>')
    .replace(/\n/g, '<br>');
  
  return `<div class="scss-analysis-content">${htmlContent}</div>`;
}

// Create the combined HTML
const combinedHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSS Analysis Reports</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      line-height: 1.6; 
      margin: 0; 
      padding: 0;
      color: #333;
    }
    
    .tabs-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .tab-navigation {
      display: flex;
      border-bottom: 1px solid #ddd;
      margin-bottom: 20px;
      position: sticky;
      top: 0;
      background: white;
      z-index: 100;
      padding: 10px 0;
    }
    
    .tab-button {
      padding: 10px 20px;
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-bottom: none;
      margin-right: 5px;
      border-radius: 5px 5px 0 0;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    
    .tab-button:hover {
      background: #e9e9e9;
    }
    
    .tab-button.active {
      background: #fff;
      border-bottom: 1px solid white;
      margin-bottom: -1px;
      font-weight: 600;
    }
    
    .tab-content {
      display: none;
    }
    
    .tab-content.active {
      display: block;
    }
    
    /* Component style report specific styles */
    .component-category {
      margin-bottom: 30px;
      padding: 15px;
      border-radius: 8px;
      background: #f9f9f9;
    }
    
    .component-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }
    
    .component-card {
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 15px;
      background: white;
    }
    
    .component-path {
      font-size: 0.9em;
      color: #666;
      margin-bottom: 10px;
      word-break: break-all;
    }
    
    .scss-imports {
      margin-top: 10px;
    }
    
    .scss-imports ul, .classes-list ul {
      padding-left: 20px;
      margin: 5px 0;
    }
    
    .classes-list {
      margin-top: 10px;
    }
    
    .class-tag {
      display: inline-block;
      background: #f0f0f0;
      padding: 2px 6px;
      border-radius: 3px;
      margin: 2px;
      font-size: 0.85em;
    }
    
    .stats-container {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin: 20px 0;
    }
    
    .stat-box {
      flex: 1;
      min-width: 200px;
      background: #f5f5f5;
      padding: 15px;
      border-radius: 5px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      text-align: center;
    }
    
    .stat-number {
      font-size: 2em;
      font-weight: bold;
      margin: 10px 0;
    }
    
    .stat-label {
      font-size: 1em;
      color: #666;
    }
    
    /* Add SCSS analysis specific styles */
    .scss-analysis-content {
      line-height: 1.6;
      white-space: pre-wrap;
    }
    
    .scss-analysis-content h2 {
      margin-top: 30px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <div class="tabs-container">
    <h1>CSS Analysis Reports</h1>
    
    <div class="tab-navigation">
      <button class="tab-button active" data-tab="unused-css">Unused CSS Report</button>
      <button class="tab-button" data-tab="component-styles">Component Style Usage</button>
      <button class="tab-button" data-tab="scss-analysis">SCSS Analysis</button>
    </div>
    
    <div id="unused-css" class="tab-content active">
      ${extractBodyContent(unusedCssReport)}
    </div>
    
    <div id="component-styles" class="tab-content">
      ${componentStyleReport}
    </div>
    
    <div id="scss-analysis" class="tab-content">
      ${formatScssLogToHtml(scssAnalysisReport)}
    </div>
  </div>
  
  <script>
    // Tab switching functionality
    document.addEventListener('DOMContentLoaded', function() {
      const tabButtons = document.querySelectorAll('.tab-button');
      const tabContents = document.querySelectorAll('.tab-content');
      
      tabButtons.forEach(button => {
        button.addEventListener('click', function() {
          // Update active button
          tabButtons.forEach(btn => btn.classList.remove('active'));
          this.classList.add('active');
          
          // Show active content
          const tabId = this.getAttribute('data-tab');
          tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === tabId) {
              content.classList.add('active');
            }
          });
        });
      });
      
      // Initialize any charts that might be in the unused CSS report
      if (typeof Chart !== 'undefined') {
        // The charts will be initialized when their tab is shown
        document.querySelector('[data-tab="unused-css"]').addEventListener('click', function() {
          setTimeout(() => {
            if (window.initializeCharts && typeof window.initializeCharts === 'function') {
              window.initializeCharts();
            }
          }, 100);
        });
      }
    });
  </script>
</body>
</html>
`;

// Helper function to extract the body content from an HTML string
function extractBodyContent(html) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch && bodyMatch[1]) {
    return bodyMatch[1];
  }
  
  // If no body tags found, extract content between the first and last HTML tags
  const contentMatch = html.match(/^.*?<html[^>]*>([\s\S]*)<\/html>/i);
  if (contentMatch && contentMatch[1]) {
    return contentMatch[1];
  }
  
  // If all else fails, return the original HTML
  return html;
}

// Generate HTML for the component style usage report
function generateComponentStyleReportHtml(data) {
  // Check if data is an array (from analyze-component-styles-json.js)
  if (Array.isArray(data)) {
    // Convert array format to the expected object format
    const formattedData = {
      definitelyUsing: {},
      probablyUsing: {},
      notUsing: {}
    };
    
    data.forEach(component => {
      if (component.hasStyles) {
        formattedData.definitelyUsing[component.component] = {
          path: component.component,
          styleInfo: component.styleInfo,
          // Extract component ID from the path if available
          componentId: component.component.match(/\[data-v-([a-f0-9]+)\]/) ? 
                      component.component.match(/\[data-v-([a-f0-9]+)\]/)[1] : null
        };
      } else {
        formattedData.notUsing[component.component] = {
          path: component.component
        };
      }
    });
    
    data = formattedData;
  }
  
  // Ensure data has the expected structure
  if (!data.definitelyUsing) data.definitelyUsing = {};
  if (!data.probablyUsing) data.probablyUsing = {};
  if (!data.notUsing) data.notUsing = {};
  
  const definiteCount = Object.keys(data.definitelyUsing).length;
  const probableCount = Object.keys(data.probablyUsing).length;
  const notUsingCount = Object.keys(data.notUsing).length;
  const totalComponents = definiteCount + probableCount + notUsingCount;
  
  // Generate the HTML report
  return `
    <h2>Component Style Usage Analysis</h2>
    <p>Total Components: ${totalComponents}</p>
    
    <div class="stats-container">
      <div class="stat-box">
        <div class="stat-number">${definiteCount}</div>
        <div class="stat-label">Components with styles</div>
      </div>
      <div class="stat-box">
        <div class="stat-number">${probableCount}</div>
        <div class="stat-label">Components with probable styles</div>
      </div>
      <div class="stat-box">
        <div class="stat-number">${notUsingCount}</div>
        <div class="stat-label">Components without styles</div>
      </div>
    </div>
    
    <div class="chart-container">
      <canvas id="componentStylesChart"></canvas>
    </div>
    
    <h3>Components with Direct Style Usage</h3>
    <div class="component-category">
      <p>These components either have SCSS style blocks or directly import SCSS files.</p>
      <div class="component-list">
        ${generateComponentCards(data.definitelyUsing)}
      </div>
    </div>
    
    <h3>Components with Probable Style Usage</h3>
    <div class="component-category">
      <p>These components don't directly import SCSS but have matching SCSS files by name.</p>
      <div class="component-list">
        ${generateComponentCards(data.probablyUsing)}
      </div>
    </div>
    
    <h3>Components without Style Usage</h3>
    <div class="component-category">
      <p>These components don't have any detected style usage.</p>
      <div class="component-list">
        ${generateComponentCards(data.notUsing)}
      </div>
    </div>
    
    <style>
      .component-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }
      
      .component-card {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        background-color: #f9f9f9;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      }
      
      .component-header {
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
      }
      
      .component-name {
        margin: 0;
        font-size: 18px;
        color: #333;
      }
      
      .component-path {
        display: block;
        font-size: 12px;
        color: #666;
        margin-top: 5px;
      }
      
      .style-detail {
        margin-bottom: 8px;
        font-size: 14px;
      }
      
      .detail-label {
        font-weight: bold;
        color: #555;
      }
      
      .import-list {
        margin: 5px 0 0 20px;
        padding: 0;
        font-size: 13px;
      }
      
      .class-list {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-top: 5px;
      }
      
      .class-tag {
        background-color: #e0f7fa;
        color: #00838f;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
      }
      
      .empty-message {
        color: #999;
        font-style: italic;
      }
    </style>
    
    <script>
      // Chart.js code for component styles
      const componentStylesCtx = document.getElementById('componentStylesChart').getContext('2d');
      new Chart(componentStylesCtx, {
        type: 'pie',
        data: {
          labels: ['With Styles', 'Probable Styles', 'No Styles'],
          datasets: [{
            data: [${definiteCount}, ${probableCount}, ${notUsingCount}],
            backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
            }
          }
        }
      });
    </script>
  `;
}

// Helper function to generate component cards
function generateComponentCards(components) {
  if (!components || Object.keys(components).length === 0) {
    return '<p class="empty-message">No components in this category</p>';
  }
  
  return Object.entries(components).map(([path, data]) => {
    const componentName = path.split('/').pop();
    const styleInfo = data.styleInfo || {};
    
    // Format style details
    let styleDetails = '';
    if (styleInfo.styleBlocks > 0) {
      styleDetails += `
        <div class="style-detail">
          <span class="detail-label">Style blocks:</span> ${styleInfo.styleBlocks}
        </div>
        <div class="style-detail">
          <span class="detail-label">Language:</span> ${styleInfo.lang || 'None'}
        </div>
        <div class="style-detail">
          <span class="detail-label">Scoped:</span> ${styleInfo.scoped ? 'Yes' : 'No'}
        </div>
        <div class="style-detail">
          <span class="detail-label">Lines:</span> ${styleInfo.lineCount}
        </div>
        <div class="style-detail">
          <span class="detail-label">Selectors:</span> ${styleInfo.selectorCount}
        </div>
      `;
    }
    
    // Add SCSS imports if available
    if (data.scssImports && data.scssImports.length > 0) {
      styleDetails += `
        <div class="style-detail">
          <span class="detail-label">SCSS Imports:</span>
          <ul class="import-list">
            ${data.scssImports.map(imp => `<li>${imp}</li>`).join('')}
          </ul>
        </div>
      `;
    }
    
    // Add matching SCSS files if available
    if (data.matchingScssFiles && data.matchingScssFiles.length > 0) {
      styleDetails += `
        <div class="style-detail">
          <span class="detail-label">Potential SCSS files:</span>
          <ul class="import-list">
            ${data.matchingScssFiles.map(file => `<li>${file}</li>`).join('')}
          </ul>
        </div>
      `;
    }
    
    // Add classes if available
    if (data.classes && data.classes.length > 0) {
      styleDetails += `
        <div class="style-detail">
          <span class="detail-label">Classes used:</span>
          <div class="class-list">
            ${data.classes.map(cls => `<span class="class-tag">${cls}</span>`).join('')}
          </div>
        </div>
      `;
    }
    
    return `
      <div class="component-card">
        <div class="component-header">
          <h4 class="component-name">${componentName}</h4>
          <span class="component-path">${path}</span>
        </div>
        <div class="component-details">
          ${styleDetails || '<p>No style details available</p>'}
        </div>
      </div>
    `;
  }).join('');
}

// Write the combined report
fs.writeFileSync('./css-analysis-reports.html', combinedHtml);
console.log('Combined report saved to css-analysis-reports.html');
