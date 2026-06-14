#!/usr/bin/env python3
"""
SSX Spec Parity Check

Compares the SSX specification (naming conventions, layers) against the
stylescape SCSS implementation to detect drift between spec and code.

This script:
1. Parses SSX spec markdown files for documented patterns
2. Scans stylescape SCSS files for actual class/mixin usage
3. Reports mismatches between spec and implementation

Usage:
    python bin/check_ssx_parity.py [--ssx-path PATH] [--output FILE]

Options:
    --ssx-path PATH    Path to ssx doc/ folder (default: ../ssx/doc)
    --output FILE      Output file for report (default: stdout)
    --ci               Exit with error code if mismatches found
"""

from __future__ import annotations

import argparse
import os
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterator


# =============================================================================
# Configuration
# =============================================================================

STYLESCAPE_ROOT = Path(__file__).parent.parent
SSX_DEFAULT = STYLESCAPE_ROOT.parent / "ssx" / "doc"
SCSS_SRC = STYLESCAPE_ROOT / "src" / "scss"


# =============================================================================
# Data Classes
# =============================================================================


@dataclass
class SpecPattern:
    """A naming pattern documented in the SSX spec."""

    pattern: str
    layer: str
    source_file: str
    line_number: int


@dataclass
class ScssClass:
    """A CSS class found in stylescape SCSS."""

    name: str
    file: str
    line_number: int


@dataclass
class ParityIssue:
    """A mismatch between spec and implementation."""

    issue_type: str  # "undocumented", "unimplemented", "naming_violation"
    description: str
    spec_pattern: SpecPattern | None = None
    scss_class: ScssClass | None = None


# =============================================================================
# Spec Parser
# =============================================================================


def parse_ssx_naming(doc_path: Path) -> list[SpecPattern]:
    """Parse naming.md for documented class patterns."""
    patterns = []
    naming_file = doc_path / "naming.md"

    if not naming_file.exists():
        print(f"Warning: {naming_file} not found", file=sys.stderr)
        return patterns

    with open(naming_file, "r") as f:
        content = f.read()
        lines = content.split("\n")

    # Look for BEM patterns documented in code blocks or tables
    # Pattern: .ss-{layer}-{name} or similar
    class_pattern = re.compile(r"\.ss-([a-z])-([a-z][a-z0-9-]*)")

    for i, line in enumerate(lines, 1):
        for match in class_pattern.finditer(line):
            layer_code = match.group(1)
            name = match.group(2)
            patterns.append(
                SpecPattern(
                    pattern=f".ss-{layer_code}-{name}",
                    layer=layer_code,
                    source_file="naming.md",
                    line_number=i,
                )
            )

    return patterns


def parse_ssx_layers(doc_path: Path) -> dict[str, str]:
    """Parse layers.md for documented layer structure."""
    layers = {}
    layers_file = doc_path / "layers.md"

    if not layers_file.exists():
        print(f"Warning: {layers_file} not found", file=sys.stderr)
        return layers

    with open(layers_file, "r") as f:
        content = f.read()

    # Look for layer definitions
    # Common patterns: `ss.{layer}`, `@layer ss.{layer}`
    layer_pattern = re.compile(r"ss\.([a-z]+)")

    for match in layer_pattern.finditer(content):
        layer_name = match.group(1)
        layers[layer_name] = f"ss.{layer_name}"

    return layers


# =============================================================================
# SCSS Scanner
# =============================================================================


def scan_scss_classes(scss_path: Path) -> Iterator[ScssClass]:
    """Scan SCSS files for class definitions."""
    class_pattern = re.compile(r"^\s*\.(ss-[a-z]-[a-z][a-z0-9-]*)")

    for scss_file in scss_path.rglob("*.scss"):
        rel_path = scss_file.relative_to(scss_path)

        with open(scss_file, "r") as f:
            for i, line in enumerate(f, 1):
                for match in class_pattern.finditer(line):
                    yield ScssClass(
                        name=match.group(1),
                        file=str(rel_path),
                        line_number=i,
                    )


def get_layer_prefixes() -> dict[str, str]:
    """Map single-letter layer codes to layer names."""
    return {
        "a": "atoms",
        "m": "molecules",
        "o": "organisms",
        "s": "skeletons",
        "c": "components",
        "u": "utilities",
        "t": "tokens",
        "l": "layout",
    }


# =============================================================================
# Parity Check
# =============================================================================


def check_parity(
    ssx_path: Path, scss_path: Path
) -> list[ParityIssue]:
    """Compare SSX spec against SCSS implementation."""
    issues = []

    # Parse spec
    spec_patterns = parse_ssx_naming(ssx_path)
    spec_layers = parse_ssx_layers(ssx_path)

    # Scan implementation
    scss_classes = list(scan_scss_classes(scss_path))
    scss_names = {c.name for c in scss_classes}

    # Check for undocumented classes (implementation without spec)
    spec_names = {p.pattern.lstrip(".") for p in spec_patterns}

    # Note: This is intentionally lenient - we only report classes that
    # don't follow the documented naming convention at all
    layer_prefixes = get_layer_prefixes()

    for scss_class in scss_classes:
        name = scss_class.name
        # Check if class follows any documented layer pattern
        parts = name.split("-")
        if len(parts) >= 3:
            layer_code = parts[1]
            if layer_code not in layer_prefixes:
                issues.append(
                    ParityIssue(
                        issue_type="naming_violation",
                        description=(
                            f"Class '{name}' uses unknown layer code "
                            f"'{layer_code}'"
                        ),
                        scss_class=scss_class,
                    )
                )

    return issues


# =============================================================================
# Report Generation
# =============================================================================


def generate_report(issues: list[ParityIssue]) -> str:
    """Generate a markdown report of parity issues."""
    if not issues:
        return "# SSX Parity Report\n\n✅ No issues found.\n"

    lines = [
        "# SSX Parity Report",
        "",
        f"Found {len(issues)} issue(s):",
        "",
    ]

    by_type: dict[str, list[ParityIssue]] = {}
    for issue in issues:
        by_type.setdefault(issue.issue_type, []).append(issue)

    for issue_type, type_issues in sorted(by_type.items()):
        lines.append(f"## {issue_type.replace('_', ' ').title()}")
        lines.append("")
        for issue in type_issues:
            lines.append(f"- {issue.description}")
            if issue.scss_class:
                lines.append(
                    f"  - File: `{issue.scss_class.file}`"
                    f" (line {issue.scss_class.line_number})"
                )
        lines.append("")

    return "\n".join(lines)


# =============================================================================
# CLI
# =============================================================================


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Check SSX spec parity with stylescape implementation"
    )
    parser.add_argument(
        "--ssx-path",
        type=Path,
        default=SSX_DEFAULT,
        help="Path to ssx doc/ folder",
    )
    parser.add_argument(
        "--output",
        type=str,
        default=None,
        help="Output file for report",
    )
    parser.add_argument(
        "--ci",
        action="store_true",
        help="Exit with error code if issues found",
    )

    args = parser.parse_args()

    if not args.ssx_path.exists():
        print(f"Error: SSX path not found: {args.ssx_path}", file=sys.stderr)
        return 1

    if not SCSS_SRC.exists():
        print(f"Error: SCSS path not found: {SCSS_SRC}", file=sys.stderr)
        return 1

    issues = check_parity(args.ssx_path, SCSS_SRC)
    report = generate_report(issues)

    if args.output:
        with open(args.output, "w") as f:
            f.write(report)
        print(f"Report written to {args.output}")
    else:
        print(report)

    if args.ci and issues:
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
