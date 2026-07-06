// ==========================================================================
// Stylescape | Storybook — Kbd
// ==========================================================================
// Auto-generated from src/jinja/31-modules/kbd.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Kbd",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        Press <kbd class="ss-c-kbd">Esc</kbd> to dismiss.
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <kbd class="ss-c-kbd ss-c-kbd--xs">XS</kbd>
        <kbd class="ss-c-kbd ss-c-kbd--sm">SM</kbd>
        <kbd class="ss-c-kbd">MD</kbd>
        <kbd class="ss-c-kbd ss-c-kbd--lg">LG</kbd>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <kbd class="ss-c-kbd">Ctrl</kbd> + <kbd class="ss-c-kbd">Shift</kbd> + <kbd class="ss-c-kbd">P</kbd>
    `,
};
