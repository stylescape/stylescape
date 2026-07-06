// ==========================================================================
// Stylescape | Storybook — Image
// ==========================================================================
// Auto-generated from src/jinja/31-modules/image.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Image",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <figure class="ss-c-image">
            <picture class="ss-c-image__picture">
                <img
                    class="ss-c-image__img"
                    src="https://picsum.photos/800/450"
                    alt="Sample image"
                />
            </picture>
            <div class="ss-c-image__metadata">
                <figcaption class="ss-c-image__caption">
                    This is a sample image caption with a
                    <a href="#">link example</a>
                    .
                </figcaption>
                <span class="ss-c-image__credit">
                    Photo Credit: Photographer Name
                </span>
            </div>
        </figure>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <figure class="ss-c-image ss-c-image_inline-small">
            <picture class="ss-c-image__picture">
                <img
                    class="ss-c-image__img"
                    src="https://picsum.photos/400/300"
                    alt="Small inline image"
                />
            </picture>
            <div class="ss-c-image__metadata">
                <figcaption class="ss-c-image__caption">
                    A smaller inline image variant.
                </figcaption>
            </div>
        </figure>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <div class="ss-c-image__container">
            <figure class="ss-c-image">
                <img
                    class="ss-c-image__img"
                    src="https://picsum.photos/400/400"
                    alt="Contained image"
                />
            </figure>
        </div>
    `,
};
