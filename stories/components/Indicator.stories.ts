// ==========================================================================
// Stylescape | Storybook — Indicator
// ==========================================================================
// Auto-generated from src/jinja/31-modules/indicator.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Indicator",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <span class="ss-c-indicator">
            <span class="ss-c-indicator__item ss-c-badge ss-c-badge--error">9+</span>
            <button type="button" class="ss-c-button">Inbox</button>
        </span>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <span class="ss-c-indicator">
            <span class="ss-c-indicator__item ss-c-indicator__item--top-start ss-c-badge">TS</span>
            <span class="ss-c-indicator__item ss-c-indicator__item--top-end ss-c-badge">TE</span>
            <span class="ss-c-indicator__item ss-c-indicator__item--bottom-start ss-c-badge">BS</span>
            <span class="ss-c-indicator__item ss-c-indicator__item--bottom-end ss-c-badge">BE</span>
            <button type="button" class="ss-c-button" style="min-width: 12em; min-height: 6em">Container</button>
        </span>
    `,
};
