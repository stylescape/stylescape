#!/usr/bin/env python3
"""
Generate `src/scss/32-utilities/_scapepress-parity.scss` from the SCSS
sources of every site under
`/Users/larsvanvianen/Documents/GitHub/scapepress-sites`.

For every distinct class name found at the top of a SCSS rule block, this
script emits a `.ss-c-{name} { ... body ... }` block under
`@layer ss.utilities`. The body is the original rule body (nested
selectors, declarations) copied verbatim, with INNER class selectors
also prefixed with `ss-c-`.

Resolution:
  * Prefer scape_ventures (the canonical base shared by 3 sites).
  * Fall back to the first encounter elsewhere.
  * Skip classes that already exist in stylescape as `.ss-c-{name}`
    (avoid clobbering modern modules — those win via cascade layer
    order because parity ships under `@layer ss.utilities` *before*
    the existing compat shims).

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
        "// re-emitted here under `@layer ss.utilities` with the\n"
        "// `ss-c-` prefix. Inner class selectors are prefixed too, so\n"
        "// any `&__child` / `.foo .bar` patterns continue to work after\n"
        "// the rename.\n"
    )
    out_lines.append(
        "// ============================================================="
        "===========\n\n"
    )

    out_lines.append("@layer ss.utilities {\n\n")

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
        fh.write("".join(out_lines))
    print(f"wrote {OUT_PATH}  ({len(chosen)} blocks)", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
