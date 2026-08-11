// ==========================================================================
// Stylescape | Storybook — Join
// ==========================================================================
// Auto-generated from src/jinja/31-modules/join.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Join",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div class="ss-c-join">
            <button class="ss-c-button">One</button>
            <button class="ss-c-button">Two</button>
            <button class="ss-c-button">Three</button>
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div class="ss-c-join">
            <input type="text" class="ss-c-input" placeholder="Search">
            <button class="ss-c-button ss-c-button--primary">Go</button>
        </div>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <div class="ss-c-join ss-c-join--vertical">
            <button class="ss-c-button">Top</button>
            <button class="ss-c-button">Middle</button>
            <button class="ss-c-button">Bottom</button>
        </div>
    `,
};
