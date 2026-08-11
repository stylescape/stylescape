// ==========================================================================
// Stylescape | Storybook — Stack
// ==========================================================================
// Auto-generated from src/jinja/31-modules/stack.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Stack",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div class="ss-c-stack">
            <div style="background:var(--ss-color-surface-1, #eee); padding:1em; width:8em; text-align:center">Top</div>
            <div style="background:var(--ss-color-surface-2, #ddd); padding:1em; width:8em; text-align:center">Middle</div>
            <div style="background:var(--ss-color-surface-3, #ccc); padding:1em; width:8em; text-align:center">Bottom</div>
        </div>
    `,
};
