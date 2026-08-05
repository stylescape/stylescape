// ==========================================================================
// Stylescape | Storybook — Panel
// ==========================================================================
// Auto-generated from src/jinja/31-modules/panel.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Panel",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div class="ss-c-panel">
            <div class="ss-c-panel__header">Panel header</div>
            <div class="ss-c-panel__body">Body content sits here.</div>
            <div class="ss-c-panel__footer">Footer</div>
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div class="ss-c-panel">
            <div class="ss-c-panel__header">Layers</div>
            <div class="ss-c-panel__body">The footer slot is optional.</div>
        </div>
    `,
};
