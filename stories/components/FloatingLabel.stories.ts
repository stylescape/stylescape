// ==========================================================================
// Stylescape | Storybook — Floating Label
// ==========================================================================
// Auto-generated from src/jinja/31-modules/floating-label.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Floating Label",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <label class="ss-c-floating-label">
            <input type="text" class="ss-c-input" placeholder=" ">
            <span>Email address</span>
        </label>
    `,
};
