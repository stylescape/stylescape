# Naming Conventions

Your naming convention @mixin frame_main\_\_area--center follows a structured,
semantic BEM-inspired SCSS architecture that clearly expresses both layout
hierarchy and functionality.

## Description

```
@mixin frame_main__area--center
```

- `frame_main` This is the layout frame (a major structural container), e.g.,
  the main content region of the screen.
- `__area` This denotes a subsection or slot inside frame_main, following a
  BEM-style element notation.
- `--center` This is a modifier, indicating this area is the centered region
  within the frame (e.g. horizontally and/or vertically centered, or the main
  scrollable panel).

## File & Folder Naming

### Index Files (`_index.scss`)

Every folder in the SCSS library uses a `_index.scss` file as its barrel/entry
point. This pattern follows SASS module conventions:

```scss
// src/scss/mixins/_index.scss
@forward "body_atoms";
@forward "body_molecules";
@forward "body_organisms";
```

**Conventions:**

- Index files use `@forward` to re-export contents from subfolders
- This allows clean imports: `@use "mixins"` instead of
  `@use "mixins/body_atoms"`
- Internal dependencies use `@use` with namespacing

### File Naming Patterns

| Pattern                       | Example                     | Usage                    |
| ----------------------------- | --------------------------- | ------------------------ |
| `_<name>.scss`                | `_button.scss`              | Standard partial file    |
| `_<category>_<specific>.scss` | `_font_size.scss`           | Grouped related concepts |
| `<tier>_<category>/`          | `body_atoms/`, `soul_type/` | Folder organization      |

### Folder Structure

The library follows a consistent **tier_category** naming pattern:

```
src/scss/
├── classes/           # CSS utility classes
│   ├── body_atoms/
│   ├── body_molecules/
│   ├── body_organisms/
│   ├── body_skeletons/
│   ├── head_frame/
│   ├── head_content/
│   ├── head_layout/
│   ├── head_position/
│   ├── soul_type/
│   ├── soul_line/
│   └── soul_object/
├── mixins/            # Reusable mixin definitions
│   └── (same structure as classes)
├── variables/         # SCSS variables
│   └── (same structure as classes)
├── functions/         # Utility functions
├── maps/              # SCSS data maps
├── tags/              # HTML element base styles
├── root/              # CSS custom properties
└── dev/               # Development utilities
```

### Tier Prefixes

| Prefix  | Tier | Purpose                       |
| ------- | ---- | ----------------------------- |
| `body_` | Body | UI Components (Atomic Design) |
| `head_` | Head | Structure & Layout            |
| `soul_` | Soul | Visual Styling                |

### Category Suffixes

**Body Tier (Components):**

- `_atoms` - Basic UI elements (buttons, inputs, badges)
- `_molecules` - Composed components (cards, forms)
- `_organisms` - Complex components (modals, ribbons)
- `_skeletons` - Page-level templates

**Head Tier (Structure):**

- `_frame` - Application shell containers
- `_content` - Content region structures
- `_layout` - Grid, flex, spacing utilities
- `_position` - Positioning utilities

**Soul Tier (Styling):**

- `_type` - Typography (font, paragraph, character)
- `_line` - Borders, dividers, rules
- `_object` - Colors, corners, shadows
