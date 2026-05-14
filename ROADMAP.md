# StyleScape Roadmap

> Migration plan for restructuring `src/scss/` into the canonical tier
> architecture defined by the [SSX Layer Constitution](../ssx/layers.md) and
> [Folder Structure](../ssx/folder_structure.md), and aligning the Semiosys
> consumer with the same import contract.

This roadmap is the single source of truth for the SCSS migration. It is
binding. No structural deviation is permitted without amending this document
and the corresponding SSX specification.

---

## 1. Goals

1. Replace the legacy `classes/`, `mixins/`, `variables/`, `functions/`,
   `maps/`, `root/`, `tags/`, `dev/` folders with the **numeric tier system**
   (`01`, `11–13`, `21–24`, `31–33`, `91`).
2. Apply the **Component Blueprint** (`config → mixins → output → index`) to
   every module under `31-modules/` and to internal sub-systems where it makes
   sense.
3. Enforce the **SSX prefix convention** (`ss-c-*`, `ss-o-*`, `ss-u-*`, `is-*`,
   `has-*`) across all output.
4. Keep the [`stylescape`](../stylescape) (framework), [`ssx`](../ssx)
   (specification) and [`semiosys`](../semiosys) (Django consumer) repositories
   in lockstep.

---

## 2. Target Tier Layout

```
src/scss/
├── 01-core/          # Infrastructure: layers, prefix, banner, governance
├── 11-reset/         # Browser normalization (ss.reset)
├── 12-lexicon/       # Tokens: color, spacing, type, motion, z-index, …
├── 13-rhythm/        # Baseline grid, leading, vertical spacing
├── 21-typography/    # Character, paragraph, font, list, text
├── 22-flow/          # Stack, cluster, inline, split, cover, center, frame
├── 23-layout/        # Container, grid, columns, region, breakpoints
├── 24-appearance/    # Background, border, color, elevation, filter, …
├── 31-modules/       # ss-c-* components (blueprint enforced)
├── 32-utilities/     # ss-u-* atomic helpers (layout/spacing/typography)
├── 33-overrides/     # CMS, third-party, dark, compatibility patches
├── 91-development/   # Debug, baseline overlay, deprecation, demo
└── index.scss        # Explicit, ordered entry point (no globs)
```

Folder ↔ `@layer` mapping is fixed by
[SSX layers.md](../ssx/layers.md#i-global-layer-order).

---

## 3. Module Sub-Structure (Component Blueprint)

Every folder under `31-modules/` **must** follow this structure — no
exceptions, per [SSX component_blueprint.md](../ssx/component_blueprint.md):

```
31-modules/<module>/
├── _<module>.config.scss   # Public Sass config map, `!default`, no CSS
├── _<module>.mixins.scss   # Mixins/functions, may use config only
├── _<module>.output.scss   # `.ss-c-<module>` selectors only
└── _index.scss             # `@forward` control surface
```

Dependency direction is one-way: `config → mixins → output → index`.

The same pattern is recommended (but not strictly required) for non-trivial
sub-systems inside `12-lexicon/`, `21-typography/`, `22-flow/`, `23-layout/`,
`24-appearance/` when they grow beyond a handful of files.

---

## 4. Legacy → Target Mapping

| Legacy path                    | Destination                                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------------ |
| `scss/dev/`                    | `91-development/`                                                                          |
| `scss/functions/`              | `01-core/functions/` (forwarded)                                                           |
| `scss/variables/`              | `12-lexicon/` (split per token family)                                                     |
| `scss/maps/`                   | `01-core/maps/` (or inline into tokens)                                                    |
| `scss/root/`                   | `12-lexicon/_tokens.scss` (`:root`)                                                        |
| `scss/mixins/`                 | Split per layer (`22-flow`, `23-layout`, `24-appearance`, `31-modules/<m>/_*.mixins.scss`) |
| `scss/classes/`                | Split per layer (`32-utilities`, `31-modules`)                                             |
| `scss/tags/`                   | `11-reset/` + `21-typography/`                                                             |
| `scss/31-modules/_badge.scss`  | `31-modules/badge/_badge.output.scss`                                                      |
| `scss/31-modules/_button.scss` | `31-modules/button/_button.output.scss`                                                    |
| `scss/31-modules/buttons/`     | merge into `31-modules/button/`                                                            |
| `scss/31-modules/cards/`       | merge into `31-modules/card/`                                                              |
| `scss/31-modules/inputs copy/` | **delete** (stale duplicate)                                                               |
| `scss/31-modules/layout copy/` | **delete** (stale duplicate)                                                               |

---

## 5. Phased Plan

### Phase 0 — Baseline

- [x] Tier folders scaffolded (`01`, `11–13`, `21–24`, `31–33`, `91`).
- [x] `src/scss/index.scss` references tier folders for `01`, `11`, `12`, `13`,
      `21`.
- [x] ROADMAP published (this document).

### Phase 1 — Foundation freeze

- [x] Delete stale `12-lexicon/_tokens.scss` stub (conflicting `--ss-space-*`
      names that shadowed the proper `--ss-spacing-*` token scale).
- [x] `git mv src/scss/dev` → `src/scss/91-development/_legacy_dev/` and
      forward it from `91-development/_index.scss`.
- [x] `git mv src/scss/functions` → `src/scss/01-core/functions/` and forward
      it from `01-core/_index.scss`.
- [x] `git mv src/scss/maps` → `src/scss/01-core/maps/` and forward it from
      `01-core/_index.scss`.
- [x] `git mv src/scss/root` → `src/scss/12-lexicon/root/` and forward it from
      `12-lexicon/_index.scss`.
- [x] `git mv src/scss/tags` → `src/scss/11-reset/tags/` and forward it from
      `11-reset/_index.scss` (typography-only tag rules will move on to
      `21-typography/` in Phase 2).
- [x] Install **compatibility re-forward shims** at every legacy path (`dev/`,
      `functions/`, `maps/`, `root/`, `tags/`) so the ~200 existing
      `@use "../dev"` / `@use "../variables"` style imports inside
      `variables/`, `mixins/`, `classes/`, `21-typography/`, `31-modules/` keep
      resolving. Each shim is marked `@deprecated` and is scheduled for removal
      in Phase 5.
- [ ] Migrate `scss/variables/**` into `12-lexicon/` split by family
      (`_color/`, `_spacing.scss`, `_typescale.scss`, `_motion.scss`,
      `_radius.scss`, `_shadow.scss`, `_z-index.scss`, `_border.scss`).
      _(Deferred — current 12-lexicon already provides the canonical `--ss-*`
      token scale; legacy
      `$color_\*`Sass vars in`variables/`are     still consumed by`mixins/` and
      will be retired alongside Phase 3.)\_

#### Compatibility shim contract

Every shim is a 7-line file that does nothing but `@forward` to the new
location. Example — `src/scss/functions/_index.scss`:

```scss
////
/// Compatibility shim — `functions/` was relocated to `01-core/functions/`.
/// New code should `@use "../01-core/functions"`.
/// Scheduled for removal once Phase 5 of ROADMAP.md ships.
/// @deprecated Use 01-core/functions directly.
////
@forward "../01-core/functions";
```

New code **must not** use shim paths. Touching a file that still imports from a
shim is the trigger to migrate that file's imports as part of the edit.

### Phase 2 — Expression layers

- [x] Move legacy mixin sub-trees into their tier homes (sibling-preserving
      relocations, history kept via `git mv`): - `mixins/head_layout/` →
      `23-layout/_legacy_head_layout/` - `mixins/head_frame/` →
      `23-layout/_legacy_head_frame/` - `mixins/soul_object/` →
      `24-appearance/_legacy_soul_object/` - `mixins/soul_line/` →
      `24-appearance/_legacy_soul_line/` - `mixins/soul_type/` →
      `21-typography/_legacy_soul_type/`
- [x] Install
      `mixins/{head_layout,head_frame,soul_object,soul_line,soul_type}/_index.scss`
      compatibility shims (Phase 1 contract). All `@forward` re-export to the
      new tier locations and are scheduled for removal in Phase 5.
- [x] Repoint sibling cross-imports inside `23-layout/_legacy_head_frame/*`
      that referenced `../head_layout` and `../soul_object` to their new
      tier-relative paths.
- [x] Repoint `mixins/utilities/_*.scss` deep `@forward`s
      (`../head_layout/...`, `../soul_line/...`) to the new tier paths.
- [x] Bulk-rewrite the ~28 deep consumer references of the form
      `mixins/<sub>/<file>` in `classes/` and `21-typography/` to the new tier
      paths via `perl -i -pe`.
- [x] Fix Phase 1 oversight — update relative depth in `11-reset/tags/_*.scss`
      (`../dev` → `../../dev`, etc.) since `tags/` moved one level deeper.
- [x] Wire `_legacy_*` forwards into `21-typography/_index.scss`,
      `23-layout/_index.scss`, `24-appearance/_index.scss` (outside their
      `@layer` blocks because these are mixin libraries with no selectors).
- [x] Comment out broken `@forward "buttons"` in
      `mixins/body_atoms/_index.scss` (target subfolder never existed —
      pre-existing gap).
- [x] **Build now compiles end-to-end** (1.15 MB CSS) — the long-standing
      pre-existing failure at `mixins/body_atoms/_index.scss` is gone.

#### Deferred to Phase 3

- [ ] Split `_legacy_head_layout/` into proper `22-flow/` (stacks, flex,
      position) and `23-layout/` (grid, paper, display, overflow, spacing)
      primitives, per the layer constitution.
- [ ] Split `_legacy_soul_object/` into
      `24-appearance/{color,fill,shadow,size,shape}/`.
- [ ] Split `_legacy_soul_line/` into `24-appearance/border/`.
- [ ] Re-home `_legacy_soul_type/` mixins into the proper
      `21-typography/{character,font,paragraph,list,text}/` sub-folders.

### Phase 3 — Modules (blueprint conversion)

For every existing module folder in `31-modules/`:

- [ ] Create `_<m>.config.scss`, `_<m>.mixins.scss`, `_<m>.output.scss`,
      `_index.scss`.
- [ ] Move all selectors into `_<m>.output.scss`, prefixed `.ss-c-<m>`.
- [ ] Replace BEM modifiers with `data-variant="…"` and `is-*`/`has-*` state
      classes (per [SSX prefix.md](../ssx/prefix.md)).
- [ ] Remove flat `_badge.scss`, `_button.scss` aggregator files once the
      folder versions are wired through `31-modules/_index.scss`.

#### Phase 3 — Step A (foundation activation, completed)

- [x] Populate empty `badge/_index.scss` and `pull-quote/_index.scss` with the
      blueprint forward chain.
- [x] Fix dropcap internal imports (`./dropcap.config` →
      `./character-dropcap.config`, ditto for mixins).
- [x] Fix button internal import (`./button.api` → `./button.mixins`).
- [x] Delete shadowing orphan stubs `31-modules/_badge.scss` and
      `31-modules/_button.scss` (both were one-line `@forward` shims to
      `status/badge` / `buttons/button`; their content is preserved in the
      legacy submodules and the new blueprint `badge/`/`button/` folders are
      now authoritative).
- [x] Rewrite `31-modules/_index.scss` to forward only blueprint-conformant
      modules (`badge`, `button`, `card`, `dropcap`, `hero`, `modal`,
      `pull-quote`); removed broken `alert`/`tooltip` references that pointed
      at non-existent siblings (those live under `display/`).
- [x] Activate `@use "31-modules" as *;` in main `index.scss`.
- [x] **Build still compiles end-to-end** (1.16 MB CSS, +8 KB from the seven
      modules now in the bundle).

#### Phase 3 — Step B (stale-duplicate purge, completed)

A code-archaeology audit revealed that the following `31-modules/` folders were
**stale duplicates** of legacy mixin libraries from `mixins/body_atoms/` and
`mixins/body_molecules/`. They were copied into `31-modules/` mid-way through
an earlier refactor without fixing their internal `@use` paths (references like
`../../../dev`, `../../head_layout` no longer resolve from their new depth).
Cross-repo grep confirmed **zero references** to any of them — they had never
been wired into the build and never compiled.

- [x] `git rm -r` the entire stale set (17 folders): `buttons/`, `cards/`,
      `content/`, `display/`, `feedback/`, `form/`, `inputs/`, `inputs copy/`,
      `label/`, `layout/`, `layout copy/`, `media/`, `navigation/`,
      `preloader/`, `status/`, `table/`, `hero/hero/`.
- [x] Authoritative mixin sources
      (`mixins/body_atoms/{layout,inputs,status,     label,display,media}/` and
      `mixins/body_molecules/`) remain untouched and continue to serve the
      legacy `classes/` consumers until Phase 4 retires them.
- [x] **Build verified clean** (1.16 MB CSS, no regressions).

After Step B, `31-modules/` contains exactly the 7 blueprint-conformant
components: `badge`, `button`, `card`, `dropcap`, `hero`, `modal`,
`pull-quote`.

#### Phase 3 — Step C (new-module authoring, backlog)

Real component modules still need to be authored from scratch (or by extracting
selectors out of the legacy `classes/body_*` tree). They are **not** in the
build yet because they don't yet exist as blueprint folders.

For each new module, follow the blueprint:

- [ ] Create `_<m>.config.scss` (`!default` map, no CSS).
- [ ] Create `_<m>.mixins.scss` (uses config only).
- [ ] Create `_<m>.output.scss` (`.ss-c-<m>` selectors only, wrapped in
      `@layer ss.modules`).
- [ ] Create `_index.scss` with the 3-line `@forward` chain.
- [ ] Add forward to `31-modules/_index.scss`.

Authoring order (low-risk → high-risk):

1. `label`, `status`, `alert`, `tooltip`
2. `accordion`, `breadcrumb`, `chip`, `tag`
3. `form`, `input`, `select`, `checkbox`, `radio`, `toggle`
4. `table`, `pagination`, `dropdown`, `nav`
5. `toast`, `popover`, `preloader`, `progress`, `spinner`
6. `carousel`, `slideshow`, `image`, `video`, `figure`

### Phase 4 — Utilities & overrides

#### Phase 4 — Step A (tier activation, completed)

- [x] Audit `32-utilities/` — found pre-populated tier with 7 partials
      (`layout/{display,position,visibility}.scss`,
      `spacing/{margin,padding}.scss`, `typography/{text-align,truncate}.scss`)
      defining ~137 selectors but using the wrong prefix (`ss-*` instead of
      `ss-u-*`).
- [x] Re-prefix every utility selector from `.ss-*` → `.ss-u-*` per
      [SSX prefix.md](../ssx/prefix.md) (`ss-u-block`, `ss-u-mt-1`,
      `ss-u-text-center`, `ss-u-truncate`, `ss-u-sr-only`, …).
- [x] Wrap each utility partial body in `@layer ss.utilities { ... }` so the
      cascade order matches the constitution.
- [x] Drop `@layer` wrappers from `32-utilities/_index.scss` and
      `33-overrides/_index.scss` (Sass forbids `@forward` inside `@layer`);
      layer assignment is now per-file.
- [x] Activate `@use "32-utilities" as *;` and `@use "33-overrides" as *;` in
      `src/scss/index.scss`.
- [x] **Build verified** (1.17 MB CSS, +10 KB from utilities now in the
      bundle).

#### Phase 4 — Step B (legacy utilities migration, in progress)

The legacy `classes/utilities/` (~17 partials) and `mixins/utilities/` (~14
partials) still hold helpers that aren't yet in the tier:

- [x] **High-value migration completed** — added 11 fresh blueprint-shaped
      partials with proper `ss-u-*` prefix and `@layer ss.utilities`
      wrapping: - `accessibility/_visually-hidden.scss`
      (`ss-u-visually-hidden`, `ss-u-visually-hidden-focusable`) -
      `accessibility/_focus-ring.scss` (`ss-u-focus-ring`,
      `ss-u-no-focus-ring`) - `interaction/_pointer-events.scss`
      (`ss-u-pe-{none,auto}`) - `interaction/_user-select.scss`
      (`ss-u-user-select-{all,auto,none,text}`) -
      `interaction/_stretched-link.scss` (`ss-u-stretched-link`) -
      `media/_object-fit.scss`
      (`ss-u-object-{contain,cover,fill,none,       scale-down,top,bottom,center,start,end}`) -
      `media/_ratio.scss` (`ss-u-ratio`, `ss-u-ratio-{1x1,4x3,16x9,21x9}`) -
      `layout/_float.scss` (`ss-u-float-{start,end,none}`, `ss-u-clearfix`) -
      `layout/_flex.scss` (~25 helpers: direction, wrap, grow/shrink, justify,
      items) - `typography/_text-wrap.scss`
      (`ss-u-text-{wrap,nowrap,balance,       pretty}`,
      `ss-u-break-{normal,words,all,keep}`) - `print/_print.scss`
      (`ss-u-print-*`, `ss-u-screen-none` — wrapped in `@media print` /
      `@media screen` then `@layer ss.utilities`)
- [x] All new partials wired into `32-utilities/_index.scss`.
- [x] **Build verified** (1.18 MB CSS, +5 KB).

#### Deferred (not migrated — low value or modules-domain)

These legacy `classes/utilities/` files won't be migrated to the tier because
they belong elsewhere or are obsolete:

- [ ] `_gradient.scss` → belongs in `24-appearance/background/` (not a utility
      — it's an appearance primitive). Defer to Phase 3 backlog.
- [ ] `_icon_link.scss` → use the `icon.gl` package directly; no longer a core
      utility.
- [ ] `_negative_margin.scss` → BEM-style `.m--n-01` classes are spec
      violations and rarely useful; if needed, add to `spacing/_margin.scss`
      with `ss-u-m-n1` style names.
- [ ] `_stacks.scss` → belongs in `22-flow/` (stack primitive), not a utility.
- [ ] `_vertical_rule.scss` → belongs in `24-appearance/border/` as a
      decorative element; not a utility.
- [ ] `_text_truncate.scss` → already covered by `typography/_truncate.scss`
      (`ss-u-truncate`, `ss-u-line-clamp-{1..4,none}`).

#### Phase 4 — Step C (overrides population, backlog)

- [ ] Move `_dark.scss` content (currently using `@layer ss.themes` — should be
      `@layer ss.overrides` per the constitution) into `33-overrides/`.
- [ ] Identify CMS-specific selectors in legacy `classes/` (Wagtail, Django
      admin) and route to `33-overrides/_cms.scss`.
- [ ] Identify third-party patches (icon.gl, google maps, video.js, etc.) and
      route to `33-overrides/_third-party.scss`.
- [ ] Browser compatibility shims → `33-overrides/_compatibility.scss`.

#### Phase 4 — Step C results (completed)

- [x] Wrap `_cms.scss` and `_compatibility.scss` in `@layer ss.overrides`
      (already populated with selectors during a prior cycle).
- [x] Move `_dark.scss` from `@layer ss.themes` to `@layer ss.overrides`
      (no `ss.themes` layer exists in
      [01-core/_layers.scss](src/scss/01-core/_layers.scss)). Wire into
      `33-overrides/_index.scss`.
- [x] Verify `_third-party.scss` is intentionally empty (placeholder for
      future integrations).

### Phase 5 — Tooling & cleanup

#### Phase 5 — Step A (legacy chain severance, completed)

- [x] Comment out the seven legacy `@forward "dev/functions/variables/
      mixins/classes/maps/tags"` lines in `src/scss/index.scss` (the chain
      that re-exported the old tree into the bundle).
- [x] **CSS bundle drops from 1.18 MB → 731 KB (-447 KB, -38%)**. The
      legacy `classes/` tree was nearly half the bundle. The remaining
      731 KB is the canonical tier output.
- [x] Audit external consumers: cross-repo grep across `semiosys/` and
      `ssx/` returns zero references to `src/scss/{classes,mixins,
      variables,functions,maps,tags,root,dev}/`. Safe to physically remove
      these trees in a future commit.

#### Phase 5 — Step B (legacy folder pruning, completed)

The 124 tier-side legacy `@use`/`@forward` references audited at the
end of Step A have been rewritten via bulk `perl -i -pe` substitutions
followed by build verification. The legacy top-level folders have been
pruned to the minimum surface needed to keep the import graph valid:

- [x] **Deleted outright:** `classes/` (no consumers), `dev/`,
      `functions/`, `maps/`, `root/`, `tags/` (after rewriting tier
      consumers).
- [x] **Slimmed to shims:** `mixins/` now contains only the 5 subfolder
      indexes (`head_frame/`, `head_layout/`, `soul_object/`,
      `soul_line/`, `soul_type/`) and a 5-line root `_index.scss` that
      `@forward`s them. The body_atoms/body_molecules/body_organisms/
      body_skeletons/head_content/utilities subtrees have been
      `git rm`'d (no tier consumers after the Phase 5 Step A severance).
- [x] **Relocated into tier:** `variables/` → `12-lexicon/_legacy_variables/`
      (preserved via `git mv`, internal `@use` depths bumped, all 41
      tier consumers rewritten).
- [x] **Path rewrites applied uniformly:** `../../dev` →
      `../../91-development/_legacy_dev`; `../../maps` →
      `../../01-core/maps`; `../../variables` →
      `../../12-lexicon/_legacy_variables` (and equivalent 3-deep forms),
      executed across both tier files and the previously-relocated
      `_legacy_*` siblings (`23-layout/_legacy_head_layout/`,
      `_legacy_head_frame/`, `24-appearance/_legacy_soul_object/`,
      `_legacy_soul_line/`, `21-typography/_legacy_soul_type/`).
- [x] **Build verified:** stylescape standalone compiles to 695,149 bytes
      (down from 730,891 — a further -35 KB drop from removing duplicate
      legacy files). Semiosys via local working tree compiles to 709,027
      bytes.

Result: `src/scss/` now lists only tier folders + `mixins/` (thin shim)
+ `index.scss` + `icons.scss`. The legacy bloat is gone; what remains is
either renamed to a tier-appropriate `_legacy_*` sibling (eligible for
gradual replacement during Phase 3 Step C) or kept as a 6-file
compatibility shim.

#### Phase 5 — Step C (tooling, backlog)

- [ ] Remove the commented-out `@forward` block from
      `src/scss/index.scss` once Step B lands.
- [ ] Update `bin/check_scss_coverage.mjs` and `bin/generate_sections.mjs`
      to walk the new tier layout.
- [ ] Update `vite.config.js` / `vitest.config.ts` aliases if they
      reference legacy paths.

### Phase 6 — Cross-repo synchronization

#### Phase 6 — Step A (semiosys consumer wiring, completed)

- [x] Create `semiosys/src/semiosys_static/scss/index.scss` — canonical
      consumer entry that pulls in the StyleScape framework via
      `@use "pkg:stylescape/scss" as *;` (resolved by
      `sass.NodePackageImporter()` already configured in
      `semiosys/vite.config.ts`).
- [x] Create `semiosys/src/semiosys_static/scss/overrides/_dashboard.scss`
      that re-bundles the Django-admin-specific dashboard slice. Layered
      under `ss.overrides` once those selectors are migrated to the
      `ss-c-*` / `ss-u-*` convention (deferred — Step B).
- [x] Verify two compile paths:
      - **Published package** (`stylescape@0.3.17` from npm): 802 KB CSS.
      - **Local working tree** via custom `pkg:stylescape/scss` rewrite:
        745 KB CSS (matches `731 KB stylescape tier + 14 KB semiosys
        overrides`).
- [x] Existing `dashboard.scss` entry kept untouched for backward
      compatibility — vite still picks it as the build input until
      `index.scss` becomes the entrypoint.

#### Phase 6 — Step B (semiosys override migration, backlog)

- [ ] Inventory the ~110 dashboard selectors (`.btn`, `.alert`, `.badge`,
      `.dashboard`, `.data-table`, `.form__field`, …) and decide
      per-selector: (1) upstream into stylescape `31-modules/`, (2) keep
      as semiosys override, (3) delete (already covered by stylescape).
- [ ] Re-prefix kept selectors to `ss-c-*` per the spec.
- [ ] Replace semiosys' standalone `_variables.scss` with references to
      `--ss-color-*` tokens from `12-lexicon/`.
- [ ] Switch vite entry from `dashboard.scss` to `index.scss`.
- [ ] Delete legacy `semiosys/src/semiosys_static/scss/{components,
      layout,_variables.scss,_base.scss,_layout.scss,dashboard.scss}`
      once nothing references them.

#### Phase 6 — Step C (ssx & stylescape release, backlog)

- [ ] **`ssx`**: keep `layers.md`, `folder_structure.md`,
      `component_blueprint.md`, `component_checklist.md`, `prefix.md` as
      the spec; tag `v1.0.0` once Phase 5 Step B ships.
- [ ] **`stylescape`**: bump `VERSION` and changelog; publish migration
      notes for downstream consumers; tag `v1.0.0`.
- [ ] **`semiosys`**: bump `stylescape` peer dep to `^1.0.0`.

---

## 6. Acceptance Criteria

A migration step is **done** only when all of the following hold:

- `src/scss/index.scss` imports tiers in strict numeric order, with no glob
  imports and no references to legacy folders.
- Every module under `31-modules/` matches the blueprint, dependency direction
  is enforced, and `_index.scss` is the only public surface.
- All public class names match the prefix convention (`ss-c-*`, `ss-o-*`,
  `ss-u-*`); state uses `is-*` / `has-*`; variants use `data-*`.
- No layer references a higher layer (no upward dependencies).
- `poetry`/`npm` test suites and `check_scss_coverage.mjs` pass.
- Semiosys consumes the framework via the documented entry point and
  contributes no rules outside its own override slice.

---

## 7. Governance

- Spec authority: [`ssx/`](../ssx) — cannot be overridden by implementation.
- Implementation authority: this repository.
- Consumer authority: [`semiosys/`](../semiosys) — must follow both.

> Structure is strict. Styling is flexible. No layer may violate its mandate.
