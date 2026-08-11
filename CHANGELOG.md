# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

Target: `v1.0.0` — cross-repo alignment with
[SSX v1.0](https://github.com/stylescape/ssx) and
[Semiosys v1.0](https://github.com/stylescape/semiosys).

---

## [0.4.0] - 2026-08-11

Merges the `new` branch — the layered-architecture rewrite — into `dev`,
on top of the `0.3.12`–`0.3.18` maintenance line. **This release is
breaking for every theme and site that consumes the core.**

### Breaking

- **SCSS entry layout replaced.** `src/scss/` is now numbered by cascade
  layer (`01-core` → `11-reset` → `12-lexicon` → `13-rhythm` →
  `21-typography` → `22-flow` → `23-layout` → `24-appearance` →
  `31-modules` → `32-utilities` → `33-overrides`, plus `91-development`).
  The old `classes/`, `variables/`, `mixins/`, `functions/`, `maps/`,
  `root/`, `tags/` and `dev/` trees, and `icons.scss`, are gone.
- **Class names follow the SSX prefix taxonomy.** Chrome and components
  emit `ss-c-`, with `ss-u-`, `ss-a-`, `ss-l-`, `ss-t-` and `ss-f-` for
  utilities, appearance, layout, typography and flow. Consumers still on
  unprefixed legacy selectors must migrate; the `32-utilities/` compat
  shims cover the common cases.
- **`package.json` `exports` rewritten.** The eight stale `./scss/<dir>`
  subpaths (`classes`, `dev`, `functions`, `maps`, `mixins`, `root`,
  `tags`, `variables`) and `./scss/icons` all pointed at directories that
  no longer exist. They are replaced by a single `./scss/*` pattern that
  resolves any cascade layer, e.g. `stylescape/scss/31-modules`.
- **Colour tokens are emitted as `--ss-color-*`** at `:root` from
  `12-lexicon/_color-tokens.scss`; module configs read them via `var()`
  rather than hard-coded values.

### Added

- `31-modules/button/_button.output.scss`: short-form size aliases
  (`--xs/--sm/--md/--lg/--xl`) and the spelled-out `--small`/`--large`
  variants are now first-class selectors, comma-grouped with the canonical
  `--size-*` form. Downstream templates that adopted the shorter names
  (notably semiosys, with 46 `.ss-c-button--small` hits) no longer need
  rewriting at upgrade time.
- `31-modules/badge/_badge.config.scss` + `_badge.output.scss`: added
  `info` and `danger` color variants. `--danger` is an alias for `--error`
  to keep semantic naming consistent with the alert and button modules.
  `--info` uses the existing `--ss-color-info` / `--ss-color-on-info`
  tokens.

### Changed

- `01-core/_prefix.scss`: governance comment now cites the canonical spec
  path (`ssx/doc/naming.md`) instead of the legacy `ssx/prefix.md` that
  never existed. The six-prefix taxonomy (`ss-c-`, `ss-u-`, `ss-a-`,
  `ss-l-`, `ss-t-`, `ss-f-`) is now the explicit contract.
- `01-core/_layers.scss`: each step of the 10-step conceptual progression
  is annotated with its `@layer ss.<layer>` and `ss-<x>-*` prefix, so the
  cascade hierarchy and the public class API are visible side-by-side.
- `01-core/_external.scss`: corrected drifted `unit.gl/scss/` import paths
  to `unit.gl/src/scss/` (matches the current `unit.gl@0.3.3` package
  layout). Without this fix, plain-sass compilation of the entry point
  could not resolve `unit.gl` partials.
- `hue.gl` moved to `^0.1.2`.
- `@getkist/action-tsup` pinned to the published `^1.0.7`, replacing the
  local `file:` link carried on the `new` branch.
- Regenerated `package-lock.json` against the merged manifest. The stale
  lock pinned `typescript-eslint` to `8.58.2`, which could not satisfy the
  `^8.59.3` manifest range — this is why `npm install` previously failed.
  A clean install now resolves (see Known issues).

### Removed

- `move.gl` dependency. It was already commented out in
  `01-core/_external.scss` and referenced nowhere else.
- `src/scss/dev/_wrapper.scss`. It existed to break a circular
  `$transition-default` dependency between the old `dev` and `variables`
  modules; neither module survives the restructure.
- `$ss-prefix-object` (`ss-o-`) Sass constant. Per the SSX `v1.0`
  deprecation, layout abstractions now emit under `ss-f-` (Flow) or
  `ss-l-` (Layout), and the *variation* dimension is captured by `data-*`
  variants. The constant had zero references across `src/scss/` and no
  selectors with the `.ss-o-*` prefix are emitted.

### Documentation

- Replaced the ~700-line migration log in `ROADMAP.md` with a
  forward-looking plan organised by phase (A–F). The completed Phase 0–5
  migration work is preserved in a brief "Completed Work" section; git
  history remains the canonical detail.
- ROADMAP Phase C inventory: documented the real `semiosys/src/static/`
  path (the legacy roadmap quoted a stale `semiosys_static/` location)
  and surfaced the `--small`/`--size-sm` modifier drift between semiosys
  templates and stylescape `31-modules/`.

### Known issues

- `npm run lint` does not run: `eslint.config.js` imports
  `eslint-config-prettier` and `globals`, and the `format` script needs
  `prettier`, but none are declared in `devDependencies`. Pre-existing on
  `dev`, not introduced by this release.
- `eslint-plugin-import@2.32.0` declares no ESLint 10 peer range, so
  installs need `--legacy-peer-deps` until upstream ships support.

---

## [0.3.12] – [0.3.18]

Maintenance line on `dev`: dependency bumps, preview snippet IDs and
template/style touch-ups. See git history and the GitHub releases for
per-version detail.

---

## [0.3.11] - prior

Pre-alignment baseline — see git history for per-commit detail.

[Unreleased]: https://github.com/stylescape/stylescape/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/stylescape/stylescape/compare/v0.3.18...v0.4.0
[0.3.11]: https://github.com/stylescape/stylescape/releases/tag/v0.3.11
