// ==========================================================================
// Stylescape | Storybook — Scrollspy
// ==========================================================================
// Auto-generated from src/jinja/31-modules/scrollspy.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Scrollspy",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <nav class="ss-c-scrollspy">
            <ul class="ss-c-scrollspy__nav">
                <li><a href="#sec-a">Section A</a></li>
                <li><a href="#sec-b">Section B</a></li>
                <li><a href="#sec-c">Section C</a></li>
            </ul>
            <div class="ss-c-scrollspy__progress-bar"></div>
            <div class="ss-c-scrollspy__progress-dots"></div>
        </nav>
    `,
};
