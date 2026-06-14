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

### Removed

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

---

## [0.3.11] - prior

Pre-alignment baseline — see git history for per-commit detail.

[Unreleased]: https://github.com/stylescape/stylescape/compare/v0.3.11...HEAD
[0.3.11]: https://github.com/stylescape/stylescape/releases/tag/v0.3.11
