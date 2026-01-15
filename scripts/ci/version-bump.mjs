#!/usr/bin/env node
/**
 * Semantic Version Bump Script
 *
 * Analyzes conventional commits since last tag to determine next version bump.
 * Generates CHANGELOG.md updates and updates package.json version.
 *
 * Usage: node scripts/ci/version-bump.mjs [--dry-run] [--preview]
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../..');

// Configuration
const CONFIG = {
  majorKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES'],
  // Note: These patterns match by commit type, not literal prefix
  // The matching logic uses parseCommit() which extracts type from "type(scope):"
  minorTypes: ['feat', 'feature'],
  patchTypes: ['fix', 'bugfix', 'patch', 'docs', 'style', 'refactor', 'perf', 'test', 'chore'],
  ignoreTypes: ['ci', 'build', 'release'],
  ignorePatterns: ['chore(release):'], // Full prefix patterns to skip entirely
  changelogFile: join(projectRoot, 'CHANGELOG.md'),
  packageFile: join(projectRoot, 'package.json'),
};

/**
 * Parse conventional commit message
 */
function parseCommit(commit) {
  const match = commit.match(/^(\w+)(\(.+\))?: (.+)$/);
  if (!match) return null;

  const [, type, scope, description] = match;
  return {
    type: type.toLowerCase(),
    scope: scope ? scope.slice(1, -1) : null,
    description: description.trim(),
    breaking: description.includes('BREAKING CHANGE') || description.includes('BREAKING CHANGES'),
  };
}

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
      .filter(Boolean);

    return { lastTag, commits };
  } catch {
    // No tags found, get all commits
    const commits = execSync('git log --oneline --no-merges', {
      encoding: 'utf8',
      cwd: projectRoot,
    })
      .trim()
      .split('\n')
      .filter(Boolean);

    return { lastTag: null, commits };
  }
}

/**
 * Determine version bump type
 */
function determineBumpType(commits) {
  let hasBreaking = false;
  let hasFeature = false;
  let hasFix = false;

  for (const commit of commits) {
    // Extract commit message (remove hash prefix)
    const message = commit.replace(/^[a-f0-9]{7,} /, '');
    const parsed = parseCommit(message);
    if (!parsed) continue;

    // Skip ignored commit types based on parsed type
    if (CONFIG.ignoreTypes.includes(parsed.type)) {
      continue;
    }

    // Skip specific full patterns (like "chore(release):")
    if (CONFIG.ignorePatterns.some((pattern) => message.toLowerCase().startsWith(pattern))) {
      continue;
    }

    if (
      parsed.breaking ||
      CONFIG.majorKeywords.some((keyword) => message.toLowerCase().includes(keyword.toLowerCase()))
    ) {
      hasBreaking = true;
    } else if (CONFIG.minorTypes.includes(parsed.type)) {
      hasFeature = true;
    } else if (CONFIG.patchTypes.includes(parsed.type)) {
      hasFix = true;
    }
  }

  if (hasBreaking) return 'major';
  if (hasFeature) return 'minor';
  if (hasFix) return 'patch';

  return null; // No version bump needed
}

/**
 * Parse current version
 */
function parseVersion(versionString) {
  const match = versionString.match(/^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/);
  if (!match) throw new Error(`Invalid version format: ${versionString}`);

  const [, major, minor, patch, prerelease] = match;
  return {
    major: Number.parseInt(major, 10),
    minor: Number.parseInt(minor, 10),
    patch: Number.parseInt(patch, 10),
    prerelease: prerelease || null,
  };
}

/**
 * Calculate next version
 */
function calculateNextVersion(currentVersion, bumpType) {
  const version = parseVersion(currentVersion);

  switch (bumpType) {
    case 'major':
      return `${version.major + 1}.0.0`;
    case 'minor':
      return `${version.major}.${version.minor + 1}.0`;
    case 'patch':
      return `${version.major}.${version.minor}.${version.patch + 1}`;
    default:
      return currentVersion;
  }
}

/**
 * Generate changelog entry
 */
function generateChangelogEntry(commits, version, bumpType) {
  if (!bumpType) return null;

  const features = [];
  const fixes = [];
  const breaking = [];
  const others = [];

  for (const commit of commits) {
    // Extract commit message (remove hash prefix)
    const message = commit.replace(/^[a-f0-9]{7,} /, '');
    const parsed = parseCommit(message);
    if (!parsed) continue;

    // Skip ignored commit types based on parsed type
    if (CONFIG.ignoreTypes.includes(parsed.type)) {
      continue;
    }

    // Skip specific full patterns (like "chore(release):")
    if (CONFIG.ignorePatterns.some((pattern) => message.toLowerCase().startsWith(pattern))) {
      continue;
    }

    const entry = `- ${parsed.description}`;

    if (
      parsed.breaking ||
      CONFIG.majorKeywords.some((keyword) => message.toLowerCase().includes(keyword.toLowerCase()))
    ) {
      breaking.push(entry);
    } else if (CONFIG.minorTypes.includes(parsed.type)) {
      features.push(entry);
    } else if (CONFIG.patchTypes.includes(parsed.type)) {
      fixes.push(entry);
    } else {
      others.push(entry);
    }
  }

  const today = new Date().toISOString().split('T')[0];
  let changelog = `## [${version}] - ${today}\n\n`;

  if (breaking.length > 0) {
    changelog += `### ⚠️ BREAKING CHANGES\n\n`;
    changelog += breaking.join('\n') + '\n\n';
  }

  if (features.length > 0) {
    changelog += `### ✨ Added\n\n`;
    changelog += features.join('\n') + '\n\n';
  }

  if (fixes.length > 0) {
    changelog += `### 🐛 Fixed\n\n`;
    changelog += fixes.join('\n') + '\n\n';
  }

  if (others.length > 0) {
    changelog += `### 🔧 Changed\n\n`;
    changelog += others.join('\n') + '\n\n';
  }

  return changelog;
}

/**
 * Update package.json version
 */
function updatePackageVersion(newVersion) {
  const packagePath = CONFIG.packageFile;
  const packageContent = JSON.parse(readFileSync(packagePath, 'utf8'));

  packageContent.version = newVersion;

  writeFileSync(packagePath, JSON.stringify(packageContent, null, 2) + '\n');
  console.log(`📦 Updated package.json version to ${newVersion}`);
}

/**
 * Update CHANGELOG.md
 */
function updateChangelog(changelogEntry) {
  const changelogPath = CONFIG.changelogFile;
  const changelogContent = readFileSync(changelogPath, 'utf8');

  // Replace [Unreleased] section with new version entry
  const updatedContent = changelogContent.replace(
    /## \[Unreleased\][\s\S]*?(?=## \[|$)/,
    `## [Unreleased]\n\n### Added\n\n- TBD\n\n${changelogEntry}`
  );

  writeFileSync(changelogPath, updatedContent);
  console.log(`📝 Updated CHANGELOG.md`);
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const isPreview = args.includes('--preview');

  console.log('🚀 Semantic Version Bump Analysis\n');

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

  if (isPreview || isDryRun) {
    console.log('\n📝 Preview of changes:');
    console.log('='.repeat(50));
    console.log(changelogEntry);
    console.log('='.repeat(50));
    console.log(`\n📦 package.json: ${currentVersion} → ${nextVersion}`);

    if (isDryRun) {
      console.log('\n🔍 Dry run complete - no files modified');
    }
    return;
  }

  // Apply changes
  updatePackageVersion(nextVersion);
  updateChangelog(changelogEntry);

  console.log('\n✅ Version bump complete!');
  console.log(`📦 New version: ${nextVersion}`);
  console.log('📝 CHANGELOG.md updated');
  console.log('📦 package.json updated');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { determineBumpType, calculateNextVersion, generateChangelogEntry };
