// ==========================================================================
// Stylescape | Storybook — Summary
// ==========================================================================
// Auto-generated from src/jinja/31-modules/summary.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Summary",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const DetailsSummaryComponent: Story = {
    render: () => html`
        <details class="ss-c-details">
            <summary class="ss-c-summary">Click to expand details</summary>
            <div class="ss-c-details__content">
                <p>
                    This is the hidden content that appears when the summary is
                    clicked.
                </p>
                <p>
                    You can add any elements here: text, links, or even nested
                    components.
                </p>
            </div>
        </details>
    `,
};
