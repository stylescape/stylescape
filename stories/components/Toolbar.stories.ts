// ==========================================================================
// Stylescape | Storybook — Toolbar
// ==========================================================================
// Auto-generated from src/jinja/31-modules/toolbar.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Toolbar",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div class="ss-c-toolbar">
            <button class="ss-c-button">Open</button>
            <button class="ss-c-button">Save</button>
            <button class="ss-c-button">Export</button>
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div class="ss-c-toolbar ss-c-toolbar--between">
            <span class="ss-c-brand">Stylescape</span>
            <button class="ss-c-button">Save</button>
        </div>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <div class="ss-c-toolbar ss-c-toolbar--end">
            <button class="ss-c-button">Cancel</button>
            <button class="ss-c-button">Confirm</button>
        </div>
    `,
};
