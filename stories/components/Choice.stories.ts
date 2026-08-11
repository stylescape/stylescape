// ==========================================================================
// Stylescape | Storybook — Choice
// ==========================================================================
// Auto-generated from src/jinja/31-modules/choice.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Choice",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <label class="ss-c-choice">
            <input type="checkbox" class="ss-c-checkbox" /> Remember me
        </label>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <label class="ss-c-choice">
            <input type="radio" name="demo-choice" class="ss-c-radio" checked /> Daily
        </label>
        <label class="ss-c-choice">
            <input type="radio" name="demo-choice" class="ss-c-radio" /> Weekly
        </label>
    `,
};
