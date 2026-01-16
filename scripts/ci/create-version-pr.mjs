#!/usr/bin/env node
/**
 * Create Version PR Script
 *
 * Creates a pull request with version bump and CHANGELOG updates.
 * Uses conventional commits to determine the appropriate version bump.
 *
 * Usage: node scripts/ci/create-version-pr.mjs [--dry-run]
 */

import { execSync, execFileSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import {
  calculateNextVersion,
  determineBumpType,
  generateChangelogEntry,
} from './version-bump.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../..');

// Configuration
const CONFIG = {
  changelogFile: join(projectRoot, 'CHANGELOG.md'),
  packageFile: join(projectRoot, 'package.json'),
  versionFile: join(projectRoot, 'VERSION'),
  syncScript: join(projectRoot, 'scripts', 'sync-version.mjs'),
  branchPrefix: 'release/version-',
  prTitlePrefix: 'chore(release): version',
};

/**
 * Get commits since last tag
 */
function getCommitsSinceLastTag() {
  try {
    const lastTag = execSync('git describe --tags --abbrev=0', {
      encoding: 'utf8',
      cwd: projectRoot,
    }).trim();

    const commits = execSync(`git log ${lastTag}..HEAD --oneline --no-merges`, {
      encoding: 'utf8',
      cwd: projectRoot,
    })
      .trim()
      .split('\n')
      .filter(Boolean)
      .filter((commit) => !commit.includes('chore(release):')); // Exclude release commits

    return { lastTag, commits };
  } catch {
    // No tags found, get all commits
    const commits = execSync('git log --oneline --no-merges', {
      encoding: 'utf8',
      cwd: projectRoot,
    })
      .trim()
      .split('\n')
      .filter(Boolean)
      .filter((commit) => !commit.includes('chore(release):')); // Exclude release commits

    return { lastTag: null, commits };
  }
}

/**
 * Check if version PR already exists
 */
function checkExistingVersionPR() {
  try {
    const existingPRs = execSync(
      `gh pr list --state=open --search "${CONFIG.prTitlePrefix}" --json number,title,headRefName`,
      { encoding: 'utf8', cwd: projectRoot }
    );

    const prs = JSON.parse(existingPRs);
    return prs.length > 0 ? prs[0] : null;
  } catch {
    return null;
  }
}

/**
 * Check if remote branch exists
 */
function checkRemoteBranch(branchName) {
  try {
    const output = execSync(`git ls-remote --heads origin ${branchName}`, {
      encoding: 'utf8',
      cwd: projectRoot,
      stdio: 'pipe',
    }).trim();
    // Branch exists only if output is non-empty
    return output.length > 0;
  } catch {
    // Command failed or branch doesn't exist
    return false;
  }
}

/**
 * Check if a remote branch has a common ancestor with main
 *
 * This detects orphaned branches that were created from a different
 * history (e.g., before main was resigned/rebased). Such branches
 * cannot be used to create PRs against main.
 */
function hasCommonAncestor(branchName) {
  try {
    execSync(`git merge-base main origin/${branchName}`, {
      cwd: projectRoot,
      stdio: 'pipe',
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Delete a remote branch
 */
function deleteRemoteBranch(branchName) {
  try {
    execSync(`git push origin --delete ${branchName}`, {
      cwd: projectRoot,
      stdio: 'pipe',
    });
    console.log(`🗑️  Deleted orphaned remote branch ${branchName}`);
    return true;
  } catch (error) {
    console.warn(`⚠️  Failed to delete remote branch ${branchName}: ${error.message}`);
    return false;
  }
}

/**
 * Create version bump branch
 */
function createVersionBranch(newVersion) {
  const branchName = `${CONFIG.branchPrefix}${newVersion}`;

  // Check if remote branch already exists
  if (checkRemoteBranch(branchName)) {
    console.log(`🌿 Remote branch ${branchName} already exists`);

    // Fetch the remote branch to check for common ancestry
    try {
      execSync(`git fetch origin ${branchName}`, {
        cwd: projectRoot,
        stdio: 'pipe',
      });
    } catch {
      // Fetch failed, but continue to check common ancestry
    }

    // Check if the remote branch has common ancestry with main
    // This can happen if main was rebased/resigned after the branch was created
    if (!hasCommonAncestor(branchName)) {
      console.warn(`⚠️  Remote branch ${branchName} has no common history with main`);
      console.warn(`   This usually happens when main was rebased or commits were resigned.`);
      console.warn(`   Deleting orphaned branch and creating a fresh one...`);

      // Delete the orphaned remote branch
      if (deleteRemoteBranch(branchName)) {
        // Successfully deleted, fall through to create new branch
        console.log(`✅ Orphaned branch deleted, creating fresh branch from main`);
      } else {
        throw new Error(
          `Cannot delete orphaned remote branch ${branchName}. ` +
            `The branch has no common history with main and cannot be used to create a PR. ` +
            `Please manually delete the remote branch and retry.`
        );
      }
    } else {
      // Branch has common ancestry, safe to reuse
      try {
        // Checkout existing remote branch
        execSync(`git checkout -b ${branchName} origin/${branchName}`, {
          cwd: projectRoot,
        });
        console.log(`🌿 Checked out existing remote branch ${branchName}`);
        return branchName;
      } catch (error) {
        // Re-check if branch actually exists (might have been deleted between check and fetch)
        if (!checkRemoteBranch(branchName)) {
          console.log(
            `ℹ️  Remote branch ${branchName} no longer exists (may have been deleted), will create new branch`
          );
          // Fall through to create new branch logic below
        } else {
          // Branch exists but fetch/checkout failed - try local branch as fallback
          console.warn(`⚠️  Failed to fetch/checkout remote branch ${branchName}: ${error.message}`);
          try {
            execSync(`git checkout ${branchName}`, { cwd: projectRoot });
            console.log(`🌿 Checked out existing local branch ${branchName}`);
            return branchName;
          } catch (localError) {
            console.error(
              `❌ Failed to checkout branch ${branchName} (both remote and local attempts failed)`
            );
            console.error(`   Remote error: ${error.message}`);
            console.error(`   Local error: ${localError.message}`);
            throw new Error(
              `Cannot checkout existing branch ${branchName}. ` +
                `The remote branch exists but cannot be checked out. ` +
                `This may indicate the branch points to an unreachable commit or there's a git state issue. ` +
                `Consider manually deleting the remote branch and retrying.`
            );
          }
        }
      }
    }
  }

  try {
    // Check if local branch already exists
    execSync(`git show-ref --verify --quiet refs/heads/${branchName}`, {
      cwd: projectRoot,
    });
    console.log(`🌿 Local branch ${branchName} already exists`);
    return branchName;
  } catch {
    // Branch doesn't exist locally or remotely, create it
    execSync(`git checkout -b ${branchName}`, { cwd: projectRoot });
    console.log(`🌿 Created new branch ${branchName}`);
    return branchName;
  }
}

/**
 * Generate PR description
 */
function generatePRDescription(commits, version, bumpType, lastTag) {
  const commitCount = commits.length;
  const sinceText = lastTag ? `since ${lastTag}` : 'from the beginning';

  let description = `## 📦 Version Bump: ${version}\n\n`;
  description += `This PR automatically bumps the version based on ${commitCount} conventional commits ${sinceText}.\n\n`;

  description += `### 🔍 Analysis\n\n`;
  description += `- **Bump Type**: ${bumpType}\n`;
  description += `- **Commits Analyzed**: ${commitCount}\n`;
  description += `- **Last Tag**: ${lastTag || 'None (first release)'}\n\n`;

  description += `### 📋 Changes\n\n`;
  description += `- Updated \`VERSION\` file to \`${version}\`\n`;
  description += `- Synced version across all platforms:\n`;
  description += `  - npm: \`package.json\`\n`;
  description += `  - Python: \`python/pyproject.toml\`\n`;
  description += `  - Ruby: \`lib/turbo-themes/version.rb\`\n`;
  description += `  - Swift: \`swift/Sources/TurboThemes/Version.swift\`\n`;
  description += `- Updated \`CHANGELOG.md\` with new version entry\n\n`;

  description += `### 🚀 Next Steps\n\n`;
  description += `After this PR is merged:\n`;
  description += `1. A new tag \`v${version}\` will be created\n`;
  description += `2. Publishing workflows will trigger:\n`;
  description += `   - \`publish-npm.yml\` → npmjs.org\n`;
  description += `   - \`publish-python.yml\` → PyPI\n`;
  description += `   - \`publish-gem.yml\` → RubyGems\n`;
  description += `3. \`release-publish-pr.yml\` will create GitHub release with SBOM\n\n`;

  description += `### 📝 Commits Included\n\n`;
  description += `\`\`\`\n`;
  commits.slice(0, 10).forEach((commit) => {
    description += `${commit}\n`;
  });
  if (commits.length > 10) {
    description += `... and ${commits.length - 10} more commits\n`;
  }
  description += `\`\`\`\n\n`;

  description += `---\n\n`;
  description += `*This PR was created automatically by the version bump workflow.*`;

  return description;
}

/**
 * Create the pull request
 */
function createPullRequest(branchName, version, description) {
  const title = `${CONFIG.prTitlePrefix} ${version}`;

  // Check if PR already exists for this branch
  try {
    const existingPR = execSync(
      `gh pr list --head ${branchName} --base main --json number,url,title --jq '.[0]'`,
      { encoding: 'utf8', cwd: projectRoot }
    );

    if (existingPR && existingPR.trim() !== '') {
      const prData = JSON.parse(existingPR);
      console.log(`ℹ️  PR already exists for branch ${branchName}`);
      console.log(`   #${prData.number}: ${prData.title}`);
      console.log(`   URL: ${prData.url}`);
      return prData.url;
    }
  } catch {
    // No existing PR found, continue to create one
  }

  try {
    // Write description to temporary file to avoid shell escaping issues
    const tempFile = join(projectRoot, '.pr-description.tmp');
    writeFileSync(tempFile, description, 'utf8');

    const prOutput = execSync(
      `gh pr create --title "${title}" --body-file "${tempFile}" --head ${branchName} --base main`,
      { encoding: 'utf8', cwd: projectRoot }
    );

    // Clean up temporary file
    try {
      execSync(`rm "${tempFile}"`, { cwd: projectRoot });
    } catch {
      // Ignore cleanup errors
    }

    console.log(`✅ Created PR: ${prOutput.trim()}`);
    return prOutput.trim();
  } catch (error) {
    // Check if error is about PR already existing
    if (error.message.includes('already exists')) {
      console.log(`ℹ️  PR already exists for branch ${branchName}`);
      // Try to get the existing PR URL
      try {
        const existingPR = execSync(
          `gh pr list --head ${branchName} --base main --json url --jq '.[0].url'`,
          { encoding: 'utf8', cwd: projectRoot }
        );
        return existingPR.trim();
      } catch {
        // If we can't get URL, just return a message
        return `PR already exists for ${branchName}`;
      }
    }
    console.error(`❌ Failed to create PR: ${error.message}`);
    throw error;
  }
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');

  console.log('🚀 Creating Version PR\n');

  // Check for existing version PR
  const existingPR = checkExistingVersionPR();
  if (existingPR) {
    console.log(`ℹ️  Version PR already exists: #${existingPR.number}`);
    console.log(`   Title: ${existingPR.title}`);
    console.log(`   Branch: ${existingPR.headRefName}`);
    return;
  }

  // Get commits since last tag
  const { lastTag, commits } = getCommitsSinceLastTag();
  console.log(`📋 Analyzing ${commits.length} commits since ${lastTag || 'beginning'}`);

  if (commits.length === 0) {
    console.log('✅ No commits to analyze, no version bump needed');
    return;
  }

  // Determine bump type
  const bumpType = determineBumpType(commits);
  console.log(`🔍 Bump type: ${bumpType || 'none'}`);

  if (!bumpType) {
    console.log('✅ No version bump needed based on conventional commits');
    return;
  }

  // Calculate next version
  const packageContent = JSON.parse(readFileSync(CONFIG.packageFile, 'utf8'));
  const currentVersion = packageContent.version;
  const nextVersion = calculateNextVersion(currentVersion, bumpType);

  console.log(`📈 Version bump: ${currentVersion} → ${nextVersion}`);

  // Generate changelog entry
  const changelogEntry = generateChangelogEntry(commits, nextVersion, bumpType);

  if (isDryRun) {
    console.log('\n📝 Preview of changes:');
    console.log('='.repeat(50));
    console.log(changelogEntry);
    console.log('='.repeat(50));
    console.log(`\n📦 package.json: ${currentVersion} → ${nextVersion}`);
    console.log(`🌿 Branch: ${CONFIG.branchPrefix}${nextVersion}`);
    console.log(`📋 PR Title: ${CONFIG.prTitlePrefix} ${nextVersion}`);
    console.log('\n🔍 Dry run complete - no changes made');
    return;
  }

  try {
    // Create version branch
    const branchName = createVersionBranch(nextVersion);

    // Update VERSION file (source of truth for all platforms)
    writeFileSync(CONFIG.versionFile, `${nextVersion}\n`);
    console.log(`📋 Updated VERSION file to ${nextVersion}`);

    // Run sync-version.mjs to update all platform packages
    // This syncs: package.json, Python, Ruby, Swift, Dart, Kotlin
    execFileSync('node', [CONFIG.syncScript], { cwd: projectRoot, stdio: 'inherit' });
    console.log(`🔄 Synced version across all platforms`);

    // Update CHANGELOG.md
    const changelogContent = readFileSync(CONFIG.changelogFile, 'utf8');
    const updatedContent = changelogContent.replace(
      /## \[Unreleased\][\s\S]*?(?=## \[|$)/,
      `## [Unreleased]\n\n### Added\n\n- TBD\n\n${changelogEntry}`
    );
    writeFileSync(CONFIG.changelogFile, updatedContent);
    console.log(`📝 Updated CHANGELOG.md`);

    // Commit changes - include all version-synced files
    const filesToAdd = [
      'VERSION',
      'package.json',
      'CHANGELOG.md',
      'lib/turbo-themes/version.rb',
      'python/pyproject.toml',
      'python/src/turbo_themes/__init__.py',
      'swift/Sources/TurboThemes/Version.swift',
    ];
    execSync(`git add ${filesToAdd.join(' ')}`, { cwd: projectRoot });
    execSync(`git commit --no-verify -m "chore(release): version ${nextVersion}"`, {
      cwd: projectRoot,
    });
    console.log(`💾 Committed version bump changes`);

    // Push branch
    execSync(`git push origin ${branchName}`, { cwd: projectRoot });
    console.log(`🚀 Pushed branch ${branchName}`);

    // Create PR
    const description = generatePRDescription(commits, nextVersion, bumpType, lastTag);
    const prUrl = createPullRequest(branchName, nextVersion, description);

    console.log('\n✅ Version PR created successfully!');
    console.log(`🔗 PR URL: ${prUrl}`);
    console.log(`📦 New version: ${nextVersion}`);
    console.log(`🌿 Branch: ${branchName}`);
  } catch (error) {
    console.error(`❌ Failed to create version PR: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
