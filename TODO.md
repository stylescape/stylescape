# stylescape TODO

## Open (2026-10-09, from the sturnia/sturnus demo theming rollout)

Gaps the fleet agents worked around while moving every demo onto stylescape. The worst ones were fixed in 0.5.0 (see CHANGELOG); these remain:

- [ ] `ss-c-map` themes Leaflet and MapLibre/Mapbox chrome only; OpenLayers, Google Maps and ArcGIS controls keep their own look.
- [ ] Toasts in the top-right region cover the app-shell header controls; offset the region by the header height inside `ss-l-app`.
- [ ] No app-shell variant where the whole document scrolls (scroll-driven players need it); no 5- or 6-cell `ss-l-viewport-grid` preset.
- [ ] `ss-c-form` styles any `div:has(> label)` as a field in the components layer, which beats `ss-l-grid` on hand-built forms.
- [ ] `ss-l-app__sidebar` has no inner padding; content needs its own (`ss-u-p-4`).
- [ ] `ss-c-segmented` has no link variant; no solid/dark `ss-c-badge`; a badge inside `ss-c-card__tag` draws two borders.
- [ ] `ss-c-search-bar` needs `__input` on its input or the icon overlaps the text; `ss-c-form__field--inline` needs the label first and help text outside the row.
- [ ] Compat/parity shims still carry hex colours for `ss-c-prose` (also unsets h2/h3 sizes), `ss-c-blockquote`, `ss-c-hero` (min-height 100vh), `ss-c-cta`, a second `ss-c-timeline` set and `ss-c-stat-card__value`.
- [ ] `ss-c-description-list--divided` looks misaligned in the stacked layout.
- [ ] `ss-u-gap-N` counts 1/16 rem steps (`gap-8` is 0.5rem), unlike the `--ss-space-*` scale; document it or align it.
- [ ] `ss-c-modal` has no backdrop pattern of its own, and the modal and toast demo pages use inline styles and `__container` classes that do not exist.
- [ ] No status-dot variant for "unknown/not checked".

## Open (2026-10-08, after implementing everything below)

Everything below is ticked except the npm republish, which is outward-facing and waits for the maintainer. These came up while implementing it:

- [ ] Publish: push a version tag so the tag-only workflow releases 0.5.0 to npm (also covers "Republish stylescape" below).
- [ ] One downstream app still imports 0.3 paths (`pkg:stylescape/scss/dev`, `scss/variables`, `scss/mixins/head_frame/frame_base`) that 0.4 does not have, so it cannot move to unit.gl 0.3.5 until it migrates to 0.4 (or a 0.3.19 hides `round-to`). A downstream 0.4 theme compiles cleanly against this tree and unit.gl 0.3.5.
- [ ] ssx repo: the spec (`spec/ssx.json`) has no `ss.compat` layer, so the three compat shims get no layer rules. Add the layer there.
- [ ] `npm run lint:ssx` still reports 18 errors outside the baseline, all in files from the 2026-10-07 consistency pass (abbreviation mixins, spacer, accordion, select, toggle, graphic, divider, choice, chip). Fix or re-baseline them deliberately.
- [ ] The Jinja layer in `src/templates/stylescape/` was rendered with Python Jinja2 and real Django forms, but not yet inside a sturnus Jinja2 backend. Try it in `sturnus-demo`, then move the sturnia and sturnus demo shells onto it (see `doc/demo_theming.md`).
- [ ] `.config-templates/eslint.config.js` (fleet-synced) still imports `eslint-plugin-import`; update it in the control plane to `eslint-plugin-import-x`.

## From a downstream app (2026-10-07)

Found while working on a downstream app, which works around some of these in its own repos.

- [x] `scss/index.scss` forwards both `dev` (which forwards `pkg:unit.gl`) and `functions`, which define `round-to`. With `unit.gl` 0.3.5 (which added its own `round-to`) every consumer fails: "Two forwarded modules both define a function named round-to". Hide `round-to` in one of the two forwards. `unit.gl` 0.3.4 is broken on its own ("no such file or directory" from Sass). The downstream app pins `unit.gl` to 0.3.3 until this is released.
  - 2026-10-08 (unit.gl sweep): the published stylescape 0.4.1 `src/scss/index.scss` compiles without errors against unit.gl 0.3.5 and against unit.gl `dev` (the coming 0.3.6), and so does this repo's working tree. The clash looks fixed as of 0.4.1. Since verified: a downstream 0.4 theme compiles cleanly against this tree and unit.gl 0.3.5.

- [ ] Republish stylescape so downstream apps pick up the Dart Sass 3 deprecation fixes (see `CHANGELOG.md`, Unreleased → Fixed).

## From a downstream theme demo (2026-10-08)

Found in stylescape 0.4.1 while building a downstream theme and its demo of every app screen. The theme works around each of these (see its `src/scss/theme/`); fixing them here lets the workaround go.

- [x] Dark mode does not work: `33-overrides/_dark.scss` redeclares only `--ss-color-surface` and `--ss-color-text-primary`, and does so inside `@layer ss.overrides`, which loses to the unlayered light tokens on `:root` in `12-lexicon/_color-tokens.scss`. Declare the full neutral set (background, surfaces, fill, text, muted, lines, borders, progress track, …) for `[data-theme="dark"]` outside the layer, after the light set.
- [x] `.ss-c-card` gets `background-color: #fff` from the utilities layer, which overrides the component's own `var(--ss-card-bg, var(--ss-color-surface))`, so cards stay white in dark mode.
- [x] The page-hero module hides `.ss-c-ribbon__menu` (and `.ribbon__menu`) globally with `visibility: hidden; display: none`, not scoped to the hero.
- [x] `.ss-c-tooltip[tooltip-data]::before` hard-codes `border-radius: 0.375rem` instead of reading `--ss-radius-*`, so a square theme cannot square it with tokens.
- [x] The reset leaves body text and form controls at `line-height: 1.15` (cramped for reading, and it clips descenders in the 2.5rem fields) and paragraphs without a bottom margin.
- [x] `.ss-c-form__field__input` fixes `height: 2.5rem`, which also flattens a `textarea` with that class to one line and ignores `rows`.
- [x] The status palette makes success (`#5192c8`) and info (`#6a8dca`) nearly the same blue, and warning/error are pastel (about 3:1 against white, below AA for text and for white text on them).
- [x] The 0.3 class names (`.button`, `.badge`, `.card--header`/`--body`, `.ribbon--top`, `.ribbon__title`, `.ribbon__button`, `.flipper--left`, `.tooltip` with `tooltip-data`, …) have no rules in 0.4, and `32-utilities/_legacy-components-compat.scss` covers none of them; consumers on 0.3 markup lose their buttons, badges and ribbon layout. Either extend the compat layer or document the gap in the 0.4 migration notes.

## From the demo-site accessibility and consistency pass (2026-10-07/08)

Every demo page now passes axe (WCAG 2.2 AA) in light and dark; see `CHANGELOG.md` → Unreleased. Nothing from this pass is committed yet. What's left:

### Release

- [x] Commit the pass (shell, tokens, dark theme, `ss.compat` layer, module SCSS, demo templates, `src/html/img/` placeholders and `src/html/media/` samples) and bump the version. Downstream sites will see visible changes: darker accent and status colours, square buttons, components overriding the compat shims, and z-index moves. These are listed in the CHANGELOG.

### Compat shims: class-name clashes (need a per-site decision)

Since components now override `ss.compat`, these shim rules no longer take effect where a module defines the same class. Scope each one to its site (for example `.ss-c-header .ss-c-dropdown`) or rename it at the source site, then regenerate with `bin/gen_scapepress_parity.py`.

- [x] `.ss-c-dropdown`: the scape_press nav panel in `_scapepress-parity.scss` (absolute, `min-width: q(448)`, white). The dropdown module resets those properties.
- [x] `.ss-c-stack`: geoid_org's column stack; the module is an overlapping stack.
- [x] `.ss-c-stats`: inthecity's `width:100%; max-width:1024px` stretches the stats box.
- [x] `.ss-c-stat__value`: Georgia and `#000` in parity; now overridden by the module.
- [x] `.ss-c-product-card` is defined in both shims with conflicting designs (parity drops the bottom border at ≥48rem).
- [x] `.ss-c-flipper` (flip-card rules in `_legacy-components-compat.scss`) collides with the flipper module; scope it to `.ss-c-flipper-card`.
- [x] `.ss-c-frame_main__area--top` (parity) hard-codes `rgba(255,255,255,.8)`, which shows as a light bar in dark mode.
- [x] `.ss-c-text-markup` (`_legacy-components-compat.scss`) paints a highlight behind whole blocks. It looks like a leftover; remove it or keep it?
- [x] `ssx.config.json` still says the shims are `ss.overrides`. The component shims are now `ss.compat` and `_legacy-compat.scss` is `ss.utilities`. Update the config, and check that the SSX spec knows the `ss.compat` layer.

### Classes used by demos that have no CSS (design needed; nothing invented)

- [x] Text-indent utilities: `21-typography/text/indent/_text-indent.output.scss` emits an empty layer, though the `text_indent--*` mixins exist. Needs a naming decision (`ss-text-indent-*` vs SSX `ss-t-`).
- [x] Drop cap variants: `ss-c-dropcap--boxed`, `--circle`, `--outlined`, `--gradient`, `--serif`.
- [x] List group: `ss-c-list-group--horizontal`, `--flush`, and `li[data-marker]` (type-list-special page).
- [x] Image compare: `ImageCompareSlider.ts` has behaviour but no module SCSS, and it looks for the unprefixed `.image__compare`. Add a 31-modules/image-compare module.
- [x] Chat speed-dial `ss-c-fab*` / `ss-c-irobin`; switch/slider `.ss-c-switch` / `.ss-c-slider`; tags-list demo uses the shim's `ss-c-tags__*` rather than the module's `ss-c-tags-list__item`.

### Design decisions

- [x] `.ss-t-overline` is defined three times (lined, style, caption "eyebrow"); the merged result is a tiny uppercase eyebrow with a line above it.
- [x] `--ss-color-line` and `--ss-color-line-secondary` are both `#cccccc`, so "thin" and standard dividers look the same.
- [x] `html` line-height is 1.15 and `body` inherits it, so plain `div` text in demos is cramped. Consider `body { line-height: var(--ss-line-height-base) }` (affects every consumer).
- [x] `12-lexicon/tokens/body_organisms/_ribbon.scss` still defines and uses the legacy `--color_fill_primary`.

### JS behaviour bugs (src/ts)

- [x] `Preloader` adds `preloader--hidden`, which has no CSS. The preloader module now styles `.ss-c-preloader_hidden`; align the default `hiddenClass` (this is an API change).
- [x] `ResponsiveMenuManager` sets `role="navigation"` on the `<ul>` itself (`ResponsiveMenuManager.ts:299`).
- [x] `LazyLoadManager` expects a selector string; the ts_media lazy image never swaps in its `data-src`.
- [x] `Countdown.ts:67` sets `aria-label` on a role-less `<span>` (the demo adds `role="img"` as a workaround).

### Upstream: hue.gl

Resolved in stylescape: the `--color_*` tokens are generated in `12-lexicon/color/`, not by hue.gl (see CHANGELOG → Fixed).

- [x] hue.gl's dark palette leaves `--color_fill_secondary` / `--color_fill_tertiary` light, and there is no `[data-theme=light]` block for the `--color_*` tokens. Stylescape works around this with `--ss-color-*`; fix it in hue.gl.

### Demo site and tooling

- [x] 10 hand-written pages in `src/html/31-modules/` (`box-2`, `button-2`, `carousel-2/-3`, `dropdown-2`, `input-2/-3`, `label-2`, `modal-2`, `vcard-2`) have no Jinja source and aren't in the navigation. Port or delete them.
- [x] The YouTube/Vimeo embeds on `31-modules/video` use a `VIDEO_ID` placeholder: pick real ids or drop the embeds.
- [x] `ss-c-preview_code` / `_color` give each snippet `range(1000, 9999) | random` ids, so every build churns all of `src/html/`. Make the ids deterministic.
- [x] `npm run lint` fails: `eslint.config.js` imports `eslint-config-prettier`, which isn't in devDependencies.
- [x] `npm run lint:ssx` / stylelint need the sibling `ssx` repo (`node_modules/@stylescape/ssx` links to `../../../ssx`, which isn't checked out).
- [x] Remaining literal font sizes in module configs (`q(n)`) could map to `--ss-font-size-*` where they equal a scale step. A lint rule for raw colours, radii, shadows, durations and z-index in `31-modules/` would keep the token conversion from drifting back.

## From the sturnia and sturnus demo survey (2026-10-08)

Goal: use stylescape as the single theme for every sturnia (TypeScript, 55 repos) and sturnus (Django, 120 repos) demo. Survey of the demos under each repo's `exe/` folder; counts are approximate.

State today:

- sturnia: 46 repos have demos. Each ships its own copy of a "Swiss typography" shell from `sturnia-base/exe/demo.scss`, plus inline styles. No CSS framework. 22 repos list stylescape as a dependency; only `sturnia-spatial` imports it, via the published `@starling-cloud/stylescape-starling` theme. Its `exe/index.html` gallery (`ss-app`, `ss-topnav`, `ss-toolbar`, `ss-overlay-panel`, `ss-sidebar`, …) is the closest existing reference for a stylescape demo shell.
- sturnus: 119 demo projects share `sturnus.demo.settings` and the Jinja2 backend, but none of the 72 `demo_app/base.html.jinja` files extend a shared base. Bootstrap 5.3 from jsdelivr is the de facto theme in about 54 repos. `sturnus-style` is the only shared layout layer and still loads stylescape 0.3.18 from unpkg with 0.3 class names (`ribbon--top`, `frame_main__area--top`, `.button`).
- About 145 SCSS entry points across sturnus (`exe/demo_static/scss/index.scss`, `src/static/scss/index.scss`) have `@use "pkg:stylescape/scss/index.scss"` commented out, citing missing `./scss` exports and undeclared `unit.gl`/`hue.gl`. That reason is stale: published 0.4.1 has both the exports and the dependencies. Reactivating the imports needs a test run, not a fix here.

### Blockers before new components

- [x] Dark mode (see "From a downstream theme demo" above). 24 sturnia demos are dark; nothing can switch themes until the full neutral set is declared for `[data-theme="dark"]`.
- [x] 0.3 to 0.4 class names (same section). Either extend `32-utilities/_legacy-components-compat.scss` or migrate `sturnus-style` to 0.4 and have the sturnus demos extend it.
- [x] Decide the split: primitives below go in stylescape core; the Starling brand goes in `stylescape-starling`; the demo shells themselves (gallery page, nav between demos) become importable packages in `sturnia-base` and `sturnus-demo`.

### Layout (mainly sturnia tool demos)

- [x] App shell: full-height header + sidebar + main viewport, with tokens for header height and sidebar width. Needed by spatial, solid, node, show, capture and every sturnus dashboard.
- [x] Split pane / resizable sidebar with a drag handle, plus a `SplitPaneManager` in `src/ts`. Needed by solid (`ifc.html`), spatial (12 pages), node, socket, viewcube. Nothing in stylescape handles resize today.
- [x] Viewport grid (2x2 and 1+3) for multi-camera and multi-map pages: solid, spatial.
- [x] Overlay panel anchored to a corner of a canvas, map or 3D view, translucent surface, stacked icon buttons: spatial, solid, viewcube, timeline.
- [x] Bottom sheet and dock edges: layout, puck.
- [x] Dashboard grid: area, semantics, accounts, news, status, admin.
- [x] Demo gallery landing: numbered card with tags, section header with count, back link. `section-header` and `card` exist; this is variants plus a page template.

### Form controls

- [x] Switch. The `toggle` module only styles pressed buttons: socket, capture, control, saver.
- [x] Segmented control: puck, keyboard, saver, show.
- [x] Range with value readout: cursor, spatial, saver, plot, and 37 sturnus repos.
- [x] Color input and swatch: cursor, spatial, legend, plot.
- [x] Number/stepper input and date input: survey, area, time.
- [x] Control group row / property inspector (label + control grid): control, cursor, keyboard, saver, timeline.
- [x] Search bar and filter bar: 31 and 14 sturnus repos, plus context and tokens.
- [x] Drop zone with drag-over state. `file-input` exists but has no drop surface: solid, maps, survey, ocr.
- [x] Django form conventions matching Django's rendered markup: field error, help text, `non_field_errors`, fieldset, formset. Used in 47 sturnus repos.

### Data display

- [x] Event log / console with timestamped entries (`log-entry`, `log-time`, `log-type`): 12 sturnia repos.
- [x] Key-value readout / description list: spatial, machine, viewcube, timeline, puck.
- [x] Status dot and status bar. `indicator` exists; add the bar: socket, saver, duck, control, spatial.
- [x] Tree view with a `TreeViewManager`: solid, sturnus admin, finder.
- [x] Sortable table header: storage, repo, metadata, survey, plot.
- [x] Empty state. Only present in the compat shims today; used in 32 sturnus repos.
- [x] Skeleton loader for htmx swaps: htmx, contacts, survey, pipeline.
- [x] Legend swatch list: legend, spatial, plot, solid.
- [x] Chart container with size variants and attached legend: plot (101 pages), graph, legend, analytics.
- [x] Calendar month grid: calendar, publish, content, time.
- [x] Gantt / horizontal track timeline. The `timeline` module is a vertical story timeline: area, repo, project, chunks, sturnia-timeline.
- [x] Shortcut list (kbd + description rows): show, keyboard, puck, command.
- [x] Image compare module for the existing `ImageCompareSlider.ts` (also listed above).

### Feedback and overlays

- [x] Context menu container with a `ContextMenuManager`: cursor, puck.
- [x] Django messages pattern mapped onto `alert` and `toast`: 34 sturnus repos.
- [x] htmx indicator and fragment styles (`hx-indicator`, `.htmx-request`): 7 repos.
- [x] Theme toggle control. `ThemeToggler.ts` exists but has no markup or module.

### Jinja layer (sturnus only, in `src/jinja`)

- [x] Base template with the sturnus-style block names (`title`, `content`, `extra_head`, `extra_scripts`, `breadcrumbs`, `page_actions`, `sidebar_left`, `sidebar_right`).
- [x] Page templates for list, detail, form and delete-confirm; these are the four most common sturnus templates (over 100 each).
- [x] Macros: form field, pagination, breadcrumb, table list, page header with actions, messages.
- [x] Auth page set (login, register, password reset, activation) for accounts and admin.
- [x] Django admin skin: tokens and overrides, plus the stats, count, chart and recent-activity widgets `sturnus-admin` already ships.

### Domain host containers (style only; the libraries render the content)

- [x] 3D viewport frame with loading state: solid, viewcube, panorama, maps, tiles.
- [x] Map frame. `map` exists; add Leaflet and MapLibre control overrides so their chrome follows the tokens: 11 sturnus repos and 4 sturnia repos.
- [x] API explorer embed (GraphiQL, Swagger): rest, stac, graphql, geoparquet, bim.
- [x] Commerce set (pricing table, cart, checkout, order summary): payments, shop, product, subscriptions.
- [x] Comments and threads: news, policy, social, semantics.

### Not planned

- Bootstrap compatibility mapping. The 54 sturnus repos on Bootstrap should migrate to a shared base template, not keep two class vocabularies.
- Aliases for the ad-hoc variables the demos invented (`--primary`, `--gray-500`, `--spacing-md`, `--radius-sm`). Migrate the demos to `--ss-*` tokens instead.

Suggested order: dark mode and 0.4 compat; app shell with split pane and overlay panel (unblocks the largest sturnia demos); switch, segmented, range readout, event log and key-value (covers most remaining sturnia pages); then the Jinja layer and Django form conventions for sturnus.
