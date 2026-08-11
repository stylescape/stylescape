// ==========================================================================
// Stylescape | Storybook — Demo
// ==========================================================================
// Auto-generated from src/jinja/31-modules/demo.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Demo",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <section class="ss-c-demo__section" data-label="Section" data-level="1">
            <header class="ss-c-demo__section__header"><h2>Section title</h2></header>
            <section class="ss-c-demo__subsection" data-label="Subsection" data-level="2">
                <h3>Subsection title</h3>
                <p>Subsection content goes here.</p>
            </section>
        </section>
    `,
};
