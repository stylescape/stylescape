Your current color system is already well-structured and extensible, but here’s how we can further improve it for maintainability, scalability, and clarity:

⸻

✅ 1. Group Maps by Purpose (Optional)

Right now, your maps are flat. You might consider grouping them semantically, for example:

$color_system_light: (
  base: (
    background: $color_light_surface_primary,
    foreground: $color_light_text_primary,
    muted: $color_light_state_muted,
    accent: $color_light_accent,
  ),
  feedback: (
    info: $color_light_log_info,
    success: $color_light_log_success,
    warning: $color_light_warning,
    error: $color_light_log_error,
  ),
  brand: (
    primary: $color_light_accent_primary,
    secondary: $color_light_accent_secondary,
    tertiary: $color_light_accent_tertiary,
  ),
  surface: (
    1: $color_light_surface_1,
    2: $color_light_surface_2,
    3: $color_light_surface_3,
  ),
  misc: (
    light: $color_light_light,
    dark: $color_light_dark,
  )
);

Then flatten the output in :root:

:root {
  @each $group, $tokens in $color_system_light {
    @each $key, $value in $tokens {
      --color_#{$group}-#{$key}: #{$value};
    }
  }
}

This creates tokens like:

--color_base-background
--color_feedback-error
--color_surface-2

This approach improves clarity for large design systems.

⸻

✅ 2. Add a get_color() SCSS Function

This allows easy access to tokens in stylesheets:

@function get_color($key) {
  @return map.get($color_theme, $key);
}

Usage:

body {
  background-color: get_color(background);
  color: get_color(foreground);
}

⸻

✅ 3. Add Support for Theme Switching via JS

Make sure your HTML allows dynamic switching:

<html data-theme="light"> <!-- or dark -->

Then toggle it via JS:

document.documentElement.setAttribute('data-theme', 'dark');

⸻

✅ 4. Set Defaults for :root and Use Fallbacks

If SCSS fails to inject variables for some reason, ensure browser fallbacks:

body {
  background-color: var(--color_background, var(--color_surface_primary));
  color: var(--color_foreground, var(--color_text_primary));
}

⸻

✅ 5. Add a _theme.scss Partial for Reuse

Instead of embedding everything in one file, split your logic:

// _theme.scss
@use 'colors'; // your current file

:root {
  @include colors.render-theme(light);
}
[data-theme='dark'] {
  @include colors.render-theme(dark);
}

Where colors.render-theme($mode) is a mixin that injects the tokens.

⸻

Would you like me to refactor your color system into grouped maps with an injectable @mixin render-theme($mode)?
