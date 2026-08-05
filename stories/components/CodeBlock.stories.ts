// ==========================================================================
// Stylescape | Storybook — Code Block
// ==========================================================================
// Auto-generated from src/jinja/31-modules/code-block.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Code Block",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <pre class="ss-c-code-block"><code>@use "stylescape" as *;</code></pre>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <pre class="ss-c-code-block"><code>.example {
            color: red;
        }</code></pre>
    `,
};
