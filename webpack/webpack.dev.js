// ============================================================================
// Imports
// ============================================================================

import fs from "fs";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import paths from "./webpack.paths.js";

import path from "path";
import { renderTemplate } from "./nunjucks-render.js";

// ============================================================================
// Constants
// ============================================================================

// Define the template directory
const templateDir = path.resolve("exe/templates/pages");

// Supported extensions in order of specificity
const validExtensions = [".html.jinja", ".jinja", ".njk"];

/**
 * Converts a filename with a supported template extension to an output `.html` filename.
 * @param {string} filename - The original template filename.
 * @returns {string} - The converted output filename.
 */
function toOutputFilename(filename) {
  for (const ext of validExtensions) {
    if (filename.endsWith(ext)) {
      return filename.replace(new RegExp(ext.replace(".", "\\.") + "$"), ".html");
    }
  }
  return filename; // fallback, though should not occur
}

/**
 * Extracts a clean name (e.g., "about") from a filename like "about.html.jinja"
 * @param {string} filename
 * @returns {string}
 */
function extractPageTitle(filename) {
  return filename.replace(/\.(html\.jinja|jinja|njk)$/, "");
}

// Read and filter all valid template files
const htmlPages = fs
  .readdirSync(templateDir)
  .filter((file) =>
    validExtensions.some((ext) => file.endsWith(ext))
  )
  .map((filename) => {
    return new HtmlWebpackPlugin({
      filename: toOutputFilename(filename),
      inject: true,

        templateContent: ({ compilation }) =>
  renderTemplate(filename, {
    title: extractPageTitle(filename),
  }, compilation)

    });
  });




// Config | Development
export const configDevelopment = {

    // Configuration | Mode
    // ========================================================================
    // Set the mode to development or production
    mode: "development",

    // Development Server Configuration
    // ========================================================================
    // Spin up a server for quick development

    devServer: {
        historyApiFallback: true, // Fallback to index.html for Single Page Applications
        // watchFiles: [ // Watch for changes in these directories
        //     paths.src + "/*",
        //     paths.public + "/*",
        // ],
        watchFiles: [
            paths.src + "/**/*",           // Watch SCSS, TS, etc.
            paths.public + "/**/*",        // Public assets
            // paths.exe + "/**/*",           // Watch SCSS, TS, etc.
            "exe/templates/**/*",          // ✅ Watch all template files
            "exe/templates/*",          // ✅ Watch all template files
            "exe/**/*",          // ✅ Watch all template files
        ],
        port: 4040,
        open: true, // Open the browser after server has been started
        compress: true, // Enable gzip compression
        hot: true, // Enable Hot Module Replacement (HMR)
        static: {
            directory: paths.public // Serve files from this directory
            // directory: paths.public + "/"
        },
    },


    // Configuration | Module Rules
    // ========================================================================

module: {
  rules: [
    {
      test: /\.(njk|jinja|html\.jinja)$/,
    //   type: "asset/resource", // or "asset/source" if you want the content
      type: "asset/source", // or "asset/source" if you want the content
      generator: {
        filename: "dummy/[name][ext]", // avoid outputting these files
      },
    },
  ],
},
    // Module rules for handling different file types.
    // Determine how modules within the project are treated.
    // module: {
    //     rules: [
    //         {
    //             test: /\.(scss|css)$/,
    //             use: [
    //                 // Injects styles into the DOM for hot reloading
    //                 "style-loader",
    //             ]
    //         },
    //     ],
    // },

    // module: {
    // rules: [
    //     {
    //     test: /\.ts$/,
    //     use: "ts-loader",
    //     exclude: /node_modules/,
    //     },
    //     {
    //     test: /\.(scss|css)$/,
    //     use: [
    //         MiniCssExtractPlugin.loader,
    //         "css-loader",
    //         "postcss-loader", // if you use it
    //         "sass-loader"
    //     ],
    //     },
    // ],
    // },

    // Plugins
    // ========================================================================
    plugins: [
        // Enable hot reloading
        // Only update what has changed on hot reload
        new webpack.HotModuleReplacementPlugin(),

        // other plugins...
        ...htmlPages,

    ],


    // Configuration | Performance
    // ========================================================================
    // Performance settings to control webpack"s hints

    // For development, you generally want to minimize build time and
    // maximize speed. Performance hints are usually not as critical in
    // development and can be turned off to reduce noise.

    performance: {
        hints: false
    },


    // Configuration | Devtool
    // ========================================================================
    // Control how source maps are generated.

    // For development, you want source maps that offer a good balance between
    // rebuild speed and quality. The eval-source-map is often recommended for
    // development:

    // Enable high-quality source maps for better debugging experience.
    devtool: "eval-source-map",
    // devtool: "inline-source-map",

};


// ============================================================================
// Exports
// ============================================================================

export default configDevelopment
