---
title: Contributing
description: How to contribute to Turbo Themes.
category: contributing
order: 1
prev: guides/accessibility
next: contributing/development-setup
---

# Contributing to Turbo Themes

Thank you for your interest in contributing! This guide will help you get started.

## Ways to Contribute

### Report Issues

Found a bug or have a feature request?
[Open an issue](https://github.com/lgtm-hq/turbo-themes/issues/new) on GitHub.

When reporting bugs, please include:

- Your browser/environment
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### Submit Pull Requests

We welcome code contributions! Before starting work:

1. Check existing issues to avoid duplicate work
2. For large changes, open an issue first to discuss
3. Follow the coding standards below

### Improve Documentation

Documentation improvements are always welcome:

- Fix typos or clarify confusing sections
- Add examples or use cases
- Translate documentation

## Quick Start

```bash
# Fork and clone the repo
git clone https://github.com/YOUR-USERNAME/turbo-themes.git
cd turbo-themes

# Install dependencies
bun install

# Start development server
bun run dev

# Run tests
bun run test
```

## Repository Structure

```
turbo-themes/
├── packages/
│   ├── core/           # Design tokens and theme definitions
│   ├── css/            # CSS generation
│   ├── theme-selector/ # Theme selector component
│   └── adapters/       # Framework adapters (Tailwind, Bulma)
├── apps/
│   └── site/           # Documentation site (Astro)
├── python/             # Python package
├── swift/              # Swift package
├── docs/               # Additional documentation
└── test/               # Test suites
```

## Guidelines

### Code Style

- Use TypeScript for JavaScript code
- Follow existing code patterns
- Run `bun run lint` before committing
- Add tests for new functionality

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new theme variant
fix: correct contrast ratio in Dracula theme
docs: update installation guide
chore: update dependencies
```

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Run tests: `bun run test`
4. Run linting: `bun run lint`
5. Push and open a PR
6. Fill out the PR template
7. Wait for review

## Next Steps

- Set up your [Development Environment](/docs/contributing/development-setup/)
- Learn about [Testing](/docs/contributing/testing/)
- Understand the [Release Process](/docs/contributing/release-process/)
