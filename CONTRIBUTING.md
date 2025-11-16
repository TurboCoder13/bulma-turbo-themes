# Contributing

Thanks for contributing! Please follow these guidelines to keep things smooth.

## Development setup

- Requirements: Node 20+, npm; Ruby + Bundler for the demo site
- Install dependencies: `npm ci` and `bundle install`
- Build TS and CSS: `npm run build`
- Run site (optional): `./scripts/local/serve.sh --no-build`

### Available Rake tasks

This is a hybrid npm/Ruby project. Rake tasks are available for gem-related operations:

```bash
rake -T                 # List all available tasks
rake build              # Build the Ruby gem (includes npm build)
rake build:npm          # Build npm package (TypeScript -> JavaScript)
rake build:gem          # Build Ruby gem specifically
rake clean              # Remove built artifacts (*.gem, dist/, _site/)
rake verify:gem         # Verify gem can be built successfully
rake verify:all         # Run all checks (lint, test, and build)
rake console            # Open IRB with the gem loaded for debugging
```

Most developers will use `npm run build:gem` which handles the full build process, but Rake tasks are useful for gem-specific operations and are required by the RubyGems publishing workflow.

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
