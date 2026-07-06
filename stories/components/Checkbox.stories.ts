// ==========================================================================
// Stylescape | Storybook — Checkbox
// ==========================================================================
// Auto-generated from src/jinja/31-modules/checkbox.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Checkbox",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div class="ss-c-form_group">
            <label class="ss-c-label">Checkbox</label>
            <label>
                <input type="checkbox" />
                Subscribe to newsletter
            </label>
        </div>
    `,
};
