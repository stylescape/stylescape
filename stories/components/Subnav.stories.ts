// ==========================================================================
// Stylescape | Storybook — Subnav
// ==========================================================================
// Auto-generated from src/jinja/31-modules/subnav.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Subnav",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <nav class="ss-c-subnav">
            <span class="ss-c-brand">Acme</span>
            <a href="#">Overview</a>
            <a href="#">Settings</a>
        </nav>
    `,
};
