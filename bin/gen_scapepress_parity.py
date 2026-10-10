#!/usr/bin/env python3
"""
Generate `src/scss/32-utilities/_scapepress-parity.scss` from the SCSS
sources of every site under
`/Users/larsvanvianen/Documents/GitHub/scapepress-sites`.

For every distinct class name found at the top of a SCSS rule block, this
script emits a `.ss-c-{name} { ... body ... }` block under
`@layer ss.compat`. The body is the original rule body (nested
selectors, declarations) copied verbatim, with INNER class selectors
also prefixed with `ss-c-`.

Resolution:
  * Prefer scape_ventures (the canonical base shared by 3 sites).
  * Fall back to the first encounter elsewhere.
  * Skip classes that already exist in stylescape as `.ss-c-{name}`
    (avoid clobbering modern modules). Classes that collide anyway still
    lose to the modules: `ss.compat` is declared *before*
    `ss.components` (see `01-core/_layers.scss`).

NOTE: This is a coarse, structural port — it copies SCSS as-is. Sass
imports / variables that don't resolve in the stylescape context are
guarded by replacing any `@include`/`@use`/`@forward` lines with a
commented-out form so the parity partial compiles standalone.
"""

from __future__ import annotations

import os
import re
import sys
from collections import OrderedDict

SITES_ROOT = "/Users/larsvanvianen/Documents/GitHub/scapepress-sites"
STYLESCAPE_ROOT = (
    "/Users/larsvanvianen/Documents/GitHub/stylescape/stylescape"
)
OUT_PATH = os.path.join(
    STYLESCAPE_ROOT,
    "src",
    "scss",
    "32-utilities",
    "_scapepress-parity.scss",
)
# Variable prelude — canonical design-token files. We include BOTH
# scape_ventures AND scape_press (in that order) to ensure all
# variables are defined: scape_ventures has the wider color map,
# scape_press adds `$color-black`, etc.
PRELUDE_PATHS = [
    os.path.join(
        SITES_ROOT,
        "site-scape_ventures",
        "src",
        "static",
        "scss",
        "abstracts",
        "_variables.scss",
    ),
    os.path.join(
        SITES_ROOT,
        "site-scape_press",
        ".staticfiles",
        "scss",
        "abstracts",
        "_variables.scss",
    ),
]

EXCLUDE_DIR = (
    "/node_modules/",
    "/dist/",
    "/.staticfiles/",
    "/.venv/",
    "/htmlfiles/",
    "/bup/",
    "/exa/",
)

# Priority sites (earliest wins). Anything after that is best-effort.
PRIORITY = (
    "site-scape_ventures",
    "site-scape_group",
    "site-scape_press",
    "site-scape_foundation",
    "site-scape_agency",
)

CLASS_NAME = re.compile(r"^[A-Za-z][A-Za-z0-9_-]*$")
# Match a top-level class selector at the start of a rule (we only consider
# lines whose first significant token is `.foo` — keeps us out of nested
# selectors during the top-level scan; nested ones are part of the body).
TOPLEVEL_CLASS_RULE_HEAD = re.compile(
    r"""
    ^(?P<indent>[ \t]*)              # indent (we capture only zero-indent
                                     # top-level blocks)
    (?P<selector>\.[A-Za-z][A-Za-z0-9_-]*  # leading class
        (?:[A-Za-z0-9_,\s.>+~:\-\[\]\"'=*()]*)?  # the rest of the selector
    )
    \s*\{\s*$
    """,
    re.VERBOSE | re.MULTILINE,
)


def collect_scss_files() -> list[str]:
    files = []
    for d, _, fs in os.walk(SITES_ROOT):
        if any(x in d for x in EXCLUDE_DIR):
            continue
        for f in fs:
            if not f.endswith(".scss"):
                continue
            files.append(os.path.join(d, f))

    def sort_key(p: str) -> tuple[int, str]:
        rel = p[len(SITES_ROOT) + 1 :]
        site = rel.split("/", 1)[0]
        try:
            prio = PRIORITY.index(site)
        except ValueError:
            prio = len(PRIORITY) + 1
        return (prio, p)

    files.sort(key=sort_key)
    return files


def split_top_level_blocks(txt: str) -> list[tuple[str, str]]:
    """Yield (selector_line, full_block_text) for each top-level rule.

    Top-level means starting at column 0 (no leading whitespace before the
    selector). We track brace depth to find the matching close brace.
    """
    blocks: list[tuple[str, str]] = []
    i = 0
    n = len(txt)
    while i < n:
        # Find next top-level "{" at column 0.
        # Use the regex to locate plausible heads.
        m = re.search(
            r"(?m)^(?P<sel>\.[A-Za-z][A-Za-z0-9_-][^{\n]*?)\s*\{",
            txt[i:],
        )
        if not m:
            break
        head_start = i + m.start()
        brace_open = i + m.end() - 1
        sel = m.group("sel").strip()
        # Skip selectors that contain newlines (multiline) — too risky.
        if "\n" in sel:
            i = brace_open + 1
            continue
        # Walk braces from brace_open to find matching close.
        depth = 1
        j = brace_open + 1
        in_str: str | None = None
        in_comment_block = False
        in_line_comment = False
        while j < n and depth > 0:
            c = txt[j]
            nxt = txt[j + 1] if j + 1 < n else ""
            if in_line_comment:
                if c == "\n":
                    in_line_comment = False
                j += 1
                continue
            if in_comment_block:
                if c == "*" and nxt == "/":
                    in_comment_block = False
                    j += 2
                    continue
                j += 1
                continue
            if in_str:
                if c == "\\":
                    j += 2
                    continue
                if c == in_str:
                    in_str = None
                j += 1
                continue
            if c == "/" and nxt == "*":
                in_comment_block = True
                j += 2
                continue
            if c == "/" and nxt == "/":
                in_line_comment = True
                j += 2
                continue
            if c in ('"', "'"):
                in_str = c
                j += 1
                continue
            if c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    j += 1
                    break
            j += 1
        block = txt[head_start:j]
        blocks.append((sel, block))
        i = j
    return blocks


def first_class_name(selector: str) -> str | None:
    """Return the FIRST class name in a selector, or None if not a class."""
    m = re.match(r"\s*\.([A-Za-z][A-Za-z0-9_-]*)", selector)
    if not m:
        return None
    return m.group(1)


def prefix_inner_classes(body: str) -> str:
    """Prefix every `.foo` class selector inside a SCSS body with `ss-c-`.

    Skips `.foo` if it's already `ss-`, is a state class, or appears to be
    a numeric / percent token (e.g. `.5em`).
    """
    ALLOW = ("ss-", "is-", "has-", "js-")
    LITERAL = {"active", "open", "hidden", "show", "shown", "in", "out",
               "disabled", "selected", "checked", "focus", "loading"}

    def repl(m: "re.Match[str]") -> str:
        name = m.group(1)
        if name.startswith(ALLOW):
            return m.group(0)
        if name in LITERAL:
            return m.group(0)
        return "." + "ss-c-" + name

    return re.sub(
        r"(?<![A-Za-z0-9_\-])\.([A-Za-z][A-Za-z0-9_-]*)",
        repl,
        body,
    )


def neutralize_imports(body: str) -> str:
    """
    Comment out @use/@forward/@import/@mixin/@for/@each/@while/@if/@function
    lines (or blocks), and strip entire @include/@extend blocks to avoid
    mixin resolution and brace mismatches.
    """
    # First pass: remove single-line @include/@extend (no block).
    body = re.sub(
        r"(?m)^[ \t]*@(include|extend)\s+[^{\n]+;\s*$",
        lambda m: "    // [parity] (stripped @" + m.group(1) + ")",
        body,
    )
    # Also remove inline @extend inside `{ @extend ...; }` patterns.
    body = re.sub(
        r"@extend\s+[^;{}]+;",
        "/* [parity] (stripped @extend) */",
        body,
    )
    # Second pass: remove multi-line @include/@extend/@for/@each/@while/@if
    # /@function that open a block.
    def strip_block(txt: str, keyword: str) -> str:
        pat = re.compile(r"([ \t]*)@" + keyword + r"\s+[^{\n]*\{")
        while True:
            m = pat.search(txt)
            if not m:
                break
            start = m.start()
            depth = 1
            i = m.end()
            while i < len(txt) and depth > 0:
                c = txt[i]
                if c == "{":
                    depth += 1
                elif c == "}":
                    depth -= 1
                i += 1
            txt = txt[:start] + m.group(1) + "// [parity] (stripped @" + keyword + " block)\n" + txt[i:]
        return txt

    for kw in ("include", "extend", "for", "each", "while", "if", "function"):
        body = strip_block(body, kw)

    # Third pass: @use/@forward/@import — single-line only, comment out.
    body = re.sub(
        r"(?m)^([ \t]*)@(use|forward|import)\b([^\n]*)$",
        lambda m: m.group(1) + "// [parity] @" + m.group(2) + m.group(3),
        body,
    )
    # Fourth pass: @mixin definitions (single-line or block-opening). For
    # simplicity we comment just the head; the body is usually block and
    # the close-brace will remain but inside the @layer scope it compiles.
    # Actually mixin definitions outside any selector are not harvested
    # (we only harvest top-level class rules), so this is mainly
    # defensive.
    body = re.sub(
        r"(?m)^([ \t]*)@mixin\b([^\n]*)$",
        lambda m: m.group(1) + "// [parity] @mixin" + m.group(2),
        body,
    )
    return body


# ---------------------------------------------------------------------------
# Pass 2: replace undefined variables with neutral fallbacks
# ---------------------------------------------------------------------------

# Fallback map for common undefined vars. Values are CSS-friendly literals
# that compile. Anything not here will be replaced with `unset`.
FALLBACK_VARS: dict[str, str] = {
    "$ribbon_height_top": "44px",
    "$ribbon_height_bottom": "44px",
    "$ribbon_width_left": "44px",
    "$ribbon_width_right": "44px",
    "$ribbon_height": "44px",
    "$ribbon_width": "44px",
    "$color-border": "var(--ss-color-border, #e5e5e5)",
    "$color-border-dark": "#a3a3a3",
    "$color-border-subtle": "#f2f2f2",
    "$color-text": "var(--ss-color-text, #1a1a1a)",
    "$color-text-primary": "var(--ss-color-text, #1a1a1a)",
    "$color-text-secondary": "#525252",
    "$color-text-muted": "#737373",
    "$color-text-inverted": "#ffffff",
    "$color-bg": "var(--ss-color-fill, #ffffff)",
    "$color-bg-primary": "var(--ss-color-fill, #ffffff)",
    "$color-bg-secondary": "#f2f2f2",
    "$color-bg-card": "#ffffff",
    "$color-bg-dark": "#0a0a0a",
    "$color-bg-darker": "#000000",
    "$color-bg-elevated": "#ffffff",
    "$color-surface": "#ffffff",
    "$color-dark": "#1a1a1a",
    "$color-light": "#f2f2f2",
    "$color-secondary": "#737373",
    "$color-cream": "#fdf8f2",
    "$border-radius-sm": "0",
    "$border-radius-md": "0",
    "$border-radius-lg": "0",
    "$border-radius-full": "9999px",
    "$border-width": "1px",
    "$border-width-thick": "2px",
    "$bp-sm": "640px",
    "$bp-md": "768px",
    "$bp-lg": "1024px",
    "$bp-xl": "1280px",
    "$duration-fast": "150ms",
    "$duration-medium": "200ms",
    "$duration-slow": "300ms",
    "$font-family-sans": "'FF DIN', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    "$font-family-serif": "Georgia, serif",
    "$font-family-mono": "Menlo, Monaco, monospace",
    "$font_default_sans": "'FF DIN', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    "$font_default_serif": "Georgia, serif",
    "$content-narrow": "600px",
    "$content-default": "800px",
    "$bg-animation-z-index": "-1",
    # Site-specific theming vars that don't translate well — use neutral
    "$adore-accent": "var(--ss-color-accent, #3696c1)",
    "$adore-bg-alt": "#f9f9f9",
    "$adore-border": "#e5e5e5",
    "$adore-text-primary": "#1a1a1a",
    "$adore-text-secondary": "#525252",
    "$adore-text-muted": "#737373",
    "$_dh-accent": "var(--ss-color-accent, #3696c1)",
    "$_dh-base": "#ffffff",
    "$_dh-shadow-dark": "rgba(0,0,0,0.15)",
    "$_dh-shadow-light": "rgba(255,255,255,0.5)",
    "$_neu-bg": "#e0e0e0",
    "$_neu-shadow-dark": "rgba(0,0,0,0.15)",
    "$_neu-shadow-light": "rgba(255,255,255,0.7)",
    "$category": "default",
    "$category-colors": "()",
    "$color": "currentColor",
    "$color-beauty": "#c5728d",
    "$color-enterprise": "#5192c8",
    "$color-healthcare": "#559a6a",
    "$color-wellness": "#a77cb9",
}


def fill_undefined_vars(body: str, defined: set[str]) -> str:
    """Replace undefined Sass variables with fallback values."""
    # First strip Sass module namespaces: `module.$var` -> `$var`.
    body = re.sub(r"\b[a-zA-Z_][a-zA-Z0-9_-]*\.\$", "$", body)

    def repl(m: "re.Match[str]") -> str:
        var = m.group(0)
        # Check if this var is followed by `:` (named argument) — skip.
        end = m.end()
        rest = body[end:end + 5].lstrip()
        if rest.startswith(":"):
            return var
        if var in defined:
            return var
        # Look up in fallback map
        if var in FALLBACK_VARS:
            return FALLBACK_VARS[var]
        # Generic fallback: unset
        return "unset"

    body = re.sub(r"\$[a-zA-Z_][a-zA-Z0-9_-]*", repl, body)

    # Second pass: strip Sass color function calls that now contain
    # `unset` (which is not a valid color and would blow up Sass).
    # e.g. `rgba(unset, 0.1)` → `unset`, `color.adjust(unset, …)` → `unset`.
    body = re.sub(
        r"\b(rgba?|hsla?|color\.adjust|color\.scale|color\.mix|lighten|darken|"
        r"saturate|desaturate|invert|complement|grayscale|"
        r"transparentize|fade-out|opacify|fade-in)\([^)]*unset[^)]*\)",
        "unset",
        body,
    )

    # Third pass: neutralize Sass arithmetic with `unset` operand.
    # `unset * 1.5` → `unset`, `2px + unset` → `unset`.
    body = re.sub(
        r"\bunset\s*[+\-*/]\s*[\d.]+[a-z%]*",
        "unset",
        body,
    )
    body = re.sub(
        r"[\d.]+[a-z%]*\s*[+\-*/]\s*unset\b",
        "unset",
        body,
    )

    return body



# ---------------------------------------------------------------------------
# Pass 3: per-site decisions for class names that clash with a module
# ---------------------------------------------------------------------------
#
# `ss.compat` loses to `ss.components`, so a harvested block whose root class
# is also a module class (`.ss-c-card`, `.ss-c-dropdown`, …) no longer styles
# the module's properties, but still leaks every property the module leaves
# alone into every module instance. Each such block gets a decision here,
# keyed by (class name, source path prefix):
#
#   ("drop", reason)          remove the block; `reason` is left as a comment
#   ("scope", wrapper[, […]]) prefix the root selector with the site wrapper
#                             (and optionally apply snippet replacements)
#   ("replace", [(a, b), …])  literal snippet replacements inside the block
#
# The decisions are applied after generation and are idempotent, so they can
# also be re-applied to the checked-in file on their own
# (`--postprocess-only`): several source sites are no longer on disk, so a
# full regeneration would lose their blocks.

TOKEN_TRANSLUCENT_BG = (
    "color-mix(in srgb, var(--ss-color-background) 80%, transparent)"
)

SITE_DECISIONS: dict[tuple[str, str], tuple] = {
    # scape_press service card: keep the site's __icon/__title/__description
    # parts, but read the card tokens instead of white / gray literals, and
    # stop adding a hover shadow to every module card.
    ("card", "site-scape_press/"): ("replace", [
        ("        padding: $spacing-8;\n"
         "        background-color: $color-white;\n"
         "        border: q(1) solid $color-gray-100;\n"
         "        transition: box-shadow $transition-base;\n"
         "\n"
         "        &:hover {\n"
         "            box-shadow: $shadow-lg;\n"
         "        }\n",
         "        // [parity] root look comes from the card module (31-modules/card)\n"),
        ("            color: $color-gray-600;\n",
         "            color: var(--ss-color-text-muted);\n"),
    ]),
    # scape_press header nav panel: only inside the header's primary nav item.
    ("dropdown", "site-scape_press/"): ("scope", ".ss-c-header__primary-item"),
    # geoid_org column stack: same job as the `ss-f-stack` flow primitive.
    ("stack", "site-geoid_org/"): ("drop",
        "geoid_org column stack: use the `ss-f-stack` flow primitive; "
        "`.ss-c-stack` is the overlapping-stack module"),
    # inthecity stats wrapper sizing (width/max-width only); the __* parts stay.
    ("stats", "site-inthecity_ai/"): ("drop",
        "inthecity stats wrapper sizing: `.ss-c-stats` is the stat module's "
        "row; the site's section container sets the width"),
    # kockums stat value/label: owned by the stat module.
    ("stat", "site-kockums_foundation/"): ("drop",
        "kockums stat value/label: `.ss-c-stat__*` is owned by the stat module"),
    # starling_associates product row: only inside its products container.
    ("product-card", "site-starling_associates/"): ("scope",
        ".ss-c-products-container",
        [("            background: #ffffff;\n",
          "            background: var(--ss-color-surface-hover);\n")]),
    # scape_agency frame: translucent bars follow the theme background.
    ("frame_main", "site-scape_agency/"): ("replace", [
        ("background-color: rgba(255,255,255,0.8);",
         "background-color: " + TOKEN_TRANSLUCENT_BG + ";"),
        ("border-bottom:q(1) solid black;",
         "border-bottom:q(1) solid var(--ss-color-text);"),
        ("border-top:q(1) solid #000;",
         "border-top:q(1) solid var(--ss-color-text);"),
    ]),
    # starling_studio mobile menu: the harvest kept the desktop `display:none`
    # but lost its `max-width: 768px` reveal, which hid every ribbon menu.
    ("ribbon__menu", "site-starling_studio/"): ("drop",
        "starling_studio ribbon menu: the desktop-hide rule lost its mobile "
        "reveal in the harvest and hid every `.ss-c-ribbon__menu`"),
    # scape_ventures portfolio filters: only bars that hold the site's
    # `.ss-c-filter-btn` buttons (the filter-bar module never does).
    ("filter-bar", "site-scape_ventures/"): ("replace", [
        ("    .ss-c-filter-bar {\n",
         "    .ss-c-filter-bar:has(> .ss-c-filter-btn) {\n"),
    ]),
}

# starling_studio filter-bar parts and modifiers: only inside the site's
# systems grid, so they cannot restyle a filter-bar module instance.
for _part in ("__label", "--bordered", "--pills", "--sm", "--lg", "--center",
              "--spread", "--minimal", "--underline"):
    SITE_DECISIONS[("filter-bar" + _part, "site-starling_studio/")] = (
        "scope", ".ss-c-systems-grid-section")


# Compat shims on tokens (2026-10-10). Light-theme look is kept; hex colours
# and Sass palette variables become `--ss-*` tokens so the shims follow the
# theme, and radii are square.
_TXT = "var(--ss-color-text)"
_MUTED = "var(--ss-color-text-muted)"
_BG = "var(--ss-color-background)"
_BORDER = "var(--ss-color-border)"
_ACCENT = "var(--ss-color-accent)"
_MIX = "color-mix(in srgb, {c} {p}%, transparent)"

_PROSE_BODY = """\
    .ss-c-prose {
        max-width: q(800);

        // Heading sizes come from the typography layer; the shim only sets
        // the rhythm of a long-form text column.
        > * + * {
            margin-top: var(--ss-space-4);
        }

        h2 {
            margin-top: var(--ss-space-8);
        }

        h3 {
            margin-top: var(--ss-space-6);
        }

        p {
            margin-bottom: var(--ss-space-4);
        }

        ul, ol {
            padding-left: var(--ss-space-6);
            margin-bottom: var(--ss-space-4);
        }

        li {
            margin-bottom: var(--ss-space-2);
        }

        ul li {
            list-style-type: disc;
        }

        ol li {
            list-style-type: decimal;
        }

        a {
            text-decoration: underline;
            text-underline-offset: q(2);
        }

        blockquote {
            padding-left: var(--ss-space-4);
            border-left: q(3) solid var(--ss-color-border);
            font-style: italic;
            color: var(--ss-color-text-muted);
        }

        code {
            font-size: 0.9em;
            background-color: color-mix(in srgb, var(--ss-color-text) 6%, transparent);
            padding: 0.125em 0.375em;
            border-radius: 0;
        }

        pre {
            background-color: var(--ss-color-foreground);
            color: var(--ss-color-background);
            padding: var(--ss-space-4);
            border-radius: 0;
            overflow-x: auto;

            code {
                background: none;
                padding: 0;
            }
        }

        img {
            border-radius: 0;
            margin-top: var(--ss-space-6);
            margin-bottom: var(--ss-space-6);
        }
    }

"""

SITE_DECISIONS.update({
    # mesmera long-form column: the harvest lost its variables and emitted
    # `unset` for sizes, margins and padding (which reset the heading scale
    # and the list indent). Rhythm now reads the spacing tokens.
    ("prose", "site-mesmera_io/"): ("rewrite", _PROSE_BODY),
    # scape_foundation quote: accent and text tokens instead of the green and
    # #1a1a1a fallbacks, square corners.
    ("blockquote", "site-scape_foundation/"): ("replace", [
        ("var(--color_accent_primary, #2d5a27)", _ACCENT),
        ("var(--color_text_primary, #1a1a1a)", _TXT),
        ("linear-gradient(135deg, rgba(45, 90, 39, 0.03) 0%, rgba(45, 90, 39, 0.01) 100%)",
         "linear-gradient(135deg, " + _MIX.format(c=_ACCENT, p=4)
         + " 0%, " + _MIX.format(c=_ACCENT, p=1) + " 100%)"),
        ("border-top: q(1) solid rgba(0, 0, 0, 0.08)",
         "border-top: q(1) solid " + _MIX.format(c=_TXT, p=8)),
        ("border-radius: 0 q(2) q(2) 0;", "border-radius: 0;"),
        ("border-radius: q(2) q(2) 0 0;", "border-radius: 0;"),
        ("border-radius: q(2) 0 0 q(2);", "border-radius: 0;"),
    ]),
    # scape_ventures hero: same full-viewport look, but small-viewport units
    # (no overflow under mobile toolbars) and overridable.
    ("hero", "site-scape_ventures/"): ("replace", [
        ("min-height: 100vh;",
         "min-height: 100svh;"),
    ]),
    # scape_press call to action: theme background and text.
    ("cta", "site-scape_press/"): ("replace", [
        ("background-color: $color-white;\n        color: $color-black;",
         "background-color: " + _BG + ";\n        color: " + _TXT + ";"),
        ("margin: 0 0 $spacing-10;\n            color: $color-black;",
         "margin: 0 0 $spacing-10;\n            color: " + _TXT + ";"),
        ("color: $color-gray-700;", "color: " + _MUTED + ";"),
    ]),
    # scape_ventures timeline: line, marker and marker text follow the theme.
    ("timeline", "site-scape_ventures/"): ("replace", [
        ("background: $color-gray-200;", "background: " + _BORDER + ";"),
    ]),
    ("timeline-marker", "site-scape_ventures/"): ("replace", [
        ("color: $color-accent;\n        background: $color-white;",
         "color: " + _TXT + ";\n        background: " + _BG + ";"),
        ("border-radius: $radius-md;", "border-radius: 0;"),
        ("border: q(2) solid $color-gray-200;",
         "border: q(2) solid " + _BORDER + ";"),
    ]),
    # kockums stat card: monochrome value (the accent was black), muted label.
    ("stat-card", "site-kockums_foundation/"): ("replace", [
        ("color: $color-accent;", "color: " + _TXT + ";"),
        ("color: $color-gray-500;", "color: " + _MUTED + ";"),
    ]),
})

# lovelacelabs timeline: slate literals become text tokens.
for _n in ("timeline-milestone", "timeline-end", "timeline-stat",
           "legend-item", "timeline-cta"):
    SITE_DECISIONS[(_n, "site-lovelacelabs_ai/")] = ("replace", [
        ("#718096", _MUTED), ("#2d3748", _TXT),
        ("background: #ccc;", "background: var(--ss-color-border-strong);"),
    ])

_BLOCK_RE = re.compile(
    r"(?m)^    // -- (?P<name>\S+)  \(from (?P<src>[^)]*)\) --\n"
    r"(?P<body>.*?)(?=^    // -- |^    // \[parity\] dropped|^\}|\Z)",
    re.S,
)


def apply_site_decisions(text: str) -> str:
    """Apply SITE_DECISIONS to generated parity SCSS (idempotent)."""

    def decide(m: "re.Match[str]") -> str:
        name, src, body = m.group("name"), m.group("src"), m.group("body")
        for (key, prefix), decision in SITE_DECISIONS.items():
            if key != name or not src.startswith(prefix):
                continue
            kind = decision[0]
            if kind == "drop":
                return f"    // [parity] dropped `.ss-c-{name}` ({src}): {decision[1]}\n\n"
            head = m.group(0)[: m.start("body") - m.start()]
            if kind == "scope":
                root = f"    .ss-c-{name} {{"
                if root in body:
                    body = body.replace(root, f"    {decision[1]} .ss-c-{name} {{", 1)
                for old, new in (decision[2] if len(decision) > 2 else []):
                    body = body.replace(old, new)
                return head + body
            if kind == "rewrite":
                return head + decision[1]
            if kind == "replace":
                for old, new in decision[1]:
                    body = body.replace(old, new)
                return head + body
        return m.group(0)

    return _BLOCK_RE.sub(decide, text)


def main() -> int:
    files = collect_scss_files()
    print(f"scss files found: {len(files)}", file=sys.stderr)

    # name -> (source_path, block_text)
    chosen: "OrderedDict[str, tuple[str, str]]" = OrderedDict()

    for p in files:
        try:
            txt = open(p, encoding="utf-8").read()
        except Exception:
            continue
        for sel, block in split_top_level_blocks(txt):
            name = first_class_name(sel)
            if not name:
                continue
            if not CLASS_NAME.match(name):
                continue
            if name in chosen:
                continue
            chosen[name] = (p, block)

    print(f"distinct top-level classes harvested: {len(chosen)}", file=sys.stderr)

    # ------------------------------------------------------------------
    # Skip names that already exist as `.ss-c-{name}` selectors in the
    # stylescape SCSS sources — those modules win unless we explicitly
    # want the legacy site look. The user said "give them the same
    # styling as the old ones" so we DO want to override modern modules
    # with the legacy site rules. So we DON'T skip — we emit everything.
    # ------------------------------------------------------------------

    out_lines: list[str] = []
    # Variable prelude (must come before any selectors so @use directives
    # at the top of _variables.scss are valid).
    seen_uses: set[str] = set()
    for pp in PRELUDE_PATHS:
        try:
            prelude = open(pp, encoding="utf-8").read()
        except Exception:
            prelude = ""
        # Deduplicate @use directives: only emit each once.
        deduped_lines = []
        for line in prelude.splitlines():
            if line.strip().startswith("@use"):
                if line in seen_uses:
                    continue
                seen_uses.add(line)
            deduped_lines.append(line)
        prelude = "\n".join(deduped_lines)
        out_lines.append(
            f"// =============================================================\n"
            f"// Design-token prelude from {pp[len(SITES_ROOT)+1:]}\n"
            f"// =============================================================\n\n"
        )
        out_lines.append(prelude.rstrip() + "\n\n")
    out_lines.append(
        "// ============================================================="
        "===========\n"
    )
    out_lines.append("// 32-utilities / scapepress-parity\n")
    out_lines.append(
        "// ============================================================="
        "===========\n"
    )
    out_lines.append("//\n")
    out_lines.append(
        "// AUTO-GENERATED by bin/gen_scapepress_parity.py — DO NOT EDIT BY HAND.\n"
    )
    out_lines.append(
        "// Source: every *.scss under "
        "/Users/larsvanvianen/Documents/GitHub/scapepress-sites\n"
    )
    out_lines.append(
        "// Earliest-defining site wins (priority: scape_ventures > scape_group > scape_press > ...).\n"
    )
    out_lines.append("//\n")
    out_lines.append(
        "// Every top-level class selector found in the source SCSS is\n"
        "// re-emitted here under `@layer ss.compat` with the\n"
        "// `ss-c-` prefix. Inner class selectors are prefixed too, so\n"
        "// any `&__child` / `.foo .bar` patterns continue to work after\n"
        "// the rename.\n"
    )
    out_lines.append(
        "// ============================================================="
        "===========\n\n"
    )

    out_lines.append("@layer ss.compat {\n\n")

    # Build set of variables that ARE defined in the preludes so we don't
    # replace them with fallbacks.
    prelude_txt = "".join(out_lines)
    defined_vars: set[str] = set(
        re.findall(r"\$[a-zA-Z_][a-zA-Z0-9_-]*(?=\s*:)", prelude_txt)
    )

    for name, (src, block) in chosen.items():
        body = neutralize_imports(block)
        body = prefix_inner_classes(body)
        body = fill_undefined_vars(body, defined_vars)
        # `body` already starts with `.original_selector {`; that leading
        # selector has been prefixed by prefix_inner_classes to
        # `.ss-c-original_selector {`. We just need to wrap with indent
        # for layer scope.
        # Indent each line of the block 4 spaces for the layer scope.
        indented = "\n".join(
            "    " + ln if ln.strip() else "" for ln in body.splitlines()
        )
        out_lines.append(
            f"    // -- {name}  (from {src[len(SITES_ROOT)+1:]}) --\n"
        )
        out_lines.append(indented + "\n\n")

    out_lines.append("}\n")

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as fh:
        fh.write(apply_site_decisions("".join(out_lines)))
    print(f"wrote {OUT_PATH}  ({len(chosen)} blocks)", file=sys.stderr)
    return 0


def postprocess_only() -> int:
    """Re-apply SITE_DECISIONS to the checked-in parity file in place."""
    with open(OUT_PATH, encoding="utf-8") as fh:
        text = fh.read()
    new = apply_site_decisions(text)
    if new != text:
        with open(OUT_PATH, "w", encoding="utf-8") as fh:
            fh.write(new)
    print(f"post-processed {OUT_PATH}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    if "--postprocess-only" in sys.argv[1:]:
        sys.exit(postprocess_only())
    sys.exit(main())
