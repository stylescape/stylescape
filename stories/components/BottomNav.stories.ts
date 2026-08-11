// ==========================================================================
// Stylescape | Storybook — Bottom Nav
// ==========================================================================
// Auto-generated from src/jinja/31-modules/bottom-nav.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Bottom Nav",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <nav class="ss-c-bottom-nav" style="position:relative">
            <a class="ss-c-bottom-nav__item" href="#" aria-current="page">Home</a>
            <a class="ss-c-bottom-nav__item" href="#">Search</a>
            <a class="ss-c-bottom-nav__item" href="#">Inbox</a>
            <a class="ss-c-bottom-nav__item" href="#">Profile</a>
        </nav>
    `,
};
