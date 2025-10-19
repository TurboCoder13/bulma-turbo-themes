#!/usr/bin/env node
/**
 * Create Version PR Script
 *
 * Creates a pull request with version bump and CHANGELOG updates.
 * Uses conventional commits to determine the appropriate version bump.
 *
 * Usage: node scripts/ci/create-version-pr.mjs [--dry-run]
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {
  determineBumpType,
  calculateNextVersion,
  generateChangelogEntry,
} from "./version-bump.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "../..");

// Configuration
const CONFIG = {
  changelogFile: join(projectRoot, "CHANGELOG.md"),
  packageFile: join(projectRoot, "package.json"),
  branchPrefix: "release/version-",
  prTitlePrefix: "chore(release): version",
};

/**
 * Get commits since last tag
 */
function getCommitsSinceLastTag() {
  try {
    const lastTag = execSync("git describe --tags --abbrev=0", {
      encoding: "utf8",
      cwd: projectRoot,
    }).trim();

    const commits = execSync(`git log ${lastTag}..HEAD --oneline --no-merges`, {
      encoding: "utf8",
      cwd: projectRoot,
    })
      .trim()
      .split("\n")
      .filter(Boolean);

    return { lastTag, commits };
  } catch {
    // No tags found, get all commits
    const commits = execSync("git log --oneline --no-merges", {
      encoding: "utf8",
      cwd: projectRoot,
    })
      .trim()
      .split("\n")
      .filter(Boolean);

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
      { encoding: "utf8", cwd: projectRoot },
    );

    const prs = JSON.parse(existingPRs);
    return prs.length > 0 ? prs[0] : null;
  } catch {
    return null;
  }
}

/**
 * Create version bump branch
 */
function createVersionBranch(newVersion) {
  const branchName = `${CONFIG.branchPrefix}${newVersion}`;

  try {
    // Check if branch already exists
    execSync(`git show-ref --verify --quiet refs/heads/${branchName}`, {
      cwd: projectRoot,
    });
    console.log(`🌿 Branch ${branchName} already exists`);
    return branchName;
  } catch {
    // Branch doesn't exist, create it
    execSync(`git checkout -b ${branchName}`, { cwd: projectRoot });
    console.log(`🌿 Created branch ${branchName}`);
    return branchName;
  }
}

/**
 * Generate PR description
 */
function generatePRDescription(commits, version, bumpType, lastTag) {
  const commitCount = commits.length;
  const sinceText = lastTag ? `since ${lastTag}` : "from the beginning";

  let description = `## 📦 Version Bump: ${version}\n\n`;
  description += `This PR automatically bumps the version based on ${commitCount} conventional commits ${sinceText}.\n\n`;

  description += `### 🔍 Analysis\n\n`;
  description += `- **Bump Type**: ${bumpType}\n`;
  description += `- **Commits Analyzed**: ${commitCount}\n`;
  description += `- **Last Tag**: ${lastTag || "None (first release)"}\n\n`;

  description += `### 📋 Changes\n\n`;
  description += `- Updated \`package.json\` version to \`${version}\`\n`;
  description += `- Updated \`CHANGELOG.md\` with new version entry\n`;
  description += `- Generated from conventional commits\n\n`;

  description += `### 🚀 Next Steps\n\n`;
  description += `After this PR is merged:\n`;
  description += `1. A new tag \`v${version}\` will be created\n`;
  description += `2. The \`release-publish-pr.yml\` workflow will trigger\n`;
  description += `3. Package will be published to npm\n`;
  description += `4. GitHub release will be created\n\n`;

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

  try {
    // Escape the description for shell command
    const escapedDescription = description
      .replace(/\\/g, "\\\\") // Escape backslashes first
      .replace(/"/g, '\\"') // Escape double quotes
      .replace(/\n/g, "\\n") // Escape newlines
      .replace(/\r/g, "\\r") // Escape carriage returns
      .replace(/\t/g, "\\t"); // Escape tabs

    const prOutput = execSync(
      `gh pr create --title "${title}" --body "${escapedDescription}" --head ${branchName} --base main`,
      { encoding: "utf8", cwd: projectRoot },
    );

    console.log(`✅ Created PR: ${prOutput.trim()}`);
    return prOutput.trim();
  } catch (error) {
    console.error(`❌ Failed to create PR: ${error.message}`);
    throw error;
  }
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes("--dry-run");

  console.log("🚀 Creating Version PR\n");

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
  console.log(`📋 Analyzing ${commits.length} commits since ${lastTag || "beginning"}`);

  if (commits.length === 0) {
    console.log("✅ No commits to analyze, no version bump needed");
    return;
  }

  // Determine bump type
  const bumpType = determineBumpType(commits);
  console.log(`🔍 Bump type: ${bumpType || "none"}`);

  if (!bumpType) {
    console.log("✅ No version bump needed based on conventional commits");
    return;
  }

  // Calculate next version
  const packageContent = JSON.parse(readFileSync(CONFIG.packageFile, "utf8"));
  const currentVersion = packageContent.version;
  const nextVersion = calculateNextVersion(currentVersion, bumpType);

  console.log(`📈 Version bump: ${currentVersion} → ${nextVersion}`);

  // Generate changelog entry
  const changelogEntry = generateChangelogEntry(commits, nextVersion, bumpType);

  if (isDryRun) {
    console.log("\n📝 Preview of changes:");
    console.log("=".repeat(50));
    console.log(changelogEntry);
    console.log("=".repeat(50));
    console.log(`\n📦 package.json: ${currentVersion} → ${nextVersion}`);
    console.log(`🌿 Branch: ${CONFIG.branchPrefix}${nextVersion}`);
    console.log(`📋 PR Title: ${CONFIG.prTitlePrefix} ${nextVersion}`);
    console.log("\n🔍 Dry run complete - no changes made");
    return;
  }

  try {
    // Create version branch
    const branchName = createVersionBranch(nextVersion);

    // Update package.json
    packageContent.version = nextVersion;
    writeFileSync(CONFIG.packageFile, JSON.stringify(packageContent, null, 2) + "\n");
    console.log(`📦 Updated package.json version to ${nextVersion}`);

    // Update CHANGELOG.md
    const changelogContent = readFileSync(CONFIG.changelogFile, "utf8");
    const updatedContent = changelogContent.replace(
      /## \[Unreleased\][\s\S]*?(?=## \[|$)/,
      `## [Unreleased]\n\n### Added\n\n- TBD\n\n${changelogEntry}`,
    );
    writeFileSync(CONFIG.changelogFile, updatedContent);
    console.log(`📝 Updated CHANGELOG.md`);

    // Commit changes
    execSync("git add package.json CHANGELOG.md", { cwd: projectRoot });
    execSync(`git commit -m "chore(release): version ${nextVersion}"`, {
      cwd: projectRoot,
    });
    console.log(`💾 Committed version bump changes`);

    // Push branch
    execSync(`git push origin ${branchName}`, { cwd: projectRoot });
    console.log(`🚀 Pushed branch ${branchName}`);

    // Create PR
    const description = generatePRDescription(commits, nextVersion, bumpType, lastTag);
    const prUrl = createPullRequest(branchName, nextVersion, description);

    console.log("\n✅ Version PR created successfully!");
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
