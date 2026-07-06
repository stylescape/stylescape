// ==========================================================================
// Stylescape | Storybook — Spinner
// ==========================================================================
// Auto-generated from src/jinja/31-modules/spinner.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Spinner",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div class="ss-c-spinner-demo">
            <div class="ss-c-spinner ss-c-spinner--sm"></div>
            <div class="ss-c-spinner ss-c-spinner--md"></div>
            <div class="ss-c-spinner ss-c-spinner--lg"></div>
        </div>
    `,
};
