// ==========================================================================
// Stylescape | Storybook — Section Title
// ==========================================================================
// Auto-generated from src/jinja/31-modules/section-title.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Section Title",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <p class="ss-c-section-title">Recent studies</p>
    `,
};
