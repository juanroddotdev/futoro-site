// analyze-component-styles-json.js
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

async function analyzeComponentStyles() {
  console.log('Analyzing component styles...');
  
  // Get all Vue files, excluding _unused folder
  const vueFiles = await glob('src/**/*.vue', {
    ignore: [
      'src/_unused/**',
      '**/node_modules/**',
      'project-backup-*/**',
      'pre-restoration-backup-*/**'
    ]
  });
  
  const results = [];
  
  for (const file of vueFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = file.replace(/^src\//, '');
    
    // Extract <style> blocks
    const styleMatches = content.match(/<style[^>]*>([\s\S]*?)<\/style>/g) || [];
    
    if (styleMatches.length === 0) {
      // No style blocks found
      results.push({
        component: relativePath,
        hasStyles: false,
        styleInfo: {
          styleBlocks: 0,
          scoped: false,
          module: false,
          lang: null,
          lineCount: 0,
          selectorCount: 0
        }
      });
      continue;
    }
    
    // Analyze style blocks
    let totalLines = 0;
    let totalSelectors = 0;
    let isScoped = false;
    let isModule = false;
    let lang = null;
    
    for (const styleBlock of styleMatches) {
      // Check if scoped
      if (styleBlock.includes('<style scoped') || styleBlock.includes('<style lang="scss" scoped')) {
        isScoped = true;
      }
      
      // Check if module
      if (styleBlock.includes('<style module')) {
        isModule = true;
      }
      
      // Check language
      const langMatch = styleBlock.match(/<style.*?lang=["']([^"']+)["']/);
      if (langMatch) {
        lang = langMatch[1];
      }
      
      // Count lines
      const styleContent = styleBlock.replace(/<style[^>]*>|<\/style>/g, '').trim();
      const lines = styleContent.split('\n').filter(line => line.trim() !== '');
      totalLines += lines.length;
      
      // Count selectors (rough estimate)
      const selectors = styleContent.split('{').length - 1;
      totalSelectors += selectors;
    }
    
    results.push({
      component: relativePath,
      hasStyles: true,
      styleInfo: {
        styleBlocks: styleMatches.length,
        scoped: isScoped,
        module: isModule,
        lang: lang || 'css',
        lineCount: totalLines,
        selectorCount: totalSelectors
      }
    });
  }
  
  // Write results to JSON file
  fs.writeFileSync('component-style-usage.json', JSON.stringify(results, null, 2));
  console.log(`Analysis complete. Found ${results.length} components.`);
}

analyzeComponentStyles().catch(console.error);
