// ==========================================================================
// Stylescape | Storybook — Dropcap
// ==========================================================================
// Auto-generated from src/jinja/31-modules/dropcap.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Dropcap",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <p class="ss-c-dropcap">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <p class="ss-c-dropcap-block">Stylescape provides a structured, layered approach to authoring scalable user interfaces.</p>
    `,
};
