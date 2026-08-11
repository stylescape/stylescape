// ============================================================================
// Stylescape | Storybook — Color Tokens
// ============================================================================
// Renders the `--ss-color-*` custom properties emitted at `:root` by the
// lexicon layer. Swatches read live from the cascade, so the dark-theme toolbar
// toggle re-colours them automatically.
// ============================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const TOKENS = [
    "--ss-color-background",
    "--ss-color-foreground",
    "--ss-color-surface",
    "--ss-color-muted",
    "--ss-color-border",
    "--ss-color-accent",
    "--ss-color-link",
    "--ss-color-info",
    "--ss-color-success",
    "--ss-color-warning",
    "--ss-color-error",
];

function swatch(token: string): string {
    return html`
        <div
            style="display:flex; align-items:center; gap:0.75rem; padding:0.5rem;
                   border:1px solid var(--ss-color-border, #e0e0e0); border-radius:6px;"
        >
            <span
                style="width:2.5rem; height:2.5rem; border-radius:6px; flex:none;
                       border:1px solid rgb(0 0 0 / 0.1); background:var(${token});"
            ></span>
            <code style="font-size:0.8125rem;">${token}</code>
        </div>
    `;
}

const meta: Meta = {
    title: "Foundations/Colors",
    parameters: { layout: "fullscreen" },
    render: () => html`
        <div style="padding:1.5rem; color:var(--ss-color-foreground); background:var(--ss-color-background);">
            <div
                style="display:grid; gap:0.75rem;
                       grid-template-columns:repeat(auto-fill, minmax(240px, 1fr));"
            >
                ${TOKENS.map(swatch).join("")}
            </div>
        </div>
    `,
};

export default meta;
type Story = StoryObj;

export const Palette: Story = {};
