// =============================================================================
// Stylelint — SSX conformance in the editor
// =============================================================================
//
// Same spec, same rule implementations as `make parity-check`; the plugin
// reads `../ssx/spec/ssx.json` and this repo's `ssx.config.json`, so a CI
// finding is an editor squiggle and vice versa.
//
// Requires `stylelint` and `@stylescape/ssx` to be installed. Both are
// declared in package.json; see the repo notes on the current install
// failure if `npm install` does not complete.
//
// =============================================================================

export default {
    plugins: ["@stylescape/ssx/stylelint"],
    rules: {
        "ssx/conformance": true,
    },
    ignoreFiles: ["**/node_modules/**", "dist/**", "src/scss/01-core/**"],
};
