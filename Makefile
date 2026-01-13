.PHONY: all clean test test-fast test-parallel test-browser-parallel playground-html playground-jekyll playground-swift playground-tailwind playground-bootstrap playground-react playground-vue playground-python playground-all playground-help \
	build-help build-all build-core build-themes build-js build-js-only build-html build-site build-tailwind build-swift build-examples examples-prep build-gem \
	test-unit test-e2e test-examples test-example-bootstrap test-example-html test-example-jekyll test-example-react test-example-tailwind test-example-vue \
	test-python test-swift test-lhci test-links test-all test-help ensure-deps ensure-report-dirs serve-reports _serve serve serve-quick serve-only

all: build-all

clean:
	@echo "🧹 Cleaning build artifacts..."
	@rm -rf dist/ apps/site/dist/ apps/site/.astro/ coverage/ htmlcov/ .lighthouse/ lighthouse-reports/ playwright-report/ test-results/ .test-results/
	@find . -name "*.gem" -type f -delete
	@echo "✅ Clean complete"

playground-help:
	@echo "Playground targets (run example sites):"
	@echo "  playground-html       Open vanilla HTML example"
	@echo "  playground-jekyll     Serve Jekyll example (demonstrates gem usage)"
	@echo "  playground-swift      Open SwiftUI example in Xcode"
	@echo "  playground-tailwind   Run Vite dev server for Tailwind example"
	@echo "  playground-bootstrap  Run Vite dev server for Bootstrap example"
	@echo "  playground-react      Run Vite dev server for React example"
	@echo "  playground-vue        Run Vite dev server for Vue example"
	@echo "  playground-python     Python example (placeholder)"
	@echo "  playground-all        Open HTML, Jekyll, Tailwind, React, Vue examples"

playground-html:
	@./scripts/playground.sh html

playground-jekyll:
	@./scripts/playground.sh jekyll

playground-swift:
	@./scripts/playground.sh swift

playground-tailwind:
	@./scripts/playground.sh tailwind

playground-bootstrap:
	@cd examples/bootstrap && bun install && bun run dev

playground-react:
	@cd examples/react && bun install && bun run dev

playground-vue:
	@cd examples/vue && bun install && bun run dev

playground-python:
	@echo "Python example placeholder - add implementation in examples/python-report/"

playground-all: playground-html playground-jekyll playground-tailwind playground-react playground-vue

# Test targets
test-help:
	@echo "Test targets:"
	@echo "  test              - Run all tests in optimized parallel phases"
	@echo "  test-fast         - Run without lighthouse (good for local dev)"
	@echo "  test-parallel     - Phase 1: unit + python + swift in parallel"
	@echo "  test-browser-parallel - Phase 3: examples + e2e in parallel"
	@echo "  test-unit         - Run TypeScript/Vitest unit tests"
	@echo "  test-e2e          - Run Playwright E2E tests"
	@echo "  test-examples     - Run Playwright tests for all examples"
	@echo "  test-python       - Run Python unit tests"
	@echo "  test-swift        - Run Swift unit tests with coverage"
	@echo "  test-lhci         - Run Lighthouse CI against apps/site/dist"
	@echo "  test-links        - Validate internal links with html-proofer"
	@echo "  test-all          - Alias for test"
	@echo ""
	@echo "Parallel execution phases:"
	@echo "  Phase 1: Unit + Python + Swift (parallel)"
	@echo "  Phase 2: Build examples (sequential, required for browser tests)"
	@echo "  Phase 3: Examples + E2E (parallel)"
	@echo "  Phase 4: Lighthouse (sequential)"
	@echo ""
	@echo "CPU cores detected: $$(nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 4)"

# Detect number of CPU cores for parallel execution
NPROC := $(shell nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 4)

# Reusable validation macro for bun commands
define check_bun
	@if ! command -v bun >/dev/null 2>&1 || [ ! -f "package.json" ]; then \
		echo "❌ bun or package.json missing. Install bun and deps first."; \
		exit 1; \
	fi
endef

# Run all tests in optimized parallel phases:
# Phase 1: Unit + Python + Swift (parallel)
# Phase 2: Build examples (required for browser tests)
# Phase 3: Examples + E2E (parallel)
# Phase 4: Lighthouse (sequential, needs server)
test: ensure-deps test-parallel build-examples examples-prep test-browser-parallel test-lhci

# Phase 1: Fast parallel tests (unit, python, swift)
test-parallel:
	@echo "🚀 Phase 1: Running unit tests in parallel ($(NPROC) CPUs available)..."
	@rm -rf .test-results && mkdir -p .test-results
	@( $(MAKE) test-unit > .test-results/unit.log 2>&1 && touch .test-results/unit.ok ) & \
	( $(MAKE) test-python > .test-results/python.log 2>&1 && touch .test-results/python.ok ) & \
	( $(MAKE) test-swift > .test-results/swift.log 2>&1 && touch .test-results/swift.ok ) & \
	wait; \
	echo ""; \
	echo "📋 Phase 1 Results:"; \
	[ -f .test-results/unit.ok ] && echo "  ✅ Unit tests passed" || echo "  ❌ Unit tests failed"; \
	[ -f .test-results/python.ok ] && echo "  ✅ Python tests passed" || echo "  ❌ Python tests failed"; \
	[ -f .test-results/swift.ok ] && echo "  ✅ Swift tests passed" || echo "  ❌ Swift tests failed"; \
	[ -f .test-results/unit.ok ] && [ -f .test-results/python.ok ] && [ -f .test-results/swift.ok ]

# Phase 3: Browser-based tests (sequential suites, each internally parallelized)
test-browser-parallel:
	@echo "🚀 Phase 3: Running browser test suites sequentially..."
	@$(MAKE) test-e2e
	@$(MAKE) test-examples

# Fast tests without lighthouse (for quick local verification)
test-fast: ensure-deps test-parallel build-examples examples-prep test-browser-parallel

# Individual example test targets
test-example-bootstrap:
	@node scripts/test-examples.mjs bootstrap

test-example-html:
	@node scripts/test-examples.mjs html-vanilla

test-example-jekyll:
	@node scripts/test-examples.mjs jekyll

test-example-react:
	@node scripts/test-examples.mjs react

test-example-tailwind:
	@node scripts/test-examples.mjs tailwind

test-example-vue:
	@node scripts/test-examples.mjs vue

# Run all example tests (sequential, used for standalone runs)
test-examples:
	@echo "🧪 Running all example tests..."
	@bun run examples:test

test-unit:
	$(call check_bun)
	@bun run test

test-e2e:
	@if [ "$${SKIP_E2E:-0}" = "1" ]; then \
		echo "⏭️  Skipping E2E (SKIP_E2E=1)"; \
	elif ! command -v bun >/dev/null 2>&1 || [ ! -f "package.json" ]; then \
		echo "❌ bun or package.json missing. Install bun and deps first."; \
		exit 1; \
	else \
		bun run e2e:ci; \
	fi

test-lhci:
	@if [ "$${SKIP_LHCI:-0}" = "1" ]; then \
		echo "⏭️  Skipping Lighthouse (SKIP_LHCI=1)"; \
	elif ! command -v bun >/dev/null 2>&1 || [ ! -f "package.json" ]; then \
		echo "❌ bun or package.json missing. Install bun and deps first."; \
		exit 1; \
	else \
		bunx lhci autorun --config=lighthouserc.json --collect.numberOfRuns=1; \
	fi

test-links: build-site
	@echo "🔗 Running link validation with html-proofer..."
	@if [ "$${SKIP_LINKS:-0}" = "1" ]; then \
		echo "⏭️  Skipping link tests (SKIP_LINKS=1)"; \
	else \
		bunx htmlproofer \
			--assume-extension \
			--allow-hash-href \
			--allow-missing-href \
			--disable-external \
			--ignore-urls "/localhost/,/coverage-ruby/,/playwright/,/lighthouse/,/reports\\/coverage/,/reports\\/playwright/,/reports\\/lighthouse/" \
			--ignore-files "/coverage-python/,/examples\\/html-vanilla/,/examples\\/tailwind/" \
			apps/site/dist 2>&1 || (echo "❌ Link validation failed"; exit 1); \
		echo "✅ Link validation passed"; \
	fi

test-python:
	@cd python && uv sync --extra dev && uv run pytest tests/ -v

test-swift:
	@if [ "$${SKIP_SWIFT:-0}" = "1" ]; then \
		echo "⏭️  Skipping Swift tests (SKIP_SWIFT=1)"; \
	else \
		if command -v swift >/dev/null 2>&1; then \
			echo "🧪 Running Swift tests with coverage..."; \
			cd examples/swift-swiftui && swift test --enable-code-coverage && \
			echo "📊 Generating Swift coverage report..." && \
			rm -rf htmlcov && mkdir -p htmlcov && \
			xcrun llvm-cov show \
				.build/arm64-apple-macosx/debug/TurboThemesPackageTests.xctest/Contents/MacOS/TurboThemesPackageTests \
				-instr-profile=.build/arm64-apple-macosx/debug/codecov/default.profdata \
				-format=html \
				-output-dir=htmlcov \
				-show-branches=count \
				-ignore-filename-regex='.*Tests.*' \
				-ignore-filename-regex='.*/.build/.*' && \
			echo "✅ Swift coverage report generated at examples/swift-swiftui/htmlcov/" && \
			echo "📊 Checking Swift coverage threshold (85% minimum)..." && \
			SWIFT_COV=$$(xcrun llvm-cov report \
				.build/arm64-apple-macosx/debug/TurboThemesPackageTests.xctest/Contents/MacOS/TurboThemesPackageTests \
				-instr-profile=.build/arm64-apple-macosx/debug/codecov/default.profdata \
				-ignore-filename-regex='.*Tests.*' \
				-ignore-filename-regex='.*/.build/.*' 2>&1 | grep '^TOTAL' | awk '{print $$10}' | tr -d '%') && \
			echo "Swift coverage: $${SWIFT_COV}%" && \
			if [ $$(echo "$${SWIFT_COV} < 85" | bc -l) -eq 1 ]; then \
				echo "❌ Swift coverage ($${SWIFT_COV}%) is below 85% threshold"; \
				exit 1; \
			else \
				echo "✅ Swift coverage meets 85% threshold"; \
			fi; \
		else \
			echo "⚠️  Swift not installed, skipping Swift tests"; \
		fi; \
	fi

test-all: test

# Workflow testing with ACT
.PHONY: test-workflows-help test-workflows test-workflows-quick test-workflows-list test-workflows-dry test-workflows-clean
test-workflows-help:
	@echo "Workflow testing targets (requires ACT + Docker):"
	@echo "  test-workflows       - Run all testable workflows"
	@echo "  test-workflows-quick - Run quality workflows only (fastest)"
	@echo "  test-workflows-list  - List all available workflows"
	@echo "  test-workflows-dry   - Dry-run (show commands without executing)"
	@echo ""
	@echo "Options (pass via environment):"
	@echo "  WORKFLOW=name        - Test specific workflow (e.g., WORKFLOW=quality-ci-main)"
	@echo "  CATEGORY=cat         - Filter by category (quality|security|publish|release|maintenance|reporting|deploy|other)"
	@echo "  EVENT=type           - Force event type (push|pull_request|tag|workflow_dispatch)"

test-workflows:
	@./scripts/local/test-workflows-act.sh $(if $(WORKFLOW),$(WORKFLOW),) \
		$(if $(CATEGORY),--category $(CATEGORY),) \
		$(if $(EVENT),--event $(EVENT),)

test-workflows-quick:
	@./scripts/local/test-workflows-act.sh --category quality

test-workflows-list:
	@./scripts/local/test-workflows-act.sh --list

test-workflows-dry:
	@./scripts/local/test-workflows-act.sh --dry-run $(if $(WORKFLOW),$(WORKFLOW),)

test-workflows-clean:
	@echo "Cleaning up stale ACT containers..."
	@# Note: removed -r flag from xargs for macOS/BSD compatibility
	@docker ps -a --filter "name=act-" -q | xargs docker rm -f 2>/dev/null || true

ensure-deps:
	@if ! command -v bun >/dev/null 2>&1; then \
		echo "❌ bun is required. Install from https://bun.sh"; \
		exit 1; \
	fi
	@if [ -f "package.json" ] && [ ! -d "node_modules" ]; then \
		echo "📦 Installing JS deps with bun install..."; \
		bun install; \
	fi
	@if [ -d "node_modules/@playwright/test" ]; then \
		echo "🎭 Ensuring Playwright browsers are installed..."; \
		bunx playwright install chromium >/dev/null 2>&1 || true; \
	fi
	@if [ -f "apps/site/package.json" ] && [ ! -d "apps/site/node_modules" ]; then \
		echo "📦 Installing Astro site deps..."; \
		cd apps/site && bun install; \
	fi

# Ensure report directories exist (these are cleaned by make clean)
ensure-report-dirs:
	@mkdir -p coverage lighthouse-reports playwright-report

serve-reports:
	@if ! command -v bunx >/dev/null 2>&1; then \
		echo "❌ bunx required to serve reports (http-server)."; exit 1; \
	fi
	@echo "Serving apps/site/dist (and reports if present) on http://127.0.0.1:4173 ..."
	@bunx --no-install http-server apps/site/dist -a 127.0.0.1 -p 4173 -c-1

# Build targets
build-help:
	@echo "Build targets:"
	@echo "  build-core      bun run build (tokens/ts)"
	@echo "  build-themes    bun run build:themes (CSS themes)"
	@echo "  build-js        bun run build:js (theme selector JS)"
	@echo "  build-html      build core+themes+js for vanilla demo"
	@echo "  build-site      build core+themes+js and Astro site"
	@echo "  build-examples  build all framework examples (React, Vue, Bootstrap, Tailwind)"
	@echo "  build-tailwind  bun build inside examples/tailwind"
	@echo "  build-swift     SwiftUI preview (open in Xcode)"
	@echo "  build-gem       Ruby gem for Jekyll"
	@echo "  examples-prep   copy built examples into site dist"
	@echo "  build-all       core + js + examples + site + prep + gem"
	@echo "  serve           run all tests, build site with reports, and serve"
	@echo "  serve-quick     build and serve without running tests"
	@echo "  serve-only      serve existing dist without rebuilding"

build-core:
	bun run build

build-themes:
	bun run build:themes

build-js:
	bun run build:js

# JS bundle only (dev + prod) - use after build-core to avoid redundancy
build-js-only:
	bun run build:js:dev && bun run build:js:prod

build-html: build-core build-js-only
	@echo "HTML demo built. Open examples/html-vanilla/index.html"

build-site: build-core build-js-only ensure-report-dirs
	cd apps/site && bun run build

# Internal serve target (shared by all serve variants)
_serve:
	@echo "🚀 Starting preview server..."
	@cd apps/site && bun run preview

# Run all tests and generate reports, then build and serve
serve: build-core build-js-only ensure-report-dirs build-site test-unit test-python test-swift test-e2e test-lhci
	@echo "📦 Rebuilding site with test reports..."
	@cd apps/site && bun run build
	@$(MAKE) _serve

# Quick serve without running tests (uses existing reports)
serve-quick: build-site
	@$(MAKE) _serve

# Serve without rebuilding (uses existing dist)
serve-only: ensure-report-dirs
	@$(MAKE) _serve

build-tailwind:
	cd examples/tailwind && bun install && bun run build

build-examples:
	@echo "📦 Building all examples..."
	@bun run examples:build

# Copy built examples into site dist (needed for browser tests)
examples-prep:
	@echo "📋 Preparing examples in site dist..."
	@bun run examples:prep

build-swift:
	@echo "Open examples/swift-swiftui/Package.swift in Xcode to build previews."

build-gem:
	@echo "💎 Building Ruby gem..."
	@./scripts/build-gem.sh

build-all: build-core build-js-only build-examples build-site examples-prep build-gem

help: playground-help build-help test-help test-workflows-help

