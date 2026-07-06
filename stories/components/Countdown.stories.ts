// ==========================================================================
// Stylescape | Storybook — Countdown
// ==========================================================================
// Auto-generated from src/jinja/31-modules/countdown.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Countdown",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <span class="ss-c-countdown">
            <span style="--ss-countdown-value: 23"></span>:
            <span style="--ss-countdown-value: 47"></span>:
            <span style="--ss-countdown-value: 12"></span>
        </span>
    `,
};
