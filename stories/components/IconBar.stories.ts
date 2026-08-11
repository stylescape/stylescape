// ==========================================================================
// Stylescape | Storybook — Icon Bar
// ==========================================================================
// Auto-generated from src/jinja/31-modules/icon-bar.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Icon Bar",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div class="ss-c-icon-bar--horizontal">
            <a class="active" href="#"><i class="ss-c-fa fa-home"></i></a>
            <a href="#"><i class="ss-c-fa fa-search"></i></a>
            <a href="#"><i class="ss-c-fa fa-envelope"></i></a>
            <a href="#"><i class="ss-c-fa fa-globe"></i></a>
            <a href="#"><i class="ss-c-fa fa-trash"></i></a>
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div class="ss-c-icon-bar--vertical">
            <a class="active" href="#"><i class="ss-c-fa fa-home"></i></a>
            <a href="#"><i class="ss-c-fa fa-search"></i></a>
            <a href="#"><i class="ss-c-fa fa-envelope"></i></a>
            <a href="#"><i class="ss-c-fa fa-globe"></i></a>
            <a href="#"><i class="ss-c-fa fa-trash"></i></a>
        </div>
    `,
};
