// ==========================================================================
// Stylescape | Storybook — Radial Progress
// ==========================================================================
// Auto-generated from src/jinja/31-modules/radial-progress.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Radial Progress",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div class="ss-c-radial-progress" style="--ss-radial-value: 10; --ss-radial-size: 5em">10%</div>
        <div class="ss-c-radial-progress" style="--ss-radial-value: 33; --ss-radial-size: 5em">33%</div>
        <div class="ss-c-radial-progress" style="--ss-radial-value: 66; --ss-radial-size: 5em">66%</div>
        <div class="ss-c-radial-progress" style="--ss-radial-value: 90; --ss-radial-size: 5em">90%</div>
    `,
};
