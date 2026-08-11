// ==========================================================================
// Stylescape | Storybook — Close
// ==========================================================================
// Auto-generated from src/jinja/31-modules/close.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Close",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <button type="button" class="ss-c-close" aria-label="Close"></button>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <button type="button" class="ss-c-close ss-c-close--sm" aria-label="Close"></button>
        <button type="button" class="ss-c-close" aria-label="Close"></button>
        <button type="button" class="ss-c-close ss-c-close--lg" aria-label="Close"></button>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <button type="button" class="ss-c-close" aria-label="Close" disabled></button>
    `,
};
