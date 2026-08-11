// ==========================================================================
// Stylescape | Storybook — Headline
// ==========================================================================
// Auto-generated from src/jinja/31-modules/headline.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Headline",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <header class="ss-c-headline">
            <span class="ss-c-headline__live">LIVE</span>
            <p class="ss-c-headline__kicker">Breaking</p>
            <h2 class="ss-c-headline__text">Major update to the design system shipped today</h2>
            <p class="ss-c-headline__teaser">Stylescape 0.3.11 introduces 18 new modules and a layered cascade.</p>
            <p class="ss-c-headline__sub">
                <span class="ss-c-headline__sub-description">By Editorial</span>
                <span class="ss-c-headline__sub-description">3 min read</span>
            </p>
        </header>
    `,
};
