import { promises as fs } from "node:fs";
import path from "node:path";

async function listFiles(dirPath, ext) {
    const files = [];

    async function walk(currentPath) {
        const entries = await fs.readdir(currentPath, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);
            if (entry.isDirectory()) {
                await walk(fullPath);
                continue;
            }
            if (entry.isFile() && fullPath.endsWith(ext)) {
                files.push(fullPath);
            }
        }
    }

    await walk(dirPath);
    return files;
}

function collectMatches(targetSet, regex, text, transformer) {
    for (const match of text.matchAll(regex)) {
        targetSet.add(transformer(match));
    }
}

async function main() {
    const repoRoot = process.cwd();

    const mixinFiles = [
        ...(await listFiles(path.join(repoRoot, "src/scss/mixins"), ".scss")),
        // Dev mixins are helpers, but keep them in the inventory.
        ...(await listFiles(path.join(repoRoot, "src/scss/dev"), ".scss")),
    ];
    // Classes can live in dedicated class partials *or* alongside mixins.
    const scssFiles = await listFiles(
        path.join(repoRoot, "src/scss"),
        ".scss",
    );

    /** @type {Map<string, { requiredParams: boolean, declaredIn: string }>} */
    const mixins = new Map();
    for (const filePath of mixinFiles) {
        const text = await fs.readFile(filePath, "utf8");
        // Strip comments to avoid picking up commented-out mixins.
        // We remove both line comments and block comments.
        const withoutComments = text
            .replace(/^\s*\/\/.*$/gm, "")
            .replace(/\/\*[\s\S]*?\*\//g, "");

        // Capture the mixin signature up to the opening brace.
        // Examples:
        //   @mixin alert--base {
        //   @mixin box--size($val) {
        //   @mixin dropdown--container($x: 1) {
        const mixinRe = /@mixin\s+([A-Za-z0-9_-]+)\s*(\([^)]*\))?\s*\{/g;
        for (const match of withoutComments.matchAll(mixinRe)) {
            const name = match[1];
            const params = match[2] ?? "";

            // Required param heuristic: any "$foo" without a default ":".
            // This is intentionally conservative.
            let requiredParams = false;
            if (params) {
                const inside = params.slice(1, -1).trim();
                if (inside) {
                    const parts = inside
                        .split(",")
                        .map((p) => p.trim())
                        .filter(Boolean);
                    for (const p of parts) {
                        if (!p.startsWith("$")) continue;
                        if (!p.includes(":")) {
                            requiredParams = true;
                            break;
                        }
                    }
                }
            }

            if (!mixins.has(name)) {
                mixins.set(name, { requiredParams, declaredIn: filePath });
            }
        }
    }

    const classes = new Set();
    for (const filePath of scssFiles) {
        const text = await fs.readFile(filePath, "utf8");
        // Best-effort extraction: collect .class-like tokens.
        collectMatches(classes, /\.[A-Za-z_][A-Za-z0-9_-]*/g, text, (m) =>
            m[0].slice(1),
        );
    }

    const mixinNames = [...mixins.keys()];
    const missingMixinClasses = mixinNames
        .filter((mixinName) => !classes.has(mixinName))
        .sort();

    const missingNoRequiredParams = missingMixinClasses.filter(
        (mixinName) => !mixins.get(mixinName)?.requiredParams,
    );
    const missingWithRequiredParams = missingMixinClasses.filter(
        (mixinName) => !!mixins.get(mixinName)?.requiredParams,
    );

    const shouldGenerate = process.argv.includes("--generate");

    if (shouldGenerate) {
        const outRoot = path.join(repoRoot, "src/scss/classes/mixin_coverage");
        const outJinjaPath = path.join(
            repoRoot,
            "src/jinja/test_class_coverage.html.jinja",
        );

        // Start clean to avoid leaving stale files behind.
        await fs.rm(outRoot, { recursive: true, force: true });
        await fs.mkdir(outRoot, { recursive: true });

        const allMissing = [
            ...missingNoRequiredParams,
            ...missingWithRequiredParams,
        ].sort();

        // Group mixins by declaring module, and mirror that structure under classes/mixin_coverage.
        // Example: src/scss/mixins/body_molecules/_carousel.scss ->
        //   src/scss/classes/mixin_coverage/body_molecules/carousel.scss
        const mixinsByDeclaringModule = new Map();
        for (const mixinName of allMissing) {
            const meta = mixins.get(mixinName);
            if (!meta) continue;

            const declaredIn = meta.declaredIn;
            const marker = `${path.sep}src${path.sep}scss${path.sep}`;
            const idx = declaredIn.lastIndexOf(marker);
            if (idx === -1) continue;

            const rel = declaredIn
                .slice(idx + marker.length)
                .split(path.sep)
                .join("/");
            const relNoExt = rel.replace(/\.scss$/i, "");

            if (
                !relNoExt.startsWith("mixins/") &&
                !relNoExt.startsWith("dev/")
            ) {
                continue;
            }

            // Keep underscores in the output file path to mirror src/scss/mixins.
            const key = relNoExt;
            const arr = mixinsByDeclaringModule.get(key) ?? [];
            arr.push(mixinName);
            mixinsByDeclaringModule.set(key, arr);
        }

        const writtenFiles = [];
        for (const [
            declaringModule,
            mixinNamesInFile,
        ] of mixinsByDeclaringModule.entries()) {
            const outRel = declaringModule
                .replace(/^mixins\//, "")
                .replace(/^dev\//, "dev/");

            const outFile = path.join(outRoot, `${outRel}.scss`);
            await fs.mkdir(path.dirname(outFile), { recursive: true });

            const lines = [];
            lines.push("////");
            lines.push("///");
            lines.push("/// Auto-generated mixin coverage classes");
            lines.push("///");
            lines.push(
                "/// Generated by: node bin/check_scss_coverage.mjs --generate",
            );
            lines.push("///");
            lines.push("////");
            lines.push("");

            // Import the exact module where these mixins are declared.
            // Compute a relative path from this output file to the original mixin module.
            const groupDir =
                declaringModule.startsWith("dev/") ? "dev" : "mixins";
            const moduleWithinGroup = declaringModule.replace(
                /^(mixins|dev)\//,
                "",
            );
            const moduleWithinGroupNoUnderscore = moduleWithinGroup.replace(
                /\/_/g,
                "/",
            );
            const targetAbs = path.join(
                repoRoot,
                "src/scss",
                groupDir,
                moduleWithinGroupNoUnderscore,
            );
            const relToTarget = path
                .relative(path.dirname(outFile), targetAbs)
                .split(path.sep)
                .join("/");
            lines.push(`@use \"${relToTarget}\" as src;`);
            lines.push("");

            const sorted = [...new Set(mixinNamesInFile)].sort();
            for (const mixinName of sorted) {
                const meta = mixins.get(mixinName);
                const needsParams = !!meta?.requiredParams;

                lines.push(`.${mixinName} {`);
                if (needsParams) {
                    lines.push(
                        "    // This mixin requires parameters; wrapper kept empty by default.",
                    );
                } else {
                    lines.push(`    @include src.${mixinName};`);
                }
                lines.push("}");
                lines.push("");
            }

            await fs.writeFile(outFile, lines.join("\n"), "utf8");
            writtenFiles.push(outFile);
        }

        // Write an _index.scss that forwards all generated coverage files.
        const indexLines = [];
        indexLines.push("////");
        indexLines.push("///");
        indexLines.push("/// Auto-generated mixin coverage barrel");
        indexLines.push("///");
        indexLines.push(
            "/// Generated by: node bin/check_scss_coverage.mjs --generate",
        );
        indexLines.push("///");
        indexLines.push("////");
        indexLines.push("");

        const forwardPaths = writtenFiles
            .map((p) => path.relative(outRoot, p).split(path.sep).join("/"))
            .map((p) => p.replace(/\.scss$/i, ""))
            .sort();

        for (const p of forwardPaths) {
            indexLines.push(`@forward \"${p}\";`);
        }
        indexLines.push("");

        await fs.writeFile(
            path.join(outRoot, "_index.scss"),
            indexLines.join("\n"),
            "utf8",
        );

        // Generate a Jinja demo page that references every generated class.
        const groupSize = 20;
        const chunks = [];
        for (let i = 0; i < allMissing.length; i += groupSize) {
            chunks.push(allMissing.slice(i, i + groupSize));
        }

        const jinjaLines = [];
        jinjaLines.push("");
        jinjaLines.push('{% set title = "Class Coverage" %}');
        jinjaLines.push("");
        jinjaLines.push("{%- block title %}{{ title }}{%- endblock %}");
        jinjaLines.push("");
        jinjaLines.push("{%- block content %}");
        jinjaLines.push("");
        jinjaLines.push(
            '<section class="demo__section" data-label="{{ title }}" data-level="1">',
        );
        jinjaLines.push("");
        jinjaLines.push('    <header class="demo__section__header">');
        jinjaLines.push("        <h2>{{ title }}</h2>");
        jinjaLines.push("    </header>");
        jinjaLines.push("");
        jinjaLines.push('    <section class="demo__subsection">');
        jinjaLines.push(
            "        <p>This page references auto-generated coverage classes.</p>",
        );
        jinjaLines.push("");
        jinjaLines.push('        <div aria-hidden="true">');
        for (const chunk of chunks) {
            const cls = chunk.join(" ");
            jinjaLines.push(
                `            <span class=\"${cls}\">coverage</span>`,
            );
        }
        jinjaLines.push("        </div>");
        jinjaLines.push("    </section>");
        jinjaLines.push("</section>");
        jinjaLines.push("");
        jinjaLines.push("{%- endblock content %}");
        jinjaLines.push("");

        await fs.writeFile(outJinjaPath, jinjaLines.join("\n"), "utf8");

        console.log(`Wrote ${outRoot}`);
        console.log(`Wrote ${outJinjaPath}`);
        return;
    }

    console.log(`mixins: ${mixinNames.length}`);
    console.log(`classes: ${classes.size}`);
    console.log(`missing mixin→class: ${missingMixinClasses.length}`);
    console.log(
        `missing (no required params): ${missingNoRequiredParams.length}`,
    );
    console.log(
        `missing (required params): ${missingWithRequiredParams.length}`,
    );

    if (missingNoRequiredParams.length) {
        for (const mixinName of missingNoRequiredParams) {
            console.log(mixinName);
        }
        process.exitCode = 1;
    }
}

await main();
