// ==========================================================================
// Stylescape | Storybook — Image Slider
// ==========================================================================
// Auto-generated from src/jinja/31-modules/image-slider.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Image Slider",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div class="ss-c-aspect_ratio--3x2">
            <figure class="ss-c-image__compare" id="imageCompare">
                <img
                    src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1470&q=80"
                    class="ss-c-image__compare--image"
                    alt="After Image"
                    crossorigin="anonymous"
                    data-dark-side="right"
                />
                <img
                    src="https://images.unsplash.com/uploads/1412026095116d2b0c90e/3bf33993?q=80&w=3872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    class="ss-c-image__compare--overlay ss-c-image__compare--image"
                    alt="Before Image"
                    crossorigin="anonymous"
                    data-dark-side="left"
                />
                <div class="ss-c-image__compare--slider" id="slider">
                    <span class="ss-c-arrow--left"></span>
                    <span class="ss-c-arrow--right"></span>
                </div>
            </figure>
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div class="ss-c-aspect_ratio--3x2">
            <figure class="ss-c-image__compare" id="imageCompare">
                <img
                    src="https://images.unsplash.com/uploads/1412026095116d2b0c90e/3bf33993?q=80&w=3872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    class="ss-c-image__compare--image"
                    alt="Before Image"
                    crossorigin="anonymous"
                    data-dark-side="right"
                />
                <img
                    src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1470&q=80"
                    class="ss-c-image__compare--overlay ss-c-image__compare--image"
                    alt="After Image"
                    crossorigin="anonymous"
                    data-dark-side="left"
                />
                <div class="ss-c-image__compare--slider" id="slider">
                    <span class="ss-c-arrow--left"></span>
                    <span class="ss-c-arrow--right"></span>
                </div>
            </figure>
        </div>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <div class="aspect_ratio--">
            <figure class="ss-c-image__compare" id="imageCompare">
                <img
                    src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1470&q=80"
                    class="ss-c-image__compare--image"
                    alt="After Image"
                    data-dark-side="right"
                />
                <img
                    src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1470&q=80"
                    class="ss-c-image__compare--overlay ss-c-image__compare--image"
                    alt="Before Image"
                    data-dark-side="left"
                />
                <div class="ss-c-image__compare--slider" id="slider">
                    <span class="ss-c-arrow--left"></span>
                    <span class="ss-c-arrow--right"></span>
                </div>
            </figure>
        </div>
    `,
};
