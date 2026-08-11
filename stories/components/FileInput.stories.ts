// ==========================================================================
// Stylescape | Storybook — File Input
// ==========================================================================
// Auto-generated from src/jinja/31-modules/file-input.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/File Input",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <input type="file" class="ss-c-file-input">
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <input type="file" class="ss-c-file-input ss-c-file-input--xs">
        <input type="file" class="ss-c-file-input ss-c-file-input--sm">
        <input type="file" class="ss-c-file-input ss-c-file-input--lg">
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <input type="file" class="ss-c-file-input ss-c-file-input--primary">
        <input type="file" class="ss-c-file-input ss-c-file-input--success">
        <input type="file" class="ss-c-file-input ss-c-file-input--error">
        <input type="file" class="ss-c-file-input ss-c-file-input--bordered">
        <input type="file" class="ss-c-file-input ss-c-file-input--ghost">
    `,
};
