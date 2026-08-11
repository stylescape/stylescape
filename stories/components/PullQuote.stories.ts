// ==========================================================================
// Stylescape | Storybook — Pull Quote
// ==========================================================================
// Auto-generated from src/jinja/31-modules/pull-quote.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Pull Quote",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <blockquote class="ss-c-pull-quote">
            <p class="ss-c-pull-quote__text">Design systems are products that serve products.</p>
            <footer class="ss-c-pull-quote__attribution">&mdash; Nathan Curtis</footer>
        </blockquote>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <blockquote class="ss-c-pull-quote ss-c-pull-quote--elevated">
            <p class="ss-c-pull-quote__text">Constraints liberate, freedom imprisons.</p>
            <footer class="ss-c-pull-quote__attribution">&mdash; Anonymous</footer>
        </blockquote>
    `,
};
