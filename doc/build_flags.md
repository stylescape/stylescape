# Build Flags

Compile-time configuration for the SCSS build. Flags live in
[`src/scss/01-core/_config.scss`](../src/scss/01-core/_config.scss), are
declared `!default`, and are forwarded from the entry point — so a consumer
sets them where it loads core:

```scss
@use "pkg:stylescape/scss" with (
    $scapepress-parity: false
);
```

Every default keeps existing markup working: `$scapepress-parity` reproduces the
historical build exactly, and `$v03-compat` (new in 0.4.2) adds the 0.3
class names back.

Themes that sit on top of core pass the configuration on core's behalf — see
`stylescape-matter`'s `src/scss/index.scss` for the pattern.

## `$scapepress-parity`

|         |                                        |
| ------- | -------------------------------------- |
| Type    | `Bool`                                 |
| Default | `true`                                 |
| Layer   | `32-utilities/_scapepress-parity.scss` |

The parity layer re-emits every class found in the scapepress-sites SCSS under
the `ss-c-*` prefix, so those sites can migrate onto core without losing their
legacy styling. It is ~890 KiB of source — **more than half of the compiled
stylesheet** — and it is dead weight for any consumer whose markup never used
those classes.

```
core, default                    1024 KiB
core, $scapepress-parity: false   472 KiB
```

Set it to `false` when the consuming markup was written fresh against the
module layer (`.ss-c-*` components from `31-modules`) or does not use
stylescape classes at all. Nothing in `31-modules` or the rest of
`32-utilities` depends on the parity layer — only the legacy class names
disappear.

Keep it `true` for the scapepress sites themselves and for anything that
inherited their markup.

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
