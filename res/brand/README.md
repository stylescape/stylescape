# Brand Assets

Centralised brand assets for all Stylescape repositories.

## Structure

```
brand/
├── favicon/          # Favicon files (ico, svg, png)
├── logo/             # Logo variations
│   ├── light/        # For dark backgrounds
│   └── dark/         # For light backgrounds
├── icons/            # Icon sets
└── fonts/            # Web fonts (if self-hosted)
```

## Usage

### In stylescape

Assets are available at `res/brand/` and can be copied to `dist/` during build.

### In semiosys

Import via npm package or copy during collectstatic:

```python
# settings.py
STATICFILES_DIRS = [
    ("brand", Path(BASE_DIR).parent / "stylescape" / "res" / "brand"),
]
```

### In ssx (docs)

Reference via relative path or copy to `doc/assets/`:

```yaml
# mkdocs.yml
extra:
    logo: assets/brand/logo/dark/logo.svg
```

## Favicon Specs

| File              | Size        | Format | Purpose                |
| ----------------- | ----------- | ------ | ---------------------- |
| `favicon.ico`     | 16x16,32x32 | ICO    | Legacy browser support |
| `favicon.svg`     | scalable    | SVG    | Modern browsers        |
| `favicon-32.png`  | 32x32       | PNG    | Fallback               |
| `favicon-180.png` | 180x180     | PNG    | Apple touch icon       |
| `favicon-192.png` | 192x192     | PNG    | Android/PWA            |
| `favicon-512.png` | 512x512     | PNG    | PWA splash             |

## Logo Specs

| Variant       | Background | Format  | Min Width |
| ------------- | ---------- | ------- | --------- |
| `logo.svg`    | Any        | SVG     | N/A       |
| `logo.png`    | Any        | PNG     | 200px     |
| `logo@2x.png` | Any        | PNG     | 400px     |
| `wordmark.*`  | Any        | SVG/PNG | 300px     |
| `symbol.*`    | Any        | SVG/PNG | 32px      |

## Colors

Primary brand colors (reference `src/scss/variables/_colors.scss`):

```scss
$color-brand-primary: #000000; // Black
$color-brand-secondary: #ffffff; // White
$color-brand-accent: #0066ff; // Blue
```

## Adding New Assets

1. Add files to appropriate subdirectory
2. Update this README if adding new categories
3. Commit and push to `stylescape` main branch
4. Other repos will pick up changes via npm update or direct copy
