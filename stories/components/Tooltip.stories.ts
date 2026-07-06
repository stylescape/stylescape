// ==========================================================================
// Stylescape | Storybook — Tooltip
// ==========================================================================
// Auto-generated from src/jinja/31-modules/tooltip.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Tooltip",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div class="ss-c-tooltip ss-c-tooltip--top" tooltip-data="Tooltip on top">
            Hover me (Top)
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div class="ss-c-tooltip ss-c-tooltip--right" tooltip-data="Tooltip on right">
            Hover me (Right)
        </div>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <div class="ss-c-tooltip ss-c-tooltip--bottom" tooltip-data="Tooltip on bottom">
            Hover me (Bottom)
        </div>
    `,
};

export const SectionTitle4: Story = {
    render: () => html`
        <div class="ss-c-tooltip ss-c-tooltip--left" tooltip-data="Tooltip on left">
            Hover me (Left)
        </div>
    `,
};

export const SectionTitle5: Story = {
    render: () => html`
        <div
            class="ss-c-tooltip ss-c-tooltip--top ss-c-tooltip--static"
            tooltip-data="Always visible (Top)"
        >
            Static Top Tooltip
        </div>
    `,
};

export const SectionTitle6: Story = {
    render: () => html`
        <div
            class="ss-c-tooltip ss-c-tooltip--right ss-c-tooltip--static"
            tooltip-data="Always visible (Right)"
        >
            Static Right Tooltip
        </div>
    `,
};

export const SectionTitle7: Story = {
    render: () => html`
        <div
            class="ss-c-tooltip ss-c-tooltip--bottom ss-c-tooltip--static"
            tooltip-data="Always visible (Bottom)"
        >
            Static Bottom Tooltip
        </div>
    `,
};

export const SectionTitle8: Story = {
    render: () => html`
        <div
            class="ss-c-tooltip ss-c-tooltip--left ss-c-tooltip--static"
            tooltip-data="Always visible (Left)"
        >
            Static Left Tooltip
        </div>
    `,
};
