#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Pre-commit hook validation script
 * Runs:
 * 1. Branch validation (prevent direct commits to main)
 * 2. ESLint validation
 * 3. TypeScript build check
 * 4. Test coverage (when tests exist)
 */

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ ${message}`, colors.red);
}

function success(message) {
  log(`✓ ${message}`, colors.green);
}

function info(message) {
  log(`ℹ ${message}`, colors.blue);
}

function warning(message) {
  log(`⚠ ${message}`, colors.yellow);
}

/**
 * Check 1: Prevent direct commits to main branch
 */
function checkBranch() {
  info('Checking current branch...');

  try {
    const currentBranch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();

    if (currentBranch === 'main') {
      error('Direct commits to main branch are not allowed!');
      error('Please create a story branch: {epic}/{story}-{description}');
      error('Example: 1/1-2-menu-database-schema');
      return false;
    }

    // Validate branch naming convention for story branches
    const storyBranchPattern = /^\d+\/\d+-[a-z0-9-]+$/;
    if (!storyBranchPattern.test(currentBranch)) {
      warning(`Branch name '${currentBranch}' doesn't follow story convention`);
      warning('Expected format: {epic}/{story}-{description}');
      warning('Example: 1/1-2-menu-database-schema');
      // Don't fail, just warn for non-story branches
    }

    success(`On branch: ${currentBranch}`);
    return true;
  } catch (err) {
    error(`Failed to check branch: ${err.message}`);
    return false;
  }
}

/**
 * Check 2: Run ESLint
 */
function checkLint() {
  info('Running ESLint...');

  try {
    execSync('npm run lint', { stdio: 'inherit' });
    success('ESLint passed');
    return true;
  } catch (err) {
    error('ESLint failed! Please fix linting errors before committing.');
    return false;
  }
}

/**
 * Check 3: Run TypeScript build
 */
function checkBuild() {
  info('Running TypeScript build...');

  try {
    execSync('npm run build', { stdio: 'pipe' });
    success('TypeScript build passed');
    return true;
  } catch (err) {
    error('TypeScript build failed! Please fix type errors before committing.');
    error('Run "npm run build" to see detailed errors.');
    return false;
  }
}

/**
 * Check 4: Run tests (when they exist)
 */
function checkTests() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  // Check if test script exists
  if (!packageJson.scripts || !packageJson.scripts.test) {
    warning('No test script found in package.json - skipping tests');
    return true;
  }

  info('Running tests...');

  try {
    execSync('npm test -- --coverage --passWithNoTests', { stdio: 'inherit' });
    success('Tests passed');
    return true;
  } catch (err) {
    error('Tests failed! Please fix failing tests before committing.');
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  log('\n🔍 Running pre-commit checks...\n', colors.blue);

  const checks = [
    { name: 'Branch validation', fn: checkBranch },
    { name: 'ESLint', fn: checkLint },
    { name: 'TypeScript build', fn: checkBuild },
    { name: 'Tests', fn: checkTests }
  ];

  let allPassed = true;

  for (const check of checks) {
    const passed = check.fn();
    if (!passed) {
      allPassed = false;
      break; // Stop on first failure
    }
    console.log(''); // Add spacing between checks
  }

  if (allPassed) {
    log('✅ All pre-commit checks passed!\n', colors.green);
    process.exit(0);
  } else {
    log('❌ Pre-commit checks failed! Commit aborted.\n', colors.red);
    process.exit(1);
  }
}

main().catch((err) => {
  error(`Unexpected error: ${err.message}`);
  process.exit(1);
});
