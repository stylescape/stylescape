// ==========================================================================
// Stylescape | Storybook — Brand
// ==========================================================================
// Auto-generated from src/jinja/31-modules/brand.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Brand",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <span class="ss-c-brand">Stylescape</span>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div class="ss-c-toolbar ss-c-toolbar--between">
            <span class="ss-c-brand">Stylescape</span>
            <button class="ss-c-button">Save</button>
        </div>
    `,
};
