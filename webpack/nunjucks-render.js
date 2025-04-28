
import nunjucks from "nunjucks";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatesBasePath = path.resolve(__dirname, "../exe/templates");
const nunjucksEnv = nunjucks.configure(
    templatesBasePath,
    {
        autoescape: true,
        watch: false,
        noCache: true,
    }
);

/**
 * Recursively walk template dependencies from nunjucks loader
 */
function walkTemplateDeps(loader, templateName, visited = new Set()) {
    if (visited.has(templateName)) return visited;

    visited.add(templateName);
    const template = loader.getSource(templateName);
    if (!template) return visited;

    const src = template.src;

    // Add current template path
    if (template.path) visited.add(template.path);

    // Parse {% extends %}, {% include %}, etc.
    const regex = /{%\s*(?:extends|include|import|from)\s+["']([^"']+)["']/g;
    let match;
    while ((match = regex.exec(src)) !== null) {
        walkTemplateDeps(loader, match[1], visited);
    }

    return visited;
}

export function renderTemplate(
    filename, data = {},
    compilation = null
) {
    try {
            const loader = nunjucksEnv.loaders[0]; // FileSystemLoader
            const templatePath = `pages/${filename}`;
            const html = nunjucksEnv.render(templatePath, data);

            // Let Webpack watch all referenced templates
            if (compilation && compilation.fileDependencies && loader) {
            const deps = walkTemplateDeps(loader, templatePath);
            for (const file of deps) {
                compilation.fileDependencies.add(file);
            }
        }

        return html;
    } catch (err) {
        console.error(`[Nunjucks] Failed to render template: ${filename}\n`, err);
        throw err;
    }
}


// // ============================================================================
// // Nunjucks Render Utility
// // ============================================================================

// import nunjucks from "nunjucks";
// import path from "path";
// import { fileURLToPath } from "url";

// // Resolve __dirname for ES module context
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Paths
// const templatesBasePath = path.resolve(__dirname, "../exe/templates");
// const pagesSubdir = "pages";

// // Configure Nunjucks
// const nunjucksEnv = nunjucks.configure(templatesBasePath, {
//   autoescape: true,
//   watch: false,
//   noCache: true,
// });

// /**
//  * Render a template from `exe/templates/pages` with optional Webpack HMR support.
//  *
//  * @param {string} filename - Template filename including extension.
//  * @param {object} data - Data context for Nunjucks rendering.
//  * @param {object} [compilation=null] - Optional Webpack compilation object to track file dependency.
//  * @returns {string} Rendered HTML content.
//  */
// export function renderTemplate(filename, data = {}, compilation = null) {
//   try {
//     const templatePath = path.resolve(templatesBasePath, pagesSubdir, filename);

//     // Ensure Webpack watches the file
//     if (compilation && compilation.fileDependencies) {
//       compilation.fileDependencies.add(templatePath);
//     }

//     return nunjucksEnv.render(`pages/${filename}`, data);
//   } catch (err) {
//     console.error(`[Nunjucks] Failed to render template: ${filename}\n`, err);
//     throw err;
//   }
// }
