#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

/**
 * Commit message validation script
 * Validates that commit messages follow the format: {epic}-{story}: description
 * Also validates that epic-story matches the current branch
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

function warning(message) {
  log(`⚠ ${message}`, colors.yellow);
}

/**
 * Main validation function
 */
function validateCommitMessage() {
  // Get commit message from file (passed as first argument)
  const commitMsgFile = process.argv[2];

  if (!commitMsgFile) {
    error('No commit message file provided');
    process.exit(1);
  }

  // Read commit message
  const commitMsg = fs.readFileSync(commitMsgFile, 'utf-8').trim();

  // Allow merge commits and other special commits
  if (
    commitMsg.startsWith('Merge') ||
    commitMsg.startsWith('Revert') ||
    commitMsg.startsWith('Initial commit') ||
    commitMsg.startsWith('chore:') ||
    commitMsg.startsWith('docs:')
  ) {
    success('Special commit message - validation skipped');
    process.exit(0);
  }

  // Get current branch
  let currentBranch;
  try {
    currentBranch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
  } catch (err) {
    error('Failed to get current branch');
    process.exit(1);
  }

  // Allow any commit message on main (shouldn't happen due to pre-commit hook, but just in case)
  if (currentBranch === 'main') {
    warning('Committing to main branch - commit message validation skipped');
    process.exit(0);
  }

  // Validate commit message format: {epic}-{story}: description
  const commitMsgPattern = /^(\d+)-(\d+): (.+)/;
  const commitMatch = commitMsg.match(commitMsgPattern);

  if (!commitMatch) {
    error('Invalid commit message format!');
    error('');
    error('Expected format: {epic}-{story}: description');
    error('Example: 1-2: Create menu database schema');
    error('');
    error(`Your message: ${commitMsg}`);
    error('');
    error('Special commits (merge, revert, chore:, docs:) are allowed.');
    process.exit(1);
  }

  const [, commitEpic, commitStory, description] = commitMatch;

  // Extract epic and story from branch name
  const branchPattern = /^(\d+)\/(\d+)-(.+)$/;
  const branchMatch = currentBranch.match(branchPattern);

  if (!branchMatch) {
    warning(`Branch '${currentBranch}' doesn't follow story convention`);
    warning('Commit message validation passed, but consider using story branches');
    success(`Commit message format is valid: ${commitEpic}-${commitStory}: ${description}`);
    process.exit(0);
  }

  const [, branchEpic, branchStory] = branchMatch;

  // Validate that commit epic-story matches branch epic-story
  if (commitEpic !== branchEpic || commitStory !== branchStory) {
    error('Commit message epic-story does not match branch!');
    error('');
    error(`Branch: ${currentBranch} (Epic ${branchEpic}, Story ${branchStory})`);
    error(`Commit: ${commitEpic}-${commitStory}: ${description}`);
    error('');
    error(`Expected commit message to start with: ${branchEpic}-${branchStory}:`);
    process.exit(1);
  }

  success(`Commit message is valid: ${commitEpic}-${commitStory}: ${description}`);
  process.exit(0);
}

// Run validation
validateCommitMessage();
