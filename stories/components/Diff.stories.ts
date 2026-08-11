// ==========================================================================
// Stylescape | Storybook — Diff
// ==========================================================================
// Auto-generated from src/jinja/31-modules/diff.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Diff",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <figure class="ss-c-diff" style="--ss-diff-position: 50%; aspect-ratio: 16/9; max-width: 480px;">
            <div class="ss-c-diff__item-1">
                <img src="https://picsum.photos/seed/diff-a/480/270" alt="">
            </div>
            <div class="ss-c-diff__item-2">
                <img src="https://picsum.photos/seed/diff-b/480/270" alt="">
            </div>
            <div class="ss-c-diff__resizer"></div>
        </figure>
    `,
};
