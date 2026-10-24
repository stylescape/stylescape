# stylescape TODO

Completed items are moved to `CHANGELOG.md`.

## Open (2026-10-10)

Done on 2026-10-10 and moved to `CHANGELOG.md` (0.5.2): sidebar `--padded`, segmented link variant, `ss-c-map` note, compat shims on tokens, `NotificationManager` on `ss-c-toast`, BEM part names with compat aliases, the `ss.compat` layer in the ssx spec, and the Jinja layer check in `sturnus-demo`; also the standalone `01-core` import, the themed footer text and the ribbon `ssx` baseline.

- [ ] `.config-templates/eslint.config.js` now imports `eslint-plugin-import-x`; the fleet copy lives in the `@starling-cloud/agents` control plane and needs the same one-line change (import and the `import` plugin key stay as they are). **2026-10-10:** still open; the control plane is outside this repo.
- [ ] About 145 sturnus SCSS entry points (`exe/demo_static/scss/index.scss`, `src/static/scss/index.scss`) have `@use "pkg:stylescape/scss/index.scss"` commented out. **Assessed 2026-10-10, not reactivated:** the stated reason is stale (0.5.1 has the `./scss` export, unit.gl and hue.gl), but the commented path is wrong: `pkg:stylescape/scss/index.scss` does not resolve (the export maps `scss/*` to `src/scss/*/_index.scss`); `pkg:stylescape/scss` compiles (1.3 MB of CSS, with unit.gl 0.3.5 and hue.gl 0.1.2). The four entries that are active today (sturnus-audit, sturnus-idml, sturnus-base, sturnus-template) use the broken path. The demos already get stylescape from `sturnus-demo`'s base template (CDN CSS), so compiling it again would load the theme twice. Leave them commented unless a demo needs a stylescape mixin; if so, use `@use "pkg:stylescape/scss" as *;` and stop loading the CDN CSS there. **2026-10-10:** left as assessed; the entry points live in the sturnus repos, outside this repo.
- [ ] A downstream app (kodw-buurtbasis) still imports 0.3 paths (`pkg:stylescape/scss/dev`, `scss/variables`, `scss/mixins/head_frame/frame_base`), so it cannot move to unit.gl 0.3.5. Decided: migrate it to 0.4 through the VORM theme rollout (no 0.3.19). The path mapping is in `doc/migration-0.4.md`. **2026-10-10:** in progress: another session is migrating kodw-buurtbasis' SCSS to stylescape 0.5 in that repo.
- [ ] `AsideHandler`: read the declared `persist` / `initialState` options (e.g. `data-ss-aside-initial-state="show"`), so an aside can start open on a first visit and remember its state. Today it starts hidden and ignores both, which keeps kodw-buurtbasis on its own `sidebars.ts` (`data-kodw-flipper`) (2026-10-18).
- [ ] Bump `hue.gl` to `^0.2.0`. **2026-10-10:** hue.gl `v0.2.0` is tagged, but its npm publish failed (CI token, see `hue.gl/TODO.md`); 0.5.2 still depends on `^0.1.2`.
- [ ] `npm run lint:ssx` has 0 errors but exits non-zero on `--max-warnings 0`: 330 warnings are not baselined (found 2026-10-10; the same count with the committed ssx, so not caused by the 0.5.2 changes). Fix them or refresh the baseline once the ssx rule changes in progress in that repo land.

## Not planned

- Bootstrap compatibility mapping. The 54 sturnus repos on Bootstrap should migrate to a shared base template, not keep two class vocabularies.
- Aliases for the ad-hoc variables the demos invented (`--primary`, `--gray-500`, `--spacing-md`, `--radius-sm`). Migrate the demos to `--ss-*` tokens instead.

## Open from the 2026-10-10 fleet refresh

- [ ] **Delete the stray remote tag `v0.5.0`.** Its publish build failed (npm 10 crash on a lockfile-free install) and nothing reached npm; 0.5.1 was released from the fixed workflow instead. Deleting a remote tag was left for the owner.

## Bugs (sweep 2026-10-24)

- [x] `src/scss/31-modules/headline/_headline.mixins.scss:78` — `font-size: var(--ss-font-size-h2)` reads a token nothing defines, so the declaration is invalid at computed time and `.ss-c-headline__text` inherits the body size. Fall back to `--ss-font-size-4xl` (the base `h2` size).
- [x] `src/scss/21-typography/paragraph/semantic/subheader/_paragraph-subheader.config.scss:23` — the `h2` subheader `line-height` reads the undefined `--semantic-type-title--xxl-line-height` (left over from the 0.5.0 token migration). Use `--ss-leading-heading` like h3-h6.
- [x] `src/scss/31-modules/site-helpers/_site-helpers.sites.scss:207` — `.ss-c-align--left { align-items: left }` is invalid CSS (dropped). Use `flex-start`.
- [x] `src/scss/31-modules/card/_card.sites.scss:680` — `text-box-trim: both` is not a value of the property (`none | trim-start | trim-end | trim-both`). Use `trim-both`.
- [x] `src/scss/31-modules/diagram/_diagram.sites.scss:581,758` — `r: 75` / `r: 10` are unitless lengths, invalid in CSS (only SVG attributes accept user units). Use `px`.
- [x] The `*.sites.scss` partials carry 859 literal `unset` values that `gen_scapepress_parity.py` (3deef213) substituted for site Sass variables it could not resolve; 191 sat inside shorthands or lists (`padding: unset 0`, `border-left: 2px solid unset`, `top: -unset`, `box-shadow: 0 0 30px unset`, `transition: opacity unset`), which made the whole declaration invalid and silently dropped. Recovered from the site sources as of 2026-06-14 (each site's git history), then put on `--ss-spacing-*`, `--ss-color-*`, `--ss-duration-*` / `--ss-ease-*` tokens or `q()`. The bare `unset` values (valid CSS) are left as they are.
