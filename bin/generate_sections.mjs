#!/usr/bin/env node
/**
 * generate_sections.mjs
 *
 * Auto-generates sections.json from the Jinja template folder structure.
 * This script scans the src/jinja directory and creates a navigation structure
 * based on the folder organization (atoms, molecules, organisms, etc.).
 *
 * Usage: node bin/generate_sections.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const JINJA_DIR = path.join(ROOT_DIR, "src", "jinja");
const OUTPUT_FILE = path.join(JINJA_DIR, "data", "sections.json");

/**
 * Configuration for each section folder
 * Maps folder names to display titles and sort order
 */
const SECTION_CONFIG = {
    pages: {
        title: "00. Pages",
        order: 0,
        groups: [
            { heading: "Overview", data_group: "overview" },
            { heading: "Layout", data_group: "layout" },
        ],
    },
    "12-lexicon": {
        title: "12. Lexicon",
        order: 12,
        groups: [{ heading: "Color", data_group: "color", pattern: /^color/ }],
    },
    "21-typography": {
        title: "21. Typography",
        order: 21,
        groups: [
            {
                heading: "Font",
                data_group: "typography_font",
                pattern: /^type-font/,
            },
            {
                heading: "Character",
                data_group: "typography_character",
                pattern: /^type-character/,
            },
            {
                heading: "Paragraph",
                data_group: "typography_paragraph",
                pattern: /^type-paragraph/,
            },
            {
                heading: "List",
                data_group: "typography_list",
                pattern: /^type-list/,
            },
        ],
    },
    "23-layout": {
        title: "23. Layout",
        order: 23,
        groups: [{ heading: "Layout Primitives", data_group: "layout" }],
    },
    "24-appearance": {
        title: "24. Appearance",
        order: 24,
        groups: [
            {
                heading: "Object Properties",
                data_group: "object",
                pattern: /^object/,
            },
            {
                heading: "Line & Rules",
                data_group: "line",
                pattern: /^line/,
            },
        ],
    },
    "31-modules": {
        title: "31. Modules",
        order: 31,
        groups: [
            {
                heading: "Buttons",
                data_group: "buttons",
                pattern: /^button/,
            },
            {
                heading: "Inputs & Forms",
                data_group: "inputs",
                pattern:
                    /^(input|checkbox|radio|toggle|select|dropdown|drilldown|form|formfield|label|range|textarea|switch)/,
            },
            {
                heading: "Status & Feedback",
                data_group: "status",
                pattern:
                    /^(spinner|progress|alert|toast|tooltip|popover|notification|preloader|badge|skeleton)/,
            },
            {
                heading: "Navigation",
                data_group: "navigation",
                pattern:
                    /^(nav|breadcrumb|pagination|tabs|toc|menu|sidebar|ribbon|ticker|rail|tabset)/,
            },
            {
                heading: "Cards & Content",
                data_group: "cards",
                pattern:
                    /^(card|hero|cover|blogpost|summary|figure|graphic|placeholder|preview|chip|accordion|widget)/,
            },
            {
                heading: "Media",
                data_group: "media",
                pattern:
                    /^(image|video|carousel|slideshow|iframe|map|gallery)/,
            },
            {
                heading: "Data Display",
                data_group: "data",
                pattern:
                    /^(table|timeline|timestamp|portfolio|social|address|vcard|tags-list|list-group|chat|icon|stat|kpi)/,
            },
            {
                heading: "Misc",
                data_group: "misc",
                pattern:
                    /^(box|caption|divider|spacer|cursor|dimensions|interactive|cookie|modal|callout|divider)/,
            },
        ],
    },
    typescript: {
        title: "61. TypeScript Features",
        order: 61,
        groups: [
            { heading: "Interactive Features", data_group: "typescript" },
        ],
    },
    architecture: {
        title: "90. Architecture",
        order: 90,
        groups: [
            { heading: "Architecture Reference", data_group: "architecture" },
        ],
    },
    tests: {
        title: "99. Tests",
        order: 99,
        groups: [{ heading: "Test Pages", data_group: "tests" }],
    },
};

/**
 * Converts a filename to a human-readable title
 * @param {string} filename - The template filename
 * @returns {string} Human-readable title
 */
function filenameToTitle(filename) {
    // Remove extension; strip any legacy prefixes that may still appear.
    let name = filename
        .replace(/\.html\.jinja$/, "")
        .replace(/^body_atom_/, "")
        .replace(/^body_molecule_/, "")
        .replace(/^body_organisms_/, "")
        .replace(/^soul_/, "")
        .replace(/^head_/, "")
        .replace(/^ts_/, "")
        .replace(/^test_/, "")
        .replace(/^layout_/, "")
        .replace(/^type-/, "")
        .replace(/^object-/, "")
        .replace(/^color-/, "")
        .replace(/^line-?/, "Line ");

    // Convert kebab/snake to spaced title case.
    return name
        .split(/[_-]/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/**
 * Generates a description from the filename
 * @param {string} filename - The template filename
 * @param {string} folder - The folder name
 * @returns {string} Description
 */
function filenameToDescription(filename, folder) {
    const title = filenameToTitle(filename);
    const categoryMap = {
        "12-lexicon": "Design token",
        "21-typography": "Typography token",
        "23-layout": "Layout primitive",
        "24-appearance": "Appearance token",
        "31-modules": "Module",
        typescript: "TypeScript feature",
        architecture: "Architecture reference",
        pages: "Page template",
        tests: "Test page",
    };
    return `${categoryMap[folder] || "Component"}: ${title}`;
}

/**
 * Gets the output HTML path for a template (mirrored structure)
 * @param {string} folder - The folder name
 * @param {string} filename - The template filename
 * @returns {string} Output HTML path
 */
function getOutputPath(folder, filename) {
    const htmlFilename = filename.replace(/\.jinja$/, "");
    return `/src/html/${folder}/${htmlFilename}`;
}

/**
 * Scans a folder and returns template files
 * @param {string} folderPath - Path to the folder
 * @returns {string[]} Array of template filenames
 */
function getTemplateFiles(folderPath) {
    try {
        const files = fs.readdirSync(folderPath);
        return files
            .filter((f) => f.endsWith(".html.jinja") && !f.startsWith("_"))
            .sort();
    } catch (err) {
        return [];
    }
}

/**
 * Assigns templates to groups based on patterns
 * @param {string[]} templates - Array of template filenames
 * @param {Array} groups - Group configuration with patterns
 * @param {string} folder - The folder name
 * @returns {Array} Groups with items populated
 */
function assignTemplatesToGroups(templates, groups, folder) {
    const result = groups.map((g) => ({
        heading: g.heading,
        data_group: g.data_group,
        items: [],
    }));

    const unassigned = [];

    for (const template of templates) {
        let assigned = false;

        for (let i = 0; i < groups.length; i++) {
            if (groups[i].pattern && groups[i].pattern.test(template)) {
                result[i].items.push([
                    getOutputPath(folder, template),
                    filenameToTitle(template),
                    filenameToDescription(template, folder),
                ]);
                assigned = true;
                break;
            }
        }

        if (!assigned) {
            unassigned.push(template);
        }
    }

    // Add unassigned to the first group (or last group for catch-all)
    if (unassigned.length > 0) {
        const targetGroup =
            result.find((g) => g.items.length === 0) || result[0];
        for (const template of unassigned) {
            targetGroup.items.push([
                getOutputPath(folder, template),
                filenameToTitle(template),
                filenameToDescription(template, folder),
            ]);
        }
    }

    // Remove empty groups
    return result.filter((g) => g.items.length > 0);
}

/**
 * Generates the sections.json structure
 * @returns {Object} The sections data structure
 */
function generateSections() {
    const sections = [];

    // Get all template folders
    const folders = Object.keys(SECTION_CONFIG).sort(
        (a, b) => SECTION_CONFIG[a].order - SECTION_CONFIG[b].order,
    );

    for (const folder of folders) {
        const folderPath = path.join(JINJA_DIR, folder);
        const config = SECTION_CONFIG[folder];
        const templates = getTemplateFiles(folderPath);

        if (templates.length === 0) {
            continue;
        }

        const groups = assignTemplatesToGroups(
            templates,
            config.groups,
            folder,
        );

        if (groups.length > 0) {
            sections.push({
                title: config.title,
                folder: folder,
                groups: groups,
            });
        }
    }

    return { sections };
}

/**
 * Main execution
 */
function main() {
    console.log("⌕ Scanning Jinja template folders...");

    const data = generateSections();

    // Count total templates
    let totalTemplates = 0;
    for (const section of data.sections) {
        for (const group of section.groups) {
            totalTemplates += group.items.length;
        }
    }

    console.log(
        `▤ Found ${data.sections.length} sections with ${totalTemplates} templates`,
    );

    // Generate new output
    const output = JSON.stringify(data, null, 4);

    // Only write if content has changed (prevents infinite watch loop)
    let existingContent = "";
    try {
        existingContent = fs.readFileSync(OUTPUT_FILE, "utf-8");
    } catch (err) {
        // File doesn't exist yet, will be created
    }

    if (output === existingContent) {
        console.log(`⏭  No changes detected, skipping write.`);
    } else {
        fs.writeFileSync(OUTPUT_FILE, output, "utf-8");
        console.log(`✓ Generated: ${OUTPUT_FILE}`);
    }

    // Print summary
    console.log("\n▤ Section Summary:");
    for (const section of data.sections) {
        const itemCount = section.groups.reduce(
            (sum, g) => sum + g.items.length,
            0,
        );
        console.log(`   ${section.title}: ${itemCount} templates`);
    }
}

main();
