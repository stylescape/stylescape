// ==========================================================================
// Stylescape | Storybook — Validation
// ==========================================================================
// Auto-generated from src/jinja/31-modules/validation.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Validation",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <label>Email
            <input type="email" class="ss-c-input" value="hello@example.com">
            <span class="ss-c-validation__success ss-c-validation__success--visible">Looks good.</span>
        </label>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <label>Email
            <input type="email" class="ss-c-input" value="not-an-email">
            <span class="ss-c-validation__error ss-c-validation__error--visible">Please enter a valid email.</span>
        </label>
    `,
};
