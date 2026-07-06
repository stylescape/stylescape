// ==========================================================================
// Stylescape | Storybook — Figure
// ==========================================================================
// Auto-generated from src/jinja/31-modules/figure.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Figure",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const FigureDefault: Story = {
    render: () => html`
        <figure>
            <img
                src="https://via.placeholder.com/600x400"
                alt="Image with title caption"
            />
            <figcaption class="ss-c-figcaption--title">Figure Title</figcaption>
            <figcaption>Standard description below the image.</figcaption>
        </figure>
    `,
};

export const FigureRounded: Story = {
    render: () => html`
        <figure class="ss-c-figure--rounded">
            <img
                src="https://via.placeholder.com/600x400"
                alt="Image with title caption"
            />
            <figcaption class="ss-c-figcaption--title">Figure Title</figcaption>
            <figcaption>Standard description below the image.</figcaption>
        </figure>
    `,
};

export const FigureAspectRatioRatio: Story = {
    render: () => html`
        <figure class="ss-c-figure--rounded">
            <div class="aspect_ratio--">
                <img
                    src="https://via.placeholder.com/1280x720"
                    alt=" Aspect Ratio"
                />
            </div>
            <figcaption class="ss-c-figcaption--title">Figure Title</figcaption>
            <figcaption>
                Image constrained to  ratio
                using utility class.
            </figcaption>
        </figure>
    `,
};
