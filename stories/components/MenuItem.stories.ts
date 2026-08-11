// ==========================================================================
// Stylescape | Storybook — Menu Item
// ==========================================================================
// Auto-generated from src/jinja/31-modules/menu-item.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Menu Item",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <nav class="ss-c-menu">
            <a class="ss-c-menu-item" href="#">
                <span class="ss-c-menu-item__icon">&#9642;</span>
                <span class="ss-c-menu-item__label">Dashboard</span>
            </a>
            <a class="ss-c-menu-item" href="#">
                <span class="ss-c-menu-item__icon">&#9642;</span>
                <span class="ss-c-menu-item__label">Projects</span>
            </a>
        </nav>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <nav class="ss-c-menu">
            <a class="ss-c-menu-item" href="#">
                <span class="ss-c-menu-item__label">Dashboard</span>
            </a>
            <a class="ss-c-menu-item" href="#" aria-current="page">
                <span class="ss-c-menu-item__label">Projects</span>
            </a>
        </nav>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <nav class="ss-c-menu">
            <a class="ss-c-menu-item" href="#">
                <span class="ss-c-menu-item__icon">&#9642;</span>
                <span class="ss-c-menu-item__label">Inbox</span>
                <span class="ss-c-menu-item__badge">12</span>
            </a>
        </nav>
    `,
};
