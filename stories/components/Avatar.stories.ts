// ==========================================================================
// Stylescape | Storybook — Avatar
// ==========================================================================
// Auto-generated from src/jinja/31-modules/avatar.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Avatar",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <span class="ss-c-avatar">SP</span>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <span class="ss-c-avatar ss-c-avatar--xs">XS</span>
        <span class="ss-c-avatar ss-c-avatar--sm">SM</span>
        <span class="ss-c-avatar ss-c-avatar--md">MD</span>
        <span class="ss-c-avatar ss-c-avatar--lg">LG</span>
        <span class="ss-c-avatar ss-c-avatar--xl">XL</span>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <span class="ss-c-avatar ss-c-avatar--ring">A</span>
    `,
};

export const SectionTitle4: Story = {
    render: () => html`
        <span class="ss-c-avatar ss-c-avatar--online">B</span>
        <span class="ss-c-avatar ss-c-avatar--offline">C</span>
    `,
};

export const SectionTitle5: Story = {
    render: () => html`
        <span class="ss-c-avatar ss-c-avatar--placeholder">SP</span>
    `,
};

export const SectionTitle6: Story = {
    render: () => html`
        <span class="ss-c-avatar-group">
            <span class="ss-c-avatar">A</span>
            <span class="ss-c-avatar">B</span>
            <span class="ss-c-avatar">C</span>
        </span>
    `,
};
