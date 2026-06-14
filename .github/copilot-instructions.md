# =============================================================================

# Copilot Instructions

# =============================================================================

#

# Project-specific guidance for GitHub Copilot.

# This file is portable - copy to other repos without modification.

#

# =============================================================================

# =============================================================================

# Project Context

# =============================================================================

- Project context: This is a design framework npm package. Check `package.json`
  for package name and description.
- Source layout: SCSS sources in `src/scss/`, TypeScript in `src/ts/`.
- Tests: Vitest tests live in `tst/` (see `vitest.config.ts`).
- Demo app: Demo project lives in `exe/`.

# =============================================================================

# Commands

# =============================================================================

- Preferred commands:
    - Install: `make install` or `npm ci`
    - Run tests: `make test` or `npm run test:run`
    - Lint: `make lint` or `npm run lint`
    - Build: `make build` or `npm run build`
    - Dev: `make start` or `npm run dev`

# =============================================================================

# Code Style

# =============================================================================

- Line length: 79 characters (PEP 8 / project convention)
- SCSS: 4 spaces indent, BEM naming convention
- TypeScript: 4 spaces indent, ESLint + Prettier enforced
- Section headers: Use `// ===...===` dividers between major sections
- Import order: external → internal → local

# =============================================================================

# CI Policy

# =============================================================================

- Keep CI lightweight: prefer PR-only workflows and avoid large matrices unless
  explicitly requested.
- Agent/tooling config: `.github/agents/config.yml`
