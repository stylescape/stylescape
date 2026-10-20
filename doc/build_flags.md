# Build Flags

Compile-time configuration for the SCSS build. Flags live in
[`src/scss/01-core/_config.scss`](../src/scss/01-core/_config.scss), are
declared `!default`, and are forwarded from the entry point — so a consumer
sets them where it loads core:

```scss
@use "pkg:stylescape/scss" with (
    $v03-compat: false
);
```

Every default keeps existing markup working: `$v03-compat` (new in 0.4.2) adds
the 0.3 class names back.

Themes that sit on top of core pass the configuration on core's behalf — see
`stylescape-matter`'s `src/scss/index.scss` for the pattern.

## `$scapepress-parity` (deprecated, no effect)

|         |                     |
| ------- | ------------------- |
| Type    | `Bool`              |
| Default | `true`              |
| Status  | deprecated in 0.6.0 |

Until 0.5 this flag switched off the scapepress parity shim
(`32-utilities/_scapepress-parity.scss`), which re-emitted every class found in
the scapepress-sites SCSS under the `ss-c-*` prefix in `@layer ss.compat`.

Those classes are now native module partials, `31-modules/*/_*.sites.scss`
(one per component family: `lightbox`, `grid-square`, `programme`, `hero`,
`footer`, …), in `@layer ss.components`, reading `--ss-*` tokens instead of
the sites' own variables. They are always emitted. The flag is still accepted,
so `with ($scapepress-parity: false)` keeps compiling, but it changes nothing;
drop it from your configuration.

## `$v03-compat`

|         |                                         |
| ------- | --------------------------------------- |
| Type    | `Bool`                                  |
| Default | `true`                                  |
| Layer   | `32-utilities/_legacy-v03-compat.scss`  |

Styles the unprefixed stylescape 0.3 class names (`.button`, `.badge`,
`.ribbon--top`, `.frame_main`, `.grid__frame--24`, `.margin--10_right`, …)
with the 0.4 module mixins and tokens, so 0.3 markup keeps its look on 0.4.
Set it to `false` once the markup uses the `ss-*` names. See
[Migrating from 0.3](migration-0.4.md) for the old → new table.
