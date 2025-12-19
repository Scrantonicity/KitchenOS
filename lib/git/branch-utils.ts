import { execSync } from 'child_process';

export interface StoryInfo {
  epic: number;
  story: number;
  description: string;
}

export interface GitMetadata {
  branch: string | null;
  commits: number;
  pr_url: string | null;
  last_commit_sha: string | null;
  created_at: string | null;
  merged_at: string | null;
}

/**
 * Creates a new story branch from main
 * @param epic - Epic number
 * @param story - Story number
 * @param description - Short description for branch name
 * @returns The created branch name
 */
export function createStoryBranch(epic: number, story: number, description: string): string {
  const branchName = `${epic}/${story}-${description}`;

  try {
    // Ensure we're on main and it's up to date
    execSync('git checkout main', { stdio: 'inherit' });
    execSync('git pull origin main', { stdio: 'inherit' });

    // Create and checkout the new branch
    execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });

    return branchName;
  } catch (error) {
    throw new Error(`Failed to create branch ${branchName}: ${error}`);
  }
}

/**
 * Gets the current git branch name
 * @returns Current branch name
 */
export function getCurrentBranch(): string {
  try {
    const branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
    return branch;
  } catch (error) {
    throw new Error(`Failed to get current branch: ${error}`);
  }
}

/**
 * Extracts story information from a branch name
 * @param branchName - Branch name in format {epic}/{story}-{description}
 * @returns Story information object or null if invalid format
 */
export function getStoryFromBranch(branchName: string): StoryInfo | null {
  const match = branchName.match(/^(\d+)\/(\d+)-(.+)$/);

  if (!match) {
    return null;
  }

  return {
    epic: parseInt(match[1], 10),
    story: parseInt(match[2], 10),
    description: match[3]
  };
}

/**
 * Validates branch naming convention
 * @param branchName - Branch name to validate
 * @returns True if branch name follows convention
 */
export function validateBranchNaming(branchName: string): boolean {
  return /^\d+\/\d+-[a-z0-9-]+$/.test(branchName);
}

/**
 * Performs a squash merge of a story branch into main
 * @param storyBranch - Branch name to merge
 * @param commitMessage - Commit message for the squash merge
 */
export function squashMerge(storyBranch: string, commitMessage: string): void {
  try {
    // Ensure we're on main
    execSync('git checkout main', { stdio: 'inherit' });
    execSync('git pull origin main', { stdio: 'inherit' });

    // Squash merge the story branch
    execSync(`git merge --squash ${storyBranch}`, { stdio: 'inherit' });

    // Commit with the provided message
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

    // Delete the merged branch
    execSync(`git branch -d ${storyBranch}`, { stdio: 'inherit' });
  } catch (error) {
    throw new Error(`Failed to squash merge ${storyBranch}: ${error}`);
  }
}

/**
 * Gets the commit count for a branch
 * @param branchName - Branch name
 * @returns Number of commits
 */
export function getCommitCount(branchName: string): number {
  try {
    const count = execSync(
      `git rev-list --count ${branchName}`,
      { encoding: 'utf-8' }
    ).trim();
    return parseInt(count, 10);
  } catch (error) {
    return 0;
  }
}

/**
 * Gets the last commit SHA for a branch
 * @param branchName - Branch name
 * @returns Abbreviated commit SHA (7 characters)
 */
export function getLastCommitSha(branchName: string): string | null {
  try {
    const sha = execSync(
      `git rev-parse --short=7 ${branchName}`,
      { encoding: 'utf-8' }
    ).trim();
    return sha;
  } catch (error) {
    return null;
  }
}

/**
 * Gets the creation timestamp of a branch
 * @param branchName - Branch name
 * @returns ISO timestamp string or null
 */
export function getBranchCreatedAt(branchName: string): string | null {
  try {
    const timestamp = execSync(
      `git log ${branchName} --reverse --format=%aI | head -1`,
      { encoding: 'utf-8' }
    ).trim();
    return timestamp || null;
  } catch (error) {
    return null;
  }
}

/**
 * Checks if the working directory is clean
 * @returns True if clean, false if there are uncommitted changes
 */
export function isWorkingDirectoryClean(): boolean {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf-8' }).trim();
    return status.length === 0;
  } catch (error) {
    return false;
  }
}

/**
 * Checks if the current branch is main
 * @returns True if on main branch
 */
export function isOnMainBranch(): boolean {
  const currentBranch = getCurrentBranch();
  return currentBranch === 'main';
}

/**
 * Gets the number of commits ahead of main
 * @param branchName - Branch name to compare
 * @returns Number of commits ahead
 */
export function getCommitsAheadOfMain(branchName: string): number {
  try {
    const count = execSync(
      `git rev-list --count main..${branchName}`,
      { encoding: 'utf-8' }
    ).trim();
    return parseInt(count, 10);
  } catch (error) {
    return 0;
  }
}

/**
 * Creates git metadata object for YAML tracking
 * @param branchName - Branch name
 * @returns Git metadata object
 */
export function createGitMetadata(branchName: string): GitMetadata {
  return {
    branch: branchName,
    commits: getCommitsAheadOfMain(branchName),
    pr_url: null,
    last_commit_sha: getLastCommitSha(branchName),
    created_at: getBranchCreatedAt(branchName),
    merged_at: null
  };
}

/**
 * Updates git metadata for a merged branch
 * @param metadata - Existing git metadata
 * @returns Updated metadata with merge information
 */
export function updateMergedMetadata(metadata: GitMetadata): GitMetadata {
  return {
    ...metadata,
    branch: null,
    merged_at: new Date().toISOString()
  };
}
