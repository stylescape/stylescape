// ==========================================================================
// Stylescape | Storybook — State
// ==========================================================================
// Auto-generated from src/jinja/31-modules/state.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/State",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div class="ss-c-state ss-c-state--empty">
            <div class="ss-c-state__icon">&#9671;</div>
            <div class="ss-c-state__title">No studies yet</div>
            <p class="ss-c-state__message">Create your first study to get started.</p>
            <button class="ss-c-button ss-c-state__action">Create study</button>
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div class="ss-c-state ss-c-state--error" role="alert">
            <div class="ss-c-state__title">Couldn't load studies</div>
            <p class="ss-c-state__message">The network request failed.</p>
        </div>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <div class="ss-c-state">
            <span class="ss-c-spinner"></span>
            <p class="ss-c-state__message">Loading studies&hellip;</p>
        </div>
    `,
};

export const SectionTitle4: Story = {
    render: () => html`
        <div class="ss-c-state ss-c-state--inline">
            <span class="ss-c-state__icon">&#9671;</span>
            <span class="ss-c-state__message">Nothing to show.</span>
        </div>
    `,
};
