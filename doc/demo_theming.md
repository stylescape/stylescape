# Theming the sturnia and sturnus demos

Stylescape is the single theme for every demo in the sturnia (TypeScript) and
sturnus (Django) libraries. This page records where each piece lives, so the
demos stop carrying their own copies of a demo shell.

## Who owns what

| Layer               | Lives in                              | Contains                                                                                                                                                             |
| ------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primitives          | `stylescape` (this repo)              | Tokens, layout (`ss-l-app`, `ss-l-viewport-grid`, `ss-l-dashboard`), components (`ss-c-*`), behaviour (`src/ts`), the Jinja layer in `src/templates/stylescape/`     |
| Brand               | `@starling-cloud/stylescape-starling` | Starling fonts, colour overrides, logo. Nothing structural.                                                                                                          |
| Demo shell, sturnia | `sturnia-base`                        | The gallery page and nav between demos, built from the primitives. Each `sturnia-*` repo imports it instead of copying `exe/demo.scss`.                              |
| Demo shell, sturnus | `sturnus-demo`                        | Settings that add the stylescape template loader, and a `base.html.jinja` that extends `stylescape/base.html.jinja`. Each `exe/demo_app/base.html.jinja` extends it. |

A rule that more than one demo needs belongs in stylescape. A rule that only
one library's demo needs stays in that demo.

## Sturnia: from `exe/demo.scss` to stylescape

Import the compiled CSS or the Sass entry, then build the page from the app
shell. `src/jinja/pages/gallery.html.jinja` is a working landing page to copy.

```scss
@use "pkg:stylescape/scss" as *;
```

| Demo pattern today                             | Stylescape                                                               |
| ---------------------------------------------- | ------------------------------------------------------------------------ |
| `.demo-container`, `.demo-header`, `.demo-nav` | `ss-l-app`, `ss-l-app__header`, `ss-l-app__sidebar`                      |
| `.demo-grid`, `.demo-card`                     | `ss-l-dashboard` or `ss-c-card--numbered` with `__tags`                  |
| `#resize-handle`, `#panel-toggle`              | `ss-c-split` with `SplitPaneManager`                                     |
| Info and legend panels over a map or 3D view   | `ss-c-overlay-panel`, `ss-c-legend`                                      |
| `.controls`, `.control-group`                  | `ss-c-control-grid`, `ss-c-switch`, `ss-c-segmented`, `ss-c-range-field` |
| `.event-log`, `.log-entry`                     | `ss-c-log`                                                               |
| `.stat-item`, `.status-indicator`              | `ss-c-stat`, `ss-c-status-dot`, `ss-c-status-bar`                        |
| Hard-coded dark backgrounds                    | `data-theme="auto"` or `"dark"` on `<html>`, plus `ss-c-theme-toggle`    |

## Sturnus: from Bootstrap to stylescape

Point a Jinja2 loader at the templates that ship with the npm package, then
extend the base template.

```python
TEMPLATES = [
    {
        "BACKEND": "sturnus.context.jinja2.Jinja2",
        "DIRS": [BASE_DIR / "node_modules" / "stylescape" / "src" / "templates"],
        # ...
    },
]
```

```jinja
{% extends "stylescape/base.html.jinja" %}
{% block content %}…{% endblock %}
```

The list, detail, form and delete-confirm pages, the auth pages and the macros
(form field, formset, pagination, messages, table list) render Django objects
directly. A plain `<form class="ss-c-form">{{ form }}</form>` also styles
Django's default form markup.

Templates still on 0.3 class names keep working through the `ss.compat` layer
(see [Migrating to 0.4](migration-0.4.md)), but new templates should use the
0.4 names.

## Theme switching

| Attribute on `<html>` | Result                                        |
| --------------------- | --------------------------------------------- |
| none                  | Light, as before                              |
| `data-theme="light"`  | Light; also a light island inside a dark page |
| `data-theme="dark"`   | Dark                                          |
| `data-theme="auto"`   | Follows the operating system                  |

`ThemeToggler` drives a checkbox or a button, and a `data-theme-cycle` button
steps through light, dark and auto.
