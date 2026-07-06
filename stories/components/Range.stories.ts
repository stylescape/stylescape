// ==========================================================================
// Stylescape | Storybook — Range
// ==========================================================================
// Auto-generated from src/jinja/31-modules/range.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Range",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <input type="range" class="ss-c-range" min="0" max="100" value="50">
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <input type="range" class="ss-c-range ss-c-range--xs" min="0" max="100" value="50">
        <input type="range" class="ss-c-range ss-c-range--sm" min="0" max="100" value="50">
        <input type="range" class="ss-c-range ss-c-range--lg" min="0" max="100" value="50">
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <input type="range" class="ss-c-range ss-c-range--primary" min="0" max="100" value="50">
        <input type="range" class="ss-c-range ss-c-range--success" min="0" max="100" value="50">
        <input type="range" class="ss-c-range ss-c-range--warning" min="0" max="100" value="50">
        <input type="range" class="ss-c-range ss-c-range--error" min="0" max="100" value="50">
    `,
};
