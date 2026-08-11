// ==========================================================================
// Stylescape | Storybook — Overlay
// ==========================================================================
// Auto-generated from src/jinja/31-modules/overlay.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Overlay",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div style="position: relative; height: 260px; background: var(--ss-color-surface-2);">
            <div class="ss-c-overlay">
                <aside class="ss-c-overlay__aside ss-c-overlay__aside--left">Layers</aside>
                <aside class="ss-c-overlay__aside ss-c-overlay__aside--right">Inspector</aside>
                <div class="ss-c-overlay__bottom-center">Lon 5.29 &middot; Lat 52.13 &middot; z14</div>
            </div>
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div style="position: relative; height: 160px; background: var(--ss-color-surface-2);">
            <div class="ss-c-overlay">
                <div class="ss-c-overlay__top-center">Rendering &hellip; 62%</div>
            </div>
        </div>
    `,
};
