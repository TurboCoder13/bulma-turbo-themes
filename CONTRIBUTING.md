# Contributing

Thanks for contributing! Please follow these guidelines to keep things smooth.

## Development setup

- Requirements: Node 20+, npm; Ruby + Bundler for the demo site
- Install dependencies: `npm ci` and `bundle install`
- Build TS and CSS: `npm run build`
- Run site (optional): `./scripts/local/serve.sh --no-build`

## Testing and linting

- Run tests with coverage: `npm test`
- Lint code: `npm run lint` and `npm run stylelint`
- Format: `npm run format`

## Commits and PRs

- Use conventional commits (e.g., `feat:`, `fix:`, `docs:`)
- Include a clear description and link to issues
- Ensure checks are green (lint, tests, typecheck if applicable)
- Be respectful and follow the Code of Conduct

## Reporting issues

- Use the templates under `.github/ISSUE_TEMPLATE/`
- Security issues: do not open public issues; see `SECURITY.md`
