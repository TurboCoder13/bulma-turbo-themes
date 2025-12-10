.PHONY: playground-html playground-jekyll playground-swift playground-tailwind playground-bootstrap playground-python playground-all playground-help \
	build-help build-all build-core build-themes build-html build-jekyll build-tailwind build-swift

playground-help:
	@echo "Playground targets:"
	@echo "  playground-html       Open vanilla HTML demo"
	@echo "  playground-jekyll     Serve Jekyll demo (bundle exec jekyll serve)"
	@echo "  playground-swift      Open SwiftUI preview package in Xcode"
	@echo "  playground-tailwind   Run Vite dev server for Tailwind demo"
	@echo "  playground-bootstrap  Open Bootstrap demo (placeholder)"
	@echo "  playground-python     Run Python report demo (placeholder)"
	@echo "  playground-all        Open HTML, Jekyll, Tailwind"

playground-html:
	open examples/html-vanilla/index.html

playground-jekyll:
	cd examples/jekyll && bundle exec jekyll serve --livereload

playground-swift:
	open examples/swift-swiftui/Package.swift

playground-tailwind:
	cd examples/tailwind && bun install && bun run dev

playground-bootstrap:
	@echo "Bootstrap demo placeholder - add implementation in examples/bootstrap/"

playground-python:
	@echo "Python report demo placeholder - add implementation in examples/python-report/"

playground-all: playground-html playground-jekyll playground-tailwind

# Build targets
build-help:
	@echo "Build targets:"
	@echo "  build-core      bun run build (tokens/ts)"
	@echo "  build-themes    bun run build:themes (CSS/themes)"
	@echo "  build-html      build core+themes for vanilla demo"
	@echo "  build-jekyll    build core+themes and Jekyll site"
	@echo "  build-tailwind  bun build inside examples/tailwind"
	@echo "  build-swift     SwiftUI preview (open in Xcode)"
	@echo "  build-all       core + themes + Jekyll"

build-core:
	bun run build

build-themes:
	bun run build:themes

build-html: build-core build-themes
	@echo "HTML demo built. Open examples/html-vanilla/index.html"

build-jekyll: build-core build-themes
	bundle exec jekyll build --config _config.yml

build-tailwind:
	cd examples/tailwind && bun install && bun run build

build-swift:
	@echo "Open examples/swift-swiftui/Package.swift in Xcode to build previews."

build-all: build-core build-themes build-jekyll

