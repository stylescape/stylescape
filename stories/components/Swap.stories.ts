// ==========================================================================
// Stylescape | Storybook — Swap
// ==========================================================================
// Auto-generated from src/jinja/31-modules/swap.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Swap",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <label class="ss-c-swap">
            <input type="checkbox">
            <span class="ss-c-swap__on">ON</span>
            <span class="ss-c-swap__off">OFF</span>
        </label>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <label class="ss-c-swap ss-c-swap--rotate">
            <input type="checkbox">
            <span class="ss-c-swap__on">+</span>
            <span class="ss-c-swap__off">x</span>
        </label>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <label class="ss-c-swap ss-c-swap--flip">
            <input type="checkbox">
            <span class="ss-c-swap__on">&#9728;</span>
            <span class="ss-c-swap__off">&#9790;</span>
        </label>
    `,
};
