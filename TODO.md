# stylescape TODO

Completed items are moved to `CHANGELOG.md`.

## Open (2026-10-09, from the sturnia/sturnus demo theming rollout)

Gaps the fleet agents worked around while moving every demo onto stylescape. The worst ones were fixed in 0.5.0, and more under Unreleased (see CHANGELOG); these remain:

- [ ] `ss-c-map` themes Leaflet and MapLibre/Mapbox chrome only; OpenLayers, Google Maps and ArcGIS controls keep their own look.
- [ ] `ss-l-app__sidebar` has no inner padding; content needs its own (`ss-u-p-4`). Adding a default would double the padding of every sidebar that already sets one, so decide between a default and a `--padded` modifier.
- [ ] `ss-c-segmented` has no link variant (segments as `<a>` for navigation). No solid/dark `ss-c-badge` either; note (2026-10-09): the default badge is already solid `--ss-color-foreground`, so this may mean a brand theme's outlined default. Confirm what is missing.
- [ ] Compat/parity shims still carry hex colours for `ss-c-prose` (also unsets h2/h3 sizes), `ss-c-blockquote`, `ss-c-hero` (min-height 100vh), `ss-c-cta`, a second `ss-c-timeline` set and `ss-c-stat-card__value`.

## Open (2026-10-08)

- [ ] One downstream app still imports 0.3 paths (`pkg:stylescape/scss/dev`, `scss/variables`, `scss/mixins/head_frame/frame_base`) that 0.4 does not have, so it cannot move to unit.gl 0.3.5 until it migrates to 0.4 (or a 0.3.19 hides `round-to`). A downstream 0.4 theme compiles cleanly against this tree and unit.gl 0.3.5.
- [ ] ssx repo: the spec (`spec/ssx.json`) has no `ss.compat` layer, so the three compat shims get no layer rules. Add the layer there.
- [ ] Underscore part names that SSX reads as separate components (`ss-c-accordion_group`, `ss-c-graphic_no-margins`, `ss-c-spacer_divider`, `ss-c-toggle_button_group`) and the 0.3 `ss-c-error`/`ss-c-success` state classes on `ss-c-select`: baselined in `ssx-baseline.json` on 2026-10-09. Rename them to BEM parts (with compat aliases) if SSX conformance should cover them. Note (2026-10-09): an uncommitted ribbon change from another session adds 3 new `cross-component` errors in `_ribbon.output.scss`.
- [ ] `NotificationManager` builds `ss-notification`, `__title`, `__close`, `__progress` elements that no module styles. Point it at `ss-c-toast` and its parts (`__content`, `__title`, `__actions`, `__close`) and add a progress part if needed.
- [ ] The Jinja layer in `src/templates/stylescape/` was rendered with Python Jinja2 and real Django forms, but not yet inside a sturnus Jinja2 backend. Try it in `sturnus-demo`, then move the sturnia and sturnus demo shells onto it (see `doc/demo_theming.md`).
- [ ] `.config-templates/eslint.config.js` (fleet-synced) still imports `eslint-plugin-import`; update it in the control plane to `eslint-plugin-import-x`.
- [ ] About 145 sturnus SCSS entry points (`exe/demo_static/scss/index.scss`, `src/static/scss/index.scss`) have `@use "pkg:stylescape/scss/index.scss"` commented out, citing missing `./scss` exports and undeclared `unit.gl`/`hue.gl`. That reason is stale (0.4.1 has both); reactivating the imports needs a test run in those repos.

## Not planned

- Bootstrap compatibility mapping. The 54 sturnus repos on Bootstrap should migrate to a shared base template, not keep two class vocabularies.
- Aliases for the ad-hoc variables the demos invented (`--primary`, `--gray-500`, `--spacing-md`, `--radius-sm`). Migrate the demos to `--ss-*` tokens instead.
