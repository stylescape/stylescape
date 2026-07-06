// ==========================================================================
// Stylescape | Storybook — Graphic
// ==========================================================================
// Auto-generated from src/jinja/31-modules/graphic.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Graphic",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div class="ss-c-graphic">
            <img src="https://picsum.photos/800/400" alt="Demo graphic" />
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div class="ss-c-graphic ss-c-graphic-elevate">
            <img src="https://picsum.photos/660/400" alt="Elevated graphic" />
        </div>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <div class="ss-c-graphic ss-c-graphic_no-margins">
            <img
                src="https://picsum.photos/800/300"
                alt="Full-width graphic"
            />
        </div>
    `,
};
