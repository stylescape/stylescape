#!/usr/bin/env node
/**
 * bundle_js.mjs
 *
 * Bundles the TypeScript entry (`src/ts/index.ts`) into `dist/js/` with esbuild.
 *
 * This exists because kist's `BundleAction` (from `@getkist/action-tsup`) can't
 * be loaded in this workspace — the plugin package ships no built `dist/`, so
 * kist's plugin discovery skips it and the action never registers. Rather than
 * depend on that broken toolchain, we bundle directly with the `esbuild` that
 * is already a devDependency. Wired into the kist pipeline via a
 * `RunScriptAction` step (see `kist.dev.yml` / `kist.yml`).
 *
 * Outputs (ESM, browser, ES2020, with sourcemaps):
 *   - dist/js/stylescape.js   (referenced by the demo pages as a module)
 *   - dist/js/index.js
 *
 * With `--prod` it additionally emits minified ESM (`*.min.js`) and IIFE
 * (`stylescape.iife.js` + minified) builds, mirroring `kist.yml`'s intent.
 *
 * Usage:
 *   node bin/bundle_js.mjs           # dev: ESM + sourcemaps
 *   node bin/bundle_js.mjs --prod    # prod: ESM + min + IIFE
 */

import path from "path";
import { fileURLToPath } from "url";

import * as esbuild from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const ENTRY = path.join(ROOT_DIR, "src", "ts", "index.ts");
const OUT_DIR = path.join(ROOT_DIR, "dist", "js");
const PROD = process.argv.includes("--prod");

/** Shared esbuild options for every build variant. */
const base = {
    bundle: true,
    platform: "browser",
    target: "es2020",
    sourcemap: true,
    // `error`, not `info`: esbuild's info-level build summary goes to stderr,
    // and kist's RunScriptAction flags *any* stderr as a failed step (a false
    // positive — the script still exits 0). Real build errors throw and are
    // handled by the try/catch below, which exits 1.
    logLevel: "error",
};

/**
 * Build definitions. The dev bundle is always produced; the rest are prod-only.
 */
const builds = [
    // ESM — the pages load `/js/stylescape.js` as `<script type="module">`.
    {
        entryPoints: {
            stylescape: ENTRY,
            index: ENTRY,
        },
        outdir: OUT_DIR,
        format: "esm",
    },
];

if (PROD) {
    builds.push(
        // Minified ESM
        {
            entryPoints: {
                "stylescape.min": ENTRY,
                "index.min": ENTRY,
            },
            outdir: OUT_DIR,
            format: "esm",
            minify: true,
        },
        // IIFE (+ minified) for classic <script> usage
        {
            entryPoints: { "stylescape.iife": ENTRY },
            outdir: OUT_DIR,
            format: "iife",
            globalName: "Stylescape",
        },
        {
            entryPoints: { "stylescape.iife.min": ENTRY },
            outdir: OUT_DIR,
            format: "iife",
            globalName: "Stylescape",
            minify: true,
        },
    );
}

try {
    await Promise.all(
        builds.map((opts) => esbuild.build({ ...base, ...opts })),
    );
    // eslint-disable-next-line no-console
    console.log(
        `[bundle_js] Bundled src/ts/index.ts -> dist/js (${PROD ? "prod" : "dev"})`,
    );
} catch (err) {
    // eslint-disable-next-line no-console
    console.error("[bundle_js] Bundle failed:", err.message ?? err);
    process.exit(1);
}
