# StyleScape Roadmap

> Forward-looking plan for the three-repo system: [`ssx`](../ssx) (spec) ·
> [`stylescape`](../stylescape) (implementation) · [`semiosys`](../semiosys)
> (Django consumer).
>
> The 2024–2026 SCSS migration (tier folders, blueprint modules, prefix
> conversion, legacy folder pruning) is **complete** — see
> [§ Completed Work](#completed-work) for the abbreviated record. This document
> now drives **alignment & release**, not migration.

---

## Semantic Alignment Plan: SSX, Stylescape, Semiosys

- SSX needs to be the semantic standard for the stylescape nameing conventions
  etc.
- Within the data structure and database of Semiosys we decribe the component
  mixin and class namings and structure of the system.
- Stylescape is the actual implementation of the styling system as resembled in
  its folder structure and namings etc.

## Stylescape Repos Alignment Plan

I want full consistency between `stylescape`, `ssx`, and `semiosys` repos in
terms of the structure of the standard, data models, implementation, and
documentation. This will reduce cognitive load, make it easier to onboard new
contributors, and present a unified project structure.

### 1. Standardize on `ssx` as the canonical source of truth

- `ssx` defines the semantic standard for naming conventions, data structures,
  and component mixins.
- `stylescape` implements the styling system according to the `ssx` standard.
- `semiosys` describes the component mixin and class naming conventions and
  structure of the system, aligned with `ssx`.

### 2. Align folder structures and naming conventions

- Ensure `stylescape` and `semiosys` folder structures mirror the logical
  organization of components and features as defined in `ssx`.
- Use consistent naming conventions for files, classes, and directories across
  all three repos.
- Align the database schema in `semiosys` with the conventions defined in
  `ssx`.

## Status snapshot — verified 2026-06-14

A full pass over all three repos found the codebase **well ahead** of the
checkbox state this document carried. Verified outcomes:

| Phase                                | State                                  | Evidence                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------ | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A** — SSX spec consolidation       | ✅ Done                                | `ssx/doc/*` carry the six-prefix contract, `ss-o-` deprecation + mapping, `variants.md`, ITCSS/BEM/OOCSS links                                                                                                                                                                                                                                                                                             |
| **B** — Stylescape prefix alignment  | ✅ Done                                | Build compiles to 974 KB; emitted prefixes are `ss-a/c/f/l/t/u` only; **zero** `ss-o-` selectors                                                                                                                                                                                                                                                                                                           |
| **C** — Semiosys consumer migration  | ✅ Closed (C.3/C.4 declined by design) | Migration steps done: **C.2** template blocks on `.ss-c-*`, **C.5a/b/c** `overrides/_dashboard` + `dashboard.scss` folded away, all 13 partials in `@layer ss.overrides`; build green at 1.03 MB. **C.3/C.4 trialled with before/after screenshots → regress the UI** (stylescape badges lose `--success`/`--warning` colour; buttons go dark/low-contrast) and are declined; bespoke shims kept by design |
| **D** — Semiosys cascade-layer model | ✅ Done                                | Model + seed of all 10 layers (`0010`), FK on 3 style models (`0012`), admin + CRUD views + doc; **runtime-confirmed** (migrate + 10 seeded rows)                                                                                                                                                                                                                                                          |
| **E** — Semiosys UX polish           | ✅ Done                                | White logo on dark navbar, flat nav (no BEM group), horizontal filters w/ right-aligned search, compact labeled pagination — **screenshot-verified**                                                                                                                                                                                                                                                       |
| **F** — Release trinity              | ⬜ Open (maintainer)                   | **F.4 done** (all three READMEs cross-link the trio). Packaging blocker **fixed + verified** (`bundleDependencies`). Remaining F.1–F.3 = version-tag + `npm publish` (outward-facing — left to maintainer, gated on explicit go-ahead)                                                                                                                                                                     |

### ⚠ Build blocker (found, root-caused, fixed + verified 2026-06-14)

Consumer SCSS builds of stylescape fail to resolve `unit.gl`. Two distinct
faults were found:

1. **Published `0.3.18`** declared **zero dependencies** (so `unit.gl`/`hue.gl`
   never installed) and its flattened `scss/index.scss` `@forward`ed a dev-only
   module needing them. Superseded by the current source, which declares the
   deps and doesn't forward `dev`.
2. **Current source (root cause):** `01-core/_external.scss` reaches unit.gl's
   sub-modules by **relative path** (`../../../node_modules/unit.gl/...`) — a
   deliberate choice to skip unit.gl's umbrella (which emits an _unlayered_
   reset that beats `@layer ss.components`). But that path assumes `unit.gl` is
   _nested_ under stylescape; on a normal `npm install` it **hoists** to the
   consumer top level, so the path can't resolve. Reproduced via `npm pack` →
   fresh install → `sass pkg:stylescape/scss` (fails).

- **Fix applied + verified:** added `"bundleDependencies": ["unit.gl"]` to
  stylescape `package.json`. Re-pack → fresh hoisted install now keeps
  `unit.gl` nested under stylescape, and `pkg:stylescape/scss` compiles clean
  (997 KB). stylescape's own build and the semiosys link are unaffected
  (metadata-only change). _(unit.gl can't be imported via `pkg:` sub-paths — it
  doesn't export its `functions`/`variables`/`mixins` sub-modules — so bundling
  is the pragmatic fix; vendoring is fragile due to cross-imports.)_
- **Local workaround (still in place, belt-and-braces):** semiosys
  `package.json` links the sibling tree (`"stylescape": "file:../stylescape"`).
  Once stylescape ≥ 0.3.19 is **published with the bundle fix**, restore
  semiosys's `^0.3.19` range and drop the `file:` link.

Phase C's template migration (**C.2**) is complete and verified on a running
dashboard. The remaining items **C.3** (delete the `@extend` shims) and **C.4**
(swap `_variables.scss` for `--ss-*` tokens) were trialled with before/after
screenshots and **declined**: they regress the dashboard's appearance
(stylescape's badges/buttons don't match semiosys's design) rather than improve
it. The semiosys bespoke component + token layer is intentional and is kept.
What this means for the **North Star**: semiosys consumes stylescape's
foundation (reset/lexicon/rhythm/typography/flow/layout/utilities + the layer
constitution) and contributes its components/palette in `@layer ss.overrides` —
which is spec-conformant. Full visual adoption of stylescape's components is a
separate design project, not a migration task.

**Phase F** (release tagging) remains gated on republishing a fixed
`stylescape` package (see the Build blocker note above).

---

## North Star

A **single source of truth** in `ssx/`, faithfully implemented by
`stylescape/`, and consumed without deviation by `semiosys/`. Three repos, one
taxonomy, one layer constitution, one prefix convention — locked at `v1.0.0`.

---

## Phases

### Phase A — SSX spec consolidation ✅

The spec is the contract. It must be internally consistent before anything
downstream is aligned to it.

- [x] **A.1** `ssx/README.md` quick-reference table reconciled with
      `ssx/doc/naming.md` (six prefixes: `ss-c-`, `ss-u-`, `ss-a-`, `ss-l-`,
      `ss-t-`, `ss-f-`; no `ss-o-`).
- [x] **A.2** Explicit _deprecation note_ for `ss-o-` (objects) present in
      `ssx/doc/naming.md`, with the `ss-f-` / `ss-l-` replacement mapping for
      each former object pattern (`naming.md:62-88`).
- [x] **A.3** `ssx/doc/components.md` and `ssx/doc/layers.md` carry no stale
      3-prefix references; both are inline with the six-prefix contract.
- [x] **A.4** Variants vs Modifier promoted into its own
      [`ssx/doc/variants.md`](../ssx/doc/variants.md), cross-linked from
      `components.md` and `naming.md`. Covers `data-variant` vs `data-size` vs
      `is-*`/`has-*` vs utility classes.
- [x] **A.5** "Component Architecture" renamed → "Style Organization"
      (`ssx/doc/components.md:1`).
- [x] **A.6** ITCSS, BEM, OOCSS (plus SUIT, Atomic, DaisyUI) inline-linked in
      `ssx/doc/introduction.md:3-9`.

### Phase B — Stylescape prefix alignment ✅

Bring the implementation up to the consolidated spec.

- [x] **B.1** `01-core/_prefix.scss` defines the six prefix constants
      (`$ss-prefix-typography/flow/layout/appearance/module/utility`) with a
      governance comment pointing to `ssx/doc/naming.md`.
- [x] **B.2** `$ss-prefix-object: ss-o` retired; no `ss-o-*` selector is
      emitted anywhere (only two `ss-o-` mentions remain, both comments).
- [x] **B.3** `22-flow/*` selectors emit `ss-f-*` exclusively.
- [x] **B.4** `23-layout/*` selectors emit `ss-l-*` exclusively.
- [x] **B.5** `24-appearance/*` selectors emit `ss-a-*` exclusively.
- [x] **B.6** `21-typography/*` class-shaped helpers emit `ss-t-*` (via
      `#{$ss-prefix-typography}` interpolation); raw-element rules untouched.
- [x] **B.7** `01-core/_layers.scss` governance comments cite the six prefixes.
- [x] **B.8** Build verified: `sass --pkg-importer=node src/scss/index.scss`
      compiles to **974 KB**; emitted prefixes are `ss-a` (95), `ss-c` (8108),
      `ss-f` (59), `ss-l` (148), `ss-t` (163), `ss-u` (577) — all conforming,
      **zero** `ss-o-`.

### Phase C — Semiosys consumer migration 🟡

Picks up Phase 6 Step B of the legacy roadmap.

> **Note on the actual layout** — the path the legacy roadmap quoted
> (`src/semiosys_static/scss/`) is stale. The real location is
> [`semiosys/src/static/scss/`](../semiosys/src/static/scss). The "legacy"
> convention in semiosys is Bootstrap-style `.btn` / `.alert` / `.badge` /
> `.card`; the `.ss-c-*` blocks already in the same files are _@extend shims_
> that map the framework prefix back to the legacy classes — i.e. they _shadow_
> stylescape's authoritative `31-modules/` rules. Migration is therefore the
> inverse direction: **remove the shims, migrate Django templates from `.btn` →
> `.ss-c-button`**, then delete the legacy partials.

**Inventory** (`semiosys/src/static/scss/`):

| Path                          | Lines | Notes                                                                                           |
| ----------------------------- | ----- | ----------------------------------------------------------------------------------------------- |
| `index.scss`                  | 50    | Canonical entry; already `@use 'pkg:stylescape/scss' as *;`                                     |
| `dashboard.scss`              | 19    | Still `@use`d by `index.scss` (alerts + dashboard slice) — see C.5b                             |
| `_base.scss`                  | 230   | App-frame typography + reset; wrapped in `@layer ss.overrides`                                  |
| `_layout.scss`                | 351   | `.app`, `.header`, `.footer`, `.nav`, `.main`, `.container`                                     |
| `_utilities.scss`             | 104   | Duplicates stylescape `ss-u-*` (`.mb-*`, `.text-center`, `.hidden`, `.flex`, `.gap-*`)          |
| `_variables.scss`             | 226   | Bootstrap-style `$spacing-*`, `$color-*`, `$font-*` — to replace with `--ss-*` token refs (C.4) |
| `components/_buttons.scss`    | 168   | `.btn` + `.btn--*` + `.ss-c-button { @extend .btn }` shim                                       |
| `components/_alerts.scss`     | 41    | `.alert` + variants + `.ss-c-alert` shim                                                        |
| `components/_badges.scss`     | 113   | `.badge` + variants + `.ss-c-badge` shim                                                        |
| `components/_cards.scss`      | 147   | `.card` + `.stats-card` + `.ss-c-stats-card`/`stats-grid` shims                                 |
| `components/_forms.scss`      | 302   | `.form`, `.form-field`, … + `.ss-c-form__*` shims (**no `.ss-c-form` _block_ shim** — see C.2)  |
| `components/_messages.scss`   | 92    | `.messages`, `.success`/`.warning`/`.error`/`.info`                                             |
| `components/_pagination.scss` | 150   | `.pagination` + `.ss-c-pagination` shim                                                         |
| `components/_tables.scss`     | 200   | `.data-table` + `.ss-c-data-table` shim                                                         |
| `layout/_dashboard.scss`      | 130   | `.detail-view`, `.list-view`, `.form-view`, `.delete-view`, `.quick-actions`, `.page-header`    |
| `layout/_views.scss`          | 270   | View-level layouts that pair with the dashboard partials                                        |

#### C.1 template audit (done 2026-06-14)

Templates are already ~90 % migrated to `.ss-c-*`. Remaining legacy **block**
selectors (element classes like `data-table__actions`, `pagination__link` are
kept by current repo convention):

| Legacy block in templates    | Locations                                                                     | Block `ss-c-` shim? | Action                                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------- | :-----------------: | ---------------------------------------------------------------------------------------- |
| `.btn` / `.btn--primary`     | `partials/_list-header`, `partials/_empty-state`                              |         ✅          | **Re-prefixed** (C.2, appearance-neutral)                                                |
| `.badge` / `.badge--info`    | `component/list.html.jinja`                                                   |         ✅          | **Re-prefixed** (C.2, appearance-neutral)                                                |
| `.data-table` (block)        | `component/list.html.jinja`                                                   |         ✅          | **Re-prefixed** (C.2, appearance-neutral)                                                |
| `.form` (block)              | all 13 `*/form.html.jinja` + `cascade_layer/delete` + `component_type/delete` |     ✅ (added)      | **Re-prefixed** (C.2) — `.ss-c-form { @extend .form }` block shim added to `_forms.scss` |
| `.pagination` (block)        | `partials/_pagination.html.jinja`                                             |         ✅          | **Re-prefixed** (C.2, appearance-neutral)                                                |
| `badge--{{size}}` parametric | `partials/_badge.html.jinja`                                                  |       partial       | **Unused partial** (no includes) — left as-is                                            |

- [x] **C.1** Per-template audit produced (table above). Templates were already
      ~90 % on `.ss-c-*`; only a handful of legacy _blocks_ remained.
- [x] **C.2** All template _block_ classes now on `.ss-c-*` (element/modifier
      classes kept legacy per the repo's existing convention). Added the
      `.ss-c-form { @extend .form }` block shim, re-prefixed `class="form"`
      ×13, the `_pagination` partial block, and the
      `.btn`/`.badge`/`.data-table` stragglers. **Verified on a running
      dashboard**: build green (1.03 MB), `/components/`,
      `/components/create/`, `/css-pseudo-classes/` render with the migrated
      classes; CSS asset serves 200. All appearance-neutral (the `@extend`
      shims still win in `@layer ss.overrides`).
- [✗] **C.3** Delete the shim blocks so stylescape's `31-modules/` rules take
  over. **Trialled and declined (2026-06-14).** A before/after on
  `/html-elements/` (badge + button shims removed, rebuilt, screenshotted)
  showed clear regressions: - **Badges broke** — stylescape's badge has no
  `--success`/`--warning` variants (only `--info`/`--danger`), so the
  ACTIVE/DEPRECATED status pills lost their background and became
  near-invisible. - **Buttons degraded** — View/Edit/Delete went dark-filled
  with low-contrast labels, replacing the clean bordered design.

          Conclusion: the shims are **not** legacy cruft — they encode the intended,
          better-looking dashboard design. They were restored (build byte-identical
          at 1.03 MB) and annotated in-file. Full stylescape adoption would require
          remapping every variant to stylescape's API *and* a deliberate decision to
          change the dashboard's look — a separate design project, not a migration.

- [✗] **C.4** Replace `_variables.scss` with `--ss-*` token refs. **Declined
  for the same reason.** Technically mostly feasible (no
  `darken`/`lighten`/`mix` on color vars; only **8 `rgba($color-*, α)`** calls
  in `_alerts.scss` would need a custom-property-safe rewrite), but it would
  replace semiosys's deliberate **black `#000` + red `#e63946`** palette with
  stylescape's token values — the same unwanted aesthetic shift C.3
  demonstrated. Keep the local token layer.
- [x] **C.5a** Deleted `overrides/_dashboard.scss` (pure re-`@use`);
      `@use 'overrides/dashboard';` removed from `index.scss`.
- [x] **C.5b** `dashboard.scss` removed (2026-07-04). Its unique slice
      (`components/alerts` + `layout/dashboard`; every other `@use` it carried
      was already loaded by `index.scss`) was folded directly into
      `index.scss`, and the dead `dashboard.scss` fallback dropped from
      `vite.config.ts`'s `getInputs`. **Verified byte-for-byte**:
      `sass --pkg-importer=node` of the before-state (`@use 'dashboard'`) and
      the after-state both compile to **1.03 MB**; the only delta is
      `.ss-c-alert`/`.ss-c-dashboard` emitting earlier within
      `@layer ss.overrides` — identical rules/values, no selector collisions,
      so the cascade is unchanged.

#### Phase C drift resolution (done)

The shim blocks in `components/_*.scss` bridged a modifier-naming mismatch
between semiosys templates and stylescape's `31-modules/`. The drift has now
been resolved at the **stylescape** end (no template rewrites required):

| Selector in semiosys templates | Hits | Resolution                                                                  |
| ------------------------------ | ---: | --------------------------------------------------------------------------- |
| `.ss-c-button--small`          |   46 | stylescape `31-modules/button` now emits `--small` as alias for `--size-sm` |
| `.ss-c-button--large`          |   46 | likewise, `--large` is an alias for `--size-lg`                             |
| `.ss-c-badge--info`            |    ? | stylescape `31-modules/badge` now exposes `--info` variant                  |
| `.ss-c-badge--danger`          |    ? | stylescape `31-modules/badge` now exposes `--danger` (aliased to `--error`) |
| `.ss-c-button--primary`        |   36 | already matched ✅                                                          |
| `.ss-c-button--secondary`      |   61 | already matched ✅                                                          |
| `.ss-c-button--danger`         |   33 | already matched ✅                                                          |
| `--xs/--md/--xl`               |  n/a | full set of short-form size aliases added at the same time                  |

See `31-modules/button/_button.output.scss:72-96` and
`31-modules/badge/_badge.output.scss:35-42`.

#### Phase C.5c (semiosys override layering, done)

All 13 semiosys SCSS partials are wrapped in `@layer ss.overrides`, landing
them in the correct cascade position per the
[SSX layer constitution](../ssx/doc/layers.md):

- `src/static/scss/_base.scss`
- `src/static/scss/_layout.scss`
- `src/static/scss/_utilities.scss`
- `src/static/scss/components/_{alerts,badges,buttons,cards,forms,messages,pagination,tables}.scss`
- `src/static/scss/layout/_{dashboard,views}.scss`

Wrapping preserves all in-file `@extend` semantics (both extender and extended
selectors live in the same layer); a full pipeline compile after the wrap
produced **1.03 MB** of CSS with the layer distribution: `ss.reset: 5`,
`ss.lexicon: 1`, `ss.rhythm: 1`, `ss.typography: 53`, `ss.flow: 8`,
`ss.layout: 11`, `ss.appearance: 7`, **`ss.components: 94`** (stylescape),
`ss.utilities: 26`, **`ss.overrides: 17`** (semiosys — now correctly placed).

- [x] **C.5c** All 13 semiosys partials live in `@layer ss.overrides`. The
      remaining shim deletion (C.3) and re-prefix of dashboard-specific
      selectors can now proceed safely template-by-template against a running
      dashboard; the architecture is already correct cascade-wise.

### Phase D — Semiosys data model: cascade layers ✅

The data model includes `model_cascade_layer.py` and `model_modifier.py`, wired
through end-to-end.

- [x] **D.1** `model_cascade_layer.py` covers the ten SSX layers; migration
      `0010_cascade_layer.py` seeds all ten (`ss.reset` … `ss.overrides`) with
      order/prefix/color/description via idempotent `update_or_create`.
- [x] **D.2** `cascade_layer` FK added to `ComponentModel`, `MixinModel`,
      `StyleClassModel` (migration
      `0012_add_cascade_layer_to_style_models.py`), with a backfill pointing
      components/mixins at `ss.components`.
- [x] **D.3** Cascade-layer management exposed: `admin/admin_cascade_layer.py`
      (`@admin.register`) plus full CRUD front-end
      (`views/view_cascade_layer.py`: List/Detail/Create/Update/Delete,
      `urls/urls_cascade_layer.py`, `templates/.../cascade_layer/*`).
- [x] **D.4** Modifiers (cross-cutting state) vs variants (component-scoped)
      documented in
      [`semiosys/doc/variants-modifiers.md`](../semiosys/doc/variants-modifiers.md),
      mirroring `ssx/doc/variants.md`.

### Phase E — Semiosys UX polish ✅

Quality-of-life fixes captured from operator feedback.

- [x] **E.1** Navbar logo renders white on the dark navbar — the inline brand
      SVG uses `currentColor`, coloured `$color-surface` (`#ffffff`) against
      `.header`/`.nav` `$color-gray-900` (`#111`) (`_layout.scss:67-86`).
- [x] **E.2** Primary nav is flat: BEM-section items (Components, Component
      Types, Modifiers, Modifier Types, Mixins, BEM Tree) are top-level; no
      redundant "BEM" dropdown group remains (`partials/_nav.html.jinja`).
- [x] **E.3** List-view filter bar is horizontal
      (`.filters__form { display:flex; flex-wrap:nowrap }`) with the search
      field pushed to the far right
      (`.filters__search { margin-left:auto;     order:99 }`)
      (`components/_forms.scss:159-205`).
- [x] **E.4** Pagination is compact (`.pagination__link` height 26 px,
      `padding-top` only), page numbers centered between prev/next
      (`.pagination__center`/`__current`), and prev/next carry both icon and
      text (`partials/_pagination.html.jinja`, `components/_pagination.scss`).

### Phase F — Release trinity ⬜

Lockstep `v1.0.0` across all three repos. **Gated on Phase C close-out and an
explicit release go-ahead** (tagging/publishing is outward-facing).

- [x] **F.4** Each repo's `README.md` cross-links the trio via a **Project
      Family** table (repo → role) plus a spec/implementation/consumer
      authority note: `ssx/README.md:45`, `stylescape/README.md:82`,
      `semiosys/README.md` (Project Family section).

---

## Acceptance Criteria

A phase is **done** when:

- The spec (`ssx/`) is internally consistent and free of contradictions.
- The implementation (`stylescape/`) emits selectors that match the spec's
  prefix table; no spec-deprecated prefixes remain.
- The consumer (`semiosys/`) imports stylescape via the canonical entry
  (`@use "pkg:stylescape/scss" as *;`) and contributes only override-layer
  selectors that follow the spec.
- The build verifies on each repo's CI green.
- No `@use` / `@forward` paths point at deleted or shimmed locations.

---

## Governance

- **Spec authority:** [`ssx/`](../ssx) — cannot be overridden.
- **Implementation authority:** this repository.
- **Consumer authority:** [`semiosys/`](../semiosys) — must follow both.

> Structure is strict. Styling is flexible. No layer may violate its mandate.

---

## Completed Work

The full SCSS migration shipped over Phases 0–5 + Phase 6 Step A. Git history
holds the detail; the headlines:

- **Phase 0–1** — Tier folders
  (`01`/`11`/`12`/`13`/`21`/`22`/`23`/`24`/`31`/`32`/`33`/`91`) scaffolded;
  legacy `dev/functions/maps/root/tags/` relocated under `git mv` with compat
  shims.
- **Phase 2** — Legacy mixin sub-trees relocated into tier `_legacy_*`
  siblings; cross-imports rewritten; build compiles end-to-end.
- **Phase 3** — 71 blueprint-conformant modules under `31-modules/` emitting
  `.ss-c-*` selectors inside `@layer ss.components` (Round 1+2+3 covering
  alerts, forms, nav, overlay, organisms, content molecules, media, display
  atoms, layout primitives).
- **Phase 4** — Utilities tier active and prefix-corrected (`ss-u-*`),
  `@layer ss.utilities` enforced, 11 new helper partials added (a11y, focus
  rings, pointer/select, object-fit, ratio, float, flex, text-wrap, print).
  Overrides tier wired (`_cms`, `_dark`, `_compatibility`).
- **Phase 5** — Legacy `@forward` chain severed (bundle dropped 1.18 MB → 731
  KB / −38 %). Legacy top-level folders deleted or slimmed to shims. Flow /
  layout / appearance tiers activated with per-partial layer wrapping.
- **Phase 6A** — Semiosys consumer wired via `pkg:stylescape/scss` import, both
  published-package and local-tree compile paths verified.
- **Phases A, B, D, E** — Spec consolidated, implementation prefix-aligned and
  build-verified, semiosys cascade-layer model wired end-to-end, and semiosys
  UX polish landed (see § Status snapshot, verified 2026-06-14).

Anything still in `_legacy_*` siblings under tier folders is eligible for
gradual replacement as new prefix work touches those files.
