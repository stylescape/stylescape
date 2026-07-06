// ==========================================================================
// Stylescape | Storybook — Dimensions
// ==========================================================================
// Auto-generated from src/jinja/31-modules/dimensions.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Dimensions",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const DimensionsTop: Story = {
    render: () => html`
        <div class="ss-c-dim ss-c-dim--top" dim-data="Dimensions on top">
            <div class="ss-c-dim__line"></div>
            Dimension Top
        </div>
    `,
};

export const DimensionsRight: Story = {
    render: () => html`
        <div class="ss-c-dim ss-c-dim--right" dim-data="Dimensions on right">
            Dimension Right
            <div class="ss-c-dim__line"></div>
        </div>
    `,
};

export const DimensionsBottom: Story = {
    render: () => html`
        <div class="ss-c-dim ss-c-dim--bottom" dim-data="Dimensions on bottom">
            Dimension Bottom
            <div class="ss-c-dim__line"></div>
        </div>
    `,
};

export const DimensionsLeft: Story = {
    render: () => html`
        <div class="ss-c-dim ss-c-dim--left" dim-data="Dimensions on left">
            <div class="ss-c-dim__line"></div>
            Dimension Left
        </div>
    `,
};
