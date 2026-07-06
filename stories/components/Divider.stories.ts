// ==========================================================================
// Stylescape | Storybook — Divider
// ==========================================================================
// Auto-generated from src/jinja/31-modules/divider.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Divider",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <p>Above the standard divider</p>
        <hr class="ss-c-divider" />
        <p>Below the standard divider</p>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <hr class="ss-c-divider ss-c-divider--thin" />
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <hr class="ss-c-divider ss-c-divider--thick" />
    `,
};

export const SectionTitle4: Story = {
    render: () => html`
        <hr class="ss-c-divider ss-c-divider--dotted" />
    `,
};

export const SectionTitle5: Story = {
    render: () => html`
        <div class="ss-c-divider--vertical"></div>
    `,
};

export const SectionTitle6: Story = {
    render: () => html`
        <div class="ss-c-divider--vertical--thin"></div>
    `,
};

export const SectionTitle7: Story = {
    render: () => html`
        <div class="ss-c-divider--vertical--thick"></div>
    `,
};

export const SectionTitle8: Story = {
    render: () => html`
        <div class="ss-c-divider--vertical--dotted"></div>
    `,
};

export const SectionTitle9: Story = {
    render: () => html`
        <div style="display: flex; align-items: center; gap: q(16)">
            <span>Left</span>
            <span class="ss-c-divider--vertical--inline"></span>
            <span>Right</span>
        </div>
    `,
};
