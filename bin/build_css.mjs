import { promises as fs } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

import postcss from "postcss";
import * as sass from "sass";

const require = createRequire(import.meta.url);

function getKistPostcssConfig(repoRoot, styleOption) {
    const relPath =
        styleOption === "compressed" ?
            "node_modules/kist/js/actions/StyleProcessingAction/postcss.config.compressed.js"
        :   "node_modules/kist/js/actions/StyleProcessingAction/postcss.config.expanded.js";

    // Load by absolute path to bypass Node's package "exports" restrictions.
    const modPath = path.join(repoRoot, relPath);
    const loaded = require(modPath);
    return loaded?.default ?? loaded;
}

async function ensureDir(dirPath) {
    await fs.mkdir(dirPath, { recursive: true });
}

async function writeFileWithMap({ cssPath, css, map }) {
    await ensureDir(path.dirname(cssPath));
    await fs.writeFile(cssPath, css, "utf8");

    if (map) {
        await fs.writeFile(`${cssPath}.map`, map.toString(), "utf8");
    }
}

async function buildOne({ inputFile, outputFile, styleOption }) {
    const sassResult = await sass.compileAsync(inputFile, {
        style: styleOption,
        sourceMap: true,
        sourceMapIncludeSources: true,
        importers: [new sass.NodePackageImporter()],
    });

    const postcssConfig = getKistPostcssConfig(process.cwd(), styleOption);

    const processed = await postcss(postcssConfig.plugins).process(
        sassResult.css,
        {
            from: inputFile,
            to: outputFile,
            map: {
                inline: false,
                annotation: `${path.basename(outputFile)}.map`,
                prev: sassResult.sourceMap,
                sourcesContent: true,
            },
        },
    );

    await writeFileWithMap({
        cssPath: outputFile,
        css: processed.css,
        map: processed.map,
    });
}

async function main() {
    const repoRoot = process.cwd();

    const inputFile = path.join(repoRoot, "src/scss/index.scss");

    await buildOne({
        inputFile,
        outputFile: path.join(repoRoot, "dist/css/stylescape.css"),
        styleOption: "expanded",
    });

    await buildOne({
        inputFile,
        outputFile: path.join(repoRoot, "dist/css/stylescape.min.css"),
        styleOption: "compressed",
    });

    process.stdout.write("Built CSS + sourcemaps (expanded + minified)\n");
}

await main();
