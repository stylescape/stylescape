// ==========================================================================
// Stylescape | Storybook — Rating
// ==========================================================================
// Auto-generated from src/jinja/31-modules/rating.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Rating",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div class="ss-c-rating">
            <input type="radio" name="r1" value="5"><input type="radio" name="r1" value="4">
            <input type="radio" name="r1" value="3" checked><input type="radio" name="r1" value="2"><input type="radio" name="r1" value="1">
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div class="ss-c-rating ss-c-rating--xs"><input type="radio" name="rs-xs" checked><input type="radio" name="rs-xs"><input type="radio" name="rs-xs"></div>
        <div class="ss-c-rating ss-c-rating--sm"><input type="radio" name="rs-sm" checked><input type="radio" name="rs-sm"><input type="radio" name="rs-sm"></div>
        <div class="ss-c-rating ss-c-rating--lg"><input type="radio" name="rs-lg" checked><input type="radio" name="rs-lg"><input type="radio" name="rs-lg"></div>
        <div class="ss-c-rating ss-c-rating--xl"><input type="radio" name="rs-xl" checked><input type="radio" name="rs-xl"><input type="radio" name="rs-xl"></div>
    `,
};
