// ==========================================================================
// Stylescape | Storybook — Collapse
// ==========================================================================
// Auto-generated from src/jinja/31-modules/collapse.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Collapse",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <details class="ss-c-collapse">
            <summary>Toggle content</summary>
            <p>Collapsible region content.</p>
        </details>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <details class="ss-c-collapse ss-c-collapse--fade">
            <summary>Fade in</summary>
            <p>This content fades in.</p>
        </details>
    `,
};
