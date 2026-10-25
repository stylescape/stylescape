#!/usr/bin/env python3
"""
Regenerate the scapepress site partials, `31-modules/*/_*.sites.scss`, from
the SCSS of every site under `scapepress-sites`, into a scratch directory.

History. The first version of this script (3deef213) wrote one shim,
`32-utilities/_scapepress-parity.scss`. Wherever a site Sass variable was
not defined in its prelude or its fallback map it wrote the literal `unset`,
also inside shorthands and lists (`padding: unset 0`, `top: -unset`,
`border: 1px solid unset`), which made 191 declarations invalid. Later passes
turned px and rem into `q()` (74acc135), moved the blocks into module partials and put
them on `--ss-*` tokens (39bfe84d, which also removed this script), and the
191 values were recovered from the sites on 2026-10-24. The partials are
hand-maintained source now. This script exists so the harvest can be redone
and diffed; it never writes into `src/`.

What it does:

  1. Copies each site's tracked SCSS as of `--as-of` (default: the 3deef213
     generation time) from the site's git history into `<out>/.sites`.
  2. Harvests the class blocks: by default the 2,251 the partials hold, each
     from the file its block marker names (a file that lacked a block at
     `--as-of` is read at the nearest revision that has it);
     `--harvest=all` takes every top-level class block instead (earliest-
     defining site wins, scape_ventures first). Strips `@include`/`@extend`/
     control blocks, prefixes classes with `ss-c-`, turns px/rem into `q()`
     and applies the per-site decisions below.
  3. Resolves every Sass variable a declaration reads, in this order:
       a. the token map (`bin/scapepress_parity_tokens.json`): the `--ss-*`
          token each prelude variable became in the partials (39bfe84d);
       b. the old fallback map (`FALLBACK_VARS`);
       c. Dart Sass, in the site's own context: a probe declaration is
          inserted after the declaration in the site's source and the file
          (or the site entry point that imports it) is compiled, with `pkg:`
          imports resolved to the local stylescape and stylescape-themes
          repos (`bin/scapepress_resolve.mjs`). The value then goes on tokens
          the way the 2026-10-24 repair did: spacing lengths read by
          `$space*`/`$spacing*` to `var(--ss-spacing-N)` (other lengths to
          `q()`), colours to `var(--ss-color-*)` (alpha to `color-mix()`),
          durations and easings to `var(--ss-duration-*)` / `var(--ss-ease-*)`.
     A variable none of these resolves is never replaced by a guess or by
     `unset`: by default the run fails and lists every unresolved variable
     with its site, file and class block; `--on-unresolved=skip` instead
     comments the whole declaration out (`// [unresolved $x] ...`).
  4. Validates the result: no `$` variable, no `unset` inside a multi-value
     declaration, no `-var(...)`, no unbalanced braces. Any finding fails the
     run and nothing is written.
  5. Writes the blocks into the same module partials, in the same order, as
     `src/scss/31-modules` has them (header copied from the partial);
     a block the partials do not have goes to `_unassigned.sites.scss`.

Not reproduced (diff against the partials to see them): the 39bfe84d token
pass over literal values (hex colours, ad-hoc custom properties, seconds),
its conflict drops, and later hand fixes.

Checked 2026-10-24: with the default harvest the output reproduces every
line the 2026-10-24 repair changed, and compiles with no invalid
declaration.

Usage (needs node and Dart Sass; `--sass` defaults to core's node_modules):
  bin/gen_scapepress_parity.py --out-dir /tmp/x --sass /path/to/node_modules/sass
  bin/gen_scapepress_parity.py --refresh-token-map
  diff -ru src/scss/31-modules /tmp/x/31-modules
"""

from __future__ import annotations

import argparse
import difflib
import json
import os
import re
import shutil
import subprocess
import sys
from collections import Counter, OrderedDict, defaultdict
from pathlib import Path

CORE = Path(__file__).resolve().parents[1]
GITHUB = CORE.parents[1]
MODULES_DIR = CORE / "src" / "scss" / "31-modules"
TOKENS_PATH = CORE / "bin" / "scapepress_parity_tokens.json"
RESOLVER = CORE / "bin" / "scapepress_resolve.mjs"

DEFAULT_SITES_ROOT = GITHUB / "scapepress-sites"
DEFAULT_THEMES_ROOT = GITHUB / "stylescape-themes"
# 3deef213, the commit that generated the shim the partials come from.
DEFAULT_AS_OF = "2026-06-14 22:09:20 +0200"
# The last shim, input of the token-map refresh.
SHIM_REV = "39bfe84d^"
SHIM_PATH = "src/scss/32-utilities/_scapepress-parity.scss"

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
VAR = re.compile(r"\$[a-zA-Z_][a-zA-Z0-9_-]*")
NAMESPACE = re.compile(r"\b(?!breakpoints\.)[a-zA-Z_][a-zA-Z0-9_-]*\.(?=\$)")
DECL = re.compile(
    r"(?m)(?:^|(?<=[{;]))[ \t]*(?P<prop>[a-zA-Z-]+|--[\w-]+)[ \t]*:"
    r"(?P<value>(?:[^;{}#]|#\{[^{}]*\}|#(?!\{))*?);"
)
LOCAL_VAR_LINE = re.compile(r"(?m)^[ \t]*\$[\w-]+[ \t]*:[^;{}]*;[ \t]*\n")
ALLOWED_DOLLAR = "breakpoints.$ss-breakpoints"
BREAKPOINT = re.compile(r"\$breakpoint-(sm|md|lg|xl|2xl)\b")


class GenError(Exception):
    pass


# ---------------------------------------------------------------------------
# Site trees as of the generation date
# ---------------------------------------------------------------------------

def excluded(sites_root: Path, site: str, rel: str) -> bool:
    d = os.path.dirname(f"{sites_root}/{site}/{rel}")
    return any(x in d for x in EXCLUDE_DIR)


def git(repo: Path, *args: str, input: bytes | None = None) -> bytes:
    return subprocess.run(
        ["git", "-C", str(repo), *args], input=input, check=True,
        capture_output=True,
    ).stdout


def materialise(sites_root: Path, as_of: str, dest: Path) -> list[str]:
    """Copy each site's tracked .scss as of `as_of` into `dest/<site>/`."""
    notes = []
    if dest.exists():
        shutil.rmtree(dest)
    for site in sorted(os.listdir(sites_root)):
        sd = sites_root / site
        if not site.startswith("site-") or not sd.is_dir():
            continue
        if not (sd / ".git").exists():
            notes.append(f"{site}: not a git repo, working tree used")
            for d, _, fs in os.walk(sd):
                for f in fs:
                    rel = os.path.relpath(os.path.join(d, f), sd)
                    if f.endswith(".scss") and not excluded(sites_root, site, rel):
                        (dest / site / rel).parent.mkdir(parents=True, exist_ok=True)
                        shutil.copyfile(sd / rel, dest / site / rel)
            continue
        rev = git(sd, "rev-list", "-1", f"--before={as_of}", "HEAD").decode().strip()
        if not rev:
            notes.append(f"{site}: no commit before {as_of}, skipped")
            continue
        names = [
            n for n in git(sd, "ls-tree", "-r", "-z", "--name-only", rev).decode().split("\0")
            if n.endswith(".scss") and not excluded(sites_root, site, n)
        ]
        if not names:
            continue
        out = git(sd, "cat-file", "--batch",
                  input="".join(f"{rev}:{n}\n" for n in names).encode())
        pos = 0
        for n in names:
            header_end = out.index(b"\n", pos)
            size = int(out[pos:header_end].split()[2])
            body = out[header_end + 1: header_end + 1 + size]
            pos = header_end + 1 + size + 1
            p = dest / site / n
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_bytes(body)
    return notes


def collect_scss_files(root: Path) -> list[str]:
    files = []
    for d, _, fs in os.walk(root):
        files += [os.path.join(d, f) for f in fs if f.endswith(".scss")]

    def sort_key(p: str) -> tuple[int, str]:
        site = p[len(str(root)) + 1:].split("/", 1)[0]
        prio = PRIORITY.index(site) if site in PRIORITY else len(PRIORITY) + 1
        return (prio, p)

    files.sort(key=sort_key)
    return files


# ---------------------------------------------------------------------------
# Harvest
# ---------------------------------------------------------------------------

def split_top_level_blocks(txt: str) -> list[tuple[str, int, str]]:
    """(selector_line, offset, block_text) for each column-0 class rule."""
    blocks = []
    i, n = 0, len(txt)
    head = re.compile(r"(?m)^(?P<sel>\.[A-Za-z][A-Za-z0-9_-][^{\n]*?)\s*\{")
    while i < n:
        m = head.search(txt, i)
        if not m:
            break
        head_start, brace_open = m.start(), m.end() - 1
        sel = m.group("sel").strip()
        depth, j = 1, brace_open + 1
        in_str = None
        in_block = in_line = False
        while j < n and depth > 0:
            c = txt[j]
            nxt = txt[j + 1] if j + 1 < n else ""
            if in_line:
                in_line = c != "\n"
            elif in_block:
                if c == "*" and nxt == "/":
                    in_block = False
                    j += 1
            elif in_str:
                if c == "\\":
                    j += 1
                elif c == in_str:
                    in_str = None
            elif c == "/" and nxt == "*":
                in_block = True
                j += 1
            elif c == "/" and nxt == "/":
                in_line = True
                j += 1
            elif c in "\"'":
                in_str = c
            elif c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
            j += 1
        blocks.append((sel, head_start, txt[head_start:j]))
        i = j
    return blocks


def first_class_name(selector: str) -> str | None:
    m = re.match(r"\s*\.([A-Za-z][A-Za-z0-9_-]*)", selector)
    return m.group(1) if m else None


def prefix_inner_classes(body: str) -> str:
    """Prefix every `.foo` class selector with `ss-c-` (not state classes)."""
    allow = ("ss-", "is-", "has-", "js-")
    literal = {"active", "open", "hidden", "show", "shown", "in", "out",
               "disabled", "selected", "checked", "focus", "loading"}

    def repl(m: "re.Match[str]") -> str:
        name = m.group(1)
        if name.startswith(allow) or name in literal:
            return m.group(0)
        return ".ss-c-" + name

    return re.sub(r"(?<![A-Za-z0-9_\-])\.([A-Za-z][A-Za-z0-9_-]*)", repl, body)


def neutralize_imports(body: str) -> str:
    """Strip @include/@extend and control/function blocks; comment out
    @use/@forward/@import/@mixin lines (the output compiles standalone)."""
    body = re.sub(
        r"(?m)^[ \t]*@(include|extend)\s+[^{\n]+;\s*$",
        lambda m: "    // [parity] (stripped @" + m.group(1) + ")", body)
    body = re.sub(r"@extend\s+[^;{}]+;", "/* [parity] (stripped @extend) */", body)

    def strip_block(txt: str, keyword: str) -> str:
        pat = re.compile(r"([ \t]*)@" + keyword + r"\s+[^{\n]*\{")
        while True:
            m = pat.search(txt)
            if not m:
                return txt
            depth, i = 1, m.end()
            while i < len(txt) and depth > 0:
                depth += {"{": 1, "}": -1}.get(txt[i], 0)
                i += 1
            txt = (txt[:m.start()] + m.group(1)
                   + "// [parity] (stripped @" + keyword + " block)\n" + txt[i:])

    for kw in ("include", "extend", "for", "each", "while", "if", "function"):
        body = strip_block(body, kw)
    body = re.sub(r"(?m)^([ \t]*)@(use|forward|import)\b([^\n]*)$",
                  lambda m: m.group(1) + "// [parity] @" + m.group(2) + m.group(3), body)
    body = re.sub(r"(?m)^([ \t]*)@mixin\b([^\n]*)$",
                  lambda m: m.group(1) + "// [parity] @mixin" + m.group(2), body)
    return body


def blank_comments(t: str) -> str:
    """Comments replaced by spaces (offsets kept)."""
    t = re.sub(r"/\*.*?\*/", lambda m: re.sub(r"[^\n]", " ", m.group(0)), t, flags=re.S)
    return re.sub(r"(?m)(?<!:)//.*$", lambda m: " " * len(m.group(0)), t)


PX = re.compile(r"(?<![\w.#-])(-?\d*\.?\d+)(px|rem)\b")


def _q(m: "re.Match[str]") -> str:
    n = float(m.group(1)) * (16 if m.group(2) == "rem" else 1)
    return f"q({fmt(n)})"


def px_to_q(text: str) -> str:
    """`12px` / `0.75rem` -> `q(12)` outside comments and custom-property
    values (the 74acc135 pass; `q()` is not evaluated inside a custom
    property)."""
    out = []
    for line in text.splitlines(keepends=True):
        code, sep, comment = line.partition("//")
        if re.match(r"\s*--[\w-]+\s*:", code) or "/*" in code:
            out.append(line)
            continue
        out.append(PX.sub(_q, code) + sep + comment)
    return "".join(out)


# ---------------------------------------------------------------------------
# Value atoms and token mapping
# ---------------------------------------------------------------------------

def norm(v: str) -> str:
    return " ".join(v.split())


def atom_spans(v: str) -> list[tuple[str, int, int]]:
    """Top-level space/comma separated atoms with their spans (commas are
    atoms of their own)."""
    out, depth, start = [], 0, None
    for i, ch in enumerate(v + " "):
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
        if depth == 0 and (ch.isspace() or ch == ","):
            if start is not None:
                out.append((v[start:i], start, i))
                start = None
            if ch == ",":
                out.append((",", i, i + 1))
            continue
        if start is None:
            start = i
    return out


def atoms(v: str) -> list[str]:
    return [a for a, _, _ in atom_spans(v)]


OPERATORS = {"+", "-", "*", "/", "%", "==", "!=", "<", ">", "<=", ">=", "and", "or"}

SPACING_STEPS = set([0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5] + list(range(4, 13))
                    + [14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96])
DURATIONS = (0, 75, 100, 150, 200, 300, 500, 700, 1000)
EASINGS = {
    "cubic-bezier(0.25, 0.1, 0.25, 1)": "ease",
    "cubic-bezier(0.25, 0.46, 0.45, 0.94)": "var(--ss-ease-out)",
    "cubic-bezier(0, 0, 0.2, 1)": "var(--ss-ease-out)",
    "cubic-bezier(0.4, 0, 1, 1)": "var(--ss-ease-in)",
    "cubic-bezier(0.4, 0, 0.2, 1)": "var(--ss-ease-in-out)",
    "cubic-bezier(0.68, -0.55, 0.265, 1.55)": "var(--ss-ease-bounce)",
}
COLOUR = re.compile(r"#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)")

# Colours the 2026-10-24 repair put on tokens; they win over the mined map.
REPAIR_COLOURS = {
    "#3b82f6": "accent", "#8b5cf6": "info", "#06b6d4": "accent-tertiary",
    "#10b981": "success", "#8187c9": "info", "#a7f3d0": "success-bg",
    "#047857": "success", "#064e3b": "success-foreground", "#cccccc": "border",
    "#ffffff": "white", "#d1d5d8": "gray-200", "#a3b1c6": "gray-300",
}


def fmt(n: float) -> str:
    return str(int(n)) if n == int(n) else f"{n:g}"


class Tokens:
    """The token map (prelude variables and literal colours, as the
    partials spell them) plus the value mapping for Sass-resolved values."""

    def __init__(self, data: dict):
        self.vars: dict[str, str] = data.get("variables", {})
        self.atoms: dict[str, str] = data.get("atoms", {})
        self.colours: dict[str, str] = {k.lower(): v for k, v in data.get("colours", {}).items()}
        self.colours.update({k: f"var(--ss-color-{v})" for k, v in REPAIR_COLOURS.items()})

    # Sass-resolved values ------------------------------------------------
    def length(self, v: str, spacing: bool) -> str:
        m = re.fullmatch(r"(-?\d*\.?\d+)(rem|px)", v)
        if not m:
            return v
        px = float(m.group(1)) * (16 if m.group(2) == "rem" else 1)
        if px == 0:
            return "0"
        if spacing and px > 0 and px / 4 in SPACING_STEPS:
            return f"var(--ss-spacing-{fmt(px / 4).replace('.', '-')})"
        return f"q({fmt(px)})"

    def colour(self, c: str) -> str:
        cl = re.sub(r"\s+", " ", c.strip().lower())
        cl = re.sub(r"^rgba?\((white|black),", lambda m: "rgba(" + {
            "white": "255, 255, 255", "black": "0, 0, 0"}[m.group(1)] + ",", cl)
        if cl in self.colours:
            return self.colours[cl]
        m = re.fullmatch(r"rgba?\((\d+), ?(\d+), ?(\d+)(?:, ?([\d.]+))?\)", cl)
        if m:
            base = "#%02x%02x%02x" % tuple(int(m.group(k)) for k in (1, 2, 3))
            alpha = float(m.group(4)) if m.group(4) else 1.0
            tok = self.colours.get(base) or self.colours.get(f"rgb({m.group(1)}, {m.group(2)}, {m.group(3)})")
            if tok:
                if alpha == 1:
                    return tok
                return f"color-mix(in srgb, {tok} {fmt(round(alpha * 100, 2))}%, transparent)"
        return c

    def timing(self, v: str) -> str:
        for k, tok in EASINGS.items():
            v = v.replace(k, tok)

        def dur(m: "re.Match[str]") -> str:
            ms = float(m.group(1)) * (1000 if m.group(2) == "s" else 1)
            if ms > 1000:
                return f"calc(var(--ss-duration-1000) * {fmt(ms / 1000)})"
            best = min(DURATIONS, key=lambda d: (abs(d - ms), d))
            return f"var(--ss-duration-{best})"

        return re.sub(r"(?<![\w.(-])(\d*\.?\d+)(ms|s)\b", dur, v)

    def value(self, v: str, spacing: bool) -> str:
        v = self.timing(v)
        v = COLOUR.sub(lambda m: self.colour(m.group(0)), v)
        if v.startswith("calc(") and v.endswith(")"):
            inner = v[5:-1]
            inner = re.sub(r"(?<![\w(-])-?\d*\.?\d+rem\b", lambda m: self.length(m.group(0), True), inner)
            inner = re.sub(r"(?<![\w(-])-?\d*\.?\d+px\b", lambda m: self.length(m.group(0), False), inner)
            return "calc(" + inner + ")"
        return re.sub(r"(?<![\w(-])-?\d*\.?\d+(?:rem|px)\b",
                      lambda m: self.length(m.group(0), spacing), v)

    # Prelude variables -----------------------------------------------------
    def mapped(self, atom: str) -> str | None:
        """Token for an atom whose variables are all in the token map."""
        a = NAMESPACE.sub("", atom)
        if a in self.atoms:
            return self.atoms[a]
        names = VAR.findall(a)
        if not names or any(n not in self.vars for n in names):
            return None
        if a in self.vars:
            return self.vars[a]
        m = re.fullmatch(r"rgba?\((\$[\w-]+),\s*([\d.]+)\)", a)
        if m and self.vars[m.group(1)].startswith("var(--ss-color-"):
            return (f"color-mix(in srgb, {self.vars[m.group(1)]} "
                    f"{fmt(round(float(m.group(2)) * 100, 2))}%, transparent)")
        if re.fullmatch(r"-\$[\w-]+", a):
            return f"calc(-1 * {self.vars[a[1:]]})"
        if re.search(r"\(", a) and not re.search(r"\b(rgba?|hsla?|lighten|darken|mix|"
                                                 r"color\.\w+|math\.\w+)\(", a):
            # e.g. linear-gradient($a, $b), var(--x, $y): substitute inside.
            return re.sub(r"(?<![\w)])(-?)(\$[\w-]+)", lambda m: (
                ("-1 * " if m.group(1) else "") + self.vars[m.group(2)]), a)
        return None


# Fallback map for common undefined vars (the first version's map), kept so
# the values the partials were made from stay the same.
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


# ---------------------------------------------------------------------------
# Per-site decisions for class names that clash with a module (unchanged)
# ---------------------------------------------------------------------------
#
#   ("drop", reason)          remove the block; `reason` is left as a comment
#   ("scope", wrapper[, […]]) prefix the root selector with the site wrapper
#                             (and optionally apply snippet replacements)
#   ("replace", [(a, b), …])  literal snippet replacements inside the block
#   ("rewrite", body)         replace the block body
#
# They match the harvested text after px -> q() and before variables are
# resolved, so their snippets still read `$variables`.

TOKEN_TRANSLUCENT_BG = (
    "color-mix(in srgb, var(--ss-color-background) 80%, transparent)"
)

SITE_DECISIONS: dict[tuple[str, str], tuple] = {
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
    ("dropdown", "site-scape_press/"): ("scope", ".ss-c-header__primary-item"),
    ("stack", "site-geoid_org/"): ("drop",
        "geoid_org column stack: use the `ss-f-stack` flow primitive; "
        "`.ss-c-stack` is the overlapping-stack module"),
    ("stats", "site-inthecity_ai/"): ("drop",
        "inthecity stats wrapper sizing: `.ss-c-stats` is the stat module's "
        "row; the site's section container sets the width"),
    ("stat", "site-kockums_foundation/"): ("drop",
        "kockums stat value/label: `.ss-c-stat__*` is owned by the stat module"),
    ("product-card", "site-starling_associates/"): ("scope",
        ".ss-c-products-container",
        [("            background: #ffffff;\n",
          "            background: var(--ss-color-surface-hover);\n")]),
    ("frame_main", "site-scape_agency/"): ("replace", [
        ("background-color: rgba(255,255,255,0.8);",
         "background-color: " + TOKEN_TRANSLUCENT_BG + ";"),
        ("border-bottom:q(1) solid black;",
         "border-bottom:q(1) solid var(--ss-color-text);"),
        ("border-top:q(1) solid #000;",
         "border-top:q(1) solid var(--ss-color-text);"),
    ]),
    ("ribbon__menu", "site-starling_studio/"): ("drop",
        "starling_studio ribbon menu: the desktop-hide rule lost its mobile "
        "reveal in the harvest and hid every `.ss-c-ribbon__menu`"),
    ("filter-bar", "site-scape_ventures/"): ("replace", [
        ("    .ss-c-filter-bar {\n",
         "    .ss-c-filter-bar:has(> .ss-c-filter-btn) {\n"),
    ]),
}

for _part in ("__label", "--bordered", "--pills", "--sm", "--lg", "--center",
              "--spread", "--minimal", "--underline"):
    SITE_DECISIONS[("filter-bar" + _part, "site-starling_studio/")] = (
        "scope", ".ss-c-systems-grid-section")

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
    ("prose", "site-mesmera_io/"): ("rewrite", _PROSE_BODY),
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
    ("hero", "site-scape_ventures/"): ("replace", [
        ("min-height: 100vh;", "min-height: 100svh;"),
    ]),
    ("cta", "site-scape_press/"): ("replace", [
        ("background-color: $color-white;\n        color: $color-black;",
         "background-color: " + _BG + ";\n        color: " + _TXT + ";"),
        ("margin: 0 0 $spacing-10;\n            color: $color-black;",
         "margin: 0 0 $spacing-10;\n            color: " + _TXT + ";"),
        ("color: $color-gray-700;", "color: " + _MUTED + ";"),
    ]),
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
    ("stat-card", "site-kockums_foundation/"): ("replace", [
        ("color: $color-accent;", "color: " + _TXT + ";"),
        ("color: $color-gray-500;", "color: " + _MUTED + ";"),
    ]),
})

_SECONDARY = "var(--ss-color-text-secondary, var(--ss-color-text-muted))"
_PRIMARY = "var(--ss-color-text-primary)"
SITE_DECISIONS.update({
    ("footer", "site-scape_group/"): ("replace", [
        ("        background: $color-primary;\n        color: $color-white;\n",
         "        // [parity] background and text colour come from the footer\n"
         "        // module (31-modules/footer)\n"),
    ]),
    ("footer__links", "site-scape_group/"): ("replace", [
        ("color: $color-gray-400;", "color: " + _SECONDARY + ";"),
        ("color: $color-white;", "color: " + _PRIMARY + ";"),
    ]),
    ("footer__copyright", "site-scape_group/"): ("replace", [
        ("color: $color-gray-500;", "color: " + _SECONDARY + ";"),
        ("color: $color-gray-400;", "color: " + _SECONDARY + ";"),
        ("color: $color-white;", "color: " + _PRIMARY + ";"),
    ]),
    ("footer-legal", "site-scape_ventures/"): ("replace", [
        ("            font-size: $font-size-sm;\n            color: $color-white;\n",
         "            font-size: $font-size-sm;\n            color: inherit;\n"),
    ]),
    ("footer-brand-section", "site-phytosync_com/"): ("replace", [
        ("            font-weight: 600;\n            color: $color-white;\n",
         "            font-weight: 600;\n            color: inherit;\n"),
    ]),
    ("footer-copyright", "site-phytosync_com/"): ("replace", [
        ("color: $color-gray-400;", "color: " + _SECONDARY + ";"),
    ]),
    ("robin_grid_row_posisiton_1", "site-demosphere_nl/"): ("replace", [
        (".ss-c-robin_grid_row_posisiton_1 {", ".ss-c-robin_grid_row_position_1 {"),
    ]),
    ("r-lineight", "site-demosphere_nl/"): ("replace", [
        (".ss-c-r-lineight {", ".ss-c-r-lineheight {"),
    ]),
    ("robin_small_section_oinly_text", "site-demosphere_nl/"): ("replace", [
        (".ss-c-robin_small_section_oinly_text {", ".ss-c-robin_small_section_only_text {"),
    ]),
    ("robins_colum_option4_section_3", "site-demosphere_nl/"): ("replace", [
        (".ss-c-robins_colum_option4_section_3 {", ".ss-c-robins_column_option4_section_3 {"),
    ]),
})

# Invalid literals in the site sources (sweep 2026-10-24): browsers drop them.
SITE_DECISIONS.update({
    ("align--left", "site-scape_foundation/"): ("replace", [
        ("align-items: left;", "align-items: flex-start;"),
    ]),
    ("card-horizontal__header", "site-starling_studio/"): ("replace", [
        ("text-box-trim: both;", "text-box-trim: trim-both;"),
    ]),
    ("double_diamond", "site-starling_studio/"): ("replace", [
        ("r: 75;", "r: 75px;"),
    ]),
    ("double_diamond__interactive", "site-starling_studio/"): ("replace", [
        ("r: 10;", "r: 10px;"),
    ]),
})

for _n in ("timeline-milestone", "timeline-end", "timeline-stat",
           "legend-item", "timeline-cta"):
    SITE_DECISIONS[(_n, "site-lovelacelabs_ai/")] = ("replace", [
        ("#718096", _MUTED), ("#2d3748", _TXT),
        ("background: #ccc;", "background: var(--ss-color-border-strong);"),
    ])


def apply_site_decision(name: str, src: str, body: str) -> str | None:
    """The block body after its decision; None when the block is dropped."""
    for (key, prefix), decision in SITE_DECISIONS.items():
        if key != name or not src.startswith(prefix):
            continue
        kind = decision[0]
        if kind == "drop":
            return None
        if kind == "scope":
            root = f"    .ss-c-{name} {{"
            body = body.replace(root, f"    {decision[1]} .ss-c-{name} {{", 1)
            for old, new in (decision[2] if len(decision) > 2 else []):
                body = body.replace(old, new)
        elif kind == "rewrite":
            body = decision[1]
        elif kind == "replace":
            for old, new in decision[1]:
                body = body.replace(old, new)
        return body
    return body


# ---------------------------------------------------------------------------
# Variable resolution
# ---------------------------------------------------------------------------

class Decl:
    """A declaration that reads a Sass variable, with its probes."""

    def __init__(self, block: "Block", prop: str, value: str):
        self.block, self.prop, self.value = block, prop, value
        self.key = norm(px_to_q(value))
        self.whole: int | None = None
        self.probes: dict[int, int] = {}   # atom index -> probe id


class Block:
    def __init__(self, name: str, src: str, path: str, offset: int, text: str):
        self.name, self.src, self.path, self.offset, self.text = name, src, path, offset, text
        self.decls: dict[str, list[Decl]] = defaultdict(list)


def is_spacing(atom: str) -> bool:
    a = NAMESPACE.sub("", atom)
    return bool(re.fullmatch(r"-?\$(space|spacing)[\w-]*", a)) or a.startswith("calc(")


def plan_probes(blocks: list[Block], work: Path, probe_root: Path) -> dict[str, list[tuple[int, str]]]:
    """Register every variable-reading declaration and the probes it needs.
    Returns {file: [(offset, probe_text), ...]}."""
    inserts: dict[str, list[tuple[int, str]]] = defaultdict(list)
    n = 0
    for b in blocks:
        blank = blank_comments(b.text)
        for m in DECL.finditer(blank):
            value = b.text[m.start("value"):m.end("value")]
            if "$" not in value or "$" not in blank[m.start("value"):m.end("value")]:
                continue
            d = Decl(b, m.group("prop"), value)
            parts = atoms(norm(value))
            if any(a in OPERATORS for a in parts):
                d.whole = n
                probe = f"\nzzprobe-{n}: {norm(value)};"
                n += 1
            else:
                probe = ""
                for i, a in enumerate(parts):
                    if "$" in a:
                        d.probes[i] = n
                        probe += f"\nzzprobe-{n}: {a};"
                        n += 1
            b.decls[d.key].append(d)
            inserts[b.path].append((b.offset + m.end(), probe))
    return inserts


def run_resolver(inserts, work: Path, probe_root: Path, sass_dir: Path,
                 packages: dict[str, str]) -> dict:
    if probe_root.exists():
        shutil.rmtree(probe_root)
    shutil.copytree(work, probe_root)
    sites: dict[str, dict] = {}
    for path, ins in inserts.items():
        rel = os.path.relpath(path, work)
        dest = probe_root / rel
        txt = dest.read_text(encoding="utf-8")
        for off, probe in sorted(ins, reverse=True):
            txt = txt[:off] + probe + "\n" + txt[off:]
        dest.write_text(txt, encoding="utf-8")
        site = rel.split("/", 1)[0]
        sites.setdefault(site, {"root": str(probe_root / site), "files": []})["files"].append(str(dest))
    for site, s in sites.items():
        s["entries"] = sorted(
            os.path.join(d, f)
            for d, _, fs in os.walk(s["root"]) for f in fs
            if f.endswith(".scss") and not f.startswith("_")
        )
    job = {"sass": str(sass_dir), "packages": packages, "sites": list(sites.values())}
    jp, rp = probe_root / "job.json", probe_root / "result.json"
    jp.write_text(json.dumps(job, indent=1))
    subprocess.run(["node", str(RESOLVER), str(jp), str(rp)], check=True)
    res = json.loads(rp.read_text())
    res["errors"] = {os.path.relpath(k, probe_root): v for k, v in res["errors"].items()}
    return res


class Resolver:
    def __init__(self, tokens: Tokens, values: dict[str, list[str]], errors: dict[str, str]):
        self.tokens, self.values, self.errors = tokens, values, errors
        self.unresolved: list[str] = []
        self.stats = Counter()

    def probe(self, pid: int) -> tuple[str | None, str]:
        vs = self.values.get(str(pid))
        if not vs:
            return None, "Sass emitted no value"
        if len(vs) > 1:
            return None, "ambiguous: " + " | ".join(vs)
        if vs[0] in ("", "null"):
            return None, "evaluates to null"
        return vs[0], ""

    def atom(self, atom: str, decl: Decl | None, index: int | None) -> tuple[str | None, str]:
        tok = self.tokens.mapped(atom)
        if tok is not None:
            self.stats["token map"] += 1
            return tok, ""
        a = NAMESPACE.sub("", atom)
        m = re.fullmatch(r"(-?)(\$[\w-]+)", a)
        if m and m.group(2) in FALLBACK_VARS:
            self.stats["fallback map"] += 1
            return px_to_q(m.group(1) + FALLBACK_VARS[m.group(2)]), ""
        names = VAR.findall(a)
        if ("(" in a and names and not re.search(r"\b(rgba?|hsla?|lighten|darken|mix|color\.\w+)\(", a)
                and all(n in FALLBACK_VARS or n in self.tokens.vars for n in names)):
            # calc(100vh - $ribbon_height_top), calc(-#{$x} - q(1)): fill in.
            self.stats["fallback map"] += 1
            filled = re.sub(r"(?<![\w)])(-?)(?:#\{(\$[\w-]+)\}|(\$[\w-]+))", lambda m: (
                ("-1 * " if m.group(1) else "")
                + (self.tokens.vars.get(m.group(2) or m.group(3))
                   or FALLBACK_VARS[m.group(2) or m.group(3)])), a)
            return px_to_q(filled), ""
        if decl is None or index not in decl.probes:
            return None, "no probe (not a plain declaration value)"
        v, why = self.probe(decl.probes[index])
        if v is None:
            return None, why
        self.stats["sass"] += 1
        self.touched = True
        return self.fit(atom, v) or self.tokens.value(v, is_spacing(atom)), ""

    def fit(self, atom: str, v: str) -> str | None:
        """Put the Sass value back into the source atom's own spelling when
        each variable maps onto one value of the result
        (`linear-gradient( to bottom, $a, $b )`), so only the variables
        change."""
        parts = re.split(r"(#\{\$[\w-]+\}|(?:[a-zA-Z_][\w-]*\.)?\$[\w-]+)", atom)
        if len(parts) < 3:
            return None
        pat = "".join(
            "(.+?)" if q % 2 else r"\s*".join(re.escape(x) for x in re.split(r"\s+", part))
            for q, part in enumerate(parts))
        if any(re.search(r"(^|[\s(,])-$", parts[q - 1]) for q in range(1, len(parts), 2)):
            return None  # unary minus: `-$x` must not become `-var(...)`
        m = re.fullmatch(pat, v)
        if not m or any("," in atoms(g) or not g.strip() for g in m.groups()):
            return None
        out = []
        for q, part in enumerate(parts):
            if q % 2:
                out.append(self.tokens.value(m.group((q + 1) // 2).strip(), is_spacing(part)))
            else:
                out.append(part)
        return "".join(out)

    def report(self, b: Block, what: str, why: str) -> None:
        err = self.errors.get(b.src, "")
        self.unresolved.append(
            f"{b.src.split('/', 1)[0]}  {b.src.split('/', 1)[1]}  .{b.name}  "
            f"{what}  [{why}{'; ' + err if err and 'no value' in why else ''}]")

    def block(self, b: Block, body: str, skip: bool) -> str:
        """Resolve every variable in a block body (after decisions)."""
        body = LOCAL_VAR_LINE.sub("", body)
        used: Counter = Counter()
        reported: set[str] = set()
        out, last = [], 0
        blank = blank_comments(body)
        for m in DECL.finditer(blank):
            value = body[m.start("value"):m.end("value")]
            if "$" not in blank[m.start("value"):m.end("value")]:
                continue
            key = norm(value)
            cands = b.decls.get(key, [])
            d = cands[min(used[key], len(cands) - 1)] if cands else None
            used[key] += 1
            new, problems = self.value(value, d)
            out.append(body[last:m.start("value")])
            if problems:
                reported.add(f"{m.group('prop')}: {norm(value)};")
                for p in problems:
                    self.report(b, f"{m.group('prop')}: {norm(value)}", p)
                if skip:
                    line_start = body.rfind("\n", 0, m.start("prop")) + 1
                    indent = body[line_start:m.start("prop")]
                    out[-1] = body[last:line_start]
                    names = " ".join(sorted(set(VAR.findall(value))))
                    out.append(f"{indent}// [unresolved {names}] {m.group('prop')}: {norm(value)};")
                    last = m.end()
                    continue
                new = value
            out.append(new)
            last = m.end("value")
        out.append(body[last:])
        body = "".join(out)
        # Variables outside declaration values (@media preludes, selectors).
        body = BREAKPOINT.sub(lambda m: f'map.get(breakpoints.$ss-breakpoints, "{m.group(1)}")', body)
        body = VAR.sub(lambda m: px_to_q(FALLBACK_VARS[m.group(0)])
                       if m.group(0) in FALLBACK_VARS else m.group(0), body)
        blank = blank_comments(body)
        for m in VAR.finditer(blank):
            if blank[max(0, m.start() - 12):m.start()] == "breakpoints.":
                continue
            line = norm(body[body.rfind("\n", 0, m.start()) + 1: body.find("\n", m.start())])
            if line not in reported:
                reported.add(line)
                self.report(b, line, "variable outside a declaration value")
        return body

    def value(self, value: str, d: Decl | None) -> tuple[str, list[str]]:
        spans = atom_spans(value)
        problems: list[str] = []
        if d is not None and d.whole is not None:
            # Sass arithmetic (`$unit * 1.5 0`): evaluate the whole value.
            v, why = self.probe(d.whole)
            if v is None:
                return value, [f"{norm(value)}: {why}"]
            self.stats["sass"] += 1
            spacing = all(is_spacing(n) for n in VAR.findall(NAMESPACE.sub("", value)))
            lead = value[: len(value) - len(value.lstrip())]
            return lead + self.tokens.value(v, spacing), []
        return self.value_atoms(value, spans, d, problems), problems

    def value_atoms(self, value, spans, d, problems) -> str:
        """Replace each variable atom; a declaration that needed Sass also
        gets its literal colours on tokens (as the 2026-10-24 repair did)."""
        self.touched = False
        repl = {}
        for i, (a, s, e) in enumerate(spans):
            if "$" not in a:
                continue
            r, why = self.atom(a, d, i)
            if r is None:
                problems.append(f"{a}: {why}")
            else:
                repl[i] = r
        new = value
        for i in reversed(range(len(spans))):
            a, s, e = spans[i]
            if i in repl:
                new = new[:s] + repl[i] + new[e:]
            elif self.touched and "$" not in a:
                new = new[:s] + COLOUR.sub(lambda m: self.tokens.colour(m.group(0)), a) + new[e:]
        return new


# ---------------------------------------------------------------------------
# Validation and layout
# ---------------------------------------------------------------------------

def validate(path: str, text: str) -> list[str]:
    bad = []
    blank = blank_comments(text)
    if blank.count("{") != blank.count("}"):
        bad.append(f"{path}: unbalanced braces")
    for m in DECL.finditer(blank):
        v = norm(m.group("value"))
        if re.search(r"\bunset\b", v) and v != "unset" and not v.startswith("unset !important"):
            ln = text.count("\n", 0, m.start()) + 1
            bad.append(f"{path}:{ln}: `unset` inside a value: {m.group('prop')}: {v}")
    for m in re.finditer(r"(?<![\w-])-var\(", blank):
        ln = text.count("\n", 0, m.start()) + 1
        bad.append(f"{path}:{ln}: negated custom property (`-var(...)`) is invalid")
    for m in VAR.finditer(blank):
        if blank[max(0, m.start() - 12):m.start()] != "breakpoints.":
            ln = text.count("\n", 0, m.start()) + 1
            bad.append(f"{path}:{ln}: unresolved Sass variable {m.group(0)}")
    return bad


MARK = re.compile(r"(?m)^[ \t]*// -- (?P<name>\S+)\s+\(from (?P<src>[^)]*)\) --[ \t]*\n")
LAYER_OPEN = "@layer ss.components {\n"


def module_layout() -> tuple[dict[tuple[str, str], str], dict[str, tuple[str, list]]]:
    """Where each block lives today: {(name, src): partial} and
    {partial: (header, [keys in order])}."""
    where, files = {}, {}
    for p in sorted(MODULES_DIR.glob("*/_*.sites.scss")):
        txt = p.read_text(encoding="utf-8")
        rel = str(p.relative_to(MODULES_DIR.parent))
        header = txt[: txt.index(LAYER_OPEN) + len(LAYER_OPEN)]
        keys = [(m.group("name"), m.group("src")) for m in MARK.finditer(txt)]
        files[rel] = (header, keys)
        for k in keys:
            where[k] = rel
    return where, files


UNASSIGNED_HEADER = """\
////
/// Blocks the harvest found that no module partial has yet.
////

@use "sass:map";
@use "../01-core/external" as *;
@use "../23-layout/breakpoints";

@layer ss.components {
"""


def strip_parity_comments(body: str) -> str:
    """The partials keep the generator's notes without the `[parity] ` tag."""
    return re.sub(r"(//|/\*) \[parity\] ", r"\1 ", body)


# ---------------------------------------------------------------------------
# Token map refresh
# ---------------------------------------------------------------------------

def refresh_token_map() -> int:
    """Mine the token map from the last shim (`SHIM_REV`) and the partials:
    for every block both have, pair the declarations up and record what each
    prelude variable and literal colour became."""
    shim = subprocess.run(["git", "-C", str(CORE), "show", f"{SHIM_REV}:{SHIM_PATH}"],
                          check=True, capture_output=True, text=True).stdout

    def blocks_of(txt):
        ms = list(MARK.finditer(txt))
        return {(m.group("name"), m.group("src")):
                txt[m.end(): ms[i + 1].start() if i + 1 < len(ms) else len(txt)]
                for i, m in enumerate(ms)}

    def decls(t):
        return [(m.group("prop"), norm(m.group("value"))) for m in DECL.finditer(blank_comments(t))]

    old = blocks_of(shim)
    cur = {}
    for p in sorted(MODULES_DIR.glob("*/_*.sites.scss")):
        cur.update(blocks_of(p.read_text(encoding="utf-8")))
    varc, atomc, colc = defaultdict(Counter), defaultdict(Counter), defaultdict(Counter)
    for k, ob in old.items():
        if k not in cur:
            continue
        a, b = decls(ob), decls(cur[k])
        sm = difflib.SequenceMatcher(None, [p for p, _ in a], [p for p, _ in b], autojunk=False)
        for i, j, n in sm.get_matching_blocks():
            for t in range(n):
                va, vb = a[i + t][1], b[j + t][1]
                aa, bb = atoms(va), atoms(vb)
                if len(aa) == len(bb):
                    for x, y in zip(aa, bb):
                        if "$" in x:
                            (varc if re.fullmatch(r"\$[\w-]+", x) else atomc)[x][y] += 1
                        elif COLOUR.fullmatch(x) and y.startswith("var(--ss-color-"):
                            colc[re.sub(r"\s+", " ", x.lower())][y] += 1
                elif "$" in va:
                    pat = "".join(f"(?P<g{q}>.+?)" if VAR.fullmatch(part) else re.escape(part)
                                  for q, part in enumerate(re.split(r"(\$[\w-]+)", va)))
                    mm = re.fullmatch(pat, vb)
                    if mm:
                        for q, part in enumerate(re.split(r"(\$[\w-]+)", va)):
                            if VAR.fullmatch(part):
                                varc[part][mm.group(f"g{q}")] += 1

    def majority(c: dict) -> dict:
        out = {}
        for k, cnt in sorted(c.items()):
            v, n = cnt.most_common(1)[0]
            if n / sum(cnt.values()) >= 0.75 and "unset" not in v and "$" not in v:
                out[k] = v
        return out

    data = {
        "_comment": ("Mined by `bin/gen_scapepress_parity.py --refresh-token-map` from "
                     f"{SHIM_REV}:{SHIM_PATH} and src/scss/31-modules/*/_*.sites.scss: "
                     "what each prelude variable, composite value and literal colour "
                     "became in the partials (majority of 75% or more)."),
        "variables": majority(varc),
        "atoms": majority(atomc),
        "colours": majority(colc),
    }
    TOKENS_PATH.write_text(json.dumps(data, indent=1, ensure_ascii=False) + "\n")
    print(f"wrote {TOKENS_PATH}: {len(data['variables'])} variables, "
          f"{len(data['atoms'])} atoms, {len(data['colours'])} colours", file=sys.stderr)
    return 0


# ---------------------------------------------------------------------------
# Harvest modes
# ---------------------------------------------------------------------------

def find_block(txt: str, name: str) -> tuple[int, str] | None:
    for sel, off, block in split_top_level_blocks(txt):
        if first_class_name(sel) == name:
            return off, block
    return None


def harvest_all(work: Path) -> list[Block]:
    """Every top-level class block; the earliest-defining site wins."""
    chosen: "OrderedDict[str, Block]" = OrderedDict()
    for p in collect_scss_files(work):
        try:
            txt = open(p, encoding="utf-8").read()
        except (OSError, UnicodeDecodeError):
            continue
        for sel, off, block in split_top_level_blocks(txt):
            name = first_class_name(sel)
            if name and CLASS_NAME.match(name) and name not in chosen:
                chosen[name] = Block(name, p[len(str(work)) + 1:], p, off, block)
    return list(chosen.values())


def harvest_partials(work: Path, sites_root: Path, as_of: str) -> tuple[list[Block], list[str]]:
    """The blocks the partials hold, each from the file its marker names.

    The shim was regenerated after 3deef213 from working trees, so a few
    blocks were not committed yet at `as_of`. For a file that lacks one of
    its blocks there, the earliest later revision (else the latest earlier
    one) that has all of them, or most, replaces it in the work tree."""
    notes = []
    _, files = module_layout()
    by_file: dict[str, list[str]] = defaultdict(list)
    for _, keys in files.values():
        for name, src in keys:
            by_file[src].append(name)

    def read(p: Path) -> str:
        try:
            return p.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            return ""

    for src, names in by_file.items():
        site, rel = src.split("/", 1)
        path = work / src
        if all(find_block(read(path), n) for n in names):
            continue
        repo = sites_root / site
        if not (repo / ".git").exists():
            continue
        later = git(repo, "log", "--reverse", "--format=%H", f"--after={as_of}", "--", rel).decode().split()
        earlier = git(repo, "log", "--format=%H", f"--before={as_of}", "--", rel).decode().split()
        best, best_n = None, sum(1 for n in names if find_block(read(path), n))
        for rev in later + earlier:
            try:
                txt = git(repo, "show", f"{rev}:{rel}").decode("utf-8")
            except (subprocess.CalledProcessError, UnicodeDecodeError):
                continue
            k = sum(1 for n in names if find_block(txt, n))
            if k > best_n:
                best, best_n = (rev, txt), k
            if k == len(names):
                break
        if best:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(best[1], encoding="utf-8")
            notes.append(f"{src}: read at {best[0][:8]} ({best_n}/{len(names)} blocks)")

    blocks = []
    for _, keys in files.values():
        for name, src in keys:
            path = work / src
            found = find_block(read(path), name)
            if found:
                blocks.append(Block(name, src, str(path), *found))
            else:
                notes.append(f"{src}: no `.{name}` block in any revision")
    return blocks, notes


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def packages(themes_root: Path) -> dict[str, str]:
    pk = {"stylescape": str(CORE), "unit.gl": str(CORE.parent / "unit.gl"),
          "hue.gl": str(CORE.parent / "hue.gl")}
    if themes_root.is_dir():
        for d in sorted(themes_root.iterdir()):
            pj = d / "package.json"
            if pj.is_file():
                try:
                    pk.setdefault(json.loads(pj.read_text())["name"], str(d))
                except (ValueError, KeyError):
                    pass
    return pk


def generate(args) -> int:
    out = Path(args.out_dir).resolve()
    if out == CORE or CORE / "src" in (out, *out.parents):
        raise GenError(f"refusing to write into {CORE / 'src'}: the partials are "
                       "hand-maintained; generate into a scratch dir and diff")
    sass_dir = Path(args.sass).resolve()
    if not (sass_dir / "sass.node.mjs").is_file():
        raise GenError(f"no Dart Sass package at {sass_dir} (pass --sass "
                       "<node_modules/sass>); variables are resolved with Sass")
    tokens = Tokens(json.loads(TOKENS_PATH.read_text()) if TOKENS_PATH.is_file() else {})

    work, probe_root = out / ".sites", out / ".probe"
    for note in materialise(Path(args.sites_root), args.as_of, work):
        print("note:", note, file=sys.stderr)

    if args.harvest == "all":
        blocks = harvest_all(work)
    else:
        blocks, notes = harvest_partials(work, Path(args.sites_root), args.as_of)
        for note in notes:
            print("note:", note, file=sys.stderr)
    print(f"harvested {len(blocks)} class blocks", file=sys.stderr)

    inserts = plan_probes(blocks, work, probe_root)
    res = run_resolver(inserts, work, probe_root, sass_dir, packages(Path(args.themes_root)))
    resolver = Resolver(tokens, res["values"], res["errors"])

    rendered: dict[tuple[str, str], str] = {}
    dropped = []
    for b in blocks:
        body = prefix_inner_classes(neutralize_imports(b.text))
        body = px_to_q("\n".join("    " + ln if ln.strip() else "" for ln in body.splitlines()))
        body = apply_site_decision(b.name, b.src, body + "\n\n")
        if body is None:
            dropped.append((b.name, b.src))
            continue
        body = resolver.block(b, body, args.on_unresolved == "skip")
        rendered[(b.name, b.src)] = (f"    // -- {b.name}  (from {b.src}) --\n"
                                     + strip_parity_comments(body).rstrip("\n") + "\n")

    if resolver.unresolved and args.on_unresolved == "fail":
        print(f"\n{len(resolver.unresolved)} unresolved Sass variable uses "
              "(site, file, block, declaration, reason):", file=sys.stderr)
        for u in resolver.unresolved:
            print("  " + u, file=sys.stderr)
        print("\nnothing written; fix the sources or the token map, or pass "
              "--on-unresolved=skip to comment those declarations out", file=sys.stderr)
        return 1

    where, files = module_layout()
    outputs: dict[str, str] = {}
    for rel, (header, keys) in files.items():
        parts = [rendered[k] for k in keys if k in rendered]
        body = "\n".join(parts)
        if "breakpoints.$ss-breakpoints" in body and '@use "sass:map";' not in header:
            header = header.replace('@use "../../01-core/external" as *;\n',
                                    '@use "sass:map";\n@use "../../01-core/external" as *;\n'
                                    '@use "../../23-layout/breakpoints";\n', 1)
        outputs[rel] = header + body + "}\n"
    extra = [k for k in rendered if k not in where]
    if extra:
        outputs["31-modules/_unassigned.sites.scss"] = (
            UNASSIGNED_HEADER + "\n".join(rendered[k] for k in extra) + "}\n")
    missing = sorted(k for k in where if k not in rendered)

    problems = [p for rel, txt in outputs.items() for p in validate(rel, txt)]
    if problems:
        print(f"{len(problems)} validation errors:", file=sys.stderr)
        for p in problems:
            print("  " + p, file=sys.stderr)
        return 1

    for rel, txt in outputs.items():
        (out / rel).parent.mkdir(parents=True, exist_ok=True)
        (out / rel).write_text(txt, encoding="utf-8")
    report = {
        "as_of": args.as_of,
        "blocks": len(rendered), "dropped_by_decision": dropped,
        "not_in_partials": extra, "in_partials_not_regenerated": missing,
        "resolution": dict(resolver.stats), "skipped": resolver.unresolved,
    }
    (out / "report.json").write_text(json.dumps(report, indent=1))
    print(f"wrote {len(outputs)} partials to {out} ({len(rendered)} blocks; "
          f"{len(extra)} unassigned, {len(missing)} not regenerated; "
          f"resolution {dict(resolver.stats)}; {len(resolver.unresolved)} skipped)",
          file=sys.stderr)
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--out-dir", help="scratch directory (never src/)")
    ap.add_argument("--sass", default=str(CORE / "node_modules" / "sass"),
                    help="Dart Sass package directory (default: core node_modules/sass)")
    ap.add_argument("--sites-root", default=str(DEFAULT_SITES_ROOT))
    ap.add_argument("--themes-root", default=str(DEFAULT_THEMES_ROOT))
    ap.add_argument("--as-of", default=DEFAULT_AS_OF,
                    help="read each site as of its last commit before this date")
    ap.add_argument("--harvest", choices=("partials", "all"), default="partials",
                    help="partials (default): the blocks the module partials hold, from "
                         "the files their markers name; all: every class block in the "
                         "sites, earliest-defining site wins (new ones go to "
                         "_unassigned.sites.scss)")
    ap.add_argument("--on-unresolved", choices=("fail", "skip"), default="fail",
                    help="fail (default): list unresolved variables and write nothing; "
                         "skip: comment each such declaration out")
    ap.add_argument("--refresh-token-map", action="store_true",
                    help=f"re-mine {TOKENS_PATH.name} from the last shim and the partials")
    args = ap.parse_args()
    if args.refresh_token_map:
        return refresh_token_map()
    if not args.out_dir:
        ap.error("--out-dir is required")
    try:
        return generate(args)
    except GenError as e:
        print(f"error: {e}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
