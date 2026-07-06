// ==========================================================================
// Stylescape | Storybook — Navbar
// ==========================================================================
// Auto-generated from src/jinja/31-modules/navbar.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Navbar",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <nav class="ss-c-navbar">
            <div class="ss-c-navbar__start">
                <strong>Stylescape</strong>
            </div>
            <div class="ss-c-navbar__center">
                <a href="#">Docs</a>
                <a href="#">Modules</a>
                <a href="#">About</a>
            </div>
            <div class="ss-c-navbar__end">
                <button class="ss-c-button ss-c-button--primary">Sign in</button>
            </div>
        </nav>
    `,
};
