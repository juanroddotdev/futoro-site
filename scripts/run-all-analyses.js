#!/usr/bin/env node
import { execSync } from 'child_process';

// Simply run the analyze script with "all" parameter
try {
  execSync('node scripts/analyze.js all', { stdio: 'inherit' });
} catch (error) {
  console.error('Analysis failed with error:', error.message);
  process.exit(1);
}
