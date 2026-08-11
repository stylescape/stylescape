#!/usr/bin/env python3
"""
Bulk migration: prefix every un-prefixed legacy class token in jinja
templates and the SCSS compat shims with `ss-c-`.

Scope:
  * src/jinja/**/*.jinja           — rewrite tokens inside class="..." values
  * src/scss/32-utilities/_legacy-compat.scss
  * src/scss/32-utilities/_legacy-components-compat.scss
                                   — rewrite class SELECTORS (.foo  ->  .ss-c-foo)

A token is "legacy / un-prefixed" when it:
  * is a valid CSS identifier ([A-Za-z][A-Za-z0-9_-]*),
  * does NOT already start with `ss-`,
  * does NOT start with a small allow-list of foreign / state prefixes
    that we leave alone (icon classes, JS hooks, ARIA state hooks, jinja
    interpolation, framework integrations).

After migration:
  * Every class attribute in jinja templates contains only `ss-*` or
    allow-listed tokens.
  * Every class selector in the compat shims is `.ss-c-...` so the
    compat shim becomes the canonical styling for those components.
  * Modules under src/scss/31-modules/ still emit their own `.ss-c-*`
    selectors; the compat shim, loaded later in `@layer ss.utilities`,
    overrides them — i.e. duplicates resolve to the legacy look.
"""

from __future__ import annotations

import os
import re
import sys

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

JINJA_DIR = os.path.join(ROOT, "src", "jinja")
COMPAT_FILES = [
    os.path.join(ROOT, "src", "scss", "32-utilities", "_legacy-compat.scss"),
    os.path.join(
        ROOT, "src", "scss", "32-utilities", "_legacy-components-compat.scss"
    ),
]

# Token prefixes that we leave alone — these are not "legacy stylescape"
# class names and must not get an `ss-c-` prefix.
ALLOW_PREFIXES = (
    "ss-",        # already migrated
    "i_",         # icon font
    "i-",         # icon font
    "octicon",    # github octicons
    "fa-",        # font awesome
    "js-",        # behaviour hooks
    "is-",        # state hooks
    "has-",       # state hooks
    "data-",      # data hooks (rare in class but seen)
    "aria-",      # aria hooks (rare)
)

# Literal tokens to leave alone (HTML attribute words, framework hooks).
ALLOW_LITERAL = {
    "active", "open", "hidden", "show", "shown", "in", "out",
    "disabled", "selected", "checked", "focus", "loading",
}

# Tokens with these substrings come from jinja expressions, leave alone.
SKIP_IF_CONTAINS = ("{{", "}}", "{%", "%}")

TOKEN_RE = re.compile(r"^[A-Za-z][A-Za-z0-9_-]*$")
CLASS_ATTR_RE = re.compile(
    r"""(class\s*=\s*['"])([^'"]*)(['"])""", re.IGNORECASE
)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def should_prefix(tok: str) -> bool:
    """Return True if `tok` is a legacy un-prefixed class we should rename."""
    if not tok:
        return False
    if any(s in tok for s in SKIP_IF_CONTAINS):
        return False
    if tok in ALLOW_LITERAL:
        return False
    if tok.startswith(ALLOW_PREFIXES):
        return False
    if not TOKEN_RE.match(tok):
        return False
    return True


def prefix_token(tok: str) -> str:
    return "ss-c-" + tok


# ---------------------------------------------------------------------------
# Jinja migration
# ---------------------------------------------------------------------------


def migrate_class_attr(match: "re.Match[str]") -> str:
    head, value, tail = match.group(1), match.group(2), match.group(3)
    out_tokens = []
    for raw in value.split():
        # Preserve any jinja interpolation chunks as-is.
        if "{{" in raw or "{%" in raw or "}}" in raw or "%}" in raw:
            out_tokens.append(raw)
            continue
        if should_prefix(raw):
            out_tokens.append(prefix_token(raw))
        else:
            out_tokens.append(raw)
    # Preserve a single space separator; original whitespace details are lost
    # but jinja/HTML doesn't care about run-length whitespace inside class=.
    return f"{head}{' '.join(out_tokens)}{tail}"


def migrate_jinja_file(path: str) -> tuple[int, int]:
    """Return (changed_classes, changed_files_inc) — 1 if file changed else 0."""
    txt = open(path, encoding="utf-8").read()
    before = txt
    new = CLASS_ATTR_RE.sub(migrate_class_attr, txt)
    if new == before:
        return 0, 0
    open(path, "w", encoding="utf-8").write(new)
    return new.count("ss-c-") - before.count("ss-c-"), 1


# ---------------------------------------------------------------------------
# SCSS compat-shim migration
# ---------------------------------------------------------------------------

# Match a class selector at the start of a CSS-ish token: `.foo`, `.foo:hover`,
# `.foo.bar`, `.foo--mod`, `.foo__el`. We only rewrite the IDENTIFIER, not the
# leading dot or trailing punctuation.
SCSS_CLASS_SEL_RE = re.compile(r"\.([A-Za-z][A-Za-z0-9_-]*)")


def migrate_scss_class_sel(match: "re.Match[str]") -> str:
    name = match.group(1)
    if should_prefix(name):
        return "." + prefix_token(name)
    return match.group(0)


def migrate_scss_file(path: str) -> int:
    txt = open(path, encoding="utf-8").read()
    new = SCSS_CLASS_SEL_RE.sub(migrate_scss_class_sel, txt)
    if new == txt:
        return 0
    open(path, "w", encoding="utf-8").write(new)
    return 1


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> int:
    total_files = 0
    total_changes = 0

    # Jinja templates
    for d, _, fs in os.walk(JINJA_DIR):
        for f in fs:
            if not f.endswith(".jinja"):
                continue
            p = os.path.join(d, f)
            changes, file_changed = migrate_jinja_file(p)
            if file_changed:
                total_files += 1
                total_changes += changes
    print(f"jinja: {total_files} files changed, ~{total_changes} tokens prefixed")

    # SCSS compat shims
    scss_changed = 0
    for p in COMPAT_FILES:
        if not os.path.exists(p):
            continue
        if migrate_scss_file(p):
            scss_changed += 1
    print(f"scss compat shims: {scss_changed} files changed")

    return 0


if __name__ == "__main__":
    sys.exit(main())
