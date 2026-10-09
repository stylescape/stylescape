# Changelog

All notable changes to this project will be documented in this file.

The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

Target: `v1.0.0` — cross-repo alignment with
[SSX v1.0](https://github.com/stylescape/ssx) and
[Semiosys v1.0](https://github.com/stylescape/semiosys).

## [0.5.0] - 2026-10-08

Stylescape as the single theme for the sturnia and sturnus demos: app and tool
layouts, form, data-display and feedback components, a Jinja2 layer for Django,
working dark mode, and 0.3 class-name compatibility. Not yet published to npm.

### Breaking

- `Preloader` adds `ss-c-preloader--hidden` by default (was
  `preloader--hidden`, which had no CSS). Pass `hiddenClass` or
  `data-ss-preloader-hidden-class` to keep the old class.
  `PRELOADER_HIDDEN_CLASS` is exported.
- The lined `.ss-t-overline` is now `.ss-t-overline-rule` (`-rule-alt`);
  `.ss-t-overline` is only the caption eyebrow. `.ss-c-text-markup` is removed.
- `ImageCompareSliderOptions` drops the unused `sliderClass`, `overlayClass`,
  `touch`, `showLabels`, `beforeLabel` and `afterLabel` fields.
- The `indicator` config map is populated (was `()`); an override with an empty
  map breaks.

### Changed — demo theming (visible to every theme and site)

- **Status colours differ by hue.** Success, warning and error move to hue.gl's
  green `N1505`, amber `N0605` and red `N0305`, in the same muted chroma band
  as the accent; info stays indigo `N2705`. Success and info used to be two
  near-equal blues, and warning and error two pastel purples. Light values are
  still darkened to WCAG AA by `ensure-contrast()`.
- **Theme entry points.** `data-theme="auto"` follows `prefers-color-scheme`;
  `data-theme="light"` re-declares the light tokens, so a light island works
  inside a dark page. Pages without the attribute stay light. This applies to
  the `--ss-color-*` set and the legacy `--color_*` set. Dark mode also gains
  `--ss-color-accent-highlight` and `-tertiary`.
- **Readable text by default.** `body` takes `--ss-line-height-base` (1.5;
  `html` keeps normalize's 1.15), form controls `--ss-line-height-tight` (1.25;
  1.15 clipped descenders in the 40px fields), and paragraphs get a bottom
  margin of the new `--ss-paragraph-spacing` token, except the last one in a
  box. Components set their own margins in later layers, so only bare text
  changes.
- `--ss-color-line-secondary` is a quieter divider than `--ss-color-line`
  (#e5e5e5 vs #cccccc; dark #2a2a2a vs #3d3d3d); they were identical.
- The ribbon reads `--ss-color-text-primary` and `--ss-color-background`
  instead of the legacy `--color_text_primary` and `--color_fill_primary`.
- **Module literals became tokens.** 214 hex fallbacks inside `var()` are gone
  (every one named a token defined at `:root`), looping animations read the new
  `--ss-duration-loop-fast/-loop/-loop-slow` (800/1400/2000 ms), the cookie
  banner uses `--ss-z-toast`, preloader delays derive from `--ss-duration-100`,
  the live headline badge derives from `--ss-color-error`, and button and
  preview font sizes read `--ss-font-size-*`.
- **Compat shims that reused module class names are scoped to their site or
  dropped:** dropdown, stack, stats, stat, product-card, flipper, ribbon__menu
  (it hid every ribbon menu), card (it forced `#fff` in dark mode) and
  filter-bar. The scape_agency frame bars follow the theme.
  `bin/gen_scapepress_parity.py --postprocess-only` re-applies these decisions.
- `ImageCompareSlider` uses the `ss-c-image-compare` classes and still accepts
  `.image__compare`; its handle is a keyboard slider and the position lives in
  `--ss-image-compare-position`.
- `.ss-c-form__label` inherits colour and size (the shim gave it a fixed 14px
  and `#2d2d2d`, which stayed dark in the dark theme).
- Range tracks use `--ss-color-border` (the old colour was nearly invisible in
  dark mode).
- Demo snippet ids are deterministic, so rebuilds no longer churn `src/html/`.
  The ten orphaned hand-written `*-2`/`*-3` module pages and the placeholder
  YouTube and Vimeo embeds are removed.
- `ssx.config.json` puts the component shims in `ss.compat` and
  `_legacy-compat.scss` in `ss.utilities`.

### Changed — consistency (visible to every theme and site)

- **Components win over the compat shims.** The component shims
  `_scapepress-parity.scss` and `_legacy-components-compat.scss` now emit into
  a new `@layer ss.compat`, declared before `ss.components`; the utility
  aliases in `_legacy-compat.scss` move to `ss.utilities`. The parity shim used
  to sit in `ss.utilities`, and the two legacy shims in an undeclared
  `ss.ss-c-utilities` layer (a prefix-migration slip) that beat every declared
  layer, including utilities and overrides. Where a shim restyled a module's
  class (button, card, alert, textarea, toast, modal, dropdown, …), the
  module's own styles now apply; shim-only classes are unaffected. Sites that
  relied on a shim's look for a module class will see the module's design
  instead. `bin/gen_scapepress_parity.py` emits the new layer.
- **Form controls are square and share one height scale.** Buttons and file
  inputs drop their 2px radius (inputs, selects and textareas were already
  square), and buttons take the input heights via `min-block-size` (xs 24 / sm
  32 / md 40 / lg 48 / xl 56), so a button lines up with the field beside it.
- Component SCSS reads tokens instead of literals throughout: colours
  (`--ss-color-*`), radii (`--ss-radius-*`; containers `md`, modal `lg`,
  controls 0), shadows (`--ss-a-shadow-*`; dropdown/popover `md`, toast `lg`,
  modal `xl`), motion (`--ss-duration-*`/`--ss-ease-*`) and layering
  (`--ss-z-*`; tooltip 1100 → 1070, toast 1200 → 1080, popover 1050 → 1060,
  sidebar control 99999 → 200). Visible results: panels gain the container
  radius; card parts are spaced; button-group, join and file inputs are square;
  the ribbon, rail and ticker read `--ss-color-*` (in dark mode the bar is
  #f2f2f2 and rails #111); stat values use the page font and text colour;
  inline `code` is monospace (`--font-family-mono` was undefined).
- Bare `input`/`select`/`textarea` keep a `--ss-color-border-strong` boundary
  (zero specificity) instead of none (WCAG 1.4.11).
- New modifiers for classes the demos already used: breadcrumb separators and
  sizes, divider thickness/vertical variants, accordion `--bordered`/
  `--filled`, chip status/`--outline`, card `--interactive`, select sizes and
  `[multiple]`, tooltip `--static`, `.ss-t-char-lowercase/-capitalize`.
- Fixed: the `abbr` tooltip (it rendered invisible text inline), steps
  connectors, toggle-button pressed state, table stripes, the drop cap size,
  and the stack demo's lower layers.
- `.ss-c-object--corner--50` is now `50%` (it was `--ss-radius-sm`), and the
  `rounded--*` fallbacks match the radius scale.
- **One focus ring.** A `:focus-visible` rule in `ss.reset`, and the focus
  styles of button, input/textarea, checkbox, radio, toggle, range, file input,
  close and menu item, all read `--ss-focus-ring-width/-color/ -offset` (they
  used five different colours, and fields a faint 25% halo).

### Changed — accessibility (visible to every theme and site)

- **Colour tokens now live in `@layer ss.lexicon`.** They were emitted
  unlayered at `:root`, and unlayered declarations beat every layer, so the
  `ss.overrides` dark theme could never apply. Themes that override
  `--ss-color-*` unlayered, or in a later layer, keep winning; a theme that set
  them inside a layer _before_ `ss.lexicon` no longer does.
- **Light-theme colour values darkened to meet WCAG AA (4.5:1).**
  `--ss-color-accent`, `-link`, `-link-active`, `-link-visited`, `-focus`,
  `-state-active`, `-state-link` and `-success|warning|error|info` keep their
  hue but are darkened just enough to reach AA on white and the light gray
  surfaces (down to `--ss-color-surface-1`) and to carry white text (accent
  `#3696c1` → `rgb(40 113 146)`). `-link-hover` and `-state-hover` now go
  darker (`#346a85`) rather than paler. `--ss-color-muted` `#a0a0a0` →
  `#707070` (AA on `-surface-alt` too).
- **Complete dark theme.** `33-overrides/_dark.scss` redefines every surface,
  text, line, status and code token (it previously set two), and restores the
  original brighter hues with near-black `--ss-color-on-*` text, since those
  pass on dark surfaces.
- Inline `code` reads `--ss-color-text` / `--ss-color-surface-muted` instead of
  hue.gl's `--color_fill_secondary`, which stays light in hue.gl's dark
  palette.
- New `--ss-color-border-strong` token (≥ 3:1, WCAG 1.4.11) for the boundaries
  of inputs, checkboxes, radios, file inputs and toggle tracks, which used the
  decorative `--ss-color-border` (#ccc, 1.6:1).
- Unclassed links inside running text (`p`, `li`, `td`, `blockquote`, …,
  outside `nav`) are underlined so they don't rely on colour (WCAG 1.4.1).
- `mark` / `.ss-t-highlight` text uses `--ss-color-on-warning`.
- Close button glyph is a `currentColor` mask (it rendered black in dark).
- Theme-aware colours in place of hard-coded ones: list-group variants (`on-*`
  tokens), headline meta text, inverted pull-quote text, bottom-nav active item
  (text colour + accent bar), and in the compat shims: card, caption, stat
  value, pill, footer links, chat timestamps, `.ss-c-dim` (opacity 0.5 → 0.6).
- Rating stars keep ≥ 24 px spacing (WCAG 2.5.8).
- On viewports ≤ 48em an open sidebar menu overlays the content instead of
  squeezing it (WCAG 1.4.10).
- Ribbon buttons have a 24 × 24 px minimum target (WCAG 2.5.8).
- Tickers also pause while focused, so keyboard users can stop them.

### Added

- `TabManager` (`data-ss="tabs"`): WAI-ARIA tabs for `ss-c-tab`. It pairs tabs
  and panels through `aria-controls` or `data-ss-tab`/`data-ss-tab-panel`,
  hides inactive panels with `hidden`, keeps `aria-selected`, roving `tabindex`
  and `ss-c-tab__item--active` in sync, supports Arrow keys, Home and End, and
  fires `ss:tab-change`. The tab demo page uses it (it had an inline `openCity`
  script).
- `DropdownManager` (`data-ss="dropdown-menu"`): menu-button behaviour for
  `ss-c-dropdown` (toggle, `aria-expanded`, Escape with focus return, outside
  click, arrow keys); a native `<details class="ss-c-dropdown">` gets the same
  closing behaviour.
- Toggle buttons: `ss-c-button[aria-pressed="true"]` shows the on state.
- `ss-c-overlay-panel--wide`, `ss-l-app__content--wide|--full`,
  `ss-c-pagination--center`, `ss-c-dropdown--end`, and native
  `<details class="ss-c-dropdown">` support.
- Utilities: `ss-u-max-w-prose|sm|md|lg` and `ss-u-list-none`.
- `css/_index.scss` in the package, so the plain Sass CLI resolves
  `@use "stylescape/css"` like bundlers do.

- Text colour utilities
  `ss-a-text-primary|secondary|muted|accent|success|warning|error|info|inherit`
  and sizing utilities `ss-u-w-full|w-auto|max-w-full|min-w-0|h-full|h-auto`,
  the targets for converting Bootstrap's `text-muted`, `w-100` and friends.
- `ss-l-app__content`: the centred reading column inside the app shell
  (`--ss-app-content-width`). The gallery page template uses it, and it no
  longer carries inline styles.

- **App and demo layouts:** `ss-l-app` (header, left/right sidebars, a main
  viewport that can host a full-bleed canvas or map, status bar; sized by
  `--ss-app-*`; sidebars overlay below `md`), `ss-l-viewport-grid` (1, 2h, 2v,
  2x2, 1+3) and `ss-l-dashboard` (auto-fill widget grid whose spans never
  overflow). Their paint lives in `24-appearance/_layout-surfaces.scss`.
- **Panels:** `ss-c-split` with `SplitPaneManager` (accessible separator: drag,
  arrows, Home/End, Enter to collapse, limits, optional persistence),
  `ss-c-overlay-panel` (corner/edge panels and stacked controls over a map or
  3D view), `ss-c-sheet` with `SheetManager` (bottom sheet and dock edges, also
  toggles app-shell sidebars), and `ss-c-theme-toggle`.
- Card gallery parts (`--numbered`, `__number`, `__title`, `__tags`/`__tag`,
  `__link`) and a `pages/gallery.html.jinja` demo landing template.
- **Form controls:** `ss-c-switch` (native `role="switch"`; the legacy
  `ss-c-switch > input + ss-c-slider` markup renders, and
  `input[type=range].ss-c-slider` aliases `ss-c-range`), `ss-c-segmented`,
  `ss-c-range-field` with `RangeOutputManager`, `ss-c-color-input`/`-field` and
  `ss-c-swatch-list`, `ss-c-stepper` with `NumberStepperManager`,
  `ss-c-control-grid` (property inspector) and `ss-c-control-row`,
  `ss-c-search-bar`, `ss-c-filter-bar`, and `ss-c-dropzone` with
  `DropZoneManager` (drag-over/invalid states, `accept`/`multiple`/size checks,
  `ss:dropzone:*` events).
- **Django forms:** `<form class="ss-c-form">{{ form }}</form>` styles Django's
  default markup; explicit `ss-c-form__errors` (`--nonfield`), `__fieldset`,
  `__legend`, `__choices`, `__formset` and `__field--inline`/`--invalid`.
- **Data display:** `ss-c-log`, `ss-c-description-list`, `ss-c-tree` with
  `TreeViewManager` (WAI-ARIA tree), `ss-c-empty-state` (takes over the shim
  class), `ss-c-skeleton`, `ss-c-legend`, `ss-c-chart` and `ss-c-chart-grid`,
  `ss-c-calendar`, `ss-c-gantt`, `ss-c-shortcut-list` and `ss-c-image-compare`.
  `indicator` adds `ss-c-status-dot` and `ss-c-status-bar`; `table` adds
  sortable headers (`ss-c-table__sort`, `aria-sort`) with `TableSortManager`,
  and `__cell--numeric`.
- **Overlays and feedback:** `ss-c-context-menu` with `ContextMenuManager`
  (right click, Shift+F10/ContextMenu key, viewport-aware, type-ahead),
  `ss-c-messages` for Django messages (alert and toast take Django's
  `level_tag`; `--debug` added to both, `--error` to toast), an `htmx` module
  (`.htmx-indicator`, `.htmx-request`, busy submits, `ss-c-fragment`
  transitions), and `ss-c-fab` speed dial with `FabManager`. The old
  `ss-c-irobin`/`icon_swap` glyph classes alias the swap module.
- **Host frames:** `ss-c-viewport` (3D/panorama with loading, progress and
  error states), `ss-c-api-explorer` (GraphiQL, Swagger UI), and `ss-c-map` now
  themes Leaflet and MapLibre/Mapbox controls, popups, attribution and scale,
  including dark mode.
- **Commerce and community:** `ss-c-pricing`, `ss-c-cart`, `ss-c-checkout`,
  `ss-c-order-summary`, `ss-c-comment`/`ss-c-comments`, `ss-c-title-bar` and
  `ss-c-auth`.
- **Jinja2 templates for Django/sturnus** in `src/templates/stylescape/`: a
  base page on `ss-l-app`, list/detail/form/confirm-delete pages, form,
  formset, pagination, breadcrumb, table, page-header and messages macros, and
  the auth pages. They ship in the package; see `doc/demo_theming.md`.
- `src/scss/django-admin.scss` builds `css/django-admin.css`: Django admin
  variables mapped to stylescape tokens (light and dark) plus the sturnus-admin
  dashboard widgets.
- **0.3 class-name compatibility:** `32-utilities/_legacy-v03-compat.scss`
  styles the unprefixed 0.3 names (`.button`, `.badge`, `.ribbon--top`,
  `frame_main`, …) through the 0.4 mixins in `ss.compat` (opt out with
  `$v03-compat: false`). See `doc/migration-0.4.md`.
- Typography and module gaps: `ss-t-indent-*` utilities; dropcap
  `--boxed/--circle/--outlined/--gradient/--serif`; list-group
  `li[data-marker]` and a working `--horizontal`.
- Registry entries for `data-ss` auto-init: `split-pane`, `sheet`, `tree`,
  `table-sort`, `range-output`, `stepper`, `dropzone`, `fab`, `lazy` and
  `context-menu`; the `theme-toggle` entry binds the element itself.
- `npm run lint:styles` runs stylelint with the SSX config. It flags hex
  colours, z-index of 10 or more and literal durations in modules; the modules
  are clean. `doc/demo_theming.md` records what lives in stylescape, the brand
  theme and the demo shells.

- `ensure-contrast($color, $background, $min-ratio)` Sass function: shifts a
  colour's lightness, keeping its hue, until it reaches the ratio.
- `GridManager` keeps `aria-pressed` on toggle buttons in sync and sizes any
  `[data-grid]` layer (previously only `.guide--layer`); `AsideHandler` keeps
  `aria-expanded` on its switch in sync.
- `CodeBlockFormatter.formatAll()` gives horizontally scrolling code blocks a
  tab stop so they can be scrolled by keyboard.

### Fixed

- A closed `<dialog class="ss-c-modal">` stayed visible (`display: flex`).
- `ss-t-bold` (and `strong`/`b`) reset `color` and `text-decoration`, so a bold
  link lost its link colour; bold now sets only weight, style and size.
- `ss-c-stat__label` had no grid slot; it is the caption under the value.
- Bare `ss-c-stat` cards side by side drew a divider; dividers now only appear
  inside the `ss-c-stats` group.
- `ss-c-radio__label` took a fixed dark grey from a compat shim (unreadable in
  dark mode); it inherits the text colour.
- The progress track used the surface colour, invisible on panels; it uses
  `--ss-color-surface-1`. `ss-c-progress__bar--success|warning|error|info`
  colour the bar (a shim version read undefined variables).
- A theme island (`data-theme` on an element) now also takes the matching text
  colour instead of inheriting the surrounding theme's.
- The legacy `.active` utility (utilities layer) recoloured stylescape
  components that toggle `.active`; it no longer applies to `ss-c-*` elements.
- `<code>` inside a link takes the link colour (it failed contrast in dark mode).
- `ss-c-input-group`: buttons and addons keep their own width.
- `ss-c-log--follow` keeps a short log at the top; an empty log keeps a body.
- `ss-c-alert` with a title stacks title and body.
- `ss-c-panel__header` lays out a heading plus actions.
- Links in an active `ss-c-list-group__item` take its text colour.
- Table header cells follow the table's start alignment.
- Fixed-column grids (`ss-l-grid-2` to `-6`) collapse on small screens: 3 to 6
  columns become two below `md`, all become one below `sm`.
- `ss-c-nav--vertical` stacks its `ss-c-nav__list`.
- `ss-c-auth` inside the app shell no longer claims a full viewport height.
- `ss-l-app__fill` no longer forces `display: block` (a grid or split can fill
  the bleed area).

- **Nested stacks kept the wrong spacing.** `ss-f-stack` spaced children with
  `margin` on `> * + *`, reading `--ss-f-stack-gap` on the child, so a nested
  `ss-f-stack-xs` also shrank the gap above itself. The stack now uses flex
  `gap`, declared on the stack, with `--ss-f-stack-gap` defaulting to
  `--ss-vspace-md`.
- A heading inside `ss-c-panel__header` takes the header's size instead of
  rendering at page-heading size.
- Auto-init logged to the console on every page; its messages now only appear
  with `setDebug(true)`.

- `ThemeToggler` drives buttons (`aria-pressed`) as well as checkboxes,
  supports a light/dark/auto cycle (`data-theme-cycle`), resolves `"auto"`,
  keeps every control in sync, survives blocked storage, and initialises when
  called after `load` (the registry handler never fired before).
- `ResponsiveMenuManager` puts `role="navigation"` on the menu's container, not
  on the `<ul>`, and only when there is no `<nav>` ancestor.
- `LazyLoadManager` accepts an element, NodeList, array or selector; supports
  `data-srcset`, background images, `loadedClass`/`onLoad` and `destroy()`.
- `Countdown` labels its container as `role="timer"` instead of putting
  `aria-label` on role-less spans.
- Legacy `--color_fill_secondary`/`--color_fill_tertiary` stayed light in dark
  mode, and the dark `--25/--50/--75` tints were computed from the light
  palette. Tints now mix toward the scheme's own page fill. (Filed as a hue.gl
  issue, but the tokens are generated in `12-lexicon/color/`.)
- `.ss-c-form__field__input` no longer flattens textareas (`min-block-size`
  instead of `height`).
- The menu item focus ring was invalid CSS (an unevaluated `q()` inside a
  `var()` fallback), so focused menu items showed no outline. The ribbon logo
  link gets a 24px target (WCAG 2.5.8).
- `npm run lint` runs again: added `eslint-config-prettier` and `globals`,
  replaced `eslint-plugin-import` (ESLint ≤ 9) with `eslint-plugin-import-x`,
  and ignored `.config-templates/`. Stylelint is now a devDependency.
- Demo markup: the ts_animations progress bars and preloader, and the ts_mouse
  drag and sortable lists, have valid roles. Every demo page passes axe (WCAG
  2.2 AA) in light and dark.

- `ActiveLinkHighlighter` no longer marks in-page `#…` links as the current
  page (it coloured every placeholder link, hiding current pagination and menu
  items), and sets `aria-current="page"` on real matches.
- `ScrollToTopButton` leaves the tab order while `aria-hidden`.
- `DragAndDropManager` only gives a drop zone `role="list"` while it holds
  draggable list items.
- Demo shell: skip link, labelled landmarks, working dark-mode and grid toggles
  (`ss-c-demo__skip-link`, `ss-c-demo__guide`), theme persisted across pages,
  local placeholder images replacing dead external services.
- Sass deprecation warnings that break under Dart Sass 3 (reported from the
  build of a downstream theme): the three `if()` zero-pad calls
  (`32-utilities/_legacy-compat.scss`, `_legacy-components-compat.scss`) became
  `$n: "#{$i}"; @if $i < 10 { $n: "0#{$i}"; }`, which works on every Dart Sass
  version, unlike the new CSS `if()` syntax; `23-layout/_breakpoints.scss` now
  uses `sass:map`/`sass:list` (`map.get`, `map.keys`, `list.index`,
  `list.length`, `list.nth`) and `_legacy-compat.scss` uses `map.get`. No other
  deprecated globals, slash division or `@import` remain in `src/scss`.
  Verified: `npm run build` went from 10 deprecation warnings to 0; the built
  `stylescape.css`/`.min.css` and a plain `sass` compile are byte-identical
  before and after; all four breakpoint mixins give identical output; vitest
  passes (814). That theme, compiled against local source, has 0 warnings
  (was 5) and byte-identical CSS.

---

## [0.4.0] - 2026-08-11

Merges the `new` branch — the layered-architecture rewrite — into `dev`, on top
of the `0.3.12`–`0.3.18` maintenance line. **This release is breaking for every
theme and site that consumes the core.**

### Breaking

- **SCSS entry layout replaced.** `src/scss/` is now numbered by cascade layer
  (`01-core` → `11-reset` → `12-lexicon` → `13-rhythm` → `21-typography` →
  `22-flow` → `23-layout` → `24-appearance` → `31-modules` → `32-utilities` →
  `33-overrides`, plus `91-development`). The old `classes/`, `variables/`,
  `mixins/`, `functions/`, `maps/`, `root/`, `tags/` and `dev/` trees, and
  `icons.scss`, are gone.
- **Class names follow the SSX prefix taxonomy.** Chrome and components emit
  `ss-c-`, with `ss-u-`, `ss-a-`, `ss-l-`, `ss-t-` and `ss-f-` for utilities,
  appearance, layout, typography and flow. Consumers still on unprefixed legacy
  selectors must migrate; the `32-utilities/` compat shims cover the common
  cases.
- **`package.json` `exports` rewritten.** The eight stale `./scss/<dir>`
  subpaths (`classes`, `dev`, `functions`, `maps`, `mixins`, `root`, `tags`,
  `variables`) and `./scss/icons` all pointed at directories that no longer
  exist. They are replaced by a single `./scss/*` pattern that resolves any
  cascade layer, e.g. `stylescape/scss/31-modules`.
- **Colour tokens are emitted as `--ss-color-*`** at `:root` from
  `12-lexicon/_color-tokens.scss`; module configs read them via `var()` rather
  than hard-coded values.

### Added

- `31-modules/button/_button.output.scss`: short-form size aliases
  (`--xs/--sm/--md/--lg/--xl`) and the spelled-out `--small`/`--large` variants
  are now first-class selectors, comma-grouped with the canonical `--size-*`
  form. Downstream templates that adopted the shorter names (notably semiosys,
  with 46 `.ss-c-button--small` hits) no longer need rewriting at upgrade time.
- `31-modules/badge/_badge.config.scss` + `_badge.output.scss`: added `info`
  and `danger` color variants. `--danger` is an alias for `--error` to keep
  semantic naming consistent with the alert and button modules. `--info` uses
  the existing `--ss-color-info` / `--ss-color-on-info` tokens.

### Changed

- `01-core/_prefix.scss`: governance comment now cites the canonical spec path
  (`ssx/doc/naming.md`) instead of the legacy `ssx/prefix.md` that never
  existed. The six-prefix taxonomy (`ss-c-`, `ss-u-`, `ss-a-`, `ss-l-`,
  `ss-t-`, `ss-f-`) is now the explicit contract.
- `01-core/_layers.scss`: each step of the 10-step conceptual progression is
  annotated with its `@layer ss.<layer>` and `ss-<x>-*` prefix, so the cascade
  hierarchy and the public class API are visible side-by-side.
- `01-core/_external.scss`: corrected drifted `unit.gl/scss/` import paths to
  `unit.gl/src/scss/` (matches the current `unit.gl@0.3.3` package layout).
  Without this fix, plain-sass compilation of the entry point could not resolve
  `unit.gl` partials.
- `hue.gl` moved to `^0.1.2`.
- `@getkist/action-tsup` pinned to the published `^1.0.7`, replacing the local
  `file:` link carried on the `new` branch.
- Regenerated `package-lock.json` against the merged manifest. The stale lock
  pinned `typescript-eslint` to `8.58.2`, which could not satisfy the `^8.59.3`
  manifest range — this is why `npm install` previously failed. A clean install
  now resolves (see Known issues).

### Removed

- `move.gl` dependency. It was already commented out in
  `01-core/_external.scss` and referenced nowhere else.
- `src/scss/dev/_wrapper.scss`. It existed to break a circular
  `$transition-default` dependency between the old `dev` and `variables`
  modules; neither module survives the restructure.
- `$ss-prefix-object` (`ss-o-`) Sass constant. Per the SSX `v1.0` deprecation,
  layout abstractions now emit under `ss-f-` (Flow) or `ss-l-` (Layout), and
  the _variation_ dimension is captured by `data-*` variants. The constant had
  zero references across `src/scss/` and no selectors with the `.ss-o-*` prefix
  are emitted.

### Documentation

- Replaced the ~700-line migration log in `ROADMAP.md` with a forward-looking
  plan organised by phase (A–F). The completed Phase 0–5 migration work is
  preserved in a brief "Completed Work" section; git history remains the
  canonical detail.
- ROADMAP Phase C inventory: documented the real `semiosys/src/static/` path
  (the legacy roadmap quoted a stale `semiosys_static/` location) and surfaced
  the `--small`/`--size-sm` modifier drift between semiosys templates and
  stylescape `31-modules/`.

### Fixed

- `npm install` resolves again on a clean checkout.
  `eslint-plugin-import@2.32.0` declares no ESLint 10 peer range, which broke
  the bare `npm install` the publish workflow runs after deleting the lockfile.
  An `overrides` entry now maps the plugin's `eslint` dependency to the root
  spec (`$eslint`), so no `--legacy-peer-deps` flag is needed anywhere. Revert
  the override once upstream ships ESLint 10 support.

### Known issues

- `npm run lint` does not run: `eslint.config.js` imports
  `eslint-config-prettier` and `globals`, and the `format` script needs
  `prettier`, but none are declared in `devDependencies`. Pre-existing on
  `dev`, not introduced by this release.
- Re-rendering `src/html/` mints fresh random `code-snippet-*` IDs on every
  build, so a no-op build still dirties ~141 files. Discard that churn rather
  than committing it.

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
