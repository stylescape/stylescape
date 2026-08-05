# Theme Ecosystem Parity Report — what to add to Stylescape

Generated: 2026-07-30
**Core** = `stylescape` v0.3.11 · **Themes** = 22 dirs under `stylescape-themes/`
Companion to [`parity_starling.md`](parity_starling.md), which covers the
starling theme in depth.

## Verdict

**The themes are not a reservoir of missing features.** Core emits 5,482 classes;
the union of all 22 themes is 480, and 16 of the 22 themes are empty or
near-empty. Only **two** themes contain anything substantial, and one of those is
brand-specific.

The valuable finding is not a list of components to copy. It is that **the
theming contract itself is broken — no theme can compile against current core.**
That is what to fix first.

### The landscape

| Category | Themes | Content |
|---|---|---|
| **Substantive** | `starling` (77 scss, 365 classes, 273 props), `vorm` (5 scss, 115 classes) | starling = a full parallel system; vorm = a Dutch civic app, brand-specific |
| **Byte-identical clones** | `geoid`, `kockums`, `matter`, `speckle` | All four SCSS trees identical (same md5). Contribute **0** unique classes — a strict subset of starling. All four still declare `"name": "@starling-cloud/stylescape-starling"` in package.json — four packages colliding on one npm name |
| **Stubs** | `pzh`, `staco`, `vattenfall`, `vorm-kodw` (0-byte `index.scss`), `mesmera` (3 lines), `lovelace` (comments only), `futur` (26 lines), `necron-hicb` (fonts only) | No theming |
| **Empty** | `bioscreen`, `blob`, `blockfoundation`, `dmi`, `necron`, `protoverse`, `suell`, `zoofoo` | Zero SCSS |

---

## 1. The contract is broken (highest priority)

**Verified by compiling against the current working tree with dart-sass 1.99.0.**
Both wiring styles the themes use fail; only the un-configurable form works.

| Form | Used by | Result |
|---|---|---|
| `@import "~stylescape/src/scss/index.scss"` with a pre-set `$font_path` global | geoid, kockums, matter, speckle | ❌ `Error: This module and the new module both define a variable named "$font-path".` |
| `@use "…/index.scss" as * with ($font_path: …)` | futur, vorm | ❌ `Error: This variable was not declared with !default in the @used module.` (exit 65) |
| `@use "…/index.scss" as *` — no configuration | — | ✅ compiles, 1,038,749 bytes |

**Root cause.** `$font_path` *is* declared `!default`
([_font_face.scss:33](../src/scss/12-lexicon/tokens/soul_type/_font_face.scss#L33)),
but core's entry point pulls its layers in with `@use`, not `@forward`
([index.scss:55](../src/scss/index.scss#L55) — `@use "12-lexicon" as *`).
`@use` does not propagate configuration to nested modules, so nothing declared
inside any layer is reachable through the public entry point.

**Core's only usable public API today is "import everything, configure nothing."**
The two themes using the *correct modern syntax* are the ones that hard-fail.

Compounding this: `$font_path` is the **only** knob any theme tries to set, and
it is dead anyway — every `@font-face` in `_font_face.scss` is commented out
(lines 52–112) and `dist/css/stylescape.css` contains **0** `@font-face` rules.

---

## 2. Three "largest gaps" that are actually renames

An automated pass over the theme token surface reported these as core's biggest
holes. **All three are false** — core has the capability under a different name.
Verified by counting definitions in `dist/css/stylescape.css`:

| Reported gap | Reality |
|---|---|
| "Core emits **zero** `--hue-*`; the 225-property tonal palette is the single largest gap" | Core emits **225 `--N####`** properties (hue.gl N-codes) with **byte-identical values**. starling renamed `--N2405` → `--hue-blue-5`. Not a gap — a naming difference |
| "Core emits **zero** `--ss-text-*`; a whole type-scale axis is missing" | Core emits **14 `--ss-font-size-*`** steps vs starling's 7 `--ss-text-*`. Core's scale is *larger* |
| "Core emits **zero** `--ss-shadow-*`; elevation scale missing entirely" | Core emits **10 `--ss-a-shadow-*`**. Not missing |

The lesson generalises: because core inserts an ITCSS layer segment
(`ss-c-`, `ss-u-`, `ss-a-`, `ss-t-`) and themes don't, **almost every apparent
"missing class" is a rename.** starling's 333 classes overlap core's 5,482 by
exactly **3** (`is-active`, `is-open`, `is-collapsed`) — yet ~70% of its stems
have a core counterpart one layer-letter away. Treat any raw name-diff between
these two systems as suspect until checked concept-by-concept.

---

## 3. The 35 five-way-duplicated classes — mostly already covered, mostly dead

`diagrams/` + `pages/` appear in five themes: byte-identical in
geoid/kockums/matter/speckle, and as a cosmetically-drifted fork in starling
(reformatting + a compat shim; **zero declaration changes**).

This looks like strong consensus — 35 classes replicated 5× — but it is
**copy-paste from one source, not five independent votes**, and most of it is
dead:

| Fact | Detail |
|---|---|
| `pages/` never compiles anywhere | `pages/pages.scss` imports only `_accounts.scss`, which is a bare licence header. `_story`, `_project`, `_page_media`, `_page` are imported by nothing — **254 lines and 25 of the 35 classes are unreachable** |
| 7 of 11 files emit no CSS | licence headers, commented-out code, or bare barrels |
| Dependencies are gone | **0 of 21** required mixins/variables (`grid_col_24`, `bleed_reset`, `image_wide`, `font_size()`, `$q`, `$baseline`, …) resolve against core 0.3.x. A verbatim lift is impossible |
| Core already covers most of it | Of 35 classes: **0 exact matches, 24 conceptual-but-rewritten** (`.graph_legend`→`.ss-c-diagram-legend`, `.story_content`→`.ss-c-story-card__content`, `.media_figure`→`.ss-c-figure`, `.gallery_item`→`.ss-c-gallery__item`), **11 genuine gaps** |
| No consumer anywhere | Zero markup references any of the 35 classes across all theme repos |

**Recommendation: delete rather than upstream.** Removing `pages/` from all five
themes drops 291 lines/theme of never-compiled code. Port only the two real gaps
(§4.5).

---

## 4. What to add to core

Ranked by value. Items 1–4 are infrastructure and unblock everything else.

### 4.1 Make the entry point configurable — *blocks all theming*

Change `src/scss/index.scss` from `@use "<layer>" as *` to `@forward`, or add a
thin `_configure.scss`, so `@use "stylescape" with (…)` works at all. Until this
lands, no theme can set a single option.

### 4.2 Define a brand-token contract

Core exposes **535 `!default` variables** and themes override **none** of them —
there is no documented short list to aim at. The 43 brand variables across all
themes overlap core's surface by **zero**.

Naming is per-theme invention with no shared prefix or slot names:
`$starling_color_blue_01`, `$color_01..04`, `$futur_pink`, `$hcib_green`,
`$mesmera_indigo`, `$vorm_color_blue`, `$habitats_color_bee`, `$kow_color_tree`.

Ship a small named set core actually consumes — e.g. `$ss-brand-accent`,
`-accent-fg`, `-surface`, `-text`, `-font-sans`, `-font-mono`, `-font-display` —
declared `!default` and feeding `--ss-color-accent` / `--ss-font-*`.

Also note: **no theme references `--ss-*` at all** (0 hits outside starling).
The modern token layer has zero downstream adoption.

### 4.3 A real font-loading story

Core ships **no web font**: `src/font/` holds only `icongl.*` (an icon font), and
`--ss-font-family-sans` names `"stylescape_sans_regular"`, which is never loaded.
Meanwhile 11 themes ship font binaries, and most are broken:

| Theme | Problem |
|---|---|
| geoid, kockums, speckle | `@font-face` points at remote `font.starling.host`; the 6 local binaries are never referenced. Also a **trailing comma** after the last `format()` → invalid `src` descriptor |
| matter | Declares DIN from the CDN while shipping **Unitext** binaries — declared family never shipped, shipped family never declared |
| necron-hicb | `url()`s point at `static/fonts/`, binaries live in `src/font/` — paths don't resolve |
| vorm-kodw, zoofoo | Binaries shipped, **zero** `@font-face` anywhere |
| staco | Declares a font whose binaries aren't in the repo |
| **starling** | ✅ **The only correct one** — sidecar `fonts.css` colocated with binaries, relative `url()`, exposed as a package subpath export, 12 faces with proper weights + `font-display: swap` |

Adopt starling's sidecar pattern as sanctioned, and ship an
`ss-font-face($family, $path, $weights)` mixin — it would collapse vorm's 56
lines and necron-hicb's 67 lines to ~6 each, and prevent the weight-mapping
errors above. Then either uncomment or delete the dead `_font_face.scss:52-112`
and decide whether `$font_path` is real API.

### 4.4 A token-emit helper

Five themes wrote `--brand-color: $brand-color;` inside `:root` without
interpolation. Sass passes the literal text through, so the shipped CSS is
`--starling_color_blue_01: $starling_color_blue_01` — an invalid token.
**23 broken custom properties across 5 themes, from one missing `#{}`.**

An `ss-emit-tokens($map, $prefix)` helper that interpolates correctly removes the
whole class of error.

### 4.5 Two genuine component gaps

Everything else in the themes is already covered or brand-specific. These two are
real:

| Add | Why |
|---|---|
| `31-modules/chart-axis` — `.ss-c-chart-axis` (+`__tick`, `__label`) | d3 tick-label ellipsis truncation. Non-obvious, brand-neutral, core has nothing (`.ss-c-globe-axis` is unrelated 3D decoration) |
| `.ss-c-tooltip--floating` modifier | Core's tooltip is CSS-only via `[data-placement]`. The d3 pattern — `position:fixed`, `opacity:0`, JS sets coords then fades in — is a distinct mode core lacks |

Worth capturing while there: a series-dimming state for the legend
(`.ss-c-legend-item--muted`, from `.hide_by_legend`) and a hover-fade wide
aspect-box for `31-modules/figure` (from `image_wide` + `transition_hover_opacity`,
used 7× across the legacy `pages/`).

**Explicitly do not port:** `_legend.scss` (core's `.ss-c-diagram-legend` +
`.ss-c-legend-symbol` is richer — 4 symbol variants vs one swatch), `_story.scss`
(superseded by `.ss-c-story-card`), `_project.scss` (superseded by
`.ss-c-project-card` + `.ss-c-gallery`), `_page_media.scss` (superseded by
`.ss-c-figure` with 6 ratio modifiers vs one hard-coded 175%).

### 4.6 A theme scaffold

**24 files are byte-identical across all 13 non-empty themes** (`.babelrc.js`,
`.editorconfig`, `.eslintrc`, `tsconfig.json`, `.devcontainer/*`, `.vscode/*`,
`.github/*`, …), plus ~14 more identical across 9–12. Ship a template with
`src/scss/{_brand.scss,_fonts.scss,index.scss}` and `stylescape` as a **peer**
dependency.

Today the dependency is always a `devDependency`, pinned four different ways —
`^0.0.11`, `^0.0.22`, `^0.3.11`, and a `git+ssh://` URL — and three themes have no
package.json at all. Six themes have a `"build": "webpack --config webpack.config.js"`
script with **no webpack config file present**, which is likely why the broken
wiring went unnoticed.

### 4.7 Finish dark mode

Not a theme finding as such — **no theme works around it because none attempts
dark mode at all** (0 `prefers-color-scheme` hits outside starling). But supplying
a dark palette is the single most common reason to write a theme, and core
currently offers no supported way to do it: its `--ss-color-*` dark override
covers 2 of ~65 tokens and is neutralised by a cascade-layer bug (see
[`parity_starling.md` §6](parity_starling.md)). Fix that before promoting theming.

---

## Method & caveats

- Class and property counts come from parsing compiled CSS on both sides, not
  grep. Core's `dist` was confirmed identical to a fresh compile of `src`
  (0 dist-only, 0 src-only), so it is current.
- The two contract failures in §1 were **reproduced directly** against the
  working tree with dart-sass 1.99.0 + `--pkg-importer=node`, not inferred.
- The three false gaps in §2 were checked by counting definitions in the compiled
  CSS after an automated pass reported them as missing.
- Four themes (geoid/kockums/matter/speckle) are compile-lossy — 20 mixins they
  call no longer exist in core, so stubbing them empties rule bodies and Sass
  drops the empty rules. Their class sets come from a grep union and may
  under-report `&--modifier` concatenation.
- Themes pin core at `^0.0.11`/`^0.0.22`/`^0.3.11`; the `@import` form was
  probably valid against 0.0.x. **The breakage is a core-side regression, not a
  theme authoring error.**
- I did not search outside `stylescape-themes` and the three working dirs for
  markup consumers, so a site repo elsewhere could still reference the legacy
  classes.
