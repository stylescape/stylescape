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

// Tokens-only guard for modules: colours, stacking and motion must come from
// the lexicon (`--ss-color-*`, `--ss-z-*`, `--ss-duration-*`), so a module
// that slips back to a literal is flagged, including literals used as var()
// fallbacks. Also matches the literal when it sits in a `$ss-<m>-config` map
// entry whose key names a z-index or duration.
// Allowed: single-digit z-index (-9..9) for stacking inside a component's own
// stacking context, below the `--ss-z-*` scale; and `0s` (the
// `visibility 0s linear <delay>` hide pattern).
const MODULE_TOKEN_RULES = {
    "color-no-hex": true,
    "declaration-property-value-disallowed-list": [
        {
            "z-index": ["/^-?\\d{2,}$/"],
            "/^(transition|animation)(-duration|-delay)?$/": [
                "/(^|[\\s,(])(?!0+m?s\\b)\\d*\\.?\\d+m?s\\b/",
            ],
            "/^\\$/": [
                "/[\"']?z-index[\"']?\\s*:\\s*-?\\d{2,}\\s*[,)]/",
                "/(duration|delay|transition)[\"']?\\s*:\\s*(?!0+m?s\\b)\\d*\\.?\\d+m?s\\b/",
            ],
        },
        {
            message: (property, value) =>
                `Use a --ss-z-* / --ss-duration-* token instead of the literal in "${property}: ${value}"`,
        },
    ],
};

export default {
    plugins: ["@stylescape/ssx/stylelint"],
    rules: {
        "ssx/conformance": true,
    },
    overrides: [
        {
            files: ["src/scss/31-modules/**/*.scss"],
            customSyntax: "postcss-scss",
            rules: MODULE_TOKEN_RULES,
        },
    ],
    ignoreFiles: ["**/node_modules/**", "dist/**", "src/scss/01-core/**"],
};
