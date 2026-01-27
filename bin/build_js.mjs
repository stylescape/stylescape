import path from "node:path";

import { build as viteBuild } from "vite";

async function buildOne({ outFileBase, minify, format = "es" }) {
    await viteBuild({
        configFile: false,
        build: {
            lib: {
                entry: path.resolve("src/ts/index.ts"),
                formats: [format],
                fileName: () => `${outFileBase}.js`,
                name: "stylescape", // Global name for IIFE/UMD builds
            },
            outDir: path.resolve("dist/js"),
            emptyOutDir: false,
            sourcemap: true,
            minify: minify ? "esbuild" : false,
            target: "es2020",
            rollupOptions: {
                // Force a single-file bundle so consumers get dist/js/stylescape(.min).js
                output: {
                    inlineDynamicImports: true,
                },
            },
        },
    });
}

async function main() {
    // ESM builds (for type="module" scripts)
    await buildOne({ outFileBase: "stylescape", minify: false, format: "es" });
    await buildOne({
        outFileBase: "stylescape.min",
        minify: true,
        format: "es",
    });
    await buildOne({ outFileBase: "index", minify: false, format: "es" });
    await buildOne({ outFileBase: "index.min", minify: true, format: "es" });

    // IIFE builds (for regular script tags without type="module")
    await buildOne({
        outFileBase: "stylescape.iife",
        minify: false,
        format: "iife",
    });
    await buildOne({
        outFileBase: "stylescape.iife.min",
        minify: true,
        format: "iife",
    });

    process.stdout.write(
        "Built JS bundles + sourcemaps (ESM + IIFE; unminified + minified)\n",
    );
}

await main();
