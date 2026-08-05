# Stylescape ↔ Stylescape-Starling Parity Report

Generated: 2026-07-30
**A** = `stylescape` (`stylescape/stylescape`, v0.3.11)
**B** = `stylescape-starling` (`stylescape-themes/stylescape-starling`, `@starling-cloud/stylescape-starling` v0.2.9)

## Verdict

**These are not two configurations of one design system. They are two independent
systems that share a vendor prefix.**

Of 6,529 distinct emitted class names across both codebases, exactly **2 appear in
both**: `is-active` and `is-open` — generic state hooks neither system owns.
Jaccard similarity **0.03%**.

The cause is structural and total: A puts a mandatory one-letter ITCSS layer segment
after the prefix (`ss-c-`, `ss-u-`, `ss-l-`, `ss-t-`, `ss-a-`, `ss-f-`) on **98.6%**
of its surface. B uses that segment **zero times**, going straight from `ss-` to the
block name.

Yet the two model largely the *same concepts*: reducing B's classes to BEM stems and
testing each against A's namespaces, **138 of 198 stems (69.7%) have an A counterpart
exactly one layer-letter away** — `.ss-btn`↔`.ss-c-button`, `.ss-p-4`↔`.ss-u-p-4`,
`.ss-sr-only`↔`.ss-u-sr-only`. So the divergence is nearly all *naming*, not concept.

B declares the split deliberately: `B/src/scss/index.scss:26-29` states the upstream
`stylescape` package is intentionally not imported and is no longer a dependency of
any entry. `B/package.json` has no `dependencies` at all.

| Dimension | A | B |
|---|---:|---:|
| SCSS source files | 767 | 77 |
| Emitted classes | 6,208 | 323 |
| `:root` custom properties | 807 | 304 |
| of which `--ss-*` | 263 | 80 |
| Cascade layers | 10 (`ss.reset`…`ss.overrides`) | **none** |
| Units | rem via unit.gl `q()` | raw `px` |

---

## 1. Class surface

Both sides measured from **compiled CSS** (A: existing `dist/css/stylescape.css`;
B: compiled fresh from `src/scss/index.scss` with dart-sass, exit 0).

| Prefix | A | % | B | % |
|---|---:|---:|---:|---:|
| `.ss-c-*` components | 5,186 | 83.5% | 0 | 0% |
| `.ss-u-*` utilities | 553 | 8.9% | 0 | 0% |
| `.ss-t-*` type | 154 | 2.5% | 0 | 0% |
| `.ss-a-*` appearance | 105 | 1.7% | 0 | 0% |
| `.ss-l-*` layout | 81 | 1.3% | 0 | 0% |
| `.ss-f-*` flow | 45 | 0.7% | 0 | 0% |
| **any layer segment** | **6,124** | **98.6%** | **0** | **0%** |
| flat `.ss-<name>` | — | — | 314 | 97.2% |
| non-`ss-` | 32 | 0.5% | 9 | 2.8% |

⚠️ **44.2% of A's emitted surface (2,746 classes) comes from two generated shim
files** — `32-utilities/_scapepress-parity.scss` (31,560 lines) and
`_legacy-components-compat.scss`. These are legacy site selectors mechanically
re-prefixed. The rename was a blind find/replace and visibly corrupted non-selector
text: a doc comment reads `@link https://scape.ss-c-style`, and the emitted cascade
layer is literally named `ss.ss-c-utilities`. Classes such as
`.ss-c-robin_2024_section1_title_1`, `.ss-c-mapboxgl-popup`, `.ss-c-swiper-slide`
are in the shipped CSS. **A's real curated surface is closer to ~3,460 classes.**

**60 of B's stems have no A counterpart at any prefix**, notably the whole
`ss-map-*` widget family, `ss-viewer-*`, `ss-panel`, `ss-state`, `ss-topnav`/
`ss-subnav`, `ss-menu-item`, `ss-landing`, and spacing steps 3/5/7.

---

## 2. Design tokens

**The one point of full agreement is the hue.gl palette.** All 225 swatches match
value-for-value in the same family order, zero mismatches — A as hue.gl N-codes
(`--N2405: #3696c1`), B renamed to family-shade (`--hue-blue-5`). Neither side
imports hue.gl any more; both froze a generated copy
(`A/src/scss/12-lexicon/color/_palette.scss`, `B/src/scss/tokens/_hue.scss:2`).

Above that palette the semantic layers barely overlap:

| | Count |
|---|---:|
| `--ss-*` names shared | 34 |
| …of which **same value** | 15 |
| …of which **different value** | **19** |
| A-only `--ss-*` | 229 |
| B-only `--ss-*` | 46 |

Name-level Jaccard on the `--ss-*` surface: **11%**.

### The 19 silent traps — same name, different value

| Token | A | B |
|---|---|---|
| `--ss-color-accent` | `#3696c1` (blue) | `#3e3e3e` (grey) |
| `--ss-color-success` | `#5192c8` (**blue**) | `#4d6b46` (**green**) |
| `--ss-color-error` | `#b577ac` (mauve) | `#885464` (red) |
| `--ss-color-info` | `#6a8dca` | `#346a85` |
| `--ss-color-border` | `#cccccc` | `#e2e2e2` |
| `--ss-color-muted` | `#a0a0a0` | `#777777` |
| `--ss-space-8` | **32px** | **40px** |
| `--ss-leading-tight` / `-loose` | 1.2 / 2 | 1.25 / 1.7 |
| `--ss-tracking-tight/wide/wider` | −0.025 / 0.025 / 0.05em | −0.02 / 0.02 / 0.06em |
| `--ss-z-dropdown/popover/modal/toast` | 1000 / 1060 / 1050 / 1080 | 200 / 300 / 400 / 500 |

Two of these are more than cosmetic:

- **`--ss-space-8` breaks linearity.** A's `--ss-space-N` is strictly `4 × N`;
  B's ramp jumps at step 7 (7=32, 8=40, 9=48, 10=64). Markup using
  `var(--ss-space-8)` renders **32px under A, 40px under B**.
- **Z-order inverts.** A stacks `modal(1050) < popover(1060)`; B stacks
  `popover(300) < modal(400)`. Any element positioned by both systems flips.

### Scale-level divergence

| Scale | A | B |
|---|---|---|
| Spacing | 34-step `--ss-spacing-*` grid + 9-step T-shirt `--ss-space-*` | 11-step `--ss-space-0..10`, non-linear |
| Font size | 14 steps `--ss-font-size-*` (16/12/14/18…128px) | 7 steps `--ss-text-*` (11/12/14/16/20/24/32px) — shifted one step down for xs–lg |
| Font weight | 9 steps (100…900) | 4 steps (400/500/600/700) |
| Families | `--ss-font-family-{sans,serif,slab,mono}` | `--ss-font-{sans,mono,display}` — **zero name overlap** |
| Radius | none/sm/default/md/lg/xl/2xl/3xl/full | 0/sm/md/lg/pill — core steps agree, zero+pill renamed |
| Shadow | 8 steps `--ss-a-shadow-*`, alpha 0.1/0.25 | 4 steps `--ss-shadow-*`, alpha 0.03–0.12 — **zero name or value overlap** |
| Border | 5 `--ss-a-border-width-*` + colour/style | single `--ss-border-width` + composite shorthands — **zero overlap** |
| Duration | numeric (`--ss-duration-150`) | semantic (`--ss-duration-fast`) — no name overlap |
| Breakpoints | Bootstrap ladder (576/768/992/1200/1400) | Tailwind ladder (640/768/1024/1280/1536) — **only `md` agrees** |

B **emits no breakpoint custom property at all** (compile-time SCSS vars only), so a
runtime consumer can read breakpoints from A but not from B.

**A-only concepts with no B analogue:** baseline grid (`--ss-baseline-*`), vertical
rhythm (`--ss-vspace-*`), measure/line-length (`--ss-measure-*`, 45ch/65ch/80ch),
emitted breakpoints, primitive z tier, link/visited state colours, `on-<status>`
contrast pairs, serif and slab stacks.

**B-only concepts with no A analogue:** app-chrome colour slots (`--ss-color-topnav-bg`,
`-subnav-bg`, `-sidebar-bg`), composite border shorthands, `--ss-color-focus-ring`,
`--ss-font-display`.

Naming split of the same concept: B `--ss-color-warn` vs A `--ss-color-warning`;
B toast `--error` vs A toast `--danger`.

---

## 3. Components

B covers **~23 of A's 126 component roots (≈18%)**.

### Shared components with incompatible contracts (migration hazards)

| Component | Hazard |
|---|---|
| **popover** | Same class name, **zero shared elements**. B is dropdown-menu chrome (`__heading`, `__item`, hardcoded `top:100%;right:0`); A is an info panel (`__title`, `__body`, `[data-placement]`, native `[popover]` + `::backdrop`). A port breaks B's markup silently. |
| **toggle** | **Different DOM.** B: `<label class="ss-toggle">` wrapping a hidden input **plus a sibling `.ss-toggle-track`**. A: `.ss-c-toggle` applied **directly to the `<input>`**, knob via `::after`. Not swappable. |
| **card** | Only `__body`/`__footer` common. B has `__title/__number/__tag/__link`; A has `__header/__image` + `-group`/`-deck` and uses `[data-variant]` where B uses `--numbered`. |
| **table** | B's row hover is **unconditional**; A gates it behind `--hover`. Behavioural, not additive. |
| **badge** | B defaults to **pill**; A defaults to square. A straight class swap changes appearance. B-only `--neutral`. |
| **toast** | B `--warn`/`--error` vs A `--warning`/`--danger`. A's `[data-position]` region is strictly better than B's hardcoded top-right stack. |

Where APIs are merely additive, **A is a superset**: button (12 variants + 5 sizes +
state modifiers vs B's 5+2), input (size + validity states B lacks), nav
(`--vertical`, `__link`, navbar slots).

### In B, missing from A — upstream candidates

> **Status update (2026-07-30):** the 10 generic components below have since been
> **ported into A** as full modules under `31-modules/` (`state`, `panel`,
> `toolbar`, `overlay`, `code-block`, `menu-item`, `section-header`,
> `section-title`, `choice`, `subnav`, `brand` — 11 directories). Only the three
> app-specific ones (`landing`, `viewer`, `widget-map`) remain unported by
> decision. See §8.

Ranked most-generic first:

| Component | Why it's a gap |
|---|---|
| **state** (`.ss-state` + `--error/--empty/--inline`) | A has skeletons and preloaders but **no unified empty/error/loading block**. Highest value. |
| **panel** (`__header/__body/__footer`) | A's `.ss-c-box` is surface-only; `.ss-c-card` is a content card. No plain panel primitive. |
| **toolbar** | Exists in A's dist but only via a utilities layer, not as a module. |
| **overlay** (click-through floating host) | No A equivalent. |
| **code-block** | A has typographic `.ss-t-paragraph--code` only, not a block component. |
| **menu-item** | A scatters this across sidebar/nav/dropdown; no standalone primitive. |
| **section-header / section-title** | Only exist in A's site CSS, outside `ss.components`. |
| **widget-map** (~9 `.ss-map-*` families, 10.8 KB) | A's `map` module is a 3-class stub. |
| **viewer** (7 classes) | Canvas/WebGL kit, no A equivalent. |
| `.ss-choice`, `.ss-subnav`, `.ss-brand` | Trivial, absent from A. |

**B has no modal/dialog, dropdown, or tooltip at all** — `.ss-popover` does
double duty (stated in `_popover.scss:1-18`).

A's ~100 uncovered modules cluster in: overlays/disclosure, navigation
(breadcrumb/pagination/tab/steps), feedback (alert/progress/validation), media
(image/gallery/carousel/video), and the editorial vocabulary (dropcap/pull-quote/
timeline/vcard).

---

## 4. Layout & base/reset

**Not the same model renamed — complementary models.** Zero shared class names.
A is a document/page-skeleton system; B is an app-shell/dashboard chrome system.

| B primitive | A equivalent | Verdict |
|---|---|---|
| `.ss-app` (grid `auto 1fr`, modifier columns) | `.ss-l-frame` (fixed 3×3 named areas) | Both 100vh grids, **not interchangeable** |
| `.ss-layout` + `__header/__main/__footer` | `.ss-l-page-standard` | Same model; A binds to `> header/main/footer` **elements**, B to BEM slots. B's `__main` owns the scroll; A's doesn't. |
| `.ss-sidebar` (3-slot chrome column) | `.ss-c-sidebar` (collapsible **disclosure tree**) | **No behavioural overlap** |
| `.ss-sidebar--rail` (56px icon column) | `.ss-c-rail` (**scroll container with hidden scrollbars**) | **Name collision, opposite meaning** |
| `.ss-split` (equal-fraction panes, hairline dividers) | `.ss-f-split` (`justify-content:space-between`) | **False friend** — genuinely absent from A |
| `.ss-stack` | `.ss-f-stack` / `.ss-l-vstack` | Same model (owl-margin vs `gap`) |
| `.ss-grid-cols-N` | `.ss-l-grid-N` | A superset, but **B collapses to 1fr under 768px and A never collapses** |
| — | `.ss-l-container`, `-region`, `-columns`, `-article`, `-canvas`, `-interface` | A-only |

**B has zero media queries in `layout/` and `base/`** — the shell is desktop-only by
construction. A's layout layer has exactly one (`.ss-l-page-holy-grail` at 768px).

### Reset — behavioural differences that matter

| Concern | A | B |
|---|---|---|
| Universal margin zeroing | targeted only | `* { margin:0; padding:0 }` — nukes `dl/blockquote/figure/table` too |
| `<a>` default | reset **then re-styled** by the typography layer | `color:inherit; text-decoration:none`, **never re-styled** — all links render as body text |
| Form appearance | reset only; visual treatment lives in modules | **the reset paints them** (surface bg, border, radius, padding) |
| Vendor form normalization | full normalize.css surface (`::-moz-focus-inner`, spin buttons, `[type=search]`, `progress`, `fieldset`…) | **none** |
| Focus | never kills outline; opt-in `.ss-u-focus-ring` + 13 `:focus-visible` component rules | ⚠️ **`input,select,textarea:focus { outline:none }`** replaced only by a 1px border-colour change — likely fails WCAG 2.4.11/2.4.13 |
| Scrollbar theming | none | full cross-browser themed thin scrollbar |
| `prefers-reduced-motion` | global blanket in `33-overrides/_compatibility.scss:71-80` | **none**, despite motion tokens and animated spinner/toast |
| Print | `@media print` + 10 print utilities | **none** |
| `color-scheme` | **absent** | **absent** — gap in **both**; native scrollbars/controls stay light under dark theme |
| Blanket transition | ⚠️ `transition: all .2s` on **every `<button>`** (`tags/_forms.scss:110-114`) | none |

### Typography

A ships 236 files / 154 `.ss-t-*` classes (drop caps, pull quotes, standfirst,
byline, legal, display scale 1-6, measure, small-caps, emphasis marks, four
underline styles, multi-column). B ships one 63-line element-level file plus 12
utilities.

⚠️ **A's font stack names a font that is never loaded.** `--ss-font-family-sans`
resolves to `"stylescape_sans_regular"`, but the `@font-face` blocks in
`12-lexicon/tokens/soul_type/_font_face.scss:50-111` are **all commented out** —
**verified: `grep -c "@font-face" dist/css/stylescape.css` → 0.** A silently falls
through to `"Roboto Sans", Helvetica, Arial, sans-serif`.

B by contrast self-hosts **FK Grotesk** (8 weights × 2 styles, woff2+woff,
`font-display:swap`, Inter as metric fallback), packaged as plain CSS next to the
binaries so Vite resolves `url()` correctly (`B/src/scss/base/_fonts.scss` is
deliberately empty and says so).

---

## 5. Utilities

**Zero class-name overlap** — all 21 of B's utility names return 0 hits in A's dist.
B's utilities also read tokens A doesn't define (`--ss-color-bg/fg/subtle`,
`--ss-text-*`, `--ss-weight-*`, `--ss-radius-pill`), so B utilities dropped into an
A-only page compute to invalid values.

| Direction | Families |
|---|---|
| **B-only** | text size (`.ss-text-sm`), font weight, text colour (`.ss-text-muted/-subtle/-accent`), `.ss-text-mono`, `.ss-uppercase`, `.ss-grid-auto` (auto-fit minmax) |
| **A-only** (~15 families) | text-align, text-wrap/balance, position, z-index, float/clearfix, visibility, align/place (~40 classes), object-fit, aspect-ratio, 26 cursors, user-select, pointer-events, stretched-link, focus-ring, print, prose |
| Shared concept, renamed | flex, gap, grid, spacing, truncate, sr-only — A is a superset of each |

⚠️ **`.ss-u-text-*` means text-*align* in A but font-*size* in B** — a live footgun
if the two are ever merged.

⚠️ **Spacing keys ≥7 mean different sizes**: `.ss-p-8` = 40px in B,
`.ss-u-p-8` = 32px in A.

---

## 6. Theming / dark mode

**This is the sharpest capability gap, and A's side is broken.**

### B — complete

One `ss-dark-tokens` mixin with **17 overrides**, applied through correct
three-state resolution (`themes/_dark.scss:36,43-45`, `_light.scss:7`):

1. `:root[data-theme="dark"]` — forced dark, wins over OS
2. `:root[data-theme="light"]` — forced light
3. `@media (prefers-color-scheme: dark) { :root:not([data-theme]) }` — OS-follow,
   only when unpinned

The `:not([data-theme])` guard is the correct pattern.

### A — two systems, and the modern one does not work

**A has zero `prefers-color-scheme` rules** (verified: 0 occurrences in
`dist/css/stylescape.css`). **A cannot follow OS dark mode at all.**

A carries two independent dark systems:

| # | Source | Layer | Scope |
|---|---|---|---|
| 1 | `12-lexicon/color/_theme.scss:80-89` | **unlayered** | 140 legacy `--color_*` props |
| 2 | `12-lexicon/tokens/soul_object/_color_theme.scss:77-88` | **unlayered** | **byte-identical duplicate of #1** — dead weight |
| 3 | `33-overrides/_dark.scss:21-27` | **`@layer ss.overrides`** | only 4 `--ss-*` decls |

The modern `--ss-color-*` light defaults are emitted **unlayered** at `:root`
(`_color-tokens.scss` contains no `@layer`), while the dark override sits **inside
`@layer ss.overrides`**. CSS sorts by layer **before** specificity, and unlayered
normal declarations outrank every layer — so the light values win permanently.

**Verified empirically in Chrome** against the live dev server, reading computed
values off `:root`:

| Token | `data-theme` unset | `data-theme="dark"` | Expected dark |
|---|---|---|---|
| `--ss-color-surface` | `#ffffff` | **`#ffffff`** ❌ | `#1c1c1c` |
| `--ss-color-text-primary` | `#000000` | **`#000000`** ❌ | — |
| `--ss-a-shadow-sm` | `…rgb(0 0 0 / 0.1)` | **unchanged** ❌ | — |
| `--color_fill_primary` (legacy) | `#ffffff` | `#000000` ✅ | flips correctly |

**A has no working dark mode for its component layer.** Only the legacy `--color_*`
vocabulary flips — and A's `31-modules` components consume `--ss-color-*`.
Ironically `_dark.scss:7-8`'s own comment claims the layer placement is what makes
it win; the opposite is true.

Coverage, even if the cascade bug were fixed: B overrides 17 tokens (bg, fg, muted,
subtle, border ×2, surface ×3, chrome ×3, accent ×3, focus-ring); A overrides
**2 of ~65** `--ss-color-*`.

### Cascade layers

B uses **no `@layer` anywhere**. Consequences:

- **B alongside A** — every B rule is unlayered and therefore outranks *all* of A
  including `ss.overrides`, regardless of specificity. With near-zero class overlap
  this mostly bites on **element selectors**: B's reset, `_root.scss`, `_typography`,
  `_forms`, `_scrollbar` would silently override A's entire `ss.reset` and
  `ss.typography` layers.
- **Merging B into A** — every B partial needs an explicit `@layer ss.*` wrapper or
  it outranks everything it's merged with.
- **A's own hazard is already realised** — any A file emitting at `:root` without a
  layer is a latent bug of exactly the dark-mode form above.

---

## 7. Vendored `diagrams/` and `pages/`

B vendored these (553 lines) when it dropped the stylescape dependency. They are a
**one-sided fork on a dead branch**, not two files drifting apart: none of the
class names (`graph_axis`, `graph_legend`, `story_content`, `project_item`,
`gallery_item`, `media_figure`, `dataviz`) exist anywhere in A's source, dist, **or
git history**.

A rebuilt equivalents under BEM-ish names during its restructure —
`.story_content*` → `.ss-c-story-card`, `.project_item*` → `.ss-c-press-project`,
`.graph_legend*` → `.ss-c-diagram-legend`, `.graph_tooltip` → `.ss-c-tooltip`. These
are **rewrites, not renames**: no shared selectors or declarations. `.graph_axis` and
`.dataviz` have no A equivalent at all.

`diagrams/_compat.scss` is an explicit shim whose own header calls its
re-implementations "approximations"; `font_size($step)` ignores `$step` entirely and
always returns `--ss-text-md`. Both dirs still use deprecated `@import`.

**Any consumer of B's `./diagrams` or `./pages` exports will never receive A's
updates.** Migration path is markup rewrite.

---

## 8. Actions

### Defects found in A (independent of parity)

| Severity | Issue | Location |
|---|---|---|
| **High** | Dark mode for `--ss-color-*` is **non-functional** — light defaults unlayered beat layered dark overrides. **Verified in browser.** Fix: wrap `_color-tokens.scss` in `@layer ss.lexicon`, or unlayer `_dark.scss` | `12-lexicon/_color-tokens.scss` vs `33-overrides/_dark.scss:20` |
| **High** | No `prefers-color-scheme` support anywhere (0 occurrences) | repo-wide |
| **Medium** | Dark override covers 2 of ~65 `--ss-color-*` tokens | `33-overrides/_dark.scss:22-23` |
| **Medium** | 140-declaration `[data-theme=dark]` block emitted **twice, byte-identical** | `12-lexicon/color/_theme.scss:80` + `tokens/soul_object/_color_theme.scss:77` |
| **Medium** | `--ss-font-family-sans` names a font with no `@font-face` (0 in dist) | `soul_type/_font_face.scss:50-111` |
| **Medium** | 44% of emitted CSS is generated shim; find/replace corrupted a layer name to `ss.ss-c-utilities` and doc URLs to `scape.ss-c-style` | `32-utilities/_scapepress-parity.scss` |
| **Low** | Blanket `transition: all .2s` on every `<button>` | `11-reset/tags/_forms.scss:110-114` |
| **Low** | `.ss-u-cursor--pointer` uses `--` where every other utility uses `-` | `32-utilities/interaction/_cursor.scss:21` |

### Upstream candidates B → A

**Done (2026-07-30)** — ported as `31-modules/` components, each with the
`config`/`mixins`/`output` triplet, emitting into `@layer ss.components`:

| Module | Classes |
|---|---|
| `state` | `.ss-c-state` + `__icon/__title/__message/__action`, `--error/--empty/--inline` |
| `panel` | `.ss-c-panel` + `__header/__body/__footer` |
| `toolbar` | `.ss-c-toolbar` + `--between/--end/--wrap` |
| `overlay` | `.ss-c-overlay` + `__aside(--left/--right)`, `__bottom-center`, `__top-center` |
| `code-block` | `.ss-c-code-block` |
| `menu-item` | `.ss-c-menu-item` + `__icon/__label/__badge`, `.ss-c-menu` |
| `section-header` | `.ss-c-section-header`, `.ss-c-section-count` |
| `section-title` | `.ss-c-section-title` |
| `choice` | `.ss-c-choice` |
| `subnav` | `.ss-c-subnav` |
| `brand` | `.ss-c-brand` |

Starling's token vocabulary was translated to A's, since B's names don't exist
in A: `--ss-color-fg` → `--ss-color-text-primary`, `--ss-color-accent-fg` →
`--ss-color-on-accent`, `--ss-color-focus-ring` → `--ss-color-focus`,
`--ss-radius-pill` → `--ss-radius-full`, `--ss-radius-0` → `--ss-radius-none`,
`--ss-shadow-2` → `--ss-a-shadow-md`, `--ss-ease-standard` → `--ss-ease-in-out`,
`--ss-duration-fast` → `--ss-duration-150`, `--ss-text-*` → `--ss-font-size-*`,
`--ss-weight-*` → `--ss-font-weight-*`, `--ss-font-mono` →
`--ss-font-family-mono`, and B's composite `--ss-border` expanded to
`var(--ss-a-border-width-1) solid var(--ss-color-border)`. Verified: no dangling
`var()` remains in any ported module.

`code-block` deliberately diverges from B: B uses a *light* sunken surface, but
A's reset colours `pre` with `--ss-color-code-foreground` (`#f4f4f4`), so the
module uses A's own `--ss-color-code-background`/`-foreground` dark code surface
instead. A light translation rendered near-white text on light grey.

⚠️ **Two ported names were squatted by the generated shim.** `_scapepress-parity.scss`
defined `.ss-c-menu` (a fullscreen mobile nav at `opacity: 0`) and
`.ss-c-code-block` (legacy site styling) in **`@layer ss.utilities`**, which is
ordered *after* `ss.components` — so the shim silently overrode both new modules
(the menu rendered invisible). Those two top-level blocks were removed (167 lines;
no markup in the repo referenced them, and `gen_scapepress_parity.py` is
documented to skip names that already exist as `.ss-c-{name}` modules, so a regen
reproduces this). Note the generator's comment at `bin/gen_scapepress_parity.py:17-19`
claims modules "win via cascade layer order" — **that is backwards**; `ss.utilities`
comes after `ss.components`, so the skip rule is load-bearing, not belt-and-braces.

**Not ported, by decision:** `landing` (page composition), `viewer` (3D/WebGL
controls), `widget-map` (MapLibre chrome) — app-specific rather than
design-system primitives. A's `map` module remains a 3-class stub.

**Still outstanding:**

1. **Global scrollbar theming** (`base/_scrollbar.scss`) — A has none. Lowest risk, high value.
2. **`.ss-split`** pane grid with hairline dividers — genuinely absent from A.
3. **App-shell grid + `--fullscreen`** chrome-hiding modifier.
4. **Slot-based sidebar/content chrome** where `__body` owns the scroll.
5. **Shipped web font + packaging pattern** — directly fixes A's unloaded font stack.
6. `html, body { height: 100% }`; media reset covering `audio/iframe/embed/object`;
   `--ss-font-display` role token; responsive grid-column collapse.

### Upstream candidates A → B

1. **`prefers-reduced-motion`** blanket — B has motion tokens and animations but no
   reduced-motion path.
2. **Non-destructive focus handling** — fixes B's `outline:none` accessibility
   regression.
3. **Vendor form normalization** — B ships none.
4. **`@layer` architecture** — would fix B's base-beats-components specificity
   conflicts.
5. **Print handling**; breakpoint mixins; container/region/article/measure primitives
   for long-form content; canvas + pointer-transparent interface overlay (directly
   relevant to B's map/3D use case).

### Needed in both

**`color-scheme` declaration.** Both ship dark themes; neither tells the browser, so
native scrollbars, form controls and `<dialog>` stay light under dark theme.

### If convergence is the goal

The mechanical rename rule is:

> `B .ss-<name>` → `A .ss-c-<expanded-name>` (only `btn → button` needs expanding);
> and any B child expressed as a **flat sibling** (`.ss-nav-item`,
> `.ss-list-item`, `.ss-toggle-track`, `.ss-toast-stack`, `.ss-viewer-*`) must
> become a BEM element (`.ss-c-nav__item`, …).

Two secondary rules: normalise `--warn`/`--error` → `--warning`/`--danger`, and
move B's `.ss-page`/`.ss-app`/`.ss-sidebar`/`.ss-split`/`.ss-stack` into the
**layout** layer (`ss-l-`) rather than components.

This covers 69.7% of B's stems. The remaining 30% need real decisions — and the six
same-name/different-contract components in §3 must be resolved explicitly, since a
blind rename would break B's markup silently.

---

## Method & caveats

- **Class counts** are from compiled CSS on both sides (B compiled fresh with
  dart-sass, exit 0), extracted with one shared tokenizer that skips at-rule
  preludes and string literals. Not grep estimates.
- **Token values** cross-checked between compiled CSS and SCSS sources on both sides.
  B's `dist/css/ss.css` is dated 2026-05-30 and current vs its sources.
- **The dark-mode failure was verified empirically** in headless Chrome against the
  running dev server by reading computed `:root` values with and without
  `data-theme="dark"` — not inferred from the cascade rules alone.
- **`--ss-space-{xs,sm,md,lg,…}` are correctly defined** at `:root` (16 definitions,
  `dist/css/stylescape.css:3922+`). An earlier pass flagged these as possibly
  dangling; that was wrong and is corrected here.
- **Not audited:** A's two large compat files (`_scapepress-parity.scss` ~31.5k lines,
  `_legacy-components-compat.scss`) beyond counting their contribution — they
  duplicate some layout/typography behaviour outside the layer architecture and may
  contain further overlaps with B.
- B's `dist/` was not inspected for the reset/base claims; those are source-based.
- Unit mismatch (A's unit.gl `q()` ≈ 0.945px quantum vs B's raw px) must be handled
  explicitly in any port; rem/px normalisation above assumes a 16px root.
