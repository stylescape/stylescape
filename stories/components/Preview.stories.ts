// ==========================================================================
// Stylescape | Storybook — Preview
// ==========================================================================
// Auto-generated from src/jinja/31-modules/preview.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Preview",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Example: Story = {
    render: () => html`
        <h1>The quick brown fox jumps over the lazy dog.</h1>
    `,
};

export const Example2: Story = {
    render: () => html`
        <h1>The quick.</h1>
    `,
};
