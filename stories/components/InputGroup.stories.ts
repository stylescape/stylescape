// ==========================================================================
// Stylescape | Storybook — Input Group
// ==========================================================================
// Auto-generated from src/jinja/31-modules/input-group.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Input Group",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div class="ss-c-input-group">
            <span class="ss-c-input-group__text">@</span>
            <input type="text" class="ss-c-input" placeholder="username">
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div class="ss-c-input-group ss-c-input-group--sm">
            <span class="ss-c-input-group__text">$</span>
            <input type="text" class="ss-c-input" placeholder="0.00">
        </div>
        <div class="ss-c-input-group ss-c-input-group--lg">
            <span class="ss-c-input-group__text">https://</span>
            <input type="text" class="ss-c-input" placeholder="domain">
        </div>
    `,
};
