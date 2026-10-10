# stylescape TODO

Completed items are moved to `CHANGELOG.md`.

## Open (2026-10-10)

Done on 2026-10-10 and moved to `CHANGELOG.md` (Unreleased): sidebar `--padded`, segmented link variant, `ss-c-map` note, compat shims on tokens, `NotificationManager` on `ss-c-toast`, BEM part names with compat aliases, the `ss.compat` layer in the ssx spec, and the Jinja layer check in `sturnus-demo`.

- [ ] `.config-templates/eslint.config.js` now imports `eslint-plugin-import-x`; the fleet copy lives in the `@starling-cloud/agents` control plane and needs the same one-line change (import and the `import` plugin key stay as they are).
- [ ] About 145 sturnus SCSS entry points (`exe/demo_static/scss/index.scss`, `src/static/scss/index.scss`) have `@use "pkg:stylescape/scss/index.scss"` commented out. **Assessed 2026-10-10, not reactivated:** the stated reason is stale (0.5.1 has the `./scss` export, unit.gl and hue.gl), but the commented path is wrong: `pkg:stylescape/scss/index.scss` does not resolve (the export maps `scss/*` to `src/scss/*/_index.scss`); `pkg:stylescape/scss` compiles (1.3 MB of CSS, with unit.gl 0.3.5 and hue.gl 0.1.2). The four entries that are active today (sturnus-audit, sturnus-idml, sturnus-base, sturnus-template) use the broken path. The demos already get stylescape from `sturnus-demo`'s base template (CDN CSS), so compiling it again would load the theme twice. Leave them commented unless a demo needs a stylescape mixin; if so, use `@use "pkg:stylescape/scss" as *;` and stop loading the CDN CSS there.
- [ ] A downstream app (kodw-buurtbasis) still imports 0.3 paths (`pkg:stylescape/scss/dev`, `scss/variables`, `scss/mixins/head_frame/frame_base`), so it cannot move to unit.gl 0.3.5. Decided: migrate it to 0.4 through the VORM theme rollout (no 0.3.19). The path mapping is in `doc/migration-0.4.md`.
- [ ] `pkg:stylescape/scss/01-core` cannot be imported on its own: its `external` forward (unit.gl) and `functions` both define `px-to-rem`. Nothing inside the package imports the index, so only a downstream `@use` of core hits it. Hide one of them in `01-core/_index.scss`.
- [ ] `ssx` lint: three `cross-component` errors in `_ribbon.output.scss` come from an uncommitted ribbon change in another session (not part of this work). Fix or baseline them when that change lands.

## Not planned

- Bootstrap compatibility mapping. The 54 sturnus repos on Bootstrap should migrate to a shared base template, not keep two class vocabularies.
- Aliases for the ad-hoc variables the demos invented (`--primary`, `--gray-500`, `--spacing-md`, `--radius-sm`). Migrate the demos to `--ss-*` tokens instead.
