// ==========================================================================
// Stylescape | Storybook — Section Header
// ==========================================================================
// Auto-generated from src/jinja/31-modules/section-header.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Section Header",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div class="ss-c-section-header">
            <span class="ss-c-section-title">Recent studies</span>
            <span class="ss-c-section-count">24</span>
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div class="ss-c-section-header">
            <span class="ss-c-section-title">Archive</span>
        </div>
    `,
};
