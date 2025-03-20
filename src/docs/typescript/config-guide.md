# TypeScript Configuration Guide

## Strict Mode Toggle

The project uses different TypeScript strictness settings for development vs. production:

### Development Mode
During development, we relax certain checks to make iterative development easier:
- `"noUnusedLocals": false`
- `"noUnusedParameters": false`

### Production Mode
Before deployment, we should ensure strict type checking:
- `"noUnusedLocals": true`
- `"noUnusedParameters": true`

## How to Toggle Strict Checking

### Option 1: Using npm scripts
Run the strict type check before committing or deploying:
```bash
npm run type-check:strict
```

This will run the TypeScript compiler with strict settings without modifying your config files.

### Option 2: Manual toggle
If you need to manually toggle the settings, edit `tsconfig.app.json`:

```json
/* Linting */
"strict": true,
"noUnusedLocals": true,  // Change to true before committing
"noUnusedParameters": true,  // Change to true before committing
```

## Pre-commit Hook (Recommended)

Consider adding a pre-commit hook that runs the strict type check:

1. Install husky and lint-staged:
```bash
npm install --save-dev husky lint-staged
npx husky install
npm pkg set scripts.prepare="husky install"
```

2. Add a pre-commit hook:
```bash
npx husky add .husky/pre-commit "npm run type-check:strict"
```

This ensures code is checked with strict settings before each commit.