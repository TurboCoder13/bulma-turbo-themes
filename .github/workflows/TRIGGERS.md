# Workflow Triggers Documentation

This document provides a comprehensive overview of all GitHub Actions workflows in bulma-turbo-themes, their triggers, and purposes.

## Trigger Matrix

| Workflow                        | Push (main) | Push (tags) | Pull Request | Schedule  | Manual | workflow_run |
| ------------------------------- | ----------- | ----------- | ------------ | --------- | ------ | ------------ |
| quality-ci-main                 | ✅          |             | ✅           |           |        |              |
| reusable-quality                |             |             |              |           |        | Called       |
| reusable-build                  |             |             |              |           |        | Called       |
| reusable-sbom                   |             |             |              |           |        | Called       |
| reporting-lighthouse-ci         | ✅          |             | ✅           |           |        |              |
| security-codeql                 | ✅          |             | ✅           | ✅ Weekly |        |              |
| security-dependency-review      |             |             | ✅           |           |        |              |
| security-sbom                   | ✅          |             | ✅           |           | ✅     |              |
| security-scorecards             | ✅          |             |              |           |        |              |
| quality-theme-sync              | ✅          |             | ✅           |           |        |              |
| quality-semantic-pr-title       |             |             | ✅           |           |        |              |
| quality-validate-action-pinning | ✅          |             | ✅           |           |        |              |
| deploy-pages                    |             |             |              |           |        | ✅           |
| deploy-coverage-pages           |             |             |              |           |        | ✅           |
| publish-npm-on-tag              |             | ✅ v*.*.\*  |              |           |        |              |
| publish-npm-test                |             |             |              |           | ✅     |              |
| release-semantic-release        | ✅          |             |              |           | ✅     |              |
| release-auto-tag                |             |             |              |           | ✅     |              |
| maintenance-renovate            |             |             |              | ✅ Daily  |        |              |
| maintenance-auto-bump-refs      |             |             |              | ✅ Weekly |        |              |
| maintenance-pr-comment-cleanup  |             |             |              |           | ✅     |              |
| monitoring-uptime               |             |             |              | ✅ 15min  |        |              |

## Workflow Categories

### Quality & Testing

#### quality-ci-main.yml

**Triggers:** Push to main, Pull requests  
**Purpose:** Main CI pipeline with build, test, lint, coverage

**When it runs:**

- Every push to `main` branch
- Every pull request (open, sync, reopen)

**What it does:**

- Matrix builds across Node 18/20/22 and Ruby 3.3/3.4
- Runs linters (ESLint, Prettier, Markdown, Stylelint)
- Executes tests with coverage
- Builds TypeScript and Jekyll site
- Validates HTML
- Uploads coverage to Codecov
- Posts coverage comment on PRs

#### reusable-quality.yml

**Triggers:** Called by other workflows  
**Purpose:** Reusable quality checks (lint, format, typecheck)

#### reusable-build.yml

**Triggers:** Called by other workflows  
**Purpose:** Reusable build workflow (TypeScript + Jekyll)

#### quality-semantic-pr-title.yml

**Triggers:** Pull requests  
**Purpose:** Validates PR titles follow Conventional Commits

#### quality-theme-sync.yml

**Triggers:** Push to main, Pull requests  
**Purpose:** Validates theme files are in sync

#### quality-validate-action-pinning.yml

**Triggers:** Push to main, Pull requests  
**Purpose:** Ensures all GitHub Actions use SHA pinning

### Security

#### security-codeql.yml

**Triggers:** Push to main, Pull requests, Weekly schedule  
**Purpose:** CodeQL security analysis

**Schedule:** Every Sunday at 00:00 UTC

#### security-dependency-review.yml

**Triggers:** Pull requests  
**Purpose:** Reviews dependencies for security vulnerabilities

#### security-sbom.yml

**Triggers:** Push to main, Pull requests, Manual  
**Purpose:** Generates and signs SBOM files

#### security-scorecards.yml

**Triggers:** Push to main  
**Purpose:** OpenSSF Scorecard security analysis

#### reusable-sbom.yml

**Triggers:** Called by other workflows  
**Purpose:** Reusable SBOM generation with signing

### Deployment

#### deploy-pages.yml

**Triggers:** workflow_run (after Jekyll build)  
**Purpose:** Deploys Jekyll site to GitHub Pages

**Dependencies:** Runs after successful workflow completion

#### deploy-coverage-pages.yml

**Triggers:** workflow_run (after quality-ci-main)  
**Purpose:** Deploys coverage reports to GitHub Pages

**Dependencies:** Runs after successful quality-ci-main on main branch

### Publishing & Releases

#### publish-npm-on-tag.yml

**Triggers:** Push tags matching `v*.*.*`  
**Purpose:** Publishes package to npm on version tags

**What it does:**

- Runs quality and build checks
- Generates and signs SBOM
- Publishes to npm with provenance
- Creates GitHub release with SBOM artifacts

**Example:** Pushing tag `v1.2.3` triggers this workflow

#### publish-npm-test.yml

**Triggers:** Manual (workflow_dispatch)  
**Purpose:** Test publish to npm with custom tag

**Inputs:**

- `tag` - npm dist-tag (e.g., beta, next, canary)

**Use case:** Testing publish process before production release

#### release-semantic-release.yml

**Triggers:** Push to main, Manual  
**Purpose:** Automatic semantic versioning and releases

**What it does:**

- Analyzes commits since last release
- Determines version bump (major/minor/patch)
- Generates CHANGELOG
- Creates GitHub release
- Publishes to npm
- Commits version bump

**Conventional Commits Required:**

- `feat:` → minor version
- `fix:` → patch version
- `BREAKING CHANGE` → major version

#### release-auto-tag.yml

**Triggers:** Manual (workflow_dispatch)  
**Purpose:** Manually create git tags

**Inputs:**

- `version` - Version to tag (e.g., v1.2.3)
- `prerelease` - Mark as pre-release

**Use case:** Backup mechanism for creating releases manually

### Maintenance

#### maintenance-renovate.yml

**Triggers:** Daily schedule  
**Purpose:** Renovate Bot configuration validation

**Schedule:** Every day at 02:00 UTC

#### maintenance-auto-bump-refs.yml

**Triggers:** Weekly schedule  
**Purpose:** Auto-updates action SHA references

**Schedule:** Every Monday at 03:00 UTC

#### maintenance-pr-comment-cleanup.yml

**Triggers:** Manual (workflow_dispatch)  
**Purpose:** Cleans up automated PR comments

**Inputs:**

- `pr_number` - PR to clean
- `dry_run` - Preview without deleting
- `marker` - Filter by comment marker

**Use case:** Remove stale bot comments from PRs

### Reporting

#### reporting-lighthouse-ci.yml

**Triggers:** Push to main, Pull requests  
**Purpose:** Performance analysis with Lighthouse

**What it does:**

- Builds full site
- Runs Lighthouse CI analysis
- Posts results comment on PRs
- Uploads reports as artifacts

### Monitoring

#### monitoring-uptime.yml

**Triggers:** Every 15 minutes  
**Purpose:** Monitors website availability

**Schedule:** `*/15 * * * *`

## Workflow Dependencies

```
publish-npm-on-tag
├── reusable-quality
├── reusable-build
└── reusable-sbom

release-semantic-release
├── reusable-quality
├── reusable-build
└── reusable-sbom

quality-ci-main
└── deploy-coverage-pages (via workflow_run)

publish-npm-test
├── reusable-quality
├── reusable-build
└── reusable-sbom
```

## Manual Workflows

These workflows can only be triggered manually via GitHub UI or API:

1. **publish-npm-test** - Test npm publish
2. **release-auto-tag** - Create version tag
3. **maintenance-pr-comment-cleanup** - Clean PR comments
4. **security-sbom** - Generate SBOM (also auto-triggers)

To trigger manually:

1. Go to Actions tab
2. Select workflow
3. Click "Run workflow"
4. Fill in inputs (if any)
5. Click "Run workflow" button

## Concurrency Groups

Workflows use concurrency groups to prevent multiple runs:

- `ci-${{ github.ref }}` - CI pipeline per branch
- `lighthouse-${{ github.ref }}` - Lighthouse per branch
- `sbom-${{ github.ref }}` - SBOM generation per branch
- `pages-coverage` - Coverage deployment (no concurrency)
- `publish-${{ github.ref }}` - Publish per tag
- `semantic-release` - One semantic release at a time

**cancel-in-progress:** Most workflows cancel in-progress runs when new commits arrive, except:

- Publishing workflows (never cancel)
- Release workflows (never cancel)

## Timeouts

All workflows have explicit timeouts to prevent hanging:

- Quality checks: 45 minutes (matrix builds)
- Build workflows: 20 minutes
- SBOM generation: 15 minutes
- Lighthouse: 20 minutes
- Publish: 20 minutes
- Maintenance: 10 minutes

## Adding New Workflows

When creating a new workflow:

1. Choose appropriate triggers
2. Add to this documentation
3. Set explicit timeouts
4. Define concurrency group
5. Use reusable workflows where possible
6. Add harden-runner for security
7. Pin actions to SHA
8. Document in workflow file header

## Questions?

For questions about workflows:

- Check workflow file headers for detailed documentation
- Review `.github/workflows/README.md`
- See `.github/workflows/EGRESS-POLICIES.md` for security
- Open an issue with the `ci` label
