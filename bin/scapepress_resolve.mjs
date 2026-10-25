#!/usr/bin/env node
// Evaluate Sass probe declarations in their site context.
//
// Helper for bin/gen_scapepress_parity.py. The generator copies each site's
// SCSS (as of the generation date) into a work tree and inserts probe
// declarations (`zzprobe-<n>: <sass expression>;`) right after every
// declaration that reads a Sass variable. This script compiles those files
// with Dart Sass, the same way the site built them, and reports what each
// probe evaluated to.
//
// Usage: node scapepress_resolve.mjs <job.json> <result.json>
//
// job.json: {
//   "sass": "/path/to/node_modules/sass",          (package directory)
//   "packages": { "<npm name>": "/path/to/repo" },  (for `pkg:` imports)
//   "sites": [{ "root": "...", "entries": ["..."], "files": ["..."] }]
// }
// result.json: { "values": { "<n>": ["<css value>", ...] },
//                "errors": { "<file>": "<first line of the Sass error>" } }
//
// Per file the compile falls back in this order, stopping at the first
// that emits the file's probes:
//   1. the file on its own, `pkg:` imports resolved to the local repos;
//   2. every site entry point (non-partial .scss) that pulls the file in,
//      for `@import`-style sites whose partials read variables defined by
//      the entry point;
//   3. the file on its own with unknown `pkg:` imports stubbed empty;
//   4. as 3, with `@include` / `@extend` neutralised (a mixin the site
//      pulls from a package that is not on disk).
// A probe that no compile emits stays unresolved; the generator then fails
// (or skips the declaration), it never guesses a value.

import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const [, , jobPath, outPath] = process.argv;
const job = JSON.parse(fs.readFileSync(jobPath, "utf8"));
const sass = await import(pathToFileURL(path.join(job.sass, "sass.node.mjs")).href);

function pick(v) {
    if (typeof v === "string") return v;
    if (!v) return null;
    for (const c of ["sass", "style", "default", "import"]) {
        if (v[c]) {
            const r = pick(v[c]);
            if (r) return r;
        }
    }
    return null;
}

function resolveSub(dir, sub) {
    const pj = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"));
    const ex = pj.exports || {};
    const key = sub ? "./" + sub : ".";
    let t = null;
    if (ex[key]) t = pick(ex[key]);
    else {
        for (const k of Object.keys(ex)) {
            if (!k.includes("*")) continue;
            const [a, b] = k.split("*");
            if (key.startsWith(a) && key.endsWith(b)) {
                const v = pick(ex[k]);
                if (v) {
                    t = v.replace("*", key.slice(a.length, key.length - b.length));
                    break;
                }
            }
        }
    }
    if (!t && !sub) t = pj.sass || pj.style || "index.scss";
    if (!t) t = sub;
    return path.resolve(dir, t);
}

function tryFile(p) {
    const d = path.dirname(p), b = path.basename(p);
    for (const c of [p, p + ".scss", path.join(d, "_" + b + ".scss"), path.join(d, "_" + b),
        path.join(p, "_index.scss"), path.join(p, "index.scss"), p + ".css"]) {
        if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
    }
    return null;
}

const pkgImporter = {
    findFileUrl(url) {
        if (!url.startsWith("pkg:")) return null;
        const spec = url.slice(4);
        const parts = spec.split("/");
        const n = spec.startsWith("@") ? 2 : 1;
        const dir = job.packages[parts.slice(0, n).join("/")];
        if (!dir) return null;
        const f = tryFile(resolveSub(dir, parts.slice(n).join("/")));
        return f ? pathToFileURL(f) : null;
    },
};

const stubImporter = {
    canonicalize(url) {
        return url.startsWith("pkg:") || url.startsWith("stub:")
            ? new URL("stub:" + encodeURIComponent(url))
            : null;
    },
    load() {
        return { contents: "", syntax: "scss" };
    },
};

const pad = (m, rep) => rep + " ".repeat(Math.max(0, m.length - rep.length));
const neutral = (t) => t
    .replace(/@include\s+[^;{}]+;/g, (m) => pad(m, ""))
    .replace(/@include\s+[^;{}]+\{/g, (m) => pad(m.slice(0, -1), "@media all ") + "{")
    .replace(/@extend\s+[^;{}]+;/g, (m) => pad(m, ""));

const SILENCE = ["import", "global-builtin", "if-function", "slash-div",
    "color-functions", "mixed-decls"];

function compile(file, root, importers, transform) {
    const lp = [path.dirname(file), path.join(root, "src", "static", "scss"),
        path.dirname(path.dirname(file))];
    const txt = fs.readFileSync(file, "utf8");
    return sass.compileString(transform ? transform(txt) : txt, {
        url: pathToFileURL(file), syntax: "scss", loadPaths: lp, importers,
        quietDeps: true, logger: sass.Logger.silent, silenceDeprecations: SILENCE,
    }).css;
}

const PROBE = /zzprobe-(\d+):\s*([^;]*);/g;
const values = {};
const errors = {};
const probeIds = (file) => [...fs.readFileSync(file, "utf8").matchAll(/zzprobe-(\d+):/g)].map((m) => m[1]);

// The first compile that emits a probe decides its value(s); a probe that
// one compile emits with several values (a loop, a mixin used twice) keeps
// them all and the generator treats it as ambiguous.
function harvest(css, wanted) {
    const local = {};
    for (const m of css.matchAll(PROBE)) {
        if (!wanted.has(m[1]) || values[m[1]]) continue;
        const v = m[2].trim();
        (local[m[1]] ??= []).includes(v) || local[m[1]].push(v);
    }
    Object.assign(values, local);
}

for (const site of job.sites) {
    const entryCss = new Map();
    const entryOut = (entry) => {
        if (!entryCss.has(entry)) {
            let css = null;
            for (const imps of [[pkgImporter], [pkgImporter, stubImporter]]) {
                try { css = compile(entry, site.root, imps); break; } catch { /* next */ }
            }
            entryCss.set(entry, css);
        }
        return entryCss.get(entry);
    };
    for (const file of site.files) {
        const wanted = new Set(probeIds(file));
        const done = () => [...wanted].every((id) => values[id]);
        let lastErr = null;
        try { harvest(compile(file, site.root, [pkgImporter]), wanted); } catch (e) { lastErr = e; }
        if (!done()) for (const entry of site.entries) {
            const css = entryOut(entry);
            if (css) harvest(css, wanted);
            if (done()) break;
        }
        if (!done()) {
            for (const tf of [null, neutral]) {
                try { harvest(compile(file, site.root, [pkgImporter, stubImporter], tf), wanted); }
                catch (e) { lastErr = e; }
                if (done()) break;
            }
        }
        if (!done() && lastErr) errors[file] = String(lastErr.message).split("\n")[0];
    }
}

fs.writeFileSync(outPath, JSON.stringify({ values, errors }, null, 1));
