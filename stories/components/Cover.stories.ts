// ==========================================================================
// Stylescape | Storybook — Cover
// ==========================================================================
// Auto-generated from src/jinja/31-modules/cover.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Cover",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div
            class="ss-c-cover ss-c-cover--full"
            style="
                height: 400px;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            "
        >
            <div
                class="ss-c-cover__image"
                style="
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        135deg,
                        #667eea 0%,
                        #764ba2 100%
                    );
                "
            ></div>
            <div
                class="ss-c-cover__content"
                style="
                    position: relative;
                    text-align: center;
                    color: white;
                    z-index: 1;
                "
            >
                <h1
                    class="ss-c-cover__title"
                    style="font-size: 2.5rem; margin-bottom: 16px"
                >
                    Welcome to Stylescape
                </h1>
                <p
                    class="ss-c-cover__subtitle"
                    style="
                        font-size: 1.25rem;
                        opacity: 0.9;
                        margin-bottom: 24px;
                    "
                >
                    A comprehensive visual identity framework
                </p>
                <div
                    class="ss-c-cover__actions"
                    style="display: flex; gap: 12px; justify-content: center"
                >
                    <button class="ss-c-button ss-c-button--primary ss-c-button--large">
                        Get Started
                    </button>
                    <button
                        class="ss-c-button ss-c-button--secondary ss-c-button--large"
                        style="
                            background: rgba(255, 255, 255, 0.2);
                            border-color: white;
                            color: white;
                        "
                    >
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div
            class="ss-c-cover ss-c-cover--semi"
            style="
                height: 300px;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            "
        >
            <div
                class="ss-c-cover__image"
                style="
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        45deg,
                        #f093fb 0%,
                        #f5576c 100%
                    );
                "
            ></div>
            <div
                class="ss-c-cover__content"
                style="position: relative; text-align: center; color: white"
            >
                <h2
                    class="ss-c-cover__title"
                    style="font-size: 2rem; margin-bottom: 12px"
                >
                    Half-Height Cover
                </h2>
                <p class="ss-c-cover__subtitle">Perfect for secondary sections</p>
            </div>
        </div>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <div
            class="ss-c-cover"
            style="
                height: 350px;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            "
        >
            <div
                class="ss-c-cover__image"
                style="
                    position: absolute;
                    inset: 0;
                    background: url(&quot;https://via.placeholder.com/1920x1080&quot;)
                        center/cover;
                "
            ></div>
            <div
                class="ss-c-cover__overlay"
                style="
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.5);
                "
            ></div>
            <div
                class="ss-c-cover__content"
                style="position: relative; text-align: center; color: white"
            >
                <h1
                    class="ss-c-cover__title"
                    style="font-size: 2rem; margin-bottom: 12px"
                >
                    Stunning Imagery
                </h1>
                <p class="ss-c-cover__subtitle">
                    With overlay for text readability
                </p>
            </div>
        </div>
    `,
};

export const SectionTitle4: Story = {
    render: () => html`
        <div
            class="ss-c-cover ss-c-cover--centered"
            style="
                height: 350px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--color_fill_secondary);
            "
        >
            <div
                class="ss-c-cover__content"
                style="text-align: center; max-width: 600px; padding: 24px"
            >
                <span
                    class="ss-c-badge ss-c-badge--primary"
                    style="margin-bottom: 16px; display: inline-block"
                >
                    New Feature
                </span>
                <h2
                    class="ss-c-cover__title"
                    style="font-size: 2rem; margin-bottom: 12px"
                >
                    Centered Layout
                </h2>
                <p
                    class="ss-c-cover__subtitle"
                    style="margin-bottom: 24px; opacity: 0.8"
                >
                    Ideal for announcements, CTAs, and feature highlights with
                    centered content alignment.
                </p>
                <button class="ss-c-button ss-c-button--primary">Explore Now</button>
            </div>
        </div>
    `,
};
