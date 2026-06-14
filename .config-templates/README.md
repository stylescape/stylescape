# Config Templates

This directory contains canonical configuration files shared across all
Stylescape repositories:

- [`ssx`](https://github.com/stylescape/ssx) — CSS specification
- [`stylescape`](https://github.com/stylescape/stylescape) — SCSS/TS
  implementation
- [`semiosys`](https://github.com/stylescape/semiosys) — Django application

## Files

| File               | Purpose                                                |
| ------------------ | ------------------------------------------------------ |
| `editorconfig`     | Editor formatting (copy as `.editorconfig`)            |
| `prettierrc.cjs`   | Prettier formatter (copy as `.prettierrc.cjs`)         |
| `stylelintrc.cjs`  | Stylelint CSS/SCSS linter (copy as `.stylelintrc.cjs`) |
| `eslint.config.js` | ESLint JS/TS linter                                    |
| `mkdocs.base.yml`  | MkDocs theme/plugin baseline (reference only)          |

## Usage

Copy files to the target repository root, renaming as needed:

```bash
cp .config-templates/editorconfig ../<repo>/.editorconfig
cp .config-templates/prettierrc.cjs ../<repo>/.prettierrc.cjs
cp .config-templates/stylelintrc.cjs ../<repo>/.stylelintrc.cjs
cp .config-templates/eslint.config.js ../<repo>/eslint.config.js
```

## Drift Detection

CI should verify these configs match the templates:

```yaml
- name: Check config drift
  run: |
      diff .editorconfig ../stylescape/.config-templates/editorconfig
      diff .prettierrc.cjs ../stylescape/.config-templates/prettierrc.cjs
      diff .stylelintrc.cjs ../stylescape/.config-templates/stylelintrc.cjs
```

## Updating

1. Edit the template file in this directory
2. Copy to all repositories
3. Commit across all repos

Consider automating with a script or GitHub Action.
