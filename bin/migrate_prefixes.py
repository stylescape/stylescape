#!/usr/bin/env python3
"""Migrate namespace-only `ss-*` class names to layered `ss-{f,l,a,u}-*`.

Operates on .scss, .jinja, .html files under src/ and the repo root test
HTML files. Uses word-boundary regex so already-prefixed names are not
double-prefixed.
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Mapping: old -> new
MAP: dict[str, str] = {
    # ---- 22-flow -> ss-f-
    **{
        f"ss-{n}": f"ss-f-{n}"
        for n in [
            "center",
            "center-flex",
            "center-full",
            "center-narrow",
            "center-text",
            "center-wide",
            "cluster",
            "cluster-between",
            "cluster-center",
            "cluster-end",
            "cluster-lg",
            "cluster-md",
            "cluster-sm",
            "cluster-xl",
            "cluster-xs",
            "cover",
            "cover-center",
            "cover-dynamic",
            "cover-full",
            "cover-half",
            "frame-cinema",
            "frame-golden",
            "frame-landscape",
            "frame-portrait",
            "frame-square",
            "frame-video",
            "inline",
            "inline-center",
            "inline-lg",
            "inline-md",
            "inline-sm",
            "inline-stretch",
            "inline-xs",
            "split",
            "split-end",
            "split-nowrap",
            "split-start",
            "split-stretch",
            "stack",
            "stack-lg",
            "stack-md",
            "stack-sm",
            "stack-xl",
            "stack-xs",
        ]
    },
    # ---- 23-layout -> ss-l-
    **{
        f"ss-{n}": f"ss-l-{n}"
        for n in [
            "article",
            "article__body",
            "article__footer",
            "article__header",
            "content-center",
            "content-main",
            "content-narrow",
            "content-wide",
            "column-break-avoid",
            "column-span-all",
            "columns",
            "columns-1",
            "columns-2",
            "columns-3",
            "columns-4",
            "columns-auto",
            "columns-ruled",
            "container",
            "container-2xl",
            "container-fluid",
            "container-full",
            "container-lg",
            "container-md",
            "container-sm",
            "container-xl",
            "grid",
            "grid-12",
            "grid-2",
            "grid-3",
            "grid-4",
            "grid-5",
            "grid-6",
            "grid-auto",
            "grid-gap-0",
            "grid-gap-lg",
            "grid-gap-md",
            "grid-gap-sm",
            "grid-gap-xl",
            "grid-gap-xs",
            "page__body",
            "page-dashboard",
            "page-fixed-header",
            "page-holy-grail",
            "page-landing",
            "page-sidebar-both",
            "page-sidebar-left",
            "page-sidebar-right",
            "page-standard",
            "page-sticky-header",
            "region",
            "region-2xl",
            "region-divided",
            "region-hero",
            "region-lg",
            "region-md",
            "region-sm",
            "region-xl",
        ]
    },
    # ---- 24-appearance -> ss-a-
    **{
        f"ss-{n}": f"ss-a-{n}"
        for n in [
            "bg-black",
            "bg-contain",
            "bg-cover",
            "bg-current",
            "bg-error",
            "bg-fixed",
            "bg-info",
            "bg-muted",
            "bg-primary",
            "bg-secondary",
            "bg-success",
            "bg-transparent",
            "bg-warning",
            "bg-white",
            "border",
            "border-0",
            "border-b",
            "border-l",
            "border-r",
            "border-t",
            "border-x",
            "border-y",
            "rounded",
            "rounded-full",
            "rounded-lg",
            "rounded-md",
            "rounded-none",
            "rounded-sm",
            "rounded-xl",
            "elevation-0",
            "elevation-1",
            "elevation-2",
            "elevation-3",
            "elevation-4",
            "elevation-5",
            "elevation-6",
            "elevation-interactive",
            "shadow",
            "shadow-2xl",
            "shadow-inner",
            "shadow-lg",
            "shadow-md",
            "shadow-none",
            "shadow-sm",
            "shadow-xl",
            "backdrop-blur",
            "backdrop-blur-lg",
            "backdrop-blur-md",
            "backdrop-blur-none",
            "backdrop-blur-sm",
            "backdrop-blur-xl",
            "blur",
            "blur-2xl",
            "blur-3xl",
            "blur-lg",
            "blur-md",
            "blur-none",
            "blur-sm",
            "blur-xl",
            "brightness-100",
            "brightness-105",
            "brightness-110",
            "brightness-125",
            "brightness-150",
            "brightness-50",
            "brightness-75",
            "brightness-90",
            "grayscale",
            "grayscale-0",
            "invert",
            "invert-0",
            "hover-opacity-100",
            "opacity-0",
            "opacity-10",
            "opacity-100",
            "opacity-20",
            "opacity-25",
            "opacity-30",
            "opacity-40",
            "opacity-5",
            "opacity-50",
            "opacity-60",
            "opacity-70",
            "opacity-75",
            "opacity-80",
            "opacity-90",
            "opacity-95",
            "surface",
            "surface-interactive",
            "surface-inverted",
            "surface-muted",
            "surface-primary",
        ]
    },
    # ---- overrides -> ss-u-
    "ss-prose": "ss-u-prose",
    "ss-no-print": "ss-u-no-print",
    "ss-print-only": "ss-u-print-only",
    # ---- 22-flow leftover
    "ss-frame": "ss-f-frame",
    # ---- 91-development -> ss-u-
    "ss-debug-baseline": "ss-u-debug-baseline",
    "ss-debug-flow": "ss-u-debug-flow",
    "ss-debug-flow-boxes": "ss-u-debug-flow-boxes",
    "ss-debug-flow-depth": "ss-u-debug-flow-depth",
}

# Sort keys longest-first so e.g. `ss-cluster-md` matches before `ss-cluster`.
ORDERED = sorted(MAP.keys(), key=len, reverse=True)

# Single combined regex with named groups for one-pass replace.
PATTERN = re.compile(r"\b(" + "|".join(re.escape(k) for k in ORDERED) + r")\b")


def replace(match: re.Match[str]) -> str:
    return MAP[match.group(0)]


def main() -> None:
    targets: list[Path] = []
    for sub in ("src/scss", "src/jinja"):
        targets.extend((ROOT / sub).rglob("*.scss"))
        targets.extend((ROOT / sub).rglob("*.jinja"))
    for name in ("test_js.html", "test_unpkg.html"):
        p = ROOT / name
        if p.exists():
            targets.append(p)

    changed = 0
    for path in targets:
        original = path.read_text(encoding="utf-8")
        updated = PATTERN.sub(replace, original)
        if updated != original:
            path.write_text(updated, encoding="utf-8")
            changed += 1

    print(f"Updated {changed} file(s); {len(MAP)} mappings applied.")


if __name__ == "__main__":
    main()
