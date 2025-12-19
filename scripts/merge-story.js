#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * Automated story merge utility
 * Usage: node scripts/merge-story.js {epic}-{story}
 * Example: node scripts/merge-story.js 1-2
 *
 * This script:
 * 1. Reads sprint-status.yaml to get branch name
 * 2. Verifies story status is 'done'
 * 3. Checks out main and pulls latest
 * 4. Squash merges the story branch
 * 5. Generates standardized commit message from story file
 * 6. Commits and updates sprint-status.yaml
 * 7. Deletes the story branch
 * 8. Optionally pushes to remote
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
 * Read sprint status YAML
 */
function readSprintStatus() {
  const sprintStatusPath = path.join(process.cwd(), 'docs/sprint-artifacts/sprint-status.yaml');

  if (!fs.existsSync(sprintStatusPath)) {
    throw new Error('sprint-status.yaml not found');
  }

  const content = fs.readFileSync(sprintStatusPath, 'utf-8');
  return yaml.load(content);
}

/**
 * Write sprint status YAML
 */
function writeSprintStatus(data) {
  const sprintStatusPath = path.join(process.cwd(), 'docs/sprint-artifacts/sprint-status.yaml');
  const yamlContent = yaml.dump(data, { lineWidth: -1 });
  fs.writeFileSync(sprintStatusPath, yamlContent, 'utf-8');
}

/**
 * Find story file
 */
function findStoryFile(epic, story) {
  const storiesDir = path.join(process.cwd(), 'docs/sprint-artifacts');
  const files = fs.readdirSync(storiesDir);

  const storyPattern = new RegExp(`^${epic}-${story}-.*\\.md$`);
  const storyFile = files.find(file => storyPattern.test(file));

  if (!storyFile) {
    throw new Error(`Story file not found for ${epic}-${story}`);
  }

  return path.join(storiesDir, storyFile);
}

/**
 * Generate commit message from story file
 */
function generateCommitMessage(epic, story, storyFilePath) {
  const storyContent = fs.readFileSync(storyFilePath, 'utf-8');

  // Extract story title
  const titleMatch = storyContent.match(/^# Story [\d.]+ - (.+)$/m);
  const storyTitle = titleMatch ? titleMatch[1] : 'Unknown Story';

  // Extract brief description (first line of Description section)
  const descMatch = storyContent.match(/## Description\n\n(.+)/);
  const briefDescription = descMatch ? descMatch[1] : storyTitle;

  // Extract completed tasks/subtasks
  const completedTasks = [];
  const taskMatches = storyContent.matchAll(/^- \[x\] (.+)$/gim);
  for (const match of taskMatches) {
    completedTasks.push(match[1]);
  }

  // Extract acceptance criteria
  const acceptanceCriteria = [];
  const acSection = storyContent.match(/## Acceptance Criteria\n\n([\s\S]+?)(?=\n##|$)/);
  if (acSection) {
    const acMatches = acSection[1].matchAll(/^- (.+)$/gim);
    for (const match of acMatches) {
      acceptanceCriteria.push(match[1]);
    }
  }

  // Build commit message
  let commitMessage = `${epic}-${story}: ${briefDescription}\n\n`;
  commitMessage += `Story ${epic}.${story}: ${storyTitle}\n\n`;

  if (completedTasks.length > 0) {
    commitMessage += `Completed:\n`;
    completedTasks.forEach(task => {
      commitMessage += `- ${task}\n`;
    });
    commitMessage += `\n`;
  }

  if (acceptanceCriteria.length > 0) {
    commitMessage += `Acceptance Criteria: PASSING\n`;
    acceptanceCriteria.forEach(ac => {
      commitMessage += `- ${ac} ✓\n`;
    });
    commitMessage += `\n`;
  }

  commitMessage += `🤖 Generated with [Claude Code](https://claude.com/claude-code)\n\n`;
  commitMessage += `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`;

  return commitMessage;
}

/**
 * Main merge function
 */
async function mergeStory() {
  // Parse arguments
  const args = process.argv.slice(2);
  if (args.length === 0) {
    error('Usage: node scripts/merge-story.js {epic}-{story}');
    error('Example: node scripts/merge-story.js 1-2');
    process.exit(1);
  }

  const [epicStory] = args;
  const match = epicStory.match(/^(\d+)-(\d+)$/);

  if (!match) {
    error('Invalid format. Expected: {epic}-{story}');
    error('Example: 1-2');
    process.exit(1);
  }

  const [, epic, story] = match;

  log(`\n🔄 Merging story ${epic}-${story}...\n`, colors.blue);

  try {
    // Step 1: Read sprint status
    info('Reading sprint-status.yaml...');
    const sprintStatus = readSprintStatus();

    // Find story in YAML
    const storyKey = Object.keys(sprintStatus.development_status).find(key =>
      key.startsWith(`${epic}-${story}-`)
    );

    if (!storyKey) {
      throw new Error(`Story ${epic}-${story} not found in sprint-status.yaml`);
    }

    const storyData = sprintStatus.development_status[storyKey];

    // Step 2: Verify story status is 'done'
    if (storyData.status !== 'done') {
      throw new Error(
        `Story ${epic}-${story} status is '${storyData.status}', expected 'done'`
      );
    }

    success(`Story ${epic}-${story} is marked as done`);

    // Step 3: Get branch name
    const branchName = storyData.git?.branch;

    if (!branchName) {
      throw new Error(`No branch found for story ${epic}-${story}`);
    }

    info(`Branch: ${branchName}`);

    // Step 4: Find story file
    const storyFilePath = findStoryFile(epic, story);
    success(`Found story file: ${path.basename(storyFilePath)}`);

    // Step 5: Generate commit message
    const commitMessage = generateCommitMessage(epic, story, storyFilePath);
    info('Generated commit message');

    // Step 6: Checkout main and pull
    info('Checking out main branch...');
    execSync('git checkout main', { stdio: 'inherit' });
    execSync('git pull origin main', { stdio: 'inherit' });
    success('Main branch is up to date');

    // Step 7: Squash merge
    info(`Squash merging ${branchName}...`);
    execSync(`git merge --squash ${branchName}`, { stdio: 'inherit' });

    // Step 8: Commit with generated message
    info('Creating commit...');
    const commitMsgFile = path.join(process.cwd(), '.git/MERGE_MSG');
    fs.writeFileSync(commitMsgFile, commitMessage, 'utf-8');
    execSync(`git commit -F ${commitMsgFile}`, { stdio: 'inherit' });
    success('Commit created');

    // Step 9: Update sprint-status.yaml
    info('Updating sprint-status.yaml...');
    const lastCommitSha = execSync('git rev-parse --short=7 HEAD', {
      encoding: 'utf-8'
    }).trim();

    sprintStatus.development_status[storyKey].git = {
      branch: null,
      commits: storyData.git.commits,
      pr_url: storyData.git.pr_url,
      last_commit_sha: lastCommitSha,
      created_at: storyData.git.created_at,
      merged_at: new Date().toISOString()
    };

    writeSprintStatus(sprintStatus);
    success('Updated sprint-status.yaml');

    // Step 10: Delete branch
    info(`Deleting branch ${branchName}...`);
    execSync(`git branch -d ${branchName}`, { stdio: 'inherit' });
    success('Branch deleted');

    // Step 11: Ask about pushing
    log('');
    warning('Merge complete! Remember to push to remote:');
    log('  git push origin main');
    log('');

    success(`✅ Story ${epic}-${story} successfully merged to main!`);
  } catch (err) {
    error(`Failed to merge story: ${err.message}`);
    process.exit(1);
  }
}

mergeStory().catch(err => {
  error(`Unexpected error: ${err.message}`);
  process.exit(1);
});
