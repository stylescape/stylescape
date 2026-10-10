# Migrating from 0.3

Stylescape 0.4 gives every class a layer prefix (SSX naming, see
[Naming](naming.md)): `ss-c-` components, `ss-l-` layout, `ss-f-` flow,
`ss-u-` utilities, `ss-t-` typography. The unprefixed 0.3 names no longer
have rules of their own.

## The 0.3 compatibility layer

So that 0.3 markup keeps working while it is migrated, core ships
`32-utilities/_legacy-v03-compat.scss`. It styles the 0.3 names with the
0.4 module mixins and tokens (it does not copy 0.3 CSS), so a 0.3 `.button`
looks exactly like a 0.4 `.ss-c-button`, follows the theme tokens and works
in dark mode. It covers every 0.3 class used by the `sturnus-style`
templates and downstream apps. The rules sit in `@layer ss.compat`, below
`ss.components`.

Once your markup uses the `ss-*` names, drop the layer:

```scss
@use "pkg:stylescape/scss" with ($v03-compat: false);
```

See [Build Flags](build_flags.md). The test page
`src/jinja/tests/test_compat_v03.html.jinja` renders the sturnus-style frame
with 0.3 classes only.

Not covered (no 0.4 equivalent, or app-specific): `.page`, `.toc`,
`.figcaption--title`, `.canvas_gradient`, icon font classes (`.i_*`) and
everything that was never a 0.3 rule (`.hover`, `.icon`, bare `.accent`).

## Sass import paths

0.4 reorganised `src/scss` into numbered layer folders, so the 0.3 import
paths are gone. Import the whole package, or one layer:

| 0.3 import | 0.4 |
| --- | --- |
| `pkg:stylescape/scss/index.scss` | `pkg:stylescape/scss` (the package export is `./scss`; the `/index.scss` form does not resolve) |
| `pkg:stylescape/scss/variables` | CSS custom properties in `pkg:stylescape/scss/12-lexicon` (`--ss-*`), or unit.gl's Sass variables from `pkg:unit.gl/variables` |
| `pkg:stylescape/scss/mixins/head_frame/frame_base` | the `ss-l-frame` layout (`pkg:stylescape/scss/23-layout`), or `ss-l-app` for an app shell |
| `pkg:stylescape/scss/dev` | development helpers live in `91-development` and are loaded by tooling only; a downstream app does not import them |

The layer folders `11-reset`, `12-lexicon`, `31-modules` and `32-utilities`
import on their own (checked against unit.gl 0.3.5 and hue.gl 0.1.2); the
`./scss/*` export maps `scss/<folder>` to `src/scss/<folder>/_index.scss`.
`pkg:stylescape/scss/01-core` does not import on its own (its `external` and
`functions` forwards both define `px-to-rem`), so load core through the
entry point.

An app that still imports the 0.3 paths cannot move to unit.gl 0.3.5 (which
hides `round-to`) until it uses the 0.4 entry point; there is no 0.3.19. The
plan for the one known app (kodw-buurtbasis) is to migrate it to 0.4 as part
of the VORM theme rollout. A 0.4 theme compiles against this tree and unit.gl
0.3.5.

## Old → new names

### Frame and layout

| 0.3 | 0.4 |
| --- | --- |
| `frame_main` | `ss-l-frame` |
| `frame_main__area--top` / `--bottom` | `ss-l-frame__area--top` / `--bottom` |
| `frame_main__area--middle_left/center/right` | `ss-l-frame__area--middle_left/center/right` |
| `frame_main__area--background` | (no equivalent; kept by the compat layer) |
| `main_content` | `ss-l-main` |
| `rail` | `ss-c-rail` |
| `sidebar--left` / `sidebar--right` | `ss-c-sidebar ss-c-sidebar--left` / `--right` |
| `sidebar__menu`, `sidebar__control`, `sidebar__content` | `ss-c-sidebar__menu`, `__control`, `__content` |
| `grid__frame--N` | `ss-l-grid ss-l-grid-N` (N = 2–6, 12) |
| `grid--span--col--N` | `ss-u-col-span-N` |
| `grid--span--col--md--N` / `--sm--N` | `ss-u-col-span-md-N` / `ss-u-col-span-sm-N` (0.4 uses min-width breakpoints) |
| `flex--row` | `ss-f-cluster` or `ss-u-flex ss-u-flex-row` |
| `flex--col` | `ss-f-stack` or `ss-u-flex ss-u-flex-col` |
| `flex--wrap` | `ss-u-flex-wrap` |
| `align--start/center/end` | `ss-u-items-start/center/end` |
| `justify--start/center/end/between` | `ss-u-justify-start/center/end/between` |
| `gap--0N` (N × 5 px) | `ss-u-gap-N` (N px, `q(N)`; not the `--ss-spacing-*` scale of `ss-u-p-N`) or `ss-f-cluster-xs…xl` |
| `margin--N_side`, `padding--N_side` (N px) | `ss-u-m*-*` / `ss-u-p*-*` (4 px steps) |
| `aspect_ratio--16x9` | `ss-u-ratio ss-u-ratio-16x9` |
| `visually-hidden` | `ss-u-visually-hidden` |
| `invisible` | `ss-u-hidden` |
| `display_inline-block` | `ss-u-inline-block` |

### Ribbon

| 0.3 | 0.4 |
| --- | --- |
| `ribbon--top/bottom/left/right` | `ss-c-ribbon--top/bottom/left/right` |
| `ribbon--inverted` | `ss-c-ribbon--inverted` |
| `ribbon__slot--horizontal_left/center/right` | `ss-c-ribbon__slot--horizontal_left/center/right` |
| `ribbon__slot--vertical_top/bottom` | `ss-c-ribbon__slot--vertical_top/bottom` |
| `ribbon__title` | `ss-c-ribbon__title` |
| `ribbon__button`, `ribbon_menu_button` | `ss-c-ribbon__button` |
| `ribbon__menu` | `ss-c-ribbon__menu` |
| `ribbon_panel` | `ss-c-ribbon__panel` |

### Components

| 0.3 | 0.4 |
| --- | --- |
| `button` | `ss-c-button` |
| `button--primary/secondary/danger/…`, `button accent`, `button solid` | `ss-c-button--primary/secondary/danger/accent/solid/…` |
| `button--size-sm` | `ss-c-button--sm` |
| `badge` | `ss-c-badge` |
| `badge accent/info/success/warning/error`, `badge--*` | `ss-c-badge--accent/info/success/warning/error` |
| `badge pill`, `badge squared` | `ss-c-badge--pill`, `ss-c-badge--square` |
| `card` | `ss-c-card` |
| `card__header` / `card--header` | `ss-c-card__header` |
| `card__body` / `card--body` | `ss-c-card__body` |
| `card__footer` | `ss-c-card__footer` |
| `flipper--left/right/up/down` | `ss-c-flipper ss-c-flipper--left/right/up/down` |
| `tooltip` with `tooltip-data="…"` | `ss-c-tooltip` with `tooltip-data="…"` |
| `alert`, `alert--warning` | `ss-c-alert`, `ss-c-alert--warning` |
| `divider`, `divider--vertical` | `ss-c-divider`, `ss-c-divider--vertical` |
| `pagination` with `pill` links | `ss-c-pagination` with `ss-c-pagination__item` |
| `modal`, `modal_content`, `modal_header`, `modal_footer` | `ss-c-modal`, `ss-c-modal-content`, `ss-c-modal-header`, `ss-c-modal-footer` |
| `preloader`, `preloader_lines`, `preloader_pulse` | `ss-c-preloader`, `ss-c-preloader__lines` (with `<span>` bars), `ss-c-preloader__pulse` |
| `spinner` | `ss-c-spinner` |
| `input` | `ss-c-input` |
| `checkbox` / `radio` (label wrappers) | `ss-c-checkbox__label` / `ss-c-radio__label` around `ss-c-checkbox` / `ss-c-radio` |
| `table--lined--horizontal` | `ss-c-table` |

### Typography and colour

| 0.3 | 0.4 |
| --- | --- |
| `small` | `<small>` or `ss-t-*` size utilities |
| `character--hyperlink--base` | plain `a` (links inherit the theme) |
| `object--color--fill_primary` | `color: var(--ss-color-background)` |
| `object--fill--accent_secondary` | `background: var(--ss-color-secondary)` |
| `object--corner--pill` | `border-radius: var(--ss-radius-full)` |

## Compat shims that changed meaning in 0.4

The site shims (`_scapepress-parity.scss`, `_legacy-components-compat.scss`)
now sit in `ss.compat`, below the modules. Where a shim used a module's class
name it was scoped to its site or dropped:

| Class | Now |
| --- | --- |
| `ss-c-dropdown` (scape_press nav panel) | only inside `.ss-c-header__primary-item` |
| `ss-c-product-card` (starling_associates row) | only inside `.ss-c-products-container` |
| `ss-c-filter-bar` (scape_ventures portfolio filters) | only on bars holding `.ss-c-filter-btn` buttons |
| `ss-c-filter-bar__label`, `--pills`, `--sm`, … (starling_studio) | only inside `.ss-c-systems-grid-section` |
| `ss-c-flipper` (flip card) | only inside `.ss-c-flipper-card` |
| `ss-c-stack` (geoid_org column stack) | dropped: use `ss-f-stack` |
| `ss-c-stats` (inthecity width) and `ss-c-stat` (kockums value) | dropped: the stat module owns them |
| `ss-c-ribbon__menu` (starling_studio desktop hide) | dropped |
| `ss-c-card` (scape_press service card) | root look comes from the card module; `__icon`, `__title`, `__description` stay |
| `ss-c-text-markup` | removed (no consumer) |
