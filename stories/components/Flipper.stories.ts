// ==========================================================================
// Stylescape | Storybook — Flipper
// ==========================================================================
// Auto-generated from src/jinja/31-modules/flipper.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Flipper",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <span class="ss-c-flipper ss-c-flipper--down" aria-expanded="false">
            <span class="ss-c-flipper__icon">v</span>
        </span>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <span class="ss-c-flipper ss-c-flipper--up"><span class="ss-c-flipper__icon">^</span></span>
        <span class="ss-c-flipper ss-c-flipper--down"><span class="ss-c-flipper__icon">v</span></span>
        <span class="ss-c-flipper ss-c-flipper--left"><span class="ss-c-flipper__icon"><</span></span>
        <span class="ss-c-flipper ss-c-flipper--right"><span class="ss-c-flipper__icon">></span></span>
    `,
};
