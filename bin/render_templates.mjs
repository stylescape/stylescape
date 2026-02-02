#!/usr/bin/env node
/**
 * render_templates.mjs
 *
 * Renders Jinja/Nunjucks templates from src/jinja to src/html,
 * preserving the folder structure (mirrored output).
 *
 * Usage: node bin/render_templates.mjs
 */

import fs from "fs";
import nunjucks from "nunjucks";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const JINJA_DIR = path.join(ROOT_DIR, "src", "jinja");
const OUTPUT_DIR = path.join(ROOT_DIR, "src", "html");
const CONTEXT_FILE = path.join(JINJA_DIR, "data", "sections.json");

/**
 * Folders to scan for templates (in render order)
 */
const TEMPLATE_FOLDERS = [
    "", // root level (base.html.jinja)
    "pages",
    "layout",
    "soul",
    "atoms",
    "molecules",
    "organisms",
    "typescript",
    "tests",
];

/**
 * Folders/files to exclude from rendering
 */
const EXCLUDE_PATTERNS = [
    "includes",
    "data",
    "_", // partial templates starting with underscore
];

/**
 * Recursively finds all template files
 * @param {string} dir - Directory to scan
 * @param {string} baseDir - Base directory for relative paths
 * @returns {Array} Array of {inputPath, outputPath, relativePath}
 */
function findTemplates(dir, baseDir = JINJA_DIR) {
    const results = [];

    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const relativePath = path.relative(baseDir, fullPath);

            // Check exclusions
            const shouldExclude = EXCLUDE_PATTERNS.some((pattern) => {
                if (pattern === "_") {
                    return entry.name.startsWith("_");
                }
                return relativePath.startsWith(pattern);
            });

            if (shouldExclude) {
                continue;
            }

            if (entry.isDirectory()) {
                results.push(...findTemplates(fullPath, baseDir));
            } else if (entry.name.endsWith(".html.jinja")) {
                const outputRelative = relativePath.replace(/\.jinja$/, "");
                results.push({
                    inputPath: fullPath,
                    outputPath: path.join(OUTPUT_DIR, outputRelative),
                    relativePath: relativePath,
                    templateName: relativePath,
                });
            }
        }
    } catch (err) {
        console.error(`Error scanning ${dir}: ${err.message}`);
    }

    return results;
}

/**
 * Loads context data from JSON files
 * @returns {Object} Combined context data
 */
function loadContext() {
    const context = {};

    try {
        const sectionsData = JSON.parse(
            fs.readFileSync(CONTEXT_FILE, "utf-8"),
        );
        Object.assign(context, sectionsData);
    } catch (err) {
        console.warn(`Warning: Could not load context file: ${err.message}`);
    }

    return context;
}

/**
 * Ensures the output directory exists
 * @param {string} filePath - Full path to the output file
 */
function ensureDir(filePath) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

/**
 * Main execution
 */
function main() {
    console.log("🔧 Initializing Nunjucks environment...");

    // Configure Nunjucks with the jinja directory as root
    const env = nunjucks.configure(JINJA_DIR, {
        autoescape: true,
        trimBlocks: true,
        lstripBlocks: true,
        noCache: true,
    });

    // Load context
    const context = loadContext();
    console.log(
        `📄 Loaded context with ${context.sections?.length || 0} sections`,
    );

    // Find all templates
    console.log("🔍 Scanning for templates...");
    const templates = findTemplates(JINJA_DIR);

    console.log(`📁 Found ${templates.length} templates to render`);

    // Track stats
    let rendered = 0;
    let skipped = 0;
    let failed = 0;
    const byFolder = {};

    // Render each template
    for (const template of templates) {
        try {
            // Ensure output directory exists
            ensureDir(template.outputPath);

            // Render template
            const html = env.render(template.templateName, context);

            // Only write if content has changed (prevents infinite watch loop)
            let existingContent = "";
            try {
                existingContent = fs.readFileSync(
                    template.outputPath,
                    "utf-8",
                );
            } catch (err) {
                // File doesn't exist yet
            }

            if (html === existingContent) {
                skipped++;
            } else {
                fs.writeFileSync(template.outputPath, html, "utf-8");
                rendered++;
            }

            // Track by folder
            const folder = path.dirname(template.relativePath) || "root";
            byFolder[folder] = (byFolder[folder] || 0) + 1;
        } catch (err) {
            console.error(
                `❌ Error rendering ${template.relativePath}: ${err.message}`,
            );
            failed++;
        }
    }

    console.log(
        `\n✅ Rendered ${rendered} templates, ${skipped} unchanged (${failed} failed)`,
    );

    // Print summary by folder
    console.log("\n📋 Templates by folder:");
    for (const [folder, count] of Object.entries(byFolder).sort()) {
        console.log(`   ${folder}: ${count}`);
    }

    if (failed > 0) {
        process.exit(1);
    }
}

main();
