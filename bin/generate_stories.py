#!/usr/bin/env python3
"""Generate Storybook stories for every Stylescape module from its jinja demo.

Source of truth: src/jinja/31-modules/*.html.jinja. Each template holds the
isolated component markup inside `{% set code_snippet %}...{% endset %}` blocks
(labelled by the nearest preceding <h3>/<h4>). A few templates instead put the
demo directly inside `ss-c-demo__subsection` sections; those are handled too.
"""
import re, glob, os, sys, textwrap

SRC = "src/jinja/31-modules"
OUT = "stories/components"
# Hand-written interactive stories we must not clobber.
SKIP = {"alert", "badge", "button"}

# Offline-safe placeholder image (inline SVG data URI).
PLACEHOLDER_IMG = (
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' "
    "width='600' height='400'%3E%3Crect width='600' height='400' "
    "fill='%23cccccc'/%3E%3Ctext x='50%25' y='50%25' fill='%23666666' "
    "font-family='sans-serif' font-size='24' text-anchor='middle' "
    "dominant-baseline='middle'%3EImage%3C/text%3E%3C/svg%3E"
)

def strip_comments(s):
    return re.sub(r"{#.*?#}", "", s, flags=re.S)

def collect_string_vars(s):
    """Single-line `{% set name = "value" %}` assignments (possibly wrapped)."""
    out = {}
    for m in re.finditer(r'{%\s*set\s+([a-zA-Z_][\w]*)\s*=\s*(.*?)%}', s, re.S):
        name, raw = m.group(1), m.group(2).strip()
        mm = re.match(r'^["\'](.*)["\']$', raw, re.S)
        if mm:
            out[name] = mm.group(1).strip()
    return out

def collect_block_vars(s):
    """`{% set name %}...{% endset %}` block assignments (excluding code_snippet)."""
    out = {}
    for m in re.finditer(r'{%\s*set\s+([a-zA-Z_][\w]*)\s*%}(.*?){%\s*endset\s*%}', s, re.S):
        name = m.group(1)
        if name == "code_snippet":
            continue
        out[name] = m.group(2)
    return out

def expand_for_loops(s):
    """Expand simple `{% for _ in range(N) %}...{% endfor %}` (no nesting)."""
    pat = re.compile(r'{%\s*for\s+\w+\s+in\s+range\((\d+)\)\s*%}(.*?){%\s*endfor\s*%}', re.S)
    while True:
        m = pat.search(s)
        if not m:
            break
        s = s[:m.start()] + (m.group(2) * int(m.group(1))) + s[m.end():]
    return s

def resolve(snippet, svars, bvars):
    s = strip_comments(snippet)
    s = expand_for_loops(s)
    # `{{ name | safe }}` / `{{ name }}` -> block or string var
    def repl_var(m):
        name = m.group(1).strip()
        base = re.split(r'\|', name)[0].strip()
        if base in bvars:
            return bvars[base]
        if base in svars:
            return svars[base]
        if "image_url" in base or "img" in base:
            return PLACEHOLDER_IMG
        return ""  # drop unresolved expression
    s = re.sub(r'{{\s*(.*?)\s*}}', repl_var, s)
    # any residual jinja statements -> drop the line's tag
    s = re.sub(r'{%.*?%}', '', s, flags=re.S)
    return s

def clean_ws(s):
    s = s.strip("\n")
    s = textwrap.dedent(s)
    # collapse >2 blank lines
    s = re.sub(r'\n{3,}', '\n\n', s)
    return s.strip()

def pascal_title(fname):
    stem = fname[:-len(".html.jinja")]
    return " ".join(p.capitalize() for p in re.split(r'[-_]', stem))

def ident(label, used):
    # PascalCase valid JS identifier
    words = re.split(r'[^a-zA-Z0-9]+', label)
    name = "".join(w[:1].upper() + w[1:] for w in words if w)
    if not name or not re.match(r'[A-Za-z_]', name[0]):
        name = "Example" + name
    base = name
    i = 2
    while name in used:
        name = f"{base}{i}"; i += 1
    used.add(name)
    return name

def nearest_label(content, pos):
    """Nearest preceding <h3>/<h4> text before position `pos`."""
    best = None
    for m in re.finditer(r'<h[34][^>]*>(.*?)</h[34]>', content, re.S):
        if m.start() < pos:
            best = re.sub(r'<[^>]+>', '', m.group(1)).strip()
        else:
            break
    return best

def esc(markup):
    return markup.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")

def extract_snippet_stories(content, svars, bvars):
    stories = []
    used = set()
    # Both forms: `{% set code_snippet %}...{% endset %}` (block) and the inline
    # `{% set code_snippet = "..." %}` (string) variant.
    pat = re.compile(
        r'{%\s*set code_snippet\s*%}(.*?){%\s*endset\s*%}'
        r'|{%\s*set code_snippet\s*=\s*"(.*?)"\s*%}', re.S)
    for m in pat.finditer(content):
        raw = m.group(1) if m.group(1) is not None else m.group(2)
        label = nearest_label(content, m.start()) or "Example"
        markup = clean_ws(resolve(raw, svars, bvars))
        if not markup.strip():
            continue
        stories.append((ident(label, used), markup))
    return stories

def extract_whole_content(content, svars, bvars):
    """Last-resort fallback: templates that inline raw component markup with no
    code_snippet / subsection scaffolding (e.g. chat)."""
    body = re.sub(r'<header class="ss-c-demo__section__header">.*?</header>', '', content, flags=re.S)
    markup = clean_ws(resolve(body, svars, bvars))
    text = re.sub(r'<[^>]+>', '', markup).strip()
    if len(text) < 20:  # only chrome left (e.g. cursor) -> nothing to show
        return []
    return [("Example", markup)]

def extract_subsection_stories(content, svars, bvars):
    """Fallback for templates without code_snippet blocks."""
    stories = []
    used = set()
    for m in re.finditer(r'<section class="ss-c-demo__subsection"[^>]*>(.*?)</section>', content, re.S):
        inner = m.group(1)
        lm = re.search(r'<h[34][^>]*>(.*?)</h[34]>', inner, re.S)
        label = re.sub(r'<[^>]+>', '', lm.group(1)).strip() if lm else "Example"
        # drop the leading heading + any demo-group wrapper labels, keep the rest
        body = re.sub(r'<h[34][^>]*>.*?</h[34]>', '', inner, count=1, flags=re.S)
        markup = clean_ws(resolve(body, svars, bvars))
        if not markup.strip():
            continue
        stories.append((ident(label, used), markup))
    return stories

def build_file(fname):
    path = os.path.join(SRC, fname)
    s = open(path).read()
    bm = re.search(r'{%-?\s*block content\s*%}(.*?){%-?\s*endblock', s, re.S)
    content = bm.group(1) if bm else s
    svars = collect_string_vars(s)
    bvars = collect_block_vars(s)
    stories = extract_snippet_stories(content, svars, bvars)
    if not stories:
        stories = extract_subsection_stories(content, svars, bvars)
    if not stories:
        stories = extract_whole_content(content, svars, bvars)
    if not stories:
        return None
    title = pascal_title(fname)
    lines = []
    lines.append("// " + "=" * 74)
    lines.append(f"// Stylescape | Storybook — {title}")
    lines.append("// " + "=" * 74)
    lines.append(f"// Auto-generated from src/jinja/31-modules/{fname}.")
    lines.append("// Regenerate with `npm run generate:stories` (do not edit by hand).")
    lines.append("// " + "=" * 74)
    lines.append("")
    lines.append('import type { Meta, StoryObj } from "@storybook/html-vite";')
    lines.append('import { html } from "../html";')
    lines.append("")
    lines.append("const meta: Meta = {")
    lines.append(f'    title: "Components/{title}",')
    lines.append('    tags: ["autodocs"],')
    lines.append("};")
    lines.append("")
    lines.append("export default meta;")
    lines.append("type Story = StoryObj;")
    lines.append("")
    for name, markup in stories:
        indented = "\n".join(("        " + ln).rstrip() for ln in esc(markup).splitlines())
        lines.append(f"export const {name}: Story = {{")
        lines.append("    render: () => html`")
        lines.append(indented)
        lines.append("    `,")
        lines.append("};")
        lines.append("")
    return "\n".join(lines).rstrip() + "\n", len(stories)

def main():
    os.makedirs(OUT, exist_ok=True)
    files = sorted(os.path.basename(p) for p in glob.glob(os.path.join(SRC, "*.html.jinja")))
    total_files = 0; total_stories = 0; skipped = []; empty = []
    for f in files:
        stem = f[:-len(".html.jinja")]
        if stem in SKIP:
            skipped.append(stem); continue
        res = build_file(f)
        if res is None:
            empty.append(stem); continue
        text, n = res
        out = os.path.join(OUT, pascal_title(f).replace(" ", "") + ".stories.ts")
        open(out, "w").write(text)
        total_files += 1; total_stories += n
    print(f"generated {total_files} story files, {total_stories} stories")
    print(f"skipped (hand-written): {skipped}")
    print(f"no-story (empty): {empty}")

if __name__ == "__main__":
    os.chdir(sys.argv[1] if len(sys.argv) > 1 else ".")
    main()
