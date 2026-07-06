// ============================================================================
// Stylescape | Storybook — Preview Configuration
// ============================================================================
// Runs inside the preview iframe. Loads the framework's styles + behaviour and
// wires up global theme switching.
// ============================================================================

import type { Preview } from "@storybook/html-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";

// Stylescape styles — Vite compiles the source SCSS (see `viteFinal` in
// `main.ts`), so Storybook always reflects `src/scss/**` with HMR.
import "../src/scss/index.scss";

// Stylescape behaviour — the auto-init system scans the DOM for `data-ss-*`
// attributes and instantiates the matching component managers. A
// MutationObserver keeps newly rendered stories wired up as you navigate.
import { autoStart } from "../src/ts/index.js";

autoStart();

const preview: Preview = {
    parameters: {
        // Match the dark surface token so the canvas reads correctly in either
        // theme; the toolbar theme switch drives `data-theme` on <html>.
        backgrounds: { disable: true },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        options: {
            storySort: {
                order: [
                    "Introduction",
                    "Foundations",
                    "Components",
                    "*",
                ],
            },
        },
        a11y: {
            // Surface accessibility findings in the panel without failing CI.
            test: "todo",
        },
    },

    decorators: [
        // Toolbar control: flip `<html data-theme="light|dark">`, which is the
        // exact hook Stylescape's lexicon + dark overrides key off.
        withThemeByDataAttribute({
            themes: { light: "light", dark: "dark" },
            defaultTheme: "light",
            attributeName: "data-theme",
        }),
    ],
};

export default preview;
