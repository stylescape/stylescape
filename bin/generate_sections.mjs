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
    layout: {
        title: "01. Layout",
        order: 1,
        groups: [{ heading: "Layout & Utilities", data_group: "layout" }],
    },
    soul: {
        title: "02. Soul (Design Tokens)",
        order: 2,
        groups: [
            {
                heading: "Typography | Font",
                data_group: "typography_font",
                pattern: /soul_type_font/,
            },
            {
                heading: "Typography | Character",
                data_group: "typography_character",
                pattern: /soul_type_character/,
            },
            {
                heading: "Typography | Paragraph",
                data_group: "typography_paragraph",
                pattern: /soul_type_paragraph/,
            },
            {
                heading: "Typography | List",
                data_group: "typography_list",
                pattern: /soul_type_list/,
            },
            { heading: "Color", data_group: "color", pattern: /soul_color/ },
            {
                heading: "Object Properties",
                data_group: "object",
                pattern: /soul_object/,
            },
            {
                heading: "Line & Rules",
                data_group: "line",
                pattern: /soul_line/,
            },
        ],
    },
    atoms: {
        title: "03. Atoms",
        order: 3,
        groups: [
            { heading: "Buttons", data_group: "buttons", pattern: /button/ },
            { heading: "Inputs", data_group: "inputs", pattern: /input/ },
            {
                heading: "Status",
                data_group: "status",
                pattern: /status|spinner|progress/,
            },
            {
                heading: "Display",
                data_group: "display",
                pattern:
                    /badge|alert|tooltip|icon|box|caption|divider|spacer|tab|cursor|dimensions|interactive/,
            },
        ],
    },
    molecules: {
        title: "04. Molecules",
        order: 4,
        groups: [
            {
                heading: "Navigation",
                data_group: "navigation",
                pattern: /nav|breadcrumb|pagination|toc|dropdown/,
            },
            {
                heading: "Cards & Content",
                data_group: "cards",
                pattern:
                    /card|hero|cover|blogpost|summary|figure|graphic|placeholder|preview/,
            },
            {
                heading: "Media",
                data_group: "media",
                pattern: /image|video|carousel|slideshow|iframe|map/,
            },
            {
                heading: "Forms",
                data_group: "forms",
                pattern: /form|button_group/,
            },
            {
                heading: "Feedback",
                data_group: "feedback",
                pattern: /toast|modal|popover|cookie|preloader/,
            },
            {
                heading: "Data Display",
                data_group: "data",
                pattern:
                    /table|timeline|timestamp|portfolio|social|address|vcard|tags_list|chip|accordion|icon_bar/,
            },
        ],
    },
    organisms: {
        title: "05. Organisms",
        order: 5,
        groups: [{ heading: "Layout Components", data_group: "layout" }],
    },
    typescript: {
        title: "06. TypeScript Features",
        order: 6,
        groups: [
            { heading: "Interactive Features", data_group: "typescript" },
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
    // Remove prefix and extension
    let name = filename
        .replace(/\.html\.jinja$/, "")
        .replace(/^body_atom_/, "")
        .replace(/^body_molecule_/, "")
        .replace(/^body_organisms_/, "")
        .replace(/^soul_/, "")
        .replace(/^head_/, "")
        .replace(/^ts_/, "")
        .replace(/^test_/, "")
        .replace(/^layout_/, "");

    // Convert to title case
    return name
        .split("_")
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
        atoms: "Atomic component",
        molecules: "Molecule component",
        organisms: "Organism component",
        soul: "Design token",
        layout: "Layout utility",
        typescript: "TypeScript feature",
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
    console.log("🔍 Scanning Jinja template folders...");

    const data = generateSections();

    // Count total templates
    let totalTemplates = 0;
    for (const section of data.sections) {
        for (const group of section.groups) {
            totalTemplates += group.items.length;
        }
    }

    console.log(
        `📁 Found ${data.sections.length} sections with ${totalTemplates} templates`,
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
        console.log(`⏭️  No changes detected, skipping write.`);
    } else {
        fs.writeFileSync(OUTPUT_FILE, output, "utf-8");
        console.log(`✅ Generated: ${OUTPUT_FILE}`);
    }

    // Print summary
    console.log("\n📋 Section Summary:");
    for (const section of data.sections) {
        const itemCount = section.groups.reduce(
            (sum, g) => sum + g.items.length,
            0,
        );
        console.log(`   ${section.title}: ${itemCount} templates`);
    }
}

main();
