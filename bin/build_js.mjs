import path from "node:path";

import { build as viteBuild } from "vite";

async function buildOne({ outFileBase, minify }) {
    await viteBuild({
        configFile: false,
        build: {
            lib: {
                entry: path.resolve("src/ts/index.ts"),
                formats: ["es"],
                fileName: () => `${outFileBase}.js`,
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
    await buildOne({ outFileBase: "stylescape", minify: false });
    await buildOne({ outFileBase: "stylescape.min", minify: true });
    await buildOne({ outFileBase: "index", minify: false });
    await buildOne({ outFileBase: "index.min", minify: true });

    process.stdout.write(
        "Built JS bundles + sourcemaps (stylescape + index; unminified + minified)\n",
    );
}

await main();
