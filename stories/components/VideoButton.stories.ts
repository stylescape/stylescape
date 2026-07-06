// ==========================================================================
// Stylescape | Storybook — Video Button
// ==========================================================================
// Auto-generated from src/jinja/31-modules/video-button.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Video Button",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <button type="button" class="ss-c-video-button" aria-label="Play">&#9658;</button>
    `,
};
