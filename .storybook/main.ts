// ============================================================================
// Stylescape | Storybook — Builder Configuration
// ============================================================================
// Storybook runs on the HTML + Vite framework: Stylescape is a class-based CSS
// framework (`.ss-c-*` components) with a `data-ss-*` auto-init behaviour layer,
// so stories are plain HTML markup rather than framework components.
// ============================================================================

import type { StorybookConfig } from "@storybook/html-vite";
import { NodePackageImporter } from "sass";

const config: StorybookConfig = {
    // Hand-written stories live in `stories/`. Add `../src/**/*.stories.@(js|ts)`
    // here too if you ever want to co-locate stories next to source.
    stories: [
        "../stories/**/*.mdx",
        "../stories/**/*.stories.@(js|ts)",
    ],

    addons: [
        "@storybook/addon-docs",
        "@storybook/addon-a11y",
        "@storybook/addon-themes",
    ],

    framework: {
        name: "@storybook/html-vite",
        options: {},
    },

    core: {
        // This is an open-source design framework; opt out of usage analytics.
        disableTelemetry: true,
    },

    async viteFinal(viteConfig) {
        // --------------------------------------------------------------------
        // 1. Drop the project's bespoke dev-server plugin.
        //    `vite.config.js` registers `serve-kist-html`, which shells out to
        //    `npx kist` and mounts middleware that serves `dist/html`. That is
        //    for the standalone HTML preview site, not Storybook, and it would
        //    fight Storybook's own dev server — so strip it here.
        // --------------------------------------------------------------------
        viteConfig.plugins = (viteConfig.plugins ?? []).filter((plugin) => {
            const name =
                plugin && typeof plugin === "object" && "name" in plugin
                    ? (plugin as { name?: string }).name
                    : undefined;
            return name !== "serve-kist-html";
        });

        // --------------------------------------------------------------------
        // 2. Compile Stylescape's source SCSS directly (no `dist/` build step).
        //    `unit.gl` and friends use Sass's `pkg:` package imports, so wire
        //    up the Node package importer and silence upstream deprecations so
        //    the Storybook console stays readable.
        // --------------------------------------------------------------------
        viteConfig.css ??= {};
        viteConfig.css.preprocessorOptions ??= {};
        viteConfig.css.preprocessorOptions.scss = {
            ...(viteConfig.css.preprocessorOptions.scss ?? {}),
            importers: [new NodePackageImporter()],
            quietDeps: true,
            silenceDeprecations: [
                "import",
                "global-builtin",
                "color-functions",
                "mixed-decls",
                "legacy-js-api",
                "if-function",
                "slash-div",
                "function-units",
                "abs-percent",
                "feature-exists",
                "duplicate-var-flags",
            ],
        };

        return viteConfig;
    },
};

export default config;
