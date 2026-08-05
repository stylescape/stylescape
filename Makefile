# =============================================================================
# Stylescape Makefile
# =============================================================================
#
# SCSS + TypeScript design framework.
# This file follows the portable Makefile pattern used across all repos.
#
# =============================================================================

.PHONY: help install test lint format typecheck docs docs-build clean start build release

# Default target
.DEFAULT_GOAL := help

# Executables
NPM := npm


# =============================================================================
# Help
# =============================================================================

help: ## Show this help message
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""


# =============================================================================
# Installation
# =============================================================================

install: ## Install npm dependencies
	$(NPM) ci


# =============================================================================
# Testing & Linting
# =============================================================================

test: ## Run vitest tests
	$(NPM) run test:run

test-watch: ## Run tests in watch mode
	$(NPM) run test:watch

test-coverage: ## Run tests with coverage
	$(NPM) run test:coverage

lint: ## Run ESLint
	$(NPM) run lint

lint-fix: ## Run ESLint with auto-fix
	$(NPM) run lint:fix

format: ## Format code with Prettier
	$(NPM) run format

format-check: ## Check formatting with Prettier
	$(NPM) run format:check

typecheck: ## Run TypeScript type checking
	$(NPM) run typecheck


# =============================================================================
# Documentation
# =============================================================================

docs: ## Serve documentation locally
	mkdocs serve

docs-build: ## Build documentation
	mkdocs build


# =============================================================================
# Build
# =============================================================================

build: ## Build the package (SCSS + TypeScript)
	$(NPM) run build

start: ## Start development server
	$(NPM) run dev

watch: ## Watch for changes and rebuild
	$(NPM) run watch

clean: ## Remove build artifacts
	rm -rf dist/
	rm -rf node_modules/
	rm -rf site/


# =============================================================================
# Release
# =============================================================================

release: ## Publish package (requires npm auth)
	$(NPM) publish --access public


# =============================================================================
# Utilities
# =============================================================================

generate-sections: ## Generate SCSS section files
	$(NPM) run generate:sections

render-templates: ## Render Jinja templates
	$(NPM) run render:templates

parity-check: ## Gate on new SSX drift (baseline = accepted debt)
	$(NPM) run lint:ssx

parity-report: ## Full SSX conformance report, styles and templates
	$(NPM) run lint:ssx:report

parity-baseline: ## Re-record the SSX baseline after fixing findings
	$(NPM) run lint:ssx:baseline
