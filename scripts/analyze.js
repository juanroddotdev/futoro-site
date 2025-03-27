#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Configuration for all analysis types
const config = {
  deps: {
    circular: {
      cmd: 'npx dependency-cruiser --output-type err-long src/',
      desc: 'Checking for circular dependencies'
    },
    graph: {
      cmd: 'npx dependency-cruiser --exclude "node_modules" --output-type dot src/ | dot -T svg > dependency-graph.svg',
      desc: 'Generating dependency graph',
      requires: ['graphviz']
    },
    violations: {
      cmd: 'npx dependency-cruiser --output-type text src/ > dependency-violations.log',
      desc: 'Logging dependency violations'
    },
    all: {
      desc: 'Running all dependency analyses'
    }
  },
  css: {
    cmd: 'npm run build && node purgecss.js',
    desc: 'Analyzing unused CSS'
  },
  scss: {
    cmd: './src/scripts/analyze-scss.sh',
    desc: 'Analyzing SCSS structure'
  },
  components: {
    cmd: 'node analyze-component-styles-json.js',
    desc: 'Analyzing component styles'
  },
  report: {
    cmd: 'node combine-reports.js',
    desc: 'Generating combined reports'
  },
  all: {
    desc: 'Running all analyses'
  }
};

// Check if a tool is installed
function isToolInstalled(tool) {
  try {
    execSync(`which ${tool}`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Run a command and return success status
function runCommand(command, description) {
  console.log(`\n--- ${description} ---`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed with error:`);
    console.error(error.message);
    return false;
  }
}

// Main function to run analyses
function runAnalyses(type) {
  let successCount = 0;
  let failCount = 0;
  let analysisCount = 0;
  
  // Parse the analysis type (e.g., "deps:circular" -> ["deps", "circular"])
  const [category, subtype] = type.includes(':') ? type.split(':') : [type, 'all'];
  
  // Handle "all" analysis
  if (category === 'all') {
    // Run build first
    runCommand('npm run build', 'Building project');
    
    // Run all analyses
    Object.keys(config).forEach(cat => {
      if (cat !== 'all') {
        runAnalyses(cat);
      }
    });
    return;
  }
  
  // Check if category exists
  if (!config[category]) {
    console.error(`❌ Unknown analysis category: ${category}`);
    process.exit(1);
  }
  
  // Handle subcategory "all"
  if (subtype === 'all' && category === 'deps') {
    // Run all analyses in the category
    Object.keys(config[category]).forEach(sub => {
      if (sub !== 'all') {
        runAnalyses(`${category}:${sub}`);
      }
    });
    return;
  }
  
  // Handle specific analysis
  if (subtype !== 'all') {
    // Check if subcategory exists
    if (!config[category][subtype]) {
      console.error(`❌ Unknown analysis subtype: ${category}:${subtype}`);
      process.exit(1);
    }
    
    const analysis = config[category][subtype];
    
    // Check requirements
    if (analysis.requires) {
      for (const tool of analysis.requires) {
        if (!isToolInstalled(tool)) {
          console.warn(`\n⚠️ ${tool} not installed. Skipping ${analysis.desc}.`);
          console.warn(`To install ${tool}: brew install ${tool} (macOS) or apt-get install ${tool} (Linux)`);
          return;
        }
      }
    }
    
    // Run the analysis
    const success = runCommand(analysis.cmd, analysis.desc);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    analysisCount++;
  } else {
    // Run the specific category command
    const analysis = config[category];
    
    // Check requirements
    if (analysis.requires) {
      for (const tool of analysis.requires) {
        if (!isToolInstalled(tool)) {
          console.warn(`\n⚠️ ${tool} not installed. Skipping ${analysis.desc}.`);
          console.warn(`To install ${tool}: brew install ${tool} (macOS) or apt-get install ${tool} (Linux)`);
          return;
        }
      }
    }
    
    // Run the analysis
    const success = runCommand(analysis.cmd, analysis.desc);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    analysisCount++;
  }
  
  // Summary
  if (analysisCount > 0) {
    console.log('\n=== Analysis Summary ===');
    console.log(`Total analyses: ${analysisCount}`);
    console.log(`Successful: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    
    if (failCount === 0) {
      console.log('\n🎉 All analyses completed successfully!');
    } else {
      console.log('\n⚠️ Some analyses failed. Check the logs for details.');
    }
  }
}

// Get the analysis type from command line arguments
const analysisType = process.argv[2] || 'all';

// Run the specified analysis
runAnalyses(analysisType);